import type { CardInstanceId, PlayerId } from "#core";
import type {
  CardSelectionFilter,
  ChosenCardCostMaxCostConstraint,
  Condition,
  LorcanaCardDefinition,
  PlayCardEffect,
} from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import type {
  ActionEffectResolutionOptions,
  ActionResolutionInput,
  PlayCardExecutionContext,
} from "./types";
import { handleUnsupportedActionEffect } from "./unsupported-action-effect";
import { matchesCardFilterArray } from "./card-filter-match-utils";
import { isDiscardZoneKey, recordDiscardExitThisTurn } from "../../state/turn-metrics";
import { resolveTargetPlayerIds } from "./player-target-resolver";
import {
  addTemporaryKeyword,
  hasTemporaryPlayerRestriction,
  resolveTemporaryEffectWindow,
} from "../../effects/temporary-effects";
import {
  emitTriggeredLorcanaEvent,
  flushTriggeredEventsToBag,
  registerAbility,
} from "../../effects/triggered-abilities";
import { resolveActionCardEffects } from "../action-effect-resolver";
import {
  finalizeResolvedActionCard,
  hasPendingActionEffectResolution,
  moveSuspendedActionCardToLimbo,
} from "./pending-action-effects";
import {
  getShiftRules,
  payBasicCost,
  resolveShiftTargetCandidates,
  validateBasicCost,
} from "../../rules/play-card-rules";
import { executeShiftPlay } from "../../shared/execute-shift-play";
import {
  evaluateStaticCondition,
  hasStaticCardRestriction,
} from "../../rules/static-ability-utils";
import { getOrBuildMoveRegistry } from "../../rules/move-registry-cache";
import type { StaticEffectRegistry } from "../../../rules/static-effect-registry";
import { createProjectionState } from "../../../rules/derived-state";
import {
  getAppliedCostReductions,
  getStaticCostIncreaseAmount,
} from "../../../rules/derived-state";
import {
  clearCurrentSelectionTargets,
  getCombinedSelectionInput,
  getContextSelectionTargets,
  getCurrentSelectionInput,
  getEffectTargetSelectionInput,
} from "./selection-state";

type CardDefinitionLike = {
  actionSubtype?: string;
  abilities?: unknown[];
  cardType?: "character" | "item" | "location" | "action";
  classifications?: string[];
  cost?: number;
  name?: string;
};

type PlayCardFilterLike = CardSelectionFilter;

type PlayCardTypeConstraint = CardDefinitionLike["cardType"] | "song" | "floodborn";

type PlayerTargetLike = Parameters<typeof resolveTargetPlayerIds>[2];

function hasBodyguardKeyword(definition: CardDefinitionLike): boolean {
  return Array.isArray(definition.abilities)
    ? definition.abilities.some(
        (ability) =>
          typeof ability === "object" &&
          ability !== null &&
          "keyword" in ability &&
          (ability as { keyword?: unknown }).keyword === "Bodyguard",
      )
    : false;
}

export function isPlayCardEffect(effect: unknown): effect is PlayCardEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "play-card"
  );
}

function normalizeSelectedTargets(targets: ActionResolutionInput["targets"]): CardInstanceId[] {
  if (!targets) {
    return [];
  }

  if (Array.isArray(targets)) {
    return [
      ...new Set(
        targets.filter((targetId): targetId is CardInstanceId => typeof targetId === "string"),
      ),
    ];
  }

  return typeof targets === "string" ? [targets as CardInstanceId] : [];
}

function isPlayerTargetLike(target: unknown): target is PlayerTargetLike {
  return (
    target === "SELF" ||
    target === "CONTROLLER" ||
    target === "OPPONENT" ||
    target === "OPPONENTS" ||
    target === "EACH_PLAYER" ||
    target === "EACH_OPPONENT" ||
    target === "ALL_PLAYERS" ||
    target === "CHOSEN_PLAYER" ||
    target === "CURRENT_TURN"
  );
}

/**
 * Returns true when the play-card filter relies on runtime context from a prior
 * sequence step (e.g. the cost or identity of a previously chosen card) and
 * therefore requires an explicit player selection from hand rather than
 * auto-selection.  A filter with a static `name` field, by contrast, can
 * unambiguously identify the card to play and does not need explicit selection.
 */
function isContextDependentPlayCardFilter(effect: PlayCardEffect): boolean {
  const filter =
    effect.filter &&
    !Array.isArray(effect.filter) &&
    !("type" in effect.filter && typeof effect.filter.type === "string")
      ? (effect.filter as PlayCardFilterLike)
      : undefined;

  if (!filter) {
    return false;
  }

  // Filters that reference a previously chosen card's cost or identity are context-dependent.
  if (
    filter.maxCost === "chosen-card-cost" ||
    (typeof filter.maxCost === "object" &&
      filter.maxCost !== null &&
      (filter.maxCost as { type?: unknown }).type === "chosen-card-cost") ||
    filter.excludeChosenCard === true ||
    filter.sameNameAsChosenCard === true
  ) {
    return true;
  }

  return false;
}

