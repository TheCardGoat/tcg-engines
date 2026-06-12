import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { kuzcoTemperamentalEmperor } from "./069-kuzco-temperamental-emperor";

const weakAttacker = createMockCharacter({
  id: "kuzco-te-weak-attacker",
  name: "Weak Attacker",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const strongAttacker = createMockCharacter({
  id: "kuzco-te-strong-attacker",
  name: "Strong Attacker",
  cost: 4,
  strength: 10,
  willpower: 3,
  lore: 1,
});

describe("Kuzco - Temperamental Emperor", () => {
  describe("Ward", () => {
    it("has the Ward keyword", () => {
      const testEngine = new LorcanaTestEngine({
        play: [kuzcoTemperamentalEmperor],
      });

      const cardModel = testEngine.getCardModel(kuzcoTemperamentalEmperor);
      expect(cardModel.hasWard()).toBe(true);
    });
  });

  describe("NO TOUCHY! — When this character is challenged and banished, you may banish the challenging character.", () => {
    it("triggers when Kuzco is challenged and banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [strongAttacker],
          deck: 3,
        },
        {
          play: [{ card: kuzcoTemperamentalEmperor, exerted: true }],
          deck: 3,
        },
        {
          startingLore: {
            [PLAYER_ONE]: 0,
            [PLAYER_TWO]: 0,
          },
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(strongAttacker, kuzcoTemperamentalEmperor),
      ).toBeSuccessfulCommand();

      // Kuzco should be banished
      expect(testEngine.asPlayerTwo().getCardZone(kuzcoTemperamentalEmperor)).toBe("discard");

      // Player two should have a bag effect to resolve (optional: banish the attacker)
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
    });

    it("banishes the challenging character when the ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [strongAttacker],
          deck: 3,
        },
        {
          play: [{ card: kuzcoTemperamentalEmperor, exerted: true }],
          deck: 3,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(strongAttacker, kuzcoTemperamentalEmperor),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
      expect(
        testEngine
          .asPlayerTwo()
          .resolvePendingByCard(kuzcoTemperamentalEmperor, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(strongAttacker)).toBe("discard");
    });

    it("does not banish the challenging character when the ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [strongAttacker],
          deck: 3,
        },
        {
          play: [{ card: kuzcoTemperamentalEmperor, exerted: true }],
          deck: 3,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(strongAttacker, kuzcoTemperamentalEmperor),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
      expect(
        testEngine
          .asPlayerTwo()
          .resolvePendingByCard(kuzcoTemperamentalEmperor, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(strongAttacker)).toBe("play");
    });

    it("does not trigger when Kuzco survives a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [weakAttacker],
          deck: 3,
        },
        {
          play: [{ card: kuzcoTemperamentalEmperor, exerted: true }],
          deck: 3,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(weakAttacker, kuzcoTemperamentalEmperor),
      ).toBeSuccessfulCommand();

      // Kuzco survives (willpower 4 > attacker strength 2)
      expect(testEngine.asPlayerTwo().getCardZone(kuzcoTemperamentalEmperor)).toBe("play");

      // No bag effect should be present
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });
  });
});
