import { grandArchiveObjectCurrentCharacteristics } from "../rules/state/continuous.ts";
import {
  proposeGrandArchiveCombatCleanup,
  proposeGrandArchiveCombatDamage,
  proposeGrandArchiveRetaliationDecision,
} from "./combat/combat.ts";
import type {
  GrandArchiveCommandSuccess,
  GrandArchiveCommandTransition,
} from "../kernel/command-results.ts";
import type { GrandArchiveCommandHandlerContext } from "../commands/handler-context.ts";
import { activeGrandArchiveRequiredAttackRules } from "../commands/handlers/declare-attack.ts";
import type { GrandArchiveProposedEvent } from "../kernel/events.ts";
import {
  evaluateGrandArchiveAmount,
  resolveGrandArchiveSubjectObjects,
} from "./effects/evaluation.ts";
import { grandArchiveDecisionId } from "../game/identity.ts";
import type { GrandArchiveObjectId, GrandArchivePlayerId } from "../game/identity.ts";
import type { GrandArchiveCardInstance, GrandArchiveMatchState } from "../game/model.ts";
import { nextGrandArchivePlayer, openGrandArchiveOpportunity } from "./game-flow/opportunity.ts";
import {
  deriveGrandArchiveContinuousPlayerProperty,
  grandArchivePlayerHasState,
} from "../rules/state/player-continuous.ts";
import {
  collectGrandArchiveActionRules,
  collectGrandArchivePlayerActionRules,
  deriveGrandArchivePlayerActionLimit,
  grandArchiveActionIsForbidden,
  grandArchivePlayerActionIsForbidden,
  grandArchiveRemainingPlayerActionAllowance,
} from "../rules/state/rule-modifications.ts";
import { collectGrandArchiveOnChargeCounterEvents } from "../rules/abilities/triggers.ts";

function unsatisfiedRequiredAttack(
  context: GrandArchiveCommandHandlerContext,
): { readonly attackerId: GrandArchiveObjectId } | undefined {
  const state = context.getState();
  const playerId = state.turn.playerId;
  const possibleTargetIds = Object.values(state.objects)
    .filter((object) => object.zone === "field" && object.controllerId !== playerId)
    .map((object) => object.id);
  for (const attacker of Object.values(state.objects)) {
    if (attacker.zone !== "field" || attacker.controllerId !== playerId) continue;
    for (const rule of activeGrandArchiveRequiredAttackRules(
      context.getProgram(),
      state,
      attacker.id,
      possibleTargetIds,
      playerId,
    )) {
      const minimum = rule.effect.requiredCount
        ? evaluateGrandArchiveAmount(rule.effect.requiredCount.minimum, rule.evaluation)
        : 1;
      const requiredAgainstIds = rule.effect.against
        ? resolveGrandArchiveSubjectObjects(rule.effect.against, rule.evaluation).map(
            (object) => object.id,
          )
        : [];
      const attempts = state.turn.attackAttempts.filter(
        (attempt) =>
          attempt.attackerId === attacker.id &&
          (requiredAgainstIds.length === 0 ||
            attempt.targetIds.some((targetId) => requiredAgainstIds.includes(targetId))),
      ).length;
      if (attempts < minimum) return { attackerId: attacker.id };
    }
  }
  return undefined;
}

