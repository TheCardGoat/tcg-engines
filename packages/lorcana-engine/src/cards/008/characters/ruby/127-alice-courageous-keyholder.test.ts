/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  aliceCourageousKeyholder,
  deweyLovableShowoff,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Alice - Courageous Keyholder", () => {
  it("THIS WAY OUT When you play this character, you may ready chosen damaged character of yours. They can't quest for the rest of this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: aliceCourageousKeyholder.cost,
      hand: [aliceCourageousKeyholder],
      play: [deweyLovableShowoff],
    });

    const cardUnderTest = testEngine.getCardModel(aliceCourageousKeyholder);
    const target = testEngine.getCardModel(deweyLovableShowoff);
    target.exert();
    testEngine.setCardDamage(target, 1);

    await testEngine.playCard(cardUnderTest);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({ targets: [target] });

    expect(target.exerted).toEqual(false);
    expect(target.hasQuestRestriction).toEqual(true);
  });
});
