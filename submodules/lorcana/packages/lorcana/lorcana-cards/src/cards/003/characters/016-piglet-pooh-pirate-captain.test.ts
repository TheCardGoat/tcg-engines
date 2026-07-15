import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pigletPoohPirateCaptain } from "./016-piglet-pooh-pirate-captain";

const pirateMate = createMockCharacter({
  id: "piglet-pirate-mate",
  name: "Pirate Mate",
  cost: 2,
  lore: 1,
});

const pirateMateTwo = createMockCharacter({
  id: "piglet-pirate-mate-two",
  name: "Pirate Mate Two",
  cost: 2,
  lore: 1,
});

describe("Piglet - Pooh Pirate Captain", () => {
  it("gets +2 lore while you have 2 or more other characters in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: pirateMateTwo.cost,
      hand: [pirateMateTwo],
      play: [pigletPoohPirateCaptain, pirateMate],
    });

    expect(testEngine.asPlayerOne().getCardLore(pigletPoohPirateCaptain)).toBe(
      pigletPoohPirateCaptain.lore,
    );

    expect(testEngine.asPlayerOne().playCard(pirateMateTwo)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardLore(pigletPoohPirateCaptain)).toBe(
      pigletPoohPirateCaptain.lore + 2,
    );
    expect(testEngine.asPlayerOne().getCardLore(pirateMate)).toBe(pirateMate.lore);
    expect(testEngine.asPlayerOne().getCardLore(pirateMateTwo)).toBe(pirateMateTwo.lore);
  });
});
