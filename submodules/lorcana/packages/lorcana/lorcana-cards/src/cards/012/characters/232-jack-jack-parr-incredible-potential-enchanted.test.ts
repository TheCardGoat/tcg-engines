import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { jackjackParrIncrediblePotentialEnchanted } from "./232-jack-jack-parr-incredible-potential-enchanted";

const characterDeckCard = createMockCharacter({
  id: "jackjack-enchanted-deck-character",
  name: "Character Deck Card",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const actionDeckCard = createMockAction({
  id: "jackjack-enchanted-deck-action",
  name: "Action Deck Card",
  cost: 2,
});

describe("Jack-Jack Parr - Incredible Potential (Enchanted)", () => {
  describe("WEIRD THINGS ARE HAPPENING - At the start of your turn, you may put the top card of your deck into your discard.", () => {
    it("mills the top card when accepted; character card gives +2 strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 3 },
        {
          deck: [characterDeckCard],
          play: [jackjackParrIncrediblePotentialEnchanted],
        },
      );

      const baseStrength = jackjackParrIncrediblePotentialEnchanted.strength;

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(jackjackParrIncrediblePotentialEnchanted, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(characterDeckCard)).toBe("discard");
      expect(
        testEngine.asPlayerTwo().getCardStrength(jackjackParrIncrediblePotentialEnchanted),
      ).toBe(baseStrength + 2);
    });

    it("mills the top card when accepted; action card gives +2 lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 3 },
        {
          deck: [actionDeckCard],
          play: [jackjackParrIncrediblePotentialEnchanted],
        },
      );

      const baseLore = jackjackParrIncrediblePotentialEnchanted.lore;

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(jackjackParrIncrediblePotentialEnchanted, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(actionDeckCard)).toBe("discard");
      expect(testEngine.asPlayerTwo().getCardLore(jackjackParrIncrediblePotentialEnchanted)).toBe(
        baseLore + 2,
      );
    });

    it("has one ability defined", () => {
      expect(jackjackParrIncrediblePotentialEnchanted.abilities).toHaveLength(1);
      expect(jackjackParrIncrediblePotentialEnchanted.abilities![0]).toMatchObject({
        name: "WEIRD THINGS ARE HAPPENING",
        type: "triggered",
      });
    });
  });
});
