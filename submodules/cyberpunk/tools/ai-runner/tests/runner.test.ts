import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vite-plus/test";
import { runAutoMatch, firstLegalStrategy, randomStrategy } from "@tcg/cyberpunk-engine";
import { listStrategies, runBatch, runBatchParallel, runTournament } from "../src/runner.ts";
import { createRealDeckList } from "../src/real-catalog.ts";
import { createTestCatalog, createTestDecks, createTestPlayers } from "../src/test-catalog.ts";
import { buildRecording, loadRecording, replayRecording, saveRecording } from "../src/replay.ts";

describe("runBatch", () => {
  test("plays a small batch without illegal moves", () => {
    const summary = runBatch({
      strategyA: "first-legal",
      strategyB: "random",
      matches: 5,
      seed: "smoke",
      maxSteps: 1500,
    });

    expect(summary.matches).toBe(5);
    expect(summary.illegalCount).toBe(0);
    expect(summary.reasonCounts.illegal).toBe(0);
    // Some kind of conclusion was reached for every match.
    const total = Object.values(summary.reasonCounts).reduce((s, n) => s + n, 0);
    expect(total).toBe(5);
  });

  test("greedy vs random plays a match", () => {
    const summary = runBatch({
      strategyA: "greedy",
      strategyB: "random",
      matches: 3,
      seed: "smoke-greedy",
      maxSteps: 1500,
    });
    expect(summary.illegalCount).toBe(0);
  });

  test("captures the first match for verbose dumping", () => {
    const summary = runBatch({
      strategyA: "first-legal",
      strategyB: "random",
      matches: 2,
      seed: "smoke-verbose",
      maxSteps: 1500,
    });
    expect(summary.firstMatch).toBeDefined();
    expect(summary.firstMatch?.seed).toBe("smoke-verbose/match-0");
    expect(summary.firstMatch?.log.length).toBeGreaterThan(0);
    // Nothing failed in this run.
    expect(summary.firstFailingMatch).toBeUndefined();
  });
});

describe("runTournament", () => {
  test("runs every pairing of the requested strategies", () => {
    const strategies = ["first-legal", "random"];
    const summary = runTournament({
      strategies,
      matches: 2,
      seed: "tourney-smoke",
      maxSteps: 1500,
    });
    // 2 strategies × 2 = 4 cells (including mirror matchups)
    expect(summary.cells).toHaveLength(4);
    expect(summary.totalMatches).toBe(8);
    expect(summary.totalIllegal).toBe(0);
    expect(Object.keys(summary.totalWinsByStrategy).sort()).toEqual(strategies.slice().sort());
  });

  test("listStrategies surfaces the registered names", () => {
    const names = listStrategies();
    expect(names).toContain("first-legal");
    expect(names).toContain("random");
    expect(names).toContain("greedy");
  });
});

describe("runBatch with real cards", () => {
  test("plays a small batch with @tcg/cyberpunk-cards decks", () => {
    const summary = runBatch({
      strategyA: "greedy",
      strategyB: "random",
      matches: 2,
      seed: "real-cards-smoke",
      maxSteps: 1500,
      realCards: true,
    });
    expect(summary.illegalCount).toBe(0);
    expect(summary.reasonCounts.illegal).toBe(0);
  });
});

describe("runBatchParallel", () => {
  test("produces a merged summary equivalent to runBatch (matches per chunk × N)", async () => {
    const summary = await runBatchParallel(
      {
        strategyA: "first-legal",
        strategyB: "random",
        matches: 8,
        seed: "parallel-smoke",
        maxSteps: 1500,
      },
      2,
    );
    expect(summary.matches).toBe(8);
    expect(summary.illegalCount).toBe(0);
    const totalReasons = Object.values(summary.reasonCounts).reduce((s, n) => s + n, 0);
    expect(totalReasons).toBe(8);
  }, 20_000);

  test("falls back to single-process when matches < workers * 2", async () => {
    const summary = await runBatchParallel(
      {
        strategyA: "first-legal",
        strategyB: "random",
        matches: 1,
        seed: "parallel-fallback",
        maxSteps: 1500,
      },
      4,
    );
    expect(summary.matches).toBe(1);
  });
});

