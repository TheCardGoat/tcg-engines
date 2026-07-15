import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { syndromesRemote } from "./201-syndromes-remote";

const zeroPointTarget = createMockCharacter({
  id: "syndromes-remote-zero-point-target",
  name: "Zero Point Target",
  cost: 3,
  strength: 3,
  willpower: 4,
});

describe("Syndrome's Remote", () => {
  describe("Zero-Point Energy - {E}, 2 {I} — Chosen character can't challenge during their next turn.", () => {
    it("prevents the chosen character from challenging during their next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: 2,
          play: [syndromesRemote],
        },
        {
          play: [zeroPointTarget],
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(syndromesRemote, {
          ability: "Zero-Point Energy",
          targets: [zeroPointTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo()).toHaveRestriction({
        card: zeroPointTarget,
        restriction: "cant-challenge",
      });
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo()).not.toHaveRestriction({
        card: zeroPointTarget,
        restriction: "cant-challenge",
      });
    });
  });

  describe("Learn From Their Losses - Whenever a Robot character is banished, you may banish this item to discard your hand and draw 2 cards.", () => {
    it("banishes this item, discards the entire hand and draws 2 cards when you accept", () => {
      const robotToBanish = createMockCharacter({
        id: "syndromes-remote-robot-to-banish",
        name: "Robot To Banish",
        cost: 2,
        strength: 2,
        willpower: 1,
        classifications: ["Storyborn", "Robot"],
      });
      const opposingAttacker = createMockCharacter({
        id: "syndromes-remote-opposing-attacker",
        name: "Opposing Attacker",
        cost: 2,
        strength: 3,
        willpower: 3,
      });
      const handCardOne = createMockCharacter({
        id: "syndromes-remote-hand-card-one",
        name: "Hand Card One",
        cost: 1,
      });
      const handCardTwo = createMockCharacter({
        id: "syndromes-remote-hand-card-two",
        name: "Hand Card Two",
        cost: 1,
      });
      const deckTop = createMockCharacter({
        id: "syndromes-remote-deck-top",
        name: "Deck Top",
        cost: 1,
      });
      const deckSecond = createMockCharacter({
        id: "syndromes-remote-deck-second",
        name: "Deck Second",
        cost: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [syndromesRemote, { card: robotToBanish, exerted: true }],
          hand: [handCardOne, handCardTwo],
          deck: [deckTop, deckSecond],
        },
        {
          play: [{ card: opposingAttacker, isDrying: false }],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent challenges our Robot, banishing it (attacker 3 dmg >= willpower 1).
      expect(
        testEngine.asPlayerTwo().challenge(opposingAttacker, robotToBanish),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(robotToBanish)).toBe("discard");

      // Syndrome's Remote triggers; resolve accepting the optional effect.
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(syndromesRemote, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(syndromesRemote)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(handCardOne)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(handCardTwo)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(deckTop)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(deckSecond)).toBe("hand");
    });

    it("can decline the optional ability, keeping the item in play", () => {
      const robotToBanish = createMockCharacter({
        id: "syndromes-remote-robot-decline",
        name: "Robot Decline",
        cost: 2,
        strength: 2,
        willpower: 1,
        classifications: ["Storyborn", "Robot"],
      });
      const opposingAttacker = createMockCharacter({
        id: "syndromes-remote-opposing-decline",
        name: "Opposing Decline",
        cost: 2,
        strength: 3,
        willpower: 3,
      });
      const handCard = createMockCharacter({
        id: "syndromes-remote-hand-decline",
        name: "Hand Decline",
        cost: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [syndromesRemote, { card: robotToBanish, exerted: true }],
          hand: [handCard],
          deck: 2,
        },
        {
          play: [{ card: opposingAttacker, isDrying: false }],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(opposingAttacker, robotToBanish),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(robotToBanish)).toBe("discard");

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(syndromesRemote, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(syndromesRemote)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(handCard)).toBe("hand");
    });

    it("does not trigger when a non-Robot character is banished", () => {
      const nonRobotToBanish = createMockCharacter({
        id: "syndromes-remote-non-robot-to-banish",
        name: "Non Robot To Banish",
        cost: 2,
        strength: 2,
        willpower: 1,
        classifications: ["Storyborn", "Hero"],
      });
      const opposingAttacker = createMockCharacter({
        id: "syndromes-remote-opposing-non-robot",
        name: "Opposing Non-Robot Attacker",
        cost: 2,
        strength: 3,
        willpower: 3,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [syndromesRemote, { card: nonRobotToBanish, exerted: true }],
          hand: 2,
          deck: 3,
        },
        {
          play: [{ card: opposingAttacker, isDrying: false }],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(opposingAttacker, nonRobotToBanish),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(nonRobotToBanish)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(syndromesRemote)).toBe("play");
    });

    it("triggers when an opposing Robot character is banished", () => {
      const opposingRobot = createMockCharacter({
        id: "syndromes-remote-opposing-robot",
        name: "Opposing Robot",
        cost: 2,
        strength: 2,
        willpower: 1,
        classifications: ["Storyborn", "Robot"],
      });
      const ourAttacker = createMockCharacter({
        id: "syndromes-remote-our-attacker",
        name: "Our Attacker",
        cost: 2,
        strength: 3,
        willpower: 3,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [syndromesRemote, ourAttacker],
          hand: 0,
          deck: 3,
        },
        {
          play: [{ card: opposingRobot, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(ourAttacker, opposingRobot),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(opposingRobot)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });
  });
});
