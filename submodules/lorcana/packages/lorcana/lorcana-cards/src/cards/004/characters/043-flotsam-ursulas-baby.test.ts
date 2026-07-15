import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { flotsamUrsulasBaby } from "./043-flotsam-ursulas-baby";
import { jetsamUrsulasBaby } from "./046-jetsam-ursulas-baby";

// Flotsam: strength 4, willpower 2
// Jetsam: strength 2, willpower 4

// A defender that kills Flotsam (strength >= 2) and survives Flotsam's attack (willpower >= 5)
const toughDefender = createMockCharacter({
  id: "flotsam-ub-tough-defender",
  name: "Tough Defender",
  cost: 3,
  strength: 3,
  willpower: 6,
});

// A strong attacker that kills Flotsam when Flotsam is defending (strength >= 2)
const strongAttacker = createMockCharacter({
  id: "flotsam-ub-strong-attacker",
  name: "Strong Attacker",
  cost: 3,
  strength: 5,
  willpower: 5,
});

// A strong attacker that kills Jetsam (strength >= 4)
const jetsamKiller = createMockCharacter({
  id: "flotsam-ub-jetsam-killer",
  name: "Jetsam Killer",
  cost: 4,
  strength: 5,
  willpower: 5,
});

describe('Flotsam - Ursula\'s "Baby"', () => {
  describe("QUICK ESCAPE — When this character is banished in a challenge, return this card to your hand.", () => {
    it("returns to hand when banished while attacking in a challenge", () => {
      // Flotsam (str 4, wp 2) attacks toughDefender (str 3, wp 6)
      // Flotsam takes 3 damage → banished (wp 2 < 3)
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: flotsamUrsulasBaby, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: toughDefender, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(flotsamUrsulasBaby, toughDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(flotsamUrsulasBaby)).toBe("hand");
    });

    it("returns to hand when banished while defending in a challenge", () => {
      // strongAttacker (str 5) attacks Flotsam (wp 2) — Flotsam banished
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: strongAttacker, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: flotsamUrsulasBaby, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(strongAttacker, flotsamUrsulasBaby),
      ).toBeSuccessfulCommand();

      if (testEngine.asPlayerTwo().getBagCount() > 0) {
        expect(
          testEngine.asPlayerTwo().resolvePendingByCard(flotsamUrsulasBaby),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerTwo().getCardZone(flotsamUrsulasBaby)).toBe("hand");
    });

    it("does not return to hand when banished outside a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: flotsamUrsulasBaby, isDrying: false }],
          deck: 5,
        },
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().playCard(dragonFire, {
          targets: [flotsamUrsulasBaby],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(flotsamUrsulasBaby)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });

  describe("OMINOUS PAIR — Your characters named Jetsam gain 'When this character is banished in a challenge, return this card to your hand.'", () => {
    it("Jetsam gains return-to-hand ability when Flotsam is in play", () => {
      // jetsamKiller (str 5) attacks Jetsam (wp 4) — Jetsam banished
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: flotsamUrsulasBaby, isDrying: false },
            { card: jetsamUrsulasBaby, exerted: true, isDrying: false },
          ],
          deck: 5,
        },
        {
          play: [{ card: jetsamKiller, isDrying: false }],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().challenge(jetsamKiller, jetsamUrsulasBaby),
      ).toBeSuccessfulCommand();

      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(flotsamUrsulasBaby),
        ).toBeSuccessfulCommand();
      }

      // Jetsam should return to hand via OMINOUS PAIR
      expect(testEngine.asPlayerOne().getCardZone(jetsamUrsulasBaby)).toBe("hand");
    });

    it("Jetsam without Flotsam in play does not gain return-to-hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: jetsamUrsulasBaby, exerted: true, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: jetsamKiller, isDrying: false }],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().challenge(jetsamKiller, jetsamUrsulasBaby),
      ).toBeSuccessfulCommand();

      // Jetsam should NOT return to hand (Flotsam not in play)
      expect(testEngine.asPlayerOne().getCardZone(jetsamUrsulasBaby)).toBe("discard");
    });
  });
});