describe("createRealDeckList", () => {
  test("builds a 40-card deck with 3 legends", () => {
    const deck = createRealDeckList("p1");
    expect(deck.legends).toHaveLength(3);
    expect(deck.mainDeck).toHaveLength(40);
    // Each legend slug must be unique.
    expect(new Set(deck.legends).size).toBe(3);
  });

  test("two players get identical deck composition", () => {
    const a = createRealDeckList("p1");
    const b = createRealDeckList("p2");
    expect(a.legends).toEqual(b.legends);
    expect(a.mainDeck).toEqual(b.mainDeck);
  });

  test("deck is deterministic across calls", () => {
    const first = createRealDeckList("p1");
    const second = createRealDeckList("p1");
    expect(first.mainDeck).toEqual(second.mainDeck);
  });
});

describe("replay tool", () => {
  test("saved recording replays bit-for-bit identical", () => {
    const result = runAutoMatch({
      players: createTestPlayers(),
      decks: createTestDecks(),
      strategies: [firstLegalStrategy, randomStrategy],
      catalog: createTestCatalog(),
      seed: "replay-test/match-0",
    });

    const recording = buildRecording({
      result,
      strategyA: "first-legal",
      strategyB: "random",
      seed: "replay-test/match-0",
      realCards: false,
    });

    const dir = mkdtempSync(join(tmpdir(), "ai-runner-replay-"));
    const path = join(dir, "match.json");
    saveRecording(path, recording);

    const reloaded = loadRecording(path);
    expect(reloaded.strategyA).toBe("first-legal");
    expect(reloaded.steps).toEqual(recording.steps);

    const replay = replayRecording(reloaded);
    expect(replay.matched).toBe(true);
    expect(replay.divergences).toEqual([]);
    expect(replay.totalSteps).toBe(recording.steps.length);
  });

  test("preserves maxSteps round-trip", () => {
    const result = runAutoMatch({
      players: createTestPlayers(),
      decks: createTestDecks(),
      strategies: [firstLegalStrategy, randomStrategy],
      catalog: createTestCatalog(),
      seed: "replay-maxsteps/match-0",
      maxSteps: 100,
    });

    const recording = buildRecording({
      result,
      strategyA: "first-legal",
      strategyB: "random",
      seed: "replay-maxsteps/match-0",
      realCards: false,
      maxSteps: 100,
    });
    expect(recording.maxSteps).toBe(100);

    const dir = mkdtempSync(join(tmpdir(), "ai-runner-replay-maxsteps-"));
    const path = join(dir, "match.json");
    saveRecording(path, recording);
    const reloaded = loadRecording(path);
    expect(reloaded.maxSteps).toBe(100);

    // Replay must use the recorded cap; otherwise determinism would diverge.
    const replay = replayRecording(reloaded);
    expect(replay.matched).toBe(true);
  });

  test("flags args divergence when commands differ", () => {
    // Build a baseline recording, then mutate one step's args and verify
    // the divergence detector catches it. This protects the "args" branch
    // we just added against silent regressions.
    const result = runAutoMatch({
      players: createTestPlayers(),
      decks: createTestDecks(),
      strategies: [firstLegalStrategy, randomStrategy],
      catalog: createTestCatalog(),
      seed: "replay-args/match-0",
    });
    const recording = buildRecording({
      result,
      strategyA: "first-legal",
      strategyB: "random",
      seed: "replay-args/match-0",
      realCards: false,
    });
    // Find the first acted step and mutate its args so live != recorded.
    const actedIdx = recording.steps.findIndex((s) => s.kind === "acted");
    if (actedIdx === -1) return; // bail if no acted steps
    recording.steps[actedIdx]!.args = { sentinelMutationForTest: true };

    const replay = replayRecording(recording);
    expect(replay.matched).toBe(false);
    expect(replay.divergences.some((d) => d.field === "args")).toBe(true);
  });
});
