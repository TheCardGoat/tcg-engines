import { routeGrandArchiveCommand } from "../../commands/command-router.ts";
import type {
  GrandArchiveCommandFailure,
  GrandArchiveCommandSuccess,
  GrandArchiveCommandTransition,
} from "../../kernel/command-results.ts";
import type { GrandArchiveCommandHandlerContext } from "../../commands/handler-context.ts";
import { createGrandArchiveCommandHandlers } from "../../commands/handlers/index.ts";
import type { GrandArchiveCommand } from "../../commands/commands.ts";
import type { GrandArchiveCommittedEvent, GrandArchiveProposedEvent } from "../../kernel/events.ts";
import { prepareGrandArchiveRuleBoundEvent } from "../../kernel/event-admission.ts";
import { grandArchiveDecisionId, grandArchiveStackItemId } from "../../game/identity.ts";
import type { GrandArchiveObjectId, GrandArchivePlayerId } from "../../game/identity.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import type { GrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { grandArchiveOpportunityIsSuppressed } from "./opportunity.ts";
import { collectGrandArchiveStateBasedEvents } from "../../rules/state/state-based.ts";
import { resolveTopGrandArchiveStackItem } from "../effects/stack-resolution.ts";
import {
  collectGrandArchivePendingTriggerProgressEvents,
  collectGrandArchiveTriggeredAbilityEvents,
  createGrandArchiveTriggeredStackItem,
} from "../../rules/abilities/triggers.ts";
import {
  chooseGrandArchiveReplacement,
  collectGrandArchiveReplacementCandidates,
} from "../../rules/replacements/replacements.ts";
import {
  readGrandArchiveWaitState,
  type GrandArchiveWaitState,
} from "../../projection/wait-state.ts";
import {
  completeGrandArchiveAutomaticPhaseIfReady,
  completeGrandArchiveCombatDamageTransition,
  continueGrandArchiveEndCleanup,
  grandArchiveEndPhaseEvents,
  grandArchiveForcedPhaseEndEvents,
  grandArchiveForcedTurnEndEvents,
  grandArchiveRecollectionPhaseEvents,
} from "../turn-progression.ts";

/**
 * Circuit breaker for one command's automatic rules fixed point. Legal trigger
 * batches can exceed ordinary deck size, so this must comfortably exceed the
 * old 64-pass implementation limit while still terminating a regressed loop.
 */
const GRAND_ARCHIVE_STABILIZATION_PASS_LIMIT = 4_096;

export interface GrandArchiveCommandContext {
  readonly playerId: GrandArchivePlayerId;
  readonly expectedStateVersion?: number;
}

export type {
  GrandArchiveCommandFailure,
  GrandArchiveCommandSuccess,
  GrandArchiveCommandTransition,
} from "../../kernel/command-results.ts";

function criticalReplacementDiscardCandidates(
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
): readonly GrandArchiveObjectId[] {
  const pendingDamage = state.replacementPreCommit?.continuation.queue[0]?.event;
  const held = new Set(
    pendingDamage?.type === "damage-marked" ? (pendingDamage.criticalDiscardIds ?? []) : [],
  );
  return state.zones[playerId].hand.filter((objectId) => !held.has(objectId));
}

export class GrandArchiveMatchRuntime {
  readonly #program: GrandArchiveMatchProgram;
  readonly #kernel: GrandArchiveTransactionKernel;
  #state: GrandArchiveMatchState;

  public constructor(
    program: GrandArchiveMatchProgram,
    initialState: GrandArchiveMatchState,
    kernel?: GrandArchiveTransactionKernel,
  ) {
    if (program.fingerprint !== initialState.programFingerprint) {
      throw new Error("Match program does not match the initial state");
    }
    this.#program = program;
    // The caller may retain the restored or freshly initialized state. The
    // runtime must own an isolated root so no mutation can bypass command
    // admission, the transaction kernel, or the committed event journal.
    this.#state = structuredClone(initialState);
    this.#kernel =
      kernel ??
      new GrandArchiveTransactionKernel({
        prepareEvent: (state, event) => prepareGrandArchiveRuleBoundEvent(program, state, event),
        collectReplacements: (state, event) =>
          collectGrandArchiveReplacementCandidates(program, state, event),
        chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
      });
  }

