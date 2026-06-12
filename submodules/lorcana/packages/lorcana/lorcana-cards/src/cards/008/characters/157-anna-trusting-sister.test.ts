import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { annaTrustingSister } from "./157-anna-trusting-sister";

const elsaMock = createMockCharacter({
  id: "elsa-mock",
  name: "Elsa",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const notElsaMock = createMockCharacter({
  id: "not-elsa-mock",
  name: "Olaf",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

describe("Anna - Trusting Sister", () => {
  it("WE CAN DO THIS TOGETHER - puts top card of deck into inkwell when Elsa is in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [elsaMock],
      hand: [annaTrustingSister],
      deck: 5,
      inkwell: 3,
    });

    const inkwellBefore = testEngine.asPlayerOne().getCardsInZone("inkwell", PLAYER_ONE).count;
    const deckBefore = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;

    // Play Anna - triggers WE CAN DO THIS TOGETHER
    expect(testEngine.asPlayerOne().playCard(annaTrustingSister)).toBeSuccessfulCommand();

    // Resolve the bag effect (put top card into inkwell)
    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    for (const bagEffect of bagEffects) {
      testEngine.asPlayerOne().resolvePendingByCard(annaTrustingSister, {
        resolveOptional: true,
      });
    }

    const inkwellAfter = testEngine.asPlayerOne().getCardsInZone("inkwell", PLAYER_ONE).count;
    const deckAfter = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;

    // Inkwell should have gained one card (from deck top)
    expect(inkwellAfter).toBe(inkwellBefore + 1);
    // Deck should have lost one card
    expect(deckAfter).toBe(deckBefore - 1);
  });

  it("WE CAN DO THIS TOGETHER - does NOT put card into inkwell when no Elsa in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [notElsaMock],
      hand: [annaTrustingSister],
      deck: 5,
      inkwell: 3,
    });

    const inkwellBefore = testEngine.asPlayerOne().getCardsInZone("inkwell", PLAYER_ONE).count;

    // Play Anna - triggers ability but condition not met
    expect(testEngine.asPlayerOne().playCard(annaTrustingSister)).toBeSuccessfulCommand();

    // Resolve any bag effects
    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    for (const bagEffect of bagEffects) {
      testEngine.asPlayerOne().resolvePendingByCard(annaTrustingSister, {
        resolveOptional: true,
      });
    }

    const inkwellAfter = testEngine.asPlayerOne().getCardsInZone("inkwell", PLAYER_ONE).count;

    // Inkwell should NOT have gained a card - no Elsa in play
    expect(inkwellAfter).toBe(inkwellBefore);
  });
});
