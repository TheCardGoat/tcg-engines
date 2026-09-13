import { buildMulliganRedrawPlan } from "@tcg/gundam-server-adapter";
import {
  asPlayerId,
  stripPrivateFields,
  type GameLogEntry,
  type GundamMoveLog,
  type MatchRuntime,
  type MatchStaticResources,
  type MoveHistoryEntry,
  type PacketAnimation,
} from "@tcg/gundam-engine";
import {
  applyGundamPresentationToView,
  buildGundamInteractionView,
  cardWithPresentationPrinting,
  describeGundamInteractionProcedure,
  gundamTargetInputBinding,
  resolveGundamPresentationPrintingId,
  seedGundamInteractionSource,
  type GundamPendingChoice,
  type GundamPendingMoveStep,
  type GundamPresentation,
} from "@tcg/gundam-server-adapter";
import type { AnimationPlanV2, EngineInteractionView } from "@tcg/protocol";
import type { Card } from "@tcg/gundam-types";
import {
  simulatorExternalCommandGateFor,
  type SimulatorExternalCommandGate,
} from "@tcg/simulator-runtime/animation";

import {
  type BoardProjection,
  type MoveName,
  type PartialInput,
  type SubmitOutcome,
  type ViewerId,
} from "./types.ts";

/**
 * Game-log entry tagged with the turn it landed in. The engine's
 * `GameLogEntry` only carries `stateID`; we stamp `turnNumber` at capture
 * time so the UI can group entries by cycle without cross-referencing
 * the move history.
 */
export interface TurnTaggedLogEntry {
  readonly entry: GameLogEntry;
  readonly turnNumber: number;
}

export interface TurnTaggedMoveLog {
  readonly log: GundamMoveLog;
  readonly turnNumber: number;
}

export type TurnTaggedPacketAnimation =
  | {
      readonly animation: PacketAnimation;
      readonly plan?: never;
      readonly stateID: number;
      readonly turnNumber: number;
    }
  | {
      readonly animation?: never;
      readonly plan: AnimationPlanV2;
      readonly stateID: number;
      readonly turnNumber: number;
    };

export interface SimulatorViewerContext {
  readonly role: "player" | "spectator";
  /** Player identity authorized to receive private information. */
  readonly playerId: ViewerId | null;
  /** Seat used only to orient the board and name its two sides. */
  readonly perspectivePlayerId: ViewerId;
}

export type EngineCommandGate = Pick<SimulatorExternalCommandGate, "isBlocked" | "subscribe">;

export interface EngineAdapter {
  readonly viewerId: ViewerId;
  readonly viewerContext: SimulatorViewerContext;
  /**
   * Read-only command readiness shared by UI automation and the real submit
   * boundary. Consumers may wait for the gate, but only the animation owner
   * may change it.
   */
  readonly commandGate: EngineCommandGate;
  readonly view: () => BoardProjection;
  readonly interactionView: () => EngineInteractionView;
  readonly describeMove: (
    move: MoveName,
    partialInput: PartialInput,
  ) => readonly GundamPendingMoveStep[];
  readonly seedForCard: (move: MoveName, cardId: string) => PartialInput;
  readonly keyForStep: (
    move: MoveName,
    step: GundamPendingMoveStep,
  ) => { key: string; multi: boolean };
  readonly submit: (move: MoveName, partialInput: PartialInput) => SubmitOutcome;
  readonly canUndo: () => boolean;
  readonly undo: () => SubmitOutcome | null;
  readonly pendingChoice: () => GundamPendingChoice | undefined;
  /**
   * Viewer-safe identity of the revealed Shield whose Burst is awaiting a
   * decision. The full choice remains controller-only.
   */
  readonly pendingBurst: () =>
    | {
        readonly kind: "burst";
        readonly effectId: string;
        readonly controllerId: string;
        readonly sourceCardId: string;
      }
    | undefined;
  readonly moveHistory: () => readonly MoveHistoryEntry[];
  /**
   * Running list of game-log entries accumulated from every successful
   * `executeCommand` / `undo`, filtered by viewer visibility. Each entry
   * is tagged with the turn it landed in.
   */
  readonly logEntries: () => readonly TurnTaggedLogEntry[];
  readonly moveLogs: () => readonly TurnTaggedMoveLog[];
  readonly packetAnimations: () => readonly TurnTaggedPacketAnimation[];
  /**
   * Resolve a card INSTANCE id (e.g. `player_one_deck_TEST-U-0003_12`) to
   * its definition via the runtime's static resources. Returns `null` if
   * the instance isn't registered (unknown id, unloaded catalog entry).
   */
  readonly cardDefinitionOf: (instanceId: string) => Card | null;
  readonly subscribe: (onChange: () => void) => () => void;
}

