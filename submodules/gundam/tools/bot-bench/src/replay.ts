import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

import {
  playMatch,
  type BotDecisionAttempt,
  type GundamBotCandidate,
  type PlayMatchTermination,
  type PlayerId,
} from "@tcg/gundam-engine";

import { buildBenchRuntime, PLAYER_ONE, PLAYER_TWO, REGISTERED_DECKS } from "./runtime.ts";
import type { SharedBenchOptions } from "./run.ts";
import { REGISTERED_STRATEGIES } from "./strategies.ts";

export interface ReplayOptions extends SharedBenchOptions {}

export interface ReplayAction {
  readonly actionIndex: number;
  readonly playerId: string;
  readonly outcome: string;
  readonly selectedCandidate?: GundamBotCandidate;
  readonly attemptDetails: readonly BotDecisionAttempt[];
  readonly stateIdBefore: number;
  readonly stateIdAfter: number;
}

export interface ReplayMatch {
  readonly matchId: number;
  readonly seed: string;
  readonly termination: PlayMatchTermination;
  readonly winner: string | null;
  readonly winReason: string | null;
  readonly actionCount: number;
  readonly turnCount: number;
  readonly actions: readonly ReplayAction[];
}

export interface BenchReplay {
  readonly version: 1;
  readonly options: ReplayOptions;
  readonly matches: readonly ReplayMatch[];
}

export interface ReplayDivergence {
  readonly matchId: number;
  readonly actionIndex: number;
  readonly field:
    | "match-count"
    | "actionsLength"
    | "termination"
    | "winner"
    | "winReason"
    | "actionCount"
    | "turnCount"
    | "playerId"
    | "outcome"
    | "selectedCandidate"
    | "attemptDetails"
    | "stateIdBefore"
    | "stateIdAfter";
  readonly expected: unknown;
  readonly actual: unknown;
}

export interface ReplayVerification {
  readonly matched: boolean;
  readonly divergences: readonly ReplayDivergence[];
}

export function buildReplay(options: ReplayOptions): BenchReplay {
  const matches: ReplayMatch[] = [];
  for (let i = 0; i < options.matches; i++) {
    matches.push(runReplayMatch(options, i));
  }
  return { version: 1, options, matches };
}

export function verifyReplay(replay: BenchReplay): ReplayVerification {
  const live = buildReplay(replay.options);
  const divergences: ReplayDivergence[] = [];

  if (live.matches.length !== replay.matches.length) {
    divergences.push({
      matchId: -1,
      actionIndex: -1,
      field: "match-count",
      expected: replay.matches.length,
      actual: live.matches.length,
    });
  }

  const matchCount = Math.min(live.matches.length, replay.matches.length);
  for (let i = 0; i < matchCount; i++) {
    compareMatch(replay.matches[i]!, live.matches[i]!, divergences);
  }

  return { matched: divergences.length === 0, divergences };
}

export function saveReplay(path: string, replay: BenchReplay): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(replay, null, 2), "utf8");
}

export function loadReplay(path: string): BenchReplay {
  const raw = readFileSync(path, "utf8");
  const parsed = JSON.parse(raw) as BenchReplay;
  if (parsed.version !== 1) {
    throw new Error(`Unsupported replay version: ${String(parsed.version)}`);
  }
  return parsed;
}