function isDeterministicNameRestrictedPlayCardFilter(effect: PlayCardEffect): boolean {
  const filter =
    effect.filter &&
    !Array.isArray(effect.filter) &&
    !("type" in effect.filter && typeof effect.filter.type === "string")
      ? (effect.filter as PlayCardFilterLike)
      : undefined;

  return (
    typeof filter?.name === "string" ||
    filter?.sameNameAsChosenCard === true ||
    filter?.sameInstanceAsSource === true
  );
}

function resolveSourceCards(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: PlayCardEffect,
  resolutionInput: ActionResolutionInput,
  sourcePlayerId: PlayerId,
  selectedTargets: CardInstanceId[],
): CardInstanceId[] {
  const from = effect.from ?? "hand";
  const hasExplicitTargetSelection = selectedTargets.length > 0;

  if (from === "revealed") {
    const revealedCards =
      (resolutionInput.eventSnapshot?.revealedCardIds as CardInstanceId[] | undefined) ?? [];
    if (hasExplicitTargetSelection) {
      const revealedSet = new Set(revealedCards);
      const selectedRevealed = selectedTargets.filter((cardId) => revealedSet.has(cardId));
      return selectedRevealed;
    }

    return revealedCards;
  }

  if (from === "under-self") {
    const cardsUnder = ctx.cards.require(cardPlayed.cardId).meta?.cardsUnder as
      | CardInstanceId[]
      | undefined;
    const underCards = Array.isArray(cardsUnder) ? [...cardsUnder] : [];
    if (hasExplicitTargetSelection) {
      const underSet = new Set(underCards);
      const selectedUnder = selectedTargets.filter((cardId) => underSet.has(cardId));
      return selectedUnder;
    }

    return underCards;
  }

  if (from === "discard" || from === "inkwell") {
    const cardsInZone = ctx.framework.zones.getCards({
      zone: from,
      playerId: sourcePlayerId,
    }) as CardInstanceId[];
    if (hasExplicitTargetSelection) {
      const zoneSet = new Set(cardsInZone);
      const selectedInZone = selectedTargets.filter((cardId) => zoneSet.has(cardId));
      return selectedInZone;
    }

    return cardsInZone;
  }

  if (from === "deck" || from === "hand") {
    if (from === "hand" && !hasExplicitTargetSelection) {
      // When there are context targets (from prior sequence steps), block auto-play
      // unless the filter unambiguously identifies the card by name. Context-dependent
      // filters (e.g. maxCost: "chosen-card-cost", excludeChosenCard) require the
      // player to make an explicit selection.
      const contextTargets = getContextSelectionTargets(resolutionInput);
      if (contextTargets.length > 0 && isContextDependentPlayCardFilter(effect)) {
        return [];
      }
    }

    const cardsInZone = ctx.framework.zones.getCards({
      zone: from,
      playerId: sourcePlayerId,
    }) as CardInstanceId[];
    if (hasExplicitTargetSelection) {
      const zoneSet = new Set(cardsInZone);
      const selectedInZone = selectedTargets.filter((cardId) => zoneSet.has(cardId));
      return selectedInZone;
    }

    return cardsInZone;
  }

  // Array of zones: collect cards from each listed zone and merge them.
  // Explicit target selection is validated against the combined pool.
  if (Array.isArray(from)) {
    const supportedZones = from.filter(
      (zone): zone is "hand" | "discard" | "deck" | "inkwell" =>
        zone === "hand" || zone === "discard" || zone === "deck" || zone === "inkwell",
    );
    const allCards: CardInstanceId[] = [];
    for (const zone of supportedZones) {
      const zoneCards = ctx.framework.zones.getCards({
        zone,
        playerId: sourcePlayerId,
      }) as CardInstanceId[];
      allCards.push(...zoneCards);
    }
    if (hasExplicitTargetSelection) {
      const allCardsSet = new Set(allCards);
      return selectedTargets.filter((cardId) => allCardsSet.has(cardId));
    }
    return allCards;
  }

  handleUnsupportedActionEffect("play-card", `Unsupported source "${from}"`);
  return [];
}

function matchesPlayCardTypeConstraint(
  definition: CardDefinitionLike,
  expectedType: PlayCardTypeConstraint | undefined,
): boolean {
  if (!expectedType) {
    return true;
  }

  if (expectedType === "song") {
    return definition.cardType === "action" && definition.actionSubtype === "song";
  }

  if (expectedType === "floodborn") {
    return (definition.classifications ?? []).includes("Floodborn");
  }

  return definition.cardType === expectedType;
}

