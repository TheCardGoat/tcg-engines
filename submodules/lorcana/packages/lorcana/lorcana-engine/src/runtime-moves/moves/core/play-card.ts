// .agents/skills/lorcana-rules/SKILL.md
// .agents/skills/lorcana-rules/indexes/by-topic/turn-actions.md

import type {
  CardInstanceId,
  MoveEnumerationContext,
  MoveInput,
  MoveValidationContext,
  PlayerId,
  RuntimeValidationResult,
} from "#core";
import { getLogger } from "@logtape/logtape";
import type {
  ActionAbilityDefinition,
  Condition,
  KeywordAbilityDefinition,
  LorcanaCard,
  LorcanaCardDefinition,
} from "@tcg/lorcana-types";
import { createLorcanaLogProjection } from "../../../types";
import type {
  CardPlayedPayload,
  Classification,
  LorcanaCardMeta,
  LorcanaG,
  LorcanaMatchState,
  LorcanaMoveDefinition,
  LorcanaRuntimeMoveInputs,
} from "../../../types";
import {
  analyzeEffectTargets,
  analyzeTargetSelectionAvailabilityFromAnalysis,
  flattenNormalizedTargetSelection,
  normalizeTargetDescriptor,
  resolveCandidateTargets,
  resolveEffectTargets,
  resolveTargetPlayerIds,
  validateAndNormalizeTargetSelection,
  type ActionTargetResolutionContext,
  type ActionSelectionZone,
  type TargetAnalysis,
} from "../../../targeting/targeting-service";
import {
  getAvailableInk,
  getShiftRules,
  getSingTogetherThreshold,
  getSingerThresholdForInstance,
  getSingerThreshold,
  isReadyAndNotDrying,
  isSongCard,
  payBasicCost,
  resolveShiftTargetCandidates,
  validateBasicCost,
  type ShiftDiscardCost,
} from "../../rules/play-card-rules";
import { executeShiftPlay } from "../../shared/execute-shift-play";
import { recomputeLoreToWin } from "../../effects/win-condition-effects";
import { recordDiscardExitThisTurn } from "../../state/turn-metrics";
import { resolveActionCardEffects } from "../../resolution/action-effect-resolver";
import type { ActionResolutionInput } from "../../resolution/action-effects/types";
import {
  flattenSlottedTargets,
  isSlottedTargetInput,
  type SlottedTargetInput,
} from "../../../targeting/slotted-targets";
import {
  finalizeResolvedActionCard,
  hasPendingActionEffectResolution,
  moveSuspendedActionCardToLimbo,
  EFFECT_PENDING_ERROR_CODE,
} from "../../resolution/action-effects/pending-action-effects";
import { getEntersWithDamageAmount } from "../../resolution/action-effects/play-card-effect";
import {
  hasTemporaryPlayerRestriction,
  hasTemporaryRestriction,
} from "../../effects/temporary-effects";
import {
  emitTriggeredLorcanaEvent,
  flushTriggeredEventsToBag,
  hasPendingBagItems,
  snapshotTriggeredCandidatesForCard,
} from "../../effects/triggered-abilities";
import {
  createProjectionState,
  getAppliedCostReductions,
  getPendingCostReductions,
  getStaticCostIncreaseAmount,
  deriveStrength,
  type CostReductionApplication,
  type DerivedStateContext,
} from "../../../rules/derived-state";
import {
  formatLorcanaCardName,
  formatLorcanaPlayerLabel,
  getLorcanaCardName,
  traceLorcanaRuntimeStep,
} from "../../../runtime-trace";
import { hasBodyguard, hasMayEnterPlayExertedOption } from "../../../card-utils";
import {
  evaluateStaticCondition,
  hasOpponentStaticPlayRestriction,
  hasStaticCardRestriction,
} from "../../rules/static-ability-utils";
import { getOrBuildMoveRegistry } from "../../rules/move-registry-cache";
import type { StaticEffectRegistry } from "../../../rules/static-effect-registry";
import { getActivePlayFromUnderPermissions } from "../../effects/play-from-under-permissions";
import { banishAsAbilityCost } from "../../../operations";
import { getLegalChoiceOptionIndices } from "../../resolution/action-effects/composed-effect-resolver";

function validateInitialActionTargetSelection(
  effectOrAbility: unknown,
  targets: unknown,
  analysis: TargetAnalysis,
  context: {
    currentPlayer: PlayerId;
    ctx: MoveValidationContext<MoveInput> | PlayCardExecutionContext;
  },
) {
  const selectionValidation = validateAndNormalizeTargetSelection(targets, analysis, context);
  if (selectionValidation.valid || selectionValidation.errorCode !== "TOO_FEW_TARGETS") {
    return selectionValidation;
  }

  // Initial action resolution may defer target choice to a later prompt or
  // auto-reject the targeted step if no legal target selection exists.
  analyzeTargetSelectionAvailabilityFromAnalysis(effectOrAbility, analysis);

  return validateAndNormalizeTargetSelection(
    targets,
    {
      ...analysis,
      minSelections: 0,
    },
    context,
  );
}

function appendUniqueLogTargets(
  targets: Array<CardInstanceId | PlayerId>,
  nextTargets: readonly (CardInstanceId | PlayerId)[] | undefined,
): void {
  if (!nextTargets || nextTargets.length === 0) {
    return;
  }

  const seen = new Set(targets);
  for (const targetId of nextTargets) {
    if (seen.has(targetId)) {
      continue;
    }

    seen.add(targetId);
    targets.push(targetId);
  }
}

function getSelectedPlayerTargets(
  ctx: Pick<PlayCardExecutionContext, "framework">,
  resolutionInput: Pick<ActionResolutionInput, "targets">,
): PlayerId[] | undefined {
  const playerIds = new Set(ctx.framework.state.playerIds as PlayerId[]);
  const rawTargets = Array.isArray(resolutionInput.targets)
    ? resolutionInput.targets
    : resolutionInput.targets !== undefined
      ? [resolutionInput.targets]
      : [];
  const selectedPlayerTargets = rawTargets.filter(
    (targetId): targetId is PlayerId =>
      typeof targetId === "string" && playerIds.has(targetId as PlayerId),
  );

  return selectedPlayerTargets.length > 0 ? selectedPlayerTargets : undefined;
}

function collectImmediateActionLogTargetsForEffect(
  effect: unknown,
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  resolutionInput: ActionResolutionInput,
): Array<CardInstanceId | PlayerId> {
  if (!effect || typeof effect !== "object") {
    return [];
  }

  const effectRecord = effect as Record<string, unknown>;
  const effectType = effectRecord.type;

  if (effectType === "sequence") {
    const sequenceSteps = Array.isArray(effectRecord.steps)
      ? effectRecord.steps
      : Array.isArray(effectRecord.effects)
        ? effectRecord.effects
        : [];
    return sequenceSteps.flatMap((step) =>
      collectImmediateActionLogTargetsForEffect(step, ctx, cardPlayed, resolutionInput),
    );
  }

  if (effectType === "choice" || effectType === "or") {
    const options = Array.isArray(effectRecord.options)
      ? effectRecord.options
      : Array.isArray(effectRecord.choices)
        ? effectRecord.choices
        : [];
    if (
      typeof resolutionInput.choiceIndex !== "number" ||
      resolutionInput.choiceIndex < 0 ||
      resolutionInput.choiceIndex >= options.length
    ) {
      return [];
    }

    return collectImmediateActionLogTargetsForEffect(
      options[resolutionInput.choiceIndex],
      ctx,
      cardPlayed,
      resolutionInput,
    );
  }

  if (effectType === "optional") {
    if (resolutionInput.resolveOptional !== true) {
      return [];
    }

    return collectImmediateActionLogTargetsForEffect(
      effectRecord.effect,
      ctx,
      cardPlayed,
      resolutionInput,
    );
  }

  if (effectType === "for-each") {
    return collectImmediateActionLogTargetsForEffect(
      effectRecord.effect,
      ctx,
      cardPlayed,
      resolutionInput,
    );
  }

  if (!("target" in effectRecord)) {
    return [];
  }

  const logTargets: Array<CardInstanceId | PlayerId> = [];
  appendUniqueLogTargets(
    logTargets,
    resolveEffectTargets(
      ctx,
      cardPlayed,
      effectRecord.target,
      resolutionInput.targets,
      resolutionInput.eventSnapshot,
    ),
  );
  appendUniqueLogTargets(
    logTargets,
    resolveTargetPlayerIds(ctx, effectRecord.target, {
      controllerId: cardPlayed.playerId,
      selectedPlayerIds: getSelectedPlayerTargets(ctx, resolutionInput),
      sourceCardId: cardPlayed.cardId,
    }),
  );

  return logTargets;
}

function collectImmediateActionLogTargets(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  actionCard: Extract<LorcanaCard, { cardType: "action" }>,
  resolutionInput: ActionResolutionInput,
): Array<CardInstanceId | PlayerId> {
  const targets: Array<CardInstanceId | PlayerId> = [];

  for (const ability of actionCard.abilities ?? []) {
    if (ability.type !== "action") {
      continue;
    }

    appendUniqueLogTargets(
      targets,
      collectImmediateActionLogTargetsForEffect(ability.effect, ctx, cardPlayed, resolutionInput),
    );
  }

  return targets;
}

/**
 * Check if a card has an action ability that represents a sacrifice-based alternative cost.
 * Pattern: "you may banish chosen item of yours to play this character for free"
 * Modeled as: action ability with `alternativeCost: "sacrifice-item"` property.
 */
function getSacrificeAlternativeCostAbility(
  cardDef: LorcanaCard,
): ActionAbilityDefinition | undefined {
  return cardDef.abilities?.find(
    (ability): ability is ActionAbilityDefinition =>
      ability.type === "action" &&
      "alternativeCost" in ability &&
      ability.alternativeCost === "sacrifice-item",
  );
}

/**
 * Check if a card has an action ability that represents an exert-based alternative cost.
 * Pattern: "you may exert 4 items of yours to play this character for free"
 * Modeled as: action ability with `alternativeCost: "exert-4-items"` property.
 */
function getExertItemsAlternativeCostAbility(
  cardDef: LorcanaCard,
): ActionAbilityDefinition | undefined {
  return cardDef.abilities?.find(
    (ability): ability is ActionAbilityDefinition =>
      ability.type === "action" &&
      "alternativeCost" in ability &&
      ability.alternativeCost === "exert-4-items",
  );
}

