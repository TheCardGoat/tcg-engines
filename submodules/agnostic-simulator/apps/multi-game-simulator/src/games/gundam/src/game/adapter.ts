import {
  asPlayerId,
  stripPrivateFields,
  type GameLogEntry,
  type GundamMoveLog,
  type MatchRuntime,
  type MatchStaticResources,
  type MoveHistoryEntry,
} from "@tcg/gundam-engine";
import {
  buildGundamInteractionView,
  describeGundamInteractionProcedure,
  gundamTargetInputBinding,
  seedGundamInteractionSource,
  type GundamPendingChoice,
  type GundamPendingMoveStep,
} from "@tcg/gundam-server-adapter";
import type { EngineInteractionView } from "@tcg/protocol";
import type { Card } from "@tcg/gundam-types";

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

export interface EngineAdapter {
  readonly viewerId: ViewerId;
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
  readonly moveHistory: () => readonly MoveHistoryEntry[];
  /**
   * Running list of game-log entries accumulated from every successful
   * `executeCommand` / `undo`, filtered by viewer visibility. Each entry
   * is tagged with the turn it landed in.
   */
  readonly logEntries: () => readonly TurnTaggedLogEntry[];
  readonly moveLogs: () => readonly TurnTaggedMoveLog[];
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
}

export function createEngineAdapter({
  runtime,
  staticResources,
  viewerId,
}: EngineAdapterConfig): EngineAdapter {
  // The viewer is always a participant from this seat — ViewerId and PlayerId
  // are parallel branded strings bound to the same seat identifier, so we
  // re-brand through the engine's public helper rather than casting.
  const playerId = asPlayerId(String(viewerId));

  // Track the latest stateID via command results instead of reading the
  // engine's private `ctx._stateID` field. MatchRuntime.initialize() seeds
  // state at 0 and every successful executeCommand/undo returns the new
  // stateID on the CommandSuccess envelope, so we never need to peek at
  // engine internals for optimistic-concurrency sequencing.
  let lastStateId = 0;

  // Accumulated game-log entries. Every CommandSuccess envelope carries the
  // `logEntries` emitted during that command (including lifecycle hooks
  // like mulligan onEnter / onExit), so appending on each successful submit
  // / undo is enough — the engine itself holds no long-lived logger we can
  // subscribe to.
  const logTrail: TurnTaggedLogEntry[] = [];

  const captureLog = (entries: readonly GameLogEntry[]) => {
    if (entries.length === 0) return;
    const turnNumber = runtime.getFilteredView({ role: "player", playerId }).status.turn;
    for (const entry of entries) {
      logTrail.push({ entry, turnNumber });
    }
  };

  const isVisibleToViewer = (entry: GameLogEntry): boolean => {
    const { visibleTo } = entry;
    if (visibleTo === undefined || visibleTo === "all") return true;
    return visibleTo.includes(playerId);
  };

  return {
    viewerId,

    view: () => runtime.getFilteredView({ role: "player", playerId }),

    interactionView: () =>
      buildGundamInteractionView({
        actorId: playerId,
        stateVersion: runtime.getState().ctx._stateID,
        state: runtime.getState(),
        staticResources,
        pendingChoice: runtime.getPendingChoice({ role: "player", playerId }),
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
      const result = runtime.executeCommand(
        {
          commandID: crypto.randomUUID(),
          move,
          prevStateID: lastStateId,
          actorRole: "player",
          args: partialInput,
        },
        playerId,
      );

      if (result.success) {
        // NB: don't overwrite `lastStateId` with `result.stateID` here.
        // `runtime.executeCommand` fires `onStateUpdate` listeners
        // synchronously, and some of those listeners (e.g.
        // `attachAutoPassBot`) re-enter `executeCommand` for another
        // player. By the time control returns to us, the engine is
        // several stateIDs ahead of `result.stateID`, but the `subscribe`
        // callback has already refreshed `lastStateId` to the true
        // current ID. Writing `result.stateID` back would clobber that
        // and the very next submit would fail STALE_STATE.
        captureLog(result.logEntries);
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
      const result = runtime.undo(playerId);
      if (!result) return null;
      if (result.success) {
        // Same rationale as in `submit`: let `subscribe` refresh
        // `lastStateId` from the runtime's live stateID.
        captureLog(result.logEntries);
        return { ok: true, stateId: lastStateId };
      }
      return { ok: false, errorCode: result.errorCode, error: result.error };
    },

    pendingChoice: () => runtime.getPendingChoice({ role: "player", playerId }),

    moveHistory: () => runtime.getMoveHistory(),

    logEntries: () => logTrail.filter((t) => isVisibleToViewer(t.entry)),
    moveLogs: () =>
      runtime.getMoveLogHistory().map((log) => ({
        log: stripPrivateFields(log, String(viewerId)) ?? log,
        turnNumber:
          log.turnNumber ?? runtime.getFilteredView({ role: "player", playerId }).status.turn,
      })),

    cardDefinitionOf: (instanceId) => {
      const mapping = staticResources.cardsMaps.instances.get(instanceId);
      if (!mapping) return null;
      return staticResources.getDefinition(mapping.definitionId) ?? null;
    },

    // `runtime.onStateUpdate` fires synchronously from INSIDE
    // `executeCommand`, before the CommandSuccess returns. But our
    // `captureLog` runs AFTER `executeCommand` returns, so a naive
    // passthrough subscription would notify the store while `logTrail` is
    // still empty. Defer the notification to a microtask so it fires after
    // the current call stack unwinds — by then both the new engine state
    // AND any freshly-captured log entries are visible.
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
      return runtime.onStateUpdate(() => {
        lastStateId = runtime.getState().ctx._stateID;
        queueMicrotask(onChange);
      });
    },
  };
}
