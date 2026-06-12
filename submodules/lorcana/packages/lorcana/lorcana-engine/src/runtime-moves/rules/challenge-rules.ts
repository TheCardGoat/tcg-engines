import type {
  CardInstanceId,
  MoveEnumerationContext,
  MoveExecutionContext,
  MoveValidationContext,
  PlayerId,
  RuntimeCardWithDefinition,
  RuntimeValidationResult,
} from "#core";
import type { CharacterCard, LorcanaCard, LocationCard } from "@tcg/lorcana-types";
import { isCharacterCard, isLocationCard } from "@tcg/lorcana-types";
import { getTotalKeyword, hasKeyword } from "../../card-utils";
import { projectLorcanaCardDerived } from "../../projection/card-derived";
import { createProjectionState } from "../../rules/derived-state";
import { resolveCandidateTargets } from "../../targeting/runtime";
import { isCardInPlayZone } from "../../operations/zones";
import type {
  ChallengeState,
  LorcanaCardDefinition,
  LorcanaCardMeta,
  LorcanaRuntimeMoveInputs,
} from "../../types";
import type { LorcanaCardDerived } from "../../types/projected-board";
type LorcanaRuntimeCard = RuntimeCardWithDefinition & LorcanaCardDerived;
import {
  hasStaticCardRestriction,
  hasStaticChallengerFilteredRestriction,
  hasStaticPlayerRestriction,
  getStaticChallengeLimit,
  isCardInPlay,
  evaluateStaticCondition,
  hasStaticSelfRestriction,
  getStaticSelfRestrictionBypass,
} from "./static-ability-utils";
import { getAvailableInk } from "./play-card-rules";
import {
  getTemporaryAbilityPayload,
  hasTemporaryAbility,
  hasTemporaryPlayerRestriction,
  hasTemporaryRestriction,
} from "../effects/temporary-effects";
import { getOrBuildMoveRegistry } from "./move-registry-cache";
import { buildStaticEffectRegistry, getEffectsForCard } from "../../rules/static-effect-registry";
import type { StaticEffectRegistry } from "../../rules/static-effect-registry";
import { previewReplacementEffects } from "../effects/replacement-effects";
import type { ReplacementContext } from "../effects/replacement-effects";

export const CHALLENGE_DEFENDER_TARGET_DSL = {
  selector: "chosen",
  count: 1,
  owner: "opponent",
  zones: ["play"],
} as const;

export type ChallengeValidationContext = MoveValidationContext<
  LorcanaRuntimeMoveInputs["challenge"]
>;

export type ChallengeEnumerationContext = MoveEnumerationContext;

export type ChallengeExecutionContext = MoveExecutionContext<LorcanaRuntimeMoveInputs["challenge"]>;

type ChallengeIntentValidationContext = MoveValidationContext<
  LorcanaRuntimeMoveInputs[keyof LorcanaRuntimeMoveInputs]
>;

type ChallengeIntentContext = ChallengeIntentValidationContext | ChallengeEnumerationContext;

type ChallengeAnyContext = ChallengeIntentContext | ChallengeExecutionContext;
type ChallengeCardReadContext = { cards: unknown };
type ChallengeFrameworkReadContext = Pick<ChallengeAnyContext, "framework" | "G">;
type ChallengeCardStateContext = ChallengeCardReadContext & ChallengeFrameworkReadContext;

type RuntimeLorcanaCardWithDerived = RuntimeCardWithDefinition & LorcanaCardDerived;

type ChallengeCardsAPI = {
  getDefinition(cardId: CardInstanceId): LorcanaCard | undefined;
  get(cardId: CardInstanceId): RuntimeLorcanaCardWithDerived | undefined;
  require(cardId: CardInstanceId): RuntimeLorcanaCardWithDerived;
};

function getCardsApi(ctx: ChallengeCardReadContext): ChallengeCardsAPI {
  return ctx.cards as unknown as ChallengeCardsAPI;
}

function isInPlayZone(zoneId: string | undefined): boolean {
  return zoneId === "play" || (typeof zoneId === "string" && zoneId.startsWith("play:"));
}

function getCardDefinition(
  ctx: ChallengeCardReadContext,
  cardId: CardInstanceId,
): LorcanaCard | undefined {
  return getCardsApi(ctx).getDefinition(cardId);
}

function getCardMeta(ctx: ChallengeCardReadContext, cardId: CardInstanceId): LorcanaCardMeta {
  return getCardsApi(ctx).require(cardId).meta ?? {};
}

function isReady(meta: LorcanaCardMeta): boolean {
  return meta.state !== "exerted";
}

function getCurrentTurn(ctx: ChallengeFrameworkReadContext): number {
  return ctx.framework.state.status.turn ?? 1;
}

function hasKeywordIncludingTemporary(
  ctx: ChallengeCardStateContext,
  cardId: CardInstanceId,
  keyword: string,
  registry: StaticEffectRegistry,
): boolean {
  const runtimeCard = getCardsApi(ctx).require(cardId);
  const derived = projectLorcanaCardDerived({
    definition: runtimeCard.definition as LorcanaCardDefinition,
    meta: runtimeCard.meta as LorcanaCardMeta,
    state: createProjectionState(ctx.framework.state, ctx.G),
    cardInstanceId: cardId,
    ownerID: runtimeCard.ownerID as PlayerId,
    controllerID: runtimeCard.controllerID as PlayerId,
    zoneID: runtimeCard.zoneID,
    getDefinitionByInstanceId: (instanceId) => getCardDefinition(ctx, instanceId),
    registry,
  });
  return derived.keywords?.includes(keyword) ?? false;
}

