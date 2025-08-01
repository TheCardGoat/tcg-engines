/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liShangNewlyPromoted } from "@lorcanito/lorcana-engine/cards/007/characters/characters";
import { mushuYourWorstNightmare } from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Mushu - Your Worst Nightmare", () => {
  it("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Mushu.)", async () => {
    const testEngine = new TestEngine({
      play: [mushuYourWorstNightmare],
    });

    const cardUnderTest = testEngine.getCardModel(mushuYourWorstNightmare);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("ALL FIRED UP Whenever you play another character, they gain Rush, Reckless, and Evasive this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: mushuYourWorstNightmare.cost + liShangNewlyPromoted.cost,
      hand: [mushuYourWorstNightmare, liShangNewlyPromoted],
    });

    const targetCard = testEngine.getCardModel(liShangNewlyPromoted);
    const sourceCard = testEngine.getCardModel(mushuYourWorstNightmare);

    expect(targetCard.hasRush).toBe(false);
    expect(targetCard.hasReckless).toBe(false);
    expect(targetCard.hasEvasive).toBe(false);

    await testEngine.playCard(mushuYourWorstNightmare);
    await testEngine.playCard(liShangNewlyPromoted);

    expect(sourceCard.hasRush).toBe(false);
    expect(sourceCard.hasEvasive).toBe(false);
    expect(sourceCard.hasReckless).toBe(false);
    expect(targetCard.hasRush).toBe(true);
    expect(targetCard.hasEvasive).toBe(true);
    expect(targetCard.hasReckless).toBe(true);

    await testEngine.passTurn();

    expect(targetCard.hasRush).toBe(false);
    expect(targetCard.hasReckless).toBe(false);
    expect(targetCard.hasEvasive).toBe(false);
  });
});
