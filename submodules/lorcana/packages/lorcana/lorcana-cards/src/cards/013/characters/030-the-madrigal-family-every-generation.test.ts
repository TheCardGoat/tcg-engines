import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { magicGoldenFlower } from "../../001/items/169-magic-golden-flower";
import { theMadrigalFamilyEveryGeneration } from "./030-the-madrigal-family-every-generation";

const damagedMadrigalAlly = createMockCharacter({
  id: "madrigal-family-damaged-ally",
  name: "Damaged Madrigal Ally",
  cost: 2,
  willpower: 5,
  classifications: ["Storyborn", "Ally", "Madrigal"],
});

const blessingDeckCard = createMockCharacter({
  id: "madrigal-family-blessing-deck-card",
  name: "Blessing Deck Card",
  cost: 1,
});

describe("The Madrigal Family - Every Generation", () => {
  it("can be played with Madrigal Shift 3", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [theMadrigalFamilyEveryGeneration],
      inkwell: 3,
      play: [damagedMadrigalAlly],
    });

    const shiftTarget = testEngine.findCardInstanceId(damagedMadrigalAlly, "play");

    expect(
      testEngine.asPlayerOne().playCard(theMadrigalFamilyEveryGeneration, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(theMadrigalFamilyEveryGeneration)).toBe("play");
  });

  it("puts the top card of your deck into your inkwell when you heal one of your characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        theMadrigalFamilyEveryGeneration,
        { card: damagedMadrigalAlly, damage: 2 },
        magicGoldenFlower,
      ],
      deck: [blessingDeckCard],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(magicGoldenFlower, {
        targets: [damagedMadrigalAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(blessingDeckCard)).toBe("inkwell");
  });
});
