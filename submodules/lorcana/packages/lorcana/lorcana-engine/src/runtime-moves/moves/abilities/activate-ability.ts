import type { CardInstanceId, PlayerId, RuntimeValidationResult } from "#core";
import type {
  ActivatedAbilityDefinition,
  LorcanaCard,
  LorcanaCardMeta,
  LorcanaMoveDefinition,
} from "../../../types";
import { createLorcanaLogProjection } from "../../../types";
import {
  analyzeActivateAbilityEffectResolutionSlots,
  analyzeEffectTargets,
  flattenNormalizedTargetSelection,
  mergeActivateAbilityEffectSelectionsToTargets,
  validateAndNormalizeTargetSelection,
} from "../../../targeting/runtime";
import { getBanishCharacterCostCandidateIds } from "./banish-character-cost-candidates";
import {
  banishAsAbilityCost,
  buildStaticContexts,
  getCardDefinition,
  validateNoPendingEffects,
} from "../../../operations";
import { resolveActionEffect } from "../../resolution/action-effects/composed-effect-resolver";
import type { ActionResolutionInput } from "../../resolution/action-effects/types";
import { payBasicCost, validateBasicCost } from "../../rules/play-card-rules";
import {
  emitTriggeredLorcanaEvent,
  flushTriggeredEventsToBag,
  queueTriggeredEvent,
} from "../../effects/triggered-abilities";
import { emitBeChosenEvents } from "../../effects/be-chosen";
import { recordBanishedCharacterThisTurn } from "../../state/turn-metrics";
import { getGrantedActivatedAbilities } from "../../rules/static-ability-utils";
import { getOrBuildMoveRegistry } from "../../rules/move-registry-cache";
import { evaluateCondition } from "../../../rules/condition-evaluator";
import { buildConditionContext } from "../../../rules/condition-context";
import { getEffectiveStrength } from "../../../rules/derived-state";
import {
  flattenSlottedTargets,
  isSlottedTargetInput,
  type SlottedTargetInput,
} from "../../../targeting/slotted-targets";

/**
 * Activated-ability target input may arrive as a flat array (legacy / client),
 * a slotted discriminated object (new multi-slot API), or undefined. This
 * helper flattens any shape into the `CardInstanceId[]` the downstream validator
 * and resolver expect, without allocating when the input is already flat.
 */
function normalizeActivateAbilityTargets(targets: unknown): CardInstanceId[] | undefined {
  if (targets === undefined) {
    return undefined;
  }
  if (isSlottedTargetInput(targets)) {
    return flattenSlottedTargets(targets).filter(
      (id): id is CardInstanceId => typeof id === "string",
    );
  }
  if (Array.isArray(targets)) {
    return targets.filter((id): id is CardInstanceId => typeof id === "string");
  }
  if (typeof targets === "string") {
    return [targets as CardInstanceId];
  }
  return undefined;
}

type ActivatedAbilityValidationContext = Parameters<
  NonNullable<LorcanaMoveDefinition<"activateAbility">["validate"]>
>[0];
type ActivatedAbilityReadableContext =
  | ActivatedAbilityValidationContext
  | Parameters<LorcanaMoveDefinition<"activateAbility">["execute"]>[0];

function getControlledCardsInPlay(
  ctx: ActivatedAbilityReadableContext,
  playerId: PlayerId,
): readonly string[] {
  return ctx.framework.zones.getCards({ zone: "play", playerId });
}

function getActivatedAbilitiesForCard(
  ctx: ActivatedAbilityReadableContext,
  cardId: CardInstanceId,
  cardDef: LorcanaCard,
): ActivatedAbilityDefinition[] {
  const printedAbilities = (cardDef.abilities ?? []).filter(
    (ability): ability is ActivatedAbilityDefinition => ability.type === "activated",
  );
  const registry = getOrBuildMoveRegistry(ctx);
  const grantedAbilities = getGrantedActivatedAbilities({
    state: ctx.framework.state,
    cardId,
    getDefinitionByInstanceId: (instanceId) => getCardDefinition(ctx, instanceId),
    registry,
  }).map((entry) => entry.ability);

  return [...printedAbilities, ...grantedAbilities];
}

function getActivatedAbilityByIndex(
  ctx: ActivatedAbilityReadableContext,
  cardId: CardInstanceId,
  cardDef: LorcanaCard,
  abilityIndex: number | undefined,
): ActivatedAbilityDefinition | undefined {
  if (!Number.isInteger(abilityIndex) || abilityIndex === undefined || abilityIndex < 0) {
    return undefined;
  }

  return getActivatedAbilitiesForCard(ctx, cardId, cardDef)[abilityIndex];
}

function getUsesPerTurn(ability: ActivatedAbilityDefinition): number | undefined {
  const rawUsesPerTurn = (ability as { usesPerTurn?: unknown }).usesPerTurn;
  if (typeof rawUsesPerTurn === "number" && Number.isFinite(rawUsesPerTurn)) {
    return rawUsesPerTurn;
  }
  const restrictions = (ability as { restrictions?: readonly { type: string }[] }).restrictions;
  if (restrictions?.some((r) => r.type === "once-per-turn")) {
    return 1;
  }
  return undefined;
}

function getAbilityUsageCount(
  meta: LorcanaCardMeta | undefined,
  abilityId: string,
  currentTurn: number,
): number {
  const recordedTurn = meta?.activatedAbilityUseTurns?.[abilityId];
  if (recordedTurn !== currentTurn) {
    return 0;
  }

  return meta?.activatedAbilityUses?.[abilityId] ?? 0;
}

