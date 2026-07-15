import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { tipoGrowingSon } from "../../005/characters/157-tipo-growing-son";
import { daisyDuckMultitalentedPirate } from "./108-daisy-duck-multitalented-pirate";

const firstInkCard = createMockCharacter({
  id: "daisy-ink-card-1",
  name: "Ink Card 1",
  cost: 1,
  inkable: true,
});

const secondInkCard = createMockCharacter({
  id: "daisy-ink-card-2",
  name: "Ink Card 2",
  cost: 1,
  inkable: true,
});

const opponentCharacter1 = createMockCharacter({
  id: "daisy-opponent-char-1",
  name: "Opponent Character 1",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const opponentCharacter2 = createMockCharacter({
  id: "daisy-opponent-char-2",
  name: "Opponent Character 2",
  cost: 3,
  strength: 3,
  willpower: 4,
});

describe("Daisy Duck - Multitalented Pirate", () => {
  describe("FOWL PLAY - Once during your turn, whenever a card is put into your inkwell, chosen opponent chooses one of their characters and returns that card to their hand.", () => {
    it("returns the chosen opponent's character to their hand when a card is inked", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [daisyDuckMultitalentedPirate],
          hand: [firstInkCard],
        },
        {
          play: [opponentCharacter1],
        },
      );

      expect(testEngine.asPlayerOne().ink(firstInkCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          choiceIndex: 0,
        }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          targets: [opponentCharacter1],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter1)).toBe("hand");
    });

    it("only triggers once during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [daisyDuckMultitalentedPirate],
          hand: [firstInkCard, secondInkCard, tipoGrowingSon],
          inkwell: tipoGrowingSon.cost,
        },
        {
          play: [opponentCharacter1, opponentCharacter2],
        },
      );

      expect(testEngine.asPlayerOne().ink(firstInkCard)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          choiceIndex: 0,
        }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          targets: [opponentCharacter1],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().playCard(tipoGrowingSon)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tipoGrowingSon, {
          targets: [secondInkCard],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter1)).toBe("hand");
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter2)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(secondInkCard)).toBe("inkwell");
    });
  });
});
