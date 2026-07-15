import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { geppettoSkilledCraftsman } from "./174-geppetto-skilled-craftsman";

const itemA = createMockItem({
  id: "geppetto-item-a",
  name: "Geppetto Item A",
  cost: 1,
});

const itemB = createMockItem({
  id: "geppetto-item-b",
  name: "Geppetto Item B",
  cost: 2,
});

const nonItemCard = createMockCharacter({
  id: "geppetto-non-item-card",
  name: "Geppetto Non-Item",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Geppetto - Skilled Craftsman", () => {
  it("discards chosen item cards from hand when questing and gains that much lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: geppettoSkilledCraftsman, isDrying: false }],
      hand: [itemA, itemB, nonItemCard],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().quest(geppettoSkilledCraftsman)).toBeSuccessfulCommand();

    const itemAId = testEngine.findCardInstanceId(itemA, "hand", PLAYER_ONE);
    const itemBId = testEngine.findCardInstanceId(itemB, "hand", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(geppettoSkilledCraftsman, {
        resolveOptional: true,
        targets: [itemAId, itemBId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(itemA)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(itemB)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(nonItemCard)).toBe("hand");
    expect(testEngine.getLore(PLAYER_ONE)).toBe(geppettoSkilledCraftsman.lore + 2);
  });

  it("can decline the optional and only gains quest lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: geppettoSkilledCraftsman, isDrying: false }],
      hand: [itemA, nonItemCard],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().quest(geppettoSkilledCraftsman)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(geppettoSkilledCraftsman, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(itemA)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(nonItemCard)).toBe("hand");
    expect(testEngine.getLore(PLAYER_ONE)).toBe(geppettoSkilledCraftsman.lore);
  });
});