function resolveFilterMaxCost(
  ctx: PlayCardExecutionContext,
  filter: PlayCardFilterLike | undefined,
  resolutionInput: ActionResolutionInput,
): number | undefined {
  const maxCost = filter?.maxCost;
  if (typeof maxCost === "number") {
    return maxCost;
  }

  if (maxCost === "chosen-card-cost") {
    const chosenCardCost = resolutionInput.eventSnapshot?.chosenCardCost;
    if (typeof chosenCardCost === "number" && Number.isFinite(chosenCardCost)) {
      return chosenCardCost;
    }

    const chosenCardId = resolutionInput.eventSnapshot?.chosenCardId as CardInstanceId | undefined;
    if (!chosenCardId) {
      return undefined;
    }

    const chosenDefinition = ctx.cards.getDefinition(chosenCardId) as
      | CardDefinitionLike
      | undefined;
    return typeof chosenDefinition?.cost === "number" ? chosenDefinition.cost : undefined;
  }

  if (
    !maxCost ||
    typeof maxCost !== "object" ||
    (maxCost as ChosenCardCostMaxCostConstraint).type !== "chosen-card-cost"
  ) {
    return undefined;
  }

  const resolvedChosenCardCost =
    typeof resolutionInput.eventSnapshot?.chosenCardCost === "number" &&
    Number.isFinite(resolutionInput.eventSnapshot.chosenCardCost)
      ? resolutionInput.eventSnapshot.chosenCardCost
      : undefined;
  const offset =
    typeof maxCost.offset === "number" && Number.isFinite(maxCost.offset) ? maxCost.offset : 0;
  if (resolvedChosenCardCost !== undefined) {
    return resolvedChosenCardCost + offset;
  }

  const chosenCardId = resolutionInput.eventSnapshot?.chosenCardId as CardInstanceId | undefined;
  if (!chosenCardId) {
    return undefined;
  }
  const chosenDefinition = ctx.cards.getDefinition(chosenCardId) as CardDefinitionLike | undefined;
  return typeof chosenDefinition?.cost === "number" ? chosenDefinition.cost + offset : undefined;
}

function matchesPlayCardFilter(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  cardId: CardInstanceId,
  definition: CardDefinitionLike,
  filter: PlayCardFilterLike | undefined,
  resolutionInput: ActionResolutionInput,
): boolean {
  if (!filter) {
    return true;
  }

  if (!matchesPlayCardTypeConstraint(definition, filter.cardType)) {
    return false;
  }

  const resolvedMaxCost = resolveFilterMaxCost(ctx, filter, resolutionInput);
  if (typeof resolvedMaxCost === "number") {
    const cost = Number(definition.cost ?? Number.NaN);
    if (!Number.isFinite(cost) || cost > resolvedMaxCost) {
      return false;
    }
  }

  if (typeof filter.classification === "string") {
    const classifications = definition.classifications ?? [];
    if (!classifications.includes(filter.classification)) {
      return false;
    }
  }

  if (typeof filter.name === "string" && definition.name !== filter.name) {
    return false;
  }

  if (filter.sameNameAsSource === true) {
    const sourceDefinition = ctx.cards.getDefinition(cardPlayed.cardId) as
      | CardDefinitionLike
      | undefined;
    if (!sourceDefinition?.name || definition.name !== sourceDefinition.name) {
      return false;
    }
  }

  if (filter.sameNameAsChosenCard === true) {
    const chosenCardId = resolutionInput.eventSnapshot?.chosenCardId as CardInstanceId | undefined;
    if (!chosenCardId) {
      return false;
    }
    const chosenDefinition = ctx.cards.getDefinition(chosenCardId) as
      | CardDefinitionLike
      | undefined;
    if (!chosenDefinition?.name || definition.name !== chosenDefinition.name) {
      return false;
    }
  }

  if (filter.sameInstanceAsSource === true && cardId !== cardPlayed.cardId) {
    return false;
  }

  if (filter.excludeChosenCard === true) {
    const chosenCardId = resolutionInput.eventSnapshot?.chosenCardId as CardInstanceId | undefined;
    if (chosenCardId && chosenCardId === cardId) {
      return false;
    }
  }

  return true;
}

