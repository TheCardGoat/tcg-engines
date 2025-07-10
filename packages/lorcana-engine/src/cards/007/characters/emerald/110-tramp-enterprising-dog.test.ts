/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  ladyElegantSpaniel,
  mufasaRespectedKing,
  trampEnterprisingDog,
} from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Tramp - Enterprising Dog", () => {
  it("HEY, PIDGE If you have a character named Lady in play, you pay 1 {I} less to play this character.", async () => {
    const testEngine = new TestEngine({
      inkwell: trampEnterprisingDog.cost - 1,
      play: [ladyElegantSpaniel],
      hand: [trampEnterprisingDog],
    });

    await testEngine.playCard(trampEnterprisingDog);

    expect(testEngine.getCardModel(trampEnterprisingDog).zone).toBe("play");
  });

  it("NO TIME FOR WISECRACKS When you play this character, chosen character of yours gets +1 {S} this turn for each other character you have in play.", async () => {
    const testEngine = new TestEngine({
      inkwell: trampEnterprisingDog.cost,
      hand: [trampEnterprisingDog],
      play: [ladyElegantSpaniel, mufasaRespectedKing],
    });

    await testEngine.playCard(trampEnterprisingDog, {
      targets: [ladyElegantSpaniel],
    });

    expect(testEngine.getCardModel(ladyElegantSpaniel).strength).toBe(
      ladyElegantSpaniel.strength + 2,
    );
  });
});
