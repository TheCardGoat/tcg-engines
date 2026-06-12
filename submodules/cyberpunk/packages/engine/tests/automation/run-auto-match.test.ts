import { describe, expect, test } from "vite-plus/test";
import {
  firstLegalStrategy,
  randomStrategy,
  runAutoMatch,
  type AutoMatchResult,
} from "../../src/automation/index.ts";
import { createTestCatalog, createTestDecks, createTestPlayers } from "./fixtures.ts";

function run(seed: string, strategies: Parameters<typeof runAutoMatch>[0]["strategies"]) {
  return runAutoMatch({
    players: createTestPlayers(),
    decks: createTestDecks(),
    strategies,
    catalog: createTestCatalog(),
    seed,
    maxSteps: 1500,
  });
}

function expectResultIsClean(result: AutoMatchResult, seed: string) {
  // The harness must always return one of these reasons. Anything else means
  // a strategy or engine bug we should investigate.
  expect(
    ["winCondition", "concede", "deckOut", "maxSteps", "stuck"].includes(result.reason),
    `seed=${seed} reason=${result.reason}`,
  ).toBe(true);
  // Illegal moves are *always* a bug — strategies must never craft a move the
  // engine rejects when the boundary types are honoured.
  expect(result.reason).not.toBe("illegal");
  for (const entry of result.log) {
    expect(entry.result.kind).not.toBe("illegal");
  }
}

describe("runAutoMatch", () => {
  test("first-legal vs first-legal terminates", () => {
    const result = run("first-vs-first", [firstLegalStrategy, firstLegalStrategy]);
    expectResultIsClean(result, "first-vs-first");
    expect(result.log.length).toBeGreaterThan(0);
  });

  test("random vs random terminates across multiple seeds", () => {
    const seeds = ["s1", "s2", "s3"];
    for (const seed of seeds) {
      const result = run(seed, [randomStrategy, randomStrategy]);
      expectResultIsClean(result, seed);
    }
  });

  test("random vs first-legal terminates", () => {
    const result = run("rand-vs-first", [randomStrategy, firstLegalStrategy]);
    expectResultIsClean(result, "rand-vs-first");
  });
});
