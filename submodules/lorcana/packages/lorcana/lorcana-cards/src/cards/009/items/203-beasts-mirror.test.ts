import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { beastsMirror } from "./203-beasts-mirror";

const drawnCard = createMockCharacter({
  id: "beasts-mirror-drawn",
  name: "Beast's Mirror Drawn",
  cost: 1,
});

const cardInHand = createMockCharacter({
  id: "beasts-mirror-hand",
  name: "Beast's Mirror Hand",
  cost: 1,
});

describe("Beast's Mirror", () => {
  it("draws a card if your hand is empty", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [drawnCard],
      inkwell: 3,
      play: [beastsMirror],
    });

    expect(testEngine.asPlayerOne().activateAbility(beastsMirror)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(beastsMirror)).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
  });

  it("does not draw if you already have cards in hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cardInHand],
      deck: [drawnCard],
      inkwell: 3,
      play: [beastsMirror],
    });

    const result = testEngine.asPlayerOne().activateAbility(beastsMirror);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("ABILITY_CONDITION_NOT_MET");
    }

    expect(testEngine.asPlayerOne().isExerted(beastsMirror)).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(cardInHand)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
  });
});