function matchesPlayableCardCriteria(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  cardId: CardInstanceId,
  effect: PlayCardEffect,
  resolutionInput: ActionResolutionInput,
): boolean {
  const definition = ctx.cards.getDefinition(cardId) as CardDefinitionLike | undefined;
  if (!definition) {
    return false;
  }

  if (!matchesPlayCardTypeConstraint(definition, effect.cardType)) {
    return false;
  }

  if (effect.costRestriction) {
    const restriction = effect.costRestriction;
    if (
      typeof restriction !== "object" ||
      restriction === null ||
      !("comparison" in restriction) ||
      !("value" in restriction) ||
      typeof (restriction as { comparison?: unknown }).comparison !== "string" ||
      typeof (restriction as { value?: unknown }).value !== "number"
    ) {
      return false;
    }
    const { comparison, value } = restriction as {
      comparison: string;
      value: number;
    };
    const cardCost = Number(definition.cost ?? Number.NaN);
    if (!Number.isFinite(cardCost)) return false;
    if (comparison === "less-or-equal" && cardCost > value) return false;
    if (comparison === "less-than" && cardCost >= value) return false;
    if (comparison === "equal" && cardCost !== value) return false;
    if (comparison === "greater-than" && cardCost <= value) return false;
    if (comparison === "greater-or-equal" && cardCost < value) return false;
  }

  const filter =
    effect.filter &&
    !Array.isArray(effect.filter) &&
    !("type" in effect.filter && typeof effect.filter.type === "string")
      ? (effect.filter as CardSelectionFilter)
      : undefined;

  if (!matchesPlayCardFilter(ctx, cardPlayed, cardId, definition, filter, resolutionInput)) {
    return false;
  }

  // Handle CardFilter[] format — e.g. [{ type: "has-keyword", keyword: "Shift" }]
  if (Array.isArray(effect.filter)) {
    if (
      !matchesCardFilterArray(
        effect.filter,
        definition as {
          abilities?: Array<{ type?: string; keyword?: string }>;
          classifications?: string[];
        },
      )
    ) {
      return false;
    }
  }

  return true;
}

export function getEntersWithDamageAmount(definition: CardDefinitionLike | undefined): number {
  if (!definition || definition.cardType !== "character" || !Array.isArray(definition.abilities)) {
    return 0;
  }

  return definition.abilities.reduce<number>((total, ability) => {
    if (!ability || typeof ability !== "object" || !("effect" in ability)) {
      return total;
    }

    const effect = (ability as { effect?: unknown }).effect;
    if (!effect || typeof effect !== "object" || Array.isArray(effect)) {
      return total;
    }

    if ((effect as { type?: unknown }).type !== "enters-with-damage") {
      return total;
    }

    const amount = Number((effect as { amount?: unknown }).amount ?? 0);
    return total + (Number.isFinite(amount) ? Math.max(0, amount) : 0);
  }, 0);
}

function initializePlayedCardMeta(
  ctx: PlayCardExecutionContext,
  cardId: CardInstanceId,
  definition: CardDefinitionLike,
  entersExerted: boolean,
  playedCostType: CardPlayedPayload["costType"],
): void {
  const cardType = definition.cardType;
  if (cardType === "character") {
    ctx.cards.setMeta(cardId, {
      state: entersExerted ? "exerted" : "ready",
      damage: getEntersWithDamageAmount(definition),
      isDrying: true,
      publicFaceState: undefined,
      atLocationId: undefined,
      cardsUnder: undefined,
      stackParentId: undefined,
      playedViaShift: false,
      playedCostType,
    });
    return;
  }

  // resolvePlayCardEffect rejects action cards before this is called, so this
  // branch is intentionally item/location-only and keeps character-only fields unset.
  ctx.cards.setMeta(cardId, {
    state: entersExerted ? "exerted" : undefined,
    damage: undefined,
    isDrying: undefined,
    publicFaceState: undefined,
    atLocationId: undefined,
    cardsUnder: undefined,
    stackParentId: undefined,
    playedViaShift: false,
    playedCostType,
  });
}

function cardEntersPlayExerted(
  ctx: PlayCardExecutionContext,
  cardId: CardInstanceId,
  definition: CardDefinitionLike,
  playerId: PlayerId,
  registry: StaticEffectRegistry,
): boolean {
  const state = {
    priority: ctx.framework.state.priority,
    status: ctx.framework.state.status,
    _zonesPrivate: ctx.framework.state._zonesPrivate,
    G: ctx.G,
  };
  const getDefinitionByInstanceId = (instanceId: CardInstanceId) =>
    ctx.cards.getDefinition(instanceId) as LorcanaCardDefinition | undefined;

  const selfRestricted = (definition.abilities ?? []).some((ability) => {
    if (
      typeof ability !== "object" ||
      ability === null ||
      !("type" in ability) ||
      ability.type !== "static" ||
      !("effect" in ability) ||
      typeof ability.effect !== "object" ||
      ability.effect === null ||
      !("type" in ability.effect) ||
      ability.effect.type !== "restriction" ||
      !("restriction" in ability.effect) ||
      ability.effect.restriction !== "enters-play-exerted" ||
      !("target" in ability.effect) ||
      ability.effect.target !== "SELF"
    ) {
      return false;
    }

    return evaluateStaticCondition({
      condition: ("condition" in ability ? ability.condition : undefined) as Condition | undefined,
      state,
      controllerId: playerId,
      sourceId: cardId,
      getDefinitionByInstanceId,
    });
  });

  if (selfRestricted) {
    return true;
  }

  // Section 3 ensures `staticEffectsVersion` reflects the current state, so
  // the cached registry is up-to-date for the `enters-play-exerted` check.
  return hasStaticCardRestriction({
    state,
    cardId,
    restriction: "enters-play-exerted",
    registry: getOrBuildMoveRegistry(ctx),
  });
}

