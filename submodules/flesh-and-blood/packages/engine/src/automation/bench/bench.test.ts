import { describe, expect, it } from "vite-plus/test";
import { fleshAndBloodDeckCardLibrary } from "../../../../cards/src/deck-library.ts";
import { diffFabBenchReports } from "./diff.ts";
import { playFabMatch as playFabMatchWithLibrary } from "./play-match.ts";
import { runFabBench as runFabBenchWithLibrary } from "./run.ts";

function playFabMatch(input: Omit<Parameters<typeof playFabMatchWithLibrary>[0], "cardLibrary">) {
  return playFabMatchWithLibrary({ ...input, cardLibrary: fleshAndBloodDeckCardLibrary });
}

function runFabBench(input: Omit<Parameters<typeof runFabBenchWithLibrary>[0], "cardLibrary">) {
  return runFabBenchWithLibrary({ ...input, cardLibrary: fleshAndBloodDeckCardLibrary });
}

describe("playFabMatch", () => {
  it("does not invent value-extract explanations for a policy that does not score moves", () => {
    const played = playFabMatch({
      seed: "trace-policy-source",
      p1Strategy: "first-legal",
      p2Strategy: "first-legal",
      firstPlayer: "p2",
      maxActions: 1,
      snapshotValidation: false,
    });
    expect(played.frames).toHaveLength(1);
    expect(played.frames[0]!.actorId).toBe(played.player2Id);
    expect(played.frames[0]!.considered).toEqual([]);
    expect(played.frames[0]!.chosen.score).toBeNull();
  });
  it("records decision frames until a terminal state", { timeout: 60_000 }, () => {
    const played = playFabMatch({
      seed: "bench-smoke",
      p1Strategy: "first-legal",
      p2Strategy: "pass-only",
      maxActions: 24,
    });
    expect(played.frames.length).toBeGreaterThan(0);
    expect(played.actionCount).toBe(played.frames.length);
    expect(["life", "concede", "max-actions", "stall", "illegal", "engine-throw"]).toContain(
      played.termination,
    );
    expect(played.frames[0]!.hand.length).toBeGreaterThan(0);
    expect(played.frames[0]!.legal.length).toBeGreaterThan(0);
  });

  it(
    "does not stall when a seat can still pass, end the turn, or concede",
    { timeout: 60_000 },
    () => {
      const played = playFabMatch({
        seed: "no-stall-progress",
        p1Strategy: "first-legal",
        p2Strategy: "pass-only",
        maxActions: 40,
      });
      expect(played.termination).not.toBe("stall");
      expect(played.termination).not.toBe("illegal");
      expect(played.termination).not.toBe("engine-throw");
    },
  );

  it(
    "does not spend the converting budget on goldfish-pass combat windows",
    { timeout: 180_000 },
    () => {
      // Chosen-move frames only: goldfish ranking and per-command snapshot
      // admission are not the converting-budget contract and starve CI.
      const played = playFabMatch({
        seed: "improve-kassai-1-0",
        p1Strategy: "hero-profile",
        p2Strategy: "value-extract",
        p1Deck: "cc-las-vegas-1st-kassai",
        p2Deck: "cc-edinburgh-1st-gravy-bones",
        maxActions: 200,
        recordFrames: true,
        considerHeads: 0,
        snapshotValidation: false,
      });
      const passes = played.frames.filter(
        (frame) => frame.chosen.move === "pass" && frame.chosen.label === "Pass",
      ).length;
      expect(played.termination).not.toBe("illegal");
      expect(played.termination).not.toBe("engine-throw");
      expect(played.termination).not.toBe("snapshot-refusal");
      expect(passes).toBeLessThan(80);
    },
  );
});

describe("runFabBench + diff", () => {
  it("is deterministic on the same seed base and diffs as a no-flip", { timeout: 120_000 }, () => {
    const options = {
      p1Strategy: "first-legal",
      p2Strategy: "pass-only",
      p1Deck: "cc-edinburgh-1st-gravy-bones",
      p2Deck: "cc-guilherme-coutinho-rhinar",
      matches: 2,
      seedBase: "bench-det",
      maxActions: 16,
    };
    const first = runFabBench(options);
    const second = runFabBench(options);
    expect(first.matches.map((match) => match.winner)).toEqual(
      second.matches.map((match) => match.winner),
    );
    const delta = diffFabBenchReports(first, second);
    expect(delta.flipped).toBe(0);
    expect(delta.verdict).toBe("inconclusive");
  });
});
