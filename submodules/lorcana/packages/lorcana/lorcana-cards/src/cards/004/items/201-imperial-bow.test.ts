import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { imperialBow } from "./201-imperial-bow";

const heroArcher = createMockCharacter({
  id: "imperial-bow-hero",
  name: "Hero Archer",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

const evasiveDefender = createMockCharacter({
  id: "imperial-bow-evasive",
  name: "Evasive Defender",
  cost: 2,
  abilities: [
    { id: "imperial-bow-evasive-1", type: "keyword", keyword: "Evasive", text: "Evasive" },
  ],
});

describe("Imperial Bow", () => {
  it("gives the chosen Hero Challenger +2 and Evasive this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 1,
        deck: 1,
        play: [imperialBow, heroArcher],
      },
      {
        deck: 1,
        play: [{ card: evasiveDefender, exerted: true, isDrying: false }],
      },
    );

    expect(testEngine.asPlayerOne().canChallenge(heroArcher, evasiveDefender)).toBe(false);

    expect(
      testEngine.asPlayerOne().activateAbility(imperialBow, {
        targets: [heroArcher],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getKeywordValue(heroArcher, "Challenger")).toBe(2);
    expect(testEngine.asPlayerOne().hasKeyword(heroArcher, "Evasive")).toBe(true);
    expect(testEngine.asPlayerOne().canChallenge(heroArcher, evasiveDefender)).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getKeywordValue(heroArcher, "Challenger")).toBeNull();
    expect(testEngine.asPlayerOne().hasKeyword(heroArcher, "Evasive")).toBe(false);
  });
});
