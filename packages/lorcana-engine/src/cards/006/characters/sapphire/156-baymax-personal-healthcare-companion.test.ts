/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  baymaxPersonalHealthcareCompanion,
  hiroHamadaRoboticsProdigy,
} from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Baymax - Personal Healthcare Companion", () => {
  it("**FULLY CHARGED** If you have an Inventor character in play, you pay 1 {I} less to play this character.", async () => {
    const testEngine = new TestEngine({
      inkwell: baymaxPersonalHealthcareCompanion.cost,
      hand: [baymaxPersonalHealthcareCompanion],
      play: [hiroHamadaRoboticsProdigy],
    });

    const cardUnderTest = testEngine.getCardModel(
      baymaxPersonalHealthcareCompanion,
    );

    expect(cardUnderTest.cost).toBe(baymaxPersonalHealthcareCompanion.cost - 1);
  });
  it("**FULLY CHARGED** If you have an Inventor character in play, you pay 1 {I} less to play this character.**YOU SAID 'OW'** 2 {I} - Remove up to 1 damage from another chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: 2,
      play: [baymaxPersonalHealthcareCompanion, hiroHamadaRoboticsProdigy],
    });

    const cardUnderTest = testEngine.getCardModel(
      baymaxPersonalHealthcareCompanion,
    );
    const hiro = testEngine.getCardModel(hiroHamadaRoboticsProdigy);

    hiro.updateCardDamage(1, "add");

    await testEngine.activateCard(cardUnderTest, {
      ability: "YOU SAID 'OW'",
    });

    await testEngine.resolveTopOfStack({ targets: [hiro] });
    expect(hiro.damage).toBe(0);
  });
});
