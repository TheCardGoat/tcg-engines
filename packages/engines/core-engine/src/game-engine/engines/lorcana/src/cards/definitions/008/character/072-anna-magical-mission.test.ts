/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { elsaQueenRegent } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { annaMagicalMission } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