function consumeAppliedCostReductions(
  turnMetadata: PlayCardExecutionContext["G"]["turnMetadata"],
  playerId: PlayerId,
  consumeIndexes: number[],
  currentTurn: number,
): void {
  const pendingByPlayer =
    turnMetadata.pendingCostReductionsByPlayer ?? (turnMetadata.pendingCostReductionsByPlayer = {});
  const currentEntries = pendingByPlayer[playerId] ?? [];

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

export function resolvePlayCardEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: PlayCardEffect,
  resolutionInput: ActionResolutionInput,
  options?: ActionEffectResolutionOptions,
): void {
  let didPlayCard = false;

  const costType: CardPlayedPayload["costType"] =
    effect.cost === "free" || effect.free === true ? "free" : "standard";
  if (effect.cost === "reduced") {
    handleUnsupportedActionEffect(
      "play-card",
      "Reduced-cost play-card effects are not supported in this phase",
    );
    return;
  }

  if (effect.reducedBy !== undefined) {
    handleUnsupportedActionEffect(
      "play-card",
      "Reduced-cost play-card effects (reducedBy) are not supported",
    );
    return;
  }

  const registry = getOrBuildMoveRegistry(ctx);
  const currentSelectedTargets = normalizeSelectedTargets(
    getCurrentSelectionInput(resolutionInput),
  );
  const targetPlayerIds = isPlayerTargetLike(effect.target)
    ? resolveTargetPlayerIds(
        ctx,
        cardPlayed,
        effect.target,
        getEffectTargetSelectionInput(effect.target, resolutionInput),
      )
    : // When no explicit player target is set, default to the chooser of the
      // wrapping `optional` if one is in flight (e.g. Chernabog — Unnatural
      // Force's nested "that player may play a character from their discard
      // for free" runs with chooserPlayerId = opponent). Falling back to
      // cardPlayed.playerId would source the opponent's "play from discard"
      // from the original controller's discard.
      [resolutionInput.chooserPlayerId ?? cardPlayed.playerId];
  const resolvedPlayerIds = targetPlayerIds.length > 0 ? targetPlayerIds : [cardPlayed.playerId];

  for (const playerId of resolvedPlayerIds) {
    const sourceCards = resolveSourceCards(
      ctx,
      cardPlayed,
      effect,
      resolutionInput,
      playerId as PlayerId,
      currentSelectedTargets,
    );

    const playableCards = sourceCards.filter((cardId) =>
      matchesPlayableCardCriteria(ctx, cardPlayed, cardId, effect, resolutionInput),
    );

    if (playableCards.length === 0) {
      continue;
    }

    const from = effect.from ?? "hand";
    let chosenCardId: CardInstanceId;
    if (from === "discard" || from === "hand" || from === "inkwell") {
      const explicitChoice = currentSelectedTargets.filter((id) => playableCards.includes(id));
      if (explicitChoice.length === 1) {
        chosenCardId = explicitChoice[0]!;
      } else if (playableCards.length === 1) {
        // Only one legal candidate — auto-select it.
        chosenCardId = playableCards[0]!;
      } else if (isDeterministicNameRestrictedPlayCardFilter(effect)) {
        // Name-restricted filters can intentionally resolve without a picker
        // even when multiple copies match. Preserve the historical
        // deterministic fallback for those unambiguous card identities.
        chosenCardId = playableCards[playableCards.length - 1]!;
      } else {
        // Multiple candidates and no explicit selection: skip. The selection-context
        // builder will have opened a picker (for bags or pending-effect with 2+ cards).
        continue;
      }
    } else {
      chosenCardId = playableCards[playableCards.length - 1]!;
    }
    const definition = ctx.cards.getDefinition(chosenCardId) as CardDefinitionLike | undefined;
    const cardType = definition?.cardType;

    if (!cardType) {
      continue;
    }

    // Respect player play restrictions when executing play-card effects.
    // A "cant-play-actions" restriction (e.g. Pete - Games Referee) should prevent
    // playing action cards (including songs) even via triggered or activated abilities.
    if (cardType === "action") {
      const currentTurn = ctx.framework.state.status.turn ?? 1;
      if (
        hasTemporaryPlayerRestriction(
          ctx.G.temporaryPlayerRestrictions,
          playerId as PlayerId,
          currentTurn,
          "cant-play-actions",
        )
      ) {
        continue;
      }
    }

    if (cardType === "item") {
      const currentTurn = ctx.framework.state.status.turn ?? 1;
      if (
        hasTemporaryPlayerRestriction(
          ctx.G.temporaryPlayerRestrictions,
          playerId as PlayerId,
          currentTurn,
          "cant-play-items",
        )
      ) {
        continue;
      }
    }

    const sourceZoneKey = ctx.framework.zones.getCardZone(chosenCardId);
    const currentTurn = ctx.framework.state.status.turn ?? 1;
    const sourceZoneId = typeof sourceZoneKey === "string" ? sourceZoneKey : undefined;

    const costReduction =
      costType === "free"
        ? { reductionAmount: 0, consumeIndexes: [] }
        : getAppliedCostReductions({
            definition: definition as LorcanaCardDefinition,
            state: createProjectionState(ctx.framework.state, ctx.G),
            cardInstanceId: chosenCardId,
            ownerID: playerId as PlayerId,
            zoneID: sourceZoneId,
            actorPlayerId: playerId as PlayerId,
            getDefinitionByInstanceId: (cardInstanceId) =>
              ctx.cards.getDefinition(cardInstanceId) as LorcanaCardDefinition | undefined,
            playMethod: "standard",
            registry,
          });
    const costIncrease =
      costType === "free"
        ? 0
        : getStaticCostIncreaseAmount({
            definition: definition as LorcanaCardDefinition,
            state: createProjectionState(ctx.framework.state, ctx.G),
            registry,
          });
    const inkCost =
      costType === "free"
        ? 0
        : Math.max(0, Number(definition.cost ?? 0) - costReduction.reductionAmount + costIncrease);

    if (costType !== "free") {
      const costValidation = validateBasicCost(
        {
          framework: ctx.framework,
          cards: ctx.cards,
          playerId,
        },
        { ink: inkCost },
      );
      if (!costValidation.valid) {
        continue;
      }

      const payResult = payBasicCost(
        {
          framework: ctx.framework,
          cards: ctx.cards,
          playerId,
        },
        { ink: inkCost },
      );
      if (!payResult.success) {
        continue;
      }

      consumeAppliedCostReductions(
        ctx.G.turnMetadata,
        playerId as PlayerId,
        costReduction.consumeIndexes,
        currentTurn,
      );
    }

    if (cardType === "action") {
      if (effect.afterPlay === "bottom-of-deck") {
        ctx.cards.patchMeta(chosenCardId, { afterPlayDestination: "bottom-of-deck" });
      }
      ctx.framework.zones.moveCard(chosenCardId, {
        zone: "play",
        playerId,
      });
      if (isDiscardZoneKey(sourceZoneKey)) {
        recordDiscardExitThisTurn(ctx);
      }

      // Record the card so turn-metric conditions (e.g. "played-actions >= 3")
      // count actions played via effects, not just via the main play-card move.
      ctx.G.turnMetadata.cardsPlayedThisTurn.push(chosenCardId);

      const replayedActionPayload: CardPlayedPayload = {
        playerId,
        cardId: chosenCardId,
        cardType: "action",
        costType,
      };

      emitTriggeredLorcanaEvent(ctx, "cardPlayed", replayedActionPayload, {
        event: "play",
        playerId,
        subjectCardId: chosenCardId,
      });

      // If the outer card (cardPlayed) is currently in limbo — meaning it already suspended
      // once for player input — and has no remaining continuation effects to run, its effect
      // chain is complete at this point. Finalise it to discard now, before running the nested
      // card's effects, so the nested card can find the outer card in the discard zone.
      // (e.g. We Know the Way cycling: A plays B for free; A is done; A goes to discard so
      // B's shuffle step can choose A as its target.)
      const outerCardZone = ctx.framework.zones.getCardZone(cardPlayed.cardId);
      const outerCardIsInLimbo =
        typeof outerCardZone === "string" &&
        (outerCardZone === "limbo" || outerCardZone.startsWith("limbo:"));
      const outerCardHasNoRemainingEffects =
        !options?.continuation?.remainingEffects ||
        options.continuation.remainingEffects.length === 0;
      if (outerCardIsInLimbo && outerCardHasNoRemainingEffects) {
        finalizeResolvedActionCard(ctx, cardPlayed);
      }

      const nestedActionResolutionInput = clearCurrentSelectionTargets({
        ...resolutionInput,
        resolveOptional: undefined,
        eventSnapshot: resolutionInput.eventSnapshot
          ? {
              ...resolutionInput.eventSnapshot,
              revealedCardIds: undefined,
              revealWindowIds: undefined,
            }
          : undefined,
      });
      resolveActionCardEffects(
        ctx,
        replayedActionPayload,
        ctx.cards.getDefinition(chosenCardId) as Extract<
          ReturnType<typeof ctx.cards.getDefinition>,
          { cardType: "action" }
        >,
        {
          ...nestedActionResolutionInput,
        },
      );
      if (hasPendingActionEffectResolution(ctx)) {
        moveSuspendedActionCardToLimbo(ctx, replayedActionPayload);
      } else {
        finalizeResolvedActionCard(ctx, replayedActionPayload);
      }
      didPlayCard = true;
      if (resolutionInput.eventSnapshot) {
        resolutionInput.eventSnapshot.chosenCardId = chosenCardId;
      }
      continue;
    }
    const chosenDefForShift = ctx.cards.getDefinition(chosenCardId) as
      | LorcanaCardDefinition
      | undefined;
    const inPlaySelection = currentSelectedTargets.find((id) => {
      const zoneKey = ctx.framework.zones.getCardZone(id);
      return typeof zoneKey === "string" && zoneKey.startsWith("play:");
    });
    const legalShiftBase = ((): CardInstanceId | undefined => {
      if (!chosenDefForShift) return undefined;
      const shiftRules = getShiftRules(chosenDefForShift);
      if (!shiftRules) return undefined;
      const myCharsInPlay = ctx.framework.zones.getCards({
        zone: "play",
        playerId,
      }) as CardInstanceId[];
      const validTargets = resolveShiftTargetCandidates(
        shiftRules,
        myCharsInPlay,
        (id) => ctx.cards.getDefinition(id) as LorcanaCardDefinition | undefined,
      );
      if (
        inPlaySelection !== undefined &&
        validTargets.includes(inPlaySelection as CardInstanceId)
      ) {
        return inPlaySelection as CardInstanceId;
      }
      // For plays from non-hand zones (e.g. Metamorphosis playing from discard),
      // auto-select the shift base when there is exactly one legal candidate.
      // The player chose the discard-pile card but isn't separately prompted for
      // a shift target, so unambiguous auto-selection is correct here.
      // For plays from hand, player agency over whether to shift vs. play standard
      // must be preserved — we never auto-select in that case.
      if (inPlaySelection === undefined && validTargets.length === 1 && effect.from !== "hand") {
        return validTargets[0];
      }
      return undefined;
    })();

    const shouldShiftRoute = ((): boolean => {
      if (effect.playMethod === "shift") {
        // Strict shift: only shift; if no legal base, the play fails (existing behavior).
        return legalShiftBase !== undefined;
      }
      if (effect.playMethod === "either") {
        // Player choice: shift if a legal base was selected, otherwise fall through to standard.
        return legalShiftBase !== undefined;
      }
      return false;
    })();

    if (effect.playMethod === "shift" && legalShiftBase === undefined) {
      // Strict shift mode requires a legal in-play base. Without one, the effect cannot resolve.
      continue;
    }

    if (shouldShiftRoute) {
      const shiftTarget = legalShiftBase!;
      const chosenDef = chosenDefForShift!;

      ctx.framework.zones.moveCard(chosenCardId, { zone: "play", playerId });
      if (isDiscardZoneKey(sourceZoneKey)) {
        recordDiscardExitThisTurn(ctx);
      }
      ctx.G.turnMetadata.cardsPlayedThisTurn.push(chosenCardId);
      ctx.G.turnMetadata.shiftPlayedThisTurn.push(chosenCardId);

      const banishedByGSC = executeShiftPlay(
        ctx,
        chosenCardId as CardInstanceId,
        shiftTarget as CardInstanceId,
        playerId as PlayerId,
        chosenDef,
        { entersExerted: effect.entersExerted === true },
      );

      if (!banishedByGSC) {
        emitTriggeredLorcanaEvent(
          ctx,
          "cardPlayed",
          {
            playerId,
            cardId: chosenCardId,
            cardType,
            costType,
            // Mirror the playCard move's payload so play triggers gated on the
            // `used-shift` condition (e.g. Omnidroid — V.9 ENEMY DETECTED) fire
            // when the effect's shift route plays the card. Without this flag
            // the condition evaluator falls back to `usedShift === undefined`
            // and skips the trigger entirely (P1 — bugrepeGnIWtt1Ah-_BPuVw3SPk).
            usedShift: true,
            shiftTargetId: shiftTarget,
          },
          {
            event: "play",
            playerId,
            subjectCardId: chosenCardId,
            triggerSourceCardId: chosenCardId,
          },
        );
      }

      if (resolutionInput.eventSnapshot) {
        resolutionInput.eventSnapshot.chosenCardId = chosenCardId;
      }
      didPlayCard = true;
      continue;
    }

    ctx.framework.zones.moveCard(chosenCardId, {
      zone: "play",
      playerId,
    });
    if (isDiscardZoneKey(sourceZoneKey)) {
      recordDiscardExitThisTurn(ctx);
    }

    // Record the card so turn-metric conditions count effect-played cards.
    ctx.G.turnMetadata.cardsPlayedThisTurn.push(chosenCardId);

    initializePlayedCardMeta(
      ctx,
      chosenCardId,
      definition,
      effect.entersExerted === true ||
        cardEntersPlayExerted(ctx, chosenCardId, definition, playerId as PlayerId, registry) ||
        (cardType === "character" &&
          resolutionInput.enterPlayExerted === true &&
          hasBodyguardKeyword(definition)),
      costType,
    );

    emitTriggeredLorcanaEvent(
      ctx,
      "cardPlayed",
      {
        playerId,
        cardId: chosenCardId,
        cardType,
        costType,
      },
      {
        event: "play",
        playerId,
        subjectCardId: chosenCardId,
      },
    );

    if (cardType === "character" && (effect.grantsRush || effect.banishAtEndOfTurn)) {
      const currentTurn = ctx.framework.state.status.turn ?? 1;
      const { startsAtTurn, expiresAtTurn } = resolveTemporaryEffectWindow(
        currentTurn,
        "this-turn",
      );
      const currentMeta = ctx.cards.require(chosenCardId).meta ?? {};

      let nextMeta = currentMeta;
      if (effect.grantsRush) {
        nextMeta = addTemporaryKeyword(nextMeta, "Rush", expiresAtTurn, undefined, startsAtTurn);
      }

      ctx.cards.patchMeta(chosenCardId, nextMeta);
    }

    if (cardType === "character" && effect.banishAtEndOfTurn) {
      registerAbility(ctx, {
        sourceId: cardPlayed.cardId,
        controllerId: cardPlayed.playerId,
        cardPlayed,
        ability: {
          trigger: {
            event: "end-turn",
            on: "CONTROLLER",
            timing: "at",
          },
          effect: {
            type: "banish",
            target: { ref: "previous-target" },
          },
        },
        lifecycle: {
          kind: "delayed",
          timing: "end-of-turn",
        },
        resolutionInput: {
          ...resolutionInput,
          targets: chosenCardId,
        },
      });
    }

    if (resolutionInput.eventSnapshot) {
      resolutionInput.eventSnapshot.chosenCardId = chosenCardId;
    }
    didPlayCard = true;
  }

  resolutionInput.eventSnapshot ??= {};
  resolutionInput.eventSnapshot.lastEffectPerformed = didPlayCard;
  if (!didPlayCard) {
    delete resolutionInput.eventSnapshot.chosenCardId;
    return;
  }

  if (
    hasPendingActionEffectResolution(ctx) ||
    (options?.continuation?.remainingEffects?.length ?? 0) > 0
  ) {
    return;
  }

  flushTriggeredEventsToBag(ctx);
}

