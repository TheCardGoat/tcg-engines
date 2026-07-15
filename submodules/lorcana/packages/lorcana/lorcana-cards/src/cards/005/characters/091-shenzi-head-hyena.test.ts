import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { shenziHeadHyena } from "./091-shenzi-head-hyena";
import { shenziScarsAccomplice } from "./070-shenzi-scars-accomplice";
import { edLaughingHyena } from "./074-ed-laughing-hyena";
import { banzaiGluttonousPredator } from "./080-banzai-gluttonous-predator";

const damagedDefender = createMockCharacter({
  id: "shenzi-test-damaged-defender",
  name: "Damaged Defender",
  cost: 4,
  strength: 1,
  willpower: 8,
  lore: 1,
});

const undamagedDefender = createMockCharacter({
  id: "shenzi-test-undamaged-defender",
  name: "Undamaged Defender",
  cost: 4,
  strength: 1,
  willpower: 8,
  lore: 1,
});

const nonHyenaAttacker = createMockCharacter({
  id: "shenzi-test-non-hyena",
  name: "Non Hyena Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Shenzi - Head Hyena", () => {
  describe("STICK AROUND FOR DINNER - This character gets +1 {S} for each other Hyena character you have in play", () => {
    it("gains +1 strength when one other Hyena enters play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [shenziHeadHyena],
        hand: [shenziScarsAccomplice],
        inkwell: shenziScarsAccomplice.cost,
        deck: 5,
      });

      const cardUnderTest = testEngine.getCard(shenziHeadHyena);
      expect(cardUnderTest.strength).toBe(shenziHeadHyena.strength);

      expect(testEngine.asPlayerOne().playCard(shenziScarsAccomplice)).toBeSuccessfulCommand();

      expect(testEngine.getCard(shenziHeadHyena).strength).toBe(shenziHeadHyena.strength + 1);
    });

    it("gains +2 strength when two other Hyenas enter play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [shenziHeadHyena],
        hand: [shenziScarsAccomplice, edLaughingHyena],
        inkwell: shenziScarsAccomplice.cost + edLaughingHyena.cost,
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(shenziScarsAccomplice)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(edLaughingHyena)).toBeSuccessfulCommand();

      expect(testEngine.getCard(shenziHeadHyena).strength).toBe(shenziHeadHyena.strength + 2);
    });
  });

  describe("WHAT HAVE WE GOT HERE? - Whenever one of your Hyena characters challenges a damaged character, gain 2 lore", () => {
    it("gains 2 lore when a Hyena character challenges a damaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [shenziHeadHyena, banzaiGluttonousPredator],
          deck: 5,
        },
        {
          play: [{ card: damagedDefender, damage: 1, exerted: true }],
          deck: 5,
        },
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      expect(
        testEngine.asPlayerOne().challenge(banzaiGluttonousPredator, damagedDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
    });

    it("does not gain lore when a Hyena challenges an undamaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [shenziHeadHyena, banzaiGluttonousPredator],
          deck: 5,
        },
        {
          play: [{ card: undamagedDefender, exerted: true }],
          deck: 5,
        },
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      expect(
        testEngine.asPlayerOne().challenge(banzaiGluttonousPredator, undamagedDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });

    it("does not gain lore when a non-Hyena character challenges a damaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [shenziHeadHyena, nonHyenaAttacker],
          deck: 5,
        },
        {
          play: [{ card: damagedDefender, damage: 1, exerted: true }],
          deck: 5,
        },
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      expect(
        testEngine.asPlayerOne().challenge(nonHyenaAttacker, damagedDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });

    it("gains 2 lore for each Hyena challenge against a damaged character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [shenziHeadHyena, banzaiGluttonousPredator],
          deck: 5,
        },
        {
          play: [{ card: damagedDefender, damage: 1, exerted: true }],
          deck: 5,
        },
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      expect(
        testEngine.asPlayerOne().challenge(banzaiGluttonousPredator, damagedDefender),
      ).toBeSuccessfulCommand();
      expect(testEngine.getLore(PLAYER_ONE)).toBe(2);

      expect(
        testEngine.asPlayerOne().challenge(shenziHeadHyena, damagedDefender),
      ).toBeSuccessfulCommand();
      expect(testEngine.getLore(PLAYER_ONE)).toBe(4);
    });
  });
});