function hasRushForChallenge(
  ctx: ChallengeAnyContext,
  cardId: CardInstanceId,
  registry: StaticEffectRegistry,
): boolean {
  return hasKeywordIncludingTemporary(ctx, cardId, "Rush", registry);
}

function canChallengeReadyCharacters(
  ctx: ChallengeAnyContext,
  attackerId: CardInstanceId,
  defenderId?: CardInstanceId,
): boolean {
  const currentTurn = getCurrentTurn(ctx);
  const attackerMeta = getCardMeta(ctx, attackerId);
  const evaluateClassificationRestriction = (classification: unknown): boolean => {
    if (typeof classification !== "string" || classification.length === 0) {
      return true;
    }

    if (!defenderId) {
      return false;
    }

    const defenderRuntimeCard = getCardsApi(ctx).get(defenderId);
    if (!defenderRuntimeCard) {
      return false;
    }

    return Array.isArray(defenderRuntimeCard.classifications)
      ? defenderRuntimeCard.classifications.includes(classification)
      : false;
  };

  const temporaryReadyGrant = hasTemporaryAbility(attackerMeta, currentTurn, "can-challenge-ready");
  if (temporaryReadyGrant) {
    const payload = getTemporaryAbilityPayload(attackerMeta, currentTurn, "can-challenge-ready");
    return evaluateClassificationRestriction(
      payload && typeof payload === "object" && !Array.isArray(payload)
        ? (payload as { classification?: unknown }).classification
        : undefined,
    );
  }

  const attackerRuntime = getCardsApi(ctx).get(attackerId);
  const attackerDefinition = attackerRuntime?.definition;
  if (!attackerDefinition) {
    return false;
  }

  const evaluateDamagedRestriction = (onlyDamaged: unknown): boolean => {
    if (!onlyDamaged) {
      return true;
    }

    if (!defenderId) {
      return false;
    }

    const defenderMeta = getCardMeta(ctx, defenderId);
    return Number(defenderMeta.damage ?? 0) > 0;
  };

  const attackerControllerId = getCardsApi(ctx).require(attackerId).controllerID as
    | PlayerId
    | undefined;

  const matchesStaticReadyGrant = (attackerDefinition.abilities ?? []).some((ability) => {
    if (ability.type !== "static" || ability.effect.type !== "grant-ability") {
      return false;
    }

    if (ability.effect.target !== undefined && ability.effect.target !== "SELF") {
      return false;
    }

    const grantedAbility = ability.effect.ability;
    const grantedAbilityType =
      typeof grantedAbility === "string"
        ? grantedAbility
        : grantedAbility && typeof grantedAbility === "object" && !Array.isArray(grantedAbility)
          ? grantedAbility.type
          : undefined;

    if (grantedAbilityType !== "can-challenge-ready") {
      return false;
    }

    if (
      !evaluateStaticCondition({
        condition: ability.condition,
        state: ctx.framework.state,
        controllerId: attackerControllerId,
        sourceId: attackerId,
        getDefinitionByInstanceId: (instanceId) => getCardDefinition(ctx, instanceId),
      })
    ) {
      return false;
    }

    const grantedClassification =
      grantedAbility && typeof grantedAbility === "object" && !Array.isArray(grantedAbility)
        ? (grantedAbility as { classification?: unknown }).classification
        : undefined;

    const grantedOnlyDamaged =
      grantedAbility && typeof grantedAbility === "object" && !Array.isArray(grantedAbility)
        ? (grantedAbility as { onlyDamaged?: unknown }).onlyDamaged
        : undefined;

    return (
      evaluateClassificationRestriction(grantedClassification) &&
      evaluateDamagedRestriction(grantedOnlyDamaged)
    );
  });

  return matchesStaticReadyGrant;
}

function hasStaticTakesNoDamageFromChallenges(
  ctx: ChallengeCardStateContext,
  cardId: CardInstanceId,
): boolean {
  const cardDef = getCardDefinition(ctx, cardId);
  if (!cardDef) {
    return false;
  }

  const abilities = cardDef.abilities ?? [];
  const controllerId = getCardsApi(ctx).require(cardId).controllerID as PlayerId | undefined;

  for (const ability of abilities) {
    if (ability.type !== "static") {
      continue;
    }
    const effect = ability.effect;
    if (effect.type !== "grant-ability") {
      continue;
    }
    if (effect.ability !== "takes-no-damage-from-challenges") {
      continue;
    }
    // Must target SELF (or undefined, which defaults to SELF)
    if (effect.target !== undefined && effect.target !== "SELF") {
      continue;
    }

    // Evaluate the condition
    if (!ability.condition) {
      return true; // Unconditional static grant
    }

    if (!controllerId) {
      continue;
    }

    // Merge G into the state so that condition evaluator can access turnMetadata
    const stateWithG = { ...ctx.framework.state, G: ctx.G };

    const conditionMet = evaluateStaticCondition({
      condition: ability.condition,
      state: stateWithG,
      controllerId,
      sourceId: cardId,
      getDefinitionByInstanceId: (instanceId) => getCardDefinition(ctx, instanceId),
    });

    if (conditionMet) {
      return true;
    }
  }

  return false;
}