function createFailure(
  error: string,
  errorCode: string,
): Extract<RuntimeValidationResult, { valid: false }> {
  return {
    valid: false,
    error,
    errorCode,
  };
}

function getRequestedExertCharacterCosts(ctx: ActivatedAbilityReadableContext): CardInstanceId[] {
  const requestedCosts = ctx.args.costs?.exertCharacters;
  if (!Array.isArray(requestedCosts)) {
    return [];
  }

  return requestedCosts.filter((cardId): cardId is CardInstanceId => typeof cardId === "string");
}

function getRequestedExertItemCosts(ctx: ActivatedAbilityReadableContext): CardInstanceId[] {
  const requestedCosts = ctx.args.costs?.exertItems;
  if (!Array.isArray(requestedCosts)) {
    return [];
  }

  return requestedCosts.filter((cardId): cardId is CardInstanceId => typeof cardId === "string");
}

function getRequiredExertItemCostCount(ability: ActivatedAbilityDefinition): number {
  const cost = ability.cost ?? {};
  if (typeof cost.exertItems === "number" && Number.isFinite(cost.exertItems)) {
    return Math.max(0, Math.floor(cost.exertItems));
  }
  return 0;
}

function getEligibleExertItemCostCards(
  ctx: ActivatedAbilityReadableContext,
  currentPlayer: PlayerId,
): CardInstanceId[] {
  return getControlledCardsInPlay(ctx, currentPlayer).filter((cardId) => {
    const definition = getCardDefinition(ctx, cardId);
    if (!definition || definition.cardType !== "item") {
      return false;
    }
    const cardMeta = ctx.cards.require(cardId).meta as LorcanaCardMeta | undefined;
    return cardMeta?.state !== "exerted";
  }) as CardInstanceId[];
}

function validateExertItemCostSelections(
  ctx: ActivatedAbilityValidationContext,
  currentPlayer: PlayerId,
  ability: ActivatedAbilityDefinition,
): RuntimeValidationResult {
  const requiredCount = getRequiredExertItemCostCount(ability);
  const requestedCosts = getRequestedExertItemCosts(ctx);

  if (requiredCount === 0) {
    if (requestedCosts.length > 0) {
      return createFailure(
        "Ability does not use exerted item costs",
        "ABILITY_COST_SELECTION_UNEXPECTED",
      );
    }
    return { valid: true };
  }

  const eligibleCosts = getEligibleExertItemCostCards(ctx, currentPlayer);
  if (eligibleCosts.length < requiredCount) {
    return createFailure(
      "Not enough eligible items in play to pay the exert cost",
      "ABILITY_COST_SELECTION_UNAVAILABLE",
    );
  }

  if (requestedCosts.length === 0) {
    if (eligibleCosts.length > requiredCount) {
      return createFailure(
        `Ability requires ${requiredCount} exert item cost selection${requiredCount === 1 ? "" : "s"}`,
        "ABILITY_COST_SELECTION_MISSING",
      );
    }
    return { valid: true };
  }

  if (requestedCosts.length !== requiredCount) {
    return createFailure(
      `Ability requires ${requiredCount} exert item cost selection${requiredCount === 1 ? "" : "s"}`,
      "ABILITY_COST_SELECTION_MISMATCH",
    );
  }

  if (new Set(requestedCosts).size !== requestedCosts.length) {
    return createFailure("Exerted item costs must be unique", "ABILITY_COST_SELECTION_DUPLICATE");
  }

  const eligibleSet = new Set(eligibleCosts);
  for (const cardId of requestedCosts) {
    if (!eligibleSet.has(cardId)) {
      return createFailure(
        "Exerted item cost must be one of your ready items in play",
        "ABILITY_COST_CARD_INVALID",
      );
    }
  }

  return { valid: true };
}

function resolveExertItemCostCards(
  ctx: ActivatedAbilityReadableContext,
  currentPlayer: PlayerId,
  ability: ActivatedAbilityDefinition,
): CardInstanceId[] {
  const requestedCosts = getRequestedExertItemCosts(ctx);
  if (requestedCosts.length > 0) {
    return requestedCosts;
  }

  const requiredCount = getRequiredExertItemCostCount(ability);
  if (requiredCount === 0) {
    return [];
  }

  return getEligibleExertItemCostCards(ctx, currentPlayer).slice(0, requiredCount);
}

function getRequestedBanishItemCosts(ctx: ActivatedAbilityReadableContext): CardInstanceId[] {
  const requestedCosts = ctx.args.costs?.banishItems;
  if (!Array.isArray(requestedCosts)) {
    return [];
  }

  return requestedCosts.filter((cardId): cardId is CardInstanceId => typeof cardId === "string");
}

function getRequestedBanishCharacterCosts(ctx: ActivatedAbilityReadableContext): CardInstanceId[] {
  const requestedCosts = ctx.args.costs?.banishCharacters;
  if (!Array.isArray(requestedCosts)) {
    return [];
  }

  return requestedCosts.filter((cardId): cardId is CardInstanceId => typeof cardId === "string");
}

function getRequiredExertCharacterCostCount(ability: ActivatedAbilityDefinition): number {
  const cost = ability.cost ?? {};
  if (typeof cost.exertCharacters === "number" && Number.isFinite(cost.exertCharacters)) {
    return Math.max(0, Math.floor(cost.exertCharacters));
  }

  return cost.exertCharacter ? 1 : 0;
}

function getRequiredBanishItemCostCount(ability: ActivatedAbilityDefinition): number {
  const banishItem = ability.cost?.banishItem;
  if (typeof banishItem === "number") {
    return Math.max(0, Math.floor(banishItem));
  }
  return banishItem ? 1 : 0;
}

