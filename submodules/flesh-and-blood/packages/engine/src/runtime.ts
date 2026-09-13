import {
  decodeFabCommand,
  isFabMoveName,
  type FabCommand,
  type FabCommandExecutionContext,
  type FabCommandFailure,
  type FabCommandResult,
  type FabCommandStatus,
  type FabCommandTransition,
  type FabMoveName,
  type FabUndoBarrier,
} from "./moves.ts";
import { fabUndoBarrierForEvents } from "./undo-barrier.ts";
import { semanticMoveLogs } from "./command-logs.ts";
import { routeFabCommand, type FabCommandHandlers } from "./commands/command-router.ts";
import type {
  FabCommandHandlerContext,
  FabCommandHandlerResult,
} from "./commands/handler-context.ts";
import { createFabCommandHandlers } from "./commands/handlers/index.ts";
import { isDecisionCompatibleCommand } from "./commands/trigger-order-automation-preference.ts";
import { mutateCommandState } from "./copy-on-write.ts";
import { compileFabMatchProgram } from "./match-program.ts";

import { FAB_MATCH_SCHEMA_VERSION, type FabMatchState } from "./state.ts";
import { playerLogsForCommittedEvents } from "./kernel/transaction-kernel.ts";
import { buildFabRulesView, invalidateFabRulesViews } from "./rules/state-rules-view.ts";
import { invalidateFabRuntimeDerived } from "./runtime-derived.ts";
import type { CommittedEvent } from "./rules/events.ts";
import {
  stabilizeFabRulesStateAtBoundary,
  type FabEventTransactionOptions,
} from "./kernel/process-runner/index.ts";
import {
  FAB_RUNTIME_TEST_ACCESS,
  FAB_RUNTIME_TEST_FAILURE,
  FAB_RUNTIME_TEST_RECEIPT,
  consumeFabRuntimeTestStateOwnership,
  type FabRuntimeTestFailureStage,
} from "./runtime-access.ts";
import type { FabRulesSnapshot } from "./kernel/transaction-kernel.ts";
import { fabObjectDisplayName } from "./log/index.ts";
import { readFabWaitState, type FabWaitState } from "./game/wait-state.ts";
import { finalizeFabPlayerLog, type FabPlayerLog, type FabPlayerLogFact } from "./player-log.ts";

type FabEvaluatedCombat = ReturnType<ReturnType<typeof buildFabRulesView>["combat"]>;

function resolvedReactionLog(
  layer: FabMatchState["rulesStack"][number] | null,
  before: FabEvaluatedCombat,
  after: FabEvaluatedCombat,
):
  | {
      readonly resolvedReaction: NonNullable<
        Parameters<typeof semanticMoveLogs>[0]["resolvedReaction"]
      >;
    }
  | Record<string, never> {
  if (
    !layer ||
    layer.kind !== "card" ||
    (layer.role !== "attack-reaction" && layer.role !== "defense-reaction") ||
    !before ||
    !after ||
    (before.attackPower === after.attackPower && before.defense === after.defense)
  ) {
    return {};
  }
  return {
    resolvedReaction: {
      actorId: layer.controllerId,
      cardName: fabObjectDisplayName(layer.source),
      objectRef: {
        instanceId: layer.source.instanceId,
        canonicalId: layer.source.canonicalId,
      },
      role: layer.role,
      combatState: {
        kind: "reaction",
        role: layer.role,
        before: { attack: before.attackPower, defense: before.defense },
        after: { attack: after.attackPower, defense: after.defense },
      },
    },
  };
}
import {
  projectFabViewerResources,
  projectFabViewerState,
  type FabViewer,
  type FabViewerResources,
  type FabViewerState,
} from "./view.ts";
import {
  FabSnapshotSerializationRefusalError,
  serializeFabMatchSnapshot,
  type FabMatchSnapshotV21,
} from "./snapshot/match-context.ts";
import { automaticPassMoveLogs } from "./rules/automatic-pass-logs.ts";
import {
  finalizeFabCommandStateVersion,
  isCurrentFabSnapshot,
  runtimeIsTestProcess,
} from "./runtime-helpers.ts";
import { fabRulesTransactionOptions } from "./runtime-transaction-options.ts";
import { enumerateFabMoves } from "./runtime-moves.ts";
import { drainFabCommandAutomation } from "./runtime-automation.ts";

