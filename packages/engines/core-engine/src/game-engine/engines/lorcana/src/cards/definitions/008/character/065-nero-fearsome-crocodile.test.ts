/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  deweyLovableShowoff,
  neroFearsomeCrocodile,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";

describe("Nero - Fearsome Crocodile", () => {
  it("AND MEAN {E} – Move 1 damage counter from this character to chosen opposing character.", async () => {
    const testEngine = new TestEngine(
      {
        play: [neroFearsomeCrocodile],
      },
      {
        play: [deweyLovableShowoff],
      },
    );

    const cardUnderTest = testEngine.getCardModel(neroFearsomeCrocodile);
    const target = testEngine.getCardModel(deweyLovableShowoff);

    await testEngine.setCardDamage(cardUnderTest, 1);
    await testEngine.activateCard(cardUnderTest);
    await testEngine.resolveTopOfStack(
      { targets: [neroFearsomeCrocodile] },
      true,
    );
    await testEngine.resolveTopOfStack({ targets: [deweyLovableShowoff] });

    expect(cardUnderTest.damage).toEqual(0);
    expect(target.damage).toEqual(1);
  });
});