function getRequiredBanishCharacterCostCount(ability: ActivatedAbilityDefinition): number {
  return ability.cost?.banishCharacter ? 1 : 0;
}

function getRequestedDiscardCardCosts(ctx: ActivatedAbilityReadableContext): CardInstanceId[] {
  const requestedCosts = ctx.args.costs?.discardCards;
  if (!Array.isArray(requestedCosts)) {
    return [];
  }

  return requestedCosts.filter((cardId): cardId is CardInstanceId => typeof cardId === "string");
}

function getEligibleBanishItemCostCards(
  ctx: ActivatedAbilityReadableContext,
  currentPlayer: PlayerId,
): CardInstanceId[] {
  return getControlledCardsInPlay(ctx, currentPlayer).filter((cardId) => {
    const definition = getCardDefinition(ctx, cardId);
    return definition?.cardType === "item";
  }) as CardInstanceId[];
}

function getEligibleBanishCharacterCostCards(
  ctx: ActivatedAbilityReadableContext,
  currentPlayer: PlayerId,
  ability: ActivatedAbilityDefinition,
  sourceCardId?: CardInstanceId,
): CardInstanceId[] {
  return getBanishCharacterCostCandidateIds(ctx, currentPlayer, ability, sourceCardId);
}

function resolveBanishItemCostCards(
  ctx: ActivatedAbilityReadableContext,
  currentPlayer: PlayerId,
  ability: ActivatedAbilityDefinition,
): CardInstanceId[] {
  const requestedCosts = getRequestedBanishItemCosts(ctx);
  if (requestedCosts.length > 0) {
    return requestedCosts;
  }

  const requiredCount = getRequiredBanishItemCostCount(ability);
  if (requiredCount === 0) {
    return [];
  }

  return getEligibleBanishItemCostCards(ctx, currentPlayer).slice(0, requiredCount);
}

function resolveBanishCharacterCostCards(
  ctx: ActivatedAbilityReadableContext,
  currentPlayer: PlayerId,
  ability: ActivatedAbilityDefinition,
  sourceCardId?: CardInstanceId,
): CardInstanceId[] {
  const requestedCosts = getRequestedBanishCharacterCosts(ctx);
  if (requestedCosts.length > 0) {
    return requestedCosts;
  }

  const requiredCount = getRequiredBanishCharacterCostCount(ability);
  if (requiredCount === 0) {
    return [];
  }

  return getEligibleBanishCharacterCostCards(ctx, currentPlayer, ability, sourceCardId).slice(
    0,
    requiredCount,
  );
}

function getRequiredDiscardCardCostCount(ability: ActivatedAbilityDefinition): number {
  const cost = ability.cost ?? {};
  const rawCount =
    typeof cost.discardCards === "number"
      ? cost.discardCards
      : typeof cost.discardCard === "number"
        ? cost.discardCard
        : typeof cost.discard?.amount === "number"
          ? cost.discard.amount
          : 0;

  return Number.isFinite(rawCount) && rawCount > 0 ? Math.floor(rawCount) : 0;
}

function getDiscardCardTypeRequirement(
  ability: ActivatedAbilityDefinition,
): "character" | "item" | "location" | "action" | "song" | undefined {
  const cost = ability.cost ?? {};
  const discardCardType =
    typeof cost.discardCardType === "string"
      ? cost.discardCardType
      : typeof cost.discard?.cardType === "string"
        ? cost.discard.cardType
        : undefined;

  return discardCardType === "song" ||
    discardCardType === "character" ||
    discardCardType === "item" ||
    discardCardType === "location" ||
    discardCardType === "action"
    ? discardCardType
    : undefined;
}

function getDiscardCardNameRequirement(ability: ActivatedAbilityDefinition): string | undefined {
  const discardCardName = ability.cost?.discardCardName;
  return typeof discardCardName === "string" && discardCardName.length > 0
    ? discardCardName
    : undefined;
}

function matchesDiscardCostRequirements(
  definition: LorcanaCard | undefined,
  ability: ActivatedAbilityDefinition,
): boolean {
  if (!definition) {
    return false;
  }

  const requiredCardType = getDiscardCardTypeRequirement(ability);
  if (requiredCardType === "song") {
    if (
      definition.cardType !== "action" ||
      (definition as { actionSubtype?: unknown }).actionSubtype !== "song"
    ) {
      return false;
    }
  } else if (requiredCardType && definition.cardType !== requiredCardType) {
    return false;
  }

  const requiredName = getDiscardCardNameRequirement(ability);
  if (requiredName && definition.name !== requiredName) {
    return false;
  }

  return true;
}

function getEligibleDiscardCostCards(
  ctx: ActivatedAbilityReadableContext,
  currentPlayer: PlayerId,
  ability: ActivatedAbilityDefinition,
): CardInstanceId[] {
  return (
    ctx.framework.zones.getCards({
      zone: "hand",
      playerId: currentPlayer,
    }) as CardInstanceId[]
  ).filter((cardId) => matchesDiscardCostRequirements(getCardDefinition(ctx, cardId), ability));
}

function resolveDiscardCostCards(
  ctx: ActivatedAbilityReadableContext,
  currentPlayer: PlayerId,
  ability: ActivatedAbilityDefinition,
): CardInstanceId[] {
  const requestedCosts = getRequestedDiscardCardCosts(ctx);
  if (requestedCosts.length > 0) {
    return requestedCosts;
  }

  const requiredCount = getRequiredDiscardCardCostCount(ability);
  if (requiredCount === 0) {
    return [];
  }

  if (ability.cost?.discardChosen === true) {
    return [];
  }

  return getEligibleDiscardCostCards(ctx, currentPlayer, ability).slice(0, requiredCount);
}

