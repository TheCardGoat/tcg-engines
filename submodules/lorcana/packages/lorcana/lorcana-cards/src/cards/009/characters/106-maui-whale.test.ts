import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { mauiWhale } from "./106-maui-whale";

describe("Maui - Whale (Set 9)", () => {
  describe("THIS MISSION IS CURSED — This character can't ready at the start of your turn.", () => {
    it("does not ready at the start of your turn when exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mauiWhale, exerted: true }],
          deck: 3,
        },
        { deck: 3 },
      );

      // Maui is exerted at start
      expect(testEngine.asPlayerOne().isExerted(mauiWhale)).toBe(true);

      // Pass player one's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      // Player two passes
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // At the start of player one's next turn, Maui should still be exerted
      expect(testEngine.asPlayerOne().isExerted(mauiWhale)).toBe(true);
    });
  });

  describe("I GOT YOUR BACK 2 — {1} — Ready this character. He can't quest for the rest of this turn.", () => {
    it("readies Maui when the activated ability is used", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mauiWhale, exerted: true }],
          inkwell: 1,
          deck: 3,
        },
        { deck: 3 },
      );

      // Maui starts exerted
      expect(testEngine.asPlayerOne().isExerted(mauiWhale)).toBe(true);

      expect(
        testEngine.asPlayerOne().activateAbility(mauiWhale, {
          ability: "I GOT YOUR BACK 2",
        }),
      ).toBeSuccessfulCommand();

      // Maui should now be ready
      expect(testEngine.asPlayerOne().isExerted(mauiWhale)).toBe(false);
    });

    it("applies cant-quest restriction after being readied", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mauiWhale, exerted: true }],
          inkwell: 1,
          deck: 3,
        },
        { deck: 3 },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(mauiWhale, {
          ability: "I GOT YOUR BACK 2",
        }),
      ).toBeSuccessfulCommand();

      // Maui is ready but cannot quest this turn
      expect(testEngine.asPlayerOne().isExerted(mauiWhale)).toBe(false);
      expect(testEngine.asPlayerOne().getCard(mauiWhale).hasQuestRestriction).toBe(true);
    });

    it("quest restriction is lifted after the turn ends", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mauiWhale, exerted: true }],
          inkwell: 1,
          deck: 3,
        },
        { deck: 3 },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(mauiWhale, {
          ability: "I GOT YOUR BACK 2",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(mauiWhale).hasQuestRestriction).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(mauiWhale).hasQuestRestriction).toBe(false);
    });

    it("costs 1 ink to activate", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mauiWhale, exerted: true }],
          inkwell: 0,
          deck: 3,
        },
        { deck: 3 },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(mauiWhale, {
          ability: "I GOT YOUR BACK 2",
        }),
      ).not.toBeSuccessfulCommand();

      // Maui should still be exerted since the ability failed
      expect(testEngine.asPlayerOne().isExerted(mauiWhale)).toBe(true);
    });

    it("gains lore for player when questing before being exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mauiWhale],
          deck: 3,
        },
        { deck: 3 },
      );

      // Pass turns so Maui is dry
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().quest(mauiWhale)).toBeSuccessfulCommand();
      expect(testEngine.getLore(PLAYER_ONE)).toBe(mauiWhale.lore);
    });
  });
});
