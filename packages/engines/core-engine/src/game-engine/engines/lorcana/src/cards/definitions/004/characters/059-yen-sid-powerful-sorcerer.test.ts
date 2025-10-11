import { describe, expect, it } from "bun:test";
import {
  cinderellaMelodyWeaver,
  magicBroomAerialCleaner,
  yenSidPowerfulSorcerer,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Yen Sid - Powerful Sorcerer", () => {
  it("**TIMELY INTERVENTION** When you play this character, if you have a character named Magic Broom in play, you may draw a card.", () => {
    const testStore = new TestStore({
      inkwell: yenSidPowerfulSorcerer.cost,
      hand: [yenSidPowerfulSorcerer],
      play: [magicBroomAerialCleaner],
      deck: [cinderellaMelodyWeaver],
    });

    const cardUnderTest = testStore.getCard(yenSidPowerfulSorcerer);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();

    expect(testStore.getZonesCardCount().hand).toBe(1);
  });

  it("**ARCANE STUDY** While you have 2 or more Broom characters in play, this character gets +2 {L}.", () => {
    const testStore = new TestStore({
      inkwell: yenSidPowerfulSorcerer.cost,
      play: [
        yenSidPowerfulSorcerer,
        magicBroomAerialCleaner,
        magicBroomAerialCleaner,
      ],
    });

    const cardUnderTest = testStore.getCard(yenSidPowerfulSorcerer);
    expect(cardUnderTest.lore).toBe(yenSidPowerfulSorcerer.lore + 2);
  });
});
