import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { scroogeMcduckEbenezerScrooge } from "./124-scrooge-mcduck-ebenezer-scrooge";

describe("Scrooge McDuck - Ebenezer Scrooge", () => {
  describe("PAYMENT DUE", () => {
    it("opponent loses 1 lore when Scrooge quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: scroogeMcduckEbenezerScrooge, isDrying: false }],
          deck: 5,
        },
        {
          deck: 5,
        },
        {
          startingLore: {
            [PLAYER_ONE]: 0,
            [PLAYER_TWO]: 3,
          },
        },
      );

      expect(testEngine.asPlayerOne().quest(scroogeMcduckEbenezerScrooge)).toBeSuccessfulCommand();

      // Resolve the triggered PAYMENT DUE bag effect
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(scroogeMcduckEbenezerScrooge),
        ).toBeSuccessfulCommand();
      }

      // P2 should have lost 1 lore (3 -> 2)
      expect(testEngine.getLore(PLAYER_TWO)).toBe(2);

      // P1 should have gained quest lore (1)
      expect(testEngine.getLore(PLAYER_ONE)).toBe(scroogeMcduckEbenezerScrooge.lore);
    });

    it("opponent does not lose lore when at 0", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: scroogeMcduckEbenezerScrooge, isDrying: false }],
          deck: 5,
        },
        {
          deck: 5,
        },
        {
          startingLore: {
            [PLAYER_ONE]: 0,
            [PLAYER_TWO]: 0,
          },
        },
      );

      expect(testEngine.asPlayerOne().quest(scroogeMcduckEbenezerScrooge)).toBeSuccessfulCommand();

      // Resolve the triggered PAYMENT DUE bag effect
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(scroogeMcduckEbenezerScrooge),
        ).toBeSuccessfulCommand();
      }

      // P2 had 0 lore, stays at 0
      expect(testEngine.getLore(PLAYER_TWO)).toBe(0);
    });

    it("draws 1 card when opponent loses 1 lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: scroogeMcduckEbenezerScrooge, isDrying: false }],
          deck: 5,
        },
        {
          deck: 5,
        },
        {
          startingLore: {
            [PLAYER_ONE]: 0,
            [PLAYER_TWO]: 3,
          },
        },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(testEngine.asPlayerOne().quest(scroogeMcduckEbenezerScrooge)).toBeSuccessfulCommand();

      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(scroogeMcduckEbenezerScrooge),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(
        handBefore + 1,
      );
    });

    it("does not draw when opponent has 0 lore (no lore lost)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: scroogeMcduckEbenezerScrooge, isDrying: false }],
          deck: 5,
        },
        {
          deck: 5,
        },
        {
          startingLore: {
            [PLAYER_ONE]: 0,
            [PLAYER_TWO]: 0,
          },
        },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(testEngine.asPlayerOne().quest(scroogeMcduckEbenezerScrooge)).toBeSuccessfulCommand();

      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(scroogeMcduckEbenezerScrooge),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(handBefore);
    });

    it("regression: PAYMENT DUE actually deducts lore from opponent (not just gaining for self)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: scroogeMcduckEbenezerScrooge, isDrying: false }],
          deck: 5,
        },
        {
          deck: 5,
        },
        {
          startingLore: {
            [PLAYER_ONE]: 0,
            [PLAYER_TWO]: 1,
          },
        },
      );

      expect(testEngine.asPlayerOne().quest(scroogeMcduckEbenezerScrooge)).toBeSuccessfulCommand();

      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(scroogeMcduckEbenezerScrooge),
        ).toBeSuccessfulCommand();
      }

      // P2 lost 1 lore (1 -> 0)
      expect(testEngine.getLore(PLAYER_TWO)).toBe(0);
      // P1 gained quest lore + drew 1 card for the 1 lore lost
      expect(testEngine.getLore(PLAYER_ONE)).toBe(scroogeMcduckEbenezerScrooge.lore);
    });
  });

  describe("FORECLOSURE", () => {
    it("gains 1 lore at end of turn if opponent has 0 lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [scroogeMcduckEbenezerScrooge],
          deck: 5,
        },
        {
          deck: 5,
        },
        {
          startingLore: {
            [PLAYER_ONE]: 0,
            [PLAYER_TWO]: 0,
          },
        },
      );

      // Pass P1 turn - FORECLOSURE should trigger at end of turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // P1 should have gained 1 lore from FORECLOSURE
      expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    });

    it("does not gain lore at end of turn if opponent has lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [scroogeMcduckEbenezerScrooge],
          deck: 5,
        },
        {
          deck: 5,
        },
        {
          startingLore: {
            [PLAYER_ONE]: 0,
            [PLAYER_TWO]: 5,
          },
        },
      );

      // Pass P1 turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // P1 should not have gained lore from FORECLOSURE
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });
  });
});
