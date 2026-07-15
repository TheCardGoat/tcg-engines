import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { minnieMouseMusicalArtist } from "./009-minnie-mouse-musical-artist";

const bodyguardCharacter = createMockCharacter({
  id: "minnie-test-bodyguard",
  name: "Bodyguard Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      type: "keyword",
      keyword: "Bodyguard",
      text: "Bodyguard",
    },
  ],
});

const nonBodyguardCharacter = createMockCharacter({
  id: "minnie-test-non-bodyguard",
  name: "Non-Bodyguard Character",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const damagedCharacter = createMockCharacter({
  id: "minnie-test-damaged",
  name: "Damaged Character",
  cost: 3,
  strength: 2,
  willpower: 5,
});

describe("Minnie Mouse - Musical Artist", () => {
  it("has Singer 3", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [minnieMouseMusicalArtist],
      deck: 5,
    });

    expect(testEngine.asPlayerOne().hasKeyword(minnieMouseMusicalArtist, "Singer")).toBe(true);
  });

  describe("ENTOURAGE", () => {
    it("triggers when playing a character with Bodyguard and removes up to 2 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [bodyguardCharacter],
          play: [minnieMouseMusicalArtist, { card: damagedCharacter, damage: 3 }],
          inkwell: bodyguardCharacter.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const damagedCharacterId = testEngine.findCardInstanceId(damagedCharacter, "play");

      expect(testEngine.asPlayerOne().playCard(bodyguardCharacter)).toBeSuccessfulCommand();

      // Optional triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(minnieMouseMusicalArtist, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Choose the damaged character as target for remove-damage
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [damagedCharacterId] }),
      ).toBeSuccessfulCommand();

      // Should have removed 2 damage (from 3 to 1)
      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(1);
    });

    it("does NOT trigger when playing a character without Bodyguard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [nonBodyguardCharacter],
          play: [minnieMouseMusicalArtist, { card: damagedCharacter, damage: 3 }],
          inkwell: nonBodyguardCharacter.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(nonBodyguardCharacter)).toBeSuccessfulCommand();

      // No triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Damage should remain unchanged
      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(3);
    });

    it("can decline the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [bodyguardCharacter],
          play: [minnieMouseMusicalArtist, { card: damagedCharacter, damage: 3 }],
          inkwell: bodyguardCharacter.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(bodyguardCharacter)).toBeSuccessfulCommand();

      // Decline the optional ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(minnieMouseMusicalArtist, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Damage should remain unchanged
      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(3);
    });
  });
});
