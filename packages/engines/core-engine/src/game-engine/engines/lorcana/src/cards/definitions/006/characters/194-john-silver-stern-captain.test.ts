/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { johnSilverSternCaptain } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("John Silver - Stern Captain", () => {
  it.skip("Shift 5 (You may pay 5 {I} to play this on top of one of your characters named John Silver.)", async () => {
    const testEngine = new TestEngine({
      play: [johnSilverSternCaptain],
    });

    const cardUnderTest = testEngine.getCardModel(johnSilverSternCaptain);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it.skip("Resist +2 (Damage dealt to this character is reduced by 2.)", async () => {
    const testEngine = new TestEngine({
      play: [johnSilverSternCaptain],
    });

    const cardUnderTest = testEngine.getCardModel(johnSilverSternCaptain);
    expect(cardUnderTest.hasResist).toBe(true);
  });

  it.skip("DON'T JUST SIT THERE! At the start of your turn, deal 1 damage to each opposing ready character.", async () => {
    const testEngine = new TestEngine({
      inkwell: johnSilverSternCaptain.cost,
      play: [johnSilverSternCaptain],
      hand: [johnSilverSternCaptain],
    });

    await testEngine.playCard(johnSilverSternCaptain);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
