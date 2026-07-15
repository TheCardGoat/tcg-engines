import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { snowWhiteMerryAsTheMorning } from "./037-snow-white-merry-as-the-morning";

const sevenDwarfAlly = createMockCharacter({
  id: "snow-white-mm-dwarf",
  name: "Happy",
  version: "Good-Natured",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Ally", "Seven Dwarfs"],
});

const nonDwarfAlly = createMockCharacter({
  id: "snow-white-mm-non-dwarf",
  name: "Generic Hero",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const strongOpponent = createMockCharacter({
  id: "snow-white-mm-strong-opponent",
  name: "Strong Opponent",
  cost: 4,
  strength: 6,
  willpower: 6,
  lore: 1,
});

describe("Snow White - Merry as the Morning", () => {
  describe("Clarion Call - Whenever this character quests, you may return chosen Seven Dwarfs character of yours to your hand to draw a card.", () => {
    it("returns a Seven Dwarfs character to hand and draws a card when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [snowWhiteMerryAsTheMorning, sevenDwarfAlly],
        deck: 5,
      });

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(testEngine.asPlayerOne().quest(snowWhiteMerryAsTheMorning)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(snowWhiteMerryAsTheMorning, {
          resolveOptional: true,
          targets: [sevenDwarfAlly],
        }),
      ).toBeSuccessfulCommand();

      // Dwarf should be back in hand, and a card should have been drawn
      expect(testEngine.asPlayerOne().getCardZone(sevenDwarfAlly)).toBe("hand");
      // hand grew by 1 (dwarf returned) + 1 (drawn card) = +2
      expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(
        handBefore + 2,
      );
    });

    it("can decline the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [snowWhiteMerryAsTheMorning, sevenDwarfAlly],
        deck: 5,
      });

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(testEngine.asPlayerOne().quest(snowWhiteMerryAsTheMorning)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(snowWhiteMerryAsTheMorning, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Dwarf stays in play, no card drawn
      expect(testEngine.asPlayerOne().getCardZone(sevenDwarfAlly)).toBe("play");
      expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(handBefore);
    });

    it("does not offer a non-Seven-Dwarfs character as a target", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [snowWhiteMerryAsTheMorning, nonDwarfAlly],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(snowWhiteMerryAsTheMorning)).toBeSuccessfulCommand();

      // Attempting to target a non-Seven-Dwarfs character must fail
      const attempt = testEngine.asPlayerOne().resolvePendingByCard(snowWhiteMerryAsTheMorning, {
        resolveOptional: true,
        targets: [nonDwarfAlly],
      });
      expect(attempt.success).toBe(false);

      // The non-dwarf should still be in play (not returned)
      expect(testEngine.asPlayerOne().getCardZone(nonDwarfAlly)).toBe("play");
    });
  });

  describe("Never Forgotten - During an opponent's turn, when this character is banished in a challenge, return this card to your hand.", () => {
    it("returns this card to hand when banished in a challenge during an opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: snowWhiteMerryAsTheMorning, exerted: true }],
          deck: 5,
        },
        {
          play: [strongOpponent],
          deck: 5,
        },
      );

      // Pass to opponent's turn so they can challenge
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent challenges Snow White (6 strength vs 3 willpower -> banished)
      expect(
        testEngine.asPlayerTwo().challenge(strongOpponent, snowWhiteMerryAsTheMorning),
      ).toBeSuccessfulCommand();

      // The banish-in-challenge trigger belongs to player one; resolve it
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(snowWhiteMerryAsTheMorning),
      ).toBeSuccessfulCommand();

      // Snow White should be in the owner's hand, not the discard
      expect(testEngine.asPlayerOne().getCardZone(snowWhiteMerryAsTheMorning)).toBe("hand");
    });

    it("does NOT trigger when banished in a challenge during your own turn", () => {
      const exertedOpponent = createMockCharacter({
        id: "snow-white-mm-exerted-opp",
        name: "Exerted Opponent",
        cost: 3,
        strength: 5,
        willpower: 1,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [snowWhiteMerryAsTheMorning],
          deck: 5,
        },
        {
          play: [{ card: exertedOpponent, exerted: true }],
          deck: 5,
        },
      );

      // Player one challenges during their own turn; Snow White dies in the challenge
      // (5 strength vs 3 willpower -> Snow White banished; 2 strength vs 1 willpower -> opponent banished)
      expect(
        testEngine.asPlayerOne().challenge(snowWhiteMerryAsTheMorning, exertedOpponent),
      ).toBeSuccessfulCommand();

      // Snow White should be in the discard pile — "Never Forgotten" must not trigger
      expect(testEngine.asPlayerOne().getCardZone(snowWhiteMerryAsTheMorning)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
