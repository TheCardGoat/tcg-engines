import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { yzmaAlchemist } from "./060-yzma-alchemist";

const yzmaTopDeckCard = createMockCharacter({
  id: "yzma-alchemist-top",
  name: "Yzma Top Card",
  cost: 1,
});

const yzmaSecondDeckCard = createMockCharacter({
  id: "yzma-alchemist-second",
  name: "Yzma Second Card",
  cost: 2,
});

describe("Yzma - Alchemist", () => {
  it("reorders the looked-at top card when she quests", () => {
    const initialDeckOrder = [yzmaTopDeckCard, yzmaSecondDeckCard];
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: initialDeckOrder,
      play: [{ card: yzmaAlchemist, isDrying: false }],
    });

    const getDeckDefinitionIdsAuthoritative = () =>
      testEngine
        .getCardInstanceIdsInZone("deck", PLAYER_ONE)
        .map((cardId) => testEngine.getCardDefinitionId(cardId) ?? cardId);

    expect(testEngine.asPlayerOne().quest(yzmaAlchemist)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolvePendingByCard(yzmaAlchemist)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [] },
          { zone: "deck-bottom", cards: [yzmaSecondDeckCard] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(getDeckDefinitionIdsAuthoritative()).toEqual([
      yzmaSecondDeckCard.id,
      yzmaTopDeckCard.id,
    ]);
  });
});