export function completeGrandArchiveEmptyStackPassCycle(
  context: GrandArchiveCommandHandlerContext,
  playerId: GrandArchivePlayerId,
): GrandArchiveCommandTransition {
  const state = context.getState();
  const events: GrandArchiveProposedEvent[] = [
    {
      type: "opportunity-passed",
      playerId,
      actorId: playerId,
      cause: { kind: "command", move: "pass" },
    },
    { type: "opportunity-closed", cause: { kind: "rule", rule: "opportunity-cycle-complete" } },
  ];
  switch (state.turn.phase) {
    case "main": {
      const unsatisfied = unsatisfiedRequiredAttack(context);
      if (unsatisfied) {
        events.push({
          type: "opportunity-opened",
          window: openGrandArchiveOpportunity(state, state.turn.playerId, "turn-based-action"),
          cause: {
            kind: "rule",
            rule: `required-attack-pending:${unsatisfied.attackerId}`,
          },
        });
        return context.commit(events);
      }
      if (state.gameStates["time-distorted"] === true) {
        const projected = context.getKernel().transact(state, events).state;
        events.push(
          ...grandArchiveMaterializePhaseEvents(
            context,
            projected,
            state.turn.playerId,
            "time-distorted-additional-materialize-phase",
            "additional",
          ),
        );
      } else {
        const projected = context.getKernel().transact(state, events).state;
        events.push(
          ...grandArchiveEndPhaseEvents(context, projected, state.turn.playerId, "main-complete"),
        );
      }
      return context.commit(events);
    }
    case "recollection": {
      if (!state.turn.recollectionPending) {
        return completeGrandArchiveAutomaticPhaseIfReady(
          context,
          context.commit([...events, ...grandArchiveDrawPhaseEvents(context, state.turn.playerId)]),
        );
      }
      const candidateIds = state.zones[state.turn.playerId].memory;
      const amount = grandArchiveRecollectionAmount(
        context,
        state.turn.playerId,
        candidateIds.length,
      );
      if (amount < candidateIds.length) {
        return context.commit([
          ...events,
          {
            type: "decision-created",
            decision: {
              id: grandArchiveDecisionId(`decision-${state.nextDecisionOrdinal}`),
              kind: "choose-recollection",
              playerId: state.turn.playerId,
              amount,
              candidateIds,
              stateVersion: state.stateVersion,
            },
            cause: { kind: "rule", rule: "choose-cards-to-recollect" },
          },
        ]);
      }
      return commitGrandArchiveRecollection(context, [
        ...events,
        ...grandArchiveRecollectionEvents(state.turn.playerId, candidateIds),
      ]);
    }
    case "materialize":
      if (state.turn.materializeKind === "additional") {
        events.push(
          {
            type: "phase-changed",
            phase: "end",
            actorId: state.turn.playerId,
            cause: { kind: "rule", rule: "additional-materialize-phase-complete" },
          },
          {
            type: "opportunity-opened",
            window: openGrandArchiveOpportunity(state, state.turn.playerId, "phase-begin"),
            cause: { kind: "rule", rule: "end-phase-opportunity" },
          },
        );
      } else {
        const projected = context.getKernel().transact(state, events).state;
        events.push(
          ...grandArchiveRecollectionPhaseEvents(
            context,
            projected,
            state.turn.playerId,
            "materialize-phase-complete",
          ),
        );
      }
      return context.commit(events);
    case "end":
      return continueGrandArchiveEndCleanup(
        context,
        context.commit([
          ...events,
          // CR End Phase 3: clearing ally damage and expiring turn effects are
          // simultaneous. Stabilize only after both have been committed.
          ...grandArchiveAllyDamageCleanupEvents(context, state),
          {
            type: "turn-cleanup-pending-changed" as const,
            value: true,
            actorId: state.turn.playerId,
            cause: {
              kind: "rule" as const,
              rule: state.turn.cleanupPending ? "end-cleanup-restarted" : "end-cleanup-started",
            },
          },
        ]),
      );
    case "combat": {
      const combat = state.combat;
      if (!combat) return context.failure("illegal-command", "Combat phase has no combat state");
      if (combat.step === "retaliation") {
        return context.commit([
          ...events,
          ...proposeGrandArchiveRetaliationDecision(context.getProgram(), state),
        ]);
      }
      if (combat.step === "damage") {
        if (combat.retaliatorIds.length > 1 && !combat.retaliationOrderConfirmed) {
          return context.commit([
            ...events,
            {
              type: "decision-created",
              decision: {
                id: grandArchiveDecisionId(`decision-${state.nextDecisionOrdinal}`),
                kind: "order-retaliation-damage",
                playerId: combat.attackingPlayerId,
                retaliatorIds: combat.retaliatorIds,
                stateVersion: state.stateVersion,
              },
              cause: { kind: "rule", rule: "order-retaliation-damage" },
            },
          ]);
        }
        return commitGrandArchiveCombatDamage(context, events, state);
      }
      if (combat.step === "end") {
        return context.commit([...events, ...proposeGrandArchiveCombatCleanup(state)]);
      }
      return context.failure("illegal-command", "Attack declaration cannot receive Opportunity");
    }
    case "wake-up":
    case "draw":
      return context.commit([...events, ...grandArchiveAutomaticPhaseCompletionEvents(context)]);
    default: {
      const exhaustivePhase: never = state.turn.phase;
      return exhaustivePhase;
    }
  }
}

