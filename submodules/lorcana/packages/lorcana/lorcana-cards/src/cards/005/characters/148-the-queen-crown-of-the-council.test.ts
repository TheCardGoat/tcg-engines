import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theQueenCrownOfTheCouncil } from "./148-the-queen-crown-of-the-council";
import { theQueenCruelestOfAll } from "./139-the-queen-cruelest-of-all";
import { theQueenFairestOfAll } from "./144-the-queen-fairest-of-all";

const nonQueenFiller = createMockCharacter({
  id: "queen-crown-filler",
  name: "Filler Character",
  cost: 1,
});

describe("The Queen - Crown of the Council", () => {
  describe("GATHERER OF THE WICKED - When you play this character, look at the top 3 cards of your deck. You may reveal any number of character cards named The Queen and put them into your hand. Put the rest on the bottom of your deck in any order.", () => {
    it("triggers a scry bag when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [theQueenCrownOfTheCouncil],
        inkwell: theQueenCrownOfTheCouncil.cost,
        deck: [theQueenFairestOfAll, theQueenCruelestOfAll, nonQueenFiller],
      });

      expect(testEngine.asPlayerOne().playCard(theQueenCrownOfTheCouncil)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("puts The Queen character cards into hand and non-Queen cards on the bottom", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [theQueenCrownOfTheCouncil],
        inkwell: theQueenCrownOfTheCouncil.cost,
        deck: [theQueenFairestOfAll, theQueenCruelestOfAll, nonQueenFiller],
      });

      expect(testEngine.asPlayerOne().playCard(theQueenCrownOfTheCouncil)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theQueenCrownOfTheCouncil),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "hand", cards: [theQueenFairestOfAll, theQueenCruelestOfAll] },
            { zone: "deck-bottom", cards: [nonQueenFiller] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(theQueenFairestOfAll)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(theQueenCruelestOfAll)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(nonQueenFiller)).toBe("deck");
    });

    it("puts all cards on the bottom when choosing not to take any Queen cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [theQueenCrownOfTheCouncil],
        inkwell: theQueenCrownOfTheCouncil.cost,
        deck: [theQueenFairestOfAll, theQueenCruelestOfAll, nonQueenFiller],
      });

      expect(testEngine.asPlayerOne().playCard(theQueenCrownOfTheCouncil)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(theQueenCrownOfTheCouncil),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "hand", cards: [] },
            {
              zone: "deck-bottom",
              cards: [theQueenFairestOfAll, theQueenCruelestOfAll, nonQueenFiller],
            },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(theQueenFairestOfAll)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(theQueenCruelestOfAll)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(nonQueenFiller)).toBe("deck");
    });
  });
});
