import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rapunzelTowerDefender } from "./080-rapunzel-tower-defender";

const discardFodder = createMockCharacter({
  id: "rapunzel-tower-defender-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
});

const opposingCharacter = createMockCharacter({
  id: "rapunzel-tower-defender-opposing-character",
  name: "Opposing Character",
  cost: 2,
});

describe("Rapunzel - Tower Defender", () => {
  it("discards a card and returns a chosen character to their player's hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [rapunzelTowerDefender, discardFodder],
        inkwell: rapunzelTowerDefender.cost,
      },
      {
        play: [opposingCharacter],
      },
    );

    expect(testEngine.asPlayerOne().playCard(rapunzelTowerDefender)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(rapunzelTowerDefender, {
        resolveOptional: true,
        targets: [discardFodder, opposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(opposingCharacter)).toBe("hand");
  });
});
