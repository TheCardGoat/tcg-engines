/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { merlinGoat } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import {
  donaldDuckFirstMate,
  peterPanNeverLandPrankster,
  thievery,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Peter Pan - Never Land Prankster", () => {
  it("LOOK INNOCENT This character enters play exerted.", async () => {
    const testEngine = new TestEngine({
      inkwell: peterPanNeverLandPrankster.cost,
      hand: [peterPanNeverLandPrankster],
    });

    const cardUnderTest = await testEngine.playCard(peterPanNeverLandPrankster);

    expect(cardUnderTest.exerted).toEqual(true);
  });

  it("CAN'T TAKE A JOKE? While this character is exerted, each opposing player can't gain lore unless one of their characters has challenged this turn.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: merlinGoat.cost + thievery.cost,
        hand: [merlinGoat, thievery],
        play: [donaldDuckFirstMate],
      },
      {
        play: [peterPanNeverLandPrankster],
      },
    );

    await testEngine.tapCard(peterPanNeverLandPrankster);

    await testEngine.playCard(merlinGoat);
    expect(testEngine.getLoreForPlayer("player_one")).toEqual(0);

    await testEngine.challenge({
      attacker: donaldDuckFirstMate,
      defender: peterPanNeverLandPrankster,
    });

    await testEngine.playCard(thievery);
    expect(testEngine.getLoreForPlayer("player_one")).toEqual(1);
  });
});
