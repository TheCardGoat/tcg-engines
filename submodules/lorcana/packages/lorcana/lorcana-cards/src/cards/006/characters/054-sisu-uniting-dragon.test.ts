import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { sisuUnitingDragon } from "./054-sisu-uniting-dragon";

const dragonOne = createMockCharacter({
  id: "sisu-dragon-one",
  name: "Dragon One",
  cost: 3,
  classifications: ["Storyborn", "Hero", "Dragon"],
});

const dragonTwo = createMockCharacter({
  id: "sisu-dragon-two",
  name: "Dragon Two",
  cost: 4,
  classifications: ["Storyborn", "Ally", "Dragon"],
});

const nonDragon = createMockCharacter({
  id: "sisu-non-dragon",
  name: "Non Dragon",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

describe("Sisu - Uniting Dragon", () => {
  describe("TRUST BUILDS TRUST", () => {
    it("puts a Dragon character card into hand when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [sisuUnitingDragon],
        deck: [dragonOne],
      });

      expect(testEngine.asPlayerOne().quest(sisuUnitingDragon)).toBeSuccessfulCommand();

      // Triggered ability fires: reveal top card (dragonOne), it's a Dragon → put in hand
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          destinations: [{ zone: "hand", cards: [dragonOne] }],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(dragonOne)).toBe("hand");
    });

    it("puts non-dragon on top of deck when player chooses top", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [sisuUnitingDragon],
        deck: [nonDragon],
      });

      expect(testEngine.asPlayerOne().quest(sisuUnitingDragon)).toBeSuccessfulCommand();

      // Triggered ability fires: reveal top card (nonDragon), it's NOT a Dragon → put on top/bottom
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          destinations: [
            { zone: "deck-top", cards: [nonDragon] },
            { zone: "deck-bottom", cards: [] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(nonDragon)).toBe("deck");
    });

    it("puts non-dragon on bottom of deck when player chooses bottom", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [sisuUnitingDragon],
        deck: [nonDragon],
      });

      expect(testEngine.asPlayerOne().quest(sisuUnitingDragon)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          destinations: [
            { zone: "deck-top", cards: [] },
            { zone: "deck-bottom", cards: [nonDragon] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(nonDragon)).toBe("deck");
    });

    it("repeats effect when two dragons are on top", () => {
      // deck: [dragonTwo, dragonOne] — index 0 = bottom, index 1 = top.
      // dragonOne is on top, so it's revealed first.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [sisuUnitingDragon],
        deck: [dragonTwo, dragonOne],
      });

      expect(testEngine.asPlayerOne().quest(sisuUnitingDragon)).toBeSuccessfulCommand();

      // First iteration: dragonOne is on top, it's a Dragon → put in hand
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          destinations: [{ zone: "hand", cards: [dragonOne] }],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(dragonOne)).toBe("hand");

      // Second iteration creates a pending scry selection for the next revealed card.
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [{ zone: "hand", cards: [dragonTwo] }],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(dragonTwo)).toBe("hand");
    });

    it("stops repeating when a non-dragon is revealed", () => {
      // The first deck entry is the top card, so nonDragon is revealed first.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [sisuUnitingDragon],
        deck: [nonDragon, dragonOne],
      });

      expect(testEngine.asPlayerOne().quest(sisuUnitingDragon)).toBeSuccessfulCommand();

      // nonDragon is on top → put on bottom
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({
          destinations: [
            { zone: "deck-top", cards: [] },
            { zone: "deck-bottom", cards: [nonDragon] },
          ],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(nonDragon)).toBe("deck");

      // No more bags expected - effect ended
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // dragonOne is still in deck
      expect(testEngine.asPlayerOne().getCardZone(dragonOne)).toBe("deck");
    });
  });
});
