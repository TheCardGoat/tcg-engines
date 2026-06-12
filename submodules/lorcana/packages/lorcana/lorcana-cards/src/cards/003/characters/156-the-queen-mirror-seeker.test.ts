import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theQueenMirrorSeeker } from "./156-the-queen-mirror-seeker";

const cardA = createMockCharacter({ id: "queen-scry-a", name: "Scry Card A", cost: 1 });
const cardB = createMockCharacter({ id: "queen-scry-b", name: "Scry Card B", cost: 2 });
const cardC = createMockCharacter({ id: "queen-scry-c", name: "Scry Card C", cost: 3 });

describe("The Queen - Mirror Seeker", () => {
  describe("CALCULATING AND VAIN - Whenever this character quests, you may look at the top 3 cards of your deck and put them back in any order.", () => {
    it("scries 3 and reorders them on top of the deck when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: [cardA, cardB, cardC],
        play: [{ card: theQueenMirrorSeeker, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().quest(theQueenMirrorSeeker)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theQueenMirrorSeeker),
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

    it("does not scry when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        deck: [cardA, cardB, cardC],
        play: [{ card: theQueenMirrorSeeker, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().quest(theQueenMirrorSeeker)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(theQueenMirrorSeeker, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ deck: 3 });
    });
  });
});
