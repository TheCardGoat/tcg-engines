import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { johnSilverVengefulPirate } from "./109-john-silver-vengeful-pirate";
import { gatheringKnowledgeAndWisdom } from "../../005/actions/062-gathering-knowledge-and-wisdom";
import { hesATramp } from "../actions/117-hes-a-tramp";

const opponentCharacter = createMockCharacter({
  id: "john-silver-test-opponent-char",
  name: "Opponent Character",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const playerCharacter = createMockCharacter({
  id: "john-silver-test-player-char",
  name: "Player Character",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const challengerCharacter = createMockCharacter({
  id: "john-silver-test-challenger",
  name: "Challenger",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
});

describe("John Silver - Vengeful Pirate", () => {
  describe("DRAWN TO A FIGHT - If an opposing character was damaged this turn, you pay 2 {I} less to play this character.", () => {
    it("does NOT reduce the cost if no opposing character was damaged this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [johnSilverVengefulPirate],
          inkwell: johnSilverVengefulPirate.cost,
          deck: 1,
        },
        {
          play: [opponentCharacter],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().getCard(johnSilverVengefulPirate).playCost).toBe(
        johnSilverVengefulPirate.cost,
      );
    });

    it("reduces the cost by 2 when an opposing character was damaged this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [johnSilverVengefulPirate],
          play: [{ card: challengerCharacter, isDrying: false }],
          inkwell: johnSilverVengefulPirate.cost,
          deck: 1,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 1,
        },
      );

      // Before challenging, cost should be full
      expect(testEngine.asPlayerOne().getCard(johnSilverVengefulPirate).playCost).toBe(
        johnSilverVengefulPirate.cost,
      );

      // Challenge opponent character to damage it
      expect(
        testEngine.asPlayerOne().challenge(challengerCharacter, opponentCharacter),
      ).toBeSuccessfulCommand();

      // After dealing damage to opposing character, cost should be reduced by 2
      expect(testEngine.asPlayerOne().getCard(johnSilverVengefulPirate).playCost).toBe(
        johnSilverVengefulPirate.cost - 2,
      );
    });

    it("can be played with the reduced cost", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [johnSilverVengefulPirate],
          play: [{ card: challengerCharacter, isDrying: false }],
          inkwell: johnSilverVengefulPirate.cost - 2,
          deck: 1,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 1,
        },
      );

      // Challenge opponent character to damage it
      expect(
        testEngine.asPlayerOne().challenge(challengerCharacter, opponentCharacter),
      ).toBeSuccessfulCommand();

      // Should be able to play John Silver with reduced cost
      expect(testEngine.asPlayerOne().playCard(johnSilverVengefulPirate)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(johnSilverVengefulPirate)).toBe("play");
    });
  });

  describe("Resist +1", () => {
    it("has the Resist keyword with value 1", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [johnSilverVengefulPirate],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().hasKeyword(johnSilverVengefulPirate, "Resist")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(johnSilverVengefulPirate, "Resist")).toBe(1);
    });

    it("reduces damage taken in a challenge by 1", () => {
      const attacker = createMockCharacter({
        id: "john-silver-test-attacker-resist",
        name: "Attacker",
        cost: 3,
        strength: 4,
        willpower: 2,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: johnSilverVengefulPirate, exerted: true }],
          deck: 1,
        },
        {
          play: [attacker],
          deck: 1,
        },
      );

      // Pass turn to player two so they can challenge
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(attacker, johnSilverVengefulPirate),
      ).toBeSuccessfulCommand();

      // Attacker strength 4, Resist +1 reduces to 3 damage
      expect(testEngine.asPlayerOne().getDamage(johnSilverVengefulPirate)).toBe(
        attacker.strength - 1,
      );
    });
  });

  describe("I AIN'T GONE SOFT! - Whenever you play an action that isn't a song, you may deal 1 damage to chosen character.", () => {
    it("triggers when a non-song action is played, dealing 1 damage to chosen character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [johnSilverVengefulPirate],
          hand: [gatheringKnowledgeAndWisdom],
          inkwell: gatheringKnowledgeAndWisdom.cost,
          deck: 1,
        },
        {
          play: [opponentCharacter],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(gatheringKnowledgeAndWisdom),
      ).toBeSuccessfulCommand();

      // Triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      // Accept the optional trigger
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(johnSilverVengefulPirate, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Choose opponent character as target
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      // Opponent character should have taken 1 damage
      expect(testEngine.asPlayerTwo().getDamage(opponentCharacter)).toBe(1);
    });

    it("does NOT trigger when a song is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [johnSilverVengefulPirate],
          hand: [hesATramp],
          inkwell: hesATramp.cost,
          deck: 1,
        },
        {
          play: [opponentCharacter],
          deck: 1,
        },
      );

      // Play the song (He's a Tramp) - target John Silver itself to satisfy the song's target requirement
      expect(
        testEngine.asPlayerOne().playCard(hesATramp, { targets: [johnSilverVengefulPirate] }),
      ).toBeSuccessfulCommand();

      // No triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Opponent character should have no damage
      expect(testEngine.asPlayerTwo().getDamage(opponentCharacter)).toBe(0);
    });

    it("can target own characters as well as opponent characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [johnSilverVengefulPirate, playerCharacter],
        hand: [gatheringKnowledgeAndWisdom],
        inkwell: gatheringKnowledgeAndWisdom.cost,
        deck: 1,
      });

      expect(
        testEngine.asPlayerOne().playCard(gatheringKnowledgeAndWisdom),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(johnSilverVengefulPirate, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [playerCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(playerCharacter)).toBe(1);
    });
  });
});
