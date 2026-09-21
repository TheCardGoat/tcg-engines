import type { CommandResult } from "../types/commands.ts";
import type { GameEvent } from "../types/game-events.ts";
import type { MoveLog } from "../logging/move-log.ts";
import type { AutoMatchLogEntry, AutoMatchResult } from "./run-auto-match.ts";

/**
 * Coach-facing match dump: every decision the shipped chooser took, plus the
 * engine game logs that command produced. Built from {@link runAutoMatch};
 * the coach must not invent a parallel play path.
 */
export interface CoachDumpMeta {
  readonly seed: string;
  readonly strategyA: string;
  readonly strategyB: string;
  readonly deckAId?: string;
  readonly deckBId?: string;
}

export type CoachDumpGameEvent = {
  readonly type: string;
  readonly [key: string]: unknown;
};

/** Distributive Omit: each {@link MoveLog} member keeps its own fields. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type CoachDumpMoveLog = DistributiveOmit<MoveLog, "timestamp">;

export interface CoachDumpStep {
  readonly stepIndex: number;
  readonly playerId: string;
  readonly kind: AutoMatchLogEntry["result"]["kind"];
  readonly move?: string;
  readonly args?: Record<string, unknown>;
  readonly reason?: string;
  readonly moveLogs: readonly CoachDumpMoveLog[];
  readonly gameEvents: readonly CoachDumpGameEvent[];
}

export interface CoachMatchDump {
  readonly version: 1;
  readonly seed: string;
  readonly strategyA: string;
  readonly strategyB: string;
  readonly deckAId?: string;
  readonly deckBId?: string;
  readonly winnerId: string | null;
  readonly reason: AutoMatchResult["reason"];
  readonly turnCount: number;
  readonly stepCount: number;
  readonly steps: readonly CoachDumpStep[];
}

export function buildCoachDump(result: AutoMatchResult, meta: CoachDumpMeta): CoachMatchDump {
  return {
    version: 1,
    seed: meta.seed,
    strategyA: meta.strategyA,
    strategyB: meta.strategyB,
    ...(meta.deckAId ? { deckAId: meta.deckAId } : {}),
    ...(meta.deckBId ? { deckBId: meta.deckBId } : {}),
    winnerId: result.winnerId,
    reason: result.reason,
    turnCount: result.turnCount,
    stepCount: result.stepCount,
    steps: result.log.map(projectStep),
  };
}

function projectStep(entry: AutoMatchLogEntry): CoachDumpStep {
  const result = entry.result;
  if (result.kind === "acted") {
    const { moveLogs, gameEvents } = projectCommandLogs(result.result);
    return {
      stepIndex: entry.stepIndex,
      playerId: entry.playerId,
      kind: "acted",
      move: result.decision.move,
      args: result.decision.args,
      moveLogs,
      gameEvents,
    };
  }
  if (result.kind === "illegal") {
    return {
      stepIndex: entry.stepIndex,
      playerId: entry.playerId,
      kind: "illegal",
      move: result.decision.move,
      args: result.decision.args,
      reason: `${result.errorCode}: ${result.error}`,
      moveLogs: [],
      gameEvents: [],
    };
  }
  if (result.kind === "stuck") {
    return {
      stepIndex: entry.stepIndex,
      playerId: entry.playerId,
      kind: "stuck",
      reason: result.reason,
      moveLogs: [],
      gameEvents: [],
    };
  }
  return {
    stepIndex: entry.stepIndex,
    playerId: entry.playerId,
    kind: "idle",
    reason: result.reason,
    moveLogs: [],
    gameEvents: [],
  };
}

function projectCommandLogs(result: CommandResult): {
  moveLogs: CoachDumpMoveLog[];
  gameEvents: CoachDumpGameEvent[];
} {
  if (!result.success) return { moveLogs: [], gameEvents: [] };
  return {
    moveLogs: result.moveLogs.map(stripMoveLogTimestamp),
    gameEvents: result.gameEvents.map(projectGameEvent),
  };
}

function stripMoveLogTimestamp(log: MoveLog): CoachDumpMoveLog {
  const { timestamp: _timestamp, ...rest } = log;
  return rest;
}

function projectGameEvent(event: GameEvent): CoachDumpGameEvent {
  return { ...(event as unknown as CoachDumpGameEvent) };
}
