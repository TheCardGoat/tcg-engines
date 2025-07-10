/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { pinocchioOnTheRun } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { peterPanShadowFinder } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import {
  jiminyCricketLevelheadedAndWise,
  monstroInfamousWhale,
} from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Jiminy Cricket - Level-Headed and Wise", () => {
  it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [jiminyCricketLevelheadedAndWise],
    });

    expect(
      testEngine.getCardModel(jiminyCricketLevelheadedAndWise).hasEvasive,
    ).toBe(true);
  });

  it("ENOUGH'S ENOUGH While this character is not exerted, opposing characters with Rush do not enter play exerted.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: monstroInfamousWhale.cost,
        hand: [monstroInfamousWhale],
      },
      {
        play: [jiminyCricketLevelheadedAndWise],
      },
    );

    await testEngine.playCard(monstroInfamousWhale);

    expect(testEngine.getCardModel(monstroInfamousWhale).exerted).toBe(false);
  });

  it("ENOUGH'S ENOUGH While this character is exerted, opposing characters with Rush enter play exerted.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: monstroInfamousWhale.cost,
        hand: [monstroInfamousWhale],
      },
      {
        play: [jiminyCricketLevelheadedAndWise],
      },
    );

    await testEngine.tapCard(jiminyCricketLevelheadedAndWise);
    await testEngine.playCard(monstroInfamousWhale);

    expect(testEngine.getCardModel(monstroInfamousWhale).exerted).toBe(true);
  });

  it("ENOUGH'S ENOUGH does not effect non-rush characters", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: monstroInfamousWhale.cost,
        hand: [pinocchioOnTheRun],
      },
      {
        play: [jiminyCricketLevelheadedAndWise],
      },
    );

    await testEngine.tapCard(jiminyCricketLevelheadedAndWise);
    await testEngine.playCard(pinocchioOnTheRun);

    expect(testEngine.getCardModel(pinocchioOnTheRun).exerted).toBe(false);
  });

  it("ENOUGH'S ENOUGH does not effect your own characters", async () => {
    const testEngine = new TestEngine({
      inkwell: monstroInfamousWhale.cost,
      hand: [peterPanShadowFinder],
      play: [jiminyCricketLevelheadedAndWise],
    });

    await testEngine.tapCard(jiminyCricketLevelheadedAndWise);
    await testEngine.playCard(peterPanShadowFinder);

    expect(testEngine.getCardModel(peterPanShadowFinder).exerted).toBe(false);
  });
});