function runReplayMatch(options: ReplayOptions, matchId: number): ReplayMatch {
  const p1Strategy = REGISTERED_STRATEGIES[options.p1Strategy];
  const p2Strategy = REGISTERED_STRATEGIES[options.p2Strategy];
  const p1Deck = REGISTERED_DECKS[options.p1Deck];
  const p2Deck = REGISTERED_DECKS[options.p2Deck];
  if (!p1Strategy) throw new Error(`Unknown p1Strategy: ${options.p1Strategy}`);
  if (!p2Strategy) throw new Error(`Unknown p2Strategy: ${options.p2Strategy}`);
  if (!p1Deck) throw new Error(`Unknown p1Deck: ${options.p1Deck}`);
  if (!p2Deck) throw new Error(`Unknown p2Deck: ${options.p2Deck}`);

  const seed = `${options.seedBase}-${matchId}`;
  const { runtime, staticResources } = buildBenchRuntime({
    p1Deck,
    p2Deck,
    seed,
  });
  const strategies = new Map<PlayerId, typeof p1Strategy>([
    [PLAYER_ONE, p1Strategy],
    [PLAYER_TWO, p2Strategy],
  ]);
  const actions: ReplayAction[] = [];
  const outcome = playMatch(runtime, strategies, staticResources, {
    maxActions: options.maxActions,
    trace: false,
    onAction: (action, plannerResult) => {
      actions.push({
        actionIndex: actions.length,
        playerId: String(action.playerId),
        outcome: action.outcome,
        ...(action.selectedCandidate ? { selectedCandidate: action.selectedCandidate } : {}),
        attemptDetails: plannerResult.attemptDetails,
        stateIdBefore: action.stateIdBefore,
        stateIdAfter: action.stateIdAfter,
      });
    },
  });

  return {
    matchId,
    seed,
    termination: outcome.termination,
    winner: outcome.winner ? String(outcome.winner) : null,
    winReason: outcome.winReason,
    actionCount: outcome.actionCount,
    turnCount: outcome.turnCount,
    actions,
  };
}

function compareMatch(
  expected: ReplayMatch,
  actual: ReplayMatch,
  divergences: ReplayDivergence[],
): void {
  compareField(expected, actual, "termination", divergences);
  compareField(expected, actual, "winner", divergences);
  compareField(expected, actual, "winReason", divergences);
  compareField(expected, actual, "actionCount", divergences);
  compareField(expected, actual, "turnCount", divergences);
  if (expected.actions.length !== actual.actions.length) {
    divergences.push({
      matchId: expected.matchId,
      actionIndex: -1,
      field: "actionsLength",
      expected: expected.actions.length,
      actual: actual.actions.length,
    });
  }

  const actionCount = Math.min(expected.actions.length, actual.actions.length);
  for (let i = 0; i < actionCount; i++) {
    const e = expected.actions[i]!;
    const a = actual.actions[i]!;
    compareActionField(expected.matchId, i, e, a, "playerId", divergences);
    compareActionField(expected.matchId, i, e, a, "outcome", divergences);
    compareActionField(expected.matchId, i, e, a, "selectedCandidate", divergences);
    compareActionField(expected.matchId, i, e, a, "attemptDetails", divergences);
    compareActionField(expected.matchId, i, e, a, "stateIdBefore", divergences);
    compareActionField(expected.matchId, i, e, a, "stateIdAfter", divergences);
  }
}

function compareField(
  expected: ReplayMatch,
  actual: ReplayMatch,
  field: "termination" | "winner" | "winReason" | "actionCount" | "turnCount",
  divergences: ReplayDivergence[],
): void {
  if (expected[field] === actual[field]) return;
  divergences.push({
    matchId: expected.matchId,
    actionIndex: -1,
    field,
    expected: expected[field],
    actual: actual[field],
  });
}

function compareActionField<K extends keyof ReplayAction>(
  matchId: number,
  actionIndex: number,
  expected: ReplayAction,
  actual: ReplayAction,
  field: K,
  divergences: ReplayDivergence[],
): void {
  if (stableStringify(expected[field]) === stableStringify(actual[field])) return;
  divergences.push({
    matchId,
    actionIndex,
    field: field as ReplayDivergence["field"],
    expected: expected[field],
    actual: actual[field],
  });
}

function stableStringify(value: unknown): string {
  if (value === undefined) return "undefined";
  return JSON.stringify(value, (_key, v: unknown) => {
    if (!v || typeof v !== "object" || Array.isArray(v)) return v;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(v).sort()) out[key] = (v as Record<string, unknown>)[key];
    return out;
  });
}