function validateBanishItemCostSelections(
  ctx: ActivatedAbilityValidationContext,
  currentPlayer: PlayerId,
  ability: ActivatedAbilityDefinition,
): RuntimeValidationResult {
  const requiredCount = getRequiredBanishItemCostCount(ability);
  const requestedCosts = getRequestedBanishItemCosts(ctx);

  if (requiredCount === 0) {
    if (requestedCosts.length > 0) {
      return createFailure(
        "Ability does not use banished item costs",
        "ABILITY_COST_SELECTION_UNEXPECTED",
      );
    }

    return { valid: true };
  }

  const eligibleCosts = getEligibleBanishItemCostCards(ctx, currentPlayer);
  if (eligibleCosts.length < requiredCount) {
    return createFailure(
      "Not enough eligible items in play to pay the banish cost",
      "ABILITY_COST_SELECTION_UNAVAILABLE",
    );
  }

  if (requestedCosts.length === 0) {
    if (eligibleCosts.length > requiredCount) {
      return createFailure(
        `Ability requires ${requiredCount} banish item cost selection${requiredCount === 1 ? "" : "s"}`,
        "ABILITY_COST_SELECTION_MISSING",
      );
    }

    return { valid: true };
  }

  if (requestedCosts.length !== requiredCount) {
    return createFailure(
      `Ability requires ${requiredCount} banish item cost selection${requiredCount === 1 ? "" : "s"}`,
      "ABILITY_COST_SELECTION_MISMATCH",
    );
  }

  if (new Set(requestedCosts).size !== requestedCosts.length) {
    return createFailure("Banished item costs must be unique", "ABILITY_COST_SELECTION_DUPLICATE");
  }

  const eligibleSet = new Set(eligibleCosts);
  for (const cardId of requestedCosts) {
    if (!eligibleSet.has(cardId)) {
      return createFailure(
        "Banished item cost must be one of your items in play",
        "ABILITY_COST_CARD_INVALID",
      );
    }
  }

  return { valid: true };
}

function validateBanishCharacterCostSelections(
  ctx: ActivatedAbilityValidationContext,
  currentPlayer: PlayerId,
  ability: ActivatedAbilityDefinition,
  sourceCardId?: CardInstanceId,
): RuntimeValidationResult {
  const requiredCount = getRequiredBanishCharacterCostCount(ability);
  const requestedCosts = getRequestedBanishCharacterCosts(ctx);

  if (requiredCount === 0) {
    if (requestedCosts.length > 0) {
      return createFailure(
        "Ability does not use banished character costs",
        "ABILITY_COST_SELECTION_UNEXPECTED",
      );
    }

    return { valid: true };
  }

  const eligibleCosts = getEligibleBanishCharacterCostCards(
    ctx,
    currentPlayer,
    ability,
    sourceCardId,
  );
  if (eligibleCosts.length < requiredCount) {
    return createFailure(
      "Not enough eligible characters in play to pay the banish cost",
      "ABILITY_COST_SELECTION_UNAVAILABLE",
    );
  }

  if (requestedCosts.length === 0) {
    if (eligibleCosts.length > requiredCount) {
      return createFailure(
        `Ability requires ${requiredCount} banish character cost selection${requiredCount === 1 ? "" : "s"}`,
        "ABILITY_COST_SELECTION_MISSING",
      );
    }

    return { valid: true };
  }

  if (requestedCosts.length !== requiredCount) {
    return createFailure(
      `Ability requires ${requiredCount} banish character cost selection${requiredCount === 1 ? "" : "s"}`,
      "ABILITY_COST_SELECTION_MISMATCH",
    );
  }

  if (new Set(requestedCosts).size !== requestedCosts.length) {
    return createFailure(
      "Banished character costs must be unique",
      "ABILITY_COST_SELECTION_DUPLICATE",
    );
  }

  const eligibleSet = new Set(eligibleCosts);
  for (const cardId of requestedCosts) {
    if (!eligibleSet.has(cardId)) {
      return createFailure(
        "Banished character cost must be one of your characters in play",
        "ABILITY_COST_CARD_INVALID",
      );
    }
  }

  return { valid: true };
}

