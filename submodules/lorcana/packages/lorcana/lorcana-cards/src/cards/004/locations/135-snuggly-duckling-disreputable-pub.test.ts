import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { snugglyDucklingDisreputablePub } from "./135-snuggly-duckling-disreputable-pub";

const pubBruiser = createMockCharacter({
  id: "pub-bruiser",
  name: "Pub Bruiser",
  cost: 3,
  strength: 6,
  willpower: 5,
});

const pubTarget = createMockCharacter({
  id: "pub-target",
  name: "Pub Target",
  cost: 2,
  strength: 1,
  willpower: 3,
});

describe("Snuggly Duckling - Disreputable Pub", () => {
  it("gains 3 lore when a 6-strength character challenges from here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          snugglyDucklingDisreputablePub,
          { card: pubBruiser, atLocation: snugglyDucklingDisreputablePub },
        ],
        deck: 1,
      },
      {
        play: [{ card: pubTarget, exerted: true }],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().challenge(pubBruiser, pubTarget)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(3);
  });
});
