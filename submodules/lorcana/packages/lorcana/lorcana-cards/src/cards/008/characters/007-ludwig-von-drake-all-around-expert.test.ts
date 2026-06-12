import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { healingGlow, simbaProtectiveCub } from "../../001";
import { ludwigVonDrakeAllaroundExpert } from "./007-ludwig-von-drake-all-around-expert";

const opponentAttacker = createMockCharacter({
  id: "ludwig-opponent-attacker",
  name: "Ludwig Opponent Attacker",
  cost: 3,
  strength: 5,
  willpower: 5,
});

describe("Ludwig Von Drake - All-Around Expert", () => {
  it("can be played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [ludwigVonDrakeAllaroundExpert],
      inkwell: ludwigVonDrakeAllaroundExpert.cost,
    });

    expect(
      testEngine.asPlayerOne().playCard(ludwigVonDrakeAllaroundExpert),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(ludwigVonDrakeAllaroundExpert)).toBe("play");
  });

  describe("SUPERIOR MIND - When you play this character, chosen opponent reveals their hand and discards a non-character card of your choice.", () => {
    it("reveals the opponent's hand and discards a non-character card chosen by the controller", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [ludwigVonDrakeAllaroundExpert],
          inkwell: ludwigVonDrakeAllaroundExpert.cost,
        },
        {
          hand: [healingGlow, simbaProtectiveCub],
        },
      );

      const actionCardId = testEngine.findCardInstanceId(healingGlow, "hand", PLAYER_TWO);

      expect(
        testEngine.asPlayerOne().playCard(ludwigVonDrakeAllaroundExpert),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().respondWith(actionCardId)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(healingGlow)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("hand");
    });

    it("does not allow discarding character cards when no non-character cards exist", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [ludwigVonDrakeAllaroundExpert],
          inkwell: ludwigVonDrakeAllaroundExpert.cost,
        },
        {
          hand: [simbaProtectiveCub],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(ludwigVonDrakeAllaroundExpert),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("hand");
    });
  });

  describe("LASTING LEGACY - When this character is banished, you may put this card into your inkwell facedown and exerted.", () => {
    it("puts Ludwig into inkwell facedown and exerted when banished and accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: ludwigVonDrakeAllaroundExpert, exerted: true }],
          deck: 1,
        },
        {
          play: [opponentAttacker],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(opponentAttacker, ludwigVonDrakeAllaroundExpert),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(ludwigVonDrakeAllaroundExpert, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(ludwigVonDrakeAllaroundExpert)).toBe("inkwell");
      expect(testEngine.asPlayerOne().isExerted(ludwigVonDrakeAllaroundExpert)).toBe(true);
      expect(testEngine.isCardFaceDown(ludwigVonDrakeAllaroundExpert, "inkwell")).toBe(true);
    });

    it("leaves Ludwig in discard when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: ludwigVonDrakeAllaroundExpert, exerted: true }],
          deck: 1,
        },
        {
          play: [opponentAttacker],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(opponentAttacker, ludwigVonDrakeAllaroundExpert),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(ludwigVonDrakeAllaroundExpert, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(ludwigVonDrakeAllaroundExpert)).toBe("discard");
    });
  });
});