/**
 * Flesh and Blood match runtime — production dispatch path for legal moves.
 *
 * Combat steps (CR 7): Layer → Attack → Defend → Reaction → Damage →
 * Resolution → Close. Priority uses consecutive passes (CR 1.11.4a).
 */
export class FabMatchRuntime {
  private state: FabMatchState;
  private testFailureStage: FabRuntimeTestFailureStage | null = null;
  private readonly testReceipt = runtimeIsTestProcess()
    ? {
        committedEvents: [] as CommittedEvent[],
        playerLogs: [] as import("./state.ts").FabLogEntry[],
        moveLogs: [] as import("./moves.ts").FabMoveLog[],
        playerNarratives: [] as FabPlayerLog[],
      }
    : null;

  constructor(state: unknown) {
    if (!isCurrentFabSnapshot(state)) {
      const received =
        typeof state === "object" && state !== null && "schemaVersion" in state
          ? (state as { readonly schemaVersion?: unknown }).schemaVersion
          : undefined;
      throw new Error(
        `Unsupported Flesh and Blood match snapshot schema version ${String(received)}; expected ${FAB_MATCH_SCHEMA_VERSION}. Legacy FAB snapshots cannot be restored.`,
      );
    }
    // Compile at admission, not during the first command's persistence. A
    // restored compiler-owned program is already detached and deeply frozen.
    // External callers may retain mutable match state, so detach that portion;
    // only the package-local test harness can prove exclusive ownership.
    const program = compileFabMatchProgram(state.cardDefinitions, state.publicCardIdentities);
    if (consumeFabRuntimeTestStateOwnership(state)) {
      this.state = state as FabMatchState;
      this.state.cardDefinitions = program.cardDefinitions;
      this.state.publicCardIdentities = program.publicCardIdentities;
    } else {
      const {
        cardDefinitions: _definitions,
        publicCardIdentities: _identities,
        ...mutable
      } = state;
      this.state = {
        ...structuredClone(mutable),
        cardDefinitions: program.cardDefinitions,
        publicCardIdentities: program.publicCardIdentities,
      } as FabMatchState; // The detached clone is now owned and mutable by this runtime.
    }
    this.state = stabilizeFabRulesStateAtBoundary(
      this.state,
      fabRulesTransactionOptions((events) => this.publishCommittedEvents(events)),
    );
  }

  getState(): FabRulesSnapshot {
    if (this.testReceipt) this.invalidateTestMutableStateCaches();
    return this.state;
  }

  /** Player-visible wait. Hosts must not inspect raw match state to recover this. */
  waitState(): FabWaitState {
    return readFabWaitState(this.state);
  }

  /** Persistence DTO. Does not expose the live mutable aggregate. */
  snapshot(): FabMatchSnapshotV21 {
    return serializeFabMatchSnapshot(this.state);
  }

  viewer(viewer: FabViewer): FabViewerState {
    return projectFabViewerState(this.state, viewer);
  }

  viewerResources(viewer: FabViewer): FabViewerResources {
    return projectFabViewerResources(this.state, viewer);
  }

  playerIds(): readonly string[] {
    return this.state.playerIds;
  }

  /** Package-private capability used only by the explicit test harness. */
  [FAB_RUNTIME_TEST_ACCESS](): FabMatchState {
    this.invalidateTestMutableStateCaches();
    return this.state;
  }

  private invalidateTestMutableStateCaches(): void {
    invalidateFabRulesViews(this.state);
    invalidateFabRuntimeDerived(this.state);
  }

  [FAB_RUNTIME_TEST_RECEIPT](): Readonly<{
    committedEvents: readonly CommittedEvent[];
    playerLogs: readonly import("./state.ts").FabLogEntry[];
    moveLogs: readonly import("./moves.ts").FabMoveLog[];
    playerNarratives: readonly FabPlayerLog[];
  }> {
    if (!this.testReceipt) {
      throw new Error("FAB event receipts are available only in the explicit test runtime.");
    }
    return this.testReceipt;
  }

  /** Package-private, one-shot fault injection used by transaction safety tests. */
  [FAB_RUNTIME_TEST_FAILURE](stage: FabRuntimeTestFailureStage): void {
    if (!this.testReceipt) {
      throw new Error("FAB runtime fault injection is available only in the test runtime.");
    }
    this.testFailureStage = stage;
  }

