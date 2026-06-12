import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { peterPanHighFlyer } from "./105-peter-pan-high-flyer";

const nonEvasiveAttacker = createMockCharacter({
  id: "peter-pan-hf-non-evasive-attacker",
  name: "Non-Evasive Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
});

const evasiveAttacker = createMockCharacter({
  id: "peter-pan-hf-evasive-attacker",
  name: "Evasive Attacker",
  cost: 3,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      id: "peter-pan-hf-evasive-attacker-keyword",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

describe("Peter Pan - High Flyer", () => {
  describe("Evasive (Only characters with Evasive can challenge this character.)", () => {
    it("should have Evasive ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [peterPanHighFlyer],
      });

      expect(testEngine.asPlayerOne().hasKeyword(peterPanHighFlyer, "Evasive")).toBe(true);
    });

    it("can challenge another evasive character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [peterPanHighFlyer],
        },
        {
          play: [{ card: evasiveAttacker, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(peterPanHighFlyer, evasiveAttacker),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: peterPanHighFlyer,
        value: evasiveAttacker.strength,
      });
      expect(testEngine.asPlayerTwo()).toHaveDamage({
        card: evasiveAttacker,
        value: peterPanHighFlyer.strength,
      });
    });

    it("can be challenged by another evasive character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: peterPanHighFlyer, exerted: true }],
        },
        {
          play: [evasiveAttacker],
        },
      );

      testEngine.asPlayerOne().passTurn();

      expect(
        testEngine.asPlayerTwo().challenge(evasiveAttacker, peterPanHighFlyer),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: peterPanHighFlyer,
        value: evasiveAttacker.strength,
      });
      expect(testEngine.asPlayerTwo()).toHaveDamage({
        card: evasiveAttacker,
        value: peterPanHighFlyer.strength,
      });
    });

    it("cannot be challenged by non-Evasive characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: peterPanHighFlyer, exerted: true }],
          deck: 1,
        },
        {
          play: [nonEvasiveAttacker],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().canChallenge(nonEvasiveAttacker, peterPanHighFlyer)).toBe(
        false,
      );
    });
  });

  describe("Stats and basic properties", () => {
    it("should have correct stats", () => {
      expect(peterPanHighFlyer.cost).toBe(3);
      expect(peterPanHighFlyer.strength).toBe(1);
      expect(peterPanHighFlyer.willpower).toBe(3);
      expect(peterPanHighFlyer.lore).toBe(2);
    });

    it("should be inkable", () => {
      expect(peterPanHighFlyer.inkable).toBe(true);
    });

    it("should have correct classifications", () => {
      expect(peterPanHighFlyer.classifications).toEqual(["Storyborn", "Hero"]);
    });

    it("should be ruby color", () => {
      expect(peterPanHighFlyer.inkType).toEqual(["ruby"]);
    });
  });

  describe("Gameplay", () => {
    it("should be playable from hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: peterPanHighFlyer.cost,
        hand: [peterPanHighFlyer],
      });

      expect(testEngine.asPlayerOne().playCard(peterPanHighFlyer)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(peterPanHighFlyer)).toBe("play");
    });

    it("can quest for lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [peterPanHighFlyer],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(peterPanHighFlyer)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore("player_one")).toBe(2);
    });
  });
});
