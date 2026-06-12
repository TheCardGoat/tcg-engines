/**
 * Run N self-play matches between two strategies + decks and emit a
 * structured JSON report.
 *
 * Each match uses a per-iteration seed (`${seedBase}-${i}`) so the run is
 * reproducible: re-running with the same options produces an identical
 * report. The report is the contract the `/improve-bot` skill reads to
 * decide whether a candidate strategy improves over its baseline.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

import {
  GUNDAM_MOVE_NAMES,
  playMatch,
  type BotDecisionRecord,
  type GundamBotCandidateFamily,
  type PlayMatchOutcome,
  type PlayMatchTermination,
  type PlayerId,
} from "@tcg/gundam-engine";

import {
  buildBenchRuntime,
  PLAYER_ONE,
  PLAYER_TWO,
  REGISTERED_DECKS,
  type BenchDeckId,
} from "./runtime.ts";
import { REGISTERED_STRATEGIES, type BenchStrategyId } from "./strategies.ts";

// ── Report types ───────────────────────────────────────────────────────────────

export interface SharedBenchOptions {
  readonly p1Strategy: BenchStrategyId;
  readonly p2Strategy: BenchStrategyId;
  readonly p1Deck: BenchDeckId;
  readonly p2Deck: BenchDeckId;
  /** Number of matches in the run. */
  readonly matches: number;
  /** Per-match seed = `${seedBase}-${i}`. */
  readonly seedBase: string;
  /** Hard cap on planner invocations per match. */
  readonly maxActions: number;
  /** Optional human-readable tag, e.g. "baseline-greedy-vs-value". */
  readonly label?: string;
}

export interface BenchOptions extends SharedBenchOptions {}

export interface MatchReport {
  readonly matchId: number;
  readonly seed: string;
  readonly termination: PlayMatchTermination;
  readonly winner: "p1" | "p2" | null;
  readonly winReason: string | null;
  readonly turnCount: number;
  readonly actionCount: number;
  readonly elapsedMs: number;
}

export interface FamilyStats {
  readonly attempted: number;
  readonly succeeded: number;
  readonly failed: number;
  readonly errorCodes: Readonly<Record<string, number>>;
}

export interface PlayerStats {
  readonly wins: number;
  readonly familyStats: Readonly<Record<GundamBotCandidateFamily, FamilyStats>>;
}

export interface BenchSummary {
  readonly matches: number;
  readonly p1WinRate: number;
  readonly p2WinRate: number;
  readonly drawRate: number;
  readonly avgTurns: number;
  readonly avgActions: number;
  readonly avgElapsedMs: number;
  readonly terminationDistribution: Readonly<Record<PlayMatchTermination, number>>;
  readonly winReasonDistribution: Readonly<Record<string, number>>;
}

