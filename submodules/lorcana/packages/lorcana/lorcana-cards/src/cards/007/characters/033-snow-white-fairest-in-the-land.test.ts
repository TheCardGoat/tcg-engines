import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { snowWhiteFairestInTheLand } from "./033-snow-white-fairest-in-the-land";

const attacker = createMockCharacter({
  id: "snow-white-fairest-test-attacker",
  name: "Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const normalDefender = createMockCharacter({
  id: "snow-white-fairest-test-normal-defender",
  name: "Normal Defender",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Snow White - Fairest in the Land", () => {
  describe("HIDDEN AWAY - This character can't be challenged.", () => {
    it("cannot be challenged by an opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker],
          deck: 1,
        },
        {
          play: [{ card: snowWhiteFairestInTheLand, exerted: true }],
          deck: 1,
        },
      );

      const result = testEngine.asPlayerOne().challenge(attacker, snowWhiteFairestInTheLand);
      expect(result).not.toBeSuccessfulCommand();
    });

    it("is not listed as a valid challenge target in available moves", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker],
          deck: 1,
        },
        {
          play: [{ card: snowWhiteFairestInTheLand, exerted: true }],
          deck: 1,
        },
      );

      const moves = testEngine.asPlayerOne().getAvailableMoves();
      const challengeMove = moves.find((m) => m.moveId === "challenge");

      // Snow White can't be challenged, so no valid challenge targets exist
      expect(challengeMove).toBeUndefined();
    });

    it("does not prevent challenging other characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker],
          deck: 1,
        },
        {
          play: [
            { card: snowWhiteFairestInTheLand, exerted: true },
            { card: normalDefender, exerted: true },
          ],
          deck: 1,
        },
      );

      // The attacker can still challenge the normal defender
      expect(testEngine.asPlayerOne().challenge(attacker, normalDefender)).toBeSuccessfulCommand();
    });

    it("does not appear as a valid challenge target when other challengeable characters exist", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker],
          deck: 1,
        },
        {
          play: [
            { card: snowWhiteFairestInTheLand, exerted: true },
            { card: normalDefender, exerted: true },
          ],
          deck: 1,
        },
      );

      const p1 = testEngine.asPlayerOne();
      const moves = p1.getAvailableMoves();
      const challengeMove = moves.find((m) => m.moveId === "challenge");

      expect(challengeMove).toBeDefined();

      const attackerId = challengeMove!.selectableCardIds[0]!;
      const defenderOptions = p1.getMoveOptions("challenge", attackerId);

      const normalDefenderId = testEngine.findCardInstanceId(normalDefender, "play", PLAYER_TWO);

      const defenderOptionIds = defenderOptions
        .filter((o) => o.kind === "card")
        .map((o) => o.cardId);

      expect(defenderOptionIds).toHaveLength(1);
      expect(defenderOptionIds).toContain(normalDefenderId);
    });
  });
});
