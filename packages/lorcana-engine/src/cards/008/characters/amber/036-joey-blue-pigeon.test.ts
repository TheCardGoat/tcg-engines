/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { simbaProtectiveCub } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  joeyBluePigeon,
  montereyJackDefiantProtector,
} from "@lorcanito/lorcana-engine/cards/008/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Joey - Blue Pigeon", () => {
  it("I'VE GOT JUST THE THING Whenever this character quests, you may remove up to 1 damage from each of your characters with Bodyguard.", async () => {
    const testEngine = new TestEngine({
      play: [joeyBluePigeon, simbaProtectiveCub, montereyJackDefiantProtector],
    });

    const cardToTest = testEngine.getCardModel(joeyBluePigeon);
    const otheBodyguard1 = testEngine.getCardModel(simbaProtectiveCub);
    const otheBodyguard2 = testEngine.getCardModel(
      montereyJackDefiantProtector,
    );

    otheBodyguard1.damage = 2;
    otheBodyguard2.damage = 2;
    cardToTest.damage = 1;

    await cardToTest.quest();

    await testEngine.resolveOptionalAbility();

    expect(cardToTest.damage).toEqual(1);
    expect(otheBodyguard1.damage).toEqual(1);
    expect(otheBodyguard2.damage).toEqual(1);

    // await testEngine.resolveTopOfStack({});
  });
});
