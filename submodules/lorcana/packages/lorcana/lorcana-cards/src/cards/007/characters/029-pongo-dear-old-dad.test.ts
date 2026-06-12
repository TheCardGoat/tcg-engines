import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { dragonFire, reflection } from "@tcg/lorcana-cards/cards/001";
import { frecklesGoodBoy, luckyRuntOfTheLitter, perditaPlayfulMother } from "./index";
import { pongoDearOldDad } from "./029-pongo-dear-old-dad";

const nonPuppyCharacter = createMockCharacter({
  id: "pongo-non-puppy",
  name: "Non-Puppy Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Hero"],
});

describe("Pongo - Dear Old Dad", () => {
  describe("FOUND YOU, YOU LITTLE RASCAL - At the start of your turn, look at the cards in your inkwell. You may play a Puppy character from there for free.", () => {
    it("plays a Puppy character from inkwell for free when the optional is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pongoDearOldDad],
          inkwell: [frecklesGoodBoy, luckyRuntOfTheLitter, reflection],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(testEngine.asPlayerOne().resolveBag(bagEffect!.id)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pongoDearOldDad, {
          resolveOptional: true,
          targets: [luckyRuntOfTheLitter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(luckyRuntOfTheLitter)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(frecklesGoodBoy)).toBe("inkwell");
    });

    it("leaves inkwell untouched when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pongoDearOldDad],
          inkwell: [frecklesGoodBoy, luckyRuntOfTheLitter],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(testEngine.asPlayerOne().resolveBag(bagEffect!.id)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pongoDearOldDad, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(frecklesGoodBoy)).toBe("inkwell");
      expect(testEngine.asPlayerOne().getCardZone(luckyRuntOfTheLitter)).toBe("inkwell");
    });

    it("only Puppy characters can be selected (non-Puppy characters and actions are ineligible)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pongoDearOldDad],
          inkwell: [frecklesGoodBoy, perditaPlayfulMother, dragonFire],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(testEngine.asPlayerOne().resolveBag(bagEffect!.id)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pongoDearOldDad, {
          resolveOptional: true,
          targets: [frecklesGoodBoy],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(frecklesGoodBoy)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(perditaPlayfulMother)).toBe("inkwell");
      expect(testEngine.asPlayerOne().getCardZone(dragonFire)).toBe("inkwell");
    });

    it("when no Puppy characters are in the inkwell the optional is still created and can be declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pongoDearOldDad],
          inkwell: [perditaPlayfulMother, reflection, dragonFire],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(testEngine.asPlayerOne().resolveBag(bagEffect!.id)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pongoDearOldDad, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(perditaPlayfulMother)).toBe("inkwell");
    });

    it("plays the chosen Puppy for free even when controller has 0 ink available", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pongoDearOldDad],
          inkwell: [luckyRuntOfTheLitter],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(testEngine.asPlayerOne().resolveBag(bagEffect!.id)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pongoDearOldDad, {
          resolveOptional: true,
          targets: [luckyRuntOfTheLitter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(luckyRuntOfTheLitter)).toBe("play");
    });

    it("does not trigger at the start of the opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pongoDearOldDad],
          inkwell: [frecklesGoodBoy, luckyRuntOfTheLitter],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