/**
 * Check if a card has an action ability that represents a "put a Toy character card
 * from your discard on the bottom of your deck" alternative cost.
 * Pattern: "You may put a Toy character card from your discard on the bottom of your deck
 * to play this character for free."
 * Modeled as: action ability with `alternativeCost: "put-toy-character-on-deck-bottom"` property.
 */
function getPutToyOnDeckBottomAlternativeCostAbility(
  cardDef: LorcanaCard,
): ActionAbilityDefinition | undefined {
  return cardDef.abilities?.find(
    (ability): ability is ActionAbilityDefinition =>
      ability.type === "action" &&
      "alternativeCost" in ability &&
      ability.alternativeCost === "put-toy-character-on-deck-bottom",
  );
}

function getZoneFromZoneKey(zoneKey: string | undefined): string | undefined {
  if (!zoneKey) {
    return undefined;
  }

  return zoneKey.includes(":") ? zoneKey.split(":", 1)[0] : zoneKey;
}

function entersPlayExerted(
  ctx: PlayCardExecutionContext,
  cardId: CardInstanceId,
  cardDef: LorcanaCard,
): boolean {
  const currentPlayer = ctx.framework.state.currentPlayer as PlayerId | undefined;
  if (!currentPlayer) {
    return false;
  }

  const staticAbilityState = {
    priority: ctx.framework.state.priority,
    status: ctx.framework.state.status,
    _zonesPrivate: ctx.framework.state._zonesPrivate,
    G: ctx.G,
  };
  const getDefinitionByInstanceId = (instanceId: string) =>
    ctx.cards.getDefinition(instanceId) as LorcanaCard | undefined;
  // Section 3 ensures `staticEffectsVersion` is bumped on every static-relevant
  // mutation, so the cached registry is current here. Previous fresh-build
  // workaround removed.
  const registry = getOrBuildMoveRegistry(ctx);

  // Check the card's own static self-restriction (e.g., "this character enters play exerted")
  const selfRestricted = (cardDef.abilities ?? []).some((ability) => {
    if (
      ability.type !== "static" ||
      ability.effect.type !== "restriction" ||
      ability.effect.restriction !== "enters-play-exerted" ||
      ability.effect.target !== "SELF"
    ) {
      return false;
    }

    return evaluateStaticCondition({
      condition: ability.condition,
      state: staticAbilityState,
      controllerId: currentPlayer,
      sourceId: cardId,
      getDefinitionByInstanceId,
    });
  });

  if (selfRestricted) {
    return true;
  }

  // Check if any card in any opponent's play zone has a static ability that forces
  // this card to enter play exerted (e.g., Figaro - Tuxedo Cat: "Opposing items enter play exerted.")
  return hasStaticCardRestriction({
    state: staticAbilityState,
    cardId,
    restriction: "enters-play-exerted",
    registry,
  });
}

function getConditionalShiftAbility(cardDef: LorcanaCard): KeywordAbilityDefinition | undefined {
  return cardDef.abilities?.find(
    (ability): ability is KeywordAbilityDefinition =>
      ability.type === "keyword" && ability.keyword === "Shift" && "condition" in ability,
  );
}

function canUseShiftAbility(
  ctx: MoveValidationContext<MoveInput>,
  cardId: CardInstanceId,
  cardDef: LorcanaCard,
  controllerId: PlayerId,
): boolean {
  const shiftAbility = getConditionalShiftAbility(cardDef) as
    | (KeywordAbilityDefinition & { condition?: Condition })
    | undefined;
  if (!shiftAbility?.condition) {
    return true;
  }

  return evaluateStaticCondition({
    condition: shiftAbility.condition,
    state: {
      priority: ctx.framework.state.priority,
      status: ctx.framework.state.status,
      _zonesPrivate: ctx.framework.state._zonesPrivate,
      G: ctx.G,
    },
    controllerId,
    sourceId: cardId,
    getDefinitionByInstanceId: (instanceId) => getCardDefinitionFromContext(ctx, instanceId),
  });
}

/**
 * Validate that the discard cards provided for a shift-discard cost are valid.
 * Checks that the right number of cards are provided, they are in the player's hand,
 * and they match the required card type.
 */
function validateShiftDiscardCost(
  ctx: MoveValidationContext<MoveInput>,
  discardCost: ShiftDiscardCost,
  discardCards: readonly CardInstanceId[] | undefined,
  playerId: PlayerId,
  isPreflight: boolean,
): { valid: true } | { valid: false; error: string; errorCode: string } {
  if (isPreflight && !discardCards) {
    return { valid: true };
  }

  if (!discardCards || discardCards.length < discardCost.discardCards) {
    return {
      valid: false,
      error: `Shift requires discarding ${discardCost.discardCards} ${discardCost.discardCardType ?? "card"}(s)`,
      errorCode: "SHIFT_DISCARD_REQUIRED",
    };
  }

  // Validate each card is in the player's hand and matches the required type
  const handCards = ctx.framework.zones.getCards({ zone: "hand", playerId });
  for (const discardId of discardCards) {
    if (!handCards.includes(discardId)) {
      return {
        valid: false,
        error: "Discard card is not in hand",
        errorCode: "SHIFT_DISCARD_NOT_IN_HAND",
      };
    }

    if (discardCost.discardCardType) {
      const discardDef = getCardDefinitionFromContext(ctx, discardId);
      const matchesType =
        discardCost.discardCardType === "song"
          ? isSongCard(discardDef)
          : discardDef?.cardType === discardCost.discardCardType;
      if (!discardDef || !matchesType) {
        return {
          valid: false,
          error: `Shift requires discarding a ${discardCost.discardCardType} card`,
          errorCode: "SHIFT_DISCARD_WRONG_TYPE",
        };
      }
    }
  }

  return { valid: true };
}

function enumerateSelectionSubsets<T>(
  candidates: readonly T[],
  minSelections: number,
  maxSelections: number,
): T[][] {
  const selections: T[][] = [];
  const boundedMin = Math.max(0, minSelections);
  const boundedMax = Math.max(boundedMin, Math.min(maxSelections, candidates.length));

  const visit = (startIndex: number, current: T[]): void => {
    if (current.length >= boundedMin && current.length <= boundedMax) {
      selections.push([...current]);
    }
    if (current.length === boundedMax) {
      return;
    }

    for (let index = startIndex; index < candidates.length; index += 1) {
      current.push(candidates[index]!);
      visit(index + 1, current);
      current.pop();
    }
  };

  visit(0, []);
  return selections;
}

const logger = getLogger(["lorcana-engine", "play-card"]);

type PlayCardValidationContext = Parameters<
  NonNullable<LorcanaMoveDefinition<"playCard">["validate"]>
>[0];

type PlayCardExecutionContext = Parameters<LorcanaMoveDefinition<"playCard">["execute"]>[0];

function getCardDefinitionFromContext(
  ctx: MoveValidationContext<MoveInput>,
  cardId: string,
): LorcanaCard | undefined {
  return ctx.cards.getDefinition(cardId) as LorcanaCard | undefined;
}

function getCardDefinitionForEnumeration(
  cardId: string,
  ctx?: Pick<MoveEnumerationContext, "framework" | "cards">,
): LorcanaCard | undefined {
  return ctx
    ? ((ctx.cards.getDefinition(cardId) as LorcanaCard | undefined) ?? undefined)
    : undefined;
}

function getControlledCharactersInPlay(
  playCards: readonly string[],
  getCardDefinition: (cardId: string) => LorcanaCard | undefined,
): CardInstanceId[] {
  return playCards.filter(
    (cardId) => getCardDefinition(cardId)?.cardType === "character",
  ) as CardInstanceId[];
}

function normalizeActionTargets(targets: unknown): CardInstanceId[] {
  if (isSlottedTargetInput(targets)) {
    return flattenSlottedTargets(targets).filter(
      (target): target is CardInstanceId => typeof target === "string",
    );
  }
  if (Array.isArray(targets)) {
    return targets.filter((target): target is CardInstanceId => typeof target === "string");
  }
  if (typeof targets === "string") {
    return [targets as CardInstanceId];
  }
  return [];
}

/**
 * Split a move-level `targets` value into the slotted form (if present) and the
 * flat form expected by the validator/resolver pipeline. Slot-aware resolvers
 * read `slottedTargets` directly; everything else continues using the flat list.
 */
function splitActionTargetInput(targets: unknown): {
  slottedTargets: SlottedTargetInput | undefined;
  flatTargets: unknown;
} {
  if (isSlottedTargetInput(targets)) {
    return {
      slottedTargets: targets,
      flatTargets: flattenSlottedTargets(targets),
    };
  }
  return { slottedTargets: undefined, flatTargets: targets };
}

function tracePlayCardValidationFailure(
  ctx: PlayCardValidationContext,
  error: string,
  errorCode: string,
  cardId: CardInstanceId,
  cardDef?: LorcanaCard,
): RuntimeValidationResult {
  if (ctx.validationMode === "final") {
    traceLorcanaRuntimeStep({
      kind: "move.validation.failed",
      moveId: "playCard",
      playerId: ctx.playerId,
      cardId,
      cardName: formatLorcanaCardName(cardDef),
      message: `${formatLorcanaPlayerLabel(ctx.playerId)} cannot execute move: playCard (${errorCode})`,
      payload: {
        error,
        errorCode,
      },
    });
  }

  return { valid: false, error, errorCode };
}

function tracePlayCardCostSelection(
  ctx: PlayCardExecutionContext,
  cost: LorcanaRuntimeMoveInputs["playCard"]["args"]["cost"],
  cardDef: LorcanaCard,
  details?: {
    shiftTargetId?: CardInstanceId;
    singerIds?: CardInstanceId[];
  },
): void {
  const cardName = formatLorcanaCardName(cardDef) ?? "Unknown Card";
  const resolveCardName = (cardId: CardInstanceId) =>
    getLorcanaCardName(cardId, (instanceId) => ctx.cards.getDefinition(instanceId) as LorcanaCard);

  let message = `Cost mode selected: ${cost} for ${cardName}`;

  if (cost === "shift" && details?.shiftTargetId) {
    const shiftTargetName = resolveCardName(details.shiftTargetId);
    if (shiftTargetName) {
      message = `Cost mode selected: shift onto ${shiftTargetName}`;
    }
  }

  if (cost === "sing" && details?.singerIds?.[0]) {
    const singerName = resolveCardName(details.singerIds[0]);
    if (singerName) {
      message = `Cost mode selected: sing via ${singerName}`;
    }
  }

  if (cost === "singTogether" && details?.singerIds && details.singerIds.length > 0) {
    const singerNames = details.singerIds
      .map((singerId) => resolveCardName(singerId))
      .filter((name): name is string => typeof name === "string");
    if (singerNames.length > 0) {
      message = `Cost mode selected: singTogether via ${singerNames.join(", ")}`;
    }
  }

  traceLorcanaRuntimeStep({
    kind: "move.cost.selected",
    moveId: "playCard",
    playerId: ctx.playerId,
    cardId: ctx.args.cardId,
    cardName,
    message,
    payload: {
      cost,
    },
  });
}

