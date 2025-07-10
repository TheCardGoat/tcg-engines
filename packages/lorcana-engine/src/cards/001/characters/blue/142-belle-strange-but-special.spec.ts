/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";
import {
  belleStrangeButBeautiful,
  dukeOfWeselton,
  gastonArrogantHunter,
  goonsMaleficent,
  mickeyMouseTrueFriend,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Belle - Strange but Special", () => {
  describe("DISARMING BEAUTY effect - Chosen characters gets -2 {S} this turn.", () => {
    it("One Belle in play", () => {
      const testStore = new TestStore({
        hand: [goonsMaleficent, dukeOfWeselton, mickeyMouseTrueFriend],
        play: [belleStrangeButBeautiful],
      });

      const target = testStore.getByZoneAndId("hand", goonsMaleficent.id);
      const anotherTarget = testStore.getByZoneAndId("hand", dukeOfWeselton.id);
      const thirdTarget = testStore.getByZoneAndId(
        "hand",
        mickeyMouseTrueFriend.id,
      );

      target.addToInkwell();
      anotherTarget.addToInkwell();
      thirdTarget.addToInkwell();

      expect(target.zone).toEqual("inkwell");
      expect(anotherTarget.zone).toEqual("inkwell");
      expect(thirdTarget.zone).toEqual("hand");
    });

    it("Two Belles in play", () => {
      const testStore = new TestStore({
        hand: [goonsMaleficent, dukeOfWeselton, mickeyMouseTrueFriend],
        play: [belleStrangeButBeautiful, belleStrangeButBeautiful],
      });

      const target = testStore.getByZoneAndId("hand", goonsMaleficent.id);
      const anotherTarget = testStore.getByZoneAndId("hand", dukeOfWeselton.id);
      const thirdTarget = testStore.getByZoneAndId(
        "hand",
        mickeyMouseTrueFriend.id,
      );

      target.addToInkwell();
      anotherTarget.addToInkwell();
      thirdTarget.addToInkwell();

      expect(target.zone).toEqual("inkwell");
      expect(anotherTarget.zone).toEqual("inkwell");
      expect(thirdTarget.zone).toEqual("inkwell");
    });
  });

  it("While you have 10 or more cards in your inkwell, this character gets +4 {L}.", () => {
    const testStore = new TestStore({
      inkwell: 9,
      hand: [goonsMaleficent],
      play: [belleStrangeButBeautiful],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      belleStrangeButBeautiful.id,
    );
    const target = testStore.getByZoneAndId("hand", goonsMaleficent.id);

    expect(cardUnderTest.lore).toEqual(1);

    target.addToInkwell();
    expect(cardUnderTest.lore).toEqual(5);
    cardUnderTest.quest();
    expect(testStore.getPlayerLore()).toEqual(5);
  });
});

describe("Regression tests", () => {
  it("Only Bell receives the bonus", () => {
    const testStore = new TestStore(
      {
        inkwell: 10,
        play: [belleStrangeButBeautiful, goonsMaleficent],
      },
      {
        play: [gastonArrogantHunter],
      },
    );

    const cardUnderTest = testStore.getCard(belleStrangeButBeautiful);
    const target = testStore.getCard(goonsMaleficent);
    const anotherTarget = testStore.getCard(gastonArrogantHunter);

    expect(cardUnderTest.lore).toEqual(belleStrangeButBeautiful.lore + 4);
    expect(anotherTarget.lore).toEqual(gastonArrogantHunter.lore);
    expect(target.lore).toEqual(goonsMaleficent.lore);
  });
});
