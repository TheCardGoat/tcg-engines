/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  atlanteanCrystal,
  bellesFavoriteBook,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Belle's Favorite Book", () => {
  it("CHAPTER THREE {E}, Banish one of your other items – Put the top card of your deck into your inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine({
      play: [bellesFavoriteBook, atlanteanCrystal],
    });

    expect(testEngine.getZonesCardCount().inkwell).toBe(0);

    await testEngine.activateCard(bellesFavoriteBook, {
      costs: [atlanteanCrystal],
    });

    expect(testEngine.getCardModel(bellesFavoriteBook).exerted).toBe(true);
    expect(testEngine.getZonesCardCount().inkwell).toBe(1);
  });
});