function validateExertCharacterCostSelections(
  ctx: ActivatedAbilityValidationContext,
  currentPlayer: PlayerId,
  ability: ActivatedAbilityDefinition,
): RuntimeValidationResult {
  const requiredCount = getRequiredExertCharacterCostCount(ability);
  const requestedCosts = getRequestedExertCharacterCosts(ctx);

  if (requiredCount === 0) {
    if (requestedCosts.length > 0) {
      return createFailure(
        "Ability does not use additional exerted character costs",
        "ABILITY_COST_SELECTION_UNEXPECTED",
      );
    }
    return { valid: true };
  }

  if (requestedCosts.length !== requiredCount) {
    return createFailure(
      `Ability requires ${requiredCount} exerted character cost selection${requiredCount === 1 ? "" : "s"}`,
      "ABILITY_COST_SELECTION_MISMATCH",
    );
  }

  if (new Set(requestedCosts).size !== requestedCosts.length) {
    return createFailure(
      "Additional exerted character costs must be unique",
      "ABILITY_COST_SELECTION_DUPLICATE",
    );
  }

  const controlledCardsInPlay = new Set(getControlledCardsInPlay(ctx, currentPlayer));
  for (const cardId of requestedCosts) {
    if (!controlledCardsInPlay.has(cardId)) {
      return createFailure(
        "Additional exerted character cost must be one of your characters in play",
        "ABILITY_COST_CARD_NOT_CONTROLLED",
      );
    }

    const costCardDef = getCardDefinition(ctx, cardId);
    if (!costCardDef || costCardDef.cardType !== "character") {
      return createFailure(
        "Additional exerted character cost must be a character",
        "ABILITY_COST_CARD_TYPE_INVALID",
      );
    }

    // Check classification restriction if specified
    const requiredClassification = ability.cost?.exertCharactersClassification;
    if (requiredClassification) {
      const classifications = (costCardDef as { classifications?: string[] }).classifications ?? [];
      if (!classifications.includes(requiredClassification)) {
        return createFailure(
          `Exerted character cost must have the ${requiredClassification} classification`,
          "ABILITY_COST_CARD_CLASSIFICATION_INVALID",
        );
      }
    }

    // Check that the character is ready to be exerted
    const costCardMeta = ctx.cards.require(cardId).meta as LorcanaCardMeta | undefined;
    if (costCardMeta?.state === "exerted" || costCardMeta?.isDrying === true) {
      return createFailure(
        "Additional exerted character cost must be ready (not exerted)",
        "ABILITY_COST_CARD_NOT_READY",
      );
    }
  }

  return { valid: true };
}

function validateDiscardCardCostSelections(
  ctx: ActivatedAbilityValidationContext,
  currentPlayer: PlayerId,
  ability: ActivatedAbilityDefinition,
): RuntimeValidationResult {
  const requiredCount = getRequiredDiscardCardCostCount(ability);
  const requestedCosts = getRequestedDiscardCardCosts(ctx);

  if (requiredCount === 0) {
    if (requestedCosts.length > 0) {
      return createFailure(
        "Ability does not use discarded card costs",
        "ABILITY_COST_SELECTION_UNEXPECTED",
      );
    }
    return { valid: true };
  }

  const eligibleCosts = getEligibleDiscardCostCards(ctx, currentPlayer, ability);
  if (eligibleCosts.length < requiredCount) {
    return createFailure(
      "Not enough eligible cards in hand to pay the discard cost",
      "ABILITY_COST_SELECTION_UNAVAILABLE",
    );
  }

  if (requestedCosts.length === 0) {
    if (ability.cost?.discardChosen === true) {
      return createFailure(
        `Ability requires ${requiredCount} discard cost selection${requiredCount === 1 ? "" : "s"}`,
        "ABILITY_COST_SELECTION_MISSING",
      );
    }
    if (eligibleCosts.length > requiredCount) {
      return createFailure(
        `Ability requires ${requiredCount} discard cost selection${requiredCount === 1 ? "" : "s"}`,
        "ABILITY_COST_SELECTION_MISSING",
      );
    }
    return { valid: true };
  }

  if (requestedCosts.length !== requiredCount) {
    return createFailure(
      `Ability requires ${requiredCount} discard cost selection${requiredCount === 1 ? "" : "s"}`,
      "ABILITY_COST_SELECTION_MISMATCH",
    );
  }

  if (new Set(requestedCosts).size !== requestedCosts.length) {
    return createFailure("Discarded card costs must be unique", "ABILITY_COST_SELECTION_DUPLICATE");
  }

  const eligibleSet = new Set(eligibleCosts);
  for (const cardId of requestedCosts) {
    if (!eligibleSet.has(cardId)) {
      return createFailure(
        "Discarded card cost must be an eligible card from your hand",
        "ABILITY_COST_CARD_INVALID",
      );
    }
  }

  return { valid: true };
}

function buildExertCostCards(
  ctx: ActivatedAbilityReadableContext,
  sourceCardId: CardInstanceId,
  sourceCardDef: LorcanaCard,
  ability: ActivatedAbilityDefinition,
): {
  cardId: CardInstanceId;
  cardType?: string;
  subject?: string;
}[] {
  const cost = ability.cost ?? {};
  const exertCards: {
    cardId: CardInstanceId;
    cardType?: string;
    subject?: string;
  }[] = [];

  if (cost.exert) {
    exertCards.push({
      cardId: sourceCardId,
      cardType: sourceCardDef.cardType,
      subject: "Source card",
    });
  }

  for (const cardId of getRequestedExertCharacterCosts(ctx)) {
    const costCardDef = getCardDefinition(ctx, cardId);
    exertCards.push({
      cardId,
      cardType: costCardDef?.cardType,
      subject: "Character cost",
    });
  }

  return exertCards;
}

function buildExertItemCostCards(
  ctx: ActivatedAbilityReadableContext,
  currentPlayer: PlayerId,
  ability: ActivatedAbilityDefinition,
): CardInstanceId[] {
  return resolveExertItemCostCards(ctx, currentPlayer, ability);
}

