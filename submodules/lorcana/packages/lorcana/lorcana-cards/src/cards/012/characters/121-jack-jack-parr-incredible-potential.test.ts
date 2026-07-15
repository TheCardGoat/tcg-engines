import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { jackjackParrIncrediblePotential } from "./121-jack-jack-parr-incredible-potential";

const characterDeckCard = createMockCharacter({
  id: "jackjack-deck-character",
  name: "Character Deck Card",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const actionDeckCard = createMockAction({
  id: "jackjack-deck-action",
  name: "Action Deck Card",
  cost: 2,
});

describe("Jack-Jack Parr - Incredible Potential", () => {
  describe("WEIRD THINGS ARE HAPPENING - At the start of your turn, you may put the top card of your deck into your discard.", () => {
    it("mills the top card when accepted; character card gives +2 strength", () => {
      // Put Jack-Jack in P2's play so P1 passes → P2's turn starts
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 3 },
        { deck: [characterDeckCard], play: [jackjackParrIncrediblePotential] },
      );

      const baseStrength = jackjackParrIncrediblePotential.strength;

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(jackjackParrIncrediblePotential, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // characterDeckCard was milled
      expect(testEngine.asPlayerTwo().getCardZone(characterDeckCard)).toBe("discard");
      // Jack-Jack gets +2 strength because revealed card is a character
      expect(testEngine.asPlayerTwo().getCardStrength(jackjackParrIncrediblePotential)).toBe(
        baseStrength + 2,
      );
    });

    it("mills the top card when accepted; action card gives +2 lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 3 },
        { deck: [actionDeckCard], play: [jackjackParrIncrediblePotential] },
      );

      const baseLore = jackjackParrIncrediblePotential.lore;

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(jackjackParrIncrediblePotential, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // actionDeckCard was milled
      expect(testEngine.asPlayerTwo().getCardZone(actionDeckCard)).toBe("discard");
      // Jack-Jack gets +2 lore because revealed card is an action
      expect(testEngine.asPlayerTwo().getCardLore(jackjackParrIncrediblePotential)).toBe(
        baseLore + 2,
      );
    });

    it("may decline the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 3 },
        { deck: [characterDeckCard], play: [jackjackParrIncrediblePotential] },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(jackjackParrIncrediblePotential, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // No card was milled into discard (it gets drawn to hand on normal start-of-turn draw)
      expect(testEngine.asPlayerTwo().getCardZone(characterDeckCard)).not.toBe("discard");
      // No strength bonus from milling
      expect(testEngine.asPlayerTwo().getCardStrength(jackjackParrIncrediblePotential)).toBe(
        jackjackParrIncrediblePotential.strength,
      );
    });
  });
});
