/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  theQueenCommandingPresence,
  theQueenRegalMonarch,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { yokaiScientificSupervillain } from "@lorcanito/lorcana-engine/cards/006";
import { yokaiIntellectualSchemer } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("INNOVATE You pay 1{I} less to play characters using their Shift ability.", () => {
  it("should reduce shift cost", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      play: [yokaiIntellectualSchemer],
      hand: [yokaiScientificSupervillain],
    });

    const { shifter } = await testEngine.shiftCard({
      shifted: yokaiIntellectualSchemer,
      shifter: yokaiScientificSupervillain,
    });

    expect(shifter.zone).toEqual("play");
    expect(
      testEngine.store.continuousEffectStore.continuousEffects,
    ).toHaveLength(0);

    expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(5);
  });

  it("should not reduce cost", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      play: [yokaiIntellectualSchemer],
      hand: [yokaiScientificSupervillain],
    });

    await testEngine.playCard(yokaiScientificSupervillain);

    expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(1);
  });

  it("should not reduce shift cost for opponent", async () => {
    const testEngine = new TestEngine(
      {
        play: [yokaiIntellectualSchemer],
      },
      {
        inkwell: 1,
        play: [theQueenRegalMonarch],
        hand: [theQueenCommandingPresence],
        deck: 2,
      },
    );

    await testEngine.passTurn();

    const { shifter } = await testEngine.shiftCard({
      shifted: theQueenRegalMonarch,
      shifter: theQueenCommandingPresence,
    });

    expect(shifter.zone).toEqual("hand");
    expect(
      testEngine.store.continuousEffectStore.continuousEffects,
    ).toHaveLength(0);

    expect(testEngine.getAvailableInkwellCardCount("player_two")).toBe(1);
  });
});
