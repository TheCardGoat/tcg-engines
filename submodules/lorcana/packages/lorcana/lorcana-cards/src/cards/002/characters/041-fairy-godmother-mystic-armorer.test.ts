import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { fairyGodmotherMysticArmorer } from "./041-fairy-godmother-mystic-armorer";

const allyOne = createMockCharacter({
  id: "fg-ma-ally-1",
  name: "Ally One",
  cost: 2,
  strength: 3,
  willpower: 5,
  lore: 1,
});

const allyTwo = createMockCharacter({
  id: "fg-ma-ally-2",
  name: "Ally Two",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const opponentDefender = createMockCharacter({
  id: "fg-ma-opp-defender",
  name: "Opponent Defender",
  cost: 2,
  strength: 5,
  willpower: 2,
  lore: 1,
});

describe("Fairy Godmother - Mystic Armorer", () => {
  describe("Shift 2", () => {
    it("has Shift keyword with cost 2", () => {
      const testEngine = new LorcanaTestEngine({
        play: [fairyGodmotherMysticArmorer],
      });
      const cardModel = testEngine.getCardModel(fairyGodmotherMysticArmorer);
      expect(cardModel.hasShift()).toBe(true);
      expect(cardModel.shiftInkCost).toBe(2);
    });
  });

  describe("FORGET THE COACH, HERE'S A SWORD — Whenever this character quests, your characters gain Challenger +3 and 'When this character is banished in a challenge, return this card to your hand' this turn.", () => {
    it("your characters gain Challenger +3 when this character quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [fairyGodmotherMysticArmorer, allyOne, allyTwo],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      // Before questing, allies should not have Challenger
      expect(testEngine.asPlayerOne().hasKeyword(allyOne, "Challenger")).toBe(false);
      expect(testEngine.asPlayerOne().hasKeyword(allyTwo, "Challenger")).toBe(false);

      // Quest with Fairy Godmother
      expect(testEngine.asPlayerOne().quest(fairyGodmotherMysticArmorer)).toBeSuccessfulCommand();

      // After questing, all your characters should have Challenger +3
      expect(testEngine.asPlayerOne().getKeywordValue(allyOne, "Challenger")).toBe(3);
      expect(testEngine.asPlayerOne().getKeywordValue(allyTwo, "Challenger")).toBe(3);

      // The Fairy Godmother itself should also gain Challenger +3
      expect(
        testEngine.asPlayerOne().getKeywordValue(fairyGodmotherMysticArmorer, "Challenger"),
      ).toBe(3);
    });

    it("Challenger +3 bonus expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [fairyGodmotherMysticArmorer, allyOne],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().quest(fairyGodmotherMysticArmorer)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getKeywordValue(allyOne, "Challenger")).toBe(3);

      // Pass both turns
      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();

      // Challenger should have expired
      expect(testEngine.asPlayerOne().hasKeyword(allyOne, "Challenger")).toBe(false);
    });

    it("your characters gain 'return to hand when banished in challenge' when this character quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [fairyGodmotherMysticArmorer, { card: allyOne, damage: 3 }],
          deck: 2,
        },
        {
          play: [{ card: opponentDefender, exerted: true }],
          deck: 2,
        },
      );

      // Quest with Fairy Godmother to grant the ability
      expect(testEngine.asPlayerOne().quest(fairyGodmotherMysticArmorer)).toBeSuccessfulCommand();

      // Ally One should now have the "return-to-hand-when-banished" ability
      expect(testEngine.hasGrantedAbility(allyOne, "return-to-hand-when-banished")).toBe(true);

      // Challenge with the now-weakened ally (damage 3, willpower 5 -> survives barely if opponent strength 5 = banished)
      expect(testEngine.asPlayerOne().challenge(allyOne, opponentDefender)).toBeSuccessfulCommand();

      // allyOne has willpower 5, takes 5 damage → banished, but should return to hand
      expect(testEngine.asPlayerOne().getCardZone(allyOne)).toBe("hand");
    });

    it("'return to hand when banished in challenge' ability expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [fairyGodmotherMysticArmorer, allyOne],
          deck: 2,
        },
        {
          play: [{ card: opponentDefender, exerted: true }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().quest(fairyGodmotherMysticArmorer)).toBeSuccessfulCommand();
      expect(testEngine.hasGrantedAbility(allyOne, "return-to-hand-when-banished")).toBe(true);

      // Pass both turns
      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();

      // Ability should have expired
      expect(testEngine.hasGrantedAbility(allyOne, "return-to-hand-when-banished")).toBe(false);
    });
  });
});
