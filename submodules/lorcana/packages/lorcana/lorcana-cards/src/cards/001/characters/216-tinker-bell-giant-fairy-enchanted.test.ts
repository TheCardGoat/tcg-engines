import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { tinkerBellGiantFairyEnchanted } from "./216-tinker-bell-giant-fairy-enchanted";

const opponentCharacter = createMockCharacter({
  id: "tink-enc-opponent",
  name: "Opponent Character",
  cost: 2,
  willpower: 5,
  strength: 2,
});

const opponentCharacter2 = createMockCharacter({
  id: "tink-enc-opponent-2",
  name: "Opponent Character 2",
  cost: 2,
  willpower: 3,
  strength: 1,
});

describe("Tinker Bell - Giant Fairy (Enchanted)", () => {
  describe("ROCK THE BOAT - When you play this character, deal 1 damage to each opposing character.", () => {
    it("deals 1 damage to all opposing characters when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [tinkerBellGiantFairyEnchanted],
          inkwell: tinkerBellGiantFairyEnchanted.cost,
        },
        {
          play: [opponentCharacter, opponentCharacter2],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(tinkerBellGiantFairyEnchanted),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(opponentCharacter)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(opponentCharacter2)).toBe(1);
    });

    it("does not deal damage to own characters", () => {
      const ownCharacter = createMockCharacter({
        id: "tink-enc-own",
        name: "Own Character",
        cost: 1,
        willpower: 3,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [tinkerBellGiantFairyEnchanted],
          play: [ownCharacter],
          inkwell: tinkerBellGiantFairyEnchanted.cost,
        },
        {
          play: [opponentCharacter],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(tinkerBellGiantFairyEnchanted),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(ownCharacter)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(opponentCharacter)).toBe(1);
    });
  });

  describe("PUNY PIRATE! - During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen opposing character.", () => {
    it("triggers when Tinker Bell banishes in a challenge", () => {
      const weakOpponent = createMockCharacter({
        id: "tink-enc-weak",
        name: "Weak Opponent",
        cost: 1,
        willpower: 1,
        strength: 1,
      });

      const bystander = createMockCharacter({
        id: "tink-enc-bystander",
        name: "Bystander",
        cost: 2,
        willpower: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tinkerBellGiantFairyEnchanted],
        },
        {
          play: [{ card: weakOpponent, exerted: true }, bystander],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(tinkerBellGiantFairyEnchanted, weakOpponent),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("deals 2 damage to chosen opponent when resolving PUNY PIRATE!", () => {
      const weakOpponent = createMockCharacter({
        id: "tink-enc-weak-2",
        name: "Weak Opponent 2",
        cost: 1,
        willpower: 1,
        strength: 1,
      });

      const bystander = createMockCharacter({
        id: "tink-enc-bystander-2",
        name: "Bystander 2",
        cost: 2,
        willpower: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tinkerBellGiantFairyEnchanted],
        },
        {
          play: [{ card: weakOpponent, exerted: true }, bystander],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(tinkerBellGiantFairyEnchanted, weakOpponent),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tinkerBellGiantFairyEnchanted, {
          resolveOptional: true,
          targets: [bystander],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(bystander)).toBe(2);
    });

    it("can skip the optional PUNY PIRATE! effect", () => {
      const weakOpponent = createMockCharacter({
        id: "tink-enc-weak-3",
        name: "Weak Opponent 3",
        cost: 1,
        willpower: 1,
        strength: 1,
      });

      const bystander = createMockCharacter({
        id: "tink-enc-bystander-3",
        name: "Bystander 3",
        cost: 2,
        willpower: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tinkerBellGiantFairyEnchanted],
        },
        {
          play: [{ card: weakOpponent, exerted: true }, bystander],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(tinkerBellGiantFairyEnchanted, weakOpponent),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(tinkerBellGiantFairyEnchanted, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(bystander)).toBe(0);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
