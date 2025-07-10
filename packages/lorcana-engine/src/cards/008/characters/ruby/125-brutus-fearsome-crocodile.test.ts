/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { madamMimFox } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import {
  brutusFearsomeCrocodile,
  deweyLovableShowoff,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Brutus - Fearsome Crocodile", () => {
  it("SPITEFUL During your turn, when this character is banished, if one of your characters was damaged this turn, gain 2 lore.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: brutusFearsomeCrocodile.cost,
        play: [brutusFearsomeCrocodile, deweyLovableShowoff],
      },
      {
        play: [madamMimFox],
      },
    );

    const cardUnderTest = testEngine.getCardModel(brutusFearsomeCrocodile);
    const otherCard = testEngine.getCardModel(deweyLovableShowoff);
    const target = testEngine.getCardModel(madamMimFox);

    target.exert();

    await testEngine.challenge({
      attacker: cardUnderTest,
      defender: target,
    });

    testEngine.setCardDamage(otherCard, 1);

    expect(testEngine.getPlayerLore()).toEqual(2);
  });
});