export function commitGrandArchiveCombatDamage(
  context: GrandArchiveCommandHandlerContext,
  prefixEvents: readonly GrandArchiveProposedEvent[],
  damageState: GrandArchiveMatchState,
): GrandArchiveCommandSuccess {
  return completeGrandArchiveCombatDamageTransition(
    context,
    context.commit([
      ...prefixEvents,
      ...proposeGrandArchiveCombatDamage(context.getProgram(), damageState),
    ]),
  );
}

export function completeGrandArchiveCombatDamageTransition(
  context: GrandArchiveCommandHandlerContext,
  damage: GrandArchiveCommandSuccess,
): GrandArchiveCommandSuccess {
  const state = context.getState();
  if (
    state.status === "playing" &&
    !state.decision &&
    state.stack.length === 0 &&
    state.combat?.step === "end"
  ) {
    const cleanup = context.commit(proposeGrandArchiveCombatCleanup(state));
    return {
      ok: true,
      state: cleanup.state,
      events: [...damage.events, ...cleanup.events],
    };
  }
  return damage;
}

export function grandArchiveDrawPhaseEvents(
  context: GrandArchiveCommandHandlerContext,
  playerId: GrandArchivePlayerId,
  state: GrandArchiveMatchState = context.getState(),
): readonly GrandArchiveProposedEvent[] {
  const skipsDraw = (state.players[playerId]?.phaseSkips.draw ?? 0) > 0;
  if (skipsDraw) {
    const skipped: readonly GrandArchiveProposedEvent[] = [
      {
        type: "phase-skip-consumed",
        playerId,
        phase: "draw",
        cause: { kind: "rule", rule: "consume-draw-phase-skip" },
      },
    ];
    const projected = context.getKernel().transact(state, skipped).state;
    return [...skipped, ...grandArchiveMainPhaseEvents(context, projected, playerId)];
  }
  const topCard = state.zones[playerId]["main-deck"][0];
  const drawState = skipsDraw
    ? state
    : context.getKernel().transact(state, [
        {
          type: "phase-changed",
          phase: "draw",
          actorId: playerId,
          cause: { kind: "rule", rule: "draw-phase" },
        },
      ]).state;
  const mayDraw =
    !grandArchivePlayerActionIsForbidden({
      action: "draw",
      playerId,
      evaluation: {
        program: context.getProgram(),
        state: drawState,
        controllerId: playerId,
        bindings: {},
      },
    }) &&
    grandArchiveRemainingPlayerActionAllowance({
      action: "draw",
      playerId,
      evaluation: {
        program: context.getProgram(),
        state: drawState,
        controllerId: playerId,
        bindings: {},
      },
    }) > 0;
  const events: GrandArchiveProposedEvent[] = [
    {
      type: "phase-changed",
      phase: "draw",
      actorId: playerId,
      cause: { kind: "rule", rule: "draw-phase" },
    },
  ];
  if (!skipsDraw && mayDraw && topCard) {
    if (
      grandArchivePlayerHasState(context.getProgram(), drawState, playerId, {
        named: "top-main-deck-revealed",
      })
    ) {
      events.push({
        type: "card-revealed",
        objectId: topCard,
        playerId,
        actorId: playerId,
        cause: { kind: "rule", rule: "revealed-top-card-drawn" },
      });
    }
    events.push({
      type: "object-moved",
      objectId: topCard,
      from: "main-deck",
      to: "hand",
      actorId: playerId,
      cause: { kind: "rule", rule: "draw-turn-based-action" },
    });
  }
  if (
    !skipsDraw &&
    mayDraw &&
    !topCard &&
    !collectGrandArchivePlayerActionRules({
      action: "lose-game",
      playerId,
      evaluation: {
        program: context.getProgram(),
        state: drawState,
        controllerId: playerId,
        bindings: {},
      },
    }).some((rule) => rule.effect.mode === "forbid")
  ) {
    events.push({
      type: "player-lost",
      playerId,
      reason: "deck-out",
      cause: { kind: "rule", rule: "empty-deck-draw-attempt" },
    });
  }
  return events;
}