function validateAbilityTargeting(
  ctx: ActivatedAbilityValidationContext,
  cardId: CardInstanceId,
  ability: ActivatedAbilityDefinition,
  targetsOverride?: readonly CardInstanceId[] | undefined,
): RuntimeValidationResult {
  const currentPlayer = ctx.framework.state.currentPlayer as PlayerId | undefined;
  if (!currentPlayer) {
    return createFailure("No active player", "PLAYER_CONTEXT_MISSING");
  }

  const analysis = analyzeEffectTargets(ability.effect, currentPlayer, ctx, cardId);
  const targets = targetsOverride ?? normalizeActivateAbilityTargets(ctx.args.targets);
  const selectionValidation = validateAndNormalizeTargetSelection(targets, analysis, {
    currentPlayer,
    ctx,
  });
  if (!selectionValidation.valid && selectionValidation.errorCode === "TOO_FEW_TARGETS") {
    if (
      analysis.requiresExplicitSelection ||
      analysis.allowsDeferredResolutionWithoutInitialSelection
    ) {
      return validateAndNormalizeTargetSelection(
        targets,
        {
          ...analysis,
          minSelections: 0,
        },
        {
          currentPlayer,
          ctx,
        },
      );
    }
  }
  if (!selectionValidation.valid) {
    return selectionValidation;
  }

  return { valid: true };
}

