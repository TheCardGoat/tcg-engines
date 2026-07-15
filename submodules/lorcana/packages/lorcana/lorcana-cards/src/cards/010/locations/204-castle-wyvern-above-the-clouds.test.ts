import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { castleWyvernAboveTheClouds } from "./204-castle-wyvern-above-the-clouds";

const wyvernDefender = createMockCharacter({
  id: "wyvern-defender",
  name: "Wyvern Defender",
  cost: 3,
  strength: 2,
  willpower: 5,
});

const wyvernTarget = createMockCharacter({
  id: "wyvern-target",
  name: "Wyvern Target",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("Castle Wyvern - Above the Clouds", () => {
  it("gives characters here Challenger +1 and Resist +1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          castleWyvernAboveTheClouds,
          { card: wyvernDefender, atLocation: castleWyvernAboveTheClouds },
        ],
        deck: 1,
      },
      {
        play: [{ card: wyvernTarget, exerted: true }],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().getKeywordValue(wyvernDefender, "Challenger")).toBe(1);
    expect(testEngine.asPlayerOne().getKeywordValue(wyvernDefender, "Resist")).toBe(1);
    expect(
      testEngine.asPlayerOne().challenge(wyvernDefender, wyvernTarget),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(wyvernTarget)).toBe("discard");
  });
});
