/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { doloresMadrigalEasyListener } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import { marianoGuzmanSeductivePretender } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";

describe("Mariano Guzmán - Seductive Pretender", () => {
  it("I SEE YOU As long as you have a Dolores Madrigal character in play, this character gets +1 {L}.", async () => {
    const testEngine = new TestEngine({
      play: [marianoGuzmanSeductivePretender, doloresMadrigalEasyListener],
    });

    const cardUnderTest = testEngine.getCardModel(
      marianoGuzmanSeductivePretender,
    );
    expect(testEngine.getPlayerLore()).toBe(0);
    cardUnderTest.quest();
    expect(testEngine.getPlayerLore()).toBe(2);
  });

  it("Ensure only 1 lore is gained when Dolores Madrigal is not in play.", async () => {
    const testEngine = new TestEngine({
      play: [marianoGuzmanSeductivePretender],
      hand: [doloresMadrigalEasyListener],
    });

    const cardUnderTest = testEngine.getCardModel(
      marianoGuzmanSeductivePretender,
    );
    expect(testEngine.getPlayerLore()).toBe(0);
    cardUnderTest.quest();
    expect(testEngine.getPlayerLore()).toBe(1);
  });
});
