import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { kidaCreativeThinker } from "./164-kida-creative-thinker";

const deckCard1 = createMockCharacter({
  id: "kida-deck-card-1",
  name: "Deck Card 1",
  cost: 2,
  inkable: true,
});

const deckCard2 = createMockCharacter({
  id: "kida-deck-card-2",
  name: "Deck Card 2",
  cost: 3,
  inkable: true,
});

describe("Kida - Creative Thinker", () => {
  it("has the expected printed metadata", () => {
    expect(kidaCreativeThinker).toMatchObject({
      id: "F39",
      canonicalId: "ci_F39",
      cardType: "character",
      name: "Kida",
      version: "Creative Thinker",
      set: "007",
      cardNumber: 164,
      cost: 4,
      strength: 3,
      willpower: 3,
      lore: 1,
      inkable: true,
    });
  });

  it("has Ward keyword", () => {
    const testEngine = new LorcanaTestEngine({
      play: [kidaCreativeThinker],
    });

    const cardModel = testEngine.getCardModel(kidaCreativeThinker);
    expect(cardModel.hasWard()).toBe(true);
  });

  it("KEY TO THE PUZZLE {E} - exerts Kida and puts one card from top 2 into inkwell and the other on top of deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: kidaCreativeThinker, isDrying: false }],
      deck: [deckCard1, deckCard2],
    });

    const result = testEngine
      .asPlayerOne()
      .activateAbility(kidaCreativeThinker, "KEY TO THE PUZZLE");
    expect(result).toBeSuccessfulCommand();

    // Kida should be exerted after using her ability
    expect(testEngine.asPlayerOne().isExerted(kidaCreativeThinker)).toBe(true);

    // There should be a pending scry selection
    const pendingEffects = testEngine.asPlayerOne().getPendingEffects();
    if (pendingEffects.length > 0) {
      const deckCard1Id = testEngine.findCardInstanceId(deckCard1, "deck", "p1");
      const deckCard2Id = testEngine.findCardInstanceId(deckCard2, "deck", "p1");

      // Put deckCard1 into inkwell, keep deckCard2 on top
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          destinations: [
            { zone: "inkwell", cards: [deckCard1Id] },
            { zone: "deck-top", cards: [deckCard2Id] },
          ],
        }),
      ).toBeSuccessfulCommand();

      // deckCard1 should be in inkwell, face down and exerted
      expect(testEngine.asPlayerOne().getCardZone(deckCard1Id)).toBe("inkwell");
      expect(testEngine.asPlayerOne().isExerted(deckCard1Id)).toBe(true);

      // deckCard2 should remain on top of deck
      expect(testEngine.asPlayerOne().getCardZone(deckCard2Id)).toBe("deck");
    }
  });

  it("projects inkwell destination metadata for the pending scry selection", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: kidaCreativeThinker, isDrying: false }],
      deck: [deckCard1, deckCard2],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(kidaCreativeThinker, "KEY TO THE PUZZLE"),
    ).toBeSuccessfulCommand();

    const pendingEffect = testEngine.asServer().getState().G.pendingEffects[0];
    expect(pendingEffect?.selectionContext).toMatchObject({
      kind: "scry-selection",
      destinationRules: [
        {
          zone: "inkwell",
          max: 1,
          min: 1,
          exerted: true,
          facedown: true,
        },
        {
          zone: "deck-top",
          remainder: true,
        },
      ],
    });
  });
});