function grandArchiveMaterializePhaseEvents(
  context: GrandArchiveCommandHandlerContext,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  rule: string,
  materializeKind: "regular" | "additional" = "regular",
): readonly GrandArchiveProposedEvent[] {
  if ((state.players[playerId]?.phaseSkips.materialize ?? 0) > 0) {
    const skipped: readonly GrandArchiveProposedEvent[] = [
      {
        type: "phase-skip-consumed",
        playerId,
        phase: "materialize",
        cause: { kind: "rule", rule: "consume-materialize-phase-skip" },
      },
    ];
    const projected = context.getKernel().transact(state, skipped).state;
    return materializeKind === "additional"
      ? [
          ...skipped,
          ...grandArchiveEndPhaseEvents(context, projected, playerId, "materialize-skipped"),
        ]
      : [
          ...skipped,
          ...grandArchiveRecollectionPhaseEvents(
            context,
            projected,
            playerId,
            "materialize-skipped",
          ),
        ];
  }
  return [
    {
      type: "phase-changed",
      phase: "materialize",
      actorId: playerId,
      materializeKind,
      cause: { kind: "rule", rule },
    },
  ];
}

export function grandArchiveRecollectionPhaseEvents(
  context: GrandArchiveCommandHandlerContext,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  rule: string,
): readonly GrandArchiveProposedEvent[] {
  if ((state.players[playerId]?.phaseSkips.recollection ?? 0) > 0) {
    const skipped: readonly GrandArchiveProposedEvent[] = [
      {
        type: "phase-skip-consumed",
        playerId,
        phase: "recollection",
        cause: { kind: "rule", rule: "consume-recollection-phase-skip" },
      },
    ];
    const projected = context.getKernel().transact(state, skipped).state;
    return [...skipped, ...grandArchiveDrawPhaseEvents(context, playerId, projected)];
  }
  return [
    {
      type: "phase-changed",
      phase: "recollection",
      actorId: playerId,
      cause: { kind: "rule", rule },
    },
    ...collectGrandArchiveOnChargeCounterEvents(context.getProgram(), state, playerId),
    {
      type: "opportunity-opened",
      window: openGrandArchiveOpportunity(state, playerId, "phase-begin"),
      cause: { kind: "rule", rule: "recollection-phase-opportunity" },
    },
  ];
}

function grandArchiveMainPhaseEvents(
  context: GrandArchiveCommandHandlerContext,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
): readonly GrandArchiveProposedEvent[] {
  if ((state.players[playerId]?.phaseSkips.main ?? 0) > 0) {
    const skipped: readonly GrandArchiveProposedEvent[] = [
      {
        type: "phase-skip-consumed",
        playerId,
        phase: "main",
        cause: { kind: "rule", rule: "consume-main-phase-skip" },
      },
    ];
    const projected = context.getKernel().transact(state, skipped).state;
    return [
      ...skipped,
      ...grandArchiveEndPhaseEvents(context, projected, playerId, "main-skipped"),
    ];
  }
  return [
    {
      type: "phase-changed",
      phase: "main",
      actorId: playerId,
      cause: { kind: "rule", rule: "draw-complete" },
    },
    {
      type: "opportunity-opened",
      window: openGrandArchiveOpportunity(state, playerId, "phase-begin"),
      cause: { kind: "rule", rule: "main-phase-opportunity" },
    },
  ];
}

