import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { gastonIntellectualPowerhouse } from "./147-gaston-intellectual-powerhouse";

const fillerA = createMockCharacter({ id: "gaston-filler-a", name: "Filler A", cost: 1 });
const fillerB = createMockCharacter({ id: "gaston-filler-b", name: "Filler B", cost: 2 });
const fillerC = createMockCharacter({ id: "gaston-filler-c", name: "Filler C", cost: 3 });

describe("Gaston - Intellectual Powerhouse", () => {
  describe("DEVELOPED BRAIN - When you play this character, look at the top 3 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.", () => {
    it("picks one card to hand and puts the rest on bottom when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [gastonIntellectualPowerhouse],
        inkwell: gastonIntellectualPowerhouse.cost,
        deck: [fillerA, fillerB, fillerC],
      });

      expect(
        testEngine.asPlayerOne().playCard(gastonIntellectualPowerhouse),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(gastonIntellectualPowerhouse),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "hand", cards: [fillerA] },
            { zone: "deck-bottom", cards: [fillerC, fillerB] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(fillerA)).toBe("hand");
      expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
        fillerB.id,
        fillerC.id,
      ]);
    });
  });
});
