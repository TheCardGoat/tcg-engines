/**
 * @jest-environment node
 */

import { skip } from "node:test";
import { describe, expect, it } from "@jest/globals";
import { elsaQueenRegent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { annaMagicalMission } from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Anna - Magical Mission", () => {
  it.skip("Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Anna.)", async () => {
    const testEngine = new TestEngine({
      play: [annaMagicalMission],
    });

    const cardUnderTest = testEngine.getCardModel(annaMagicalMission);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it.skip("Support (Whenever this character quests, you may add their {S} to another chosen character’s {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      play: [annaMagicalMission],
    });

    const cardUnderTest = testEngine.getCardModel(annaMagicalMission);
    expect(cardUnderTest.hasSupport).toBe(true);
  });

  it("COORDINATED PLAN Whenever this character quests, if you have a character named Elsa in play, you may draw a card.", async () => {
    const testEngine = new TestEngine({
      inkwell: annaMagicalMission.cost,
      play: [annaMagicalMission, elsaQueenRegent],
    });

    const cardUnderTest = testEngine.getCardModel(annaMagicalMission);

    await testEngine.questCard(cardUnderTest);
    testEngine.resolveOptionalAbility(true);
    testEngine.resolveOptionalAbility(true);
    testEngine.resolveOptionalAbility(true);

    expect(testEngine.getCardsByZone("hand").length).toEqual(1);
  });
});