  public get state(): GrandArchiveMatchState {
    return this.#state;
  }

  public get program(): GrandArchiveMatchProgram {
    return this.#program;
  }

  public waitState(): GrandArchiveWaitState {
    return readGrandArchiveWaitState(this.#state);
  }

  public execute(
    command: GrandArchiveCommand,
    context: GrandArchiveCommandContext,
  ): GrandArchiveCommandTransition {
    const failure = this.#preflight(command, context);
    if (failure) return failure;
    const base = this.#state;
    try {
      const transition = this.#executeCommand(command, context.playerId);
      if (transition.ok) return transition;

      // A handler can reject after one or more internal event batches. A
      // rejected public command never publishes that intermediate candidate.
      this.#state = base;
      return { ...transition, state: base };
    } catch (error) {
      // Event batches are immutable, so restoring the retained root discards
      // every batch produced by this command, including stabilization and
      // automatic phase work that happened after the player's action.
      this.#state = base;
      return {
        ok: false,
        code: "internal-error",
        message: "The command could not be completed; the match remains at the previous state.",
        state: base,
        diagnostic: {
          baseStateVersion: base.stateVersion,
          cause: error instanceof Error ? error.message : "Unknown command execution failure",
        },
      };
    }
  }

  /**
   * Executes one command against this runtime's current immutable root and
   * restores that exact root before returning. Legal-command enumeration uses
   * this to validate many declarations without rebuilding identical derived
   * rules views or leaking any candidate's events into the next probe.
   */
  public probe(
    command: GrandArchiveCommand,
    context: GrandArchiveCommandContext,
  ): GrandArchiveCommandTransition {
    const base = this.#state;
    try {
      return this.execute(command, context);
    } finally {
      this.#state = base;
    }
  }

  #executeCommand(
    command: GrandArchiveCommand,
    playerId: GrandArchivePlayerId,
  ): GrandArchiveCommandTransition {
    const context = this.#commandHandlerContext();
    return routeGrandArchiveCommand(createGrandArchiveCommandHandlers(context), playerId, command);
  }

