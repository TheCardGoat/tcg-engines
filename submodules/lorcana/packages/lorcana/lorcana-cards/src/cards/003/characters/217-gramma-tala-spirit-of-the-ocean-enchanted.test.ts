import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { donaldDuckFocusedFlatfoot } from "../../005/characters/155-donald-duck-focused-flatfoot";
import { grammaTalaSpiritOfTheOceanEnchanted } from "./217-gramma-tala-spirit-of-the-ocean-enchanted";

const deckInkCard = createMockCharacter({
  id: "gramma-tala-enchanted-deck-ink",
  name: "Deck Ink Card",
  cost: 1,
});

describe("Gramma Tala - Spirit of the Ocean Enchanted", () => {
  it("gains 1 lore when an effect puts a card into your inkwell", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [donaldDuckFocusedFlatfoot],
        inkwell: donaldDuckFocusedFlatfoot.cost,
        play: [grammaTalaSpiritOfTheOceanEnchanted],
        deck: [deckInkCard],
        lore: 0,
      },
      {
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().playCard(donaldDuckFocusedFlatfoot)).toBeSuccessfulCommand();

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(donaldDuckFocusedFlatfoot, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(deckInkCard)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });
});
