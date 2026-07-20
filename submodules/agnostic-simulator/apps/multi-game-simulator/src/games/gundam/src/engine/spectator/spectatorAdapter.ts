import { asPlayerId, stripPrivateFields, type GameLogEntry } from "@tcg/gundam-engine";
import type { EngineInteractionView } from "@tcg/protocol";

import type { EngineAdapter, EngineAdapterConfig } from "../../game/adapter.ts";
import { type MoveName, type PartialInput, type SubmitOutcome } from "../../game/types.ts";

/**
 * Build an {@link EngineAdapter} for a spectator viewer.
 *
 * Spectator semantics:
 *   - `view`  reads through the engine's `role: "spectator"` filter so
 *             neither player's private zones are revealed.
 *   - `submit` always returns a soft error — spectators can't act.
 *             The bot-vs-bot route relies on bots driving the runtime
 *             directly via `runtime.executeCommand`; the adapter's
 *             submit path stays available so accidental human clicks
 *             surface a clear toast instead of silently no-op'ing.
 *   - `undo` is disabled (no actor → no history to walk).
 *   - `pendingChoice` reads with `role: "spectator"` (no playerId).
 *
 * The store / pending controller still drive the standard subscribe
 * → re-render loop via `runtime.onStateUpdate`, so the UI ticks every
 * time a bot's move lands. Logs are accumulated and filtered with
 * `visibleTo === "all"` only (spectators have no actor identity, so
 * `visibleTo` lists never match them by id).
 */
export function createSpectatorEngineAdapter(config: EngineAdapterConfig): EngineAdapter {
  const { runtime, staticResources, viewerId } = config;

  // Even though spectators have no real seat, we keep a "viewer player id"
  // so existing UI selectors (player-seat layout, mobile drawer side
  // selection) have a stable "bottom is P1" perspective. This matches
  // the convention the live-match route uses for the human seat.
  const perspectivePlayerId = asPlayerId(String(viewerId));

  const isVisibleToViewer = (entry: GameLogEntry): boolean => {
    const { visibleTo } = entry;
    if (visibleTo === undefined || visibleTo === "all") return true;
    // Spectators have no actor identity, so per-player visibility lists never
    // match them. The original spectator contract filters to `visibleTo === "all"`
    // only, which is the safe default for a revealed board.
    return false;
  };

  return {
    viewerId,
    viewerContext: {
      role: "spectator",
      playerId: null,
      perspectivePlayerId: viewerId,
    },

    view: () => runtime.getFilteredView({ role: "spectator" }),

    interactionView: (): EngineInteractionView => ({
      protocolVersion: 1,
      gameSlug: "gundam",
      actorId: "spectator",
      stateVersion: runtime.getState().ctx._stateID,
      status: "idle",
      actions: [],
    }),

    describeMove: () => [{ kind: "confirm" }],

    seedForCard: () => ({}),

    keyForStep: (_move, step) => ({ key: step.kind, multi: false }),

    submit: (_move: MoveName, _partialInput: PartialInput): SubmitOutcome => ({
      ok: false,
      errorCode: "SPECTATOR",
      error: "Spectators can't submit moves.",
    }),

    canUndo: () => false,
    undo: () => null,

    pendingChoice: () => runtime.getPendingChoice({ role: "spectator" }),

    moveHistory: () => runtime.getMoveHistory(),

    logEntries: () =>
      runtime.getGameLogHistory().filter((tagged) => isVisibleToViewer(tagged.entry)),
    packetAnimations: () => runtime.getPacketAnimationHistory(),
    moveLogs: () =>
      runtime.getMoveLogHistory().map((log) => ({
        log: stripPrivateFields(log, null) ?? log,
        turnNumber:
          log.turnNumber ??
          runtime.getFilteredView({ role: "player", playerId: perspectivePlayerId }).status.turn,
      })),

    cardDefinitionOf: (instanceId) => {
      const mapping = staticResources.cardsMaps.instances.get(instanceId);
      if (!mapping) return null;
      return staticResources.getDefinition(mapping.definitionId) ?? null;
    },

    subscribe: (onChange) => runtime.onStateUpdate(() => queueMicrotask(onChange)),
  };
}
