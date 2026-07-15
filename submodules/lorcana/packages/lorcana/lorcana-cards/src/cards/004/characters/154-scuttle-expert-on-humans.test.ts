import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { scuttleExpertOnHumans } from "./154-scuttle-expert-on-humans";

const matchingItem = createMockItem({
  id: "matching-item",
  name: "Matching Item",
  cost: 2,
});

const matchingItem2 = createMockItem({
  id: "matching-item-2",
  name: "Matching Item 2",
  cost: 3,
});

const nonMatchA = createMockCharacter({
  id: "non-match-a",
  name: "Non Match A",
  cost: 1,
});

const nonMatchB = createMockCharacter({
  id: "non-match-b",
  name: "Non Match B",
  cost: 3,
});

const nonMatchC = createMockCharacter({
  id: "non-match-c",
  name: "Non Match C",
  cost: 4,
});

const nonMatchD = createMockCharacter({
  id: "non-match-d",
  name: "Non Match D",
  cost: 2,
});

describe("Scuttle - Expert on Humans", () => {
  describe("LET ME SEE - When you play this character, look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.", () => {
    it("reveals an item card to hand, puts rest on bottom", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [scuttleExpertOnHumans],
        inkwell: scuttleExpertOnHumans.cost,
        deck: [nonMatchA, matchingItem, nonMatchB, nonMatchC],
      });

      expect(testEngine.asPlayerOne().playCard(scuttleExpertOnHumans)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().resolveOnlyBag()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "hand", cards: [matchingItem] },
            { zone: "deck-bottom", cards: [nonMatchC, nonMatchB, nonMatchA] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(matchingItem)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(nonMatchA)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(nonMatchB)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(nonMatchC)).toBe("deck");
    });

    it("puts all cards on bottom of deck when no items are revealed", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [scuttleExpertOnHumans],
        inkwell: scuttleExpertOnHumans.cost,
        deck: [nonMatchA, nonMatchB, nonMatchC, nonMatchD],
      });

      expect(testEngine.asPlayerOne().playCard(scuttleExpertOnHumans)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().resolveOnlyBag()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "deck-bottom", cards: [nonMatchD, nonMatchC, nonMatchB, nonMatchA] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(nonMatchA)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(nonMatchB)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(nonMatchC)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(nonMatchD)).toBe("deck");
    });

    it("can reveal only one item even when multiple items are revealed (max 1)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [scuttleExpertOnHumans],
        inkwell: scuttleExpertOnHumans.cost,
        deck: [matchingItem, matchingItem2, nonMatchA, nonMatchB],
      });

      expect(testEngine.asPlayerOne().playCard(scuttleExpertOnHumans)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().resolveOnlyBag()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "hand", cards: [matchingItem] },
            { zone: "deck-bottom", cards: [nonMatchB, nonMatchA, matchingItem2] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(matchingItem)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(matchingItem2)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(nonMatchA)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(nonMatchB)).toBe("deck");
    });

    it("may choose not to reveal an item (optional)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [scuttleExpertOnHumans],
        inkwell: scuttleExpertOnHumans.cost,
        deck: [nonMatchA, matchingItem, nonMatchB, nonMatchC],
      });

      expect(testEngine.asPlayerOne().playCard(scuttleExpertOnHumans)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().resolveOnlyBag()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "hand", cards: [] },
            { zone: "deck-bottom", cards: [nonMatchC, nonMatchB, matchingItem, nonMatchA] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(matchingItem)).toBe("deck");
    });
  });
});
