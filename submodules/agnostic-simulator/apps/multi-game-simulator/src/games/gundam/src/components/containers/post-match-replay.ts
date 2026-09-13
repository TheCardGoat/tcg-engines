import type { ReplayMetadata, ReplayStep } from "@tcg/game-page-contract";
import { isCanonicalEngineMoveLog } from "@tcg/shared/game-engine";

import type { GundamReplayData } from "../../../replay/fetchReplay.ts";
import type { TurnTaggedMoveLog } from "../../game/adapter.ts";
import { displayTurn } from "../../game/labels.ts";
import { reconstructGundamMoveLogs } from "../../engine/live/liveEngineLogs.ts";

export interface GundamPostMatchReplaySummary {
  readonly metadata: ReplayMetadata;
  readonly moveLogs: readonly TurnTaggedMoveLog[];
  readonly movesByPlayerId: Readonly<Record<string, number>>;
}

/** Project the server-authoritative replay into the data used by the result modal. */
export function projectGundamPostMatchReplay(
  replay: GundamReplayData,
): GundamPostMatchReplaySummary {
  const movesByPlayerId: Record<string, number> = {};
  for (const step of replay.steps) {
    if (!step.acceptedMove) continue;
    const actorId = String(step.acceptedMove.actorId);
    movesByPlayerId[actorId] = (movesByPlayerId[actorId] ?? 0) + 1;
  }

  return {
    metadata: {
      ...replay.metadata,
      totalTurns: displayTurn(replay.metadata.totalTurns),
    },
    movesByPlayerId,
    moveLogs: reconstructGundamMoveLogs(replayLogRecords(replay.steps)).map((log) => ({
      log,
      turnNumber: log.turnNumber ?? 0,
    })),
  };
}

function replayLogRecords(steps: readonly ReplayStep[]) {
  return steps.flatMap((step) => {
    const position = step.acceptedMove ?? step.reversal;
    return step.logs.flatMap((entry) => {
      if (entry.tag !== "engine_log" || !isCanonicalEngineMoveLog(entry.data)) return [];
      return [
        {
          stateVersion: position.stateVersion,
          timestamp: entry.ts ?? entry.data.timestamp,
          log: entry.data,
        },
      ];
    });
  });
}
