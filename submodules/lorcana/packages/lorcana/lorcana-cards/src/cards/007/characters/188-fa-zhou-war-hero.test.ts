import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { faZhouWarHero } from "./188-fa-zhou-war-hero";

const challenger = createMockCharacter({
  id: "fa-zhou-test-challenger",
  name: "Challenger",
  cost: 2,
  strength: 1,
  willpower: 10,
});

const defender = createMockCharacter({
  id: "fa-zhou-test-defender",
  name: "Defender",
  cost: 2,
  strength: 1,
  willpower: 10,
});

describe("Fa Zhou - War Hero", () => {
  describe("TRAINING EXERCISES - Whenever one of your characters challenges another character, if it's the second challenge this turn, gain 3 lore.", () => {
    it("does NOT gain lore on the first challenge of the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: faZhouWarHero, isDrying: false },
            { card: challenger, isDrying: false },
          ],
          deck: 2,
        },
        {
          play: [{ card: defender, exerted: true }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().challenge(challenger, defender)).toBeSuccessfulCommand();

      // First challenge: no lore gained
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    });

    it("gains 3 lore on the second challenge of the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: faZhouWarHero, isDrying: false },
            { card: challenger, isDrying: false },
          ],
          deck: 2,
        },
        {
          play: [{ card: defender, exerted: true }],
          deck: 2,
        },
      );

      // First challenge
      expect(testEngine.asPlayerOne().challenge(challenger, defender)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

      // Ready the challenger so it can challenge again
      const challengerId = testEngine.findCardInstanceId(challenger, "play", PLAYER_ONE);
      testEngine.asServer().manualReadyCard(challengerId);

      // Second challenge
      expect(testEngine.asPlayerOne().challenge(challenger, defender)).toBeSuccessfulCommand();

      // 3 lore gained on second challenge
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(3);
    });

    it("does NOT gain lore on the third or subsequent challenges of the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: faZhouWarHero, isDrying: false },
            { card: challenger, isDrying: false },
          ],
          deck: 2,
        },
        {
          play: [{ card: defender, exerted: true }],
          deck: 2,
        },
      );

      // First challenge
      expect(testEngine.asPlayerOne().challenge(challenger, defender)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

      // Ready and second challenge
      const challengerId = testEngine.findCardInstanceId(challenger, "play", PLAYER_ONE);
      testEngine.asServer().manualReadyCard(challengerId);
      expect(testEngine.asPlayerOne().challenge(challenger, defender)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(3);

      // Ready and third challenge
      testEngine.asServer().manualReadyCard(challengerId);
      expect(testEngine.asPlayerOne().challenge(challenger, defender)).toBeSuccessfulCommand();

      // No additional lore on third challenge
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(3);
    });

    it("triggers when Fa Zhou himself is the challenger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: faZhouWarHero, isDrying: false },
            { card: challenger, isDrying: false },
          ],
          deck: 2,
        },
        {
          play: [{ card: defender, exerted: true }],
          deck: 2,
        },
      );

      // First challenge with the generic challenger (not Fa Zhou)
      expect(testEngine.asPlayerOne().challenge(challenger, defender)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

      // Ready Fa Zhou and have him challenge second (Fa Zhou is the attacker this time)
      const faZhouId = testEngine.findCardInstanceId(faZhouWarHero, "play", PLAYER_ONE);
      testEngine.asServer().manualReadyCard(faZhouId);
      expect(testEngine.asPlayerOne().challenge(faZhouWarHero, defender)).toBeSuccessfulCommand();

      // 3 lore gained on second challenge (Fa Zhou challenged)
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(3);
    });

    it("does NOT gain lore when the second challenge of the turn targets a location", () => {
      const location = createMockLocation({
        id: "fa-zhou-test-location",
        name: "Test Location",
        cost: 2,
        willpower: 8,
        lore: 0,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: faZhouWarHero, isDrying: false },
            { card: challenger, isDrying: false },
          ],
          deck: 2,
        },
        {
          play: [{ card: defender, exerted: true }, location],
          deck: 2,
        },
      );

      // First challenge: character vs character
      expect(testEngine.asPlayerOne().challenge(challenger, defender)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

      // Ready the challenger so it can challenge again
      const challengerId = testEngine.findCardInstanceId(challenger, "play", PLAYER_ONE);
      testEngine.asServer().manualReadyCard(challengerId);

      // Second challenge: targets a location. Card text says "another character",
      // so lore must NOT be gained even though it's the second challenge of the turn.
      expect(testEngine.asPlayerOne().challenge(challenger, location)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    });
  });
});
