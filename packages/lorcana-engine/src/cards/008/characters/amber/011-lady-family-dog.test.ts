/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  hueyReliableLeader,
  ladyFamilyDog,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Lady - Family Dog", () => {
  it("SOMEONE TO CARE FOR When you play this character, you may play a character with cost 2 or less for free.", async () => {
    const testEngine = new TestEngine({
      inkwell: ladyFamilyDog.cost,
      hand: [hueyReliableLeader, ladyFamilyDog],
    });

    await testEngine.playCard(ladyFamilyDog);
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [hueyReliableLeader] });
    expect(testEngine.getCardModel(hueyReliableLeader).zone).toEqual("play");
  });
});
