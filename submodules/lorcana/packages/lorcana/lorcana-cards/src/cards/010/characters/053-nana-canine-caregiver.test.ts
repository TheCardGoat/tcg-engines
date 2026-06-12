import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { nanaCanineCaregiver } from "./053-nana-canine-caregiver";

const handFodder = createMockCharacter({
  id: "nana-hand-fodder",
  name: "Hand Fodder",
  cost: 1,
});

const cheapCharacter = createMockCharacter({
  id: "nana-cheap-character",
  name: "Cheap Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const expensiveCharacter = createMockCharacter({
  id: "nana-expensive-character",
  name: "Expensive Character",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 2,
});

describe("Nana - Canine Caregiver", () => {
  describe("HELPFUL INSTINCTS - When you play this character, you may choose and discard a card to return chosen character with cost 2 or less to their player's hand.", () => {
    it("discards a card and returns opponent's character with cost 2 or less to their hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [nanaCanineCaregiver, handFodder],
          inkwell: nanaCanineCaregiver.cost,
          deck: 5,
        },
        {
          play: [cheapCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(nanaCanineCaregiver)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(nanaCanineCaregiver, {
          resolveOptional: true,
          targets: [handFodder, cheapCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(handFodder)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(cheapCharacter)).toBe("hand");
    });

    it("is optional - nothing happens when declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [nanaCanineCaregiver, handFodder],
          inkwell: nanaCanineCaregiver.cost,
          deck: 5,
        },
        {
          play: [cheapCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(nanaCanineCaregiver)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(nanaCanineCaregiver, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Hand fodder stays in hand, opponent's character stays in play
      expect(testEngine.asPlayerOne().getCardZone(handFodder)).toBe("hand");
      expect(testEngine.asPlayerTwo().getCardZone(cheapCharacter)).toBe("play");
    });

    it("cannot return a character with cost greater than 2", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [nanaCanineCaregiver, handFodder],
          inkwell: nanaCanineCaregiver.cost,
          deck: 5,
        },
        {
          play: [expensiveCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(nanaCanineCaregiver)).toBeSuccessfulCommand();

      // Accept the optional discard but there's no valid return target (cost > 2)
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(nanaCanineCaregiver, {
          resolveOptional: true,
          targets: [handFodder],
        }),
      ).toBeSuccessfulCommand();

      // Hand fodder was discarded but expensive character stays in play
      expect(testEngine.asPlayerOne().getCardZone(handFodder)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardZone(expensiveCharacter)).toBe("play");
    });

    it("can return own character with cost 2 or less to hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [nanaCanineCaregiver, handFodder],
        inkwell: nanaCanineCaregiver.cost,
        play: [cheapCharacter],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(nanaCanineCaregiver)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(nanaCanineCaregiver, {
          resolveOptional: true,
          targets: [handFodder, cheapCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(handFodder)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("hand");
    });
  });
});
