import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import type { ZoneId } from "@tcg/lorcana-engine";
import { madamMimTinyAdversary } from "./037-madam-mim-tiny-adversary";

const otherCharacter = createMockCharacter({
  id: "madam-mim-ta-other",
  name: "Other Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const defender = createMockCharacter({
  id: "madam-mim-ta-defender",
  name: "Defender",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Madam Mim - Tiny Adversary", () => {
  describe("Challenger +1", () => {
    it("has Challenger +1 keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [madamMimTinyAdversary],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().hasKeyword(madamMimTinyAdversary, "Challenger")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(madamMimTinyAdversary, "Challenger")).toBe(1);
    });

    it("Challenger +1 applies while challenging", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: madamMimTinyAdversary, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: defender, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(madamMimTinyAdversary, defender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(defender)).toBe("discard");
    });
  });

  describe("ZIM ZABBERIM ZIM — Your other characters gain Challenger +1", () => {
    it("other characters gain Challenger +1 when Madam Mim is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [madamMimTinyAdversary, otherCharacter],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().hasKeyword(otherCharacter, "Challenger")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(otherCharacter, "Challenger")).toBe(1);
    });

    it("Madam Mim does not gain Challenger from her own ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [madamMimTinyAdversary],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().hasKeyword(madamMimTinyAdversary, "Challenger")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(madamMimTinyAdversary, "Challenger")).toBe(1);
    });

    it("other characters lose Challenger +1 when Madam Mim leaves play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [madamMimTinyAdversary, otherCharacter],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().hasKeyword(otherCharacter, "Challenger")).toBe(true);

      const madamMimInstanceId = testEngine.findCardInstanceId(
        madamMimTinyAdversary,
        "play",
        PLAYER_ONE,
      );
      testEngine.asServer().manualMoveCard(madamMimInstanceId, `discard:${PLAYER_ONE}` as ZoneId);

      expect(testEngine.asPlayerOne().hasKeyword(otherCharacter, "Challenger")).toBe(false);
    });

    it("other characters do not have Challenger when Madam Mim is not in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [otherCharacter],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().hasKeyword(otherCharacter, "Challenger")).toBe(false);
    });
  });
});
