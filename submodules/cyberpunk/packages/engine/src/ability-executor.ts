/**
 * Processes triggered abilities that fire in response to game events.
 *
 * Handles:
 *  - firstTimeEachTurn limits
 *  - Binding resolution (auto-select first valid target)
 *  - Optional effects (auto-execute when a target is available)
 *  - Conditional effects (evaluate conditions before executing)
 */

import type { Ability, Condition, Effect } from "@tcg/cyberpunk-types";
import type { MatchState } from "./types/match-state.ts";
import type { Operations } from "./operations/index.ts";
import type { GameEvent } from "./types/game-events.ts";
import type { CardInstanceId, PlayerId } from "./types/branded.ts";
import { matchTriggers } from "./triggers/index.ts";
import { resolveTarget, evaluateCondition } from "./effects/target-resolver.ts";
import { resolveEffect } from "./effects/handlers/index.ts";
import type { ResolutionContext } from "./effects/target-resolver.ts";
import { defOf, hasAnyEffectiveCardType } from "./state/lookups.ts";
import { getEffectivePower } from "./active-effects/index.ts";
import {
  abilityCostBindingId,
  availableEddiesAfterAbilityCosts,
  canPayAbilityEddieCosts,
  reservedLegendIdsForAbilityCosts,
} from "./moves/eddie-resources.ts";
import { computeEffectiveCost } from "./moves/compute-effective-cost.ts";
import { assertNever } from "./types/exhaustive.ts";
import { privateField } from "./logging/private-field.ts";
import { maybeEndAttackIfParticipantsLeft } from "./moves/end-attack.ts";
import { hasValidGigCopyPair } from "./effects/gig-copy-selection.ts";

type AbilityCost = NonNullable<Ability["costs"]>[number];
type AbilityExecutionStatus = "resolved" | "suspended";

export function processEventTriggers(
  event: GameEvent,
  state: MatchState,
  operations: Operations,
): void {
  enqueueEventTriggers(event, state, operations);
  continueTriggerResolution(state, operations);
}

export function processCardSpentEventsSince(
  eventsBeforeSpend: number,
  state: MatchState,
  operations: Operations,
): void {
  for (const event of operations.event.getEmittedEvents().slice(eventsBeforeSpend)) {
    if (event.type === "cardSpent") {
      processEventTriggers(event, state, operations);
    }
  }
}

function enqueueTriggerEventsSince(
  eventsBefore: number,
  state: MatchState,
  operations: Operations,
): void {
  for (const event of operations.event.getEmittedEvents().slice(eventsBefore)) {
    if (
      event.type === "gigStolen" ||
      event.type === "gigDieRolled" ||
      event.type === "gigValueChanged" ||
      event.type === "gigsSwapped" ||
      event.type === "legendFlipped" ||
      event.type === "legendCalled" ||
      event.type === "cardPlayed" ||
      event.type === "cardSpent" ||
      // CR 11.19.2 — [Defeated] enters pending when the Unit moves to trash,
      // no matter what defeated it (combat enqueues its own cardDefeated
      // events in resolve-attack; effect defeats rely on this loop).
      event.type === "cardDefeated"
    ) {
      enqueueEventTriggers(event, state, operations);
    }
  }
}

export function enqueueEventTriggers(
  event: GameEvent,
  state: MatchState,
  operations: Operations,
): void {
  const matches = matchTriggers(event, state);

  for (const match of matches) {
    const { cardId, playerId, ability, abilityIndex } = match;
    const matchedEvents: GameEvent[] =
      event.type === "gigStolen" &&
      ability.trigger?.trigger === "event" &&
      ability.trigger.event.event === "gigStolen" &&
      ability.trigger.event.perGig === true &&
      event.dieIds?.length
        ? event.dieIds.map((dieId) => ({ ...event, dieId, dieIds: [dieId] }))
        : [event];

    for (const matchedEvent of matchedEvents) {
      const contextTargets = buildContextTargets(matchedEvent);

      if (!passesEventFilter(matchedEvent, ability, state, playerId, cardId)) continue;

      const boundTargets = resolveBindings(ability, state, cardId, playerId, contextTargets);

      // Skip ability if any required non-selectable binding has no valid targets.
      // Selectable bindings are checked later in resumeCurrentTrigger so that a
      // mandatory ability resolves as much as possible when one of several
      // bindings is unavailable (CR 2.4), while optional triggers with no legal
      // choice remain filtered here.
      if (ability.bindings) {
        const allSatisfied = ability.bindings.every((binding) => {
          if (isSelectableBinding(binding)) {
            const targets = resolveTarget(binding.target, {
              state,
              sourceCardId: cardId,
              sourcePlayerId: playerId,
              abilityIndex,
              contextTargets,
              boundTargets,
            });
            const min = getSelection(binding.target)?.min ?? 1;
            if (targets.length < min) {
              return !isOptionalTrigger(state, cardId, ability);
            }
            return true;
          }
          return (boundTargets[binding.id]?.length ?? 0) > 0;
        });
        if (!allSatisfied) {
          emitNoValidTargetsLog(cardId, playerId, state, operations);
          continue;
        }
      }

      const ctx: ResolutionContext = {
        state,
        sourceCardId: cardId,
        sourcePlayerId: playerId,
        abilityIndex,
        contextTargets,
        boundTargets,
      };

      if (
        ability.conditions?.length &&
        !ability.conditions.every((c) => evaluateCondition(c, ctx))
      ) {
        continue;
      }

      if (!abilityHasApplicableEffects(ability, ctx)) {
        continue;
      }

      if (!canPayAbilityCosts(ability, ctx)) {
        continue;
      }

      if (!abilityHasRequiredEffectTargets(ability, ctx)) {
        // For mandatory abilities with no valid targets, enqueue them so they
        // can auto-drain in resumeCurrentTrigger.
      }

      const order = state.G.turnMetadata.nextTriggerId++;
      const id = `trigger-${order}`;
      state.G.turnMetadata.triggerQueue.push({
        id,
        sourceCardId: cardId,
        sourcePlayerId: playerId,
        abilityIndex,
        abilityText: ability.text,
        optional: isOptionalTrigger(state, cardId, ability),
        event: matchedEvent,
        contextTargets,
        boundTargets,
        order,
      });
      operations.event.emit({
        type: "effectTriggered",
        sourceCardId: cardId,
        effectType: ability.trigger?.trigger ?? "event",
        playerId,
      });
    }
  }
}

export function continueTriggerResolution(state: MatchState, operations: Operations): void {
  if (state.G.turnMetadata.pendingChoice || state.G.turnMetadata.currentTrigger) return;

  while (!state.G.turnMetadata.pendingChoice && !state.G.turnMetadata.currentTrigger) {
    const queue = state.G.turnMetadata.triggerQueue;
    if (queue.length === 0) {
      if (resolveAfterTriggerDelayedEffects(state, operations)) {
        continue;
      }
      maybeEndAttackIfParticipantsLeft(state, operations);
      return;
    }

    const earliest = [...queue].sort((a, b) => a.order - b.order)[0]!;
    const controllerId = earliest.sourcePlayerId;
    const controllerTriggers = queue
      .filter((trigger) => trigger.sourcePlayerId === controllerId)
      .sort((a, b) => a.order - b.order);

    if (controllerTriggers.length > 1 || controllerTriggers.some((trigger) => trigger.optional)) {
      const options = controllerTriggers.map((trigger) => {
        const card = state.G.cardIndex[trigger.sourceCardId as string];
        const cardName = card ? defOf(card).displayName : "Unknown card";
        return {
          triggerId: trigger.id,
          sourceCardId: trigger.sourceCardId,
          sourcePlayerId: trigger.sourcePlayerId,
          abilityIndex: trigger.abilityIndex,
          abilityText: trigger.abilityText,
          cardName,
          optional: trigger.optional,
        };
      });

      if (options.length > 1) {
        operations.event.emit({
          type: "actionLog",
          messageKey: "trigger.orderPending",
          params: {
            triggerCount: options.length,
            triggerNames: options.map((option) => option.cardName).join(" | "),
            triggerIds: options.map((option) => option.triggerId),
            sourceCardIds: options.map((option) => option.sourceCardId as string),
            abilityIndexes: options.map((option) => String(option.abilityIndex)),
          },
          playerId: controllerId,
          category: "trigger",
          cardIds: options.map((option) => option.sourceCardId as string),
        });
      }

      operations.game.setPendingChoice({
        type: "chooseTrigger",
        chooserId: controllerId,
        effectId: "",
        payload: {
          canPass: controllerTriggers.some((trigger) => trigger.optional),
          options,
        },
      });
      return;
    }

    resolveQueuedTrigger(controllerTriggers[0]!.id, state, operations, { auto: true });
  }
}

