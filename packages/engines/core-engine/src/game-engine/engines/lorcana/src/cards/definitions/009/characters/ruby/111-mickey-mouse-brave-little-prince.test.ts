/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mickeyMouseTrueFriend } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/012-mickey-mouse-true-friend";
import { mickeyMouseBraveLittlePrince } from "~/game-engine/engines/lorcana/src/cards/definitions/009/characters/ruby/111-mickey-mouse-brave-little-prince";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mickey Mouse - Brave Little Prince", () => {
  it("Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Mickey Mouse.)", async () => {
    const testEngine = new TestEngine({
      play: [mickeyMouseBraveLittlePrince],
    });

    const cardUnderTest = testEngine.getCardModel(mickeyMouseBraveLittlePrince);
    expect(cardUnderTest.hasShift).toBe(true);
  });

  it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [mickeyMouseBraveLittlePrince],
    });

    const cardUnderTest = testEngine.getCardModel(mickeyMouseBraveLittlePrince);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("CROWNING ACHIEVEMENT While this character has a card under him, he gets +3 {S}, +3 {W}, and +3 {L}.", async () => {
    const testEngine = new TestEngine({
      inkwell: 10,
      play: [mickeyMouseTrueFriend],
      hand: [mickeyMouseBraveLittlePrince],
    });

    const cardUnderTest = testEngine.getCardModel(mickeyMouseBraveLittlePrince);
    // const card  = testEngine.getCardModel(mickeyMouseTrueFriend);

    await testEngine.shiftCard({
      shifted: mickeyMouseTrueFriend,
      shifter: mickeyMouseBraveLittlePrince,
    });

    expect(cardUnderTest.zone).toBe("play");
    expect(cardUnderTest.lore).toBe(mickeyMouseBraveLittlePrince.lore + 3);
    expect(cardUnderTest.strength).toBe(
      mickeyMouseBraveLittlePrince.strength + 3,
    );
    expect(cardUnderTest.willpower).toBe(
      mickeyMouseBraveLittlePrince.willpower + 3,
    );
  });

  it("CROWNING ACHIEVEMENT: no shift", async () => {
    const testEngine = new TestEngine({
      play: [mickeyMouseBraveLittlePrince],
    });

    const cardUnderTest = testEngine.getCardModel(mickeyMouseBraveLittlePrince);

    expect(cardUnderTest.zone).toBe("play");
    expect(cardUnderTest.lore).toBe(mickeyMouseBraveLittlePrince.lore);
    expect(cardUnderTest.strength).toBe(mickeyMouseBraveLittlePrince.strength);
    expect(cardUnderTest.willpower).toBe(
      mickeyMouseBraveLittlePrince.willpower,
    );
  });

  describe("Regression tests", () => {
    it("Only gives the buff for the instance, do not give bonus to other mickeys on board", async () => {
      const testEngine = new TestEngine({
        inkwell: 10,
        play: [mickeyMouseTrueFriend, mickeyMouseBraveLittlePrince],
        hand: [mickeyMouseBraveLittlePrince],
      });

      const cardUnderTest = testEngine.getCardModel(
        mickeyMouseBraveLittlePrince,
        1,
      );
      expect(cardUnderTest.zone).toBe("hand");
      const anotherMickey = testEngine.getCardModel(
        mickeyMouseBraveLittlePrince,
        0,
      );
      expect(anotherMickey.zone).toBe("play");

      await testEngine.shiftCard({
        shifted: mickeyMouseTrueFriend,
        shifter: cardUnderTest,
      });

      expect(anotherMickey.zone).toBe("play");
      expect(anotherMickey.lore).toBe(mickeyMouseBraveLittlePrince.lore);
      expect(anotherMickey.strength).toBe(
        mickeyMouseBraveLittlePrince.strength,
      );
      expect(anotherMickey.willpower).toBe(
        mickeyMouseBraveLittlePrince.willpower,
      );

      expect(cardUnderTest.zone).toBe("play");
      expect(cardUnderTest.lore).toBe(mickeyMouseBraveLittlePrince.lore + 3);
      expect(cardUnderTest.strength).toBe(
        mickeyMouseBraveLittlePrince.strength + 3,
      );
      expect(cardUnderTest.willpower).toBe(
        mickeyMouseBraveLittlePrince.willpower + 3,
      );
    });
  });
});
