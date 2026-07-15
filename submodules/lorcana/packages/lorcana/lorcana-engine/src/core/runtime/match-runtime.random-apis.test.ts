import { describe, expect, it } from "bun:test";
import { createInitialTCGCtx, type MatchState } from "./types";
import { createRandomAPIForDraft } from "./match-runtime.random-apis";

function createState(seed: string): MatchState {
  return {
    G: {} as never,
    ctx: createInitialTCGCtx({
      matchID: "match-123",
      gameID: "lorcana",
      rulesetHash: "ruleset-v1",
      seed,
    }),
  };
}

describe("createRandomAPIForDraft", () => {
  it("produces different shuffle results for different same-length seeds", () => {
    const alphaState = createState("seed-a");
    const bravoState = createState("seed-b");

    const alphaRandom = createRandomAPIForDraft(alphaState as never);
    const bravoRandom = createRandomAPIForDraft(bravoState as never);

    const cards = ["a", "b", "c", "d", "e", "f"];

    expect(alphaRandom.shuffle(cards)).not.toEqual(bravoRandom.shuffle(cards));
  });

  it("remains deterministic for the same seed", () => {
    const firstState = createState("repeatable-seed");
    const secondState = createState("repeatable-seed");

    const firstRandom = createRandomAPIForDraft(firstState as never);
    const secondRandom = createRandomAPIForDraft(secondState as never);

    const cards = ["a", "b", "c", "d", "e", "f"];

    expect(firstRandom.shuffle(cards)).toEqual(secondRandom.shuffle(cards));
  });
});
