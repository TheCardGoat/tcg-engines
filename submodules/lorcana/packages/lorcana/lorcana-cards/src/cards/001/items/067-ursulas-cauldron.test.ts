import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { ursulasCauldron } from "./067-ursulas-cauldron";

const topDeckCard = createMockCharacter({
  id: "ursulas-cauldron-top-deck-card",
  name: "Top Deck Card",
  cost: 1,
});

const secondDeckCard = createMockCharacter({
  id: "ursulas-cauldron-second-deck-card",
  name: "Second Deck Card",
  cost: 2,
});

const bottomDeckCard = createMockCharacter({
  id: "ursulas-cauldron-bottom-deck-card",
  name: "Bottom Deck Card",
  cost: 3,
});

describe("Ursula's Cauldron", () => {
  it("requires exactly one looked-at card on top and the other on the bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [topDeckCard, secondDeckCard, bottomDeckCard],
      play: [ursulasCauldron],
    });

    expect(testEngine.asPlayerOne().activateAbility(ursulasCauldron)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);

    expect(
      testEngine.asPlayerOne().resolvePendingEffect(ursulasCauldron, {
        destinations: [{ zone: "deck-bottom", cards: [secondDeckCard, bottomDeckCard] }],
      }),
    ).toMatchObject({
      success: false,
      errorCode: "INVALID_RESOLVE_EFFECT_SCRY_DESTINATIONS",
    });

    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      topDeckCard.id,
      secondDeckCard.id,
      bottomDeckCard.id,
    ]);
  });

  it("lets you choose one looked-at card for the top and the other for the bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [topDeckCard, secondDeckCard, bottomDeckCard],
      play: [ursulasCauldron],
    });

    expect(testEngine.asPlayerOne().activateAbility(ursulasCauldron)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(ursulasCauldron)).toBe(true);

    expect(
      testEngine.asPlayerOne().resolvePendingEffect(ursulasCauldron, {
        destinations: [
          { zone: "deck-top", cards: [bottomDeckCard] },
          { zone: "deck-bottom", cards: [secondDeckCard] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      secondDeckCard.id,
      topDeckCard.id,
      bottomDeckCard.id,
    ]);
  });
});
