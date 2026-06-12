import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pascalInquisitivePet } from "./151-pascal-inquisitive-pet";

const cardA = createMockCharacter({ id: "pascal-scry-a", name: "Scry Card A", cost: 1 });
const cardB = createMockCharacter({ id: "pascal-scry-b", name: "Scry Card B", cost: 2 });
const cardC = createMockCharacter({ id: "pascal-scry-c", name: "Scry Card C", cost: 3 });

describe("Pascal - Inquisitive Pet", () => {
  describe("COLORFUL TACTICS - When you play this character, look at the top 3 cards of your deck and put them back in any order.", () => {
    it("scries 3 and reorders them on top of the deck when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [pascalInquisitivePet],
        inkwell: pascalInquisitivePet.cost,
        deck: [cardA, cardB, cardC],
      });

      expect(testEngine.asPlayerOne().playCard(pascalInquisitivePet)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pascalInquisitivePet),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [{ zone: "deck-top", cards: [cardC, cardA, cardB] }],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cardA)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(cardB)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(cardC)).toBe("deck");
    });
  });
});
