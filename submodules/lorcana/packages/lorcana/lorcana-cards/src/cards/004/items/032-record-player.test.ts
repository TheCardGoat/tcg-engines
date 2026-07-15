import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { recordPlayer } from "./032-record-player";

const songCostThree = createMockSong({
  id: "record-player-song-3",
  name: "Record Player Song Three",
  cost: 3,
  text: "A test song.",
  abilities: [],
});

const strengthTarget = createMockCharacter({
  id: "record-player-target",
  name: "Strength Target",
  cost: 3,
  strength: 5,
  willpower: 5,
});

// Singer 3 character (can sing songs costing up to 3)
const nonStitchSinger = createMockCharacter({
  id: "record-player-singer",
  name: "Non Stitch Singer",
  cost: 3,
  abilities: [
    {
      id: "record-player-singer-ability",
      type: "keyword",
      keyword: "Singer",
      value: 3,
      text: "Singer 3",
    },
  ],
});

// Stitch character with cost 3 (no Singer keyword, base threshold = 3)
const stitchCharacter = createMockCharacter({
  id: "record-player-stitch",
  name: "Stitch",
  cost: 3,
});

// A song costing 4 (Stitch can't sing this without Record Player, but can with +1 threshold)
const songCostFour = createMockSong({
  id: "record-player-song-4",
  name: "Record Player Song Four",
  cost: 4,
  text: "An expensive test song.",
  abilities: [],
});

describe("Record Player", () => {
  describe("LOOK AT THIS! — Whenever you play a song, chosen character gets -2 {S} until the start of your next turn.", () => {
    it("triggers when you play a song and reduces the chosen character's strength by 2", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [songCostThree],
        inkwell: songCostThree.cost,
        play: [recordPlayer, strengthTarget],
      });

      const baseStrength = testEngine.asPlayerOne().getCardStrength(strengthTarget);

      expect(testEngine.asPlayerOne().playCard(songCostThree)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(recordPlayer, { targets: [strengthTarget] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(strengthTarget)).toBe(baseStrength - 2);
    });

    it("the -2 strength effect expires at the start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [songCostThree],
          inkwell: songCostThree.cost,
          play: [recordPlayer, strengthTarget],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      const baseStrength = testEngine.asPlayerOne().getCardStrength(strengthTarget);

      expect(testEngine.asPlayerOne().playCard(songCostThree)).toBeSuccessfulCommand();
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(recordPlayer, { targets: [strengthTarget] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(strengthTarget)).toBe(baseStrength - 2);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(strengthTarget)).toBe(baseStrength - 2);

      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(strengthTarget)).toBe(baseStrength);
    });

    it("does not trigger when an opponent plays a song", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [recordPlayer, strengthTarget],
          deck: 1,
        },
        {
          hand: [songCostThree],
          inkwell: songCostThree.cost,
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().playCard(songCostThree)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });

  describe("HIT PARADE — Your characters named Stitch count as having +1 cost to sing songs.", () => {
    it("increases the singer threshold of Stitch characters by 1", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [songCostFour],
        inkwell: songCostFour.cost,
        play: [recordPlayer, { card: stitchCharacter, isDrying: false }],
      });

      // Without Record Player, Stitch (cost 3) cannot sing a song costing 4
      // With Record Player, Stitch threshold = 4, so they CAN sing a cost 4 song
      expect(
        testEngine.asPlayerOne().singSong(songCostFour, stitchCharacter),
      ).toBeSuccessfulCommand();
    });

    it("does not affect the singer threshold of non-Stitch characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [songCostFour],
        inkwell: songCostFour.cost,
        play: [recordPlayer, { card: nonStitchSinger, isDrying: false }],
      });

      // nonStitchSinger has Singer 3, cannot sing a song costing 4 (no modifier)
      expect(
        testEngine.asPlayerOne().singSong(songCostFour, nonStitchSinger),
      ).not.toBeSuccessfulCommand();
    });
  });
});
