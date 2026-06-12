import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { kronkHeadOfSecurity } from "./185-kronk-head-of-security";

// A weak defender that Kronk can banish in a challenge
const weakDefender = createMockCharacter({
  id: "kronk-hos-weak-defender",
  name: "Weak Defender",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
});

// An eligible character to play for free (cost 5 or less)
const cheapCharacter = createMockCharacter({
  id: "kronk-hos-cheap-character",
  name: "Cheap Character",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 1,
});

// An ineligible character (cost over 5)
const expensiveCharacter = createMockCharacter({
  id: "kronk-hos-expensive-character",
  name: "Expensive Character",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 1,
});

describe("Kronk - Head of Security", () => {
  describe("ARE YOU ON THE LIST? — During your turn, whenever this character banishes another character in a challenge, you may play a character with cost 5 or less for free.", () => {
    it("triggers when Kronk banishes an opponent's character in a challenge and plays a character for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kronkHeadOfSecurity],
          hand: [cheapCharacter],
          deck: 1,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 1,
        },
      );

      const cheapCharacterId = testEngine.findCardInstanceId(cheapCharacter, "hand", PLAYER_ONE);

      // Kronk (strength 6) challenges and banishes weakDefender (willpower 1)
      expect(
        testEngine.asPlayerOne().challenge(kronkHeadOfSecurity, weakDefender),
      ).toBeSuccessfulCommand();

      // Defender is banished
      expect(testEngine.asPlayerOne().getCardZone(weakDefender)).toBe("discard");

      // Bag effect for ARE YOU ON THE LIST? should be waiting
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Resolve the bag effect: choose to play cheapCharacter for free
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kronkHeadOfSecurity, { targets: [cheapCharacterId] }),
      ).toBeSuccessfulCommand();

      // cheapCharacter is now in play (played for free)
      expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("play");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does not allow playing a character with cost greater than 5 for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kronkHeadOfSecurity],
          hand: [expensiveCharacter],
          deck: 1,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 1,
        },
      );

      const expensiveCharacterId = testEngine.findCardInstanceId(
        expensiveCharacter,
        "hand",
        PLAYER_ONE,
      );

      // Kronk banishes the defender
      expect(
        testEngine.asPlayerOne().challenge(kronkHeadOfSecurity, weakDefender),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(weakDefender)).toBe("discard");

      // Bag effect should appear
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
        // Attempting to resolve with the expensive character should fail
        const result = testEngine
          .asPlayerOne()
          .resolvePendingByCard(kronkHeadOfSecurity, { targets: [expensiveCharacterId] });
        // Either fails or the expensive character remains in hand (auto-resolved with no valid target)
        expect(testEngine.asPlayerOne().getCardZone(expensiveCharacter)).toBe("hand");
      } else {
        // If there's no bag (auto-resolved with no valid target), character stays in hand
        expect(testEngine.asPlayerOne().getCardZone(expensiveCharacter)).toBe("hand");
      }
    });

    it("does not trigger when Kronk is not the one banishing", () => {
      // Another ally banishes the defender — Kronk's ability should NOT fire
      // because the trigger is "on: OPPONENT_CHARACTERS" meaning Kronk must be
      // the one banishing (i.e., Kronk banishes an opponent's character)
      const otherAttacker = createMockCharacter({
        id: "kronk-hos-other-attacker",
        name: "Other Attacker",
        cost: 3,
        strength: 5,
        willpower: 5,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kronkHeadOfSecurity, otherAttacker],
          hand: [cheapCharacter],
          deck: 1,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 1,
        },
      );

      // Other attacker banishes defender — Kronk should NOT trigger
      expect(
        testEngine.asPlayerOne().challenge(otherAttacker, weakDefender),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(weakDefender)).toBe("discard");

      // Kronk's ability should NOT trigger (trigger is "on: OPPONENT_CHARACTERS" = this character banishes)
      // Bag from Kronk's ARE YOU ON THE LIST? should not be present
      // Note: the bag check verifies no bag from Kronk's ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("hand");
    });
  });
});
