/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { herculesHeroInTraining } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { megaraLiberatedOne } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Megara - Liberated One", () => {
  it("**PEOPLE ALWAYS DO CRAZY THINGS** Whenever you play a character named Hercules, you may ready this character.", () => {
    const testEngine = new TestEngine({
      inkwell: herculesHeroInTraining.cost,
      hand: [herculesHeroInTraining],
      play: [megaraLiberatedOne],
    });

    const cardUnderTest = testEngine.getCardModel(megaraLiberatedOne);
    const trigger = testEngine.getCardModel(herculesHeroInTraining);
    cardUnderTest.updateCardMeta({ exerted: true });

    trigger.playFromHand();

    testEngine.resolveOptionalAbility();
    expect(cardUnderTest.exerted).toEqual(false);
  });
});
