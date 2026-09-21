import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { buildCoachDump, type CoachMatchDump } from "@tcg/cyberpunk-engine";

import { runBatch, type BatchOptions } from "./runner.ts";

export interface CoachPlayOptions {
  strategyA: string;
  strategyB: string;
  seed: string;
  maxSteps?: number;
  deckSource?: BatchOptions["deckSource"];
  deckAId?: string;
  deckBId?: string;
  deckLimit?: number;
  deckPairLimit?: number;
}

/**
 * Play one seeded match with the shipped chooser and return the coach dump
 * (moves + engine game logs). The LLM does not pick moves.
 */
export function playCoachMatch(opts: CoachPlayOptions): CoachMatchDump {
  const summary = runBatch({
    strategyA: opts.strategyA,
    strategyB: opts.strategyB,
    matches: 1,
    seed: opts.seed,
    maxSteps: opts.maxSteps,
    deckSource: opts.deckSource,
    deckAId: opts.deckAId,
    deckBId: opts.deckBId,
    deckLimit: opts.deckLimit ?? 2,
    deckPairLimit: opts.deckPairLimit ?? 1,
  });
  const first = summary.firstMatch;
  if (!first) throw new Error("playCoachMatch: no match was captured");
  return buildCoachDump(first, {
    seed: first.seed,
    strategyA: opts.strategyA,
    strategyB: opts.strategyB,
    deckAId: first.failure.deckAId,
    deckBId: first.failure.deckBId,
  });
}

export function writeCoachDump(path: string, dump: CoachMatchDump): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(dump, null, 2)}\n`, "utf8");
}

export function readCoachDump(path: string): CoachMatchDump {
  return JSON.parse(readFileSync(path, "utf8")) as CoachMatchDump;
}
