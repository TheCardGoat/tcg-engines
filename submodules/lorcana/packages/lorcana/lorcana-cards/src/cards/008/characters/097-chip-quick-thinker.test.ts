import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { chipQuickThinker } from "./097-chip-quick-thinker";

const opponentHandCard1 = createMockCharacter({
  id: "chip-quick-thinker-opponent-hand-1",
  name: "Opponent Hand Card 1",
  cost: 1,
});

const opponentHandCard2 = createMockCharacter({
  id: "chip-quick-thinker-opponent-hand-2",
  name: "Opponent Hand Card 2",
  cost: 1,
});

describe("Chip - Quick Thinker", () => {
  it("makes the chosen opponent discard a card when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [chipQuickThinker],
        inkwell: chipQuickThinker.cost,
      },
      {
        hand: [opponentHandCard1, opponentHandCard2],
      },
    );

    expect(testEngine.asPlayerOne().playCard(chipQuickThinker)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().respondWith(opponentHandCard1)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(opponentHandCard1)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(opponentHandCard2)).toBe("hand");
  });
});