export function grandArchiveEndPhaseEvents(
  context: GrandArchiveCommandHandlerContext,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  rule: string,
): readonly GrandArchiveProposedEvent[] {
  if ((state.players[playerId]?.phaseSkips.end ?? 0) > 0) {
    const skipped: readonly GrandArchiveProposedEvent[] = [
      {
        type: "phase-skip-consumed",
        playerId,
        phase: "end",
        cause: { kind: "rule", rule: "consume-end-phase-skip" },
      },
    ];
    const projected = context.getKernel().transact(state, skipped).state;
    return [...skipped, ...grandArchiveNextTurnEvents(context, projected)];
  }
  return [
    { type: "phase-changed", phase: "end", actorId: playerId, cause: { kind: "rule", rule } },
    {
      type: "opportunity-opened",
      window: openGrandArchiveOpportunity(state, playerId, "phase-begin"),
      cause: { kind: "rule", rule: "end-phase-opportunity" },
    },
  ];
}

function grandArchiveForcedCombatCleanupEvents(
  state: GrandArchiveMatchState,
  options: { readonly suppressOpportunity?: true } = {},
): readonly GrandArchiveProposedEvent[] {
  if (!state.combat) return [];
  if (state.combat.step === "end") return proposeGrandArchiveCombatCleanup(state, options);
  const cleanupState: GrandArchiveMatchState = {
    ...state,
    combat: { ...state.combat, step: "end" },
  };
  return [
    {
      type: "combat-step-changed",
      step: "end",
      cause: { kind: "rule", rule: "forced-combat-enters-end-step" },
    },
    ...proposeGrandArchiveCombatCleanup(cleanupState, options),
  ];
}

function grandArchiveForcedEndCleanupEvents(
  context: GrandArchiveCommandHandlerContext,
  state: GrandArchiveMatchState,
): readonly GrandArchiveProposedEvent[] {
  return [
    ...grandArchiveForcedCombatCleanupEvents(state, { suppressOpportunity: true }),
    ...grandArchiveAllyDamageCleanupEvents(context, state),
    {
      type: "turn-cleanup-pending-changed",
      value: true,
      actorId: state.turn.playerId,
      cause: { kind: "rule", rule: "end-cleanup-started" },
    },
  ];
}

/**
 * Applies CR “Ending Phases” after the ending effect itself has resolved and
 * the remaining Effects Stack has been abandoned. Phase-entry helpers retain
 * skip counters and the mode-specific turn sequence while omitting every
 * remaining action in the phase being ended.
 */
export function grandArchiveForcedPhaseEndEvents(
  context: GrandArchiveCommandHandlerContext,
  state: GrandArchiveMatchState,
  phase: GrandArchiveMatchState["turn"]["phase"],
): readonly GrandArchiveProposedEvent[] {
  if (state.turn.phase !== phase) {
    throw new Error(`Cannot finish ${phase} while the turn is in ${state.turn.phase}`);
  }
  const playerId = state.turn.playerId;
  switch (phase) {
    case "wake-up":
      return state.gameStates["time-distorted"] === true
        ? grandArchiveRecollectionPhaseEvents(context, state, playerId, "wake-up-ended-by-effect")
        : grandArchiveMaterializePhaseEvents(context, state, playerId, "wake-up-ended-by-effect");
    case "materialize":
      return state.turn.materializeKind === "additional"
        ? grandArchiveEndPhaseEvents(
            context,
            state,
            playerId,
            "additional-materialize-ended-by-effect",
          )
        : grandArchiveRecollectionPhaseEvents(
            context,
            state,
            playerId,
            "materialize-ended-by-effect",
          );
    case "recollection":
      return grandArchiveDrawPhaseEvents(context, playerId, state);
    case "draw":
      return grandArchiveMainPhaseEvents(context, state, playerId);
    case "main":
      return grandArchiveEndPhaseEvents(context, state, playerId, "main-ended-by-effect");
    case "combat":
      if (!state.combat) throw new Error("A combat phase cannot end without combat state");
      return grandArchiveForcedCombatCleanupEvents(state);
    case "end":
      return grandArchiveForcedEndCleanupEvents(context, state);
    default: {
      const exhaustivePhase: never = phase;
      return exhaustivePhase;
    }
  }
}

