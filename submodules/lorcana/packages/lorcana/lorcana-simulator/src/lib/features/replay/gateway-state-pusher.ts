/**
 * Gateway State Pusher
 *
 * Creates a state-change callback for HumanVsAiOrchestrator that pushes
 * game state to the gateway via WebSocket for replay capture.
 */

import {
  createAcceptedMoveRecord,
  createEngineLogRecord,
  getLorcanaServerAuthoritativeSnapshot,
  type CardsMaps,
  type LorcanaServer,
} from "@tcg/lorcana-engine";
import type { HumanVsAiOrchestrator } from "@/features/simulator-devtools/vs-ai/human-vs-ai-orchestrator.svelte.js";

interface GatewayConnection {
  send(message: unknown): void;
}

interface GatewayStatePusherConfig {
  gateway: GatewayConnection;
  gameId: string;
  playerId: string;
  cardsMaps: CardsMaps;
}

/**
 * Create a state-change callback that pushes engine state to the gateway.
 * Tracks how many moves/logs have been pushed to send only deltas.
 */
export function createGatewayStatePusher(config: GatewayStatePusherConfig) {
  const { gateway, gameId, playerId, cardsMaps } = config;
  let persistedMoveCount = 0;
  let persistedLogCount = 0;
  let version = 0;

  return (orchestrator: HumanVsAiOrchestrator) => {
    try {
      const server = orchestrator.currentEngine as unknown as LorcanaServer;
      const engineSnapshot = getLorcanaServerAuthoritativeSnapshot(server, cardsMaps);

      const allMoves = orchestrator.server.getMoveHistory();
      const nextMoveEntries = allMoves.slice(persistedMoveCount);
      if (nextMoveEntries.length === 0) return;

      const nextVersionStart = version;
      const acceptedMoveRecords = nextMoveEntries.map((entry, index) =>
        createAcceptedMoveRecord({
          actorId: entry.playerId ?? playerId,
          gameId,
          moveEntry: entry,
          sourceAuthority: "client",
          stateVersion: nextVersionStart + index + 1,
        }),
      );

      const latestStateVersion = acceptedMoveRecords.at(-1)?.stateVersion ?? version;
      const allLogs = orchestrator.server.getMoveLogHistory();
      const engineLogRecords = allLogs.slice(persistedLogCount).map((entry) =>
        createEngineLogRecord({
          gameId,
          log: entry,
          sourceAuthority: "client",
          stateVersion: latestStateVersion,
        }),
      );

      const actorId = acceptedMoveRecords.at(-1)?.actorId ?? playerId;
      version = latestStateVersion;
      persistedMoveCount += nextMoveEntries.length;
      persistedLogCount +=
        allLogs.length -
        (persistedLogCount + (allLogs.length - persistedLogCount - engineLogRecords.length));
      persistedLogCount = persistedLogCount + engineLogRecords.length - engineLogRecords.length;
      // Simplified: just track total
      persistedMoveCount = allMoves.length;
      persistedLogCount = allLogs.length;

      const moveType = acceptedMoveRecords.at(-1)?.moveId ?? "unknown";

      gateway.send({
        type: "push_state",
        gameId,
        state: { engineSnapshot },
        version,
        moveType,
        actorId,
        ...(acceptedMoveRecords.length === 1
          ? { acceptedMove: acceptedMoveRecords[0] }
          : acceptedMoveRecords.length > 1
            ? { acceptedMoves: acceptedMoveRecords }
            : {}),
        ...(engineLogRecords.length > 0 ? { engineLogs: engineLogRecords } : {}),
      });
    } catch (error) {
      // Graceful degradation — don't crash the game if push fails
      console.warn("[gateway-state-pusher] Failed to push state:", error);
    }
  };
}
