import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { cinderellaMelodyWeaver } from "./004-cinderella-melody-weaver";

const princessOne = createMockCharacter({
  id: "cinderella-melody-weaver-princess-one",
  name: "Princess One",
  cost: 2,
  lore: 2,
  classifications: ["Storyborn", "Hero", "Princess"],
});

const princessTwo = createMockCharacter({
  id: "cinderella-melody-weaver-princess-two",
  name: "Princess Two",
  cost: 3,
  lore: 1,
  classifications: ["Dreamborn", "Hero", "Princess"],
});

const nonPrincess = createMockCharacter({
  id: "cinderella-melody-weaver-non-princess",
  name: "Non Princess",
  cost: 2,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const testSong = createMockSong({
  id: "cinderella-melody-weaver-song",
  name: "Test Song",
  cost: 3,
  text: "A test song for Cinderella.",
});

describe("Cinderella - Melody Weaver", () => {
  describe("BEAUTIFUL VOICE - Whenever this character sings a song, your other Princess characters get +1 {L} this turn.", () => {
    it("gives other Princess characters +1 lore until end of turn when she sings a song", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [testSong],
        inkwell: testSong.cost,
        play: [
          { card: cinderellaMelodyWeaver, isDrying: false },
          { card: princessOne, isDrying: false },
          { card: princessTwo, isDrying: false },
          { card: nonPrincess, isDrying: false },
        ],
      });

      const initialPrincessOneLore = testEngine.asPlayerOne().getCardLore(princessOne);
      const initialPrincessTwoLore = testEngine.asPlayerOne().getCardLore(princessTwo);
      const initialNonPrincessLore = testEngine.asPlayerOne().getCardLore(nonPrincess);

      expect(
        testEngine.asPlayerOne().singSong(testSong, cinderellaMelodyWeaver),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(princessOne)).toBe(initialPrincessOneLore + 1);
      expect(testEngine.asPlayerOne().getCardLore(princessTwo)).toBe(initialPrincessTwoLore + 1);
      expect(testEngine.asPlayerOne().getCardLore(nonPrincess)).toBe(initialNonPrincessLore);
      expect(testEngine.asPlayerOne().getCardLore(cinderellaMelodyWeaver)).toBe(2);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(princessOne)).toBe(initialPrincessOneLore);
      expect(testEngine.asPlayerOne().getCardLore(princessTwo)).toBe(initialPrincessTwoLore);
      expect(testEngine.asPlayerOne().getCardLore(nonPrincess)).toBe(initialNonPrincessLore);
      expect(testEngine.asPlayerOne().getCardLore(cinderellaMelodyWeaver)).toBe(2);
    });
  });
});
