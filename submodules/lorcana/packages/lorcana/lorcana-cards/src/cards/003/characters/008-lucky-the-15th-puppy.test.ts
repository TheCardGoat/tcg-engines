import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { luckyThe15thPuppy } from "./008-lucky-the-15th-puppy";

const cheapCharacter1 = createMockCharacter({
  id: "lucky-cheap-character-1",
  name: "Cheap Character 1",
  cost: 2,
});

const cheapCharacter2 = createMockCharacter({
  id: "lucky-cheap-character-2",
  name: "Cheap Character 2",
  cost: 1,
});

const expensiveCharacter = createMockCharacter({
  id: "lucky-expensive-character",
  name: "Expensive Character",
  cost: 3,
});

const nonCharacterCard = createMockAction({
  id: "lucky-non-character",
  name: "Non Character",
  cost: 1,
  text: "A test action.",
});

const anotherExpensiveCharacter = createMockCharacter({
  id: "lucky-another-expensive-character",
  name: "Another Expensive Character",
  cost: 3,
});

const otherCharacter1 = createMockCharacter({
  id: "lucky-other-character-1",
  name: "Other Character 1",
  cost: 2,
  lore: 1,
});

const otherCharacter2 = createMockCharacter({
  id: "lucky-other-character-2",
  name: "Other Character 2",
  cost: 2,
  lore: 2,
});

const otherCharacter3 = createMockCharacter({
  id: "lucky-other-character-3",
  name: "Other Character 3",
  cost: 2,
  lore: 1,
});

const otherCharacter4 = createMockCharacter({
  id: "lucky-other-character-4",
  name: "Other Character 4",
  cost: 2,
  lore: 1,
});

describe("Lucky - The 15th Puppy", () => {
  describe("GOOD AS NEW - {E} — Reveal the top 3 cards of your deck. You may put each character card with cost 2 or less into your hand. Put the rest on the bottom of your deck in any order.", () => {
    it("puts character cards with cost 2 or less into hand and the rest on bottom of deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: luckyThe15thPuppy, isDrying: false }],
        deck: [cheapCharacter1, expensiveCharacter, nonCharacterCard],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(luckyThe15thPuppy, {
          ability: "GOOD AS NEW",
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "hand", cards: [cheapCharacter1] },
            { zone: "deck-bottom", cards: [expensiveCharacter, nonCharacterCard] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cheapCharacter1)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(expensiveCharacter)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(nonCharacterCard)).toBe("deck");
    });

    it("puts multiple cheap characters into hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: luckyThe15thPuppy, isDrying: false }],
        deck: [cheapCharacter1, cheapCharacter2, nonCharacterCard],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(luckyThe15thPuppy, {
          ability: "GOOD AS NEW",
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "hand", cards: [cheapCharacter1, cheapCharacter2] },
            { zone: "deck-bottom", cards: [nonCharacterCard] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cheapCharacter1)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(cheapCharacter2)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(nonCharacterCard)).toBe("deck");
    });

    it("puts all cards on bottom of deck when no cheap characters are revealed", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: luckyThe15thPuppy, isDrying: false }],
        deck: [expensiveCharacter, nonCharacterCard, anotherExpensiveCharacter],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(luckyThe15thPuppy, {
          ability: "GOOD AS NEW",
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            {
              zone: "deck-bottom",
              cards: [expensiveCharacter, nonCharacterCard, anotherExpensiveCharacter],
            },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(expensiveCharacter)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(nonCharacterCard)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(anotherExpensiveCharacter)).toBe("deck");
    });

    it("exerts Lucky when activating the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: luckyThe15thPuppy, isDrying: false }],
        deck: [cheapCharacter1, expensiveCharacter, nonCharacterCard],
      });

      expect(testEngine.asPlayerOne().isExerted(luckyThe15thPuppy)).toBe(false);

      expect(
        testEngine.asPlayerOne().activateAbility(luckyThe15thPuppy, {
          ability: "GOOD AS NEW",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(luckyThe15thPuppy)).toBe(true);
    });
  });

  describe("PUPPY LOVE - Whenever this character quests, if you have 4 or more other characters in play, your other characters get +1 {L} this turn.", () => {
    it("gives +1 lore to other characters when Lucky quests with 4 other characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: luckyThe15thPuppy, isDrying: false },
          { card: otherCharacter1, isDrying: false },
          { card: otherCharacter2, isDrying: false },
          { card: otherCharacter3, isDrying: false },
          { card: otherCharacter4, isDrying: false },
        ],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCardLore(otherCharacter1)).toBe(otherCharacter1.lore);
      expect(testEngine.asPlayerOne().getCardLore(otherCharacter2)).toBe(otherCharacter2.lore);
      expect(testEngine.asPlayerOne().getCardLore(otherCharacter3)).toBe(otherCharacter3.lore);
      expect(testEngine.asPlayerOne().getCardLore(otherCharacter4)).toBe(otherCharacter4.lore);

      expect(testEngine.asPlayerOne().quest(luckyThe15thPuppy)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(otherCharacter1)).toBe(otherCharacter1.lore + 1);
      expect(testEngine.asPlayerOne().getCardLore(otherCharacter2)).toBe(otherCharacter2.lore + 1);
      expect(testEngine.asPlayerOne().getCardLore(otherCharacter3)).toBe(otherCharacter3.lore + 1);
      expect(testEngine.asPlayerOne().getCardLore(otherCharacter4)).toBe(otherCharacter4.lore + 1);
    });

    it("does not give +1 lore to Lucky itself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: luckyThe15thPuppy, isDrying: false },
          { card: otherCharacter1, isDrying: false },
          { card: otherCharacter2, isDrying: false },
          { card: otherCharacter3, isDrying: false },
          { card: otherCharacter4, isDrying: false },
        ],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCardLore(luckyThe15thPuppy)).toBe(luckyThe15thPuppy.lore);

      expect(testEngine.asPlayerOne().quest(luckyThe15thPuppy)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(luckyThe15thPuppy)).toBe(luckyThe15thPuppy.lore);
    });

    it("does not trigger with only 3 other characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: luckyThe15thPuppy, isDrying: false },
          { card: otherCharacter1, isDrying: false },
          { card: otherCharacter2, isDrying: false },
          { card: otherCharacter3, isDrying: false },
        ],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getCardLore(otherCharacter1)).toBe(otherCharacter1.lore);

      expect(testEngine.asPlayerOne().quest(luckyThe15thPuppy)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(otherCharacter1)).toBe(otherCharacter1.lore);
      expect(testEngine.asPlayerOne().getCardLore(otherCharacter2)).toBe(otherCharacter2.lore);
      expect(testEngine.asPlayerOne().getCardLore(otherCharacter3)).toBe(otherCharacter3.lore);
    });

    it("lore bonus lasts until end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: luckyThe15thPuppy, isDrying: false },
          { card: otherCharacter1, isDrying: false },
          { card: otherCharacter2, isDrying: false },
          { card: otherCharacter3, isDrying: false },
          { card: otherCharacter4, isDrying: false },
        ],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().quest(luckyThe15thPuppy)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(otherCharacter1)).toBe(otherCharacter1.lore + 1);

      testEngine.asServer().passTurn();
      testEngine.asServer().passTurn();

      expect(testEngine.asPlayerOne().getCardLore(otherCharacter1)).toBe(otherCharacter1.lore);
    });
  });
});
