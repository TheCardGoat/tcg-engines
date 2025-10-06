/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  arthurDeterminedSquire,
  roquefortLockExpert,
  stitchExperiment_626,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";

describe("Stitch - Experiment 626", () => {
  it("SO NAUGHTY When you play this character, each opponent puts the top card of their deck into their inkwell.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: stitchExperiment_626.cost,
        hand: [stitchExperiment_626],
        deck: 10,
      },
      {
        deck: 10,
      },
    );

    expect(testEngine.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({
        deck: 10,
        inkwell: 0,
      }),
    );
    expect(testEngine.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({
        deck: 10,
        inkwell: stitchExperiment_626.cost,
      }),
    );
    await testEngine.playCard(stitchExperiment_626);
    expect(testEngine.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({
        deck: 9,
        inkwell: 1,
      }),
    );
    expect(testEngine.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({
        deck: 10,
        inkwell: stitchExperiment_626.cost,
      }),
    );
  });

  it("STEALTH MODE At the start of your turn, if this card is in your discard, you may choose and discard a card with {IW} to play him for free and he enters play exerted.", async () => {
    const testEngine = new TestEngine({
      hand: [arthurDeterminedSquire, roquefortLockExpert],
      discard: [stitchExperiment_626],
    });

    await testEngine.passTurn();
    await testEngine.passTurn();

    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [arthurDeterminedSquire] });

    expect(testEngine.getCardModel(arthurDeterminedSquire).zone).toEqual(
      "discard",
    );
    expect(testEngine.getCardModel(stitchExperiment_626).zone).toEqual("play");
    expect(testEngine.getCardModel(stitchExperiment_626).exerted).toEqual(true);
  });

  it("STEALTH MODE - Cancelling effect", async () => {
    const testEngine = new TestEngine({
      hand: [arthurDeterminedSquire],
      discard: [stitchExperiment_626],
    });

    await testEngine.passTurn();
    await testEngine.passTurn();

    await testEngine.skipTopOfStack();

    expect(testEngine.getCardModel(arthurDeterminedSquire).zone).toEqual(
      "hand",
    );
    expect(testEngine.getCardModel(stitchExperiment_626).zone).toEqual(
      "discard",
    );
    expect(testEngine.stackLayers).toHaveLength(0);
  });
});
