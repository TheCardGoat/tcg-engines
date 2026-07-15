import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theGlassSlipper } from "./044-the-glass-slipper";

const princeCharacter = createMockCharacter({
  id: "glass-slipper-prince",
  name: "Prince Character",
  cost: 2,
  classifications: ["Storyborn", "Prince"],
});

const princessCard = createMockCharacter({
  id: "glass-slipper-princess",
  name: "Princess Card",
  cost: 2,
  classifications: ["Storyborn", "Princess"],
});

const nonPrinceCharacter = createMockCharacter({
  id: "glass-slipper-non-prince",
  name: "Non-Prince Character",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

const dryingPrinceCharacter = createMockCharacter({
  id: "glass-slipper-drying-prince",
  name: "Drying Prince Character",
  cost: 2,
  classifications: ["Storyborn", "Prince"],
});

describe("The Glass Slipper", () => {
  it("restricts decks to 2 copies (PERFECT PAIR)", () => {
    expect(theGlassSlipper.cardCopyLimit).toBe(2);
  });

  it("banishes itself and exerts your Prince to find a Princess character card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [princessCard],
      play: [theGlassSlipper, { card: princeCharacter, isDrying: false }],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(theGlassSlipper, {
        ability: "SEARCH THE KINGDOM",
        costs: {
          exertCharacters: [princeCharacter],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(theGlassSlipper)).toBe("discard");
    expect(testEngine.asPlayerOne().isExerted(princeCharacter)).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(princessCard)).toBe("hand");
  });

  it("cannot use a non-Prince character to pay the exert cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [princessCard],
      play: [theGlassSlipper, { card: nonPrinceCharacter, isDrying: false }],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(theGlassSlipper, {
        ability: "SEARCH THE KINGDOM",
        costs: {
          exertCharacters: [nonPrinceCharacter],
        },
      }),
    ).not.toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(theGlassSlipper)).toBe("play");
    expect(testEngine.asPlayerOne().isExerted(nonPrinceCharacter)).toBe(false);
  });

  it("cannot use a drying Prince character to pay the exert cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [princessCard],
      play: [theGlassSlipper, { card: dryingPrinceCharacter, isDrying: true }],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(theGlassSlipper, {
        ability: "SEARCH THE KINGDOM",
        costs: {
          exertCharacters: [dryingPrinceCharacter],
        },
      }),
    ).not.toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(theGlassSlipper)).toBe("play");
    expect(testEngine.asPlayerOne().isExerted(dryingPrinceCharacter)).toBe(false);
  });
});