function isValidActionResolutionAmount(value: unknown): boolean {
  if (typeof value === "number") {
    return Number.isFinite(value) && value >= 0;
  }

  if (typeof value === "string") {
    return value.length > 0;
  }

  return typeof value === "object" && value !== null;
}

type BasicPlayCostPayment = Parameters<typeof validateBasicCost>[1];

type StaticCostReductionContext = Pick<
  MoveValidationContext<MoveInput>,
  "framework" | "cards" | "G"
>;

function computeCostReduction(
  ctx: StaticCostReductionContext,
  playerId: PlayerId,
  cardId: CardInstanceId,
  cardDef: LorcanaCard,
  currentTurn: number,
  registry: StaticEffectRegistry,
  playMethod?: "shift" | "standard",
): CostReductionApplication {
  return getAppliedCostReductions({
    definition: cardDef,
    state: createProjectionState(ctx.framework.state, ctx.G),
    cardInstanceId: cardId,
    ownerID: playerId,
    zoneID: "hand",
    actorPlayerId: playerId,
    getDefinitionByInstanceId: (id) => ctx.cards.getDefinition(id) as LorcanaCard | undefined,
    playMethod,
    registry,
  });
}

function computeCostIncrease(
  ctx: StaticCostReductionContext,
  cardDef: LorcanaCard,
  registry: StaticEffectRegistry,
): number {
  return getStaticCostIncreaseAmount({
    definition: cardDef,
    state: createProjectionState(ctx.framework.state, ctx.G),
    registry,
  });
}

function getStandardPlayCardBasicCost(
  cardDef: LorcanaCard,
  costReduction: CostReductionApplication,
  costIncrease: number = 0,
): BasicPlayCostPayment {
  return {
    ink: Math.max(0, cardDef.cost - costReduction.reductionAmount + costIncrease),
  };
}

function getShiftPlayCardBasicCost(
  cardDef: LorcanaCard,
  costReduction: CostReductionApplication,
): BasicPlayCostPayment {
  const shiftRules = getShiftRules(cardDef);
  if (!shiftRules || shiftRules.unsupportedReason || typeof shiftRules.inkCost !== "number") {
    return {};
  }

  return {
    ink: Math.max(0, shiftRules.inkCost - costReduction.reductionAmount),
  };
}

function getSingPlayCardBasicCost(
  singer: CardInstanceId,
  singerDef: LorcanaCard | undefined,
): BasicPlayCostPayment {
  return {
    exertCards: [
      {
        cardId: singer,
        cardType: singerDef?.cardType,
        subject: "Singer",
        exhaustedErrorCode: "SINGER_EXERTED",
        dryingErrorCode: "SINGER_DRYING",
      },
    ],
  };
}

function getSingTogetherPlayCardBasicCost(
  singers: readonly CardInstanceId[],
  getCardDefinition: (cardId: CardInstanceId) => LorcanaCard | undefined,
): BasicPlayCostPayment {
  return {
    exertCards: singers.map((singer) => ({
      cardId: singer,
      cardType: getCardDefinition(singer)?.cardType,
      subject: `Singer ${singer}`,
      exhaustedErrorCode: "SINGER_EXERTED",
      dryingErrorCode: "SINGER_DRYING",
    })),
  };
}

function consumeAppliedCostReductions(
  turnMetadata: LorcanaG["turnMetadata"],
  playerId: PlayerId,
  consumeIndexes: number[],
  currentTurn: number,
): void {
  if (!turnMetadata.pendingCostReductionsByPlayer) {
    turnMetadata.pendingCostReductionsByPlayer = {};
  }
  const pendingByPlayer = turnMetadata.pendingCostReductionsByPlayer;
  const currentEntries = getPendingCostReductions(
    { ctx: {}, G: { turnMetadata } } as unknown as DerivedStateContext,
    playerId,
  );
  if (currentEntries.length === 0) {
    return;
  }

  const consumeIndexSet = new Set(consumeIndexes);
  pendingByPlayer[playerId] = currentEntries.filter((entry, index) => {
    if (entry.expiresAtTurn < currentTurn) {
      return false;
    }
    if (consumeIndexSet.size > 0 && consumeIndexSet.has(index)) {
      return false;
    }
    return true;
  });
}

function getPlayRestrictionError(
  ctx: MoveValidationContext<MoveInput>,
  playerId: PlayerId,
  cardDef: LorcanaCard,
  currentTurn: number,
): Extract<RuntimeValidationResult, { valid: false }> | undefined {
  const playerRestrictions = ctx.G.temporaryPlayerRestrictions;
  if (hasTemporaryPlayerRestriction(playerRestrictions, playerId, currentTurn, "cant-play")) {
    return {
      valid: false,
      error: "Player cannot play cards due to an active restriction",
      errorCode: "PLAYER_PLAY_RESTRICTED",
    };
  }

  if (
    cardDef.cardType === "action" &&
    hasTemporaryPlayerRestriction(playerRestrictions, playerId, currentTurn, "cant-play-actions")
  ) {
    return {
      valid: false,
      error: "Player cannot play actions due to an active restriction",
      errorCode: "PLAYER_PLAY_RESTRICTED",
    };
  }

  if (cardDef.cardType === "action") {
    const staticAbilityState = {
      priority: ctx.framework.state.priority,
      status: ctx.framework.state.status,
      _zonesPrivate: ctx.framework.state._zonesPrivate,
      // Public zone summaries are available on both server and client, enabling accurate
      // opponent hand-count checks even on the client-side preflight validation pass.
      _zonesPublic: ctx.framework.state._zonesPublic,
      G: ctx.G,
    };
    const getDefinitionByInstanceId = (instanceId: string) =>
      ctx.cards.getDefinition(instanceId) as LorcanaCard | undefined;
    const registry = getOrBuildMoveRegistry(ctx);

    if (
      hasOpponentStaticPlayRestriction({
        state: staticAbilityState,
        playerId,
        restriction: "cant-play-actions",
        registry,
        cardCost: cardDef.cost,
      })
    ) {
      return {
        valid: false,
        error: "Player cannot play actions due to a static ability restriction",
        errorCode: "PLAYER_PLAY_RESTRICTED",
      };
    }
  }

  if (
    cardDef.cardType === "item" &&
    hasTemporaryPlayerRestriction(playerRestrictions, playerId, currentTurn, "cant-play-items")
  ) {
    return {
      valid: false,
      error: "Player cannot play items due to an active restriction",
      errorCode: "PLAYER_PLAY_RESTRICTED",
    };
  }

  if (
    cardDef.cardType === "character" &&
    hasTemporaryPlayerRestriction(playerRestrictions, playerId, currentTurn, "cant-play-characters")
  ) {
    return {
      valid: false,
      error: "Player cannot play characters due to an active restriction",
      errorCode: "PLAYER_PLAY_RESTRICTED",
    };
  }

  // Check self-play-conditions: abilities on the card being played that gate whether it can be played.
  // e.g., "You can't play this character unless you have 5 or more characters in play."
  const selfPlayConditionError = getSelfPlayConditionError(ctx, playerId, cardDef);
  if (selfPlayConditionError) {
    return selfPlayConditionError;
  }

  return undefined;
}

/**
 * Play a card from hand
 */
/**
 * Checks whether a card has a self-play-condition static ability whose condition
 * is NOT satisfied. If the condition is not met, the card cannot be played.
 *
 * Self-play-conditions are static abilities with `effect.type === "self-play-condition"`
 * that gate whether the owning card can be played from hand.
 */
function getSelfPlayConditionError(
  ctx: MoveValidationContext<MoveInput>,
  playerId: PlayerId,
  cardDef: LorcanaCard,
): Extract<RuntimeValidationResult, { valid: false }> | undefined {
  const abilities = cardDef.abilities;
  if (!abilities || abilities.length === 0) {
    return undefined;
  }

  for (const ability of abilities) {
    if (ability.type !== "static") {
      continue;
    }

    const effect = ability.effect as { type?: string } | undefined;
    if (!effect || effect.type !== "self-play-condition") {
      continue;
    }

    // This ability requires a condition to be met before the card can be played.
    // If no condition is specified, the ability has no restriction effect.
    const condition = ability.condition;
    if (!condition) {
      continue;
    }

    const staticAbilityState = {
      priority: ctx.framework.state.priority,
      status: ctx.framework.state.status,
      _zonesPrivate: ctx.framework.state._zonesPrivate,
      _zonesPublic: ctx.framework.state._zonesPublic,
      G: ctx.G,
    };

    const getDefinitionByInstanceId = (instanceId: string) =>
      ctx.cards.getDefinition(instanceId) as LorcanaCard | undefined;

    const conditionMet = evaluateStaticCondition({
      condition,
      state: staticAbilityState,
      controllerId: playerId,
      getDefinitionByInstanceId,
    });

    if (!conditionMet) {
      return {
        valid: false,
        error: `Card cannot be played: play condition not met (${ability.text ?? "self-play-condition"})`,
        errorCode: "SELF_PLAY_CONDITION_NOT_MET",
      };
    }
  }

  return undefined;
}

