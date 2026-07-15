import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { bobbyZimuruskiSprayCheeseKid } from "./078-bobby-zimuruski-spray-cheese-kid";

const drawnCard = createMockCharacter({
  id: "bobby-zimuruski-spray-cheese-kid-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

const discardFodder = createMockCharacter({
  id: "bobby-zimuruski-spray-cheese-kid-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
});

describe("Bobby Zimuruski - Spray Cheese Kid", () => {
  it("draws a card, then lets you choose and discard a card when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [drawnCard],
      hand: [bobbyZimuruskiSprayCheeseKid, discardFodder],
      inkwell: bobbyZimuruskiSprayCheeseKid.cost,
    });

    expect(testEngine.asPlayerOne().playCard(bobbyZimuruskiSprayCheeseKid)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(bobbyZimuruskiSprayCheeseKid, {
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