function resolveAfterTriggerDelayedEffects(state: MatchState, operations: Operations): boolean {
  const bagEntries = state.G.effectBag.filter(
    (entry) => entry.delayedTiming === "afterTriggerResolution",
  );
  if (bagEntries.length === 0) return false;

  for (const entry of bagEntries) {
    if (!entry.delayedEffects) {
      operations.game.removeBagEntry(entry.id);
      continue;
    }

    const ctx: ResolutionContext = {
      state,
      sourceCardId: entry.sourceCardId as CardInstanceId,
      sourcePlayerId: entry.sourcePlayerId as PlayerId,
      abilityIndex: -1,
      contextTargets: {},
      boundTargets: (entry.resolvedBindings ?? {}) as Record<string, string[]>,
    };
    executeAbilityEffects(entry.delayedEffects, ctx, operations);
    operations.game.removeBagEntry(entry.id);

    if (
      state.G.turnMetadata.pendingChoice ||
      state.G.turnMetadata.currentTrigger ||
      state.G.turnMetadata.triggerQueue.length > 0
    ) {
      return true;
    }
  }

  return true;
}

export function passOptionalTriggers(
  state: MatchState,
  operations: Operations,
  playerId: PlayerId,
): void {
  const before = state.G.turnMetadata.triggerQueue.length;
  state.G.turnMetadata.triggerQueue = state.G.turnMetadata.triggerQueue.filter(
    (trigger) => trigger.sourcePlayerId !== playerId || !trigger.optional,
  );
  operations.game.setPendingChoice(undefined);
  if (state.G.turnMetadata.triggerQueue.length !== before) {
    continueTriggerResolution(state, operations);
  }
}

export function resolveQueuedTrigger(
  triggerId: string,
  state: MatchState,
  operations: Operations,
  opts: { auto?: boolean } = {},
): void {
  if (state.G.turnMetadata.currentTrigger) return;
  const index = state.G.turnMetadata.triggerQueue.findIndex((trigger) => trigger.id === triggerId);
  if (index === -1) return;
  const pendingChoice = state.G.turnMetadata.pendingChoice;
  const orderedOptions =
    !opts.auto &&
    pendingChoice?.type === "chooseTrigger" &&
    pendingChoice.payload.options.length > 1
      ? pendingChoice.payload.options
      : undefined;
  const [queued] = state.G.turnMetadata.triggerQueue.splice(index, 1);
  if (!queued) return;

  const card = state.G.cardIndex[queued.sourceCardId as string];
  const ability = card ? getAbility(card, queued.abilityIndex) : undefined;

  // `firstTimeEachTurn`: a given ability may START at most once per turn.
  // Record at dequeue time (the single point a queued trigger becomes the
  // in-progress currentTrigger) so a mid-resolution suspension/resume does
  // not re-trigger this check and abort the remaining effects of the same
  // firing (e.g. an adjustGig value choice followed by a conditional draw).
  if (ability?.limits?.includes("firstTimeEachTurn")) {
    const alreadyFired = state.G.turnMetadata.abilityFiredThisTurn.some(
      (e) => e.cardId === queued.sourceCardId && e.abilityIndex === queued.abilityIndex,
    );
    if (alreadyFired) {
      operations.game.setPendingChoice(undefined);
      continueTriggerResolution(state, operations);
      return;
    }
    state.G.turnMetadata.abilityFiredThisTurn.push({
      cardId: queued.sourceCardId,
      abilityIndex: queued.abilityIndex,
    });
  }

  state.G.turnMetadata.currentTrigger = { ...queued, nextEffectIndex: 0 };
  operations.game.setPendingChoice(undefined);

  const cardName = card ? defOf(card).displayName : "Unknown card";
  if (orderedOptions) {
    const remainingOptions = orderedOptions.filter((option) => option.triggerId !== triggerId);
    operations.event.emit({
      type: "actionLog",
      messageKey: "trigger.orderSelected",
      params: {
        selectedTriggerId: queued.id,
        selectedSourceCardId: queued.sourceCardId as string,
        selectedAbilityIndex: queued.abilityIndex,
        cardName,
        abilityText: queued.abilityText,
        remainingCount: remainingOptions.length,
        remainingTriggerNames:
          remainingOptions.map((option) => option.cardName).join(" | ") || "none",
        remainingTriggerIds: remainingOptions.map((option) => option.triggerId),
        remainingSourceCardIds: remainingOptions.map((option) => option.sourceCardId as string),
        remainingAbilityIndexes: remainingOptions.map((option) => String(option.abilityIndex)),
      },
      playerId: queued.sourcePlayerId,
      category: "trigger",
      cardIds: orderedOptions.map((option) => option.sourceCardId as string),
    });
  }
  operations.event.emit({
    type: "actionLog",
    messageKey: opts.auto ? "trigger.autoResolved" : "trigger.resolved",
    params: {
      cardName,
      abilityText: queued.abilityText,
      hasDrawEffect: ability && hasDrawEffect(ability.effects) ? 1 : 0,
    },
    playerId: queued.sourcePlayerId,
    category: "trigger",
    cardIds: [queued.sourceCardId as string],
  });

  resumeCurrentTrigger(state, operations);
}

export function isPlayerActivatedResolution(trigger: { event: GameEvent }): boolean {
  return (
    trigger.event.type === "actionLog" &&
    (trigger.event.messageKey === "move.activateAbility" ||
      trigger.event.messageKey === "move.activateAbility.attached")
  );
}

/** Drop the in-progress ability and continue any remaining queued triggers. */
export function abandonCurrentTrigger(state: MatchState, operations: Operations): void {
  operations.game.setPendingChoice(undefined);
  state.G.turnMetadata.currentTrigger = undefined;
  continueTriggerResolution(state, operations);
}