  cloneState(): FabMatchState {
    return structuredClone(this.state);
  }

  getStateID(): number {
    return this.state.stateID;
  }

  getActivePlayerId(): string | undefined {
    return this.state.gameEnded ? undefined : this.state.activePlayerId;
  }

  getPriorityPlayerId(): string | undefined {
    return this.state.gameEnded ? undefined : this.state.priority?.holderPlayerId;
  }

  hasGameEnded(): boolean {
    return this.state.gameEnded;
  }

  /** True when passing only hands over ordinary, settled priority. */
  isOrdinaryPriorityPass(): boolean {
    return this.state.rulesStack.length === 0 && !this.state.combat?.open;
  }

  getGameEndResult(): { winnerId?: string; reason?: string } | undefined {
    if (!this.state.gameEnded) return undefined;
    return {
      winnerId: this.state.winnerId ?? undefined,
      reason: this.state.endReason ?? undefined,
    };
  }

  enumerateMoves(actorId: string): readonly FabMoveName[] {
    return enumerateFabMoves(this.state, actorId);
  }

  /**
   * Compatibility adapter for platform callers that still use the public
   * dispatch(moveType, actorId, payload) boundary. Decoding remains strict;
   * this method only translates the typed transition result back to the
   * established accepted/error receipt shape.
   */
  dispatch(
    move: string,
    actorId: string,
    payload: Record<string, unknown>,
  ):
    | {
        readonly accepted: true;
        readonly move: FabMoveName;
        readonly actorId: string;
        readonly state: FabRulesSnapshot;
        readonly playerLogs: readonly import("./state.ts").FabLogEntry[];
        readonly moveLogs: readonly import("./moves.ts").FabMoveLog[];
        readonly playerLog: FabPlayerLog;
        readonly outcome: import("./moves.ts").FabCommandOutcome;
        readonly undoBarrier: FabUndoBarrier | null;
      }
    | { readonly accepted: false; readonly error: string; readonly errorCode?: string } {
    if (!isFabMoveName(move)) {
      return { accepted: false, error: `Unknown move: ${move}`, errorCode: "unknown_move" };
    }
    const command = decodeFabCommand(move, payload);
    if (!command) {
      return {
        accepted: false,
        error: "FAB command payload is malformed or uses a legacy field.",
        errorCode: "invalid_command_payload",
      };
    }
    const logStart = this.testReceipt?.playerLogs.length ?? 0;
    const result = this.applyCommand(actorId, command);
    if (!result.success) {
      return { accepted: false, error: result.error, errorCode: result.errorCode };
    }
    return {
      accepted: true,
      move: command.move,
      actorId,
      state: result.state,
      playerLogs: this.testReceipt?.playerLogs.slice(logStart) ?? [],
      moveLogs: result.moveLogs,
      playerLog: result.playerLog,
      outcome: result.outcome,
      undoBarrier: result.undoBarrier,
    };
  }

