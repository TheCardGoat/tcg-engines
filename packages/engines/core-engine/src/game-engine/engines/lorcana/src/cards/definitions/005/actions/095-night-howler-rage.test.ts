import { describe, expect, it } from "bun:test";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { mickeyBraveLittleTailor } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { nightHowlerRage } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";

describe("Night Howler Rage", () => {
  it("Draw a card. Chosen character gains **Reckless** during their next turn._(They can't quest and must challenge if able.)_", () => {
    const testStore = new TestStore({
      inkwell: nightHowlerRage.cost,
      hand: [nightHowlerRage],
      play: [mickeyBraveLittleTailor],
      deck: [mickeyBraveLittleTailor], // For drawing
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", nightHowlerRage.id);
    const targetCharacter = testStore.getByZoneAndId(
      "play",
      mickeyBraveLittleTailor.id,
    );

    expect(testStore.getZonesCardCount().hand).toBe(1); // Only nightHowlerRage in hand
    expect(testStore.getZonesCardCount().deck).toBe(1); // Mickey in deck for drawing

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [targetCharacter] });

    expect(testStore.getZonesCardCount().discard).toBe(1); // Night Howler Rage goes to discard
    expect(testStore.getZonesCardCount().hand).toBe(1); // Drew a card
    expect(testStore.getZonesCardCount().deck).toBe(0); // Drew from deck
  });
});