export function resumeCurrentTrigger(state: MatchState, operations: Operations): void {
  const current = state.G.turnMetadata.currentTrigger;
  if (!current) {
    continueTriggerResolution(state, operations);
    return;
  }

  const card = state.G.cardIndex[current.sourceCardId as string];
  if (!card) {
    state.G.turnMetadata.currentTrigger = undefined;
    continueTriggerResolution(state, operations);
    return;
  }
  const ability = getAbility(card, current.abilityIndex);
  if (!ability) {
    state.G.turnMetadata.currentTrigger = undefined;
    continueTriggerResolution(state, operations);
    return;
  }

  const ctx: ResolutionContext = {
    state,
    sourceCardId: current.sourceCardId,
    sourcePlayerId: current.sourcePlayerId,
    abilityIndex: current.abilityIndex,
    contextTargets: current.contextTargets,
    boundTargets: current.boundTargets,
  };

  if (!current.costsPaid && !canPayAbilityCosts(ability, ctx)) {
    state.G.turnMetadata.currentTrigger = undefined;
    continueTriggerResolution(state, operations);
    return;
  }

  if (!abilityHasRequiredEffectTargets(ability, ctx, current.nextEffectIndex)) {
    emitNoValidTargetsLog(current.sourceCardId, current.sourcePlayerId, state, operations);
    state.G.turnMetadata.currentTrigger = undefined;
    continueTriggerResolution(state, operations);
    return;
  }

  const pendingBinding = getPendingSelectableBinding(ability, current.boundTargets);
  if (pendingBinding) {
    const selection = getSelection(pendingBinding.target);
    const targets = resolveTarget(pendingBinding.target, ctx);
    const min = selection?.min ?? 1;
    const max = selection?.max ?? 1;
    const lacksRequiredPair =
      selection?.pairConstraint !== undefined &&
      !hasValidGigCopyPair(state, targets, selection.pairConstraint);
    if (targets.length < min || lacksRequiredPair) {
      // CR 2.4: an impossible portion of a mandatory effect is ignored while
      // the remaining portions still resolve. Mark this binding as resolved
      // with no targets so a later binding/effect can continue normally.
      current.boundTargets[pendingBinding.id] = [];
      resumeCurrentTrigger(state, operations);
      return;
    }
    // Auto-select the single mandatory target (excluding program play abilities,
    // which remain player-selectable even when there is only one valid target).
    if (
      targets.length === 1 &&
      min === 1 &&
      max === 1 &&
      !isProgramPlayAbility(current.sourceCardId, ability, state) &&
      !requiresExplicitSelectableBinding(ability, pendingBinding.id)
    ) {
      current.boundTargets[pendingBinding.id] = [targets[0]!];
      resumeCurrentTrigger(state, operations);
      return;
    }
    operations.game.setPendingChoice({
      type: "chooseTarget",
      chooserId:
        selection?.chooser === "rival"
          ? state.ctx.playerIds.find((id) => id !== current.sourcePlayerId)!
          : current.sourcePlayerId,
      effectId: current.id,
      payload: {
        type: "effectTarget",
        targetKind: pendingBinding.target.selector === "gig" ? "gig" : "card",
        eligibleIds: targets,
        adjustGig: findFollowingAdjustGig(ability, pendingBinding.id),
        min,
        max,
        pairConstraint: selection?.pairConstraint,
        canDecline:
          selection?.canDecline === true ||
          min === 0 ||
          bindingFeedsPaidPlayCard(ability, pendingBinding.id),
        sourceCardId: current.sourceCardId,
        sourcePlayerId: current.sourcePlayerId,
        abilityIndex: current.abilityIndex,
        contextTargets: current.contextTargets,
        boundTargets: current.boundTargets,
        selectedBindingId: pendingBinding.id,
        ...(bindingFeedsPaidPlayCard(ability, pendingBinding.id)
          ? {
              targetPurpose: "playCard" as const,
              availableEddiesAfterCosts: availableEddiesAfterAbilityCosts(
                ability,
                state,
                current.sourceCardId,
                current.sourcePlayerId,
                current.boundTargets,
              ),
              effectiveCostsByCardId: Object.fromEntries(
                targets.map((targetId) => [
                  targetId as string,
                  computeEffectiveCost(state, targetId as CardInstanceId, current.sourcePlayerId),
                ]),
              ),
            }
          : {}),
      },
    });
    return;
  }

  if (!current.costsPaid) {
    if (!canPayAbilityCosts(ability, ctx)) {
      state.G.turnMetadata.currentTrigger = undefined;
      continueTriggerResolution(state, operations);
      return;
    }
    const pendingCost = getPendingSelectableCost(ability, current.boundTargets, ctx);
    if (pendingCost) {
      const selection = getSelection(pendingCost.cost.target);
      const targets = resolveSelectableCostTargets(pendingCost.cost, ctx);
      const min = selection?.min ?? 1;
      const max = selection?.max ?? 1;
      if (targets.length < min) {
        emitNoValidTargetsLog(current.sourceCardId, current.sourcePlayerId, state, operations);
        state.G.turnMetadata.currentTrigger = undefined;
        continueTriggerResolution(state, operations);
        return;
      }
      operations.game.setPendingChoice({
        type: "chooseTarget",
        chooserId: current.sourcePlayerId,
        effectId: current.id,
        payload: {
          type: "effectTarget",
          targetKind: pendingCost.cost.target.selector === "gig" ? "gig" : "card",
          eligibleIds: targets,
          min,
          max,
          canDecline: min === 0,
          sourceCardId: current.sourceCardId,
          sourcePlayerId: current.sourcePlayerId,
          abilityIndex: current.abilityIndex,
          contextTargets: current.contextTargets,
          boundTargets: current.boundTargets,
          selectedBindingId: pendingCost.bindingId,
        },
      });
      return;
    }
    const eventsBeforeCosts = operations.event.getEmittedEvents().length;
    payAbilityCosts(ability, ctx, operations);
    enqueueTriggerEventsSince(eventsBeforeCosts, state, operations);
    current.costsPaid = true;
  }

  // Nested bodies (chooseEffect options, partial expansions, if/else follow-ups)
  // keep their own resume index so they cannot clobber the outer ability index.
  if (current.continuation) {
    const cont = current.continuation;
    const contStatus = executeAbilityEffects(cont.effects, ctx, operations, cont.nextIndex, {
      nested: true,
    });
    if (contStatus === "suspended") return;
    current.continuation = undefined;
  }

  const status = executeAbilityEffects(ability.effects, ctx, operations, current.nextEffectIndex);
  if (status === "suspended") return;

  state.G.turnMetadata.currentTrigger = undefined;
  continueTriggerResolution(state, operations);
}

