import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theFamilyScattered } from "./097-the-family-scattered";

const opponentCharacterA = createMockCharacter({
  id: "family-scattered-opp-a",
  name: "Opponent Character A",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opponentCharacterB = createMockCharacter({
  id: "family-scattered-opp-b",
  name: "Opponent Character B",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const opponentCharacterC = createMockCharacter({
  id: "family-scattered-opp-c",
  name: "Opponent Character C",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
});

describe("The Family Scattered", () => {
  it("asks the opponent to choose before moving the first character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theFamilyScattered],
        inkwell: theFamilyScattered.cost,
        deck: [],
      },
      {
        play: [opponentCharacterA, opponentCharacterB, opponentCharacterC],
        deck: [],
      },
    );

    expect(testEngine.asPlayerOne().playCard(theFamilyScattered)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(opponentCharacterA)).toBe("play");
    expect(testEngine.asPlayerTwo().getCardZone(opponentCharacterB)).toBe("play");
    expect(testEngine.asPlayerTwo().getCardZone(opponentCharacterC)).toBe("play");
    const [firstPending] = testEngine.asPlayerTwo().getPendingEffects();
    expect(firstPending?.payload).toMatchObject({
      chooserId: "player_two",
      kind: "target-selection",
    });
  });

  it("opponent returns one character to hand, puts one on bottom of deck, and puts one on top of deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theFamilyScattered],
        inkwell: theFamilyScattered.cost,
        deck: 2,
      },
      {
        play: [opponentCharacterA, opponentCharacterB, opponentCharacterC],
        deck: 3,
      },
    );

    expect(testEngine.asPlayerOne().playCard(theFamilyScattered)).toBeSuccessfulCommand();

    // Opponent chooses which of their characters to return to hand
    expect(
      testEngine.asPlayerTwo().resolveNextPending({ targets: [opponentCharacterA] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(opponentCharacterA)).toBe("hand");

    // Opponent chooses which of their characters to put on the bottom of their deck
    expect(
      testEngine.asPlayerTwo().resolveNextPending({ targets: [opponentCharacterB] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(opponentCharacterB)).toBe("deck");

    // Opponent chooses which of their characters to put on the top of their deck
    expect(
      testEngine.asPlayerTwo().resolveNextPending({ targets: [opponentCharacterC] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(opponentCharacterC)).toBe("deck");
  });

  describe("release notes ruling", () => {
    it("opponent with only 1 character resolves 'as much as possible' — returns it to hand and the rest of the effect is skipped", () => {
      // Q&A: With fewer than 3 characters, the opponent does as much as
      // they can in order written: hand → bottom-of-deck → top-of-deck.
      // With 1 character, only the return-to-hand step happens.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [theFamilyScattered],
          inkwell: theFamilyScattered.cost,
          deck: 2,
        },
        {
          play: [opponentCharacterA],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().playCard(theFamilyScattered)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [opponentCharacterA] }),
      ).toBeSuccessfulCommand();

      // Returned to hand.
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacterA)).toBe("hand");

      // No more pending steps to choose from — the rest of the effect is
      // skipped because there are no further characters in play.
      expect(testEngine.asPlayerTwo().getPendingEffects().length).toBe(0);
    });
  });
});
