import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import type { ZoneId } from "@tcg/lorcana-engine";
import { rhinoMotivationalSpeaker } from "./001-rhino-motivational-speaker";

const otherCharacter = createMockCharacter({
  id: "rhino-test-other-char",
  name: "Other Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const anotherCharacter = createMockCharacter({
  id: "rhino-test-another-char",
  name: "Another Character",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
});

describe("Rhino - Motivational Speaker", () => {
  describe("DESTINY CALLING - Your other characters get +2 {W}.", () => {
    it("gives +2 willpower to other characters when Rhino is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [rhinoMotivationalSpeaker, otherCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().getCard(otherCharacter).willpower).toBe(
        otherCharacter.willpower + 2,
      );
    });

    it("does NOT give +2 willpower to Rhino itself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [rhinoMotivationalSpeaker],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().getCard(rhinoMotivationalSpeaker).willpower).toBe(
        rhinoMotivationalSpeaker.willpower,
      );
    });

    it("gives +2 willpower to multiple other characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [rhinoMotivationalSpeaker, otherCharacter, anotherCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().getCard(otherCharacter).willpower).toBe(
        otherCharacter.willpower + 2,
      );
      expect(testEngine.asPlayerOne().getCard(anotherCharacter).willpower).toBe(
        anotherCharacter.willpower + 2,
      );
    });

    it("does NOT give +2 willpower to opponent's characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [rhinoMotivationalSpeaker],
          deck: 2,
        },
        {
          play: [otherCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerTwo().getCard(otherCharacter).willpower).toBe(
        otherCharacter.willpower,
      );
    });

    it("bonus is lost when Rhino leaves play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [rhinoMotivationalSpeaker, otherCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().getCard(otherCharacter).willpower).toBe(
        otherCharacter.willpower + 2,
      );

      const rhinoInstanceId = testEngine.findCardInstanceId(
        rhinoMotivationalSpeaker,
        "play",
        PLAYER_ONE,
      );
      testEngine.asServer().manualMoveCard(rhinoInstanceId, `discard:${PLAYER_ONE}` as ZoneId);

      expect(testEngine.asPlayerOne().getCard(otherCharacter).willpower).toBe(
        otherCharacter.willpower,
      );
    });
  });
});
