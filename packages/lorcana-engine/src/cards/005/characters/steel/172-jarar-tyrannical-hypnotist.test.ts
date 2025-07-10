/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  jafarTyrannicalHypnotist,
  nalaMischievousCub,
  sirEctorCastleLord,
} from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Jarar - Tyrannical Hypnotist", () => {
  it("Challenger", () => {
    const testStore = new TestStore({
      play: [jafarTyrannicalHypnotist],
    });

    const cardUnderTest = testStore.getCard(jafarTyrannicalHypnotist);

    expect(cardUnderTest.hasChallenger).toBe(true);
  });

  describe("**INTIMIDATING GAZE** Opposing characters with cost 4 or less can’t challenge.", () => {
    it("Opposing characters with cost 4 or less can’t challenge.", () => {
      const testStore = new TestStore(
        {
          play: [nalaMischievousCub],
          deck: 1,
        },
        {
          play: [jafarTyrannicalHypnotist],
          deck: 1,
        },
      );

      const cardUnderTest = testStore.getCard(jafarTyrannicalHypnotist);
      cardUnderTest.updateCardMeta({ exerted: true });

      const target = testStore.getCard(nalaMischievousCub);

      expect(target.canChallenge(cardUnderTest)).toBe(false);

      testStore.passTurn();
      testStore.passTurn();

      expect(target.canChallenge(cardUnderTest)).toBe(false);
    });

    it("Opposing characters with cost 5 or more can challenge.", () => {
      const testStore = new TestStore(
        {
          play: [sirEctorCastleLord],
          deck: 1,
        },
        {
          play: [jafarTyrannicalHypnotist],
          deck: 1,
        },
      );

      const cardUnderTest = testStore.getCard(jafarTyrannicalHypnotist);
      cardUnderTest.updateCardMeta({ exerted: true });

      const target = testStore.getCard(sirEctorCastleLord);

      expect(target.canChallenge(cardUnderTest)).toBe(true);

      testStore.passTurn();
      testStore.passTurn();

      cardUnderTest.updateCardMeta({ exerted: true });
      expect(target.canChallenge(cardUnderTest)).toBe(true);
    });
  });
});
