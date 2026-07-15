import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rajahRoyalProtector } from "./192-rajah-royal-protector";

const lowCostAttacker = createMockCharacter({
  id: "rajah-rp-low-cost-attacker",
  name: "Low Cost Attacker",
  cost: 4,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const highCostAttacker = createMockCharacter({
  id: "rajah-rp-high-cost-attacker",
  name: "High Cost Attacker",
  cost: 5,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const handFiller = createMockCharacter({
  id: "rajah-rp-hand-filler",
  name: "Hand Filler",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Rajah - Royal Protector", () => {
  describe("STEADY GAZE - While you have no cards in your hand, characters with cost 4 or less can't challenge this character.", () => {
    it("prevents characters with cost 4 or less from challenging Rajah when the controller has no cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          // Player one controls Rajah - start with empty hand
          play: [{ card: rajahRoyalProtector, exerted: true }],
          deck: 5,
        },
        {
          play: [{ card: lowCostAttacker, isDrying: false }],
          deck: 5,
        },
      );

      // Pass player one's turn so player two can act
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Low cost attacker (cost 4) tries to challenge Rajah — should fail because player one has no cards in hand
      expect(
        testEngine.asPlayerTwo().challenge(lowCostAttacker, rajahRoyalProtector),
      ).not.toBeSuccessfulCommand();
    });

    it("allows characters with cost 5 or more to challenge Rajah when the controller has no cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          // Player one controls Rajah - start with empty hand
          play: [{ card: rajahRoyalProtector, exerted: true }],
          deck: 5,
        },
        {
          play: [{ card: highCostAttacker, isDrying: false }],
          deck: 5,
        },
      );

      // Pass player one's turn so player two can act
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // High cost attacker (cost 5) can challenge Rajah even when player one has no cards in hand
      expect(
        testEngine.asPlayerTwo().challenge(highCostAttacker, rajahRoyalProtector),
      ).toBeSuccessfulCommand();
    });

    it("allows characters with cost 4 or less to challenge Rajah when the controller has cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          // Player one controls Rajah - hand has a card, so condition is NOT met
          play: [{ card: rajahRoyalProtector, exerted: true }],
          hand: [handFiller],
          deck: 5,
        },
        {
          play: [{ card: lowCostAttacker, isDrying: false }],
          deck: 5,
        },
      );

      // Pass player one's turn so player two can act
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Low cost attacker can challenge Rajah because player one has cards in hand
      expect(
        testEngine.asPlayerTwo().challenge(lowCostAttacker, rajahRoyalProtector),
      ).toBeSuccessfulCommand();
    });
  });
});
