import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { beastsMirror } from "./201-beasts-mirror";

const drawnCard = createMockCharacter({
  id: "beasts-mirror-drawn",
  name: "Drawn Card",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const cardInHand = createMockCharacter({
  id: "beasts-mirror-in-hand",
  name: "Card In Hand",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Beast's Mirror", () => {
  it("draws a card when you have no cards in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [],
      deck: [drawnCard],
      inkwell: 3,
      play: [beastsMirror],
    });

    expect(testEngine.asPlayerOne().activateAbility(beastsMirror)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(beastsMirror)).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
  });

  it("cannot activate SHOW ME when you have cards in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cardInHand],
      deck: [drawnCard],
      inkwell: 3,
      play: [beastsMirror],
    });

    expect(testEngine.asPlayerOne().activateAbility(beastsMirror).success).toBe(false);

    expect(testEngine.asPlayerOne().isExerted(beastsMirror)).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
  });
});
