/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  atlanteanCrystal,
  roquefortLockExpert,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Roquefort - Lock Expert", () => {
  it("SAFEKEEPING Whenever this character quests, you may put chosen item into its player's inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine({
      inkwell: roquefortLockExpert.cost + 2,
      play: [roquefortLockExpert, atlanteanCrystal],
    });
    const cardUnderTest = testEngine.getCardModel(roquefortLockExpert);
    const target = testEngine.getCardModel(atlanteanCrystal);
    cardUnderTest.quest();
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [target] });
    expect(testEngine.getZonesCardCount().inkwell).toEqual(5);
    expect(testEngine.getCardModel(atlanteanCrystal).zone).toEqual("inkwell");
  });
});