function takesNoDamageFromChallenges(
  ctx: ChallengeCardStateContext,
  cardId: CardInstanceId,
  opponentCardId?: CardInstanceId,
): boolean {
  const currentTurn = getCurrentTurn(ctx);
  const cardMeta = getCardMeta(ctx, cardId);

  // Unconditional "takes no damage from challenges"
  if (hasTemporaryAbility(cardMeta, currentTurn, "takes-no-damage-from-challenges")) {
    return true;
  }

  // Conditional variant: "takes no damage from challenges against <classification>"
  if (
    opponentCardId &&
    hasTemporaryAbility(cardMeta, currentTurn, "takes-no-damage-from-challenges-conditional")
  ) {
    const payload = getTemporaryAbilityPayload(
      cardMeta,
      currentTurn,
      "takes-no-damage-from-challenges-conditional",
    );
    if (payload && typeof payload.type === "string") {
      const requiredClassification = payload.type;
      const opponentDef = getCardDefinition(ctx, opponentCardId);
      if (opponentDef && "classifications" in opponentDef) {
        const classifications = (opponentDef as { classifications?: string[] }).classifications;
        if (Array.isArray(classifications) && classifications.includes(requiredClassification)) {
          return true;
        }
      }
      // Also check derived/projected classifications for runtime modifications
      const runtimeCard = getCardsApi(ctx).get(opponentCardId);
      if (runtimeCard) {
        if (
          Array.isArray(runtimeCard.classifications) &&
          runtimeCard.classifications.includes(requiredClassification)
        ) {
          return true;
        }
      }
    }
  }

  // Check static abilities on the card definition that grant "takes-no-damage-from-challenges"
  if (hasStaticTakesNoDamageFromChallenges(ctx, cardId)) {
    return true;
  }

  return false;
}

function cantBeChallenged(
  ctx: ChallengeAnyContext,
  cardId: CardInstanceId,
  attackerId?: CardInstanceId,
): boolean {
  const currentTurn = getCurrentTurn(ctx);
  const cardMeta = getCardMeta(ctx, cardId);
  if (
    hasTemporaryRestriction(cardMeta, currentTurn, "cant-be-challenged", {
      isSourceInPlay: (sourceId) => isCardInPlayZone(ctx, sourceId),
    })
  ) {
    return true;
  }

  const ownerId = getCardsApi(ctx).require(cardId).ownerID as PlayerId | undefined;
  if (!ownerId) {
    return false;
  }

  if (
    hasTemporaryPlayerRestriction(
      ctx.G.temporaryPlayerRestrictions,
      ownerId,
      currentTurn,
      "cant-be-challenged",
    )
  ) {
    return true;
  }

  // Check for static cant-be-challenged restrictions, including challenger-filtered ones
  if (
    hasStaticChallengerFilteredRestriction({
      state: ctx.framework.state,
      cardId,
      attackerId,
      getDefinitionByInstanceId: (instanceId) => getCardDefinition(ctx, instanceId),
    })
  ) {
    return true;
  }

  return false;
}

function canChallengeEvasive(
  ctx: ChallengeAnyContext,
  attackerId: CardInstanceId,
  registry: StaticEffectRegistry,
): boolean {
  return (
    hasKeywordIncludingTemporary(ctx, attackerId, "Evasive", registry) ||
    hasKeywordIncludingTemporary(ctx, attackerId, "Alert", registry)
  );
}

function isChallengeReadyAttacker(ctx: ChallengeAnyContext, attackerId: CardInstanceId): boolean {
  const attackerDef = getCardDefinition(ctx, attackerId);
  if (!attackerDef || !isCharacterCard(attackerDef)) {
    return false;
  }

  const attackerMeta = getCardMeta(ctx, attackerId);
  if (!isReady(attackerMeta)) {
    return false;
  }

  const currentTurn = getCurrentTurn(ctx);
  const controllerId = getCardsApi(ctx).require(attackerId).controllerID as PlayerId | undefined;
  const registry = getOrBuildMoveRegistry(ctx);

  if (
    controllerId &&
    hasTemporaryPlayerRestriction(
      ctx.G.temporaryPlayerRestrictions,
      controllerId,
      currentTurn,
      "cant-challenge",
    )
  ) {
    return false;
  }

  if (
    hasTemporaryRestriction(attackerMeta, currentTurn, "cant-challenge", {
      isSourceInPlay: (sourceId) => isCardInPlayZone(ctx, sourceId),
    })
  ) {
    return false;
  }

  if (
    hasStaticSelfRestriction({
      state: ctx.framework.state,
      cardId: attackerId,
      restriction: "cant-challenge",
      getDefinitionByInstanceId: (instanceId) => getCardsApi(ctx).getDefinition(instanceId),
    })
  ) {
    const bypass = getStaticSelfRestrictionBypass({
      state: ctx.framework.state,
      cardId: attackerId,
      restriction: "cant-challenge",
      getDefinitionByInstanceId: (instanceId) => getCardsApi(ctx).getDefinition(instanceId),
    });
    if (!bypass) {
      return false;
    }
    if (!controllerId || getAvailableInk(ctx, controllerId) < bypass.cost.ink) {
      return false;
    }
  }

  if (
    hasStaticCardRestriction({
      state: ctx.framework.state,
      cardId: attackerId,
      restriction: "cant-challenge",
      registry,
    })
  ) {
    return false;
  }

  if (
    controllerId &&
    hasStaticPlayerRestriction({
      state: ctx.framework.state,
      playerId: controllerId,
      restriction: "cant-challenge",
      registry,
    })
  ) {
    return false;
  }

  if (attackerMeta.isDrying === true && !hasRushForChallenge(ctx, attackerId, registry)) {
    return false;
  }

  if (hasExceededChallengeLimit(ctx, attackerId)) {
    return false;
  }

  return true;
}

