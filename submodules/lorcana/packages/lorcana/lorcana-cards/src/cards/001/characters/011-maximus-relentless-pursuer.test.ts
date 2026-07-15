import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { maximusRelentlessPursuer } from "./011-maximus-relentless-pursuer";

const opposingCharacter = createMockCharacter({
  id: "maximus-target-opposing",
  name: "Opposing Character",
  cost: 3,
  strength: 4,
  willpower: 4,
});

const ownCharacter = createMockCharacter({
  id: "maximus-target-own",
  name: "Own Character",
  cost: 2,
  strength: 3,
  willpower: 3,
});

describe("Maximus - Relentless Pursuer", () => {
  describe("Rush", () => {
    it("has the Rush keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [maximusRelentlessPursuer],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().hasKeyword(maximusRelentlessPursuer, "Rush")).toBe(true);
    });

    it("can challenge the turn it is played because of Rush", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [maximusRelentlessPursuer],
          inkwell: maximusRelentlessPursuer.cost,
          deck: 5,
        },
        {
          play: [{ card: opposingCharacter, exerted: true, isDrying: false }],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(maximusRelentlessPursuer)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(maximusRelentlessPursuer, { targets: [opposingCharacter] }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().challenge(maximusRelentlessPursuer, opposingCharacter),
      ).toBeSuccessfulCommand();
    });
  });

  describe("HORSE KICK - When you play this character, chosen character gets -2 {S} this turn.", () => {
    it("triggers when Maximus is played and prompts for a target", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: maximusRelentlessPursuer.cost,
          hand: [maximusRelentlessPursuer],
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(maximusRelentlessPursuer)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("reduces chosen opposing character's strength by 2 this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: maximusRelentlessPursuer.cost,
          hand: [maximusRelentlessPursuer],
          deck: 2,
        },
        {
          play: [opposingCharacter],
          deck: 2,
        },
      );

      const strengthBefore = testEngine.asPlayerTwo().getCardStrength(opposingCharacter);

      expect(testEngine.asPlayerOne().playCard(maximusRelentlessPursuer)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(maximusRelentlessPursuer, { targets: [opposingCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(strengthBefore - 2);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(strengthBefore);
    });

    it("can target own characters — ability allows any character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: maximusRelentlessPursuer.cost,
          hand: [maximusRelentlessPursuer],
          play: [ownCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(ownCharacter);

      expect(testEngine.asPlayerOne().playCard(maximusRelentlessPursuer)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(maximusRelentlessPursuer, { targets: [ownCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(ownCharacter)).toBe(strengthBefore - 2);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardStrength(ownCharacter)).toBe(strengthBefore);
    });
  });
});
