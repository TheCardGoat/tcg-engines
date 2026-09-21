import { describe, expect, test } from "vite-plus/test";
import { buildCoachDump, firstLegalStrategy, runAutoMatch } from "../../src/automation/index.ts";
import { createTestCatalog, createTestDecks, createTestPlayers } from "./fixtures.ts";

describe("buildCoachDump", () => {
  test("captures per-step moves and engine game logs from a live auto-match", () => {
    const seed = "coach-dump-live";
    const result = runAutoMatch({
      players: createTestPlayers(),
      decks: createTestDecks(),
      strategies: [firstLegalStrategy, firstLegalStrategy],
      catalog: createTestCatalog(),
      seed,
      maxSteps: 1500,
    });
    const dump = buildCoachDump(result, {
      seed,
      strategyA: "first-legal",
      strategyB: "first-legal",
    });

    const acted = dump.steps.filter((step) => step.kind === "acted" && step.move);
    expect(acted.length).toBeGreaterThan(0);

    const moveLogCount = dump.steps.reduce((total, step) => total + step.moveLogs.length, 0);
    const gameEventCount = dump.steps.reduce((total, step) => total + step.gameEvents.length, 0);
    expect(moveLogCount).toBeGreaterThan(0);
    expect(gameEventCount).toBeGreaterThan(0);

    const loggedMoves = new Set(dump.steps.flatMap((step) => step.moveLogs.map((log) => log.type)));
    expect(loggedMoves.size).toBeGreaterThan(0);
    const eventTypes = new Set(
      dump.steps.flatMap((step) => step.gameEvents.map((event) => event.type)),
    );
    expect(eventTypes.size).toBeGreaterThan(0);
  });
});
