import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theGreatIlluminaryRadiantBallroom } from "./169-the-great-illuminary-radiant-ballroom";

const supportGuest = createMockCharacter({
  id: "ballroom-support",
  name: "Support Guest",
  cost: 2,
  lore: 1,
  willpower: 3,
  abilities: [{ type: "keyword", keyword: "Support", text: "Support" }],
});

const regularGuest = createMockCharacter({
  id: "ballroom-regular",
  name: "Regular Guest",
  cost: 2,
  lore: 1,
  willpower: 3,
});

describe("The Great Illuminary - Radiant Ballroom", () => {
  it("buffs only characters with Support while here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        theGreatIlluminaryRadiantBallroom,
        { card: supportGuest, atLocation: theGreatIlluminaryRadiantBallroom },
        { card: regularGuest, atLocation: theGreatIlluminaryRadiantBallroom },
      ],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().getCard(supportGuest)?.lore).toBe(supportGuest.lore + 1);
    expect(testEngine.asPlayerOne().getCard(supportGuest)?.willpower).toBe(
      supportGuest.willpower + 2,
    );
    expect(testEngine.asPlayerOne().getCard(regularGuest)?.lore).toBe(regularGuest.lore);
    expect(testEngine.asPlayerOne().getCard(regularGuest)?.willpower).toBe(regularGuest.willpower);
  });
});