export interface EngineAdapterConfig {
  readonly runtime: MatchRuntime;
  readonly staticResources: MatchStaticResources;
  readonly viewerId: ViewerId;
  readonly presentation?: GundamPresentation;
}

let fallbackCommandSequence = 0;

function nextCommandId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  fallbackCommandSequence += 1;
  return `browser-command-${Date.now().toString(36)}-${fallbackCommandSequence.toString(36)}`;
}

export function createEngineAdapter({
  runtime,
  staticResources,
  viewerId,
  presentation,
}: EngineAdapterConfig): EngineAdapter {
  // The viewer is always a participant from this seat — ViewerId and PlayerId
  // are parallel branded strings bound to the same seat identifier, so we
  // re-brand through the engine's public helper rather than casting.
  const playerId = asPlayerId(String(viewerId));
  const commandGate = simulatorExternalCommandGateFor(runtime);

  // Track the latest stateID via command results instead of reading the
  // engine's private `ctx._stateID` field. MatchRuntime.initialize() seeds
  // state at 0 and every successful executeCommand/undo returns the new
  // stateID on the CommandSuccess envelope, so we never need to peek at
  // engine internals for optimistic-concurrency sequencing.
  let lastStateId = 0;

  const localAnimationPlans: TurnTaggedPacketAnimation[] = [];

  const isVisibleToViewer = (entry: GameLogEntry): boolean => {
    const { visibleTo } = entry;
    if (visibleTo === undefined || visibleTo === "all") return true;
    return visibleTo.includes(playerId);
  };

  return {
    viewerId,
    viewerContext: {
      role: "player",
      playerId: viewerId,
      perspectivePlayerId: viewerId,
    },
    commandGate,

    view: () =>
      applyGundamPresentationToView(
        runtime.getFilteredView({ role: "player", playerId }),
        presentation,
      ),

    interactionView: () =>
      buildGundamInteractionView({
        actorId: playerId,
        stateVersion: runtime.getState().ctx._stateID,
        state: runtime.getState(),
        staticResources,
        pendingChoice: runtime.getPendingChoice({ role: "player", playerId }),
        publicPendingChoice: runtime.getPendingChoice({ role: "judge" }),
      }),

    describeMove: (move, partialInput) => {
      return describeGundamInteractionProcedure({
        state: runtime.getState(),
        staticResources,
        actorId: playerId,
        moveName: move,
        payload: partialInput,
      });
    },

    seedForCard: (move, cardId) => seedGundamInteractionSource(move, cardId),

    keyForStep: (move, step) => gundamTargetInputBinding(move, step),

    submit: (move, partialInput) => {
      if (commandGate.isBlocked()) {
        return {
          ok: false,
          errorCode: "animation-active",
          error: "Commands are blocked while the board transition is active.",
        };
      }
      const previousView = runtime.getFilteredView({ role: "player", playerId });
      const result = runtime.executeCommand(
        {
          commandID: nextCommandId(),
          move,
          prevStateID: lastStateId,
          actorRole: "player",
          args: partialInput,
        },
        playerId,
      );

      if (result.success) {
        const mulliganPlan = buildMulliganRedrawPlan({
          move,
          partialInput,
          previousView,
          nextState: result.state,
          playerId: String(playerId),
          stateID: result.stateID,
        });
        if (mulliganPlan) {
          localAnimationPlans.push({
            plan: mulliganPlan,
            stateID: result.stateID,
            turnNumber: result.state.ctx.status.turn,
          });
        }
        // NB: don't overwrite `lastStateId` with `result.stateID` here.
        // `runtime.executeCommand` fires `onStateUpdate` listeners
        // synchronously, and some of those listeners (e.g.
        // `attachAutoPassBot`) re-enter `executeCommand` for another
        // player. By the time control returns to us, the engine is
        // several stateIDs ahead of `result.stateID`, but the `subscribe`
        // callback has already refreshed `lastStateId` to the true
        // current ID. Writing `result.stateID` back would clobber that
        // and the very next submit would fail STALE_STATE.
        // Return the LIVE stateID, not `result.stateID`. If a re-entrant
        // listener advanced the runtime during the submit, the caller
        // would otherwise get a value that's already stale the moment
        // it's handed back.
        return { ok: true, stateId: lastStateId };
      }
      return { ok: false, errorCode: result.errorCode, error: result.error };
    },

    canUndo: () => runtime.canUndo(playerId),

    undo: () => {
      if (commandGate.isBlocked()) {
        return {
          ok: false,
          errorCode: "animation-active",
          error: "Commands are blocked while the board transition is active.",
        };
      }
      const result = runtime.undo(playerId);
      if (!result) return null;
      if (result.success) {
        // Same rationale as in `submit`: let `subscribe` refresh
        // `lastStateId` from the runtime's live stateID.
        return { ok: true, stateId: lastStateId };
      }
      return { ok: false, errorCode: result.errorCode, error: result.error };
    },

    pendingChoice: () => runtime.getPendingChoice({ role: "player", playerId }),
    pendingBurst: () => runtime.getBoardView({ role: "player", playerId }).pendingBurst,

    moveHistory: () => runtime.getMoveHistory(),

    logEntries: () =>
      runtime.getGameLogHistory().filter((tagged) => isVisibleToViewer(tagged.entry)),
    packetAnimations: () =>
      [...runtime.getPacketAnimationHistory(), ...localAnimationPlans].sort(
        (left, right) => left.stateID - right.stateID,
      ),
    moveLogs: () =>
      runtime.getMoveLogHistory().map((log) => ({
        log: stripPrivateFields(log, String(viewerId)) ?? log,
        turnNumber:
          log.turnNumber ?? runtime.getFilteredView({ role: "player", playerId }).status.turn,
      })),

    cardDefinitionOf: (instanceId) => {
      const mapping = staticResources.cardsMaps.instances.get(instanceId);
      if (!mapping) return null;
      const definition = staticResources.getDefinition(mapping.definitionId);
      if (!definition || !presentation) return definition ?? null;
      const printingId = resolveGundamPresentationPrintingId(presentation, instanceId);
      return printingId ? cardWithPresentationPrinting(definition, printingId) : definition;
    },

    // `runtime.onStateUpdate` fires synchronously from INSIDE
    // `executeCommand`, before the CommandSuccess returns. Defer the
    // notification to a microtask so nested fixture automation can finish
    // and the store reads one coherent authoritative state, log, and
    // animation-history snapshot.
    //
    // Also refresh `lastStateId` here: fixture-level helpers like
    // `attachAutoMulliganKeep` / `attachAutoPassBot` drive the runtime
    // with their own `executeCommand` calls, which advance the engine's
    // stateID without going through this adapter. If we kept
    // `lastStateId` pinned to the last *adapter* submit, the very next
    // viewer submit would fail optimistic-concurrency with a stale
    // `prevStateID`. Reading `ctx._stateID` through the public engine
    // state object (same pattern the auto-mulligan helper uses) keeps
    // the adapter in sync with any external driver.
    //
    // Prime `lastStateId` on subscribe-registration too: fixtures that
    // submit commands during their loader (e.g. `block-step-demo`'s
    // opener `enterBattle`) advance the engine's stateID *before* React
    // mounts this adapter. No state-update listener has fired yet by
    // the time we get here, so without this prime the first viewer
    // submit would use `prevStateID = 0` while the engine expects the
    // post-loader value, and the submit would be rejected with
    // STALE_STATE.
    subscribe: (onChange) => {
      lastStateId = runtime.getState().ctx._stateID;
      let notificationQueued = false;
      return runtime.onStateUpdate(() => {
        lastStateId = runtime.getState().ctx._stateID;
        if (notificationQueued) return;
        notificationQueued = true;
        queueMicrotask(() => {
          notificationQueued = false;
          onChange();
        });
      });
    },
  };
}
