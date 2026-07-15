import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mulanImperialGeneral } from "./141-mulan-imperial-general";

const allyCharacter = createMockCharacter({
  id: "mulan-test-ally",
  name: "Ally Character",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
});

const anotherAllyCharacter = createMockCharacter({
  id: "mulan-test-ally-2",
  name: "Another Ally Character",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
});

const opponentCharacter = createMockCharacter({
  id: "mulan-test-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
});

const readyOpponent = createMockCharacter({
  id: "mulan-test-ready-opponent",
  name: "Ready Opponent",
  cost: 2,
  strength: 1,
  willpower: 5,
  lore: 1,
});

describe("Mulan - Imperial General", () => {
  describe("Shift 5", () => {
    it("has the Shift keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mulanImperialGeneral],
      });

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: mulanImperialGeneral,
        keyword: "Shift",
      });
    });
  });

  describe("Evasive", () => {
    it("has the Evasive keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mulanImperialGeneral],
      });

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: mulanImperialGeneral,
        keyword: "Evasive",
      });
    });
  });

  describe('EXCEPTIONAL LEADER - Whenever this character challenges another character, your other characters gain "This character can challenge ready characters" this turn.', () => {
    it("grants can-challenge-ready to other characters when Mulan challenges", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: mulanImperialGeneral, isDrying: false },
            allyCharacter,
            anotherAllyCharacter,
          ],
          deck: 1,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 1,
        },
      );

      // Before challenge, allies should not have can-challenge-ready
      expect(testEngine.hasGrantedAbility(allyCharacter, "can-challenge-ready")).toBe(false);
      expect(testEngine.hasGrantedAbility(anotherAllyCharacter, "can-challenge-ready")).toBe(false);

      // Mulan challenges the exerted opponent
      expect(
        testEngine.asPlayerOne().challenge(mulanImperialGeneral, opponentCharacter),
      ).toBeSuccessfulCommand();

      // After challenge, other characters should have can-challenge-ready
      expect(testEngine.hasGrantedAbility(allyCharacter, "can-challenge-ready")).toBe(true);
      expect(testEngine.hasGrantedAbility(anotherAllyCharacter, "can-challenge-ready")).toBe(true);
    });

    it("Mulan herself does not gain can-challenge-ready from her own ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mulanImperialGeneral, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(mulanImperialGeneral, opponentCharacter),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasGrantedAbility(mulanImperialGeneral, "can-challenge-ready")).toBe(false);
    });

    it("other characters can challenge ready characters after Mulan challenges", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: mulanImperialGeneral, isDrying: false },
            { card: allyCharacter, isDrying: false },
          ],
          deck: 1,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }, readyOpponent],
          deck: 1,
        },
      );

      // Ally cannot challenge the ready opponent before Mulan challenges
      expect(
        testEngine.asPlayerOne().challenge(allyCharacter, readyOpponent),
      ).not.toBeSuccessfulCommand();

      // Mulan challenges the exerted opponent
      expect(
        testEngine.asPlayerOne().challenge(mulanImperialGeneral, opponentCharacter),
      ).toBeSuccessfulCommand();

      // Now ally should be able to challenge the ready opponent
      expect(
        testEngine.asPlayerOne().challenge(allyCharacter, readyOpponent),
      ).toBeSuccessfulCommand();
    });

    it("the can-challenge-ready effect expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mulanImperialGeneral, isDrying: false }, allyCharacter],
          deck: 1,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(mulanImperialGeneral, opponentCharacter),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasGrantedAbility(allyCharacter, "can-challenge-ready")).toBe(true);

      // Pass turns to end the turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.hasGrantedAbility(allyCharacter, "can-challenge-ready")).toBe(false);
    });
  });
});
