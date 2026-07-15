import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { daisyDuckSapphireChampion } from "./158-daisy-duck-sapphire-champion";

const sapphireQuester = createMockCharacter({
  id: "daisy-champ-sapphire-quester",
  name: "Sapphire Quester",
  cost: 2,
  lore: 1,
  inkType: ["sapphire"],
});

const nonSapphireQuester = createMockCharacter({
  id: "daisy-champ-non-sapphire-quester",
  name: "Non-Sapphire Quester",
  cost: 2,
  lore: 1,
  inkType: ["amber"],
});

const topCard = createMockCharacter({
  id: "daisy-champ-top-card",
  name: "Top Card",
  cost: 1,
});
const secondCard = createMockCharacter({
  id: "daisy-champ-second-card",
  name: "Second Card",
  cost: 2,
});

describe("Daisy Duck - Sapphire Champion", () => {
  it("STAND FAST - gives other Sapphire characters Resist +1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: daisyDuckSapphireChampion, isDrying: false },
        { card: sapphireQuester, isDrying: false },
      ],
    });

    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: sapphireQuester,
      keyword: "Resist",
      value: 1,
    });
    expect(testEngine.getKeywordValue(sapphireQuester, "Resist")).toBe(1);
    expect(testEngine.hasKeyword(daisyDuckSapphireChampion, "Resist")).toBe(false);
  });

  it("LOOK AHEAD - looks at top card and can put it on bottom when another Sapphire character quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [topCard, secondCard],
      play: [
        { card: daisyDuckSapphireChampion, isDrying: false },
        { card: sapphireQuester, isDrying: false },
      ],
    });

    expect(testEngine.asPlayerOne().quest(sapphireQuester)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(daisyDuckSapphireChampion),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        destinations: [
          { zone: "deck-top", cards: [] },
          { zone: "deck-bottom", cards: [secondCard] },
        ],
      }),
    ).toBeSuccessfulCommand();

    const deckIds = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);
    expect(deckIds).toEqual([secondCard.id, topCard.id]); // index 0 = bottom, index 1 = top
  });

  it("LOOK AHEAD - does NOT trigger when a non-Sapphire character quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [topCard, secondCard],
      play: [
        { card: daisyDuckSapphireChampion, isDrying: false },
        { card: nonSapphireQuester, isDrying: false },
      ],
    });

    expect(testEngine.asPlayerOne().quest(nonSapphireQuester)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
