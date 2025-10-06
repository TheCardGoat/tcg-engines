/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  charlotteLaBouffMardiGrasPrincess,
  darlingDearBelovedWife,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Darling Dear - Beloved Wife", () => {
  it("HOW SWEET When you play this character, chosen character gets +2 {L} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: darlingDearBelovedWife.cost,
      hand: [darlingDearBelovedWife],
      play: [charlotteLaBouffMardiGrasPrincess],
    });

    const cardToTest = testEngine.getCardModel(darlingDearBelovedWife);
    const targetCard = testEngine.getCardModel(
      charlotteLaBouffMardiGrasPrincess,
    );

    await testEngine.playCard(cardToTest);
    await testEngine.resolveTopOfStack({ targets: [targetCard] });

    expect(targetCard.lore).toBe(targetCard.strength + 2);
  });
});
