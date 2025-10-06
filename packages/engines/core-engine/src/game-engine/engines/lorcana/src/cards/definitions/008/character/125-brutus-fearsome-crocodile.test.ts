/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { madamMimFox } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  brutusFearsomeCrocodile,
  deweyLovableShowoff,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
