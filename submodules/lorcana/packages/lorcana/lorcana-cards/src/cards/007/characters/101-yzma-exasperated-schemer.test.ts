import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { yzmaExasperatedSchemer } from "./101-yzma-exasperated-schemer";

const drawnCard = createMockCharacter({
  id: "yzma-exasperated-schemer-drawn-card",
  name: "Yzma Drawn Card",
  cost: 1,
});

const discardFodder = createMockCharacter({
  id: "yzma-exasperated-schemer-discard-fodder",
  name: "Yzma Discard Fodder",
  cost: 1,
});

describe("Yzma - Exasperated Schemer", () => {
  it("HOW SHALL I DO IT? - may draw a card, then choose and discard a card when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [drawnCard],
      hand: [yzmaExasperatedSchemer, discardFodder],
      inkwell: yzmaExasperatedSchemer.cost,
    });

    expect(testEngine.asPlayerOne().playCard(yzmaExasperatedSchemer)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(yzmaExasperatedSchemer, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);

    const discardFodderId = testEngine.findCardInstanceId(discardFodder, "hand", "player_one");

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [discardFodderId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });
});
