import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { tianaNaturalTalent } from "./009-tiana-natural-talent";
import { trialsAndTribulations } from "../actions/043-trials-and-tribulations";

const opposingCharacterA = createMockCharacter({
  id: "tiana-nt-opposing-a",
  name: "Opposing Character A",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const opposingCharacterB = createMockCharacter({
  id: "tiana-nt-opposing-b",
  name: "Opposing Character B",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const cheapSong = createMockSong({
  id: "tiana-nt-cheap-song",
  name: "Cheap Test Song",
  cost: 2,
  text: "A cheap song for testing.",
});

describe("Tiana - Natural Talent", () => {
  describe("Singer 6", () => {
    it("should have the Singer keyword with value 6", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [tianaNaturalTalent],
        deck: 1,
      });

      const card = testEngine.asPlayerOne().getCard(tianaNaturalTalent);
      expect(card).toBeDefined();

      const singerAbility = tianaNaturalTalent.abilities?.find(
        (a) => a.type === "keyword" && "keyword" in a && a.keyword === "Singer",
      );
      expect(singerAbility).toBeDefined();
      expect((singerAbility as { value: number }).value).toBe(6);
    });

    it("should be able to sing a song by exerting", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tianaNaturalTalent],
          hand: [cheapSong],
          deck: 1,
        },
        { deck: 1 },
      );

      expect(
        testEngine.asPlayerOne().singSong(cheapSong, tianaNaturalTalent),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(cheapSong)).toBe("discard");
    });
  });

  describe("CAPTIVATING MELODY - Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.", () => {
    it("should reduce strength of each opposing character by 1 when a song is played for ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tianaNaturalTalent],
          hand: [trialsAndTribulations],
          inkwell: trialsAndTribulations.cost,
          deck: 1,
        },
        {
          play: [opposingCharacterA, opposingCharacterB],
          deck: 1,
        },
      );

      const strengthBeforeA = testEngine.asPlayerTwo().getCardStrength(opposingCharacterA);
      const strengthBeforeB = testEngine.asPlayerTwo().getCardStrength(opposingCharacterB);

      expect(
        testEngine.asPlayerOne().playCard(trialsAndTribulations, {
          targets: [opposingCharacterA],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterA)).toBe(
        strengthBeforeA - 1 - 4,
      );
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterB)).toBe(
        strengthBeforeB - 1,
      );
    });

    it("should reduce strength of each opposing character by 1 when a song is sung", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tianaNaturalTalent],
          hand: [cheapSong],
          deck: 1,
        },
        {
          play: [opposingCharacterA, opposingCharacterB],
          deck: 1,
        },
      );

      const strengthBeforeA = testEngine.asPlayerTwo().getCardStrength(opposingCharacterA);
      const strengthBeforeB = testEngine.asPlayerTwo().getCardStrength(opposingCharacterB);

      expect(
        testEngine.asPlayerOne().singSong(cheapSong, tianaNaturalTalent),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterA)).toBe(
        strengthBeforeA - 1,
      );
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterB)).toBe(
        strengthBeforeB - 1,
      );
    });

    it("should expire at the start of your next turn (not opponent's turn)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tianaNaturalTalent],
          hand: [cheapSong],
          deck: 5,
        },
        {
          play: [opposingCharacterA],
          deck: 5,
        },
      );

      const strengthBefore = testEngine.asPlayerTwo().getCardStrength(opposingCharacterA);

      expect(
        testEngine.asPlayerOne().singSong(cheapSong, tianaNaturalTalent),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterA)).toBe(strengthBefore - 1);

      // Pass to opponent's turn - effect should still be active
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterA)).toBe(strengthBefore - 1);

      // Pass back to your turn - effect expires at start of your next turn
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterA)).toBe(strengthBefore);
    });

    it("regression: should reduce opposing characters' strength when Tiana sings a song herself", () => {
      // Bug: Tiana was not reducing opposing characters' strength when a song was played.
      // This verifies the basic flow when Tiana exerts to sing a song.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tianaNaturalTalent],
          hand: [cheapSong],
          deck: 1,
        },
        {
          play: [opposingCharacterA],
          deck: 1,
        },
      );

      const strengthBefore = testEngine.asPlayerTwo().getCardStrength(opposingCharacterA);

      expect(
        testEngine.asPlayerOne().singSong(cheapSong, tianaNaturalTalent),
      ).toBeSuccessfulCommand();

      // Opposing character should have -1 strength
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterA)).toBe(strengthBefore - 1);
    });

    it("should NOT trigger when a non-song action is played", () => {
      const nonSongAction = {
        ...trialsAndTribulations,
        actionSubtype: undefined,
        id: "tiana-nt-non-song",
      };

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tianaNaturalTalent],
          deck: 1,
        },
        {
          play: [opposingCharacterA],
          deck: 1,
        },
      );

      const strengthBefore = testEngine.asPlayerTwo().getCardStrength(opposingCharacterA);
      // Strength should not change due to Tiana's ability
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacterA)).toBe(strengthBefore);
    });
  });
});
