/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { madamMimSnake } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import {
  rajahGhostlyTiger,
  treasureGuardianForebodingSentry,
} from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Treasure Guardian - Foreboding Sentry", () => {
  it("UNTOLD TREASURE When you play this character, if you have an Illusion character in play, you may draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: treasureGuardianForebodingSentry.cost,
      hand: [treasureGuardianForebodingSentry],
      play: [rajahGhostlyTiger],
      deck: [madamMimSnake],
    });

    const cardUnderTest = testEngine.getCardModel(
      treasureGuardianForebodingSentry,
    );

    expect(testEngine.getZonesCardCount().hand).toEqual(1);
    await testEngine.playCard(cardUnderTest);
    expect(testEngine.getZonesCardCount().hand).toEqual(0);
    await testEngine.resolveOptionalAbility();
    expect(testEngine.getZonesCardCount().hand).toEqual(1);
  });

  it("Regression - ensure card is not drawn on non-illusion characters", async () => {
    const testEngine = new TestEngine({
      inkwell: treasureGuardianForebodingSentry.cost,
      hand: [treasureGuardianForebodingSentry],
      play: [madamMimSnake],
    });

    const cardUnderTest = testEngine.getCardModel(
      treasureGuardianForebodingSentry,
    );

    expect(testEngine.getZonesCardCount().hand).toEqual(1);
    await testEngine.playCard(cardUnderTest);
    expect(testEngine.getZonesCardCount().hand).toEqual(0);
    expect(testEngine.stackLayers).toHaveLength(0);
    expect(testEngine.getZonesCardCount().hand).toEqual(0);
  });
});
