import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { arielSpectacularSinger } from "./002-ariel-spectacular-singer";

const fillerA = createMockCharacter({ id: "ariel-filler-a", name: "Filler A", cost: 1 });
const fillerB = createMockCharacter({ id: "ariel-filler-b", name: "Filler B", cost: 2 });
const fillerC = createMockCharacter({ id: "ariel-filler-c", name: "Filler C", cost: 3 });
const testSong = createMockSong({
  id: "ariel-test-song",
  name: "Test Song",
  cost: 2,
  text: "A test song for Ariel.",
});

describe("Ariel - Spectacular Singer", () => {
  describe("MUSICAL DEBUT - When you play this character, look at the top 4 cards of your deck. You may reveal a song card and put it into your hand. Put the rest on the bottom of your deck in any order.", () => {
    it("picks a song card to hand and puts the rest on bottom when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [arielSpectacularSinger],
        inkwell: arielSpectacularSinger.cost,
        deck: [fillerA, testSong, fillerB, fillerC],
      });

      expect(testEngine.asPlayerOne().playCard(arielSpectacularSinger)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(arielSpectacularSinger),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "hand", cards: [testSong] },
            { zone: "deck-bottom", cards: [fillerB, fillerA, fillerC] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(testSong)).toBe("hand");
      expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
        fillerC.id,
        fillerA.id,
        fillerB.id,
      ]);
    });
  });
});
