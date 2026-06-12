import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { sisuDivineWaterDragon } from "./159-sisu-divine-water-dragon";

const fillerA = createMockCharacter({ id: "sisu-filler-a", name: "Filler A", cost: 1 });
const fillerB = createMockCharacter({ id: "sisu-filler-b", name: "Filler B", cost: 2 });
const fillerC = createMockCharacter({ id: "sisu-filler-c", name: "Filler C", cost: 3 });

describe("Sisu - Divine Water Dragon", () => {
  describe("I TRUST YOU - Whenever this character quests, look at the top 2 cards of your deck. You may put one into your hand. Put the rest on the bottom of your deck in any order.", () => {
    it("picks one card to hand and puts the rest on bottom when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: [fillerA, fillerB, fillerC],
        play: [{ card: sisuDivineWaterDragon, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().quest(sisuDivineWaterDragon)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(sisuDivineWaterDragon),
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
