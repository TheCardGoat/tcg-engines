import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { herculesMightyLeader } from "./118-hercules-mighty-leader";

const opponent = createMockCharacter({
  id: "hercules-test-opponent",
  name: "Test Opponent",
  cost: 3,
  strength: 3,
  willpower: 8, // High willpower so it survives
  lore: 1,
});

const heroAlly = createMockCharacter({
  id: "hercules-test-hero-ally",
  name: "Test Hero Ally",
  cost: 2,
  strength: 2,
  willpower: 8,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const nonHeroAlly = createMockCharacter({
  id: "hercules-test-non-hero",
  name: "Test Non-Hero",
  cost: 2,
  strength: 2,
  willpower: 8,
  lore: 1,
  classifications: ["Storyborn", "Villain"],
});

const damageAction = createMockAction({
  id: "hercules-test-damage-action",
  name: "Test Damage Action",
  cost: 2,
  abilities: [
    {
      type: "action",
      text: "Deal 2 damage to chosen character.",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: {
          selector: "chosen",
          count: 1,
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
});

describe("Hercules - Mighty Leader", () => {
  describe("EVER VIGILANT - This character can't be dealt damage unless he's being challenged.", () => {
    it("does NOT take damage when challenging (as attacker)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: herculesMightyLeader, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: opponent, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(herculesMightyLeader, opponent),
      ).toBeSuccessfulCommand();

      // Hercules should NOT take damage as attacker (protected by EVER VIGILANT)
      expect(testEngine.asPlayerOne().getDamage(herculesMightyLeader)).toBe(0);
      // Opponent SHOULD take damage from Hercules (5 strength)
      expect(testEngine.asPlayerTwo().getDamage(opponent)).toBe(herculesMightyLeader.strength);
    });

    it("DOES take damage when being challenged (as defender)", () => {
      const weakOpponent = createMockCharacter({
        id: "hercules-test-weak-opponent",
        name: "Weak Opponent",
        cost: 1,
        strength: 1,
        willpower: 8,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: herculesMightyLeader, exerted: true, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: weakOpponent, isDrying: false }],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(weakOpponent, herculesMightyLeader),
      ).toBeSuccessfulCommand();

      // Hercules SHOULD take damage when being challenged as defender (1 damage, won't be banished)
      expect(testEngine.asPlayerOne().getDamage(herculesMightyLeader)).toBe(weakOpponent.strength);
      // Opponent should also take damage from Hercules
      expect(testEngine.asPlayerTwo().getDamage(weakOpponent)).toBe(herculesMightyLeader.strength);
    });

    it("does NOT take damage from action effects", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [herculesMightyLeader],
          deck: 5,
        },
        {
          hand: [damageAction],
          inkwell: damageAction.cost,
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().playCard(damageAction, { targets: [herculesMightyLeader] }),
      ).toBeSuccessfulCommand();

      // Hercules should NOT take damage from actions
      expect(testEngine.asPlayerOne().getDamage(herculesMightyLeader)).toBe(0);
    });
  });

  describe("EVER VALIANT - While this character is exerted, your other Hero characters can't be dealt damage unless they're being challenged.", () => {
    it("protects other Hero characters from action damage when Hercules is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: herculesMightyLeader, exerted: true, isDrying: false }, heroAlly],
          deck: 5,
        },
        {
          hand: [damageAction],
          inkwell: damageAction.cost,
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().playCard(damageAction, { targets: [heroAlly] }),
      ).toBeSuccessfulCommand();

      // Hero ally should NOT take damage (protected by EVER VALIANT)
      expect(testEngine.asPlayerOne().getDamage(heroAlly)).toBe(0);
    });

    it("does NOT protect non-Hero characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: herculesMightyLeader, exerted: true, isDrying: false }, nonHeroAlly],
          deck: 5,
        },
        {
          hand: [damageAction],
          inkwell: damageAction.cost,
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().playCard(damageAction, { targets: [nonHeroAlly] }),
      ).toBeSuccessfulCommand();

      // Non-hero should take damage
      expect(testEngine.asPlayerOne().getDamage(nonHeroAlly)).toBe(2);
    });

    it("does NOT protect Hero characters when Hercules is ready", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: herculesMightyLeader, isDrying: false }, heroAlly],
          deck: 5,
        },
        {
          hand: [damageAction],
          inkwell: damageAction.cost,
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().playCard(damageAction, { targets: [heroAlly] }),
      ).toBeSuccessfulCommand();

      // Hero ally should take damage (Hercules is not exerted)
      expect(testEngine.asPlayerOne().getDamage(heroAlly)).toBe(2);
    });

    it("allows protected Hero to take damage when being challenged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: herculesMightyLeader, exerted: true, isDrying: false },
            { card: heroAlly, exerted: true, isDrying: false },
          ],
          deck: 5,
        },
        {
          play: [{ card: opponent, isDrying: false }],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent challenges hero ally (who is exerted and can be challenged)
      expect(testEngine.asPlayerTwo().challenge(opponent, heroAlly)).toBeSuccessfulCommand();

      // Hero ally SHOULD take damage when being challenged (exception to EVER VALIANT)
      expect(testEngine.asPlayerOne().getDamage(heroAlly)).toBe(opponent.strength);
    });
  });
});