  /**
   * Apply one already-decoded command to this runtime. This is the native
   * production boundary; network payload decoding belongs in an adapter.
   */
  applyCommand(
    actorId: string,
    command: FabCommand,
    execution: FabCommandExecutionContext = {
      commandId: `local:${this.state.stateID + 1}`,
      timestamp: this.state.stateID + 1,
    },
  ): FabCommandResult {
    const base = this.state;
    const combatBeforeCommand = buildFabRulesView(base).combat();
    const resolvingLayerBeforeCommand = base.rulesStack.at(-1) ?? null;
    const injectedFailureStage = this.testFailureStage;
    this.testFailureStage = null;
    const beforeStateID = base.stateID;
    const failure = (error: string, errorCode?: string): FabCommandFailure => ({
      success: false,
      error,
      ...(errorCode ? { errorCode } : {}),
      currentStateID: beforeStateID,
    });
    if (base.gameEnded) return failure("Game has already ended.", "game_ended");
    if (!base.players[actorId]) return failure(`Unknown actor: ${actorId}`, "unknown_actor");
    if (base.decision && !isDecisionCompatibleCommand(base, actorId, command)) {
      return failure(
        `Decision ${base.decision.decisionId} must be answered before another move.`,
        "decision_pending",
      );
    }

    const pendingDefense = base.combat;
    const processedCommand: FabCommand =
      command.move === "pass" &&
      pendingDefense?.step === "defend" &&
      pendingDefense.defenseDeclarationPending &&
      pendingDefense.activeLink?.defendingPlayerId === actorId
        ? { move: "defend", instanceIds: [] }
        : command;
    const committedEvents: CommittedEvent[] = [];
    const playerLogFacts: FabPlayerLogFact[] = [];
    const receiptChunks: {
      readonly events: readonly CommittedEvent[];
      readonly playerLogFacts: readonly FabPlayerLogFact[];
    }[] = [];
    let rejectedCandidate: FabMatchState | undefined;

    try {
      const transaction = mutateCommandState(base, (draft) => {
        const options = fabRulesTransactionOptions(
          () => {},
          () => {},
          (receipt) =>
            receiptChunks.push({
              events: detachCommittedEvents(receipt.events),
              playerLogFacts: structuredClone(receipt.playerLogFacts),
            }),
        );
        const handlers = this.commandHandlersForDraft(draft, options);
        this.throwInjectedTestFailure(injectedFailureStage, "handler");
        const routed = routeFabCommand<FabCommandHandlerResult>(
          handlers,
          actorId,
          processedCommand,
        );
        if (!routed.accepted) {
          return { routed, automaticPasses: [], stackAfterCommand: [] } as const;
        }
        // Preserve the exact post-player-command stack before automation can
        // pass priority and resolve several layers in this same receipt.
        const stackAfterCommand = draft.rulesStack.map((layer) => ({
          layerId: layer.layerId,
          sourceInstanceId: layer.source.instanceId,
          controllerId: layer.controllerId,
          kind: layer.kind,
        }));
        this.throwInjectedTestFailure(injectedFailureStage, "automation");

        const automaticPasses =
          routed.outcome.kind === "rules-action-reversed"
            ? []
            : drainFabCommandAutomation(draft, handlers);
        finalizeFabCommandStateVersion(draft, beforeStateID + 1);
        return { routed, automaticPasses, stackAfterCommand } as const;
      });
      rejectedCandidate = transaction.state;
      if (!transaction.result.routed.accepted) {
        return failure(transaction.result.routed.error, transaction.result.routed.errorCode);
      }

      // Nested journals finish publishing before their enclosing journal. Event ids
      // preserve the authoritative commit chronology, so restore that chronology
      // while each receipt's reducer-owned narrative facts are still paired with it.
      const orderedReceipts = receiptChunks
        .map((receipt, index) => ({
          receipt,
          index,
          firstEventSequence:
            receipt.events.length > 0
              ? Number(receipt.events[0]!.eventId.replace("event-", ""))
              : Number.POSITIVE_INFINITY,
        }))
        .sort(
          (left, right) =>
            left.firstEventSequence - right.firstEventSequence || left.index - right.index,
        );
      for (const { receipt } of orderedReceipts) {
        committedEvents.push(...receipt.events);
        playerLogFacts.push(...receipt.playerLogFacts);
      }

      const candidate = transaction.state;
      this.throwInjectedTestFailure(injectedFailureStage, "validator");
      const snapshot = serializeFabMatchSnapshot(candidate);
      const state = candidate as FabRulesSnapshot;
      const status: FabCommandStatus = state.gameEnded
        ? "game-ended"
        : state.decision
          ? "awaiting-decision"
          : "settled";
      const semanticLogs =
        transaction.result.routed.outcome.kind === "rules-action-reversed"
          ? []
          : semanticMoveLogs({
              commandId: execution.commandId,
              command: processedCommand,
              actorId,
              state,
              status,
              events: committedEvents,
              stackAfterCommand: transaction.result.stackAfterCommand,
              timestamp: execution.timestamp,
              ...resolvedReactionLog(
                resolvingLayerBeforeCommand,
                combatBeforeCommand,
                buildFabRulesView(state).combat(),
              ),
            });
      const automaticPassLogs = automaticPassMoveLogs(transaction.result.automaticPasses, {
        commandId: execution.commandId,
        timestamp: execution.timestamp,
        turnNumber: state.turnNumber,
        sequenceOffset: semanticLogs.length,
      });
      const moveLogs: readonly import("./moves.ts").FabMoveLog[] = [
        ...semanticLogs,
        ...automaticPassLogs,
      ];
      const playerLog = finalizeFabPlayerLog({
        commandId: execution.commandId,
        moveType: processedCommand.move,
        actorId,
        timestamp: execution.timestamp,
        turnNumber: base.turnNumber,
        turnPlayerId: base.activePlayerId,
        phase: base.phase,
        facts:
          transaction.result.routed.outcome.kind === "rules-action-reversed" ? [] : playerLogFacts,
      });

      // Publication point: validation above is the last operation allowed to
      // fail before the runtime exposes the candidate or any command receipt.
      this.state = candidate;
      this.publishCommittedEvents(committedEvents);
      if (this.testReceipt) this.testReceipt.moveLogs.push(...moveLogs);
      if (this.testReceipt) this.testReceipt.playerNarratives.push(playerLog);
      return {
        success: true,
        stateID: state.stateID,
        state,
        snapshot,
        actorId,
        processedCommand,
        execution,
        outcome: transaction.result.routed.outcome,
        playerLog,
        moveLogs,
        committedEvents,
        status,
        undoBarrier: fabUndoBarrierForEvents(committedEvents),
      };
    } catch (error) {
      const refusal = error instanceof FabSnapshotSerializationRefusalError ? error : null;
      return {
        ...failure(
          refusal
            ? "That action could not be applied. The match remains at the previous state."
            : "The match encountered an internal error and remains at the previous state.",
          refusal ? "invalid_transition" : "internal_error",
        ),
        diagnostic: {
          commandId: execution.commandId,
          failedInvariant:
            refusal?.issues.map((issue) => issue.check).join(", ") ||
            (error instanceof Error ? error.message : "unknown transition failure"),
          baseStateID: beforeStateID,
          candidateStateID: rejectedCandidate?.stateID,
          processId: rejectedCandidate?.rulesProcess?.processId ?? base.rulesProcess?.processId,
          decisionId: rejectedCandidate?.decision?.decisionId ?? base.decision?.decisionId,
          rejectedCandidate: refusal?.rejectedSnapshot ?? rejectedCandidate,
        },
      };
    }
  }

