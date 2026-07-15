import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theGlassSlipperEnchanted } from "./208-the-glass-slipper-enchanted";

const princeCharacter = createMockCharacter({
  id: "glass-slipper-enchanted-prince",
  name: "Prince Character",
  cost: 2,
  classifications: ["Storyborn", "Prince"],
});

const princessCard = createMockCharacter({
  id: "glass-slipper-enchanted-princess",
  name: "Princess Card",
  cost: 2,
  classifications: ["Storyborn", "Princess"],
});

describe("The Glass Slipper Enchanted", () => {
  it("banishes itself and exerts your Prince to find a Princess character card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [princessCard],
      play: [theGlassSlipperEnchanted, { card: princeCharacter, isDrying: false }],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(theGlassSlipperEnchanted, {
        ability: "SEARCH THE KINGDOM",
        costs: {
          exertCharacters: [princeCharacter],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(theGlassSlipperEnchanted)).toBe("discard");
    expect(testEngine.asPlayerOne().isExerted(princeCharacter)).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(princessCard)).toBe("hand");
  });
});