function hasExceededChallengeLimit(ctx: ChallengeAnyContext, attackerId: CardInstanceId): boolean {
  const registry = getOrBuildMoveRegistry(ctx);
  const challengeLimit = getStaticChallengeLimit({
    registry,
  });
  if (challengeLimit === null) {
    return false;
  }

  const attackerControllerId = getCardsApi(ctx).require(attackerId).controllerID as
    | PlayerId
    | undefined;
  if (!attackerControllerId) {
    return false;
  }

  const challengesDoneThisTurn =
    ctx.G.turnMetadata?.challengesByPlayerThisTurn?.[attackerControllerId] ?? 0;
  return challengesDoneThisTurn >= challengeLimit;
}

function getActingPlayerId(ctx: ChallengeIntentContext): PlayerId | undefined {
  const candidate =
    ctx.framework.state.currentPlayer ?? ctx.playerId ?? ctx.framework.state.priority.holder;
  return typeof candidate === "string" && candidate.length > 0
    ? (candidate as PlayerId)
    : undefined;
}

function getControlledCardsInPlay(ctx: ChallengeIntentContext): CardInstanceId[] {
  const actingPlayerId = getActingPlayerId(ctx);
  if (!actingPlayerId) {
    return [];
  }

  return resolveCandidateTargets(
    ctx,
    {
      selector: "all",
      count: "all",
      owner: "you",
      zones: ["play"],
    },
    { controllerId: actingPlayerId },
  );
}

function getOpposingCardsInPlay(ctx: ChallengeIntentContext): CardInstanceId[] {
  const actingPlayerId = getActingPlayerId(ctx);
  if (!actingPlayerId) {
    return [];
  }

  return resolveCandidateTargets(
    ctx,
    {
      selector: "all",
      count: "all",
      owner: "opponent",
      zones: ["play"],
    },
    { controllerId: actingPlayerId },
  );
}

function getBodyguardCandidatesForOwner(
  ctx: ChallengeIntentContext,
  attackerId: CardInstanceId,
  ownerId: PlayerId,
  registry: StaticEffectRegistry,
): CardInstanceId[] {
  return getOpposingCardsInPlay(ctx).filter((candidateId) => {
    const runtimeCard = getCardsApi(ctx).get(candidateId);
    if (!runtimeCard || runtimeCard.ownerID !== ownerId || !isInPlayZone(runtimeCard.zoneID)) {
      return false;
    }

    const candidateDef = runtimeCard.definition;
    if (!isCharacterCard(candidateDef)) {
      return false;
    }

    const candidateMeta = getCardMeta(ctx, candidateId);
    if (candidateMeta.state !== "exerted") {
      return false;
    }

    if (!hasKeywordIncludingTemporary(ctx, candidateId, "Bodyguard", registry)) {
      return false;
    }

    if (cantBeChallenged(ctx, candidateId)) {
      return false;
    }

    if (
      hasKeywordIncludingTemporary(ctx, candidateId, "Evasive", registry) &&
      !canChallengeEvasive(ctx, attackerId, registry)
    ) {
      return false;
    }

    return true;
  });
}

function hasMandatoryBodyguardTarget(
  ctx: ChallengeIntentContext,
  attackerId: CardInstanceId,
  defenderOwnerId: PlayerId,
  registry: StaticEffectRegistry,
): boolean {
  return getBodyguardCandidatesForOwner(ctx, attackerId, defenderOwnerId, registry).length > 0;
}

function violatesBodyguardIfAbleRestriction(
  ctx: ChallengeIntentContext,
  attackerId: CardInstanceId,
  defenderDef: CharacterCard | LocationCard,
  defenderId: CardInstanceId,
  defenderOwnerId: PlayerId,
  registry: StaticEffectRegistry,
): boolean {
  // Locations are never subject to Bodyguard — the restriction only applies when
  // challenging characters. A character with Bodyguard does not protect locations.
  if (isLocationCard(defenderDef)) {
    return false;
  }

  if (
    isCharacterCard(defenderDef) &&
    hasKeywordIncludingTemporary(ctx, defenderId, "Bodyguard", registry)
  ) {
    return false;
  }

  return hasMandatoryBodyguardTarget(ctx, attackerId, defenderOwnerId, registry);
}

function isLegalDefenderForAttacker(
  ctx: ChallengeIntentContext,
  attackerId: CardInstanceId,
  defenderId: CardInstanceId,
  registry: StaticEffectRegistry,
): boolean {
  const attackerDef = getCardDefinition(ctx, attackerId);
  if (!attackerDef || !isCharacterCard(attackerDef)) {
    return false;
  }

  if (!isChallengeReadyAttacker(ctx, attackerId)) {
    return false;
  }

  const defenderRuntime = getCardsApi(ctx).get(defenderId);
  if (!defenderRuntime || !isInPlayZone(defenderRuntime.zoneID)) {
    return false;
  }

  const defenderDef = defenderRuntime.definition;
  if (!(isCharacterCard(defenderDef) || isLocationCard(defenderDef))) {
    return false;
  }

  if (cantBeChallenged(ctx, defenderId, attackerId)) {
    return false;
  }

  const defenderOwnerId = defenderRuntime.ownerID as PlayerId;
  if (
    violatesBodyguardIfAbleRestriction(
      ctx,
      attackerId,
      defenderDef,
      defenderId,
      defenderOwnerId,
      registry,
    )
  ) {
    return false;
  }

  if (isCharacterCard(defenderDef)) {
    const defenderMeta = getCardMeta(ctx, defenderId);
    if (
      defenderMeta.state !== "exerted" &&
      !canChallengeReadyCharacters(ctx, attackerId, defenderId)
    ) {
      return false;
    }
  }

  if (
    hasKeywordIncludingTemporary(ctx, defenderId, "Evasive", registry) &&
    !canChallengeEvasive(ctx, attackerId, registry)
  ) {
    return false;
  }

  return true;
}