  private commandHandlersForDraft(
    draft: FabMatchState,
    transactionOptions: FabEventTransactionOptions,
  ): FabCommandHandlers<FabCommandHandlerResult> {
    const commandHandlerContext: FabCommandHandlerContext = {
      state: draft,
      transactionOptions: () => transactionOptions,
    };
    return createFabCommandHandlers(commandHandlerContext);
  }

  private throwInjectedTestFailure(
    armedStage: FabRuntimeTestFailureStage | null,
    stage: FabRuntimeTestFailureStage,
  ): void {
    if (armedStage !== stage) return;
    throw new Error(`Injected FAB ${stage} failure.`);
  }

  private publishCommittedEvents(events: readonly CommittedEvent[]): void {
    if (!this.testReceipt) return;
    this.testReceipt.committedEvents.push(...events);
    this.testReceipt.playerLogs.push(...playerLogsForCommittedEvents(events));
  }
}

function detachCommittedEvents(events: readonly CommittedEvent[]): CommittedEvent[] {
  // Event receipts can contain nested references sourced from an active
  // Mutative draft even when the event object itself is not a draft proxy.
  // They cross the draft lifetime, so materialize the plain event DTOs while
  // the draft is still live. Same contract as the previous JSON round-trip:
  // own-enumerable plain data only, undefined-valued object keys are absent,
  // and undefined array elements become null — membership checks like
  // `"from" in event.data` keep their exact meaning.
  return events.map((event) => detachJsonSafe(event) as CommittedEvent);
}

function detachJsonSafe(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(detachJsonSafe);
  if (value === null || typeof value !== "object") {
    if (value === undefined) return null;
    if (typeof value === "function" || typeof value === "symbol") return null;
    return value;
  }
  const detached: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    if (item === undefined) continue;
    detached[key] = detachJsonSafe(item);
  }
  return detached;
}
/**
 * Pure command transition for callers which keep state outside a runtime.
 * The runtime owns an isolated input snapshot and publishes a readonly,
 * structurally shared command result.
 */
export function applyFabCommand(
  state: FabRulesSnapshot,
  transition: FabCommandTransition,
): FabCommandResult {
  return new FabMatchRuntime(state).applyCommand(
    transition.actorId,
    transition.command,
    transition.execution,
  );
}