export const playCard: LorcanaMoveDefinition<"playCard"> = {
  validate: (ctx): RuntimeValidationResult => {
    const params = ctx.args;
    const cost = params.cost ?? "standard";
    const { cardId } = params;
    const tracedCardId = cardId as CardInstanceId;
    const fail = (
      error: string,
      errorCode: string,
      cardDef?: LorcanaCard,
    ): RuntimeValidationResult =>
      tracePlayCardValidationFailure(ctx, error, errorCode, tracedCardId, cardDef);

    if (hasPendingActionEffectResolution(ctx)) {
      return fail("Cannot play cards while an action effect is pending", EFFECT_PENDING_ERROR_CODE);
    }

    if (hasPendingBagItems(ctx)) {
      return fail("Cannot play cards while bag effects are pending", "BAG_PENDING");
    }

    const currentPlayer = ctx.framework.state.currentPlayer!;
    const isPreflight = ctx.validationMode === "preflight";
    const registry = getOrBuildMoveRegistry(ctx);

    // Check card is in hand, or can be played from under an item this turn.
    const handCards = ctx.framework.zones.getCards({
      zone: "hand",
      playerId: currentPlayer,
    });
    const isInHand = handCards.includes(cardId);
    if (!isInHand) {
      const cardZone = ctx.framework.zones.getCardZone(cardId);
      const isInLimbo =
        cardZone === "limbo" || (typeof cardZone === "string" && cardZone.startsWith("limbo:"));
      if (isInLimbo) {
        const cardOwner = ctx.framework.zones.getCardOwner(cardId);
        if (cardOwner !== currentPlayer) {
          return fail("Card not in hand", "CARD_NOT_IN_HAND");
        }
        const cardMeta = (ctx.cards.require(cardId).meta ?? {}) as LorcanaCardMeta;
        const sourceItemId = cardMeta.stackParentId as CardInstanceId | undefined;
        const currentTurnForLimboCheck = ctx.framework.state.status.turn ?? 1;
        const activePermissions = getActivePlayFromUnderPermissions(
          ctx.G.playFromUnderPermissions,
          currentPlayer,
          currentTurnForLimboCheck,
        );
        const matchingPermission =
          sourceItemId !== undefined
            ? activePermissions.find((p) => p.sourceItemId === sourceItemId)
            : undefined;
        if (!matchingPermission) {
          return fail("Card not in hand", "CARD_NOT_IN_HAND");
        }
        if (matchingPermission.cardType) {
          const limboCardDef = getCardDefinitionFromContext(ctx, cardId) as
            | { cardType?: string }
            | undefined;
          if (limboCardDef?.cardType !== matchingPermission.cardType) {
            return fail("Card type not allowed by play-from-under permission", "CARD_NOT_IN_HAND");
          }
        }
      } else {
        return fail("Card not in hand", "CARD_NOT_IN_HAND");
      }
    }

    const cardDef = getCardDefinitionFromContext(ctx, cardId);
    if (!cardDef) {
      return fail("Card definition not found", "CARD_NOT_FOUND");
    }

    const myPlayCards = ctx.framework.zones.getCards({
      zone: "play",
      playerId: currentPlayer,
    });
    const myCharactersInPlay = getControlledCharactersInPlay(myPlayCards, (instanceId) =>
      getCardDefinitionFromContext(ctx, instanceId),
    );
    const currentTurn = ctx.framework.state.status.turn ?? 1;
    const playRestrictionError = getPlayRestrictionError(
      ctx,
      currentPlayer as PlayerId,
      cardDef,
      currentTurn,
    );
    if (playRestrictionError) {
      return fail(
        playRestrictionError.error ?? "Card cannot be played right now",
        playRestrictionError.errorCode ?? "PLAY_RESTRICTED",
        cardDef,
      );
    }

    const costReduction = computeCostReduction(
      ctx,
      currentPlayer as PlayerId,
      cardId,
      cardDef,
      currentTurn,
      registry,
      cost === "standard" || cost === "shift" ? cost : undefined,
    );
    const costIncrease = computeCostIncrease(ctx, cardDef, registry);
    const reducedCardCost = Math.max(
      0,
      cardDef.cost - costReduction.reductionAmount + costIncrease,
    );

    switch (cost) {
      case "standard": {
        const costValidation = validateBasicCost(
          {
            framework: ctx.framework,
            cards: ctx.cards,
            playerId: currentPlayer as PlayerId,
          },
          getStandardPlayCardBasicCost(cardDef, costReduction, costIncrease),
        );
        if (!costValidation.valid) {
          return fail(
            costValidation.error ?? "Failed to validate standard cost",
            costValidation.errorCode ?? "INVALID_STANDARD_COST",
            cardDef,
          );
        }
        break;
      }

      case "shift": {
        const shiftTarget = "shiftTarget" in params ? params.shiftTarget : undefined;
        const shiftDiscardCards = "discardCards" in params ? params.discardCards : undefined;
        const shiftRules = getShiftRules(cardDef);
        if (!shiftRules) {
          return fail("Card does not have Shift", "NO_SHIFT_ABILITY", cardDef);
        }
        if (!canUseShiftAbility(ctx, cardId, cardDef, currentPlayer as PlayerId)) {
          return fail("Shift condition is not met", "NO_SHIFT_ABILITY", cardDef);
        }
        if (shiftRules.unsupportedReason) {
          return fail(shiftRules.unsupportedReason, "UNSUPPORTED_SHIFT_COST", cardDef);
        }

        // Handle discard-based shift cost (e.g., "Shift: Discard a location card")
        if (shiftRules.discardCost) {
          const discardValidation = validateShiftDiscardCost(
            ctx,
            shiftRules.discardCost,
            shiftDiscardCards,
            currentPlayer as PlayerId,
            isPreflight,
          );
          if (!discardValidation.valid) {
            return fail(discardValidation.error, discardValidation.errorCode, cardDef);
          }
        } else {
          if (typeof shiftRules.inkCost !== "number") {
            return fail("Shift cost could not be resolved", "INVALID_SHIFT_COST", cardDef);
          }

          // Compute shift-specific cost reduction (includes both general and shift-only reductions)
          const shiftCostReduction = computeCostReduction(
            ctx,
            currentPlayer as PlayerId,
            cardId,
            cardDef,
            currentTurn,
            registry,
            "shift",
          );
          const costValidation = validateBasicCost(
            {
              framework: ctx.framework,
              cards: ctx.cards,
              playerId: currentPlayer as PlayerId,
            },
            getShiftPlayCardBasicCost(cardDef, shiftCostReduction),
          );
          if (!costValidation.valid) {
            return fail(
              costValidation.error ?? "Failed to validate shift cost",
              costValidation.errorCode ?? "INVALID_SHIFT_COST",
              cardDef,
            );
          }
        }

        if (isPreflight && !shiftTarget) {
          break;
        }
        if (!shiftTarget) {
          return fail("Invalid Shift target", "INVALID_SHIFT_TARGET", cardDef);
        }

        const shiftCandidates = resolveShiftTargetCandidates(
          shiftRules,
          myCharactersInPlay,
          (candidateId) => getCardDefinitionFromContext(ctx, candidateId),
        );
        if (!shiftCandidates.includes(shiftTarget)) {
          return fail("Invalid Shift target", "INVALID_SHIFT_TARGET", cardDef);
        }
        break;
      }

      case "sing": {
        const singer = "singer" in params ? params.singer : undefined;
        if (!isSongCard(cardDef)) {
          return fail("Can only sing song cards", "NOT_A_SONG", cardDef);
        }
        if (isPreflight && !singer) {
          break;
        }
        if (!singer) {
          return fail("Singer not in play", "SINGER_NOT_IN_PLAY", cardDef);
        }
        if (!myCharactersInPlay.includes(singer)) {
          return fail("Singer not in play", "SINGER_NOT_IN_PLAY", cardDef);
        }

        const singerDef = getCardDefinitionFromContext(ctx, singer);
        if (singerDef?.cardType !== "character") {
          return fail("Singer must be a character", "INVALID_SINGER", cardDef);
        }

        // Check for cant-sing restriction (e.g., Ariel - On Human Legs "VOICELESS", Gantu - Experienced Enforcer "CLOSE ALL CHANNELS")
        if (
          hasStaticCardRestriction({
            state: ctx.framework.state as Parameters<typeof hasStaticCardRestriction>[0]["state"],
            cardId: singer,
            restriction: "cant-sing",
            registry,
          }) ||
          hasTemporaryRestriction(
            ctx.cards.require(singer).meta as Parameters<typeof hasTemporaryRestriction>[0],
            ctx.framework.state.status.turn ?? 1,
            "cant-sing",
          )
        ) {
          return fail("Singer has cant-sing restriction", "CANT_SING_RESTRICTION", cardDef);
        }

        const costValidation = validateBasicCost(
          {
            framework: ctx.framework,
            cards: ctx.cards,
            playerId: currentPlayer as PlayerId,
          },
          getSingPlayCardBasicCost(singer, singerDef),
        );
        if (!costValidation.valid) {
          return fail(
            costValidation.error ?? "Failed to validate sing cost",
            costValidation.errorCode ?? "INVALID_SING_COST",
            cardDef,
          );
        }

        const singerThreshold = getSingerThresholdForInstance({
          framework: ctx.framework,
          singerId: singer,
          singerDef,
          getDefinitionByInstanceId: (cardId) => getCardDefinitionFromContext(ctx, cardId),
          G: ctx.G,
          registry,
        });
        if (singerThreshold == null || singerThreshold < cardDef.cost) {
          return fail(
            `Singer threshold ${singerThreshold ?? 0} is below song cost ${cardDef.cost}`,
            "INSUFFICIENT_SINGER_THRESHOLD",
            cardDef,
          );
        }
        break;
      }

      case "singTogether": {
        const singers = "singers" in params ? params.singers : [];
        if (!isSongCard(cardDef)) {
          return fail("Can only sing song cards", "NOT_A_SONG", cardDef);
        }

        const singTogetherThreshold = getSingTogetherThreshold(cardDef);
        if (singTogetherThreshold == null) {
          return fail("Song does not have Sing Together", "NOT_SING_TOGETHER_SONG", cardDef);
        }

        if (isPreflight && (!Array.isArray(singers) || singers.length === 0)) {
          break;
        }
        if (!Array.isArray(singers)) {
          return fail("At least one singer is required", "NO_SINGERS_SELECTED", cardDef);
        }

        if (singers.length === 0) {
          return fail("At least one singer is required", "NO_SINGERS_SELECTED", cardDef);
        }

        const uniqueSingers = new Set(singers);
        if (uniqueSingers.size !== singers.length) {
          return fail("Singers must be unique", "DUPLICATE_SINGERS", cardDef);
        }

        let totalSingerThreshold = 0;
        for (const singer of singers) {
          if (!myCharactersInPlay.includes(singer)) {
            return fail(`Singer ${singer} not in play`, "SINGER_NOT_IN_PLAY", cardDef);
          }

          const singerDef = getCardDefinitionFromContext(ctx, singer);
          if (singerDef?.cardType !== "character") {
            return fail(`Singer ${singer} is not a character`, "INVALID_SINGER", cardDef);
          }

          // Check for cant-sing restriction
          if (
            hasStaticCardRestriction({
              state: ctx.framework.state as Parameters<typeof hasStaticCardRestriction>[0]["state"],
              cardId: singer,
              restriction: "cant-sing",
              registry,
            }) ||
            hasTemporaryRestriction(
              ctx.cards.require(singer).meta as Parameters<typeof hasTemporaryRestriction>[0],
              ctx.framework.state.status.turn ?? 1,
              "cant-sing",
            )
          ) {
            return fail(
              `Singer ${singer} has cant-sing restriction`,
              "CANT_SING_RESTRICTION",
              cardDef,
            );
          }

          const singerThreshold = getSingerThresholdForInstance({
            framework: ctx.framework,
            singerId: singer,
            singerDef,
            getDefinitionByInstanceId: (cardId) => getCardDefinitionFromContext(ctx, cardId),
            G: ctx.G,
            registry,
          });
          if (singerThreshold == null) {
            return fail(`Singer ${singer} has no sing threshold`, "INVALID_SINGER", cardDef);
          }

          totalSingerThreshold += singerThreshold;
        }

        const costValidation = validateBasicCost(
          {
            framework: ctx.framework,
            cards: ctx.cards,
            playerId: currentPlayer as PlayerId,
          },
          getSingTogetherPlayCardBasicCost(singers, (cardId) =>
            getCardDefinitionFromContext(ctx, cardId),
          ),
        );
        if (!costValidation.valid) {
          return fail(
            costValidation.error ?? "Failed to validate singTogether cost",
            costValidation.errorCode ?? "INVALID_SING_TOGETHER_COST",
            cardDef,
          );
        }

        if (totalSingerThreshold < singTogetherThreshold) {
          return fail(
            `Singers total ${totalSingerThreshold} but require ${singTogetherThreshold}`,
            "INSUFFICIENT_SING_TOGETHER_TOTAL",
            cardDef,
          );
        }
        break;
      }

      case "free":
        if (reducedCardCost > 0) {
          return fail(
            "Card cannot currently be played for free",
            "FREE_PLAY_NOT_AVAILABLE",
            cardDef,
          );
        }
        break;

      case "sacrifice": {
        // Validate sacrifice-based alternative cost (e.g., Belle - Apprentice Inventor)
        const sacrificeAbility = getSacrificeAlternativeCostAbility(cardDef);
        if (!sacrificeAbility) {
          return fail(
            "Card does not have a sacrifice alternative cost ability",
            "NO_SACRIFICE_ABILITY",
            cardDef,
          );
        }

        const sacrificeTargetId = "sacrificeTarget" in params ? params.sacrificeTarget : undefined;
        if (!sacrificeTargetId || typeof sacrificeTargetId !== "string") {
          return fail(
            "Sacrifice cost requires a valid sacrificeTarget",
            "MISSING_SACRIFICE_TARGET",
            cardDef,
          );
        }

        const sacrificeCard = ctx.cards.get(sacrificeTargetId);
        if (!sacrificeCard) {
          return fail("Sacrifice target card not found", "SACRIFICE_TARGET_NOT_FOUND", cardDef);
        }

        const sacrificeCardDef = sacrificeCard.definition as LorcanaCard | undefined;
        if (!sacrificeCardDef || sacrificeCardDef.cardType !== "item") {
          return fail("Sacrifice target must be an item", "SACRIFICE_TARGET_NOT_ITEM", cardDef);
        }

        const sacrificeZoneKey = ctx.framework.zones.getCardZone(sacrificeTargetId);
        const sacrificeZone = getZoneFromZoneKey(sacrificeZoneKey);
        const sacrificeOwner = ctx.framework.zones.getCardOwner(sacrificeTargetId);
        if (sacrificeZone !== "play" || sacrificeOwner !== currentPlayer) {
          return fail(
            "Sacrifice target must be an item you control in play",
            "SACRIFICE_TARGET_NOT_IN_PLAY",
            cardDef,
          );
        }
        break;
      }

      case "exert-items": {
        // Validate exert-based alternative cost (e.g., Scrooge McDuck - Resourceful Miser)
        const exertAbility = getExertItemsAlternativeCostAbility(cardDef);
        if (!exertAbility) {
          return fail(
            "Card does not have an exert-items alternative cost ability",
            "NO_EXERT_ITEMS_ABILITY",
            cardDef,
          );
        }

        const exertTargets = "exertTargets" in params ? params.exertTargets : undefined;
        if (!exertTargets || !Array.isArray(exertTargets) || exertTargets.length !== 4) {
          return fail(
            "Exert cost requires exactly 4 exertTargets",
            "INVALID_EXERT_TARGETS_COUNT",
            cardDef,
          );
        }

        for (const exertTargetId of exertTargets) {
          const exertCard = ctx.cards.get(exertTargetId);
          if (!exertCard) {
            return fail("Exert target card not found", "EXERT_TARGET_NOT_FOUND", cardDef);
          }

          const exertCardDef = exertCard.definition as LorcanaCard | undefined;
          if (!exertCardDef || exertCardDef.cardType !== "item") {
            return fail("Exert target must be an item", "EXERT_TARGET_NOT_ITEM", cardDef);
          }

          const exertZoneKey = ctx.framework.zones.getCardZone(exertTargetId);
          const exertZone = getZoneFromZoneKey(exertZoneKey);
          const exertOwner = ctx.framework.zones.getCardOwner(exertTargetId);
          if (exertZone !== "play" || exertOwner !== currentPlayer) {
            return fail(
              "Exert target must be an item you control in play",
              "EXERT_TARGET_NOT_IN_PLAY",
              cardDef,
            );
          }

          if (exertCard.meta?.state === "exerted") {
            return fail("Exert target must be a ready item", "EXERT_TARGET_MUST_BE_READY", cardDef);
          }
        }
        break;
      }

      case "put-on-deck-bottom": {
        // Validate "put a Toy character card from your discard on the bottom of your deck"
        // alternative cost (e.g., Hand-in-the-Box - Sid's Toy)
        const putAbility = getPutToyOnDeckBottomAlternativeCostAbility(cardDef);
        if (!putAbility) {
          return fail(
            "Card does not have a put-on-deck-bottom alternative cost ability",
            "NO_PUT_ON_DECK_BOTTOM_ABILITY",
            cardDef,
          );
        }

        const deckBottomTargetId =
          "deckBottomTarget" in params ? params.deckBottomTarget : undefined;
        if (!deckBottomTargetId || typeof deckBottomTargetId !== "string") {
          return fail(
            "Put-on-deck-bottom cost requires a valid deckBottomTarget",
            "MISSING_DECK_BOTTOM_TARGET",
            cardDef,
          );
        }

        const discardCard = ctx.cards.get(deckBottomTargetId);
        if (!discardCard) {
          return fail(
            "Put-on-deck-bottom target card not found",
            "PUT_ON_DECK_BOTTOM_TARGET_NOT_FOUND",
            cardDef,
          );
        }

        const discardCardDef = discardCard.definition as LorcanaCard | undefined;
        if (!discardCardDef || discardCardDef.cardType !== "character") {
          return fail(
            "Put-on-deck-bottom target must be a character card",
            "PUT_ON_DECK_BOTTOM_TARGET_NOT_CHARACTER",
            cardDef,
          );
        }

        const discardClassifications = discardCardDef.classifications ?? [];
        if (!discardClassifications.includes("Toy")) {
          return fail(
            "Put-on-deck-bottom target must be a Toy character card",
            "PUT_ON_DECK_BOTTOM_TARGET_NOT_TOY",
            cardDef,
          );
        }

        const discardZoneKey = ctx.framework.zones.getCardZone(deckBottomTargetId);
        const discardZone = getZoneFromZoneKey(discardZoneKey);
        const discardOwner = ctx.framework.zones.getCardOwner(deckBottomTargetId);
        if (discardZone !== "discard" || discardOwner !== currentPlayer) {
          return fail(
            "Put-on-deck-bottom target must be in your discard",
            "PUT_ON_DECK_BOTTOM_TARGET_NOT_IN_DISCARD",
            cardDef,
          );
        }
        break;
      }

      default:
        return fail(
          `Unrecognized or missing cost type: ${JSON.stringify((params as unknown as { cost: string }).cost)}`,
          "INVALID_COST_TYPE",
          cardDef,
        );
    }

    if (cardDef.cardType === "action") {
      if (
        params.preventAutoResolveTriggeredEffects !== undefined &&
        typeof params.preventAutoResolveTriggeredEffects !== "boolean"
      ) {
        return fail(
          "preventAutoResolveTriggeredEffects must be a boolean when provided",
          "INVALID_AUTO_RESOLVE_TRIGGERED_EFFECTS",
          cardDef,
        );
      }

      if (params.amount !== undefined) {
        if (!isValidActionResolutionAmount(params.amount)) {
          return fail(
            "Action amount must be a valid Amount value",
            "INVALID_ACTION_AMOUNT",
            cardDef,
          );
        }
      }

      if (params.namedCard !== undefined) {
        if (typeof params.namedCard !== "string" || params.namedCard.trim().length === 0) {
          return fail(
            "namedCard must be a non-empty string when provided",
            "INVALID_NAMED_CARD",
            cardDef,
          );
        }
      }

      if (params.resolveOptional !== undefined && typeof params.resolveOptional !== "boolean") {
        return fail(
          "resolveOptional must be a boolean when provided",
          "INVALID_OPTIONAL_SELECTION",
          cardDef,
        );
      }

      if (params.enterPlayExerted !== undefined && typeof params.enterPlayExerted !== "boolean") {
        return fail(
          "enterPlayExerted must be a boolean when provided",
          "INVALID_ENTER_PLAY_EXERTED_SELECTION",
          cardDef,
        );
      }

      if (params.choiceIndex !== undefined) {
        if (
          typeof params.choiceIndex !== "number" ||
          !Number.isInteger(params.choiceIndex) ||
          params.choiceIndex < 0
        ) {
          return fail(
            "choiceIndex must be a non-negative integer when provided",
            "INVALID_CHOICE_INDEX",
            cardDef,
          );
        }

        if (cardDef.cardType === "action") {
          const actionEffects = (cardDef.abilities ?? []).filter(
            (ability) => ability.type === "action",
          );
          const { flatTargets: flatTargetsForChoiceValidation } = splitActionTargetInput(
            params.targets,
          );
          const actionResolutionInput = {
            targets: flatTargetsForChoiceValidation as ActionResolutionInput["targets"],
            choiceIndex: params.choiceIndex,
            eventSnapshot: params.eventSnapshot,
            resolveOptional: params.resolveOptional,
          } satisfies ActionResolutionInput;
          const cardPlayedPayload: CardPlayedPayload = {
            playerId: currentPlayer as PlayerId,
            cardId: cardId as CardInstanceId,
            cardType: cardDef.cardType,
            costType: cost,
          };

          for (const ability of actionEffects) {
            const effectRecord = ability.effect as unknown as Record<string, unknown> | undefined;
            if (!effectRecord || effectRecord.type !== "choice") {
              continue;
            }
            const options = Array.isArray(effectRecord.options)
              ? effectRecord.options
              : Array.isArray(effectRecord.choices)
                ? effectRecord.choices
                : [];
            if (params.choiceIndex >= options.length) {
              return fail("choiceIndex is out of range", "INVALID_CHOICE_INDEX", cardDef);
            }
            const legalChoiceIndices = getLegalChoiceOptionIndices(
              ctx,
              cardPlayedPayload,
              effectRecord as never,
              actionResolutionInput,
            );
            if (!legalChoiceIndices.includes(params.choiceIndex)) {
              return fail(
                "Selected choice option is not currently legal",
                "ILLEGAL_CHOICE_OPTION",
                cardDef,
              );
            }
          }
        }
      }

      if (params.destinations !== undefined) {
        if (!Array.isArray(params.destinations)) {
          return fail(
            "destinations must be an array when provided",
            "INVALID_ACTION_DESTINATIONS",
            cardDef,
          );
        }

        const hasInvalidDestination = params.destinations.some((destination) => {
          if (!destination || typeof destination !== "object" || Array.isArray(destination)) {
            return true;
          }

          const destinationRecord = destination as Record<string, unknown>;
          const cards = destinationRecord.cards;
          const zone = destinationRecord.zone;
          if (typeof zone !== "string" || zone.length === 0) {
            return true;
          }

          if (typeof cards === "string") {
            return false;
          }

          // Allow empty arrays: a player may skip a filtered destination
          // (e.g. choosing no character from a "up to 1 character" scry slot).
          return !(Array.isArray(cards) && cards.every((cardId) => typeof cardId === "string"));
        });

        if (hasInvalidDestination) {
          return fail(
            "Each destination must include a zone and at least one card id",
            "INVALID_ACTION_DESTINATIONS",
            cardDef,
          );
        }
      }

      if (params.targets !== undefined) {
        const actionEffects = (cardDef.abilities ?? []).filter(
          (ability) => ability.type === "action",
        );
        const combinedAnalysis = actionEffects.reduce<TargetAnalysis>(
          (currentAnalysis, ability) => {
            const analysis = analyzeEffectTargets(
              ability.effect,
              currentPlayer as PlayerId,
              ctx,
              cardId as CardInstanceId,
            );
            return {
              targetDsl: [...currentAnalysis.targetDsl, ...analysis.targetDsl],
              cardCandidates: [
                ...new Set([...currentAnalysis.cardCandidates, ...analysis.cardCandidates]),
              ],
              playerCandidates: [
                ...new Set([...currentAnalysis.playerCandidates, ...analysis.playerCandidates]),
              ],
              allowedZones: [
                ...new Set([...currentAnalysis.allowedZones, ...analysis.allowedZones]),
              ],
              minSelections: Math.max(currentAnalysis.minSelections, analysis.minSelections),
              maxSelections: Math.max(currentAnalysis.maxSelections, analysis.maxSelections),
              requiresExplicitSelection:
                currentAnalysis.requiresExplicitSelection || analysis.requiresExplicitSelection,
              allowsDeferredResolutionWithoutInitialSelection:
                currentAnalysis.allowsDeferredResolutionWithoutInitialSelection ||
                analysis.allowsDeferredResolutionWithoutInitialSelection,
              allowDuplicateTargets:
                currentAnalysis.allowDuplicateTargets || analysis.allowDuplicateTargets,
            };
          },
          {
            targetDsl: [],
            cardCandidates: [] as CardInstanceId[],
            playerCandidates: [] as PlayerId[],
            allowedZones: [] as ActionSelectionZone[],
            minSelections: 0,
            maxSelections: 0,
            requiresExplicitSelection: false,
            allowsDeferredResolutionWithoutInitialSelection: false,
            allowDuplicateTargets: false,
          },
        );

        const { flatTargets: flatTargetsForValidation } = splitActionTargetInput(params.targets);
        const selectionValidation = validateInitialActionTargetSelection(
          actionEffects.map((ability) => ability.effect),
          flatTargetsForValidation,
          combinedAnalysis,
          {
            currentPlayer: currentPlayer as PlayerId,
            ctx,
          },
        );
        if (!selectionValidation.valid) {
          return fail(
            selectionValidation.error ?? "Action target selection is invalid",
            selectionValidation.errorCode ?? "INVALID_ACTION_TARGETS",
            cardDef,
          );
        }
      }
    } else if (params.preventAutoResolveTriggeredEffects !== undefined) {
      return fail(
        "preventAutoResolveTriggeredEffects is only supported when playing an action",
        "INVALID_AUTO_RESOLVE_TRIGGERED_EFFECTS",
        cardDef,
      );
    }

    return { valid: true };
  },

  execute: (ctx) => {
    const params = ctx.args;
    const { cardId } = params;
    const cost = params.cost ?? "standard";
    const currentPlayer = ctx.framework.state.currentPlayer! as PlayerId;
    const cardDef = ctx.cards.require(cardId).definition as LorcanaCard;
    const cardName = formatLorcanaCardName(cardDef) ?? "Unknown Card";
    const currentTurn = ctx.framework.state.status.turn ?? 1;
    const playMethod = cost === "standard" || cost === "shift" ? cost : undefined;
    const executeRegistry = getOrBuildMoveRegistry(ctx);
    const computedCostReduction = computeCostReduction(
      ctx,
      currentPlayer,
      cardId,
      cardDef,
      currentTurn,
      executeRegistry,
      playMethod,
    );
    const standardCostReduction =
      playMethod === "standard"
        ? computedCostReduction
        : computeCostReduction(
            ctx,
            currentPlayer,
            cardId,
            cardDef,
            currentTurn,
            executeRegistry,
            "standard",
          );
    const costReduction = computedCostReduction;

    let inkPaid = 0;
    let shiftTargetId: CardInstanceId | undefined;
    let shiftTargetTriggerCandidates:
      | ReturnType<typeof snapshotTriggeredCandidatesForCard>
      | undefined;
    let singerIds: CardInstanceId[] | undefined;

    traceLorcanaRuntimeStep({
      kind: "move.execution.started",
      moveId: "playCard",
      playerId: currentPlayer,
      cardId,
      cardName,
      message: `${formatLorcanaPlayerLabel(currentPlayer)} executes move: playCard`,
      payload: {
        cost,
      },
    });

    // Costs are paid before the card changes zones.
    switch (cost) {
      case "standard": {
        const payResult = payBasicCost(
          {
            framework: ctx.framework,
            cards: ctx.cards,
            playerId: currentPlayer,
          },
          getStandardPlayCardBasicCost(cardDef, standardCostReduction),
        );
        if (!payResult.success) {
          throw new Error(`Failed to pay play cost: ${payResult.error} (${payResult.errorCode})`);
        }
        inkPaid = payResult.inkPaid;
        break;
      }

      case "shift": {
        shiftTargetId = "shiftTarget" in params ? params.shiftTarget : undefined;
        const shiftRules = getShiftRules(cardDef);
        if (!shiftRules || shiftRules.unsupportedReason) {
          throw new Error(
            shiftRules?.unsupportedReason ?? "Shift execution requires a supported Shift cost",
          );
        }

        // Handle discard-based shift cost
        if (shiftRules.discardCost) {
          const shiftDiscardCards = "discardCards" in params ? params.discardCards : undefined;
          if (
            !shiftDiscardCards ||
            shiftDiscardCards.length < shiftRules.discardCost.discardCards
          ) {
            throw new Error("Shift discard cost not satisfied");
          }
          // Move each discarded card from hand to discard
          for (const discardId of shiftDiscardCards) {
            ctx.framework.zones.moveCard(discardId, {
              zone: "discard",
              playerId: currentPlayer,
            });
          }
          inkPaid = 0;
        } else {
          if (typeof shiftRules.inkCost !== "number") {
            throw new Error("Shift execution requires a supported ink-only Shift cost");
          }
          // Compute shift-specific cost reduction (includes both general and shift-only reductions)
          const shiftCostReduction = computeCostReduction(
            ctx,
            currentPlayer,
            cardId,
            cardDef,
            currentTurn,
            executeRegistry,
            "shift",
          );
          const payResult = payBasicCost(
            {
              framework: ctx.framework,
              cards: ctx.cards,
              playerId: currentPlayer,
            },
            getShiftPlayCardBasicCost(cardDef, shiftCostReduction),
          );
          if (!payResult.success) {
            throw new Error(`Failed to pay play cost: ${payResult.error} (${payResult.errorCode})`);
          }
          inkPaid = payResult.inkPaid;
        }
        if (shiftTargetId) {
          shiftTargetTriggerCandidates = snapshotTriggeredCandidatesForCard(ctx, shiftTargetId);
        }
        break;
      }

      case "sing": {
        const singer = "singer" in params ? params.singer : undefined;
        singerIds = singer ? [singer] : [];
        const singerDef = singer
          ? (ctx.cards.require(singer).definition as LorcanaCard | undefined)
          : undefined;
        const payResult = payBasicCost(
          {
            framework: ctx.framework,
            cards: ctx.cards,
            playerId: currentPlayer,
          },
          getSingPlayCardBasicCost(singer!, singerDef),
        );
        if (!payResult.success) {
          throw new Error(`Failed to pay play cost: ${payResult.error} (${payResult.errorCode})`);
        }
        break;
      }

      case "singTogether": {
        const singers = "singers" in params ? params.singers : [];
        singerIds = [...singers];
        const payResult = payBasicCost(
          {
            framework: ctx.framework,
            cards: ctx.cards,
            playerId: currentPlayer,
          },
          getSingTogetherPlayCardBasicCost(
            singers,
            (cardId) => ctx.cards.require(cardId).definition as LorcanaCard | undefined,
          ),
        );
        if (!payResult.success) {
          throw new Error(`Failed to pay play cost: ${payResult.error} (${payResult.errorCode})`);
        }
        break;
      }

      case "free":
        break;

      case "sacrifice": {
        // Banish the sacrifice target (item) as the cost of playing this card
        const sacrificeTargetId = (
          "sacrificeTarget" in params ? params.sacrificeTarget : undefined
        )!;
        banishAsAbilityCost(ctx, {
          cardId: sacrificeTargetId,
          sourceId: cardId,
          playerId: currentPlayer,
        });
        traceLorcanaRuntimeStep({
          kind: "card.moved",
          moveId: "playCard",
          playerId: currentPlayer,
          cardId: sacrificeTargetId,
          cardName:
            formatLorcanaCardName(ctx.cards.require(sacrificeTargetId).definition as LorcanaCard) ??
            "Unknown Card",
          message: "Item banished as sacrifice cost",
          payload: {
            toZone: "discard",
          },
        });
        break;
      }

      case "exert-items": {
        const exertTargets = "exertTargets" in params ? params.exertTargets : [];
        for (const exertTargetId of exertTargets) {
          ctx.cards.patchMeta(exertTargetId, { state: "exerted" });
          traceLorcanaRuntimeStep({
            kind: "card.exerted",
            moveId: "playCard",
            playerId: currentPlayer,
            cardId: exertTargetId,
            cardName:
              formatLorcanaCardName(ctx.cards.require(exertTargetId).definition as LorcanaCard) ??
              "Unknown Card",
            message: "Item exerted as alternative cost",
          });
        }
        break;
      }

      case "put-on-deck-bottom": {
        // Move the chosen discard card to the bottom of the controller's deck
        const deckBottomTargetId = (
          "deckBottomTarget" in params ? params.deckBottomTarget : undefined
        )!;
        ctx.framework.zones.moveCard(
          deckBottomTargetId,
          { zone: "deck", playerId: currentPlayer },
          { index: 0 },
        );
        recordDiscardExitThisTurn(ctx);
        emitTriggeredLorcanaEvent(
          ctx,
          "cardLeftDiscard",
          { cardId: deckBottomTargetId, ownerId: currentPlayer, toZone: "deck" },
          {
            event: "leave-discard",
            playerId: currentPlayer,
            subjectCardId: deckBottomTargetId,
            fromZone: "discard",
            toZone: "deck",
          },
        );
        traceLorcanaRuntimeStep({
          kind: "card.moved",
          moveId: "playCard",
          playerId: currentPlayer,
          cardId: deckBottomTargetId,
          cardName:
            formatLorcanaCardName(
              ctx.cards.require(deckBottomTargetId).definition as LorcanaCard,
            ) ?? "Unknown Card",
          message: "Card put on bottom of deck as alternative cost",
          payload: {
            toZone: "deck",
          },
        });
        break;
      }

      default:
        throw new Error(
          `playCard execute: unrecognized or missing cost type: ${JSON.stringify(cost)}`,
        );
    }

    tracePlayCardCostSelection(ctx, cost, cardDef, {
      shiftTargetId,
      singerIds,
    });

    if (cost === "standard" || cost === "shift") {
      consumeAppliedCostReductions(
        ctx.G.turnMetadata,
        currentPlayer,
        costReduction.consumeIndexes,
        currentTurn,
      );
    }

    const cardPlayedPayload: CardPlayedPayload = {
      playerId: currentPlayer,
      cardId,
      cardType: cardDef.cardType,
      costType: cost,
      ...(cost === "shift"
        ? {
            shiftTargetId: "shiftTarget" in params ? params.shiftTarget : undefined,
            usedShift: true,
          }
        : {}),
      ...(singerIds ? { singerIds } : {}),
      ...(cost === "standard" || cost === "shift" ? { inkPaid } : {}),
    };

    // If the card was in limbo under an item, detach it from the stack before playing.
    const cardMeta = (ctx.cards.require(cardId).meta ?? {}) as LorcanaCardMeta;
    const stackParentId = cardMeta.stackParentId as CardInstanceId | undefined;
    if (stackParentId) {
      const parentMeta = (ctx.cards.require(stackParentId).meta ?? {}) as LorcanaCardMeta;
      const updatedCardsUnder = Array.isArray(parentMeta.cardsUnder)
        ? parentMeta.cardsUnder.filter((id) => id !== cardId)
        : [];
      ctx.cards.patchMeta(stackParentId, {
        cardsUnder: updatedCardsUnder.length > 0 ? updatedCardsUnder : undefined,
      });
      ctx.cards.patchMeta(cardId, { stackParentId: undefined });
    }

    // Cards are always played into play first.
    ctx.framework.zones.moveCard(cardId, {
      zone: "play",
      playerId: currentPlayer,
    });
    // A card entering play may carry a win-condition-modification static ability.
    recomputeLoreToWin(ctx);
    traceLorcanaRuntimeStep({
      kind: "card.played",
      moveId: "playCard",
      playerId: currentPlayer,
      cardId,
      cardName,
      message: `Card is played: ${cardName}`,
      payload: {
        cardType: cardDef.cardType,
        costType: cost,
      },
    });
    ctx.framework.log(
      cost === "shift" && shiftTargetId
        ? createLorcanaLogProjection(
            "lorcana.move.playCard.shift",
            {
              playerId: currentPlayer,
              cardId,
              shiftTargetId,
            },
            { mode: "PUBLIC" },
            "action",
          )
        : singerIds && singerIds.length > 0
          ? createLorcanaLogProjection(
              "lorcana.move.playCard.sing",
              {
                playerId: currentPlayer,
                cardId,
                singerIds,
              },
              { mode: "PUBLIC" },
              "action",
            )
          : createLorcanaLogProjection(
              "lorcana.move.playCard",
              {
                playerId: currentPlayer,
                cardId,
              },
              { mode: "PUBLIC" },
              "action",
            ),
    );

    // Record the card as played BEFORE trigger processing so that turn-metric
    // conditions (e.g. "played-actions eq 2") see the updated count when
    // pruneFailedConditionBagEffects evaluates them at the resolution boundary.
    ctx.G.turnMetadata.cardsPlayedThisTurn.push(cardId as CardInstanceId);
    if (cost === "shift") {
      ctx.G.turnMetadata.shiftPlayedThisTurn.push(cardId as CardInstanceId);
    }

    if (cardDef.cardType === "action") {
      const actionEffects = (cardDef.abilities ?? []).filter(
        (ability) => ability.type === "action",
      );
      const combinedAnalysis = actionEffects.reduce<TargetAnalysis>(
        (currentAnalysis, ability) => {
          const analysis = analyzeEffectTargets(
            ability.effect,
            currentPlayer,
            ctx,
            cardId as CardInstanceId,
          );
          return {
            targetDsl: [...currentAnalysis.targetDsl, ...analysis.targetDsl],
            cardCandidates: [
              ...new Set([...currentAnalysis.cardCandidates, ...analysis.cardCandidates]),
            ],
            playerCandidates: [
              ...new Set([...currentAnalysis.playerCandidates, ...analysis.playerCandidates]),
            ],
            allowedZones: [...new Set([...currentAnalysis.allowedZones, ...analysis.allowedZones])],
            minSelections: Math.max(currentAnalysis.minSelections, analysis.minSelections),
            maxSelections: Math.max(currentAnalysis.maxSelections, analysis.maxSelections),
            requiresExplicitSelection:
              currentAnalysis.requiresExplicitSelection || analysis.requiresExplicitSelection,
            allowsDeferredResolutionWithoutInitialSelection:
              currentAnalysis.allowsDeferredResolutionWithoutInitialSelection ||
              analysis.allowsDeferredResolutionWithoutInitialSelection,
            allowDuplicateTargets:
              currentAnalysis.allowDuplicateTargets || analysis.allowDuplicateTargets,
          };
        },
        {
          targetDsl: [],
          cardCandidates: [] as CardInstanceId[],
          playerCandidates: [] as PlayerId[],
          allowedZones: [] as ActionSelectionZone[],
          minSelections: 0,
          maxSelections: 0,
          requiresExplicitSelection: false,
          allowsDeferredResolutionWithoutInitialSelection: false,
          allowDuplicateTargets: false,
        },
      );
      const { slottedTargets: playCardSlottedTargets, flatTargets: playCardFlatTargets } =
        splitActionTargetInput(params.targets);
      const normalizedSelection = validateInitialActionTargetSelection(
        actionEffects.map((ability) => ability.effect),
        playCardFlatTargets,
        combinedAnalysis,
        {
          currentPlayer,
          ctx,
        },
      );
      if (!normalizedSelection.valid) {
        throw new Error(
          `Invalid action targets: ${normalizedSelection.error} (${normalizedSelection.errorCode})`,
        );
      }
      const actionDestinations = Array.isArray(params.destinations)
        ? params.destinations.map((destination) => ({
            cards: Array.isArray(destination.cards) ? [...destination.cards] : destination.cards,
            zone: destination.zone,
          }))
        : undefined;
      emitTriggeredLorcanaEvent(ctx, "cardPlayed", cardPlayedPayload, {
        event: "play",
        playerId: currentPlayer,
        subjectCardId: cardId,
        triggerSourceCardId: cardId,
        triggerCandidates: shiftTargetTriggerCandidates,
      });
      if (singerIds) {
        singerIds.forEach((singerId) => {
          const triggerCandidates = snapshotTriggeredCandidatesForCard(ctx, singerId);
          emitTriggeredLorcanaEvent(ctx, "cardPlayed", cardPlayedPayload, {
            event: "sing",
            playerId: currentPlayer,
            subjectCardId: singerId,
            triggerSourceCardId: cardId,
            triggerCandidates,
          });
          emitTriggeredLorcanaEvent(ctx, "cardPlayed", cardPlayedPayload, {
            event: "exert",
            playerId: currentPlayer,
            subjectCardId: singerId,
            triggerCandidates,
          });
        });
      }
      traceLorcanaRuntimeStep({
        kind: "effect.resolution.started",
        moveId: "playCard",
        playerId: currentPlayer,
        cardId,
        cardName,
        message: isSongCard(cardDef)
          ? "Song effect begins resolution"
          : "Action effect begins resolution",
      });
      const actionResolutionInput = {
        targets: flattenNormalizedTargetSelection(normalizedSelection.selection),
        slottedTargets: playCardSlottedTargets,
        targetSelectionResolved: params.targets !== undefined ? true : undefined,
        amount: params.amount as ActionResolutionInput["amount"],
        namedCard: typeof params.namedCard === "string" ? params.namedCard.trim() : undefined,
        choiceIndex: params.choiceIndex,
        preventAutoResolveTriggeredEffects:
          params.preventAutoResolveTriggeredEffects === true ? true : undefined,
        destinations: actionDestinations,
        eventSnapshot: params.eventSnapshot,
        resolveOptional: params.resolveOptional,
        enterPlayExerted: params.enterPlayExerted,
      } satisfies ActionResolutionInput;
      const immediateLogTargets = collectImmediateActionLogTargets(
        ctx,
        cardPlayedPayload,
        cardDef,
        actionResolutionInput,
      );
      if (immediateLogTargets.length > 0) {
        ctx.framework.log(
          createLorcanaLogProjection(
            "lorcana.effect.resolve.targetSelection",
            {
              playerId: currentPlayer,
              sourceCardId: cardId,
              targets: immediateLogTargets,
            },
            { mode: "PUBLIC" },
            "action",
          ),
        );
      }
      resolveActionCardEffects(ctx, cardPlayedPayload, cardDef, actionResolutionInput);
      if (hasPendingActionEffectResolution(ctx)) {
        traceLorcanaRuntimeStep({
          kind: "effect.resolution.suspended",
          moveId: "playCard",
          playerId: currentPlayer,
          cardId,
          cardName,
          message: "Action effect is waiting for further resolution",
        });
        moveSuspendedActionCardToLimbo(ctx, cardPlayedPayload);
      } else {
        traceLorcanaRuntimeStep({
          kind: "effect.resolution.completed",
          moveId: "playCard",
          playerId: currentPlayer,
          cardId,
          cardName,
          message: isSongCard(cardDef)
            ? "Song resolution completes"
            : "Action resolution completes",
        });
        finalizeResolvedActionCard(ctx, cardPlayedPayload);
        traceLorcanaRuntimeStep({
          kind: "card.moved",
          moveId: "playCard",
          playerId: currentPlayer,
          cardId,
          cardName,
          message: "Card is moved to discard",
          payload: {
            toZone: "discard",
          },
        });
        flushTriggeredEventsToBag(ctx);
      }
    } else if (cost === "shift") {
      const shiftTarget = ("shiftTarget" in params ? params.shiftTarget : undefined)!;
      const entersExerted =
        entersPlayExerted(ctx, cardId, cardDef) ||
        ((hasBodyguard(cardDef) || hasMayEnterPlayExertedOption(cardDef)) &&
          (params.enterPlayExerted === true || params.resolveOptional === true));
      const banishedByGSC = executeShiftPlay(ctx, cardId, shiftTarget, currentPlayer, cardDef, {
        entersExerted,
      });
      if (banishedByGSC) {
        traceLorcanaRuntimeStep({
          kind: "move.execution.completed",
          moveId: "playCard",
          playerId: currentPlayer,
          cardId,
          cardName,
          message: "Move completes: playCard (banished by GSC due to lethal inherited damage)",
        });
        return;
      }
    } else if (cardDef.cardType === "character") {
      const entersWithDamage = getEntersWithDamageAmount(cardDef);
      const entersExerted =
        entersPlayExerted(ctx, cardId, cardDef) ||
        ((hasBodyguard(cardDef) || hasMayEnterPlayExertedOption(cardDef)) &&
          (params.enterPlayExerted === true || params.resolveOptional === true));
      ctx.cards.setMeta(cardId, {
        state: entersExerted ? "exerted" : "ready",
        damage: entersWithDamage,
        isDrying: true,
        publicFaceState: undefined,
        atLocationId: undefined,
        cardsUnder: undefined,
        stackParentId: undefined,
        playedViaShift: false,
        playedCostType: cost,
      });
    } else {
      ctx.cards.setMeta(cardId, {
        state: entersPlayExerted(ctx, cardId, cardDef) ? "exerted" : undefined,
        damage: undefined,
        isDrying: undefined,
        publicFaceState: undefined,
        atLocationId: undefined,
        cardsUnder: undefined,
        stackParentId: undefined,
        playedViaShift: false,
        playedCostType: cost,
      });
    }

    if (cardDef.cardType !== "action") {
      emitTriggeredLorcanaEvent(ctx, "cardPlayed", cardPlayedPayload, {
        event: "play",
        playerId: currentPlayer,
        subjectCardId: cardId,
        triggerSourceCardId: cardId,
        triggerCandidates: shiftTargetTriggerCandidates,
      });
      if (singerIds) {
        singerIds.forEach((singerId) => {
          const triggerCandidates = snapshotTriggeredCandidatesForCard(ctx, singerId);
          emitTriggeredLorcanaEvent(ctx, "cardPlayed", cardPlayedPayload, {
            event: "sing",
            playerId: currentPlayer,
            subjectCardId: singerId,
            triggerSourceCardId: cardId,
            triggerCandidates,
          });
          emitTriggeredLorcanaEvent(ctx, "cardPlayed", cardPlayedPayload, {
            event: "exert",
            playerId: currentPlayer,
            subjectCardId: singerId,
            triggerCandidates,
          });
        });
      }
      flushTriggeredEventsToBag(ctx);
    }

    traceLorcanaRuntimeStep({
      kind: "move.execution.completed",
      moveId: "playCard",
      playerId: currentPlayer,
      cardId,
      cardName,
      message: "Move completes: playCard",
    });
  },

  available: (ctx) => {
    if (hasPendingActionEffectResolution(ctx) || hasPendingBagItems(ctx)) {
      return false;
    }

    const handCards = ctx.framework.zones.getCards({
      zone: "hand",
      playerId: ctx.playerId,
    });
    const availableInk = getAvailableInk(ctx, ctx.playerId as PlayerId);
    const playCards = ctx.framework.zones.getCards({
      zone: "play",
      playerId: ctx.playerId,
    });

    const myCharactersInPlay = getControlledCharactersInPlay(playCards, (instanceId) =>
      getCardDefinitionForEnumeration(instanceId, ctx),
    );

    const readySingers = myCharactersInPlay.filter((cardId) =>
      isReadyAndNotDrying(ctx.cards.require(cardId).meta),
    );

    const availableRegistry = getOrBuildMoveRegistry(ctx);

    for (const handCardId of handCards) {
      const cardDef = getCardDefinitionForEnumeration(handCardId, ctx);
      if (!cardDef) {
        continue;
      }

      const currentTurn = ctx.framework.state.status.turn ?? 1;
      const standardCostReduction = computeCostReduction(
        ctx,
        ctx.playerId as PlayerId,
        handCardId as CardInstanceId,
        cardDef,
        currentTurn,
        availableRegistry,
        "standard",
      );
      const costIncrease = computeCostIncrease(ctx, cardDef, availableRegistry);
      const reducedCardCost = Math.max(
        0,
        cardDef.cost - standardCostReduction.reductionAmount + costIncrease,
      );

      if (reducedCardCost === 0 || availableInk >= reducedCardCost) {
        return true;
      }

      const shiftCostReduction = computeCostReduction(
        ctx,
        ctx.playerId as PlayerId,
        handCardId as CardInstanceId,
        cardDef,
        currentTurn,
        availableRegistry,
        "shift",
      );
      const shiftRules = getShiftRules(cardDef);
      if (
        shiftRules &&
        !shiftRules.unsupportedReason &&
        typeof shiftRules.inkCost === "number" &&
        availableInk >= Math.max(0, shiftRules.inkCost - shiftCostReduction.reductionAmount)
      ) {
        const shiftCandidates = resolveShiftTargetCandidates(
          shiftRules,
          myCharactersInPlay,
          (candidateId) => getCardDefinitionForEnumeration(candidateId, ctx),
        );
        if (availableInk >= Math.max(0, shiftRules.inkCost - shiftCostReduction.reductionAmount)) {
          const shiftCandidates = resolveShiftTargetCandidates(
            shiftRules,
            myCharactersInPlay,
            (candidateId) => getCardDefinitionForEnumeration(candidateId, ctx),
          );
          if (shiftCandidates.length > 0) {
            return true;
          }
        }
      }

      // Check for sacrifice-based alternative cost (e.g., banish an item to play for free)
      if (getSacrificeAlternativeCostAbility(cardDef)) {
        const hasItemInPlay = playCards.some((playCardId) => {
          const playCardDef = getCardDefinitionForEnumeration(playCardId, ctx);
          return playCardDef?.cardType === "item";
        });
        if (hasItemInPlay) {
          return true;
        }
      }

      // Check for exert-items-based alternative cost (e.g., exert 4 items to play for free)
      if (getExertItemsAlternativeCostAbility(cardDef)) {
        const readyItems = playCards.filter((playCardId) => {
          const playCardDef = getCardDefinitionForEnumeration(playCardId, ctx);
          if (playCardDef?.cardType !== "item") return false;
          const meta = ctx.cards.require(playCardId).meta;
          return meta?.state !== "exerted";
        });
        if (readyItems.length >= 4) {
          return true;
        }
      }

      // Check for put-toy-character-on-deck-bottom alternative cost
      // (e.g., Hand-in-the-Box - Sid's Toy)
      if (getPutToyOnDeckBottomAlternativeCostAbility(cardDef)) {
        const discardCards = ctx.framework.zones.getCards({
          zone: "discard",
          playerId: ctx.playerId,
        });
        const hasToyCharacterInDiscard = discardCards.some((discardCardId) => {
          const discardCardDef = getCardDefinitionForEnumeration(discardCardId, ctx);
          if (discardCardDef?.cardType !== "character") return false;
          return (discardCardDef.classifications ?? []).includes("Toy");
        });
        if (hasToyCharacterInDiscard) {
          return true;
        }
      }

      if (!isSongCard(cardDef)) {
        continue;
      }

      const singCandidates = readySingers.filter((candidateId) => {
        // Check for cant-sing restriction
        if (
          hasStaticCardRestriction({
            state: ctx.framework.state as Parameters<typeof hasStaticCardRestriction>[0]["state"],
            cardId: candidateId,
            restriction: "cant-sing",
            registry: availableRegistry,
          }) ||
          hasTemporaryRestriction(
            ctx.cards.require(candidateId).meta as Parameters<typeof hasTemporaryRestriction>[0],
            ctx.framework.state.status.turn ?? 1,
            "cant-sing",
          )
        ) {
          return false;
        }
        const singerDef = getCardDefinitionForEnumeration(candidateId, ctx);
        const singerThreshold = getSingerThresholdForInstance({
          framework: ctx.framework,
          singerId: candidateId,
          singerDef,
          getDefinitionByInstanceId: (cardId) => getCardDefinitionForEnumeration(cardId, ctx),
          G: ctx.G,
          registry: availableRegistry,
        });
        return singerThreshold != null && singerThreshold >= cardDef.cost;
      });

      if (singCandidates.length > 0) {
        return true;
      }

      const singTogetherThreshold = getSingTogetherThreshold(cardDef);
      if (singTogetherThreshold != null && readySingers.length > 0) {
        return true;
      }
    }

    return false;
  },
};
