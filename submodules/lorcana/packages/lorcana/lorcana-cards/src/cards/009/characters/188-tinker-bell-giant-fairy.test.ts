import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { tinkerBellGiantFairy } from "./188-tinker-bell-giant-fairy";

const opponentCharacterA = createMockCharacter({
  id: "tink9-opponent-a",
  name: "Opponent Character A",
  cost: 2,
  willpower: 5,
  strength: 2,
});

const opponentCharacterB = createMockCharacter({
  id: "tink9-opponent-b",
  name: "Opponent Character B",
  cost: 2,
  willpower: 3,
  strength: 1,
});

describe("Tinker Bell - Giant Fairy (Set 9)", () => {
  describe("ROCK THE BOAT — When you play this character, deal 1 damage to each opposing character.", () => {
    it("deals 1 damage to all opposing characters when played from hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [tinkerBellGiantFairy],
          inkwell: tinkerBellGiantFairy.cost,
        },
        {
          play: [opponentCharacterA, opponentCharacterB],
        },
      );

      expect(testEngine.asPlayerOne().playCard(tinkerBellGiantFairy)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(opponentCharacterA)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(opponentCharacterB)).toBe(1);
    });

    it("does not deal damage to own characters", () => {
      const ownCharacter = createMockCharacter({
        id: "tink9-own",
        name: "Own Character",
        cost: 1,
        willpower: 3,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [tinkerBellGiantFairy],
          play: [ownCharacter],
          inkwell: tinkerBellGiantFairy.cost,
        },
        {
          play: [opponentCharacterA],
        },
      );

      expect(testEngine.asPlayerOne().playCard(tinkerBellGiantFairy)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(ownCharacter)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(opponentCharacterA)).toBe(1);
    });

    it("does not deal damage when no opposing characters are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [tinkerBellGiantFairy],
          inkwell: tinkerBellGiantFairy.cost,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(tinkerBellGiantFairy)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });

  describe("PUNY PIRATE! — During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen opposing character.", () => {
    it("triggers when Tinker Bell banishes an opposing character in a challenge", () => {
      const weakOpponent = createMockCharacter({
        id: "tink9-weak",
        name: "Weak Opponent",
        cost: 1,
        willpower: 1,
        strength: 1,
      });

      const bystander = createMockCharacter({
        id: "tink9-bystander",
        name: "Bystander",
        cost: 2,
        willpower: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tinkerBellGiantFairy],
        },
        {
          play: [{ card: weakOpponent, exerted: true }, bystander],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(tinkerBellGiantFairy, weakOpponent),
      ).toBeSuccessfulCommand();

      // weakOpponent should be banished
      expect(testEngine.asPlayerTwo().getCardZone(weakOpponent)).toBe("discard");

      // PUNY PIRATE! triggers — optional bag effect for dealing 2 damage
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("deals 2 damage to a chosen opposing character when the optional effect is resolved", () => {
      const weakOpponent = createMockCharacter({
        id: "tink9-weak-2",
        name: "Weak Opponent 2",
        cost: 1,
        willpower: 1,
        strength: 1,
      });

      const bystander = createMockCharacter({
        id: "tink9-bystander-2",
        name: "Bystander 2",
        cost: 3,
        willpower: 6,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tinkerBellGiantFairy],
          deck: 2,
        },
        {
          play: [{ card: weakOpponent, exerted: true }, bystander],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(tinkerBellGiantFairy, weakOpponent),
      ).toBeSuccessfulCommand();

      // Resolve the optional effect by accepting it and targeting the bystander
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(tinkerBellGiantFairy, { targets: [bystander] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(bystander)).toBe(2);
    });

    it("does not deal damage when the optional effect is declined", () => {
      const weakOpponent = createMockCharacter({
        id: "tink9-weak-3",
        name: "Weak Opponent 3",
        cost: 1,
        willpower: 1,
        strength: 1,
      });

      const bystander = createMockCharacter({
        id: "tink9-bystander-3",
        name: "Bystander 3",
        cost: 3,
        willpower: 6,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tinkerBellGiantFairy],
          deck: 2,
        },
        {
          play: [{ card: weakOpponent, exerted: true }, bystander],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(tinkerBellGiantFairy, weakOpponent),
      ).toBeSuccessfulCommand();

      // Decline the optional effect
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(tinkerBellGiantFairy, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(bystander)).toBe(0);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does not trigger when Tinker Bell does not banish the opponent in a challenge", () => {
      // Tinker Bell has 4 strength — use opponent with 5 willpower to survive
      const toughOpponent = createMockCharacter({
        id: "tink9-tough",
        name: "Tough Opponent",
        cost: 3,
        willpower: 5,
        strength: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tinkerBellGiantFairy],
          deck: 2,
        },
        {
          play: [{ card: toughOpponent, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(tinkerBellGiantFairy, toughOpponent),
      ).toBeSuccessfulCommand();

      // toughOpponent survived (5 willpower > 4 strength damage)
      expect(testEngine.asPlayerTwo().getCardZone(toughOpponent)).not.toBe("discard");

      // PUNY PIRATE! should NOT trigger since the opponent was not banished
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