/**
 * Executes an action card that has already been physically moved to the play zone
 * by a scry "play for free" destination. Runs the card's effects and finalizes
 * it to discard (or limbo if suspended), matching the normal action-card play lifecycle.
 */
export function executeScryActionCardPlay(
  ctx: PlayCardExecutionContext,
  actionCardId: CardInstanceId,
  controllerId: PlayerId,
  resolutionInput: ActionResolutionInput,
): void {
  const definition = ctx.cards.getDefinition(actionCardId) as CardDefinitionLike | undefined;
  if (!definition || definition.cardType !== "action") {
    return;
  }

  // Record the card so turn-metric conditions count scry-played actions.
  ctx.G.turnMetadata.cardsPlayedThisTurn.push(actionCardId);

  const actionPayload: CardPlayedPayload = {
    playerId: controllerId,
    cardId: actionCardId,
    cardType: "action",
    costType: "free",
  };

  emitTriggeredLorcanaEvent(ctx, "cardPlayed", actionPayload, {
    event: "play",
    playerId: controllerId,
    subjectCardId: actionCardId,
  });

  // Strip selection targets, destinations, and the event snapshot from the outer scry's
  // resolution context. Destinations and revealedCardIds belong to the outer (Robin Hood)
  // scry — leaving them would make this action's own scry handler treat the outer
  // destinations/looked-at cards as its own, skipping suspension or using the wrong cards.
  const nestedInput = {
    ...clearCurrentSelectionTargets(resolutionInput),
    destinations: undefined,
    resolveOptional: undefined,
    eventSnapshot: undefined,
  };
  resolveActionCardEffects(
    ctx,
    actionPayload,
    definition as Extract<ReturnType<typeof ctx.cards.getDefinition>, { cardType: "action" }>,
    nestedInput,
  );

  if (hasPendingActionEffectResolution(ctx)) {
    moveSuspendedActionCardToLimbo(ctx, actionPayload);
  } else {
    finalizeResolvedActionCard(ctx, actionPayload);
  }
}
