import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { eeyoreInTheWayEnchanted } from "./226-eeyore-in-the-way-enchanted";

const opponentCharacter = createMockCharacter({
  id: "eeyore-enc-opponent-char",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const allyCharacter = createMockCharacter({
  id: "eeyore-enc-ally-char",
  name: "Ally Character",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Eeyore - In the Way (Enchanted)", () => {
  describe("THANKS FOR NOTICIN' ME - For each exerted character in play, you pay 1 {I} less to play this character.", () => {
    it("costs full 9 ink when no characters are exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [eeyoreInTheWayEnchanted],
          inkwell: eeyoreInTheWayEnchanted.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(eeyoreInTheWayEnchanted)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(eeyoreInTheWayEnchanted)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    });

    it("costs 1 less for each exerted character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [eeyoreInTheWayEnchanted],
          play: [{ card: allyCharacter, exerted: true }],
          inkwell: eeyoreInTheWayEnchanted.cost - 1,
          deck: 2,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 2,
        },
      );

      // 2 exerted characters in play = 2 ink reduction, cost becomes 7 instead of 9
      // We have 8 ink, so after paying 7 we have 1 left
      expect(testEngine.asPlayerOne().playCard(eeyoreInTheWayEnchanted)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(eeyoreInTheWayEnchanted)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(1);
    });

    it("can reduce cost to 0 with enough exerted characters", () => {
      const exertedChars = Array.from({ length: 9 }, (_, i) =>
        createMockCharacter({
          id: `eeyore-enc-filler-${i}`,
          name: `Filler ${i}`,
          cost: 1,
          strength: 1,
          willpower: 1,
        }),
      );

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [eeyoreInTheWayEnchanted],
          play: exertedChars.map((card) => ({ card, exerted: true })),
          inkwell: 0,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      // 9 exerted characters = 9 ink reduction, cost becomes 0
      expect(testEngine.asPlayerOne().playCard(eeyoreInTheWayEnchanted)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(eeyoreInTheWayEnchanted)).toBe("play");
    });

    it("fails to play without enough ink and no exerted characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [eeyoreInTheWayEnchanted],
          inkwell: eeyoreInTheWayEnchanted.cost - 1,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      const result = testEngine.asPlayerOne().playCard(eeyoreInTheWayEnchanted);
      expect(result).not.toBeSuccessfulCommand();
    });
  });

  describe("SORRY ABOUT THAT - When you play this character, for each opposing player, you may choose a character of theirs. They can't ready at the start of their next turn.", () => {
    it("triggers when played and applies cant-ready restriction to chosen opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [eeyoreInTheWayEnchanted],
          inkwell: eeyoreInTheWayEnchanted.cost,
          deck: 2,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(eeyoreInTheWayEnchanted)).toBeSuccessfulCommand();

      // Triggered ability should be on the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      // Resolve the triggered ability targeting the opponent's character
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(eeyoreInTheWayEnchanted, { targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      // The opponent character should have the cant-ready restriction
      expect(testEngine.asPlayerTwo()).toHaveRestriction({
        card: opponentCharacter,
        restriction: "cant-ready",
      });

      // Pass player one's turn — at start of player two's turn, the character should NOT ready
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.isExerted(opponentCharacter)).toBe(true);
    });

    it("resolves without restriction when no opposing characters are available", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [eeyoreInTheWayEnchanted],
          inkwell: eeyoreInTheWayEnchanted.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(eeyoreInTheWayEnchanted)).toBeSuccessfulCommand();

      // If triggered, resolve the optional ability - no targets to choose so declining is valid
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(eeyoreInTheWayEnchanted, { resolveOptional: false }),
        ).toBeSuccessfulCommand();
      }

      // No cant-ready restrictions should be applied
      expect(testEngine.hasRestriction(opponentCharacter, "cant-ready")).toBe(false);
    });
  });
});
