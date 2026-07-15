import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { gatheringKnowledgeAndWisdom } from "../../005/actions/062-gathering-knowledge-and-wisdom";
import { trialsAndTribulations } from "../actions/043-trials-and-tribulations";
import { donKarnageAirPirateLeader } from "./108-don-karnage-air-pirate-leader";

const opponentCharacter = createMockCharacter({
  id: "opp-char",
  name: "Opponent Character",
  cost: 3,
  strength: 4,
  willpower: 5,
  lore: 1,
});

describe("Don Karnage - Air Pirate Leader", () => {
  it("has Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [donKarnageAirPirateLeader],
      deck: 1,
    });

    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: donKarnageAirPirateLeader,
      keyword: "Evasive",
    });
  });

  describe("SCORNFUL TAUNT — Whenever you play an action that isn't a song, chosen opposing character gains Reckless during their next turn.", () => {
    it("chosen opposing character gains Reckless during their next turn when a non-song action is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [donKarnageAirPirateLeader],
          hand: [gatheringKnowledgeAndWisdom],
          inkwell: gatheringKnowledgeAndWisdom.cost,
          deck: 3,
        },
        {
          play: [opponentCharacter],
          deck: 3,
        },
      );

      // Reckless should not be active before the action is played
      expect(testEngine.hasKeyword(opponentCharacter, "Reckless")).toBe(false);

      // Play a non-song action (Gathering Knowledge and Wisdom - a lore gain action, no targets)
      expect(
        testEngine.asPlayerOne().playCard(gatheringKnowledgeAndWisdom),
      ).toBeSuccessfulCommand();

      // The SCORNFUL TAUNT triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      // Resolve the bag (triggered ability)
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(donKarnageAirPirateLeader),
      ).toBeSuccessfulCommand();

      // Choose the opposing character as the target for Reckless
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      // During the current turn (player one's turn), the opposing character should NOT have Reckless yet
      expect(testEngine.hasKeyword(opponentCharacter, "Reckless")).toBe(false);

      // Pass turn to opponent's next turn
      testEngine.asServer().passTurn();

      // During the opponent's next turn, the character should have Reckless
      expect(testEngine.hasKeyword(opponentCharacter, "Reckless")).toBe(true);

      // After the opponent's turn ends, Reckless should be gone
      testEngine.asServer().passTurn();
      expect(testEngine.hasKeyword(opponentCharacter, "Reckless")).toBe(false);
    });

    it("does NOT trigger when a song is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [donKarnageAirPirateLeader],
          hand: [trialsAndTribulations],
          inkwell: trialsAndTribulations.cost,
          deck: 3,
        },
        {
          play: [opponentCharacter],
          deck: 3,
        },
      );

      // Play the song (Trials and Tribulations - a song)
      // Songs can be played by spending ink or sung by a character with cost >= song cost
      expect(
        testEngine.asPlayerOne().playCard(trialsAndTribulations, { targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      // The SCORNFUL TAUNT triggered ability should NOT be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
