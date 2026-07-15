import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { iagoOutOfReach } from "./195-iago-out-of-reach";

const attacker = createMockCharacter({
  id: "iago-oor-attacker",
  name: "Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
});

const allyExerted = createMockCharacter({
  id: "iago-oor-ally-exerted",
  name: "Exerted Ally",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const allyReady = createMockCharacter({
  id: "iago-oor-ally-ready",
  name: "Ready Ally",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("Iago - Out of Reach", () => {
  describe("SELF-PRESERVATION — While you have another exerted character in play, this character can't be challenged.", () => {
    it("cannot be challenged when the controller has another exerted character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker],
          deck: 1,
        },
        {
          play: [
            { card: iagoOutOfReach, exerted: true },
            { card: allyExerted, exerted: true },
          ],
          deck: 1,
        },
      );

      const result = testEngine.asPlayerOne().challenge(attacker, iagoOutOfReach);
      expect(result).not.toBeSuccessfulCommand();
    });

    it("can be challenged when no other exerted character is in play for the controller", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker],
          deck: 1,
        },
        {
          play: [{ card: iagoOutOfReach, exerted: true }],
          deck: 1,
        },
      );

      const result = testEngine.asPlayerOne().challenge(attacker, iagoOutOfReach);
      expect(result).toBeSuccessfulCommand();
    });

    it("can be challenged when the only other characters in play are ready (not exerted)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker],
          deck: 1,
        },
        {
          play: [{ card: iagoOutOfReach, exerted: true }, allyReady],
          deck: 1,
        },
      );

      // allyReady is not exerted, so SELF-PRESERVATION condition is not met
      const result = testEngine.asPlayerOne().challenge(attacker, iagoOutOfReach);
      expect(result).toBeSuccessfulCommand();
    });

    it("is not listed as a valid challenge target when condition is met, but other characters remain challengeable", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker],
          deck: 1,
        },
        {
          play: [
            { card: iagoOutOfReach, exerted: true },
            { card: allyExerted, exerted: true },
          ],
          deck: 1,
        },
      );

      const moves = testEngine.asPlayerOne().getAvailableMoves();
      const challengeMove = moves.find((m) => m.moveId === "challenge");

      // allyExerted can still be challenged, so the challenge move exists
      expect(challengeMove).toBeDefined();

      const attackerInstanceId = challengeMove!.selectableCardIds[0]!;
      const defenderOptions = testEngine
        .asPlayerOne()
        .getMoveOptions("challenge", attackerInstanceId);

      const iagoId = testEngine.findCardInstanceId(iagoOutOfReach, "play", PLAYER_TWO);

      const defenderOptionIds = defenderOptions
        .filter((o) => o.kind === "card")
        .map((o) => o.cardId);

      // Iago cannot be challenged (SELF-PRESERVATION condition met)
      expect(defenderOptionIds).not.toContain(iagoId);
    });

    it("other challengeable targets remain valid when Iago can't be challenged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [attacker],
          deck: 1,
        },
        {
          play: [
            { card: iagoOutOfReach, exerted: true },
            { card: allyExerted, exerted: true },
          ],
          deck: 1,
        },
      );

      const moves = testEngine.asPlayerOne().getAvailableMoves();
      const challengeMove = moves.find((m) => m.moveId === "challenge");
      expect(challengeMove).toBeDefined();

      const attackerInstanceId = challengeMove!.selectableCardIds[0]!;
      const defenderOptions = testEngine
        .asPlayerOne()
        .getMoveOptions("challenge", attackerInstanceId);

      const allyExertedId = testEngine.findCardInstanceId(allyExerted, "play", PLAYER_TWO);
      const iagoId = testEngine.findCardInstanceId(iagoOutOfReach, "play", PLAYER_TWO);

      const defenderOptionIds = defenderOptions
        .filter((o) => o.kind === "card")
        .map((o) => o.cardId);

      expect(defenderOptionIds).toContain(allyExertedId);
      expect(defenderOptionIds).not.toContain(iagoId);
    });
  });
});
