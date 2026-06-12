import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { theSultanRoyalApparition } from "./073-the-sultan-royal-apparition";

const illusionCharacter = createMockCharacter({
  id: "sultan-illusion-ally",
  name: "Illusion Ally",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Dreamborn", "Illusion"],
});

const nonIllusionCharacter = createMockCharacter({
  id: "sultan-non-illusion",
  name: "Non-Illusion Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opponentCharacter = createMockCharacter({
  id: "sultan-opponent-char",
  name: "Opponent Character",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("The Sultan - Royal Apparition", () => {
  it("should have Vanish ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [theSultanRoyalApparition],
    });

    const cardUnderTest = testEngine.getCardModel(theSultanRoyalApparition);
    expect(cardUnderTest.hasVanish).toBe(true);
  });

  describe("COMMANDING PRESENCE - Whenever one of your Illusion characters quests, exert chosen opposing character.", () => {
    it("exerts chosen opposing character when one of your Illusion characters quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theSultanRoyalApparition, { card: illusionCharacter, isDrying: false }],
          deck: 3,
        },
        {
          play: [opponentCharacter],
          deck: 3,
        },
      );

      expect(testEngine.isExerted(opponentCharacter)).toBe(false);

      expect(testEngine.asPlayerOne().quest(illusionCharacter)).toBeSuccessfulCommand();

      // Resolve the triggered ability targeting the opponent's character
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(theSultanRoyalApparition, { targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opponentCharacter)).toBe(true);
    });

    it("triggers when The Sultan itself (an Illusion) quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: theSultanRoyalApparition, isDrying: false }],
          deck: 3,
        },
        {
          play: [opponentCharacter],
          deck: 3,
        },
      );

      expect(testEngine.isExerted(opponentCharacter)).toBe(false);

      expect(testEngine.asPlayerOne().quest(theSultanRoyalApparition)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(theSultanRoyalApparition, { targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opponentCharacter)).toBe(true);
    });

    it("does NOT trigger when a non-Illusion character quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theSultanRoyalApparition, { card: nonIllusionCharacter, isDrying: false }],
          deck: 3,
        },
        {
          play: [opponentCharacter],
          deck: 3,
        },
      );

      expect(testEngine.isExerted(opponentCharacter)).toBe(false);

      expect(testEngine.asPlayerOne().quest(nonIllusionCharacter)).toBeSuccessfulCommand();

      // No bag should be present — ability should not have triggered
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(testEngine.isExerted(opponentCharacter)).toBe(false);
    });

    it("gains lore from questing and also triggers COMMANDING PRESENCE", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theSultanRoyalApparition, { card: illusionCharacter, isDrying: false }],
          deck: 3,
        },
        {
          play: [opponentCharacter],
          deck: 3,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().quest(illusionCharacter)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(theSultanRoyalApparition, { targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + illusionCharacter.lore);
      expect(testEngine.isExerted(opponentCharacter)).toBe(true);
    });
  });
});
