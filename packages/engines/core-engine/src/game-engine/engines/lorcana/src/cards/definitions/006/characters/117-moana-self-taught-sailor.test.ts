/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { mauiDemiGod } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import {
  moanaSelftaughtSailor,
  tinkerBellQueenOfTheAzuriteFairies,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("Moana - Self-Taught Sailor", () => {
  describe("LEARNING THE ROPES This character can't challenge unless you have a Captain character in play.", () => {
    it("No captain in play", async () => {
      const testEngine = new TestEngine(
        {
          play: [moanaSelftaughtSailor],
        },
        {
          play: [mauiDemiGod],
        },
      );
      const cardUnderTest = testEngine.getCardModel(moanaSelftaughtSailor);
      const opponent = testEngine.getCardModel(mauiDemiGod);

      await testEngine.tapCard(mauiDemiGod);

      expect(opponent.exerted).toBe(true);
      expect(cardUnderTest.canChallenge(opponent)).toBe(false);

      await testEngine.challenge({
        attacker: moanaSelftaughtSailor,
        defender: mauiDemiGod,
      });

      expect(opponent.damage).toBe(0);
      expect(opponent.zone).toBe("play");

      expect(cardUnderTest.damage).toBe(0);
      expect(cardUnderTest.zone).toBe("play");
    });

    it("With captain in play", async () => {
      const testEngine = new TestEngine(
        {
          play: [moanaSelftaughtSailor, tinkerBellQueenOfTheAzuriteFairies],
        },
        {
          play: [mauiDemiGod],
        },
      );
      const cardUnderTest = testEngine.getCardModel(moanaSelftaughtSailor);
      const opponent = testEngine.getCardModel(mauiDemiGod);

      await testEngine.tapCard(mauiDemiGod);

      expect(opponent.exerted).toBe(true);
      expect(cardUnderTest.canChallenge(opponent)).toBe(true);

      await testEngine.challenge({
        attacker: moanaSelftaughtSailor,
        defender: mauiDemiGod,
      });

      expect(opponent.damage).toBe(moanaSelftaughtSailor.strength);
      expect(opponent.zone).toBe("play");

      expect(cardUnderTest.zone).toBe("discard");
    });
  });
});
