import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mrSmeeEfficientCaptain } from "./107-mr-smee-efficient-captain";
import { gatheringKnowledgeAndWisdom } from "../../005/actions/062-gathering-knowledge-and-wisdom";
import { hesATramp } from "../actions/117-hes-a-tramp";

const pirateCharacter = createMockCharacter({
  id: "smee-test-pirate",
  name: "Test Pirate",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Pirate"],
});

const nonPirateCharacter = createMockCharacter({
  id: "smee-test-non-pirate",
  name: "Test Non-Pirate",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

describe("Mr. Smee - Efficient Captain", () => {
  describe("PIPE UP THE CREW - Whenever you play an action that isn't a song, you may ready chosen Pirate character.", () => {
    it("triggers when a non-song action is played, readying a chosen Pirate character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mrSmeeEfficientCaptain, { card: pirateCharacter, exerted: true }],
          hand: [gatheringKnowledgeAndWisdom],
          inkwell: gatheringKnowledgeAndWisdom.cost,
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      // Pirate character should be exerted before playing the action
      expect(testEngine.asPlayerOne().isExerted(pirateCharacter)).toBe(true);

      // Play a non-song action
      expect(
        testEngine.asPlayerOne().playCard(gatheringKnowledgeAndWisdom),
      ).toBeSuccessfulCommand();

      // Triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      // Accept the optional trigger
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mrSmeeEfficientCaptain, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Choose the pirate character as the target to ready
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [pirateCharacter] }),
      ).toBeSuccessfulCommand();

      // Pirate character should now be ready
      expect(testEngine.asPlayerOne().isExerted(pirateCharacter)).toBe(false);
    });

    it("does NOT trigger when a song is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mrSmeeEfficientCaptain, { card: pirateCharacter, exerted: true }],
          hand: [hesATramp],
          inkwell: hesATramp.cost,
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      // Play the song - target Mr. Smee to satisfy the song's target requirement
      expect(
        testEngine.asPlayerOne().playCard(hesATramp, { targets: [mrSmeeEfficientCaptain] }),
      ).toBeSuccessfulCommand();

      // No triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Pirate character should still be exerted
      expect(testEngine.asPlayerOne().isExerted(pirateCharacter)).toBe(true);
    });

    it("regression: does NOT trigger when a song is sung (not just played as a song card)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mrSmeeEfficientCaptain, { card: pirateCharacter, isDrying: false }],
          hand: [hesATramp],
          inkwell: hesATramp.cost,
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      // Sing the song (using a character as singer)
      expect(testEngine.asPlayerOne().singSong(hesATramp, pirateCharacter)).toBeSuccessfulCommand();

      // Smee's ability should NOT trigger for a sung song
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Pirate character should be exerted from singing, not readied by Smee
      expect(testEngine.asPlayerOne().isExerted(pirateCharacter)).toBe(true);
    });
  });
});
