import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pegasusCloudRacer } from "./083-pegasus-cloud-racer";
import { pegasusGiftForHercules } from "./084-pegasus-gift-for-hercules";

const otherCharacter = createMockCharacter({
  id: "pcr-other",
  name: "Aladdin",
  version: "Brave Rescuer",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const anotherCharacter = createMockCharacter({
  id: "pcr-another",
  name: "Kronk",
  version: "Head of Security",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
});

describe("Pegasus - Cloud Racer", () => {
  it("has Shift 3 and Evasive keywords", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [pegasusCloudRacer],
    });

    expect(testEngine.hasKeyword(pegasusCloudRacer, "Shift")).toBe(true);
    expect(testEngine.hasKeyword(pegasusCloudRacer, "Evasive")).toBe(true);
  });

  describe("HOP ON! - When you play this character, if you used Shift to play him, your characters gain Evasive until the start of your next turn.", () => {
    it("grants Evasive to all your characters when played via Shift", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: pegasusCloudRacer.cost,
        hand: [pegasusCloudRacer],
        play: [pegasusGiftForHercules, otherCharacter, anotherCharacter],
      });

      const shiftTarget = testEngine.findCardInstanceId(
        pegasusGiftForHercules,
        "play",
        "player_one",
      );

      // Other characters should not have Evasive before
      expect(testEngine.hasKeyword(otherCharacter, "Evasive")).toBe(false);
      expect(testEngine.hasKeyword(anotherCharacter, "Evasive")).toBe(false);

      expect(
        testEngine.asPlayerOne().playCard(pegasusCloudRacer, {
          cost: {
            cost: "shift",
            shiftTarget,
          },
        }),
      ).toBeSuccessfulCommand();

      // Resolve the triggered ability bag if present
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        testEngine.asPlayerOne().resolvePendingByCard(pegasusCloudRacer);
      }

      // All characters should now have Evasive
      expect(testEngine.hasKeyword(otherCharacter, "Evasive")).toBe(true);
      expect(testEngine.hasKeyword(anotherCharacter, "Evasive")).toBe(true);
    });

    it("does NOT trigger when played normally (without Shift)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: pegasusCloudRacer.cost,
        hand: [pegasusCloudRacer],
        play: [otherCharacter],
      });

      expect(testEngine.asPlayerOne().playCard(pegasusCloudRacer)).toBeSuccessfulCommand();

      // No triggered abilities should fire
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Other character should NOT have Evasive
      expect(testEngine.hasKeyword(otherCharacter, "Evasive")).toBe(false);
    });

    it("Evasive effect expires at the start of your next turn (regression: playing another character should not cancel the effect on existing characters)", () => {
      const playableChar = createMockCharacter({
        id: "pcr-playable",
        name: "Lilo",
        version: "Junior Cake Decorator",
        cost: 2,
        strength: 1,
        willpower: 2,
        lore: 1,
      });

      const opponentChar = createMockCharacter({
        id: "pcr-opp",
        name: "Stitch",
        version: "New Dog",
        cost: 2,
        strength: 2,
        willpower: 3,
        lore: 1,
      });

      const opponentOtherChar = createMockCharacter({
        id: "pcr-opp2",
        name: "Stitch",
        version: "Carefree Surfer",
        cost: 3,
        strength: 2,
        willpower: 3,
        lore: 1,
        inkable: true,
      });

      const cardsInPlay = [otherCharacter, anotherCharacter];

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: pegasusCloudRacer.cost + playableChar.cost,
          hand: [pegasusCloudRacer, playableChar],
          play: [...cardsInPlay, pegasusGiftForHercules],
        },
        {
          inkwell: opponentChar.cost,
          hand: [opponentChar, opponentOtherChar],
        },
      );

      // Characters should not have Evasive initially
      for (const card of cardsInPlay) {
        expect(testEngine.hasKeyword(card, "Evasive")).toBe(false);
      }

      // Play Pegasus via Shift
      const shiftTarget = testEngine.findCardInstanceId(
        pegasusGiftForHercules,
        "play",
        "player_one",
      );

      expect(
        testEngine.asPlayerOne().playCard(pegasusCloudRacer, {
          cost: {
            cost: "shift",
            shiftTarget,
          },
        }),
      ).toBeSuccessfulCommand();

      // Resolve bag if present
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        testEngine.asPlayerOne().resolvePendingByCard(pegasusCloudRacer);
      }

      // Characters should now have Evasive
      for (const card of cardsInPlay) {
        expect(testEngine.hasKeyword(card, "Evasive")).toBe(true);
      }

      // Playing a new character should NOT cancel the effect on existing characters
      expect(testEngine.asPlayerOne().playCard(playableChar)).toBeSuccessfulCommand();

      for (const card of cardsInPlay) {
        expect(testEngine.hasKeyword(card, "Evasive")).toBe(true);
      }

      // Pass turn (player one -> player two)
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // During opponent's turn, Evasive should still be active
      for (const card of cardsInPlay) {
        expect(testEngine.hasKeyword(card, "Evasive")).toBe(true);
      }

      // Opponent plays and inks
      testEngine.asPlayerTwo().playCard(opponentChar);
      testEngine.asPlayerTwo().ink(opponentOtherChar);

      // Evasive should still be active during opponent's turn
      for (const card of cardsInPlay) {
        expect(testEngine.hasKeyword(card, "Evasive")).toBe(true);
      }
    });
  });
});
