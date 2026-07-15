import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pigletSturdySwordsman } from "./191-piglet-sturdy-swordsman";

const handFodder = createMockCharacter({
  id: "piglet-test-hand-fodder",
  name: "Hand Fodder",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const readyOpponent = createMockCharacter({
  id: "piglet-test-ready-opponent",
  name: "Ready Opponent",
  cost: 3,
  strength: 4,
  willpower: 6,
  lore: 1,
});

const exertedOpponent = createMockCharacter({
  id: "piglet-test-exerted-opponent",
  name: "Exerted Opponent",
  cost: 3,
  strength: 4,
  willpower: 6,
  lore: 1,
});

describe("Piglet - Sturdy Swordsman", () => {
  describe("Resist +1 - Damage dealt to this character is reduced by 1.", () => {
    it("reduces incoming challenge damage by 1", () => {
      const attacker = createMockCharacter({
        id: "piglet-test-attacker",
        name: "Attacker",
        cost: 3,
        strength: 3,
        willpower: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [readyOpponent],
          deck: 5,
        },
        {
          play: [{ card: pigletSturdySwordsman, isDrying: false, exerted: true }],
          deck: 5,
        },
      );

      // Piglet has Resist +1, so it should take strength - 1 damage
      expect(
        testEngine.asPlayerOne().challenge(readyOpponent, pigletSturdySwordsman),
      ).toBeSuccessfulCommand();

      // readyOpponent has strength 4, Piglet has Resist +1, so damage = 4 - 1 = 3
      expect(testEngine.asPlayerTwo().getDamage(pigletSturdySwordsman)).toBe(3);
    });
  });

  describe("NOT SO SMALL ANYMORE - While you have no cards in your hand, this character can challenge ready characters.", () => {
    it("cannot challenge ready characters when controller has cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: pigletSturdySwordsman, isDrying: false }],
          hand: [handFodder],
          deck: 5,
        },
        {
          play: [readyOpponent],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(pigletSturdySwordsman, readyOpponent),
      ).not.toBeSuccessfulCommand();
    });

    it("can challenge ready characters when controller has no cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: pigletSturdySwordsman, isDrying: false }],
          hand: [],
          deck: 5,
        },
        {
          play: [readyOpponent],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(pigletSturdySwordsman, readyOpponent),
      ).toBeSuccessfulCommand();
    });

    it("can still challenge exerted characters regardless of hand state", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: pigletSturdySwordsman, isDrying: false }],
          hand: [handFodder],
          deck: 5,
        },
        {
          play: [{ card: exertedOpponent, exerted: true }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(pigletSturdySwordsman, exertedOpponent),
      ).toBeSuccessfulCommand();
    });

    it("takes reduced damage (Resist +1) when challenging a ready character with empty hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: pigletSturdySwordsman, isDrying: false }],
          hand: [],
          deck: 5,
        },
        {
          play: [readyOpponent],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(pigletSturdySwordsman, readyOpponent),
      ).toBeSuccessfulCommand();

      // readyOpponent has strength 4, Piglet has Resist +1: damage = 4 - 1 = 3
      expect(testEngine.asPlayerOne().getDamage(pigletSturdySwordsman)).toBe(3);
    });
  });
});