  #commandHandlerContext(): GrandArchiveCommandHandlerContext {
    return {
      getProgram: () => this.#program,
      getState: () => this.#state,
      replaceState: (state) => {
        this.#state = state;
      },
      getKernel: () => this.#kernel,
      commit: (events) => this.#commit(events),
      stabilize: (committed, initialTriggerEvents = committed) =>
        this.#stabilize([...committed], initialTriggerEvents),
      failure: (code, message) => this.#failure(code, message),
    };
  }

  #preflight(
    command: GrandArchiveCommand,
    context: GrandArchiveCommandContext,
  ): GrandArchiveCommandFailure | null {
    if (this.#state.status === "finished")
      return this.#failure("match-finished", "Match is finished");
    if (
      context.expectedStateVersion !== undefined &&
      context.expectedStateVersion !== this.#state.stateVersion
    ) {
      return this.#failure("stale-state", "Command targets a stale state version");
    }
    const player = this.#state.players[context.playerId];
    if (!player) return this.#failure("unknown-player", "Player is not in this match");
    if (player.lost) return this.#failure("player-lost", "Player has already lost");
    if (
      this.#state.status === "pregame" &&
      command.move !== "answer-decision" &&
      command.move !== "bestow-boon" &&
      command.move !== "complete-pregame-actions" &&
      command.move !== "concede" &&
      command.move !== "start-pregame-card"
    ) {
      return this.#failure("illegal-command", "Only pre-game actions are available");
    }
    if (this.#state.decision && command.move !== "answer-decision" && command.move !== "concede") {
      return this.#failure("decision-pending", "A player decision must be answered first");
    }
    return null;
  }

  #commit(events: readonly GrandArchiveProposedEvent[]): GrandArchiveCommandSuccess {
    const transaction = this.#kernel.transact(this.#state, events);
    this.#state = transaction.state;
    const committed = [...transaction.result.events];
    if (this.#state.decision) return { ok: true, state: this.#state, events: committed };
    return this.#stabilize(committed);
  }

  #stabilize(
    committed: GrandArchiveCommittedEvent[],
    initialTriggerEvents: readonly GrandArchiveCommittedEvent[] = committed,
  ): GrandArchiveCommandSuccess {
    if (this.#state.decision) return { ok: true, state: this.#state, events: committed };
    let triggerEvents = initialTriggerEvents;
    const triggerEventsBelongToResolution = initialTriggerEvents.some(
      (event) => event.type === "stack-item-removed",
    );
    let resolutionStartedEventHistoryIndex = triggerEventsBelongToResolution
      ? this.#state.eventHistory.length - initialTriggerEvents.length
      : undefined;
    for (let pass = 0; pass < GRAND_ARCHIVE_STABILIZATION_PASS_LIMIT; pass += 1) {
      const pendingPreCommit = this.#state.replacementPreCommit;
      if (pendingPreCommit?.status === "pending" && pendingPreCommit.followUp.kind === "critical") {
        const followUp = pendingPreCommit.followUp;
        const nextOpponentId = this.#state.turnOrder.find((playerId) => {
          const player = this.#state.players[playerId];
          return (
            player?.lost === false &&
            playerId !== followUp.actorId &&
            !followUp.declinedOpponentIds.includes(playerId) &&
            criticalReplacementDiscardCandidates(this.#state, playerId).length >= followUp.amount
          );
        });
        if (nextOpponentId) {
          const transaction = this.#kernel.transact(this.#state, [
            {
              type: "decision-created",
              decision: {
                id: grandArchiveDecisionId(`decision-${this.#state.nextDecisionOrdinal}`),
                kind: "resolve-critical",
                playerId: nextOpponentId,
                amount: followUp.amount,
                candidates: criticalReplacementDiscardCandidates(this.#state, nextOpponentId),
                sourceId: followUp.sourceId,
                recipientId: followUp.recipientId,
                stateVersion: this.#state.stateVersion,
              },
              cause: { kind: "rule", rule: "resolve-critical-replacement" },
            },
          ]);
          this.#state = transaction.state;
          committed.push(...transaction.result.events);
          return { ok: true, state: this.#state, events: committed };
        }
        const doubled = this.#kernel.transact(this.#state, [
          {
            type: "replacement-pre-commit-critical-doubled",
            cause: { kind: "rule", rule: "critical-discard-unpaid" },
          },
        ]);
        const updatedPending = doubled.state.replacementPreCommit;
        if (!updatedPending) throw new Error("Critical replacement lost its continuation");
        const cleared = this.#kernel.transact(doubled.state, [
          {
            type: "replacement-pre-commit-cleared",
            cause: { kind: "rule", rule: "critical-replacement-completed" },
          },
        ]);
        const resumed = this.#kernel.resumeReplacementPreCommit(
          cleared.state,
          updatedPending.continuation,
        );
        this.#state = resumed.state;
        committed.push(
          ...doubled.result.events,
          ...cleared.result.events,
          ...resumed.result.events,
        );
        triggerEvents = resumed.result.events;
        continue;
      }
      if (pendingPreCommit?.status === "pending") {
        if (this.#state.resolution) {
          throw new Error("A pre-commit replacement cannot start beside a suspended resolution");
        }
        const followUp = pendingPreCommit.followUp;
        if (followUp.kind !== "effect") {
          throw new Error(`Unhandled replacement pre-commit follow-up: ${followUp.kind}`);
        }
        const item: import("../../game/model.ts").GrandArchiveStackItem = {
          id: grandArchiveStackItemId(`stack-${this.#state.nextStackOrdinal}`),
          kind: "replacement-follow-up",
          effect: followUp.effect,
          resumeReplacementPreCommit: true,
          internalAfterResolutionEvents: pendingPreCommit.afterResolutionEvents,
          controllerId: followUp.controllerId,
          ...(followUp.sourceId ? { sourceId: followUp.sourceId } : {}),
          ...(followUp.sourceIncarnation !== undefined
            ? { sourceIncarnation: followUp.sourceIncarnation }
            : {}),
          ...(followUp.sourceLkiEventId ? { sourceLkiEventId: followUp.sourceLkiEventId } : {}),
          selectedModeIds: [],
          targets: [],
          createdAtVersion: this.#state.stateVersion,
          activationPhase: this.#state.turn.phase,
          isCopy: false,
          negated: false,
          opportunityPolicy: "interdiction",
          activationStates: [],
          activationPayment: [],
          championLevelModifier: 0,
          variables: followUp.variables,
          bindings: followUp.bindings,
        };
        const started = this.#kernel.transact(this.#state, [
          {
            type: "replacement-pre-commit-started",
            cause: { kind: "rule", rule: "event-processing-effect-entered-resolution" },
          },
          {
            type: "stack-item-added",
            item,
            cause: { kind: "rule", rule: "event-processing-effect-resolution" },
          },
        ]);
        this.#state = started.state;
        committed.push(...started.result.events);
        const resolution = resolveTopGrandArchiveStackItem(
          this.#program,
          this.#state,
          this.#kernel,
        );
        this.#state = resolution.state;
        committed.push(...resolution.events);
        if (resolution.paused || this.#state.decision) {
          return { ok: true, state: this.#state, events: committed };
        }
        triggerEvents = resolution.triggerEvents;
        resolutionStartedEventHistoryIndex =
          this.#state.eventHistory.length - resolution.triggerEvents.length;
        continue;
      }
      if (this.#state.replacementFollowUps.length > 0) {
        if (this.#state.resolution) {
          throw new Error("A replacement follow-up cannot start beside a suspended resolution");
        }
        // The replaced event has already happened. Preserve its triggers before
        // an interactive linked effect starts a new resolution/event window.
        // Pending triggers will not enter the stack until that effect finishes.
        const observedTriggers = collectGrandArchiveTriggeredAbilityEvents(
          this.#program,
          this.#state,
          triggerEvents,
          resolutionStartedEventHistoryIndex === undefined
            ? {}
            : { resolutionStartedEventHistoryIndex },
        );
        if (observedTriggers.length > 0) {
          const observed = this.#kernel.transact(this.#state, observedTriggers);
          this.#state = observed.state;
          committed.push(...observed.result.events);
        }
        const followUp = this.#state.replacementFollowUps[0]!;
        const item: import("../../game/model.ts").GrandArchiveStackItem = {
          id: grandArchiveStackItemId(`stack-${this.#state.nextStackOrdinal}`),
          kind: "replacement-follow-up",
          effect: followUp.effect,
          controllerId: followUp.controllerId,
          ...(followUp.sourceId ? { sourceId: followUp.sourceId } : {}),
          ...(followUp.sourceIncarnation !== undefined
            ? { sourceIncarnation: followUp.sourceIncarnation }
            : {}),
          ...(followUp.sourceLkiEventId ? { sourceLkiEventId: followUp.sourceLkiEventId } : {}),
          selectedModeIds: [],
          targets: [],
          createdAtVersion: this.#state.stateVersion,
          activationPhase: this.#state.turn.phase,
          isCopy: false,
          negated: false,
          opportunityPolicy: "interdiction",
          activationStates: [],
          activationPayment: [],
          championLevelModifier: 0,
          variables: followUp.variables,
          bindings: followUp.bindings,
        };
        const started = this.#kernel.transact(this.#state, [
          {
            type: "replacement-follow-up-consumed",
            cause: { kind: "rule", rule: "linked-replacement-effect-entered-resolution" },
          },
          {
            type: "stack-item-added",
            item,
            cause: { kind: "rule", rule: "linked-replacement-effect-resolution" },
          },
        ]);
        this.#state = started.state;
        committed.push(...started.result.events);
        const resolution = resolveTopGrandArchiveStackItem(
          this.#program,
          this.#state,
          this.#kernel,
        );
        this.#state = resolution.state;
        committed.push(...resolution.events);
        if (resolution.paused || this.#state.decision) {
          return { ok: true, state: this.#state, events: committed };
        }
        triggerEvents = resolution.triggerEvents;
        resolutionStartedEventHistoryIndex =
          this.#state.eventHistory.length - resolution.triggerEvents.length;
        continue;
      }
      if (this.#state.pendingTermination) {
        const terminationTransaction = this.#kernel.transact(
          this.#state,
          this.#pendingTerminationEvents(),
        );
        this.#state = terminationTransaction.state;
        committed.push(...terminationTransaction.result.events);
        if (this.#state.decision) {
          return { ok: true, state: this.#state, events: committed };
        }
        triggerEvents = terminationTransaction.result.events;
        resolutionStartedEventHistoryIndex = undefined;
        continue;
      }
      const triggeredEvents = collectGrandArchiveTriggeredAbilityEvents(
        this.#program,
        this.#state,
        triggerEvents,
        resolutionStartedEventHistoryIndex === undefined
          ? {}
          : { resolutionStartedEventHistoryIndex },
      );
      resolutionStartedEventHistoryIndex = undefined;
      if (triggeredEvents.length > 0) {
        const triggerTransaction = this.#kernel.transact(this.#state, triggeredEvents);
        this.#state = triggerTransaction.state;
        committed.push(...triggerTransaction.result.events);
        if (this.#state.decision) {
          return { ok: true, state: this.#state, events: committed };
        }
        triggerEvents = triggerTransaction.result.events;
        continue;
      }
      const pendingTriggerProgressEvents = collectGrandArchivePendingTriggerProgressEvents(
        this.#program,
        this.#state,
      );
      if (pendingTriggerProgressEvents.length > 0) {
        const progressTransaction = this.#kernel.transact(
          this.#state,
          pendingTriggerProgressEvents,
        );
        this.#state = progressTransaction.state;
        committed.push(...progressTransaction.result.events);
        if (this.#state.decision) {
          return { ok: true, state: this.#state, events: committed };
        }
        triggerEvents = progressTransaction.result.events;
        continue;
      }
      const stateBasedEvents = collectGrandArchiveStateBasedEvents(this.#program, this.#state);
      if (stateBasedEvents.length === 0) {
        if (
          this.#state.status !== "finished" &&
          !this.#state.opportunity &&
          this.#state.stack.length > 0 &&
          grandArchiveOpportunityIsSuppressed(this.#state)
        ) {
          const resolution = resolveTopGrandArchiveStackItem(
            this.#program,
            this.#state,
            this.#kernel,
          );
          this.#state = resolution.state;
          committed.push(...resolution.events);
          if (resolution.paused || this.#state.decision) {
            return { ok: true, state: this.#state, events: committed };
          }
          triggerEvents = resolution.triggerEvents;
          resolutionStartedEventHistoryIndex =
            this.#state.eventHistory.length - resolution.triggerEvents.length;
          continue;
        }
        if (
          this.#state.status === "playing" &&
          this.#state.combat?.step === "end" &&
          !this.#state.opportunity &&
          this.#state.stack.length === 0 &&
          this.#state.pendingTriggers.length === 0 &&
          !this.#state.resolution
        ) {
          // Damage may suspend for a replacement's follow-up decision. Resume
          // the normal combat cleanup once that decision and its effects finish.
          const completed = completeGrandArchiveCombatDamageTransition(
            this.#commandHandlerContext(),
            { ok: true, state: this.#state, events: [] },
          );
          committed.push(...completed.events);
          return { ok: true, state: completed.state, events: committed };
        }
        if (
          this.#state.status === "pregame" &&
          this.#state.pregame?.stage === "starting-champions" &&
          this.#state.stack.length === 0 &&
          this.#state.pendingTriggers.length === 0
        ) {
          const completed = this.#kernel.transact(this.#state, this.#pregameCompletionEvents());
          this.#state = completed.state;
          committed.push(...completed.result.events);
          triggerEvents = completed.result.events;
          resolutionStartedEventHistoryIndex = undefined;
          continue;
        }
        if (
          this.#state.status === "playing" &&
          (this.#state.turn.phase === "wake-up" || this.#state.turn.phase === "draw") &&
          !this.#state.decision &&
          !this.#state.opportunity &&
          this.#state.stack.length === 0 &&
          this.#state.pendingTriggers.length === 0 &&
          !this.#state.resolution
        ) {
          const advanced = completeGrandArchiveAutomaticPhaseIfReady(
            this.#commandHandlerContext(),
            { ok: true, state: this.#state, events: [] },
          );
          committed.push(...advanced.events);
          return { ok: true, state: advanced.state, events: committed };
        }
        if (
          this.#state.status === "playing" &&
          this.#state.turn.phase === "end" &&
          this.#state.turn.cleanupPending &&
          !this.#state.opportunity &&
          this.#state.stack.length === 0 &&
          this.#state.pendingTriggers.length === 0 &&
          !this.#state.resolution
        ) {
          const cleanup = continueGrandArchiveEndCleanup(this.#commandHandlerContext(), {
            ok: true,
            state: this.#state,
            events: [],
          });
          committed.push(...cleanup.events);
          return { ok: true, state: cleanup.state, events: committed };
        }
        if (
          this.#state.status === "playing" &&
          this.#state.turn.phase === "materialize" &&
          !this.#state.turn.materializeChoicePending &&
          !this.#state.opportunity &&
          this.#state.stack.length === 0 &&
          this.#state.pendingTriggers.length === 0 &&
          !this.#state.resolution
        ) {
          const playerId = this.#state.turn.playerId;
          const phaseEvents =
            this.#state.turn.materializeKind === "additional"
              ? grandArchiveEndPhaseEvents(
                  this.#commandHandlerContext(),
                  this.#state,
                  playerId,
                  "additional-turn-based-materialization-complete",
                )
              : grandArchiveRecollectionPhaseEvents(
                  this.#commandHandlerContext(),
                  this.#state,
                  playerId,
                  "turn-based-materialization-complete",
                );
          const advanced = this.#kernel.transact(this.#state, phaseEvents);
          this.#state = advanced.state;
          committed.push(...advanced.result.events);
          triggerEvents = advanced.result.events;
          resolutionStartedEventHistoryIndex = undefined;
          continue;
        }
        return { ok: true, state: this.#state, events: committed };
      }
      const stateBasedTransaction = this.#kernel.transact(this.#state, stateBasedEvents);
      this.#state = stateBasedTransaction.state;
      committed.push(...stateBasedTransaction.result.events);
      triggerEvents = stateBasedTransaction.result.events;
      resolutionStartedEventHistoryIndex = undefined;
      if (this.#state.decision || this.#state.status === "finished") {
        return { ok: true, state: this.#state, events: committed };
      }
    }
    throw new Error(
      `Grand Archive state-based checks did not stabilize after ${GRAND_ARCHIVE_STABILIZATION_PASS_LIMIT} passes`,
    );
  }

  #pendingTerminationEvents(): readonly GrandArchiveProposedEvent[] {
    const termination = this.#state.pendingTermination;
    if (!termination) return [];
    if (termination.kind === "phase" && this.#state.turn.phase !== termination.phase) {
      throw new Error(
        `Cannot finish ${termination.phase} while the turn is in ${this.#state.turn.phase}`,
      );
    }
    if (this.#state.resolution) {
      throw new Error("A phase or turn cannot finish while its resolving stack item is suspended");
    }

    const events: GrandArchiveProposedEvent[] = [
      {
        type: "termination-cleared",
        cause: { kind: "rule", rule: "apply-pending-termination" },
      },
      ...(this.#state.opportunity
        ? [
            {
              type: "opportunity-closed" as const,
              cause: { kind: "rule" as const, rule: "termination-abandons-opportunity" },
            },
          ]
        : []),
    ];
    const abandonedCardIds = new Set<GrandArchiveObjectId>();
    for (const item of [...this.#state.stack].reverse()) {
      events.push({
        type: "stack-item-removed",
        itemId: item.id,
        outcome: "abandoned",
        cause: { kind: "rule", rule: "phase-ended-stack-item-abandoned" },
      });
      if (
        item.kind === "card-activation" ||
        item.kind === "materialization" ||
        item.kind === "bestowment"
      ) {
        abandonedCardIds.add(item.cardId);
      }
    }
    for (const cardId of abandonedCardIds) {
      const object = this.#state.objects[cardId];
      if (!object || object.zone !== "effects-stack") continue;
      events.push(
        object.copy
          ? {
              type: "object-ceased",
              objectId: object.id,
              from: "effects-stack",
              cause: { kind: "rule", rule: "phase-ended-stack-copy-ceased" },
            }
          : {
              type: "object-moved",
              objectId: object.id,
              from: "effects-stack",
              to: "banishment",
              cause: { kind: "rule", rule: "phase-ended-stack-card-banished" },
            },
      );
    }
    for (const trigger of this.#state.pendingTriggers) {
      events.push({
        type: "pending-trigger-removed",
        triggerId: trigger.id,
        cause: { kind: "rule", rule: "phase-ended-pending-trigger-abandoned" },
      });
    }
    for (const trigger of this.#state.generatedTriggers) {
      events.push({
        type: "reflexive-trigger-consumed",
        triggerId: trigger.id,
        cause: { kind: "rule", rule: "phase-ended-generated-trigger-abandoned" },
      });
    }
    const projected = this.#kernel.transact(this.#state, events).state;
    events.push(
      ...(termination.kind === "phase"
        ? grandArchiveForcedPhaseEndEvents(
            this.#commandHandlerContext(),
            projected,
            termination.phase,
          )
        : grandArchiveForcedTurnEndEvents(this.#commandHandlerContext(), projected)),
    );
    return events;
  }

  #pregameCompletionEvents(): readonly GrandArchiveProposedEvent[] {
    const playerId = this.#state.turn.playerId;
    const events: GrandArchiveProposedEvent[] = [
      {
        type: "pregame-completed",
        cause: { kind: "rule", rule: "starting-abilities-resolved" },
      },
    ];
    if (this.#state.mode === "pantheon") {
      const topCard = this.#state.zones[playerId]["main-deck"][0];
      if (topCard) {
        events.push({
          type: "object-moved",
          objectId: topCard,
          from: "main-deck",
          to: "hand",
          cause: { kind: "rule", rule: "pantheon-first-turn-draw" },
        });
      }
    }
    events.push({
      type: "opportunity-opened",
      window: {
        holderId: playerId,
        startedById: playerId,
        passedPlayerIds: [],
        reason: "phase-begin",
      },
      cause: { kind: "rule", rule: "first-main-phase-opportunity" },
    });
    return events;
  }

  #failure(code: GrandArchiveCommandFailure["code"], message: string): GrandArchiveCommandFailure {
    return { ok: false, code, message, state: this.#state };
  }
}

export function applyGrandArchiveCommand(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  command: GrandArchiveCommand,
  context: GrandArchiveCommandContext,
): GrandArchiveCommandTransition {
  return new GrandArchiveMatchRuntime(program, state).execute(command, context);
}
