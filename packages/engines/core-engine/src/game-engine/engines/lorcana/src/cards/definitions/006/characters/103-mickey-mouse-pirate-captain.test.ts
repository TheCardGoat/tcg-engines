import { describe, expect, it } from "bun:test";
import {
  abuBoldHelmsman,
  kakamoraBoardingParty,
  mickeyMousePirateCaptain,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mickey Mouse - Pirate Captain", () => {
  it("Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Mickey Mouse.)", async () => {
    const testEngine = new TestEngine({
      play: [mickeyMousePirateCaptain],
    });

    const cardUnderTest = testEngine.getCardModel(mickeyMousePirateCaptain);
    expect(cardUnderTest.hasShift()).toBe(true);
  });

  it("MARINER’S MIGHT Whenever this character quests, chosen Pirate character gets +2 {S} and gains 'This character takes no damage from challenges' this turn.", async () => {
    const testEngine = new TestEngine(
      {
        play: [mickeyMousePirateCaptain, kakamoraBoardingParty],
      },
      {
        play: [abuBoldHelmsman],
      },
    );

    await testEngine.tapCard(abuBoldHelmsman);

    await testEngine.questCard(mickeyMousePirateCaptain, {
      targets: [kakamoraBoardingParty],
    });

    const { attacker } = await testEngine.challenge({
      attacker: kakamoraBoardingParty,
      defender: abuBoldHelmsman,
    });

    expect(attacker.strength).toEqual(kakamoraBoardingParty.strength + 2);
    expect(attacker.damage).toEqual(0);
    expect(attacker.zone).toEqual("play");
  });
});
