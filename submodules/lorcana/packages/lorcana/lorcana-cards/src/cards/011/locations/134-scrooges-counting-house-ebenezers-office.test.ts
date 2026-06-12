import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  CANONICAL_PLAYER_ONE,
  CANONICAL_PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { scroogesCountingHouseEbenezersOffice } from "./134-scrooges-counting-house-ebenezers-office";

describe("Scrooge's Counting House - Ebenezer's Office", () => {
  describe("Boost 2", () => {
    it("has Boost keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [scroogesCountingHouseEbenezersOffice],
      });

      expect(testEngine.hasKeyword(scroogesCountingHouseEbenezersOffice, "Boost")).toBe(true);
    });

    it("can only use Boost once per turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [scroogesCountingHouseEbenezersOffice],
        inkwell: 4,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(scroogesCountingHouseEbenezersOffice, {
          ability: "Boost 2",
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.getCardsUnder(scroogesCountingHouseEbenezersOffice)).toHaveLength(1);

      const result = testEngine
        .asPlayerOne()
        .activateAbility(scroogesCountingHouseEbenezersOffice, {
          ability: "Boost 2",
        });
      expect(result.success).toBe(false);
      expect(testEngine.getCardsUnder(scroogesCountingHouseEbenezersOffice)).toHaveLength(1);
    });
  });

  describe("GOOD BUSINESS - This location gets +1 willpower and +1 lore for each card under it", () => {
    it("gets +1 willpower and +1 lore after boosting once", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [scroogesCountingHouseEbenezersOffice],
        inkwell: 2,
        deck: 5,
      });

      expect(testEngine.getCard(scroogesCountingHouseEbenezersOffice).willpower).toBe(4);
      expect(testEngine.getCard(scroogesCountingHouseEbenezersOffice).lore).toBe(1);

      expect(
        testEngine.asPlayerOne().activateAbility(scroogesCountingHouseEbenezersOffice, {
          ability: "Boost 2",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardsUnder(scroogesCountingHouseEbenezersOffice)).toHaveLength(1);
      expect(testEngine.getCard(scroogesCountingHouseEbenezersOffice).willpower).toBe(5);
      expect(testEngine.getCard(scroogesCountingHouseEbenezersOffice).lore).toBe(2);
    });

    it("stacks bonuses over multiple turns", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [scroogesCountingHouseEbenezersOffice],
        inkwell: 4,
        deck: 10,
      });

      expect(testEngine.getCard(scroogesCountingHouseEbenezersOffice).willpower).toBe(4);
      expect(testEngine.getCard(scroogesCountingHouseEbenezersOffice).lore).toBe(1);

      expect(
        testEngine.asPlayerOne().activateAbility(scroogesCountingHouseEbenezersOffice, {
          ability: "Boost 2",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardsUnder(scroogesCountingHouseEbenezersOffice)).toHaveLength(1);
      expect(testEngine.getCard(scroogesCountingHouseEbenezersOffice).willpower).toBe(5);
      expect(testEngine.getCard(scroogesCountingHouseEbenezersOffice).lore).toBe(2);

      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();

      expect(
        testEngine.asPlayerOne().activateAbility(scroogesCountingHouseEbenezersOffice, {
          ability: "Boost 2",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardsUnder(scroogesCountingHouseEbenezersOffice)).toHaveLength(2);
      expect(testEngine.getCard(scroogesCountingHouseEbenezersOffice).willpower).toBe(6);
      expect(testEngine.getCard(scroogesCountingHouseEbenezersOffice).lore).toBe(3);
    });
  });

  describe("regression: lore gain at Set step uses effective lore, not base lore", () => {
    it("gains effective lore (base + modifier) at start of turn, not just base lore", () => {
      const underCard1 = createMockCharacter({ id: "scrooge-under-1", name: "Under 1", cost: 1 });
      const underCard2 = createMockCharacter({ id: "scrooge-under-2", name: "Under 2", cost: 1 });
      const underCard3 = createMockCharacter({ id: "scrooge-under-3", name: "Under 3", cost: 1 });
      const underCard4 = createMockCharacter({ id: "scrooge-under-4", name: "Under 4", cost: 1 });
      const underCard5 = createMockCharacter({ id: "scrooge-under-5", name: "Under 5", cost: 1 });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 5,
        },
        {
          play: [
            {
              card: scroogesCountingHouseEbenezersOffice,
              cardsUnder: [underCard1, underCard2, underCard3, underCard4, underCard5],
            },
          ],
          deck: 5,
        },
      );

      expect(testEngine.getCardsUnder(scroogesCountingHouseEbenezersOffice)).toHaveLength(5);
      expect(testEngine.getCard(scroogesCountingHouseEbenezersOffice).lore).toBe(6);

      const loreBefore = testEngine.getLore(CANONICAL_PLAYER_TWO);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      const loreAfter = testEngine.getLore(CANONICAL_PLAYER_TWO);
      expect(loreAfter - loreBefore).toBe(6);
    });

    it("gains only base lore when no cards are under the location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 5,
        },
        {
          play: [scroogesCountingHouseEbenezersOffice],
          deck: 5,
        },
      );

      expect(testEngine.getCard(scroogesCountingHouseEbenezersOffice).lore).toBe(1);

      const loreBefore = testEngine.getLore(CANONICAL_PLAYER_TWO);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      const loreAfter = testEngine.getLore(CANONICAL_PLAYER_TWO);
      expect(loreAfter - loreBefore).toBe(1);
    });

    it("location lore gain updates after boosting more cards across turns", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 5,
        },
        {
          play: [scroogesCountingHouseEbenezersOffice],
          inkwell: 4,
          deck: 10,
        },
      );

      const loreBeforeTurn1 = testEngine.getLore(CANONICAL_PLAYER_TWO);
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      const loreAfterTurn1 = testEngine.getLore(CANONICAL_PLAYER_TWO);
      expect(loreAfterTurn1 - loreBeforeTurn1).toBe(1);

      expect(
        testEngine.asPlayerTwo().activateAbility(scroogesCountingHouseEbenezersOffice, {
          ability: "Boost 2",
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.getCard(scroogesCountingHouseEbenezersOffice).lore).toBe(2);

      const loreBeforeTurn2 = testEngine.getLore(CANONICAL_PLAYER_TWO);
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      const loreAfterTurn2 = testEngine.getLore(CANONICAL_PLAYER_TWO);
      expect(loreAfterTurn2 - loreBeforeTurn2).toBe(2);
    });
  });
});
