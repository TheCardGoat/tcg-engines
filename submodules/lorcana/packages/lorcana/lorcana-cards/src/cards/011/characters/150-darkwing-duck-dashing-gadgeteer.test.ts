import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { darkwingDuckDashingGadgeteer } from "./150-darkwing-duck-dashing-gadgeteer";

const bottomItem = createMockItem({
  id: "darkwing-modern-marvel-bottom-item",
  name: "Bottom Item",
  cost: 2,
});

const freeItem = createMockItem({
  id: "darkwing-modern-marvel-free-item",
  name: "Free Item",
  cost: 5,
});

const expensiveItem = createMockItem({
  id: "darkwing-modern-marvel-expensive-item",
  name: "Expensive Item",
  cost: 6,
});

describe("Darkwing Duck - Dashing Gadgeteer", () => {
  it("MODERN MARVEL lets you move an item from discard to the bottom of your deck and then play a cost 5 or less item for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: darkwingDuckDashingGadgeteer, isDrying: false }],
      discard: [bottomItem, freeItem, expensiveItem],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().quest(darkwingDuckDashingGadgeteer)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(darkwingDuckDashingGadgeteer.lore);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    // Step 1: accept outer optional and move bottomItem to deck
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(darkwingDuckDashingGadgeteer, {
        resolveOptional: true,
        targets: [bottomItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(bottomItem)).toBe("deck");

    // Step 2: "if you do" condition met — optional play item from discard (pick freeItem)
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(darkwingDuckDashingGadgeteer, {
        resolveOptional: true,
        targets: [freeItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(freeItem)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(expensiveItem)).toBe("discard");
  });

  it("MODERN MARVEL is optional and leaves discard untouched if declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: darkwingDuckDashingGadgeteer, isDrying: false }],
      discard: [bottomItem, freeItem],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().quest(darkwingDuckDashingGadgeteer)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(darkwingDuckDashingGadgeteer, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(bottomItem)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(freeItem)).toBe("discard");
    expect(testEngine.getLore(PLAYER_ONE)).toBe(darkwingDuckDashingGadgeteer.lore);
  });
});
