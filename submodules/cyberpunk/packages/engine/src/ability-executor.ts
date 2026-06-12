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
import { defOf } from "./state/lookups.ts";
import { availableEddies } from "./moves/eddie-resources.ts";
import { assertNever } from "./types/exhaustive.ts";
import { privateField } from "./logging/private-field.ts";

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
      event.type === "gigValueChanged" ||
      event.type === "legendFlipped" ||
      event.type === "legendCalled" ||
      event.type === "cardSpent"
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
  const contextTargets = buildContextTargets(event);

  for (const match of matches) {
    const { cardId, playerId, ability, abilityIndex } = match;

    if (!passesEventFilter(event, ability, state, playerId, cardId)) continue;

    const boundTargets = resolveBindings(ability, state, cardId, playerId, contextTargets);

    // Skip ability if any required non-selectable binding has no valid targets.
    // Selectable bindings are checked later in resumeCurrentTrigger so that
    // mandatory abilities auto-drain when no targets exist instead of being
    // silently skipped. Program play abilities are still pre-filtered (old
    // behaviour) because the card is already in trash by the time triggers are
    // processed and the player has no meaningful choice to make.
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
            // For program play abilities, skip before enqueue (old behaviour).
            // For mandatory abilities, let them through to auto-drain.
            return !isProgramPlayAbility(cardId, ability, state);
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

    if (ability.conditions?.length && !ability.conditions.every((c) => evaluateCondition(c, ctx))) {
      continue;
    }

    if (!canPayAbilityCosts(ability, ctx)) {
      continue;
    }

    if (!allRequiredEffectsHaveTargets(ability, ctx)) {
      if (isProgramPlayAbility(cardId, ability, state)) {
        emitNoValidTargetsLog(cardId, playerId, state, operations);
        continue;
      }
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
      event,
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

export function continueTriggerResolution(state: MatchState, operations: Operations): void {
  if (state.G.turnMetadata.pendingChoice || state.G.turnMetadata.currentTrigger) return;

  while (!state.G.turnMetadata.pendingChoice && !state.G.turnMetadata.currentTrigger) {
    const queue = state.G.turnMetadata.triggerQueue;
    if (queue.length === 0) return;

    const earliest = [...queue].sort((a, b) => a.order - b.order)[0]!;
    const controllerId = earliest.sourcePlayerId;
    const controllerTriggers = queue
      .filter((trigger) => trigger.sourcePlayerId === controllerId)
      .sort((a, b) => a.order - b.order);

    if (controllerTriggers.length > 1 || controllerTriggers.some((trigger) => trigger.optional)) {
      operations.game.setPendingChoice({
        type: "chooseTrigger",
        chooserId: controllerId,
        effectId: "",
        payload: {
          canPass: controllerTriggers.some((trigger) => trigger.optional),
          options: controllerTriggers.map((trigger) => {
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
          }),
        },
      });
      return;
    }

    resolveQueuedTrigger(controllerTriggers[0]!.id, state, operations, { auto: true });
  }
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
  const [queued] = state.G.turnMetadata.triggerQueue.splice(index, 1);
  if (!queued) return;

  state.G.turnMetadata.currentTrigger = { ...queued, nextEffectIndex: 0 };
  operations.game.setPendingChoice(undefined);

  const card = state.G.cardIndex[queued.sourceCardId as string];
  const cardName = card ? defOf(card).displayName : "Unknown card";
  const ability = card ? getAbility(card, queued.abilityIndex) : undefined;
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

  const pendingBinding = getPendingSelectableBinding(ability, current.boundTargets);
  if (pendingBinding) {
    const selection = getSelection(pendingBinding.target);
    const targets = resolveTarget(pendingBinding.target, ctx);
    const min = selection?.min ?? 1;
    const max = selection?.max ?? 1;
    if (targets.length < min) {
      emitNoValidTargetsLog(current.sourceCardId, current.sourcePlayerId, state, operations);
      state.G.turnMetadata.currentTrigger = undefined;
      continueTriggerResolution(state, operations);
      return;
    }
    // Auto-select the single mandatory target (excluding program play abilities,
    // which remain player-selectable even when there is only one valid target).
    if (
      targets.length === 1 &&
      min === 1 &&
      max === 1 &&
      !current.optional &&
      !isProgramPlayAbility(current.sourceCardId, ability, state)
    ) {
      current.boundTargets[pendingBinding.id] = [targets[0]!];
      resumeCurrentTrigger(state, operations);
      return;
    }
    operations.game.setPendingChoice({
      type: "chooseTarget",
      chooserId: current.sourcePlayerId,
      effectId: current.id,
      payload: {
        type: "effectTarget",
        targetKind: pendingBinding.target.selector === "gig" ? "gig" : "card",
        eligibleIds: targets,
        adjustGig: findFollowingAdjustGig(ability, pendingBinding.id),
        min,
        max,
        canDecline: min === 0,
        sourceCardId: current.sourceCardId,
        sourcePlayerId: current.sourcePlayerId,
        abilityIndex: current.abilityIndex,
        contextTargets: current.contextTargets,
        boundTargets: current.boundTargets,
        selectedBindingId: pendingBinding.id,
      },
    });
    return;
  }

  if (ability.limits?.includes("firstTimeEachTurn")) {
    const alreadyFired = state.G.turnMetadata.abilityFiredThisTurn.some(
      (e) => e.cardId === current.sourceCardId && e.abilityIndex === current.abilityIndex,
    );
    if (alreadyFired) {
      state.G.turnMetadata.currentTrigger = undefined;
      continueTriggerResolution(state, operations);
      return;
    }
    state.G.turnMetadata.abilityFiredThisTurn.push({
      cardId: current.sourceCardId,
      abilityIndex: current.abilityIndex,
    });
  }

  if (!allRequiredEffectsHaveTargets(ability, ctx, current.nextEffectIndex)) {
    emitNoValidTargetsLog(current.sourceCardId, current.sourcePlayerId, state, operations);
    state.G.turnMetadata.currentTrigger = undefined;
    continueTriggerResolution(state, operations);
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
    const cardDef = defOf(card);
    if (filter.target.cardTypes && !filter.target.cardTypes.includes(cardDef.type)) {
      return false;
    }
    if (filter.target.colors && !filter.target.colors.includes(cardDef.color)) {
      return false;
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
      if (filter.target.cardTypes && !filter.target.cardTypes.includes(attackerDef.type)) {
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
    if (!cardMatchesEventFilter(filter.target, spentCard, abilityCardId, state)) {
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
    if (filter.result !== event.result) return false;
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
      !cardMatchesEventFilter(filter.attacker, attacker, abilityCardId, state)
    ) {
      return false;
    }
    if (filter.defender) {
      if (!defender) return false;
      if (!cardMatchesEventFilter(filter.defender, defender, abilityCardId, state)) {
        return false;
      }
    }
  }

  if (ability.trigger.event.event === "gigStolen" && event.type === "gigStolen") {
    const filter = ability.trigger.event;
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
    if (filter.cardTypes && !filter.cardTypes.includes(def.type)) return false;
    if (filter.classifications) {
      const cardClassifications = def.classifications ?? [];
      const hasMatch = filter.classifications.some((c) => cardClassifications.includes(c));
      if (!hasMatch) return false;
    }
    if (filter.colors && !filter.colors.includes(def.color)) return false;
    if (filter.controller) {
      const owner = card.controllerId as string;
      // Without a known sourcePlayerId here, we assume the attacker filter is
      // already validated upstream by `filter.player`. `controller` on the
      // attacker/defender filters typically refines further; accept rival/friendly
      // by passing through for now (callers should prefer `filter.player`).
      void owner;
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
  if (event.type === "cardSpent" && event.cardId) {
    ctx["triggerCard"] = [event.cardId as string];
  }
  if (event.type === "gigStolen" && event.dieId) {
    ctx["triggeredGigs"] = [event.dieId as string];
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
): AbilityExecutionStatus {
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
        current.nextEffectIndex = i + 1;
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
      const status = executeAbilityEffects(result.remaining, ctx, operations);
      if (status === "suspended") return "suspended";
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
    case "cardState":
      return "the required card state is not true";
    case "turn":
      return `it is not the ${relativePlayerText(condition.player)} turn`;
    case "overtime":
      return condition.active === false ? "overtime is active" : "overtime is not active";
    case "targetValue":
      return "the target value condition is not true";
    case "attacking":
      return "the required card is not attacking";
    case "playedThisTurn":
      return "the required card was not played this turn";
    case "fightKind":
      return "the attack type condition is not true";
    case "costMatchesGig":
      return `no ${relativePlayerText(condition.controller)} Gig matches the card cost`;
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
        if (selection && !ctx.boundTargets[costBindingId(i)]) break;
        const targets = resolveCostTargets(cost, i, ctx);
        if (targets.length < (selection?.min ?? 0)) return false;
        for (const id of targets) {
          const card = ctx.state.G.cardIndex[id as string];
          if (card?.meta.spent) return false;
        }
        break;
      }
      case "payCardCost": {
        const card = ctx.state.G.cardIndex[ctx.sourceCardId as string];
        const player = ctx.state.G.players[ctx.sourcePlayerId as string];
        if (!card || !player) return false;
        if (availableEddies(ctx.state, ctx.sourcePlayerId) < (defOf(card).cost ?? 0)) return false;
        break;
      }
      default:
        return assertNever(cost);
    }
  }
  return true;
}

function payAbilityCosts(ability: Ability, ctx: ResolutionContext, operations: Operations): void {
  if (!ability.costs) return;
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
          operations.game.spendEddies(ctx.sourcePlayerId, defOf(card).cost ?? 0, "abilityCost");
          if (card.zone === "hand" && defOf(card).type === "program") {
            operations.zone.moveCard(ctx.sourceCardId, "trash", ctx.sourcePlayerId);
          }
        }
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

function allRequiredEffectsHaveTargets(
  ability: Ability,
  ctx: ResolutionContext,
  startIndex = 0,
): boolean {
  // Skip ability if any non-optional effect requires a target but none exist.
  // Also skip if an ifYouDo's optional-with-player-choice doEffect has no valid targets
  // (e.g. Panam: no gear attached → no choice to make → don't spend Panam).
  return ability.effects.slice(startIndex).every((effect) => {
    if (effect.conditions?.length && !effect.conditions.every((c) => evaluateCondition(c, ctx))) {
      return true;
    }
    if (effect.optional) return true;
    if (effect.effect === "ifYouDo") {
      const doEffect = (effect as import("@tcg/cyberpunk-types").IfYouDoEffect).doEffect;
      if (doEffect.optional && "attachTo" in doEffect && (doEffect as any).attachTo) {
        if (!("target" in doEffect) || !(doEffect as any).target) return true;
        return resolveTarget((doEffect as any).target, ctx).length > 0;
      }
      return true;
    }
    if (!("target" in effect) || !effect.target) return true;
    const target = effect.target as any;
    if (
      target.selector === "bound" &&
      ability.bindings?.some((binding) => binding.id === target.id && isSelectableBinding(binding))
    ) {
      return true;
    }
    return resolveTarget(target, ctx).length > 0;
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
  return (
    card.zone === "hand" &&
    def.type === "program" &&
    ability.costs?.some((cost) => cost.cost === "payCardCost") === true
  );
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

type AbilityTargetBinding = NonNullable<Ability["bindings"]>[number];

function getSelection(target: AbilityTargetBinding["target"]) {
  if (target.selector !== "card" && target.selector !== "gig") return undefined;
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
): { direction?: string; maxAmount?: number; chooseUpTo?: boolean } | undefined {
  const effect = ability.effects.find(
    (candidate) =>
      candidate.effect === "adjustGig" &&
      "target" in candidate &&
      candidate.target?.selector === "bound" &&
      candidate.target.id === bindingId,
  );
  if (!effect || effect.effect !== "adjustGig") {
    return undefined;
  }
  return {
    direction: effect.direction,
    maxAmount: effect.maxAmount,
    chooseUpTo: effect.chooseUpTo,
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
    const bindingId = costBindingId(i);
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
    return ctx.boundTargets[costBindingId(costIndex)] ?? [];
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

function costBindingId(costIndex: number): string {
  return `__cost:${costIndex}`;
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
