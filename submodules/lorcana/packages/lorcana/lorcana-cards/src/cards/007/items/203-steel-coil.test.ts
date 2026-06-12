import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { steelCoil } from "./203-steel-coil";

const inkCard = createMockCharacter({
  id: "steel-coil-ink-card",
  name: "Steel Coil Ink Card",
  cost: 1,
});

const drawnCard = createMockCharacter({
  id: "steel-coil-drawn-card",
  name: "Steel Coil Drawn Card",
  cost: 1,
});

const discardFodder = createMockCharacter({
  id: "steel-coil-discard-fodder",
  name: "Steel Coil Discard Fodder",
  cost: 1,
});

describe("Steel Coil", () => {
  it("may draw a card, then choose and discard a card when you ink a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [drawnCard],
      hand: [inkCard, discardFodder],
      play: [steelCoil],
    });

    expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(steelCoil, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().respondWith(discardFodder)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });
});