/** Jump directly to the End phase cleanup procedure without beginning-of-End events. */
export function grandArchiveForcedTurnEndEvents(
  context: GrandArchiveCommandHandlerContext,
  state: GrandArchiveMatchState,
): readonly GrandArchiveProposedEvent[] {
  return grandArchiveForcedEndCleanupEvents(context, state);
}

export function grandArchiveRecollectionAmount(
  context: GrandArchiveCommandHandlerContext,
  playerId: GrandArchivePlayerId,
  baseAmount: number,
): number {
  return Math.min(
    baseAmount,
    deriveGrandArchivePlayerActionLimit(
      {
        action: "recollect",
        playerId,
        evaluation: {
          program: context.getProgram(),
          state: context.getState(),
          controllerId: playerId,
          bindings: {},
        },
      },
      baseAmount,
    ),
  );
}

export function grandArchiveRecollectionEvents(
  playerId: GrandArchivePlayerId,
  objectIds: readonly GrandArchiveObjectId[],
): readonly GrandArchiveProposedEvent[] {
  return [
    ...objectIds.map((objectId): GrandArchiveProposedEvent => ({
      type: "object-moved",
      objectId,
      from: "memory",
      to: "hand",
      actorId: playerId,
      cause: { kind: "rule", rule: "recollection-turn-based-action" },
    })),
    {
      type: "cards-recollected",
      playerId,
      objectIds,
      actorId: playerId,
      cause: { kind: "rule", rule: "recollection-turn-based-action" },
    },
  ];
}

export function commitGrandArchiveRecollection(
  context: GrandArchiveCommandHandlerContext,
  events: readonly GrandArchiveProposedEvent[],
): GrandArchiveCommandSuccess {
  const recollected = context.commit(events);
  const state = context.getState();
  if (
    state.status !== "playing" ||
    state.turn.phase !== "recollection" ||
    state.turn.recollectionPending ||
    state.decision ||
    state.opportunity ||
    state.stack.length > 0 ||
    state.pendingTriggers.length > 0 ||
    state.resolution
  ) {
    return recollected;
  }
  const advanced = completeGrandArchiveAutomaticPhaseIfReady(
    context,
    context.commit(grandArchiveDrawPhaseEvents(context, state.turn.playerId)),
  );
  return {
    ok: true,
    state: advanced.state,
    events: [...recollected.events, ...advanced.events],
  };
}

function wakeIsForbidden(
  context: GrandArchiveCommandHandlerContext,
  playerId: GrandArchivePlayerId,
  object: GrandArchiveCardInstance,
  state: GrandArchiveMatchState = context.getState(),
): boolean {
  return grandArchiveActionIsForbidden({
    action: "wake",
    activationKind: "card",
    playerId,
    candidateId: object.id,
    fromZone: "field",
    evaluation: {
      program: context.getProgram(),
      state,
      controllerId: playerId,
      candidateId: object.id,
      bindings: {},
    },
  });
}

function grandArchiveAllyDamageCleanupEvents(
  context: GrandArchiveCommandHandlerContext,
  state: GrandArchiveMatchState,
): readonly GrandArchiveProposedEvent[] {
  const events: GrandArchiveProposedEvent[] = [];
  for (const object of Object.values(state.objects)) {
    if (
      object.zone === "field" &&
      object.damage > 0 &&
      grandArchiveObjectCurrentCharacteristics(context.getProgram(), state, object).types.includes(
        "ALLY",
      )
    ) {
      events.push({
        type: "damage-cleared",
        objectId: object.id,
        cause: { kind: "rule", rule: "end-cleanup" },
      });
    }
  }
  return events;
}