export interface BenchReport {
  readonly version: 1;
  readonly options: BenchOptions;
  readonly summary: BenchSummary;
  readonly p1: PlayerStats;
  readonly p2: PlayerStats;
  readonly matches: readonly MatchReport[];
  readonly createdAt: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Build the per-family stats container from the engine's canonical move-name
 * list. The `_familyMoveNameParity` witness in
 * `packages/engine/src/automation/candidate-types.ts` enforces that
 * `GundamBotCandidateFamily` and `GundamMoveName` stay in 1:1
 * correspondence, so adding a new move automatically widens both the union
 * and `GUNDAM_MOVE_NAMES` — this initialiser then picks up the new family
 * with zero edits. Initialising on demand inside `bumpFamily` would also
 * work, but pre-seeding lets reports always serialise the full set of
 * families (including zero-attempt ones) for downstream diffing.
 */
function emptyFamilyStats(): Record<GundamBotCandidateFamily, FamilyStats> {
  const out = {} as Record<GundamBotCandidateFamily, FamilyStats>;
  for (const name of GUNDAM_MOVE_NAMES) {
    out[name as GundamBotCandidateFamily] = {
      attempted: 0,
      succeeded: 0,
      failed: 0,
      errorCodes: {},
    };
  }
  return out;
}

function bumpFamily(
  stats: Record<GundamBotCandidateFamily, FamilyStats>,
  record: BotDecisionRecord,
): void {
  for (const attempt of record.attemptDetails) {
    const family = attempt.candidate.family;
    // Lazily ensure-initialise so a new candidate-family that somehow
    // slips past the parity witness still gets aggregated rather than
    // throwing on `stats[family]!`. Costs one dictionary check per
    // attempt; negligible at bench-run scale.
    const existing = stats[family] ?? { attempted: 0, succeeded: 0, failed: 0, errorCodes: {} };
    const next: FamilyStats = {
      attempted: existing.attempted + 1,
      succeeded: existing.succeeded + (attempt.success ? 1 : 0),
      failed: existing.failed + (attempt.success ? 0 : 1),
      errorCodes: { ...existing.errorCodes },
    };
    if (!attempt.success && attempt.errorCode) {
      const writable = next.errorCodes as Record<string, number>;
      writable[attempt.errorCode] = (writable[attempt.errorCode] ?? 0) + 1;
    }
    stats[family] = next;
  }
}

function classifyWinner(outcome: PlayMatchOutcome): "p1" | "p2" | null {
  if (!outcome.winner) return null;
  if (outcome.winner === PLAYER_ONE) return "p1";
  if (outcome.winner === PLAYER_TWO) return "p2";
  return null;
}

// ── Public API ─────────────────────────────────────────────────────────────────

export function runBench(options: BenchOptions, onProgress?: (i: number) => void): BenchReport {
  const p1Strategy = REGISTERED_STRATEGIES[options.p1Strategy];
  const p2Strategy = REGISTERED_STRATEGIES[options.p2Strategy];
  const p1DeckList = REGISTERED_DECKS[options.p1Deck];
  const p2DeckList = REGISTERED_DECKS[options.p2Deck];

  if (!p1Strategy) throw new Error(`Unknown p1Strategy: ${options.p1Strategy}`);
  if (!p2Strategy) throw new Error(`Unknown p2Strategy: ${options.p2Strategy}`);
  if (!p1DeckList) throw new Error(`Unknown p1Deck: ${options.p1Deck}`);
  if (!p2DeckList) throw new Error(`Unknown p2Deck: ${options.p2Deck}`);

  const matches: MatchReport[] = [];
  const p1Stats = { wins: 0, familyStats: emptyFamilyStats() };
  const p2Stats = { wins: 0, familyStats: emptyFamilyStats() };
  const terminations: Record<PlayMatchTermination, number> = {
    "game-won": 0,
    "max-actions-exceeded": 0,
    "concede-failed": 0,
  };
  const winReasons: Record<string, number> = {};

  for (let i = 0; i < options.matches; i++) {
    const seed = `${options.seedBase}-${i}`;
    const { runtime, staticResources } = buildBenchRuntime({
      p1Deck: p1DeckList,
      p2Deck: p2DeckList,
      seed,
    });

    const strategies = new Map<PlayerId, typeof p1Strategy>([
      [PLAYER_ONE, p1Strategy],
      [PLAYER_TWO, p2Strategy],
    ]);

    const start = Date.now();
    const outcome = playMatch(runtime, strategies, staticResources, {
      maxActions: options.maxActions,
      trace: false,
      plannerOptions: {
        decisionSink: (record) => {
          if (record.playerId === PLAYER_ONE) bumpFamily(p1Stats.familyStats, record);
          else if (record.playerId === PLAYER_TWO) bumpFamily(p2Stats.familyStats, record);
        },
      },
    });
    const elapsedMs = Date.now() - start;

    const winner = classifyWinner(outcome);
    if (winner === "p1") p1Stats.wins++;
    else if (winner === "p2") p2Stats.wins++;
    terminations[outcome.termination]++;
    if (outcome.winReason) {
      winReasons[outcome.winReason] = (winReasons[outcome.winReason] ?? 0) + 1;
    }

    matches.push({
      matchId: i,
      seed,
      termination: outcome.termination,
      winner,
      winReason: outcome.winReason,
      turnCount: outcome.turnCount,
      actionCount: outcome.actionCount,
      elapsedMs,
    });
    onProgress?.(i + 1);
  }

  const total = matches.length || 1;
  const avgTurns = matches.reduce((s, m) => s + m.turnCount, 0) / total;
  const avgActions = matches.reduce((s, m) => s + m.actionCount, 0) / total;
  const avgElapsedMs = matches.reduce((s, m) => s + m.elapsedMs, 0) / total;
  const drawRate = (total - p1Stats.wins - p2Stats.wins) / total;

  return {
    version: 1,
    options,
    summary: {
      matches: total,
      p1WinRate: p1Stats.wins / total,
      p2WinRate: p2Stats.wins / total,
      drawRate,
      avgTurns,
      avgActions,
      avgElapsedMs,
      terminationDistribution: terminations,
      winReasonDistribution: winReasons,
    },
    p1: p1Stats,
    p2: p2Stats,
    matches,
    createdAt: new Date().toISOString(),
  };
}

// ── Persistence ────────────────────────────────────────────────────────────────

export function saveReport(report: BenchReport, path: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(report, null, 2), "utf8");
}

export function loadReport(path: string): BenchReport {
  const raw = readFileSync(path, "utf8");
  const parsed = JSON.parse(raw) as { version?: unknown } & BenchReport;
  if (parsed.version !== 1) {
    throw new Error(`Unsupported report version: ${String(parsed.version)}`);
  }
  return parsed;
}