export const activateAbility: LorcanaMoveDefinition<"activateAbility"> = {
  validate: (ctx): RuntimeValidationResult => {
    const pendingFailure = validateNoPendingEffects(ctx, {
      actionLabel: "activate abilities",
    });
    if (pendingFailure) {
      return pendingFailure;
    }

    const { cardId, abilityIndex } = ctx.args;
    const currentPlayer = ctx.framework.state.currentPlayer as PlayerId | undefined;
    if (!currentPlayer) {
      return createFailure("No active player", "PLAYER_CONTEXT_MISSING");
    }

    const controlledCardsInPlay = getControlledCardsInPlay(ctx, currentPlayer);
    if (!controlledCardsInPlay.includes(cardId)) {
      return createFailure(
        "Card is not in your play zone",
        "ABILITY_CARD_NOT_CONTROLLED_OR_NOT_IN_PLAY",
      );
    }

    const cardDef = getCardDefinition(ctx, cardId);
    if (!cardDef) {
      return createFailure("Card definition not found", "CARD_NOT_FOUND");
    }

    const ability = getActivatedAbilityByIndex(
      ctx,
      cardId as CardInstanceId,
      cardDef,
      abilityIndex,
    );
    if (!ability) {
      return createFailure("Activated ability not found", "ABILITY_NOT_FOUND");
    }

    if (ability.condition !== undefined) {
      // NOTE: this site previously stripped `_zonesPrivate` and the full zone
      // API from the framework before evaluation. The canonical builder passes
      // ctx.framework through unchanged, which only enables conditions to read
      // more accurate state (zone scoping, ownership lookups). No condition
      // observed here mutates state.
      const conditionCtx = buildConditionContext({
        ctx,
        playerId: currentPlayer,
        sourceCardId: cardId as CardInstanceId,
      });
      const conditionMet = evaluateCondition(ability.condition, conditionCtx);
      if (!conditionMet) {
        return createFailure("Ability condition not met", "ABILITY_CONDITION_NOT_MET");
      }
    }

    const cardMeta = (ctx.cards.require(cardId).meta ?? {}) as LorcanaCardMeta;
    const cost = ability.cost ?? {};

    const exertCharacterCostValidation = validateExertCharacterCostSelections(
      ctx,
      currentPlayer,
      ability,
    );
    if (!exertCharacterCostValidation.valid) {
      return exertCharacterCostValidation;
    }

    const exertItemCostValidation = validateExertItemCostSelections(ctx, currentPlayer, ability);
    if (!exertItemCostValidation.valid) {
      return exertItemCostValidation;
    }

    const banishItemCostValidation = validateBanishItemCostSelections(ctx, currentPlayer, ability);
    if (!banishItemCostValidation.valid) {
      return banishItemCostValidation;
    }

    const banishCharacterCostValidation = validateBanishCharacterCostSelections(
      ctx,
      currentPlayer,
      ability,
      cardId as CardInstanceId,
    );
    if (!banishCharacterCostValidation.valid) {
      return banishCharacterCostValidation;
    }

    const discardCardCostValidation = validateDiscardCardCostSelections(
      ctx,
      currentPlayer,
      ability,
    );
    if (!discardCardCostValidation.valid) {
      return discardCardCostValidation;
    }

    const costValidation = validateBasicCost(
      {
        framework: ctx.framework,
        cards: ctx.cards,
        playerId: currentPlayer,
      },
      {
        ink: cost.ink,
        exertCards: buildExertCostCards(ctx, cardId as CardInstanceId, cardDef, ability),
      },
    );
    if (!costValidation.valid) {
      return costValidation;
    }

    const usesPerTurn = getUsesPerTurn(ability);
    if (usesPerTurn !== undefined) {
      const currentTurn = ctx.framework.state.status.turn ?? 1;
      const usageCount = getAbilityUsageCount(
        cardMeta,
        ability.id ?? `ability-${abilityIndex}`,
        currentTurn,
      );
      if (usageCount >= usesPerTurn) {
        return createFailure(
          "Ability has already been used the maximum times this turn",
          "ABILITY_USES_EXHAUSTED",
        );
      }
    }

    const slots = analyzeActivateAbilityEffectResolutionSlots(
      ability.effect,
      currentPlayer,
      ctx,
      cardId as CardInstanceId,
    );
    let effectiveTargets: CardInstanceId[] | undefined = ctx.args.targets
      ? normalizeActivateAbilityTargets(ctx.args.targets)
      : undefined;
    if (ctx.args.effectSelections) {
      const merged = mergeActivateAbilityEffectSelectionsToTargets(
        slots.map((s) => s.kind),
        ctx.args.effectSelections,
      );
      if (merged === undefined && slots.length > 0) {
        return createFailure(
          "Invalid effectSelections for this activated ability",
          "EFFECT_SELECTIONS_INVALID",
        );
      }
      if (merged !== undefined) {
        effectiveTargets = merged;
      }
    }

    return validateAbilityTargeting(ctx, cardId as CardInstanceId, ability, effectiveTargets);
  },

  execute: (ctx) => {
    const { cardId, abilityIndex } = ctx.args;
    const currentPlayer = (ctx.framework.state.currentPlayer ??
      ctx.playerId ??
      ctx.framework.state.priority.holder) as PlayerId | undefined;

    if (!currentPlayer) {
      throw new Error("activateAbility execution requires an active player");
    }

    const cardDef = getCardDefinition(ctx, cardId);
    if (!cardDef) {
      throw new Error(`Card definition not found for '${cardId}'`);
    }

    const ability = getActivatedAbilityByIndex(
      ctx,
      cardId as CardInstanceId,
      cardDef,
      abilityIndex,
    );
    if (!ability) {
      throw new Error(`Activated ability not found for '${cardId}'`);
    }

    const effectResolutionSlots = analyzeActivateAbilityEffectResolutionSlots(
      ability.effect,
      currentPlayer,
      ctx,
      cardId as CardInstanceId,
    );
    let targets: CardInstanceId[] | undefined = normalizeActivateAbilityTargets(ctx.args.targets);
    if (ctx.args.effectSelections) {
      const merged = mergeActivateAbilityEffectSelectionsToTargets(
        effectResolutionSlots.map((s) => s.kind),
        ctx.args.effectSelections,
      );
      if (merged !== undefined) {
        targets = merged;
      }
    }

    const cost = ability.cost ?? {};
    const currentMeta = (ctx.cards.require(cardId).meta ?? {}) as LorcanaCardMeta;
    const { registry, projectionState } = buildStaticContexts(ctx);
    const banishItemCostCards = resolveBanishItemCostCards(ctx, currentPlayer, ability);
    const banishCharacterCostCards = resolveBanishCharacterCostCards(
      ctx,
      currentPlayer,
      ability,
      cardId as CardInstanceId,
    );
    const discardCostCards = resolveDiscardCostCards(ctx, currentPlayer, ability);

    const exertItemCostCards = buildExertItemCostCards(ctx, currentPlayer, ability);

    // Pay basic costs (ink and exert)
    const allExertCards = [
      ...buildExertCostCards(ctx, cardId as CardInstanceId, cardDef, ability),
      ...exertItemCostCards.map((itemCardId) => ({
        cardId: itemCardId,
        cardType: getCardDefinition(ctx, itemCardId)?.cardType,
        subject: "Item cost",
      })),
    ];
    const payResult = payBasicCost(
      {
        framework: ctx.framework,
        cards: ctx.cards,
        playerId: currentPlayer,
      },
      {
        ink: cost.ink,
        exertCards: allExertCards,
      },
    );
    if (!payResult.success) {
      throw new Error(`Failed to pay ability cost: ${payResult.error} (${payResult.errorCode})`);
    }

    const exertedCostCardIds = [...new Set(allExertCards.map((entry) => entry.cardId))];
    for (const exertedCardId of exertedCostCardIds) {
      emitTriggeredLorcanaEvent(
        ctx,
        "cardExerted",
        {
          cardId: exertedCardId,
          source: ability.name ?? ability.text ?? "activated ability",
        },
        {
          event: "exert",
          subjectCardId: exertedCardId,
          triggerSourceCardId: cardId as CardInstanceId,
          playerId: ctx.framework.zones.getCardOwner(exertedCardId) as PlayerId | undefined,
        },
      );
    }

    if (discardCostCards.length > 0) {
      const triggerBatchKey = discardCostCards.join("|");
      for (const discardCardId of discardCostCards) {
        ctx.framework.zones.moveCard(discardCardId, {
          zone: "discard",
          playerId: currentPlayer,
        });
        queueTriggeredEvent(ctx, {
          event: "discard",
          playerId: currentPlayer,
          subjectCardId: discardCardId,
          triggerSourceCardId: discardCardId,
          eventSnapshot: {
            triggerAmount: discardCostCards.length,
            triggerBatchKey,
          },
        });
      }
    }

    for (const banishItemCardId of banishItemCostCards) {
      banishAsAbilityCost(ctx, {
        cardId: banishItemCardId,
        sourceId: cardId as CardInstanceId,
        playerId: currentPlayer,
      });
    }

    for (const banishCharacterCardId of banishCharacterCostCards) {
      const banishedCharacterDefinition = ctx.cards.getDefinition(banishCharacterCardId) as
        | LorcanaCard
        | undefined;
      const strengthBeforeBanish =
        banishedCharacterDefinition?.cardType === "character"
          ? getEffectiveStrength(
              banishedCharacterDefinition as any,
              projectionState,
              banishCharacterCardId,
              (id) => ctx.cards.getDefinition(id) as any,
              registry,
            )
          : undefined;
      banishAsAbilityCost(ctx, {
        cardId: banishCharacterCardId,
        sourceId: cardId as CardInstanceId,
        playerId: currentPlayer,
        strengthBeforeBanish,
      });
      recordBanishedCharacterThisTurn(ctx, banishCharacterCardId);
    }

    const currentTurn = ctx.framework.state.status.turn ?? 1;
    const abilityId = ability.id ?? `ability-${abilityIndex}`;
    const usageCount = getAbilityUsageCount(currentMeta, abilityId, currentTurn) + 1;

    // Pay banish self cost
    if (cost.banishSelf) {
      const selfStrengthBeforeBanish =
        cardDef.cardType === "character"
          ? getEffectiveStrength(
              cardDef as any,
              projectionState,
              cardId as CardInstanceId,
              (id) => ctx.cards.getDefinition(id) as any,
              registry,
            )
          : undefined;
      banishAsAbilityCost(ctx, {
        cardId: cardId as CardInstanceId,
        sourceId: cardId as CardInstanceId,
        playerId: currentPlayer,
        strengthBeforeBanish: selfStrengthBeforeBanish,
      });
      recordBanishedCharacterThisTurn(ctx, cardId as CardInstanceId);
    } else {
      ctx.cards.patchMeta(cardId, {
        activatedAbilityUses: {
          ...currentMeta.activatedAbilityUses,
          [abilityId]: usageCount,
        },
        activatedAbilityUseTurns: {
          ...currentMeta.activatedAbilityUseTurns,
          [abilityId]: currentTurn,
        },
      });
    }

    const source = {
      playerId: currentPlayer,
      cardId: cardId as CardInstanceId,
      cardType: cardDef.cardType,
      costType: "free" as const,
      inkPaid: payResult.inkPaid > 0 ? payResult.inkPaid : undefined,
    };

    // Emit ability activated event and log entry
    emitTriggeredLorcanaEvent(ctx, "abilityActivated", {
      playerId: currentPlayer,
      cardId: cardId as CardInstanceId,
      abilityName: ability.name,
      abilityIndex: abilityIndex ?? 0,
      inkPaid: payResult.inkPaid > 0 ? payResult.inkPaid : undefined,
    });
    const paidDiscardIds = discardCostCards as CardInstanceId[];
    if (paidDiscardIds.length > 0) {
      ctx.framework.log(
        ability.name
          ? createLorcanaLogProjection(
              "lorcana.ability.activated.named.discardCost",
              {
                playerId: currentPlayer,
                cardId: cardId as CardInstanceId,
                abilityName: ability.name,
                discardCardIds: paidDiscardIds,
              },
              { mode: "PUBLIC" },
              "action",
            )
          : createLorcanaLogProjection(
              "lorcana.ability.activated.discardCost",
              {
                playerId: currentPlayer,
                cardId: cardId as CardInstanceId,
                discardCardIds: paidDiscardIds,
              },
              { mode: "PUBLIC" },
              "action",
            ),
      );
    } else {
      ctx.framework.log(
        ability.name
          ? createLorcanaLogProjection(
              "lorcana.ability.activated.named",
              {
                playerId: currentPlayer,
                cardId: cardId as CardInstanceId,
                abilityName: ability.name,
              },
              { mode: "PUBLIC" },
              "action",
            )
          : createLorcanaLogProjection(
              "lorcana.ability.activated",
              {
                playerId: currentPlayer,
                cardId: cardId as CardInstanceId,
              },
              { mode: "PUBLIC" },
              "action",
            ),
      );
    }

    const analysis = analyzeEffectTargets(
      ability.effect,
      currentPlayer,
      ctx,
      cardId as CardInstanceId,
    );
    const normalizedSelection = validateAndNormalizeTargetSelection(targets, analysis, {
      currentPlayer,
      ctx,
    });
    const finalSelection =
      !normalizedSelection.valid && normalizedSelection.errorCode === "TOO_FEW_TARGETS"
        ? (() => {
            if (
              !analysis.requiresExplicitSelection &&
              !analysis.allowsDeferredResolutionWithoutInitialSelection
            ) {
              return normalizedSelection;
            }
            return validateAndNormalizeTargetSelection(
              targets,
              {
                ...analysis,
                minSelections: 0,
              },
              {
                currentPlayer,
                ctx,
              },
            );
          })()
        : normalizedSelection;
    if (!finalSelection.valid) {
      throw new Error(
        `Invalid ability targets: ${finalSelection.error} (${finalSelection.errorCode})`,
      );
    }

    const resolutionInput: ActionResolutionInput = {};
    const flattenedTargets = flattenNormalizedTargetSelection(finalSelection.selection);
    if (flattenedTargets) {
      resolutionInput.targets = flattenedTargets;
    }
    // Forward the original slotted input so slot-aware resolvers (move-damage,
    // move-to-location, etc.) can read targets by slot key instead of position.
    if (isSlottedTargetInput(ctx.args.targets)) {
      resolutionInput.slottedTargets = ctx.args.targets as SlottedTargetInput;
    }
    if (banishCharacterCostCards.length > 0) {
      resolutionInput.eventSnapshot = {
        ...resolutionInput.eventSnapshot,
        chosenCardId: banishCharacterCostCards[0],
      };
    }
    if (discardCostCards.length > 0) {
      resolutionInput.eventSnapshot = {
        ...resolutionInput.eventSnapshot,
        discardedCardIds: discardCostCards,
      };
    }
    if (ctx.args.choiceIndex !== undefined) {
      resolutionInput.choiceIndex = ctx.args.choiceIndex;
    }

    // Emit be-chosen events for targets of this activated ability
    emitBeChosenEvents(ctx, source, resolutionInput);

    const result = resolveActionEffect(ctx, source, ability.effect, resolutionInput, {
      allowPromptForExistingChosenTargets: true,
      allowSuspendWithZeroTargetCandidates: true,
    });
    if (result.status === "suspended") {
      return;
    }

    if (ability.name?.startsWith("Boost")) {
      queueTriggeredEvent(ctx, {
        event: "boost",
        playerId: currentPlayer,
        subjectCardId: cardId as CardInstanceId,
        triggerSourceCardId: cardId as CardInstanceId,
      });
    }

    flushTriggeredEventsToBag(ctx);
  },
};
