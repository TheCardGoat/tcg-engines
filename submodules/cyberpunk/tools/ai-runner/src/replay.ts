import { writeFileSync, readFileSync } from "node:fs";
import {
  monteCarloStrategy,
  monteCarloGreedyStrategy,
  firstLegalStrategy,
  greedyStrategy,
  randomStrategy,
  runAutoMatch,
  type AIStrategy,
  type AutoMatchResult,
} from "@tcg/cyberpunk-engine";
import { createTestCatalog, createTestDecks, createTestPlayers } from "./test-catalog.ts";
import { createRealCatalog, createRealDecks } from "./real-catalog.ts";

/**
 * Persistent record of a single match run. Includes everything needed to
 * replay the match deterministically: strategy names, seed, deck source,
 * and the per-step decision log with the stateID at each acted step.
 */
export interface MatchRecording {
  version: 1;
  strategyA: string;
  strategyB: string;
  seed: string;
  realCards: boolean;
  /** Step cap the original run used. Replays must use the same cap or determinism comparisons go off-rails. */
  maxSteps?: number;
  result: {
    winnerId: string | null;
    reason: AutoMatchResult["reason"];
    turnCount: number;
    stepCount: number;
  };
  /** Per-step compact projection: only data needed for replay verification. */
  steps: ReplayStep[];
}

export interface ReplayStep {
  stepIndex: number;
  playerId: string;
  kind: "acted" | "idle" | "stuck" | "illegal";
  /** For acted/illegal: the move that was attempted. */
  move?: string;
  args?: Record<string, unknown>;
  /** For acted: the engine's stateID after applying the command. */
  stateID?: number;
  /** For stuck/illegal: human-readable reason or error. */
  reason?: string;
}

const REPLAY_STRATEGIES: Record<string, AIStrategy> = {
  "first-legal": firstLegalStrategy,
  random: randomStrategy,
  greedy: greedyStrategy,
  "monte-carlo:random": monteCarloStrategy,
  "monte-carlo:greedy": monteCarloGreedyStrategy,
  // Convenience aliases for the canonical strategy names.
  "monte-carlo": monteCarloStrategy,
  "monte-carlo-greedy": monteCarloGreedyStrategy,
};

function lookupReplayStrategy(name: string): AIStrategy {
  const s = REPLAY_STRATEGIES[name];
  if (!s) throw new Error(`Replay can't find strategy: ${name}`);
  return s;
}

/** Project a `runAutoMatch` result into the wire format saved on disk. */
export function buildRecording(opts: {
  result: AutoMatchResult;
  strategyA: string;
  strategyB: string;
  seed: string;
  realCards: boolean;
  maxSteps?: number;
}): MatchRecording {
  return {
    version: 1,
    strategyA: opts.strategyA,
    strategyB: opts.strategyB,
    seed: opts.seed,
    realCards: opts.realCards,
    maxSteps: opts.maxSteps,
    result: {
      winnerId: opts.result.winnerId,
      reason: opts.result.reason,
      turnCount: opts.result.turnCount,
      stepCount: opts.result.stepCount,
    },
    steps: opts.result.log.map((entry) => {
      const r = entry.result;
      const base: ReplayStep = {
        stepIndex: entry.stepIndex,
        playerId: entry.playerId,
        kind: r.kind,
      };
      if (r.kind === "acted") {
        base.move = r.decision.move;
        base.args = r.decision.args;
        base.stateID = r.stateID;
      } else if (r.kind === "illegal") {
        base.move = r.decision.move;
        base.args = r.decision.args;
        base.reason = `${r.errorCode}: ${r.error}`;
      } else if (r.kind === "stuck") {
        base.reason = r.reason;
      } else if (r.kind === "idle") {
        base.reason = r.reason;
      }
      return base;
    }),
  };
}

export function saveRecording(path: string, recording: MatchRecording): void {
  writeFileSync(path, JSON.stringify(recording, null, 2), "utf8");
}

export function loadRecording(path: string): MatchRecording {
  const raw = readFileSync(path, "utf8");
  const parsed = JSON.parse(raw) as MatchRecording;
  if (parsed.version !== 1) {
    throw new Error("Unsupported recording version");
  }
  return parsed;
}

export interface ReplayDivergence {
  stepIndex: number;
  field: "kind" | "move" | "args" | "stateID";
  expected: unknown;
  actual: unknown;
}

export interface ReplayResult {
  matched: boolean;
  divergences: ReplayDivergence[];
  totalSteps: number;
}

/**
 * Replay a saved recording: run the harness with the same seed/strategies/
 * decks, then walk the new log step-by-step and compare against the
 * recording. Reports any divergence (step kind, attempted move, or
 * resulting stateID) so determinism regressions are caught.
 */
export function replayRecording(recording: MatchRecording): ReplayResult {
  const strategyA = lookupReplayStrategy(recording.strategyA);
  const strategyB = lookupReplayStrategy(recording.strategyB);
  const result = runAutoMatch({
    players: createTestPlayers(),
    decks: recording.realCards ? createRealDecks() : createTestDecks(),
    strategies: [strategyA, strategyB],
    catalog: recording.realCards ? createRealCatalog() : createTestCatalog(),
    seed: recording.seed,
    maxSteps: recording.maxSteps,
  });

  const divergences: ReplayDivergence[] = [];
  const len = Math.min(result.log.length, recording.steps.length);
  for (let i = 0; i < len; i++) {
    const live = result.log[i]!;
    const recorded = recording.steps[i]!;
    if (live.result.kind !== recorded.kind) {
      divergences.push({
        stepIndex: i,
        field: "kind",
        expected: recorded.kind,
        actual: live.result.kind,
      });
      continue;
    }
    if (live.result.kind === "acted" && recorded.kind === "acted") {
      if (live.result.decision.move !== recorded.move) {
        divergences.push({
          stepIndex: i,
          field: "move",
          expected: recorded.move,
          actual: live.result.decision.move,
        });
      }
      if (!argsEqual(live.result.decision.args, recorded.args)) {
        divergences.push({
          stepIndex: i,
          field: "args",
          expected: recorded.args,
          actual: live.result.decision.args,
        });
      }
      if (live.result.stateID !== recorded.stateID) {
        divergences.push({
          stepIndex: i,
          field: "stateID",
          expected: recorded.stateID,
          actual: live.result.stateID,
        });
      }
    }
  }

  return {
    matched: divergences.length === 0 && result.log.length === recording.steps.length,
    divergences,
    totalSteps: len,
  };
}

/**
 * Deep-equal `args` payloads via stable JSON serialisation. Args objects
 * carry only primitive fields and string arrays today (move ids referenced
 * by command envelopes), so `JSON.stringify` with key-sorted serialisation
 * is sufficient. Treats `undefined` and `{}` as equal — the engine
 * normalises args before validation, so empty-vs-undefined isn't a real
 * divergence.
 */
function argsEqual(
  a: Record<string, unknown> | undefined,
  b: Record<string, unknown> | undefined,
): boolean {
  const norm = (x: Record<string, unknown> | undefined): string => {
    if (!x || Object.keys(x).length === 0) return "";
    return JSON.stringify(x, Object.keys(x).sort());
  };
  return norm(a) === norm(b);
}
