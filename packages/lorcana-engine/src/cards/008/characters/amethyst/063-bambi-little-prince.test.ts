/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  bambiLittlePrince,
  deweyLovableShowoff,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { except } from "drizzle-orm/mysql-core";

describe("Bambi - Little Prince", () => {
  it("SAY HELLO When you play this character, gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: bambiLittlePrince.cost,
      hand: [bambiLittlePrince],
    });

    const cardUnderTest = testEngine.getCardModel(bambiLittlePrince);

    cardUnderTest.play();

    expect(testEngine.getPlayerLore()).toEqual(1);
  });

  it("KIND OF BASHFUL When an opponent plays a character, return this character to your hand.", async () => {
    const testEngine = new TestEngine(
      {
        // stcvdxw00139.servicead.sogei.it
        inkwell: bambiLittlePrince.cost,
        play: [bambiLittlePrince],
      },
      {
        inkwell: deweyLovableShowoff.cost,
        hand: [deweyLovableShowoff],
      },
    );

    const cardUnderTest = testEngine.getCardModel(bambiLittlePrince);
    const cardOppo = testEngine.getCardModel(deweyLovableShowoff);

    testEngine.passTurn();

    await testEngine.playCard(cardOppo);

    expect(cardUnderTest.zone).toEqual("hand");
  });
});