function grandArchiveEndCleanupEvents(
  context: GrandArchiveCommandHandlerContext,
): readonly GrandArchiveProposedEvent[] {
  const state = context.getState();
  const playerId = state.turn.playerId;
  const events: GrandArchiveProposedEvent[] = [
    ...grandArchiveAllyDamageCleanupEvents(context, state),
  ];
  for (const candidateId of state.turnOrder) {
    if (state.players[candidateId]?.states.agility === true) {
      events.push({
        type: "player-state-changed",
        playerId: candidateId,
        state: "agility",
        value: false,
        cause: { kind: "rule", rule: "agility-expires-during-cleanup" },
      });
    }
  }
  const empower = state.players[playerId]?.states.empower;
  if (typeof empower === "number" && empower !== 0) {
    events.push({
      type: "player-state-changed",
      playerId,
      state: "empower",
      value: 0,
      cause: { kind: "rule", rule: "empower-expires-at-end-of-turn" },
    });
  }
  for (const object of Object.values(state.objects)) {
    if (
      object.zone === "field" &&
      object.controllerId === playerId &&
      object.states.has("distant") &&
      !(
        grandArchivePlayerHasState(context.getProgram(), state, playerId, {
          named: "ranger-units-always-distant",
        }) &&
        (() => {
          const characteristics = grandArchiveObjectCurrentCharacteristics(
            context.getProgram(),
            state,
            object,
          );
          return (
            characteristics.classes.includes("RANGER") &&
            characteristics.types.some((type) => type === "ALLY" || type === "CHAMPION")
          );
        })()
      )
    ) {
      events.push({
        type: "object-state-changed",
        objectId: object.id,
        state: "distant",
        value: false,
        cause: { kind: "rule", rule: "distant-expires-at-end-of-controller-turn" },
      });
    }
  }
  const maximumInfluence = deriveGrandArchiveContinuousPlayerProperty(
    context.getProgram(),
    state,
    playerId,
    "maximum-influence",
  );
  if (maximumInfluence !== undefined) {
    const candidateIds = [...state.zones[playerId].hand, ...state.zones[playerId].memory];
    const excess = candidateIds.length - maximumInfluence;
    if (excess > 0) {
      events.push({
        type: "decision-created",
        decision: {
          id: grandArchiveDecisionId(`decision-${state.nextDecisionOrdinal}`),
          kind: "discard-to-influence-limit",
          playerId,
          maximum: maximumInfluence,
          amount: excess,
          candidateIds,
          stateVersion: state.stateVersion,
        },
        cause: { kind: "rule", rule: "discard-to-influence-limit" },
      });
      return events;
    }
  }
  return events;
}

function grandArchiveNextTurnEvents(
  context: GrandArchiveCommandHandlerContext,
  state: GrandArchiveMatchState = context.getState(),
): readonly GrandArchiveProposedEvent[] {
  const playerId = state.turn.playerId;
  const events: GrandArchiveProposedEvent[] = [
    {
      type: "turn-cleanup-pending-changed",
      value: false,
      cause: { kind: "rule", rule: "end-cleanup-complete" },
    },
  ];
  if (!state.players[playerId]?.hasTakenFirstTurn) {
    events.push({
      type: "player-first-turn-completed",
      playerId,
      cause: { kind: "rule", rule: "first-turn-complete" },
    });
  }
  const nextPlayerId = nextGrandArchivePlayer(state, playerId);
  events.push({
    type: "turn-started",
    playerId: nextPlayerId,
    turnNumber: state.turn.number + 1,
    cause: { kind: "rule", rule: "next-turn" },
  });
  const nextPlayer = state.players[nextPlayerId];
  const projectedState = context.getKernel().transact(state, events).state;
  if (!nextPlayer?.hasTakenFirstTurn) {
    events.push(...grandArchiveDrawPhaseEvents(context, nextPlayerId, projectedState));
    return events;
  }
  const skipsWakeUp = (nextPlayer.phaseSkips["wake-up"] ?? 0) > 0;
  if (skipsWakeUp) {
    const skipped: readonly GrandArchiveProposedEvent[] = [
      {
        type: "phase-skip-consumed",
        playerId: nextPlayerId,
        phase: "wake-up",
        cause: { kind: "rule", rule: "consume-wake-up-phase-skip" },
      },
    ];
    events.push(...skipped);
    const afterSkip = context.getKernel().transact(projectedState, skipped).state;
    events.push(
      ...(state.gameStates["time-distorted"] === true
        ? grandArchiveRecollectionPhaseEvents(
            context,
            afterSkip,
            nextPlayerId,
            "time-distorted-skips-regular-materialize-phase",
          )
        : grandArchiveMaterializePhaseEvents(context, afterSkip, nextPlayerId, "wake-up-skipped")),
    );
    return events;
  }
  events.push({
    type: "phase-changed",
    phase: "wake-up",
    actorId: nextPlayerId,
    cause: { kind: "rule", rule: "wake-up-phase" },
  });
  for (const object of Object.values(state.objects)) {
    if (
      object.controllerId === nextPlayerId &&
      object.zone === "field" &&
      object.states.has("rested") &&
      !wakeIsForbidden(context, nextPlayerId, object, projectedState)
    ) {
      events.push({
        type: "object-state-changed",
        objectId: object.id,
        state: "rested",
        value: false,
        cause: { kind: "rule", rule: "wake-up-turn-based-action" },
      });
    }
  }
  return events;
}

