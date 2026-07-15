import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { joshuaSweetFieldSurgeon } from "./088-joshua-sweet-field-surgeon";

const attacker = createMockCharacter({
  id: "joshua-sweet-attacker",
  name: "Attacker",
  cost: 3,
  strength: 3,
  willpower: 5,
  lore: 1,
});

const defender = createMockCharacter({
  id: "joshua-sweet-defender",
  name: "Defender",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const opponentHandCard1 = createMockCharacter({
  id: "joshua-sweet-opponent-hand-1",
  name: "Opponent Hand Card 1",
  cost: 1,
});

const opponentHandCard2 = createMockCharacter({
  id: "joshua-sweet-opponent-hand-2",
  name: "Opponent Hand Card 2",
  cost: 2,
});

describe("Joshua Sweet - Field Surgeon", () => {
  describe("NO PATIENCE: Whenever this character is challenged, chosen opponent chooses and discards a card.", () => {
    it("makes the chosen opponent discard a chosen card when Joshua is challenged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: attacker, isDrying: false }],
          hand: [opponentHandCard1, opponentHandCard2],
          deck: 1,
        },
        {
          play: [{ card: joshuaSweetFieldSurgeon, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(attacker, joshuaSweetFieldSurgeon),
      ).toBeSuccessfulCommand();

      // Resolve the triggered ability on Joshua's side (controller is player two)
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(joshuaSweetFieldSurgeon),
      ).toBeSuccessfulCommand();

      // Player one (the only opponent, auto-selected) chooses which card to discard
      expect(testEngine.asPlayerOne().respondWith(opponentHandCard1)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(opponentHandCard1)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(opponentHandCard2)).toBe("hand");
    });

    it("does not trigger when Joshua is the attacker", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: defender, exerted: true }],
          hand: [opponentHandCard1, opponentHandCard2],
          deck: 2,
        },
        {
          play: [{ card: joshuaSweetFieldSurgeon, isDrying: false }],
          deck: 2,
        },
      );

      // Pass turn so player two can challenge
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Joshua challenges (attacks); he is not being challenged here.
      expect(
        testEngine.asPlayerTwo().challenge(joshuaSweetFieldSurgeon, defender),
      ).toBeSuccessfulCommand();

      // The trigger should NOT fire
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);

      // Player one's hand should remain unchanged
      expect(testEngine.asPlayerOne().getCardZone(opponentHandCard1)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(opponentHandCard2)).toBe("hand");
    });
  });
});
