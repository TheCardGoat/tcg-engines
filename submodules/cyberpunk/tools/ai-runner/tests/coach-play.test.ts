import { describe, expect, test } from "vite-plus/test";
import { playCoachMatch } from "../src/coach-play.ts";

describe("playCoachMatch", () => {
  test("plays with the shipped chooser and returns moves plus game logs", () => {
    const dump = playCoachMatch({
      strategyA: "first-legal",
      strategyB: "first-legal",
      seed: "coach-play-live",
      deckSource: "test",
      deckLimit: 1,
      deckPairLimit: 1,
      maxSteps: 1500,
    });
    const acted = dump.steps.filter((step) => step.kind === "acted" && step.move);
    expect(acted.length).toBeGreaterThan(0);
    const moveLogs = dump.steps.reduce((n, step) => n + step.moveLogs.length, 0);
    const gameEvents = dump.steps.reduce((n, step) => n + step.gameEvents.length, 0);
    expect(moveLogs).toBeGreaterThan(0);
    expect(gameEvents).toBeGreaterThan(0);
  });

  test("seats a named authored deck instead of the pool's first pair", () => {
    const dump = playCoachMatch({
      strategyA: "first-legal",
      strategyB: "first-legal",
      seed: "named-judy-dump",
      deckSource: "authored-botlab",
      deckAId: "authored-judy-top-deck-discount",
      maxSteps: 1500,
    });
    expect(dump.deckAId).toBe("authored-judy-top-deck-discount");
    expect(dump.deckBId).toBe("authored-judy-top-deck-discount");
    const acted = dump.steps.filter((step) => step.kind === "acted" && step.move);
    expect(acted.length).toBeGreaterThan(0);
    expect(dump.steps.reduce((n, step) => n + step.moveLogs.length, 0)).toBeGreaterThan(0);
    expect(dump.steps.reduce((n, step) => n + step.gameEvents.length, 0)).toBeGreaterThan(0);
  });
});