function isQuiescentTurnProcedureState(state: GrandArchiveMatchState): boolean {
  return (
    state.status === "playing" &&
    !state.decision &&
    !state.opportunity &&
    state.stack.length === 0 &&
    state.pendingTriggers.length === 0 &&
    !state.resolution
  );
}

export function grandArchiveAutomaticPhaseCompletionEvents(
  context: GrandArchiveCommandHandlerContext,
): readonly GrandArchiveProposedEvent[] {
  const state = context.getState();
  const playerId = state.turn.playerId;
  if (state.turn.phase === "draw") {
    return grandArchiveMainPhaseEvents(context, state, playerId);
  }
  if (state.turn.phase !== "wake-up") {
    throw new Error(`No automatic completion exists for the ${state.turn.phase} phase`);
  }
  if (state.gameStates["time-distorted"] === true) {
    return grandArchiveRecollectionPhaseEvents(
      context,
      state,
      playerId,
      "time-distorted-skips-regular-materialize-phase",
    );
  }
  return grandArchiveMaterializePhaseEvents(context, state, playerId, "wake-up-complete");
}

export function completeGrandArchiveAutomaticPhaseIfReady(
  context: GrandArchiveCommandHandlerContext,
  transition: GrandArchiveCommandSuccess,
): GrandArchiveCommandSuccess {
  const state = context.getState();
  if (
    !isQuiescentTurnProcedureState(state) ||
    (state.turn.phase !== "wake-up" && state.turn.phase !== "draw")
  ) {
    return transition;
  }
  const advanced = context.commit(grandArchiveAutomaticPhaseCompletionEvents(context));
  return completeGrandArchiveAutomaticPhaseIfReady(context, {
    ok: true,
    state: advanced.state,
    events: [...transition.events, ...advanced.events],
  });
}

export function continueGrandArchiveEndCleanup(
  context: GrandArchiveCommandHandlerContext,
  transition: GrandArchiveCommandSuccess,
): GrandArchiveCommandSuccess {
  const state = context.getState();
  if (
    !isQuiescentTurnProcedureState(state) ||
    state.turn.phase !== "end" ||
    !state.turn.cleanupPending
  ) {
    return transition;
  }
  const cleanupEvents = grandArchiveEndCleanupEvents(context);
  if (cleanupEvents.length > 0) {
    const cleaned = context.commit(cleanupEvents);
    return continueGrandArchiveEndCleanup(context, {
      ok: true,
      state: cleaned.state,
      events: [...transition.events, ...cleaned.events],
    });
  }
  const nextTurn = completeGrandArchiveAutomaticPhaseIfReady(
    context,
    context.commit(grandArchiveNextTurnEvents(context)),
  );
  return {
    ok: true,
    state: nextTurn.state,
    events: [...transition.events, ...nextTurn.events],
  };
}
