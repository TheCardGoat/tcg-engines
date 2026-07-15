/**
 * MatchRuntime logging projection.
 *
 * Converts move handler log entries + domain events into unified MoveLog entries.
 * The legacy GameLogEntry / LogProjector pipeline has been removed.
 */

import type { MatchState, PublishedGameEvent } from "./types";
import type { ProjectedLogEntry } from "./match-runtime.types";
import type { MoveLog } from "../../types/move-log";
import type { CardInstanceId, PlayerId } from "../types";
import { MoveOutcomeAccumulator } from "../../runtime-game/move-outcome-accumulator";
import { buildMoveLog, buildSystemMoveLog } from "../../runtime-game/move-log-factory";
import type { CardsDrawnPayload } from "../../types/domain-events";
import type { LorcanaLogMessage } from "../../types/log-messages";

export interface ProjectGameLogInput {
  publishedGameEvents: PublishedGameEvent[];
  state: MatchState;
  moveLogEntries?: readonly ProjectedLogEntry[];
}

export interface ProjectGameLogOutput {
  /** All MoveLog entries produced by this projection (move + system events). */
  moveLogs: MoveLog[];
  /**
   * Mandatory (start-of-turn) draws that occurred during this move's resolution.
   * The caller should inject these into the most recent turnStart log in the full log history,
   * because that canonical entry was already emitted in a prior move's batch.
   */
  mandatoryDraws?: { playerId: PlayerId; cardIds: CardInstanceId[] }[];
}

export function projectGameLog(input: ProjectGameLogInput): ProjectGameLogOutput {
  const { publishedGameEvents, state, moveLogEntries = [] } = input;

  const moveLogs: MoveLog[] = [];
  const accumulator = new MoveOutcomeAccumulator();

  // MOVE_EXECUTED is unshifted to index 0 in pendingGameEvents (see match-runtime.commands.ts),
  // so it arrives BEFORE the domain events it produced. We defer the flush until just before the
  // next MOVE_EXECUTED or end-of-stream so outcomes are fully accumulated first.
  let pendingMove: { move: string; playerId: PlayerId; timestamp: number } | null = null;
  const pendingSystemLogs: MoveLog[] = [];
  // Mandatory draws accumulate here; injected into the pending turnStart log at flush time.
  const pendingMandatoryDraws: { playerId: PlayerId; cardId: CardInstanceId }[] = [];

  const flushPendingMove = () => {
    if (!pendingMove) return;

    // Inject mandatory draws into the most recent turnStart log so they appear as
    // private draw detail rather than in the current move's outcomes.
    if (pendingMandatoryDraws.length > 0) {
      const injectDraws = (logs: MoveLog[]) => {
        for (let i = logs.length - 1; i >= 0; i--) {
          const log = logs[i];
          if (log && log.moveType === "turnStart") {
            const cardIds = pendingMandatoryDraws
              .filter((d) => d.playerId === log.playerId)
              .map((d) => d.cardId);
            if (cardIds.length > 0) {
              logs[i] = appendPrivateMessage(log, log.playerId, {
                key: "lorcana.private.cardsDrawn.detail",
                values: { playerId: log.playerId, cardIds },
              });
            }
            return true;
          }
        }
        return false;
      };
      // Try to inject into the turnStart log in this batch first, then already-flushed moveLogs.
      // Only clear if injection succeeded; otherwise leave them for the caller to handle.
      const injected = injectDraws(pendingSystemLogs) || injectDraws(moveLogs);
      if (injected) {
        pendingMandatoryDraws.length = 0;
      }
    }

    const outcomes = accumulator.flush();
    const moveLog = buildMoveLog(
      moveLogEntries,
      pendingMove.move,
      pendingMove.playerId,
      pendingMove.timestamp,
      outcomes,
    );
    if (moveLog) {
      moveLogs.push(moveLog);
    }
    // System events (TURN_STARTED, GAME_ENDED) that belong to this move's resolution
    moveLogs.push(...pendingSystemLogs);
    pendingSystemLogs.length = 0;
    pendingMove = null;
  };

  for (const publishedEvent of publishedGameEvents) {
    const ge = publishedEvent.event;

    if (ge.kind === "MOVE_EXECUTED") {
      // Flush the previous move before starting the new one
      flushPendingMove();
      pendingMove = {
        move: ge.move,
        playerId: ge.playerId as PlayerId,
        timestamp: publishedEvent.timestamp,
      };
      continue;
    }

    // Collect mandatory-draw card IDs to inject into turnStart private detail at flush time.
    if (
      ge.kind === "CUSTOM" &&
      ge.customType === "cardsDrawn" &&
      (ge.data as CardsDrawnPayload).source === "mandatory-draw"
    ) {
      const drawData = ge.data as CardsDrawnPayload;
      for (const cardId of drawData.cardIds ?? []) {
        pendingMandatoryDraws.push({
          playerId: drawData.playerId,
          cardId: cardId as CardInstanceId,
        });
      }
    }

    // Feed every event to the outcome accumulator
    accumulator.accumulate(publishedEvent, { state });

    // System events: TURN_STARTED, GAME_ENDED
    if (ge.kind === "TURN_STARTED" || ge.kind === "GAME_ENDED") {
      const systemLog = buildSystemMoveLog(publishedEvent);
      if (systemLog) {
        if (pendingMove) {
          // Hold system log until the pending move is flushed, so ordering is:
          // [moveLog, turnStartLog] rather than [turnStartLog, moveLog]
          pendingSystemLogs.push(systemLog);
        } else {
          moveLogs.push(systemLog);
        }
      }
    }
  }

  // Flush the last pending move
  flushPendingMove();

  // Expose any leftover mandatory draws (not injected because no turnStart log was in this batch)
  // so the caller can retroactively update the full log history.
  let mandatoryDraws: { playerId: PlayerId; cardIds: CardInstanceId[] }[] | undefined;
  if (pendingMandatoryDraws.length > 0) {
    const byPlayer = new Map<PlayerId, CardInstanceId[]>();
    for (const { playerId, cardId } of pendingMandatoryDraws) {
      const arr = byPlayer.get(playerId) ?? [];
      arr.push(cardId);
      byPlayer.set(playerId, arr);
    }
    mandatoryDraws = [...byPlayer.entries()].map(([playerId, cardIds]) => ({ playerId, cardIds }));
  }

  return { moveLogs, ...(mandatoryDraws ? { mandatoryDraws } : {}) };
}

function appendPrivateMessage(
  log: MoveLog,
  playerId: PlayerId,
  message: LorcanaLogMessage<"lorcana.private.cardsDrawn.detail">,
): MoveLog {
  const existingMessages = log.privateByPlayerId?.[playerId] ?? [];

  return {
    ...log,
    privateByPlayerId: {
      ...log.privateByPlayerId,
      [playerId]: [...existingMessages, message],
    },
  };
}
