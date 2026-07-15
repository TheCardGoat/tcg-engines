import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { heiheiBumblingRooster } from "./086-heihei-bumbling-rooster";

describe("Heihei - Bumbling Rooster (Set 9)", () => {
  describe("FATTEN YOU UP — When you play this character, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.", () => {
    it("triggers when opponent has more inkwell cards than you", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [heiheiBumblingRooster],
          inkwell: heiheiBumblingRooster.cost,
          deck: 5,
        },
        {
          // Opponent has more inkwell cards
          inkwell: heiheiBumblingRooster.cost + 2,
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(heiheiBumblingRooster)).toBeSuccessfulCommand();

      // Should have a bag effect since opponent has more inkwell cards
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("puts top card of deck into inkwell facedown and exerted when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [heiheiBumblingRooster],
          inkwell: heiheiBumblingRooster.cost,
          deck: 5,
        },
        {
          inkwell: heiheiBumblingRooster.cost + 2,
          deck: 2,
        },
      );

      const inkwellBefore = testEngine.asPlayerOne().getZonesCardCount().inkwell;
      const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

      expect(testEngine.asPlayerOne().playCard(heiheiBumblingRooster)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(heiheiBumblingRooster, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Inkwell should have one more card
      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(inkwellBefore + 1);
      // Deck should have one fewer card
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(deckBefore - 1);
    });

    it("the card put into inkwell is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [heiheiBumblingRooster],
          inkwell: heiheiBumblingRooster.cost,
          deck: 5,
        },
        {
          inkwell: heiheiBumblingRooster.cost + 2,
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(heiheiBumblingRooster)).toBeSuccessfulCommand();

      const inkwellBefore = testEngine.getCardInstanceIdsInZone("inkwell", "player_one");

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(heiheiBumblingRooster, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      const inkwellAfter = testEngine.getCardInstanceIdsInZone("inkwell", "player_one");
      const newCardId = inkwellAfter.find((id) => !inkwellBefore.includes(id));

      expect(newCardId).toBeDefined();
      expect(testEngine.asServer().getCard(newCardId!)).toEqual(
        expect.objectContaining({ zone: "inkwell", exerted: true }),
      );
    });

    it("is optional — player can decline to put a card into inkwell", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [heiheiBumblingRooster],
          inkwell: heiheiBumblingRooster.cost,
          deck: 5,
        },
        {
          inkwell: heiheiBumblingRooster.cost + 2,
          deck: 2,
        },
      );

      const inkwellBefore = testEngine.asPlayerOne().getZonesCardCount().inkwell;
      const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

      expect(testEngine.asPlayerOne().playCard(heiheiBumblingRooster)).toBeSuccessfulCommand();

      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(heiheiBumblingRooster, { resolveOptional: false }),
        ).toBeSuccessfulCommand();
      }

      // Inkwell and deck should be unchanged
      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(inkwellBefore);
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(deckBefore);
    });

    it("does not trigger when opponent has fewer inkwell cards than you", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [heiheiBumblingRooster],
          inkwell: heiheiBumblingRooster.cost + 2,
          deck: 5,
        },
        {
          // Opponent has fewer inkwell cards
          inkwell: heiheiBumblingRooster.cost,
          deck: 2,
        },
      );

      const inkwellBefore = testEngine.asPlayerOne().getZonesCardCount().inkwell;

      expect(testEngine.asPlayerOne().playCard(heiheiBumblingRooster)).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(inkwellBefore);
    });

    it("does not trigger when inkwell counts are equal", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [heiheiBumblingRooster],
          inkwell: heiheiBumblingRooster.cost,
          deck: 5,
        },
        {
          // Opponent has the same inkwell count
          inkwell: heiheiBumblingRooster.cost,
          deck: 2,
        },
      );

      const inkwellBefore = testEngine.asPlayerOne().getZonesCardCount().inkwell;

      expect(testEngine.asPlayerOne().playCard(heiheiBumblingRooster)).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(inkwellBefore);
    });
  });
});
