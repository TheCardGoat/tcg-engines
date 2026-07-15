import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { grammaTalaKeeperOfAncientStories } from "./142-gramma-tala-keeper-of-ancient-stories";

const fillerA = createMockCharacter({ id: "gramma-tala-filler-a", name: "Filler A", cost: 1 });
const fillerB = createMockCharacter({ id: "gramma-tala-filler-b", name: "Filler B", cost: 2 });
const fillerC = createMockCharacter({ id: "gramma-tala-filler-c", name: "Filler C", cost: 3 });

describe("Gramma Tala - Keeper of Ancient Stories", () => {
  describe("THERE WAS ONLY OCEAN - When you play this character, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.", () => {
    it("picks one card to hand and puts the rest on bottom when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [grammaTalaKeeperOfAncientStories],
        inkwell: grammaTalaKeeperOfAncientStories.cost,
        deck: [fillerA, fillerB, fillerC],
      });

      expect(
        testEngine.asPlayerOne().playCard(grammaTalaKeeperOfAncientStories),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(grammaTalaKeeperOfAncientStories),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "hand", cards: [fillerB] },
            { zone: "deck-bottom", cards: [fillerC] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(fillerB)).toBe("hand");
      expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
        fillerC.id,
        fillerA.id,
      ]);
    });
  });
});