export function getLegalChallengeDefendersForAttacker(
  ctx: ChallengeIntentContext,
  attackerId: CardInstanceId,
): CardInstanceId[] {
  const registry = getOrBuildMoveRegistry(ctx);
  return getOpposingCardsInPlay(ctx)
    .filter((cardId) => {
      const runtimeCard = getCardsApi(ctx).get(cardId);
      return Boolean(runtimeCard && isInPlayZone(runtimeCard.zoneID));
    })
    .filter((defenderId) => isLegalDefenderForAttacker(ctx, attackerId, defenderId, registry));
}

export function getEligibleChallengeAttackers(ctx: ChallengeIntentContext): CardInstanceId[] {
  return getControlledCardsInPlay(ctx)
    .filter((cardId) => {
      const runtimeCard = getCardsApi(ctx).get(cardId);
      return Boolean(runtimeCard && isInPlayZone(runtimeCard.zoneID));
    })
    .filter((cardId) => {
      const cardDef = getCardDefinition(ctx, cardId);
      return Boolean(cardDef && isCharacterCard(cardDef));
    })
    .filter((cardId) => isChallengeReadyAttacker(ctx, cardId))
    .filter((cardId) => getLegalChallengeDefendersForAttacker(ctx, cardId).length > 0);
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

export function validateChallengeAction(ctx: ChallengeValidationContext): RuntimeValidationResult {
  const { attackerId, defenderId } = ctx.args;
  const isPreflight = ctx.validationMode === "preflight";

  const controlledCardsInPlay = getControlledCardsInPlay(ctx);
  if (!controlledCardsInPlay.includes(attackerId)) {
    return createFailure("Attacker not in your play zone", "ATTACKER_NOT_IN_PLAY");
  }

  const attackerDef = getCardDefinition(ctx, attackerId);
  if (!attackerDef || !isCharacterCard(attackerDef)) {
    return createFailure("Only characters can challenge", "ATTACKER_NOT_CHARACTER");
  }

  const attackerMeta = getCardMeta(ctx, attackerId);
  if (!isReady(attackerMeta)) {
    return createFailure("Attacker is exerted", "ATTACKER_EXERTED");
  }

  const currentTurn = getCurrentTurn(ctx);
  const attackerControllerId = getCardsApi(ctx).require(attackerId).controllerID as
    | PlayerId
    | undefined;
  const registry = getOrBuildMoveRegistry(ctx);
  if (
    attackerControllerId &&
    hasTemporaryPlayerRestriction(
      ctx.G.temporaryPlayerRestrictions,
      attackerControllerId,
      currentTurn,
      "cant-challenge",
    )
  ) {
    return createFailure("Attacker cannot challenge", "ATTACKER_CANT_CHALLENGE");
  }

  if (
    hasTemporaryRestriction(attackerMeta, currentTurn, "cant-challenge", {
      isSourceInPlay: (sourceId) => isCardInPlayZone(ctx, sourceId),
    })
  ) {
    return createFailure("Attacker cannot challenge", "ATTACKER_CANT_CHALLENGE");
  }

  if (
    hasStaticSelfRestriction({
      state: ctx.framework.state,
      cardId: attackerId,
      restriction: "cant-challenge",
      getDefinitionByInstanceId: (instanceId) => getCardsApi(ctx).getDefinition(instanceId),
    })
  ) {
    const bypass = getStaticSelfRestrictionBypass({
      state: ctx.framework.state,
      cardId: attackerId,
      restriction: "cant-challenge",
      getDefinitionByInstanceId: (instanceId) => getCardsApi(ctx).getDefinition(instanceId),
    });
    if (!bypass) {
      return createFailure("Attacker cannot challenge", "ATTACKER_CANT_CHALLENGE");
    }
    if (!attackerControllerId || getAvailableInk(ctx, attackerControllerId) < bypass.cost.ink) {
      return createFailure(
        "Not enough ink to pay the challenge bypass cost",
        "ATTACKER_CANT_CHALLENGE",
      );
    }
  }

  if (
    hasStaticCardRestriction({
      state: ctx.framework.state,
      cardId: attackerId,
      restriction: "cant-challenge",
      registry,
    })
  ) {
    return createFailure("Attacker cannot challenge", "ATTACKER_CANT_CHALLENGE");
  }

  if (
    attackerControllerId &&
    hasStaticPlayerRestriction({
      state: ctx.framework.state,
      playerId: attackerControllerId,
      restriction: "cant-challenge",
      registry,
    })
  ) {
    return createFailure("Attacker cannot challenge", "ATTACKER_CANT_CHALLENGE");
  }

  if (attackerMeta.isDrying === true && !hasRushForChallenge(ctx, attackerId, registry)) {
    return createFailure("Attacker is drying and does not have Rush", "ATTACKER_DRYING");
  }

  if (hasExceededChallengeLimit(ctx, attackerId)) {
    return createFailure(
      "Challenge limit reached: only one character can challenge this turn",
      "CHALLENGE_LIMIT_REACHED",
    );
  }

  if (isPreflight && !defenderId) {
    return { valid: true };
  }

  const opposingCardsInPlay = getOpposingCardsInPlay(ctx);
  if (!opposingCardsInPlay.includes(defenderId)) {
    return createFailure("Defender not in an opponent's play zone", "DEFENDER_NOT_IN_PLAY");
  }

  const defenderRuntime = getCardsApi(ctx).get(defenderId);
  if (!defenderRuntime || !isInPlayZone(defenderRuntime.zoneID)) {
    return createFailure("Defender not in play", "DEFENDER_NOT_IN_PLAY");
  }

  const defenderDef = defenderRuntime.definition;
  if (!(isCharacterCard(defenderDef) || isLocationCard(defenderDef))) {
    return createFailure(
      "Defender must be an opposing character or location",
      "DEFENDER_INVALID_TYPE",
    );
  }

  if (cantBeChallenged(ctx, defenderId, attackerId)) {
    return createFailure("Defender can't be challenged", "DEFENDER_CANT_BE_CHALLENGED");
  }

  if (isCharacterCard(defenderDef)) {
    const defenderMeta = getCardMeta(ctx, defenderId);
    if (
      defenderMeta.state !== "exerted" &&
      !canChallengeReadyCharacters(ctx, attackerId, defenderId)
    ) {
      return createFailure("Defending character must be exerted", "DEFENDER_CHARACTER_NOT_EXERTED");
    }
  }

  if (
    hasKeywordIncludingTemporary(ctx, defenderId, "Evasive", registry) &&
    !canChallengeEvasive(ctx, attackerId, registry)
  ) {
    return createFailure(
      "Defender has Evasive and attacker cannot challenge Evasive characters",
      "DEFENDER_EVASIVE_RESTRICTION",
    );
  }

  const defenderOwnerId = defenderRuntime.ownerID as PlayerId;
  if (
    violatesBodyguardIfAbleRestriction(
      ctx,
      attackerId,
      defenderDef,
      defenderId,
      defenderOwnerId,
      registry,
    )
  ) {
    return createFailure(
      "A Bodyguard character must be challenged if able",
      "DEFENDER_BODYGUARD_RESTRICTION",
    );
  }

  return { valid: true };
}

function resolveConditionalKeywordValueTODO(
  _cardDef: CharacterCard | LocationCard,
  _keyword: "Challenger" | "Resist",
): number {
  // TODO: integrate condition-aware keyword evaluation (conditional Challenger/Resist from
  // ability conditions).
  return 0;
}

function resolveDynamicCombatModifierTODO(_cardId: CardInstanceId): {
  strengthModifier: number;
  damageIncrease: number;
  damageReduction: number;
} {
  // TODO: integrate dynamic non-keyword combat modifiers from continuous/replacement effects.
  return {
    strengthModifier: 0,
    damageIncrease: 0,
    damageReduction: 0,
  };
}

function resolveChallengeStrength(
  ctx: ChallengeCardStateContext,
  card: RuntimeLorcanaCardWithDerived,
  challenging: boolean,
  challengeContext: { attackerId: CardInstanceId; defenderId: CardInstanceId },
  registry: import("../../rules/static-effect-registry").StaticEffectRegistry,
): number {
  const cardDef = card.definition;
  if (!isCharacterCard(cardDef)) {
    return 0;
  }

  // Build a challenge-aware G so that "while being challenged/challenging" static
  // conditions (type: "in-challenge") resolve correctly during strength projection.
  let projectionG = ctx.G;
  if (challengeContext) {
    const attackerEntry =
      ctx.framework.state._zonesPrivate?.cardIndex?.[challengeContext.attackerId];
    const defenderEntry =
      ctx.framework.state._zonesPrivate?.cardIndex?.[challengeContext.defenderId];
    const syntheticChallengeState: ChallengeState = {
      attacker: challengeContext.attackerId,
      defender: challengeContext.defenderId,
      attackerOwnerId: (attackerEntry?.controllerID ?? attackerEntry?.ownerID ?? "") as PlayerId,
      defenderOwnerId: (defenderEntry?.controllerID ?? defenderEntry?.ownerID ?? "") as PlayerId,
      stage: "damage",
    };
    projectionG = { ...ctx.G, challengeState: syntheticChallengeState };
  }

  const derived = projectLorcanaCardDerived({
    definition: card.definition,
    meta: card.meta,
    state: createProjectionState(ctx.framework.state, projectionG),
    cardInstanceId: card.instanceId as CardInstanceId,
    ownerID: card.ownerID as PlayerId,
    controllerID: card.controllerID as PlayerId,
    zoneID: card.zoneID,
    getDefinitionByInstanceId: (instanceId) => getCardDefinition(ctx, instanceId),
    registry,
  });
  const challengerBonus = challenging ? (derived.keywordValues?.challenger ?? 0) : 0;

  const dynamic = resolveDynamicCombatModifierTODO(card.instanceId as CardInstanceId);

  // Check for "damage source stat override" — e.g. Dale's SPIKE SUIT makes
  // the character deal damage with their {W} instead of their {S} during a
  // challenge. The override replaces the strength contribution, including
  // Challenger and other {S} modifiers.
  const overrides = getEffectsForCard(
    registry,
    card.instanceId as CardInstanceId,
    "damage-source-stat-override",
  );
  let damageStat: number;
  let challengerContribution = challengerBonus;
  if (overrides.length > 0) {
    challengerContribution = 0;
    // If multiple overrides apply, prefer the highest resulting value so that
    // a character benefits from the most favorable substitution.
    damageStat = overrides.reduce((best, effect) => {
      const stat = effect.payload.stat as "willpower" | "lore";
      const value = stat === "willpower" ? (derived.willpower ?? 0) : (derived.lore ?? 0);
      return Math.max(best, value);
    }, 0);
  } else {
    // Use derived.strength (which includes static modify-stat effects with in-challenge
    // conditions evaluated against the synthetic challengeState) instead of the
    // pre-projected card strength to correctly handle "while being challenged" bonuses.
    damageStat = derived.strength ?? (card as LorcanaRuntimeCard).strength;
  }
  const dynamicStrengthContribution = overrides.length > 0 ? 0 : dynamic.strengthModifier;
  const totalStrength = damageStat + challengerContribution + dynamicStrengthContribution;

  return Math.max(0, totalStrength);
}

function reduceDamageByResist(
  ctx: ChallengeCardStateContext,
  targetId: CardInstanceId,
  targetDef: CharacterCard | LocationCard,
  incomingDamage: number,
  registry: import("../../rules/static-effect-registry").StaticEffectRegistry,
): number {
  const dynamic = resolveDynamicCombatModifierTODO(targetId);
  const runtimeCard = getCardsApi(ctx).require(targetId);
  const derived = projectLorcanaCardDerived({
    definition: runtimeCard.definition,
    meta: runtimeCard.meta,
    state: createProjectionState(ctx.framework.state, ctx.G),
    cardInstanceId: targetId,
    ownerID: runtimeCard.ownerID as PlayerId,
    controllerID: runtimeCard.controllerID as PlayerId,
    zoneID: runtimeCard.zoneID,
    getDefinitionByInstanceId: (instanceId) => getCardDefinition(ctx, instanceId),
    registry,
  });
  const resistValue = (derived.keywordValues?.resist ?? 0) + dynamic.damageReduction;

  const reduced = incomingDamage + dynamic.damageIncrease - Math.max(0, resistValue);
  return Math.max(0, reduced);
}

export function finalizeChallengeDamageAmount(
  ctx: ChallengeCardStateContext,
  targetId: CardInstanceId,
  targetDef: CharacterCard | LocationCard,
  incomingDamage: number,
  opponentCardId: CardInstanceId | undefined,
  registry: import("../../rules/static-effect-registry").StaticEffectRegistry,
): number {
  const reduced = reduceDamageByResist(ctx, targetId, targetDef, incomingDamage, registry);
  if (takesNoDamageFromChallenges(ctx, targetId, opponentCardId)) {
    return 0;
  }

  // Check registry for "cant-be-dealt-damage" restriction.
  // The registry is built with a synthetic challengeState so that "being-challenged"
  // (defender only) resolves correctly: only the challenged card matches, so for
  // "unless being challenged" damage prevention, the attacker's "NOT being-challenged"
  // stays true and the restriction can remain active while the defender's does not.
  if (
    hasStaticCardRestriction({
      state: ctx.framework.state as Parameters<typeof hasStaticCardRestriction>[0]["state"],
      cardId: targetId,
      restriction: "cant-be-dealt-damage",
      registry,
    })
  ) {
    return 0;
  }

  return reduced;
}

export interface ChallengeDamageResult {
  rawAttackerToDefenderDamage: number;
  rawDefenderToAttackerDamage: number;
  attackerToDefenderDamage: number;
  defenderToAttackerDamage: number;
  attackerCurrentDamage: number;
  defenderCurrentDamage: number;
  attackerNextDamage: number;
  defenderNextDamage: number;
  attackerWillpower: number;
  defenderWillpower: number;
  attackerLethal: boolean;
  defenderLethal: boolean;
  attackerDamageIsReduced: boolean;
  defenderDamageIsReduced: boolean;
  attackerDefinition: CharacterCard;
  defenderDefinition: CharacterCard | LocationCard;
}

export function computeChallengeDamageResult(
  ctx: ChallengeCardStateContext,
  attackerId: CardInstanceId,
  defenderId: CardInstanceId,
): ChallengeDamageResult {
  const attackerRuntime = getCardsApi(ctx).get(attackerId);
  const defenderRuntime = getCardsApi(ctx).get(defenderId);
  const attackerDef = attackerRuntime?.definition;
  const defenderDef = defenderRuntime?.definition;

  if (!attackerDef || !isCharacterCard(attackerDef)) {
    throw new Error(`Invalid challenge attacker '${attackerId}': expected a character in play`);
  }
  if (!defenderDef || !(isCharacterCard(defenderDef) || isLocationCard(defenderDef))) {
    throw new Error(
      `Invalid challenge defender '${defenderId}': expected an opposing character or location`,
    );
  }

  const attackerMeta = getCardMeta(ctx, attackerId);
  const defenderMeta = getCardMeta(ctx, defenderId);

  const attackerCurrentDamage = Number(attackerMeta.damage ?? 0);
  const defenderCurrentDamage = Number(defenderMeta.damage ?? 0);

  if (!attackerRuntime || !defenderRuntime) {
    throw new Error("Challenge combatants are unavailable in runtime card query");
  }

  const challengeContext = { attackerId, defenderId };
  // Build a challenge-aware registry so "in-challenge" static conditions resolve correctly.
  const attackerIndexEntry = ctx.framework.state._zonesPrivate?.cardIndex?.[attackerId];
  const defenderIndexEntry = ctx.framework.state._zonesPrivate?.cardIndex?.[defenderId];
  const syntheticChallengeStateForRegistry: ChallengeState = {
    attacker: attackerId,
    defender: defenderId,
    attackerOwnerId: (attackerIndexEntry?.controllerID ??
      attackerIndexEntry?.ownerID ??
      "") as PlayerId,
    defenderOwnerId: (defenderIndexEntry?.controllerID ??
      defenderIndexEntry?.ownerID ??
      "") as PlayerId,
    stage: "damage",
  };
  // The registry must reflect a *hypothetical* G with `challengeState.stage =
  // "damage"` so that "in-challenge" static conditions resolve as if the
  // declared challenge were already in damage stage. The cached registry
  // (keyed off the live `ctx.G.staticEffectsVersion`) reflects the actual G,
  // not this synthetic. Therefore `getOrBuildMoveRegistry(ctx)` is *not*
  // appropriate here — keep the direct fresh build.
  const syntheticGForRegistry = { ...ctx.G, challengeState: syntheticChallengeStateForRegistry };
  const registry = buildStaticEffectRegistry(
    createProjectionState(ctx.framework.state, syntheticGForRegistry),
    (instanceId) => getCardDefinition(ctx, instanceId),
  );
  const attackerStrength = resolveChallengeStrength(
    ctx,
    attackerRuntime,
    true,
    challengeContext,
    registry,
  );
  const defenderStrength = isCharacterCard(defenderDef)
    ? resolveChallengeStrength(ctx, defenderRuntime, false, challengeContext, registry)
    : 0;

  const rawAttackerToDefenderDamage = attackerStrength;
  const rawDefenderToAttackerDamage = isCharacterCard(defenderDef) ? defenderStrength : 0;

  const attackerOwnerId = syntheticChallengeStateForRegistry.attackerOwnerId;
  const defenderOwnerId = syntheticChallengeStateForRegistry.defenderOwnerId;

  // Simulate replacement effects (prevent-damage, redirect-damage) without consuming them,
  // so the preview reflects what the actual challenge execution would produce.
  const defenderPreviewEvent = previewReplacementEffects(ctx as unknown as ReplacementContext, {
    kind: "challenge-damage" as const,
    eventId: `preview-challenge-damage:${attackerId}:${defenderId}:defender`,
    sourceId: attackerId,
    controllerId: attackerOwnerId,
    attackerId,
    defenderId,
    targetId: defenderId,
    amount: rawAttackerToDefenderDamage,
  });
  const attackerPreviewEvent = previewReplacementEffects(ctx as unknown as ReplacementContext, {
    kind: "challenge-damage" as const,
    eventId: `preview-challenge-damage:${attackerId}:${defenderId}:attacker`,
    sourceId: defenderId,
    controllerId: defenderOwnerId,
    attackerId,
    defenderId,
    targetId: attackerId,
    amount: rawDefenderToAttackerDamage,
  });

  const finalDefenderTargetId = defenderPreviewEvent.targetId;
  const finalDefenderTargetDef = getCardsApi(ctx).getDefinition(finalDefenderTargetId) as
    | CharacterCard
    | LocationCard
    | undefined;
  const finalAttackerTargetId = attackerPreviewEvent.targetId;
  const finalAttackerTargetDef = getCardsApi(ctx).getDefinition(finalAttackerTargetId) as
    | CharacterCard
    | undefined;

  const attackerToDefenderDamage =
    finalDefenderTargetDef &&
    (isCharacterCard(finalDefenderTargetDef) || isLocationCard(finalDefenderTargetDef))
      ? finalizeChallengeDamageAmount(
          ctx,
          finalDefenderTargetId,
          finalDefenderTargetDef,
          defenderPreviewEvent.amount,
          attackerId,
          registry,
        )
      : 0;
  const defenderToAttackerDamage =
    isCharacterCard(defenderDef) &&
    finalAttackerTargetDef &&
    isCharacterCard(finalAttackerTargetDef)
      ? finalizeChallengeDamageAmount(
          ctx,
          finalAttackerTargetId,
          finalAttackerTargetDef,
          attackerPreviewEvent.amount,
          defenderId,
          registry,
        )
      : 0;

  const attackerNextDamage = attackerCurrentDamage + defenderToAttackerDamage;
  const defenderNextDamage = defenderCurrentDamage + attackerToDefenderDamage;

  const attackerWillpower = (attackerRuntime as LorcanaRuntimeCard).willpower;
  const defenderWillpower = (defenderRuntime as LorcanaRuntimeCard).willpower;

  const attackerLethal = attackerWillpower > 0 && attackerNextDamage >= attackerWillpower;
  const defenderLethal = defenderWillpower > 0 && defenderNextDamage >= defenderWillpower;

  const defenderDamageIsReduced = attackerToDefenderDamage < rawAttackerToDefenderDamage;
  const attackerDamageIsReduced = defenderToAttackerDamage < rawDefenderToAttackerDamage;

  return {
    rawAttackerToDefenderDamage,
    rawDefenderToAttackerDamage,
    attackerToDefenderDamage,
    defenderToAttackerDamage,
    attackerCurrentDamage,
    defenderCurrentDamage,
    attackerNextDamage,
    defenderNextDamage,
    attackerWillpower,
    defenderWillpower,
    attackerLethal,
    defenderLethal,
    attackerDamageIsReduced,
    defenderDamageIsReduced,
    attackerDefinition: attackerDef,
    defenderDefinition: defenderDef,
  };
}
