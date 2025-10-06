/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  amethystCoil,
  emeraldCoil,
  scroogeMcduckResourcefulMiser,
  spaghettiDinner,
  theGlassSlipper,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Scrooge Mcduck - Resourceful Miser", () => {
  const items = [spaghettiDinner, emeraldCoil, theGlassSlipper, amethystCoil];
  it("PUT IT TO GOOD USE You may exert 4 items of yours to play this character for free.", async () => {
    const testEngine = new TestEngine({
      inkwell: 0,
      play: items,
      hand: [scroogeMcduckResourcefulMiser],
    });

    await testEngine.playCard(scroogeMcduckResourcefulMiser, {
      alternativeCosts: items,
    });

    expect(testEngine.getCardModel(scroogeMcduckResourcefulMiser).zone).toBe(
      "play",
    );

    for (const item of items) {
      expect(testEngine.getCardModel(item).exerted).toBe(true);
    }
  });

  it("FORTUNE HUNTER When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.", async () => {
    const testEngine = new TestEngine({
      inkwell: scroogeMcduckResourcefulMiser.cost,
      hand: [scroogeMcduckResourcefulMiser],
      deck: items,
    });

    await testEngine.playCard(scroogeMcduckResourcefulMiser, {
      scry: {
        hand: [theGlassSlipper],
        bottom: [spaghettiDinner, emeraldCoil, amethystCoil],
      },
    });

    expect(testEngine.getCardModel(theGlassSlipper).zone).toBe("hand");
  });
});
