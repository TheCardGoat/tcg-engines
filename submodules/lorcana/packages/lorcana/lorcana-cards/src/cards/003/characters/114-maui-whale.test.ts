import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  CANONICAL_PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mauiWhale } from "./114-maui-whale";

const opponentCharacter = createMockCharacter({
  id: "opp-char",
  name: "Opponent Character",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
});

describe("Maui - Whale", () => {
  describe("THIS MISSION IS CURSED - This character can't ready at the start of your turn.", () => {
    it("does not ready at the start of controller's turn when exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mauiWhale, exerted: true }],
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      expect(testEngine.isExerted(mauiWhale)).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.isExerted(mauiWhale)).toBe(true);

      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.isExerted(mauiWhale)).toBe(true);
    });

    it("restriction persists across multiple turns", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mauiWhale, exerted: true }],
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.isExerted(mauiWhale)).toBe(true);
    });

    it("can still be readied by other effects", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: mauiWhale, exerted: true }],
        inkwell: 1,
        deck: 2,
      });

      expect(testEngine.isExerted(mauiWhale)).toBe(true);

      expect(
        testEngine.asPlayerOne().activateAbility(mauiWhale, {
          ability: "I GOT YOUR BACK 2",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(mauiWhale)).toBe(false);
    });
  });

  describe("I GOT YOUR BACK 2 - {I} — Ready this character. He can't quest for the rest of this turn.", () => {
    it("can be activated to ready the character when exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: mauiWhale, exerted: true }],
        inkwell: 1,
        deck: 2,
      });

      expect(testEngine.isExerted(mauiWhale)).toBe(true);

      expect(
        testEngine.asPlayerOne().activateAbility(mauiWhale, {
          ability: "I GOT YOUR BACK 2",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(mauiWhale)).toBe(false);
    });

    it("applies cant-quest restriction for the rest of the turn after activation", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: mauiWhale, exerted: true }],
        inkwell: 1,
        deck: 2,
      });

      expect(testEngine.hasRestriction(mauiWhale, "cant-quest")).toBe(false);

      expect(
        testEngine.asPlayerOne().activateAbility(mauiWhale, {
          ability: "I GOT YOUR BACK 2",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasRestriction(mauiWhale, "cant-quest")).toBe(true);
    });

    it("cant-quest restriction is removed at the start of the next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mauiWhale, exerted: true }],
          inkwell: 2,
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(mauiWhale, {
          ability: "I GOT YOUR BACK 2",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasRestriction(mauiWhale, "cant-quest")).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.hasRestriction(mauiWhale, "cant-quest")).toBe(false);
    });

    it("costs 1 ink to activate", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: mauiWhale, exerted: true }],
        inkwell: 2,
        deck: 2,
      });

      const inkBefore = testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE);
      expect(inkBefore).toBe(2);

      expect(
        testEngine.asPlayerOne().activateAbility(mauiWhale, {
          ability: "I GOT YOUR BACK 2",
        }),
      ).toBeSuccessfulCommand();

      const inkAfter = testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE);
      expect(inkAfter).toBe(1);
    });

    it("cannot be activated without enough ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: mauiWhale, exerted: true }],
        inkwell: 0,
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(mauiWhale, {
          ability: "I GOT YOUR BACK 2",
        }),
      ).toMatchObject({
        success: false,
        errorCode: "INSUFFICIENT_INK",
      });
    });

    it("cannot quest after using the ability in the same turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: mauiWhale, exerted: true }],
        inkwell: 1,
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().activateAbility(mauiWhale, {
          ability: "I GOT YOUR BACK 2",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(mauiWhale)).toBe(false);

      const questResult = testEngine.asPlayerOne().quest(mauiWhale);
      expect(questResult.success).toBe(false);
    });

    it("can challenge after using the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mauiWhale, exerted: true }],
          inkwell: 1,
          deck: 2,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(mauiWhale, {
          ability: "I GOT YOUR BACK 2",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(mauiWhale)).toBe(false);

      expect(
        testEngine.asPlayerOne().challenge(mauiWhale, opponentCharacter),
      ).toBeSuccessfulCommand();
    });

    it("can be activated multiple times in the same turn if there is enough ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mauiWhale, exerted: true }],
          inkwell: 2,
          deck: 2,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(mauiWhale, {
          ability: "I GOT YOUR BACK 2",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(mauiWhale)).toBe(false);

      expect(
        testEngine.asPlayerOne().challenge(mauiWhale, opponentCharacter),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(mauiWhale)).toBe(true);

      expect(
        testEngine.asPlayerOne().activateAbility(mauiWhale, {
          ability: "I GOT YOUR BACK 2",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(mauiWhale)).toBe(false);
    });
  });
});
