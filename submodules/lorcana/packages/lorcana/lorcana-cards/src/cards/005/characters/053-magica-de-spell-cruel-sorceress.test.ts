import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { magicaDeSpellCruelSorceress } from "./053-magica-de-spell-cruel-sorceress";
import { suddenChill } from "../../001/actions/098-sudden-chill";
import { aWholeNewWorld } from "../../001/actions/195-a-whole-new-world";
import { createMockCharacter } from "@tcg/lorcana-engine/testing";

const mockCard1 = createMockCharacter({
  id: "mock-card-1",
  name: "Mock Card 1",
  cost: 1,
});

const mockCard2 = createMockCharacter({
  id: "mock-card-2",
  name: "Mock Card 2",
  cost: 1,
});

describe("Magica De Spell - Cruel Sorceress", () => {
  describe("PLAYING WITH POWER - During opponents' turns, if an effect would cause you to discard one or more cards from your hand, you don't discard.", () => {
    it("prevents the controller from discarding when an opponent plays Sudden Chill", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [suddenChill],
          inkwell: suddenChill.cost,
        },
        {
          play: [magicaDeSpellCruelSorceress],
          hand: [mockCard1],
        },
      );

      expect(testEngine.asPlayerOne().playCard(suddenChill)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(0);
      expect(testEngine.asPlayerTwo()).toHaveZoneCounts({
        hand: 1,
        discard: 0,
      });
      expect(testEngine.asPlayerTwo().getCardZone(mockCard1)).toBe("hand");
    });

    it("does NOT prevent discard during your own turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [magicaDeSpellCruelSorceress],
          hand: [suddenChill],
          inkwell: suddenChill.cost,
        },
        {
          hand: [mockCard1],
        },
      );

      expect(testEngine.asPlayerOne().playCard(suddenChill)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          targets: [mockCard1],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo()).toHaveZoneCounts({
        hand: 0,
        discard: 1,
      });
    });

    it("does not prevent the opponent from discarding (only protects its own controller)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [magicaDeSpellCruelSorceress],
          hand: [suddenChill],
          inkwell: suddenChill.cost,
        },
        {
          hand: [mockCard1],
        },
      );

      expect(testEngine.asPlayerOne().playCard(suddenChill)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().resolveNextPending({
          targets: [mockCard1],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo()).toHaveZoneCounts({
        hand: 0,
        discard: 1,
      });
    });

    it("A Whole New World - prevents discard during opponent's turn but draw still happens", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [aWholeNewWorld],
          inkwell: aWholeNewWorld.cost,
          deck: 10,
        },
        {
          play: [magicaDeSpellCruelSorceress],
          hand: [mockCard1, mockCard2],
          deck: 10,
        },
      );

      expect(testEngine.asPlayerOne().playCard(aWholeNewWorld)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo()).toHaveZoneCounts({
        hand: 9,
        discard: 0,
        deck: 3,
      });
    });
  });
});