function passesEventFilter(
  event: GameEvent,
  ability: Ability,
  state: MatchState,
  sourcePlayerId: PlayerId,
  abilityCardId?: CardInstanceId,
): boolean {
  if (!ability.trigger) return false;

  // Non-event triggers (play, attack, call, flip, defeated, etc.) are already
  // matched to the correct event by matchTriggers' targeted pass — let them through.
  if (ability.trigger.trigger !== "event") return true;

  // Event-typed triggers: matchTriggers' broadcast pass already pre-filters by DSL
  // event name, so the only remaining work is applying per-event property filters.
  if (ability.trigger.event.event === "cardPlayed" && event.type === "cardPlayed") {
    const filter = ability.trigger.event;
    const card = state.G.cardIndex[event.cardId as string];
    if (!card) return false;
    if (filter.player) {
      const playedController = card.controllerId as string;
      if (filter.player === "friendly" && playedController !== (sourcePlayerId as string)) {
        return false;
      }
      if (filter.player === "rival" && playedController === (sourcePlayerId as string)) {
        return false;
      }
    }
    const cardDef = defOf(card);
    if (filter.target.cardTypes && !hasAnyEffectiveCardType(card, filter.target.cardTypes)) {
      return false;
    }
    if (filter.target.colors && !filter.target.colors.includes(cardDef.color)) {
      return false;
    }
    if (filter.target.classifications) {
      const cardClassifications = cardDef.classifications ?? [];
      const hasMatch = filter.target.classifications.some((c) => cardClassifications.includes(c));
      if (!hasMatch) return false;
    }
  }

  if (ability.trigger.event.event === "cardAttacks" && event.type === "attackDeclared") {
    const filter = ability.trigger.event;
    const attacker = state.G.cardIndex[event.attackerId as string];
    if (!attacker) return false;
    if (filter.player) {
      const attackerController = attacker.controllerId as string;
      if (filter.player === "friendly" && attackerController !== (sourcePlayerId as string)) {
        return false;
      }
      if (filter.player === "rival" && attackerController === (sourcePlayerId as string)) {
        return false;
      }
    }
    if (filter.target) {
      const attackerDef = defOf(attacker);
      if (filter.target.cardTypes && !hasAnyEffectiveCardType(attacker, filter.target.cardTypes)) {
        return false;
      }
      if (filter.target.classifications) {
        const cardClassifications = attackerDef.classifications ?? [];
        const hasMatch = filter.target.classifications.some((c) => cardClassifications.includes(c));
        if (!hasMatch) return false;
      }
    }
  }

  if (ability.trigger.event.event === "cardSpent" && event.type === "cardSpent") {
    const filter = ability.trigger.event;
    const spentCard = state.G.cardIndex[event.cardId as string];
    if (!spentCard) return false;
    if (filter.player && filter.player !== "any") {
      const spentController = spentCard.controllerId as string;
      if (filter.player === "friendly" && spentController !== (sourcePlayerId as string)) {
        return false;
      }
      if (filter.player === "rival" && spentController === (sourcePlayerId as string)) {
        return false;
      }
    }
    if (!cardMatchesEventFilter(filter.target, spentCard, abilityCardId, state, sourcePlayerId)) {
      return false;
    }
  }

  if (ability.trigger.event.event === "cardDefeated" && event.type === "cardDefeated") {
    const filter = ability.trigger.event;
    const defeatedCard = state.G.cardIndex[event.cardId as string];
    if (!defeatedCard) return false;
    if (filter.player && filter.player !== "any") {
      const defeatedController = defeatedCard.controllerId as string;
      if (filter.player === "friendly" && defeatedController !== (sourcePlayerId as string)) {
        return false;
      }
      if (filter.player === "rival" && defeatedController === (sourcePlayerId as string)) {
        return false;
      }
    }
    if (
      !cardMatchesEventFilter(
        filter.target,
        defeatedCard,
        abilityCardId,
        state,
        sourcePlayerId,
        event.hadAttachedCards,
      )
    ) {
      return false;
    }
  }

  if (ability.trigger.event.event === "blockerActivated" && event.type === "blockerActivated") {
    const filter = ability.trigger.event;
    const blocker = state.G.cardIndex[event.blockerId as string];
    if (!blocker) return false;
    if (filter.player && filter.player !== "any") {
      const blockerController = blocker.controllerId as string;
      if (filter.player === "friendly" && blockerController !== (sourcePlayerId as string)) {
        return false;
      }
      if (filter.player === "rival" && blockerController === (sourcePlayerId as string)) {
        return false;
      }
    }
    if (!cardMatchesEventFilter(filter.target, blocker, abilityCardId, state, sourcePlayerId)) {
      return false;
    }
  }

  if (ability.trigger.event.event === "gigValueChanged" && event.type === "gigValueChanged") {
    const filter = ability.trigger.event;
    if (filter.direction) {
      const decreased = event.newValue < event.previousValue;
      const increased = event.newValue > event.previousValue;
      if (filter.direction === "decrease" && !decreased) return false;
      if (filter.direction === "increase" && !increased) return false;
    }
    if (filter.player) {
      // "player" refers to who caused the value change.
      // The event's playerId is the gig owner.
      // If "player: rival" — the causer is the rival, meaning the gig owner is the
      // friendly player (same as sourcePlayerId, the ability card's controller).
      // If "player: friendly" — the causer is friendly, meaning the gig owner is
      // the rival (different from sourcePlayerId).
      if (filter.player === "rival" && (event.playerId as string) !== (sourcePlayerId as string)) {
        return false;
      }
      if (
        filter.player === "friendly" &&
        (event.playerId as string) === (sourcePlayerId as string)
      ) {
        return false;
      }
    }
  }

  if (ability.trigger.event.event === "gigsSwapped" && event.type === "gigsSwapped") {
    const filter = ability.trigger.event;
    if (filter.player === "friendly" && event.playerId !== sourcePlayerId) return false;
    if (filter.player === "rival" && event.playerId === sourcePlayerId) return false;
    if (filter.target.controller === "friendly" && !event.fromPlayerIds.includes(sourcePlayerId)) {
      return false;
    }
    if (
      filter.target.controller === "rival" &&
      !event.fromPlayerIds.some((playerId) => playerId !== sourcePlayerId)
    ) {
      return false;
    }
  }

  if (ability.trigger.event.event === "gigRolled" && event.type === "gigDieRolled") {
    const filter = ability.trigger.event;
    if (filter.origin !== undefined && event.origin !== filter.origin) {
      return false;
    }
    if (filter.player) {
      if (
        filter.player === "friendly" &&
        (event.playerId as string) !== (sourcePlayerId as string)
      ) {
        return false;
      }
      if (filter.player === "rival" && (event.playerId as string) === (sourcePlayerId as string)) {
        return false;
      }
    }
    const die = state.G.gigDice[event.dieId as string];
    if (!die) return false;
    if (filter.target.sides !== undefined) {
      const wanted = Array.isArray(filter.target.sides)
        ? filter.target.sides
        : [filter.target.sides];
      if (!wanted.includes(die.dieType)) return false;
    }
    if (filter.target.minValue !== undefined && die.faceValue < filter.target.minValue) {
      return false;
    }
    if (filter.target.maxValue !== undefined && die.faceValue > filter.target.maxValue) {
      return false;
    }
    if (filter.target.valueParity !== undefined) {
      const wantEven = filter.target.valueParity === "even";
      if ((die.faceValue % 2 === 0) !== wantEven) return false;
    }
  }

  if (ability.trigger.event.event === "turnEnded" && event.type === "turnEnded") {
    const filter = ability.trigger.event;
    if (filter.player && filter.player !== "any") {
      if (
        filter.player === "friendly" &&
        (event.playerId as string) !== (sourcePlayerId as string)
      ) {
        return false;
      }
      if (filter.player === "rival" && (event.playerId as string) === (sourcePlayerId as string)) {
        return false;
      }
    }
  }

  if (ability.trigger.event.event === "turnStarted" && event.type === "turnStarted") {
    const filter = ability.trigger.event;
    if (filter.player && filter.player !== "any") {
      if (
        filter.player === "friendly" &&
        (event.playerId as string) !== (sourcePlayerId as string)
      ) {
        return false;
      }
      if (filter.player === "rival" && (event.playerId as string) === (sourcePlayerId as string)) {
        return false;
      }
    }
  }

  if (ability.trigger.event.event === "fightResolved" && event.type === "attackResolved") {
    // Only fight outcomes; direct attacks (gigsStolen / blocked) don't fire fightResolved.
    if (event.attackKind !== "fight") return false;
    if (
      event.result !== "attackerWins" &&
      event.result !== "defenderWins" &&
      event.result !== "mutual"
    ) {
      return false;
    }
    const filter = ability.trigger.event;
    if (filter.result !== undefined && filter.result !== event.result) return false;
    const attacker = state.G.cardIndex[event.attackerId as string];
    const defender = event.defenderId ? state.G.cardIndex[event.defenderId as string] : undefined;
    if (!attacker) return false;
    if (filter.player && filter.player !== "any") {
      const attackerController = attacker.controllerId as string;
      if (filter.player === "friendly" && attackerController !== (sourcePlayerId as string)) {
        return false;
      }
      if (filter.player === "rival" && attackerController === (sourcePlayerId as string)) {
        return false;
      }
    }
    if (
      filter.attacker &&
      !cardMatchesEventFilter(filter.attacker, attacker, abilityCardId, state, sourcePlayerId)
    ) {
      return false;
    }
    if (filter.defender) {
      if (!defender) return false;
      if (
        !cardMatchesEventFilter(filter.defender, defender, abilityCardId, state, sourcePlayerId)
      ) {
        return false;
      }
    }
    if (filter.winner) {
      const winner =
        event.result === "attackerWins"
          ? attacker
          : event.result === "defenderWins"
            ? defender
            : undefined;
      if (
        !winner ||
        !cardMatchesEventFilter(filter.winner, winner, abilityCardId, state, sourcePlayerId)
      ) {
        return false;
      }
    }
  }

  if (ability.trigger.event.event === "gigStolen" && event.type === "gigStolen") {
    const filter = ability.trigger.event;
    const stolenDieIds = event.dieIds?.length ? event.dieIds : [event.dieId];
    if (filter.minAmount !== undefined && stolenDieIds.length < filter.minAmount) {
      return false;
    }
    if (filter.player) {
      if (
        filter.player === "friendly" &&
        (event.toPlayerId as string) !== (sourcePlayerId as string)
      ) {
        return false;
      }
      if (
        filter.player === "rival" &&
        (event.toPlayerId as string) === (sourcePlayerId as string)
      ) {
        return false;
      }
    }
    if (filter.source?.selector === "self") {
      if (!event.sourceCardId || !abilityCardId) return false;
      if ((event.sourceCardId as string) !== (abilityCardId as string)) {
        return false;
      }
    }
    if (filter.source?.selector === "host") {
      // The source must be the host of the ability card (e.g. gorilla-arms
      // attached to huscle — only when huscle steals does the filter pass).
      if (!event.sourceCardId || !abilityCardId) return false;
      const abilityCard = state.G.cardIndex[abilityCardId as string];
      const hostId = abilityCard?.meta.attachedToId;
      if (!hostId || (event.sourceCardId as string) !== (hostId as string)) {
        return false;
      }
    }
    if (filter.source?.selector === "card") {
      // Filter the thief (event source) by static card data: cardTypes,
      // classifications, controller, etc. (e.g. evelyn-parker requires a
      // friendly Corpo/Ganger Unit; take-control requires a rival Unit).
      if (!event.sourceCardId) return false;
      const sourceCard = state.G.cardIndex[event.sourceCardId as string];
      if (!sourceCard) return false;
      if (
        !cardMatchesEventFilter(filter.source, sourceCard, abilityCardId, state, sourcePlayerId)
      ) {
        return false;
      }
    }
    if (filter.target) {
      if (
        filter.target.controller === "friendly" &&
        (event.fromPlayerId as string) !== (sourcePlayerId as string)
      ) {
        return false;
      }
      if (
        filter.target.controller === "rival" &&
        (event.fromPlayerId as string) === (sourcePlayerId as string)
      ) {
        return false;
      }
      // Filter the stolen die (event.dieId) by the Gig target's die-level
      // filters: sides, minValue, maxValue, valueParity. Used by cards that
      // trigger only when a specific kind of Gig is stolen (e.g. 6th-street-
      // recruits only cares about a stolen d6).
      const matchesTarget = stolenDieIds.some((dieId) => {
        const die = state.G.gigDice[dieId as string];
        if (!die) return false;
        if (filter.target.sides !== undefined) {
          const wanted = Array.isArray(filter.target.sides)
            ? filter.target.sides
            : [filter.target.sides];
          if (!wanted.includes(die.dieType)) return false;
        }
        if (filter.target.minValue !== undefined && die.faceValue < filter.target.minValue) {
          return false;
        }
        if (filter.target.maxValue !== undefined && die.faceValue > filter.target.maxValue) {
          return false;
        }
        if (filter.target.valueParity !== undefined) {
          const wantEven = filter.target.valueParity === "even";
          if ((die.faceValue % 2 === 0) !== wantEven) return false;
        }
        return true;
      });
      if (!matchesTarget) return false;
    }
    if (filter.valueLessThanSourcePower) {
      if (!event.sourceCardId) return false;
      const thiefPower = getEffectivePower(state, event.sourceCardId as string);
      if (
        !stolenDieIds.some((dieId) => {
          const stolen = state.G.gigDice[dieId as string];
          return stolen !== undefined && stolen.faceValue < thiefPower;
        })
      ) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Lightweight card matcher used by event filters where the full target
 * resolver isn't available (we only have the event data + the ability's
 * source card). Supports `self`, `host`, and the static-data subset of
 * `card` filtering (cardTypes, classifications, controller). Returns false
 * for selectors that need full game state (e.g. zone or state filters).
 */
function cardMatchesEventFilter(
  filter: import("@tcg/cyberpunk-types").TargetDSL,
  card: import("./types/card-instance.ts").CardInstance,
  abilityCardId: CardInstanceId | undefined,
  state: MatchState,
  sourcePlayerId: PlayerId,
  attachedCardsOverride?: boolean,
): boolean {
  if (filter.selector === "self") {
    return abilityCardId !== undefined && (card.instanceId as string) === (abilityCardId as string);
  }
  if (filter.selector === "host") {
    if (!abilityCardId) return false;
    const abilityCard = state.G.cardIndex[abilityCardId as string];
    if (!abilityCard?.meta.attachedToId) return false;
    return (card.instanceId as string) === (abilityCard.meta.attachedToId as string);
  }
  if (filter.selector === "card") {
    const def = defOf(card);
    if (filter.cardTypes && !hasAnyEffectiveCardType(card, filter.cardTypes)) return false;
    if (filter.classifications) {
      const cardClassifications = def.classifications ?? [];
      const hasMatch = filter.classifications.some((c) => cardClassifications.includes(c));
      if (!hasMatch) return false;
    }
    if (filter.keywords && filter.keywords.length > 0) {
      const cardKeywords = def.keywords ?? [];
      const hasMatch = filter.keywords.some((keyword) => cardKeywords.includes(keyword));
      if (!hasMatch) return false;
    }
    if (filter.colors && !filter.colors.includes(def.color)) return false;
    if (filter.hasAttachedCards !== undefined) {
      const hasAttachedCards = attachedCardsOverride ?? card.meta.attachedGearIds.length > 0;
      if (filter.hasAttachedCards !== hasAttachedCards) return false;
    }
    if (filter.controller) {
      const controller = card.controllerId as string;
      if (filter.controller === "friendly" && controller !== (sourcePlayerId as string)) {
        return false;
      }
      if (filter.controller === "rival" && controller === (sourcePlayerId as string)) {
        return false;
      }
    }
    if (
      filter.excludeSelf &&
      abilityCardId &&
      (card.instanceId as string) === (abilityCardId as string)
    ) {
      return false;
    }
    return true;
  }
  return false;
}

/**
 * Builds contextTargets from an event, injecting event data like the attacking card.
 * These are available via `selector: "context", key: "triggerCard"` in ability DSL.
 */
function buildContextTargets(event: GameEvent): Record<string, string[]> {
  const ctx: Record<string, string[]> = {};
  if (event.type === "attackDeclared" && event.attackerId) {
    ctx["triggerCard"] = [event.attackerId as string];
  }
  if (event.type === "cardPlayed" && event.cardId) {
    ctx["triggerCard"] = [event.cardId as string];
  }
  if (event.type === "cardSpent" && event.cardId) {
    ctx["triggerCard"] = [event.cardId as string];
  }
  if (event.type === "cardDefeated" && event.cardId) {
    ctx["triggerCard"] = [event.cardId as string];
    if (event.hostId) {
      ctx["host"] = [event.hostId as string];
    }
  }
  if (event.type === "blockerActivated" && event.blockerId) {
    ctx["triggerCard"] = [event.blockerId as string];
  }
  if (event.type === "gigStolen" && event.dieId) {
    ctx["triggeredGigs"] = (event.dieIds?.length ? event.dieIds : [event.dieId]).map(String);
    if (event.sourceCardId) {
      ctx["triggerCard"] = [event.sourceCardId as string];
    }
  }
  if (event.type === "gigDieRolled" && event.dieId) {
    ctx["triggeredGigs"] = [event.dieId as string];
  }
  if (event.type === "attackResolved" && event.attackKind === "fight") {
    ctx["fightAttacker"] = [event.attackerId as string];
    if (event.defenderId) ctx["fightDefender"] = [event.defenderId as string];
  }
  return ctx;
}

function resolveBindings(
  ability: Ability,
  state: MatchState,
  sourceCardId: CardInstanceId,
  sourcePlayerId: PlayerId,
  contextTargets: Record<string, string[]> = {},
): Record<string, string[]> {
  const bound: Record<string, string[]> = {};
  if (!ability.bindings) return bound;

  const ctx: ResolutionContext = {
    state,
    sourceCardId,
    sourcePlayerId,
    abilityIndex: -1,
    contextTargets,
    boundTargets: {},
  };

  for (const binding of ability.bindings) {
    if (isSelectableBinding(binding)) continue;
    const targets = resolveTarget(binding.target, ctx);
    if (targets.length > 0) {
      bound[binding.id] = [targets[0]!];
    }
  }

  return bound;
}

export function executeAbilityEffects(
  effects: Effect[],
  ctx: ResolutionContext,
  operations: Operations,
  startIndex = 0,
  opts: { nested?: boolean } = {},
): AbilityExecutionStatus {
  if (!effects || effects.length === 0) return "resolved";
  for (let i = startIndex; i < effects.length; i++) {
    const effect = effects[i]!;
    if (effect.conditions && effect.conditions.length > 0) {
      const failedConditions = effect.conditions.filter((c) => !evaluateCondition(c, ctx));
      if (failedConditions.length > 0) {
        emitSkippedEffectLog(effect, failedConditions, ctx, operations);
        continue;
      }
    }

    if (effect.optional) {
      const hasTarget = effectHasTarget(effect, ctx);
      if (!hasTarget) continue;
    }

    const eventsBefore = operations.event.getEmittedEvents().length;
    const result = resolveEffect(effect, ctx, operations);
    if (result.status === "suspended") {
      const current = ctx.state.G.turnMetadata.currentTrigger;
      if (current) {
        if (opts.nested) {
          // Preserve outer ability nextEffectIndex; only advance the nested frame.
          current.continuation = { effects, nextIndex: i + 1 };
        } else {
          current.nextEffectIndex = i + 1;
          current.continuation = undefined;
        }
      }
      return "suspended";
    }

    // Process triggers for events emitted during effect resolution when the effect itself
    // performs a game action that normally has a dedicated move.
    const eventsAfter = operations.event.getEmittedEvents();
    const effectEvents = eventsAfter.slice(eventsBefore);
    emitResolvedEffectLog(effect, effectEvents, ctx, operations);
    enqueueTriggerEventsSince(eventsBefore, ctx.state, operations);

    if (result.status === "partial" && result.remaining.length > 0) {
      const status = executeAbilityEffects(result.remaining, ctx, operations, 0, { nested: true });
      if (status === "suspended") {
        // Partial expansion replaces this effect slot; advance the outer list past it
        // so resume does not re-enter chooseEffect after the nested body finishes.
        const current = ctx.state.G.turnMetadata.currentTrigger;
        if (current && !opts.nested) {
          current.nextEffectIndex = i + 1;
        }
        return "suspended";
      }
      return "resolved";
    }
  }
  return "resolved";
}

function emitResolvedEffectLog(
  effect: Effect,
  effectEvents: readonly GameEvent[],
  ctx: ResolutionContext,
  operations: Operations,
): void {
  if (effect.effect !== "draw") return;

  const drawEvents = effectEvents.filter(
    (event): event is Extract<GameEvent, { type: "cardsDrawn" }> =>
      event.type === "cardsDrawn" && event.count > 0,
  );
  if (drawEvents.length === 0) return;

  const drawnCount = drawEvents.reduce((sum, event) => sum + event.count, 0);
  const drawnCardIds = drawEvents.flatMap((event) => event.cardIds as unknown as string[]);
  const drawnCardNames = drawnCardIds
    .map((cardId) => ctx.state.G.cardIndex[cardId])
    .filter((card): card is NonNullable<typeof card> => card !== undefined)
    .map((card) => {
      const definition = defOf(card);
      return definition.displayName ?? definition.name;
    });
  const card = ctx.state.G.cardIndex[ctx.sourceCardId as string];
  const sourceCardName = card ? defOf(card).displayName : "Unknown card";
  const drawPlayerId = drawEvents[0]?.playerId ?? ctx.sourcePlayerId;

  operations.event.emit({
    type: "actionLog",
    messageKey: "effect.draw.resolved",
    params: {
      sourceCardName,
      drawnCount,
      drawnCardIds: privateField(drawnCardIds as readonly string[], [drawPlayerId]),
      drawnCardNames: privateField(drawnCardNames.join(", "), [drawPlayerId]),
    },
    playerId: ctx.sourcePlayerId,
    category: "effect",
    cardIds: [ctx.sourceCardId as string],
  });
}

function emitSkippedEffectLog(
  effect: Effect,
  failedConditions: readonly Condition[],
  ctx: ResolutionContext,
  operations: Operations,
): void {
  if (effect.effect !== "draw") return;

  const card = ctx.state.G.cardIndex[ctx.sourceCardId as string];
  const sourceCardName = card ? defOf(card).displayName : "Unknown card";
  operations.event.emit({
    type: "actionLog",
    messageKey: "effect.draw.skipped",
    params: {
      sourceCardName,
      reason: describeFailedConditions(failedConditions),
    },
    playerId: ctx.sourcePlayerId,
    category: "effect",
    cardIds: [ctx.sourceCardId as string],
  });
}

function describeFailedConditions(conditions: readonly Condition[]): string {
  if (conditions.length === 1) {
    return describeConditionFailure(conditions[0]!);
  }
  return "conditions were not met";
}

function describeConditionFailure(condition: Condition): string {
  switch (condition.condition) {
    case "hasGigAtMaxValue":
      return `no ${relativePlayerText(condition.controller)} Gig is at max value`;
    case "hasGigPair":
      return `${relativePlayerText(condition.controller)} does not control a value-pair`;
    case "hasDistinctGigValues":
      return `${relativePlayerText(condition.controller)} does not control ${condition.minCount} different Gig values`;
    case "hasMinGig":
      return `${relativePlayerText(condition.controller)} does not control a min Gig`;
    case "hasEvenAndOddGigValues":
      return `${relativePlayerText(condition.controller)} does not control both even and odd Gig values`;
    case "hasGigCount": {
      const gigDescription =
        condition.minValue === undefined
          ? "matching Gigs"
          : `Gigs with value ${condition.minValue} or higher`;
      return `${relativePlayerText(condition.controller)} does not control ${comparisonText(
        condition.comparison,
      )} ${condition.value} ${gigDescription}`;
    }
    case "hasEquippedUnitsOrLegends":
      return `${relativePlayerText(condition.controller)} does not control ${condition.minCount} equipped Units and/or Legends`;
    case "matchingGig":
      return `no ${relativePlayerText(condition.controller)} Gig matches the target`;
    case "streetCred":
      return `${relativePlayerText(condition.controller)} Street Cred is not ${comparisonText(
        condition.comparison,
      )} ${condition.value}`;
    case "streetCredComparison":
      return `${relativePlayerText(condition.controller)} Street Cred is not ${comparisonText(
        condition.comparison,
      )} ${relativePlayerText(condition.other)} Street Cred`;
    case "gigCountComparison":
      return `${relativePlayerText(condition.controller)} Gig count is not ${comparisonText(
        condition.comparison,
      )} ${relativePlayerText(condition.other)} Gig count`;
    case "streetCredDifference":
      return `${relativePlayerText(condition.controller)} Street Cred does not differ from ${relativePlayerText(
        condition.other,
      )} Street Cred by ${comparisonText(condition.comparison)} ${condition.value}`;
    case "gigCountDifference":
      return `${relativePlayerText(condition.controller)} Gig count is not ${comparisonText(
        condition.comparison,
      )} ${relativePlayerText(condition.other)} Gig count plus ${condition.value}`;
    case "streetCredParity":
      return `${relativePlayerText(condition.controller)} Street Cred is not ${condition.parity}`;
    case "allFriendlyLegendsFaceUp":
      return "not all friendly Legends are face-up";
    case "cardState":
      return "the required card state is not true";
    case "turn":
      return `it is not the ${relativePlayerText(condition.player)} turn`;
    case "overtime":
      return condition.active === false ? "overtime is active" : "overtime is not active";
    case "targetValue":
      return "the target value condition is not true";
    case "targetBecameValue":
      return "the target did not change to the required value";
    case "attacking":
      return "the required card is not attacking";
    case "hasLag":
      return "the required card does not have Lag";
    case "hasStolenGigThisTurn":
      return "the required card did not steal a Gig this turn";
    case "fightKind":
      return "the attack type condition is not true";
    case "costMatchesGig":
      return `no ${relativePlayerText(condition.controller)} Gig matches the card cost`;
    case "cardStat":
      return `${relativePlayerText(undefined)} card ${condition.property} is not ${comparisonText(
        condition.comparison,
      )} ${condition.value}`;
    case "cardName":
      return `target card is not named "${condition.name}"`;
    case "targetExists":
      return "the required target does not exist";
    case "gigSides":
      return "the required gig die sides are not present";
    case "any":
      return "none of the alternative conditions are true";
    case "not":
      return "negated condition is true";
    case "targetParity":
      return `the target gig value is not ${condition.parity}`;
    case "discardedCountMatchesGig":
      return `discarded card count does not match a ${relativePlayerText(condition.controller)} Gig value`;
    case "fixerAreaCount":
      return `${relativePlayerText(condition.controller)} fixer area count is not ${comparisonText(
        condition.comparison,
      )} ${condition.value}`;
    default:
      return assertNever(condition);
  }
}

function relativePlayerText(player: string | undefined): string {
  if (player === "rival") return "rival";
  return "friendly";
}

function comparisonText(comparison: string): string {
  switch (comparison) {
    case "eq":
      return "equal to";
    case "lt":
      return "less than";
    case "lte":
      return "less than or equal to";
    case "gt":
      return "greater than";
    case "gte":
      return "greater than or equal to";
    default:
      return comparison;
  }
}

function canPayAbilityCosts(ability: Ability, ctx: ResolutionContext): boolean {
  if (!ability.costs) return true;
  for (let i = 0; i < (ability.costs as AbilityCost[]).length; i++) {
    const cost = (ability.costs as AbilityCost[])[i]!;
    switch (cost.cost) {
      case "spend": {
        const selection = getSelection(cost.target);
        if (selection && !ctx.boundTargets[abilityCostBindingId(i)]) break;
        const targets = resolveCostTargets(cost, i, ctx);
        if (targets.length < (selection?.min ?? 0)) return false;
        for (const id of targets) {
          const card = ctx.state.G.cardIndex[id as string];
          if (card?.meta.spent) return false;
        }
        break;
      }
      case "payCardCost":
      case "payEddies": {
        break;
      }
      default:
        return assertNever(cost);
    }
  }
  return canPayAbilityEddieCosts(
    ability,
    ctx.state,
    ctx.sourceCardId,
    ctx.sourcePlayerId,
    ctx.boundTargets,
  );
}

function computePayEddiesAmount(
  cost: Extract<AbilityCost, { cost: "payEddies" }>,
  ctx: ResolutionContext,
): number {
  let amount = cost.amount;
  if (cost.reduction) {
    const count = resolveTarget(cost.reduction.target, ctx).length;
    amount -= count * cost.reduction.reductionPerCount;
    const min = cost.reduction.min ?? 0;
    amount = Math.max(amount, min);
  }
  return amount;
}

function payAbilityCosts(ability: Ability, ctx: ResolutionContext, operations: Operations): void {
  if (!ability.costs) return;
  const excludedLegendIds = reservedLegendIdsForAbilityCosts(
    ability,
    ctx.state,
    ctx.sourceCardId,
    ctx.sourcePlayerId,
    ctx.boundTargets,
  );
  for (let i = 0; i < (ability.costs as AbilityCost[]).length; i++) {
    const cost = (ability.costs as AbilityCost[])[i]!;
    switch (cost.cost) {
      case "spend": {
        const targets = resolveCostTargets(cost, i, ctx);
        for (const id of targets) {
          operations.card.spend(id as CardInstanceId);
        }
        break;
      }
      case "payCardCost": {
        const card = ctx.state.G.cardIndex[ctx.sourceCardId as string];
        if (card) {
          operations.game.spendEddies(ctx.sourcePlayerId, defOf(card).cost ?? 0, "abilityCost", {
            excludedLegendIds,
          });
          if (card.zone === "hand" && defOf(card).type === "program") {
            operations.zone.moveCard(ctx.sourceCardId, "trash", ctx.sourcePlayerId);
          }
        }
        break;
      }
      case "payEddies": {
        operations.game.spendEddies(
          ctx.sourcePlayerId,
          computePayEddiesAmount(cost, ctx),
          "abilityCost",
          { excludedLegendIds },
        );
        break;
      }
      default:
        assertNever(cost);
    }
  }
}

function effectHasTarget(effect: Effect, ctx: ResolutionContext): boolean {
  if ("target" in effect && effect.target) {
    const targets = resolveTarget(effect.target as any, ctx);
    return targets.length > 0;
  }
  return true;
}

export function abilityHasRequiredEffectTargets(
  ability: Ability,
  ctx: ResolutionContext,
  startIndex = 0,
): boolean {
  // Skip ability if any non-optional effect requires a target but none exist.
  // Also skip if an ifYouDo's optional-with-player-choice doEffect has no valid targets
  // (e.g. Panam: no gear attached → no choice to make → don't spend Panam).
  //
  // Exception: a required targeted effect with zero candidates no-ops at
  // execution (resolveEffect returns { status: "noAction" }). It should only
  // gate the ability when there is no other effect that would still resolve —
  // i.e. the empty-target effect is the sole meaningful outcome. If an
  // independent effect follows (e.g. Floor It's "Draw 1" after a debuff that
  // has no target), the trigger still enqueues so the independent effect runs.
  const effects = ability.effects.slice(startIndex);
  let hasIndependentResolvable = false;
  for (const effect of effects) {
    const conditionsPass =
      !effect.conditions?.length ||
      effect.conditions.every((condition) => evaluateCondition(condition, ctx));
    if (
      conditionsPass &&
      (effectResolvesWithoutCardTarget(effect, ability, ctx) || effectHasTarget(effect, ctx))
    ) {
      hasIndependentResolvable = true;
      break;
    }
  }
  return effects.every((effect) => {
    // An effect whose conditions fail is inert, so it neither needs a target
    // nor counts as an independent resolvable outcome.
    if (effect.conditions?.length && !effect.conditions.every((c) => evaluateCondition(c, ctx))) {
      return true;
    }
    // Effects that resolve without any card target never gate the ability.
    if (effectResolvesWithoutCardTarget(effect, ability, ctx)) return true;
    const target = (effect as any).target;
    if (target.selector === "bound") {
      // Declared ability bindings can be evaluated now (selectable ones
      // always pass; others need ≥1 resolved target). Bindings that are NOT
      // declared — produced mid-ability by an effect like trashFromDeck's
      // `outputBinding` — can't be evaluated until the producing effect
      // runs, so defer (the effect itself returns noAction if empty).
      const declared = ability.bindings?.find((binding) => binding.id === target.id);
      if (!declared) return true;
      if (isSelectableBinding(declared)) return true;
      return resolveTarget(target, ctx).length > 0;
    }
    const hasCandidates = resolveTarget(target, ctx).length > 0;
    // An empty targeted effect doesn't gate the ability when another effect
    // would still resolve independently; it no-ops per-effect instead.
    if (!hasCandidates && hasIndependentResolvable) return true;
    return hasCandidates;
  });
}

/**
 * Whether an effect still resolves when its (possibly empty) card target is
 * absent — i.e. it has no target, an optional/scry target, a selectable bound
 * target, or an ifYouDo whose doEffect doesn't require a missing target.
 *
 * This is the SINGLE source of truth for "does this effect need a card target?",
 * shared by the independence pre-scan and the per-effect gate above so the two
 * never disagree (Floor It: the debuff has no target, but "Draw 1" still fires).
 */
function effectResolvesWithoutCardTarget(
  effect: Effect,
  ability: Ability,
  ctx: ResolutionContext,
): boolean {
  // An effect whose conditions fail is inert — it neither needs a target nor
  // counts as an independent resolvable outcome. This must mirror the gate's
  // conditions branch above so the pre-scan and the gate agree on this axis
  // (e.g. a draw gated on `targetExists(attacker)` is not independent when the
  // attacker is absent).
  if (effect.conditions?.length && !effect.conditions.every((c) => evaluateCondition(c, ctx))) {
    return false;
  }
  if (effect.optional) return true;
  if (effect.effect === "scry") return true;
  if (effect.effect === "ifYouDo") {
    // An ifYouDo only needs a target when its optional doEffect attaches to
    // an explicit target; otherwise it resolves regardless of any card target.
    const doEffect = (effect as import("@tcg/cyberpunk-types").IfYouDoEffect).doEffect;
    if (doEffect.optional && "attachTo" in doEffect && (doEffect as any).attachTo) {
      if (!("target" in doEffect) || !(doEffect as any).target) return true;
      return resolveTarget((doEffect as any).target, ctx).length > 0;
    }
    return true;
  }
  if (!("target" in effect) || !effect.target) return true;
  const target = effect.target as any;
  if (target.selector === "bound") {
    const declared = ability.bindings?.find((binding) => binding.id === target.id);
    if (!declared) return true;
    if (isSelectableBinding(declared)) return true;
  }
  return false;
}

function optionalEffectWaitsOnSelectableBinding(
  effect: Effect,
  ability: Ability,
  ctx: ResolutionContext,
): boolean {
  const refs = [getEffectTarget(effect), getEffectSource(effect)];
  for (const ref of refs) {
    if (!ref || ref.selector !== "bound") continue;
    const binding = ability.bindings?.find((candidate) => candidate.id === ref.id);
    if (binding && isSelectableBinding(binding) && ctx.boundTargets[binding.id] === undefined) {
      return true;
    }
  }
  return false;
}

function getEffectTarget(effect: Effect): { selector?: string; id?: string } | undefined {
  return "target" in effect
    ? (effect.target as { selector?: string; id?: string } | undefined)
    : undefined;
}

function getEffectSource(effect: Effect): { selector?: string; id?: string } | undefined {
  return "source" in effect
    ? (effect.source as { selector?: string; id?: string } | undefined)
    : undefined;
}

function abilityHasApplicableEffects(ability: Ability, ctx: ResolutionContext): boolean {
  return ability.effects.some((effect) => {
    if (effect.conditions?.length && !effect.conditions.every((c) => evaluateCondition(c, ctx))) {
      return false;
    }
    if (effect.optional) {
      return (
        effectHasTarget(effect, ctx) || optionalEffectWaitsOnSelectableBinding(effect, ability, ctx)
      );
    }
    return true;
  });
}

function emitNoValidTargetsLog(
  sourceCardId: CardInstanceId,
  sourcePlayerId: PlayerId,
  state: MatchState,
  operations: Operations,
): void {
  const card = state.G.cardIndex[sourceCardId as string];
  const cardName = card ? defOf(card).displayName : "Unknown card";
  operations.event.emit({
    type: "actionLog",
    messageKey: "trigger.noValidTargets",
    params: { cardName },
    playerId: sourcePlayerId,
    category: "trigger",
    cardIds: [sourceCardId as string],
  });
}

function isOptionalTrigger(state: MatchState, cardId: CardInstanceId, ability: Ability): boolean {
  const card = state.G.cardIndex[cardId as string];
  if (!card) return false;
  const def = defOf(card);
  const hasPayCost =
    ability.costs?.some((cost) => cost.cost === "payCardCost" || cost.cost === "payEddies") ===
    true;
  if (ability.trigger && hasPayCost && /\bmay pay\b/i.test(ability.text)) return true;
  if (optionalEffectsRequirePreselectedBindings(ability)) {
    return true;
  }
  return (
    card.zone === "hand" &&
    def.type === "program" &&
    ability.costs?.some((cost) => cost.cost === "payCardCost") === true
  );
}

function optionalEffectsRequirePreselectedBindings(ability: Ability): boolean {
  if (
    ability.effects.length === 0 ||
    !ability.effects.every((effect) => effect.optional === true)
  ) {
    return false;
  }
  const selectableBindingIds = new Set(
    (ability.bindings ?? [])
      .filter((binding) => isSelectableBinding(binding))
      .map((binding) => binding.id),
  );
  return ability.effects.some((effect) =>
    collectBoundSelectorIds(effect).some((id) => selectableBindingIds.has(id)),
  );
}

function collectBoundSelectorIds(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(collectBoundSelectorIds);
  if (typeof value !== "object" || value === null) return [];
  const record = value as Record<string, unknown>;
  const ownId = record.selector === "bound" && typeof record.id === "string" ? [record.id] : [];
  return [...ownId, ...Object.values(record).flatMap(collectBoundSelectorIds)];
}

function isProgramPlayAbility(
  cardId: CardInstanceId,
  _ability: Ability,
  state: MatchState,
): boolean {
  const card = state.G.cardIndex[cardId as string];
  if (!card) return false;
  return defOf(card).type === "program";
}

function bindingFeedsPaidPlayCard(ability: Ability, bindingId: string): boolean {
  return ability.effects.some((effect) => {
    if (effect.optional || effect.effect !== "playCard" || effect.free === true) return false;
    return boundTargetId(effect.target) === bindingId;
  });
}

function requiresExplicitSelectableBinding(ability: Ability, bindingId: string): boolean {
  return ability.effects.some((effect) => {
    if (
      effect.effect === "adjustGig" &&
      "target" in effect &&
      boundTargetId(effect.target) === bindingId
    ) {
      return true;
    }
    if (effect.effect !== "playCard" && effect.effect !== "attachCard") {
      return false;
    }
    if (boundTargetId(effect.target) === bindingId) {
      return true;
    }
    return "attachTo" in effect && boundTargetId(effect.attachTo) === bindingId;
  });
}

function boundTargetId(target: unknown): string | null {
  if (
    target &&
    typeof target === "object" &&
    "selector" in target &&
    target.selector === "bound" &&
    "id" in target &&
    typeof target.id === "string"
  ) {
    return target.id;
  }
  return null;
}

type AbilityTargetBinding = NonNullable<Ability["bindings"]>[number];

function getSelection(target: AbilityTargetBinding["target"]) {
  if (target.selector !== "card" && target.selector !== "gig" && target.selector !== "context")
    return undefined;
  return target.selection;
}

function isSelectableBinding(binding: AbilityTargetBinding): boolean {
  return getSelection(binding.target)?.mode === "choose";
}

function getPendingSelectableBinding(
  ability: Ability,
  boundTargets: Record<string, string[]>,
): AbilityTargetBinding | undefined {
  return ability.bindings?.find(
    (binding) => isSelectableBinding(binding) && boundTargets[binding.id] === undefined,
  );
}

function findFollowingAdjustGig(
  ability: Ability,
  bindingId: string,
):
  | { direction?: string; maxAmount?: number; chooseUpTo?: boolean; effectIndex: number }
  | undefined {
  const effectIndex = ability.effects.findIndex(
    (candidate) =>
      candidate.effect === "adjustGig" &&
      "target" in candidate &&
      candidate.target?.selector === "bound" &&
      candidate.target.id === bindingId,
  );
  const effect = ability.effects[effectIndex];
  if (!effect || effect.effect !== "adjustGig") {
    return undefined;
  }
  return {
    direction: effect.direction,
    maxAmount: effect.maxAmount,
    chooseUpTo: effect.chooseUpTo,
    effectIndex,
  };
}

function getPendingSelectableCost(
  ability: Ability,
  boundTargets: Record<string, string[]>,
  ctx: ResolutionContext,
): { cost: Extract<AbilityCost, { cost: "spend" }>; bindingId: string } | undefined {
  const costs = (ability.costs ?? []) as AbilityCost[];
  for (let i = 0; i < costs.length; i++) {
    const cost = costs[i]!;
    if (cost.cost !== "spend") continue;
    if (!getSelection(cost.target)) continue;
    const bindingId = abilityCostBindingId(i);
    if ((boundTargets[bindingId]?.length ?? 0) > 0) continue;
    if (resolveSelectableCostTargets(cost, ctx).length === 0) continue;
    return { cost, bindingId };
  }
  return undefined;
}

function resolveCostTargets(
  cost: Extract<AbilityCost, { cost: "spend" }>,
  costIndex: number,
  ctx: ResolutionContext,
): string[] {
  if (getSelection(cost.target)) {
    return ctx.boundTargets[abilityCostBindingId(costIndex)] ?? [];
  }
  return resolveTarget(cost.target, ctx);
}

function resolveSelectableCostTargets(
  cost: Extract<AbilityCost, { cost: "spend" }>,
  ctx: ResolutionContext,
): string[] {
  return resolveTarget(cost.target, ctx).filter((id) => {
    const card = ctx.state.G.cardIndex[id as string];
    return card !== undefined && !card.meta.spent;
  });
}

function getAbility(
  card: import("./types/card-instance.ts").CardInstance,
  abilityIndex: number,
): Ability | undefined {
  const def = defOf(card) as import("@tcg/cyberpunk-types").StructuredCardDefinition;
  return def.abilities?.[abilityIndex];
}

function hasDrawEffect(effects: readonly Effect[]): boolean {
  for (const effect of effects) {
    if (effect.effect === "draw") return true;
    if (effect.effect === "ifYouDo") {
      if (
        hasDrawEffect([effect.doEffect]) ||
        hasDrawEffect(effect.ifEffects) ||
        hasDrawEffect(effect.elseEffects ?? [])
      ) {
        return true;
      }
    }
    if (effect.effect === "delayed" || effect.effect === "forEachFriendlyGigPair") {
      if (hasDrawEffect(effect.effects)) return true;
    }
  }
  return false;
}
