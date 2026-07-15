import { describe, expect, it } from "bun:test";
import {
  createMockCharacter,
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { rogerRadcliffeDogLover } from "./005-roger-radcliffe-dog-lover";

const woundedPuppy = createMockCharacter({
  id: "roger-test-wounded-puppy",
  name: "Wounded Puppy",
  cost: 2,
  willpower: 5,
  classifications: ["Storyborn", "Puppy"],
});

const woundedNonPuppy = createMockCharacter({
  id: "roger-test-wounded-non-puppy",
  name: "Wounded Ally",
  cost: 2,
  willpower: 5,
  classifications: ["Storyborn", "Ally"],
});

const anotherPuppy = createMockCharacter({
  id: "roger-test-another-puppy",
  name: "Another Puppy",
  cost: 2,
  willpower: 4,
  classifications: ["Storyborn", "Puppy"],
});

describe("Roger Radcliffe - Dog Lover [Set 007]", () => {
  describe("THERE YOU GO - Whenever this character quests, you may remove up to 1 damage from each of your Puppy characters.", () => {
    it("triggers when questing and creates an optional bag effect", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: rogerRadcliffeDogLover }, { card: woundedPuppy, damage: 2 }],
        inkwell: rogerRadcliffeDogLover.cost,
      });

      expect(testEngine.asPlayerOne().quest(rogerRadcliffeDogLover)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("removes up to 1 damage from each Puppy character when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: rogerRadcliffeDogLover },
          { card: woundedPuppy, damage: 2 },
          { card: anotherPuppy, damage: 1 },
          { card: woundedNonPuppy, damage: 2 },
        ],
        inkwell: rogerRadcliffeDogLover.cost,
      });

      const woundedPuppyId = testEngine.findCardInstanceId(woundedPuppy, "play", PLAYER_ONE);
      const anotherPuppyId = testEngine.findCardInstanceId(anotherPuppy, "play", PLAYER_ONE);
      const nonPuppyId = testEngine.findCardInstanceId(woundedNonPuppy, "play", PLAYER_ONE);

      expect(testEngine.asPlayerOne().quest(rogerRadcliffeDogLover)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(rogerRadcliffeDogLover, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asServer().getCard(woundedPuppyId)?.damage).toBe(1);
      expect(testEngine.asServer().getCard(anotherPuppyId)?.damage).toBe(0);
      expect(testEngine.asServer().getCard(nonPuppyId)?.damage).toBe(2);
    });

    it("does not remove damage when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: rogerRadcliffeDogLover }, { card: woundedPuppy, damage: 2 }],
        inkwell: rogerRadcliffeDogLover.cost,
      });

      const woundedPuppyId = testEngine.findCardInstanceId(woundedPuppy, "play", PLAYER_ONE);

      expect(testEngine.asPlayerOne().quest(rogerRadcliffeDogLover)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(rogerRadcliffeDogLover, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asServer().getCard(woundedPuppyId)?.damage).toBe(2);
    });

    it("does not remove more damage than a character has (capped at current damage)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: rogerRadcliffeDogLover }, { card: woundedPuppy, damage: 0 }],
        inkwell: rogerRadcliffeDogLover.cost,
      });

      const woundedPuppyId = testEngine.findCardInstanceId(woundedPuppy, "play", PLAYER_ONE);

      expect(testEngine.asPlayerOne().quest(rogerRadcliffeDogLover)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(rogerRadcliffeDogLover, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asServer().getCard(woundedPuppyId)?.damage).toBe(0);
    });

    it("does not remove damage from opponent's Puppy characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: rogerRadcliffeDogLover }],
          inkwell: rogerRadcliffeDogLover.cost,
        },
        {
          play: [{ card: woundedPuppy, damage: 2 }],
        },
      );

      const opponentPuppyId = testEngine.findCardInstanceId(woundedPuppy, "play", PLAYER_TWO);

      expect(testEngine.asPlayerOne().quest(rogerRadcliffeDogLover)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(rogerRadcliffeDogLover, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asServer().getCard(opponentPuppyId)?.damage).toBe(2);
    });
  });
});
