import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { archimedesExceptionalOwl } from "./076-archimedes-exceptional-owl";
import { fireTheCannons } from "../../009/actions";

describe("Archimedes - Exceptional Owl", () => {
  describe("MORE TO LEARN - Whenever an opponent chooses this character for an action or ability, you may draw a card.", () => {
    it("draws a card when an opponent targets Archimedes with an action", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [archimedesExceptionalOwl],
          deck: 5,
        },
        {
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
        },
      );

      // Opponent (player two) plays Fire the Cannons targeting Archimedes
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().playCard(fireTheCannons, {
          targets: [archimedesExceptionalOwl],
        }),
      ).toBeSuccessfulCommand();

      // Archimedes' controller (player one) should have a bag effect to optionally draw
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(archimedesExceptionalOwl, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Player one should have drawn 1 card
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 4 });
    });

    it("can decline the optional draw", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [archimedesExceptionalOwl],
          deck: 5,
        },
        {
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().playCard(fireTheCannons, {
          targets: [archimedesExceptionalOwl],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(archimedesExceptionalOwl, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Player one should not have drawn any cards
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 5 });
    });

    it("does NOT trigger when the controller's own action targets Archimedes", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [archimedesExceptionalOwl],
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
          deck: 5,
        },
        {},
      );

      // Player one (Archimedes' controller) plays Fire the Cannons targeting their own Archimedes
      expect(
        testEngine.asPlayerOne().playCard(fireTheCannons, {
          targets: [archimedesExceptionalOwl],
        }),
      ).toBeSuccessfulCommand();

      // Should NOT trigger — own action, not opponent's
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 5 });
    });
  });
});
