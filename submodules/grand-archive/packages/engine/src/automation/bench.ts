import type { GrandArchivePlayerId } from "../game/identity.ts";
import {
  playGrandArchiveAutomatedMatch,
  type GrandArchiveAutomatedMatchTermination,
  type PlayGrandArchiveAutomatedMatchInput,
} from "./play-match.ts";

interface GrandArchiveAutomatedBenchCaseBase {
  /** Stable identity used to align the same match across benchmark candidates. */
  readonly id: string;
}

export type GrandArchiveAutomatedBenchCase =
  | (GrandArchiveAutomatedBenchCaseBase & {
      readonly input: PlayGrandArchiveAutomatedMatchInput;
      readonly createInput?: never;
    })
  | (GrandArchiveAutomatedBenchCaseBase & {
      /** Lazily creates large programs/states so sweeps do not retain every case at once. */
      readonly createInput: () => PlayGrandArchiveAutomatedMatchInput;
      readonly input?: never;
    });

export interface RunGrandArchiveAutomatedBenchInput {
  readonly label: string;
  readonly cases: readonly GrandArchiveAutomatedBenchCase[];
}

export interface GrandArchiveAutomatedBenchMatchReport {
  readonly caseId: string;
  readonly termination: GrandArchiveAutomatedMatchTermination;
  readonly winnerIds: readonly GrandArchivePlayerId[];
  readonly turnCount: number;
  readonly actionCount: number;
  readonly error?: string;
}

export interface GrandArchiveAutomatedBenchReport {
  readonly version: 1;
  readonly label: string;
  readonly summary: {
    readonly matches: number;
    readonly finished: number;
    readonly unfinished: number;
    readonly matchesWithoutWinner: number;
    readonly averageTurns: number;
    readonly averageActions: number;
    readonly terminations: Readonly<Record<GrandArchiveAutomatedMatchTermination, number>>;
    readonly winsByPlayerId: Readonly<Record<string, number>>;
  };
  readonly matches: readonly GrandArchiveAutomatedBenchMatchReport[];
  readonly createdAt: string;
}

export interface GrandArchiveAutomatedBenchDiff {
  readonly version: 1;
  readonly baselineLabel: string;
  readonly candidateLabel: string;
  readonly focusPlayerId: GrandArchivePlayerId | null;
  readonly changedWinnerSets: number;
  readonly gained: number;
  readonly lost: number;
  readonly unfinishedDelta: number;
  readonly verdict: "keep" | "reject" | "inconclusive";
  readonly reason: string;
}

function emptyTerminationCounts(): Record<GrandArchiveAutomatedMatchTermination, number> {
  return {
    finished: 0,
    "max-actions": 0,
    stall: 0,
    illegal: 0,
    "snapshot-refusal": 0,
    "engine-throw": 0,
  };
}

/** Runs deterministic match cases and retains only bounded comparison evidence. */
export function runGrandArchiveAutomatedBench(
  input: RunGrandArchiveAutomatedBenchInput,
): GrandArchiveAutomatedBenchReport {
  const seenCaseIds = new Set<string>();
  for (const benchCase of input.cases) {
    if (benchCase.id.length === 0) throw new Error("Benchmark case ids must not be empty");
    if (seenCaseIds.has(benchCase.id)) {
      throw new Error(`Duplicate Grand Archive benchmark case id: ${benchCase.id}`);
    }
    seenCaseIds.add(benchCase.id);
  }
  const reports: GrandArchiveAutomatedBenchMatchReport[] = [];
  const terminations = emptyTerminationCounts();
  const winsByPlayerId: Record<string, number> = {};
  let turnSum = 0;
  let actionSum = 0;
  let matchesWithoutWinner = 0;

  for (const benchCase of input.cases) {
    const matchInput = benchCase.input ?? benchCase.createInput();
    const transcript = playGrandArchiveAutomatedMatch(matchInput);
    terminations[transcript.termination] += 1;
    turnSum += transcript.turnCount;
    actionSum += transcript.actionCount;
    if (transcript.winnerIds.length === 0) matchesWithoutWinner += 1;
    for (const winnerId of transcript.winnerIds) {
      winsByPlayerId[winnerId] = (winsByPlayerId[winnerId] ?? 0) + 1;
    }
    reports.push({
      caseId: benchCase.id,
      termination: transcript.termination,
      winnerIds: transcript.winnerIds,
      turnCount: transcript.turnCount,
      actionCount: transcript.actionCount,
      ...(transcript.error ? { error: transcript.error } : {}),
    });
  }

  const matches = reports.length;
  const finished = terminations.finished;
  return {
    version: 1,
    label: input.label,
    summary: {
      matches,
      finished,
      unfinished: matches - finished,
      matchesWithoutWinner,
      averageTurns: matches === 0 ? 0 : turnSum / matches,
      averageActions: matches === 0 ? 0 : actionSum / matches,
      terminations,
      winsByPlayerId,
    },
    matches: reports,
    createdAt: new Date().toISOString(),
  };
}

function winnerSetKey(winnerIds: readonly GrandArchivePlayerId[]): string {
  return [...winnerIds].sort().join("\u0000");
}

/**
 * Compares the same ordered cases. With `focusPlayerId`, winner flips are
 * evaluated for that seat; without one, the diff remains a safety comparison.
 */
export function diffGrandArchiveAutomatedBenchReports(
  baseline: GrandArchiveAutomatedBenchReport,
  candidate: GrandArchiveAutomatedBenchReport,
  focusPlayerId: GrandArchivePlayerId | null = null,
): GrandArchiveAutomatedBenchDiff {
  if (baseline.matches.length !== candidate.matches.length) {
    throw new Error("Cannot diff Grand Archive benchmark reports with different case counts");
  }

  let changedWinnerSets = 0;
  let gained = 0;
  let lost = 0;
  for (let index = 0; index < baseline.matches.length; index += 1) {
    const before = baseline.matches[index];
    const after = candidate.matches[index];
    if (!before || !after || before.caseId !== after.caseId) {
      throw new Error("Cannot diff Grand Archive benchmark reports with different case ids");
    }
    if (winnerSetKey(before.winnerIds) !== winnerSetKey(after.winnerIds)) {
      changedWinnerSets += 1;
    }
    if (focusPlayerId) {
      const wonBefore = before.winnerIds.includes(focusPlayerId);
      const wonAfter = after.winnerIds.includes(focusPlayerId);
      if (!wonBefore && wonAfter) gained += 1;
      if (wonBefore && !wonAfter) lost += 1;
    }
  }

  const unfinishedDelta = candidate.summary.unfinished - baseline.summary.unfinished;
  let verdict: GrandArchiveAutomatedBenchDiff["verdict"] = "inconclusive";
  let reason = "The candidate produced no conclusive safety or focused-player improvement.";
  if (unfinishedDelta > 0) {
    verdict = "reject";
    reason = "The candidate increased unfinished matches.";
  } else if (lost > 0) {
    verdict = "reject";
    reason = "The focused player lost matches won by the baseline.";
  } else if (unfinishedDelta < 0) {
    verdict = "keep";
    reason = "The candidate completed more of the same benchmark cases.";
  } else if (gained > 0) {
    verdict = "keep";
    reason = "The focused player gained matches without new unfinished cases.";
  }

  return {
    version: 1,
    baselineLabel: baseline.label,
    candidateLabel: candidate.label,
    focusPlayerId,
    changedWinnerSets,
    gained,
    lost,
    unfinishedDelta,
    verdict,
    reason,
  };
}
