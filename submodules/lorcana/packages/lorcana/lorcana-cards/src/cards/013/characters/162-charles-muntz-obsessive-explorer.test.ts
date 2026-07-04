import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { charlesMuntzObsessiveExplorer } from "./162-charles-muntz-obsessive-explorer";

const usefulItem = createMockItem({
  id: "charles-muntz-useful-item",
  name: "Useful Item",
  cost: 1,
});

const bottomCard = createMockCharacter({
  id: "charles-muntz-bottom-card",
  name: "Bottom Card",
  cost: 1,
});

const topCard = createMockCharacter({
  id: "charles-muntz-top-card",
  name: "Top Card",
  cost: 1,
});

const kevin = createMockCharacter({
  id: "charles-muntz-kevin",
  name: "Kevin",
  cost: 4,
});

describe("Charles Muntz - Obsessive Explorer", () => {
  it("looks at the top card and may put it on the bottom when you play an item", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [charlesMuntzObsessiveExplorer],
      hand: [usefulItem],
      inkwell: usefulItem.cost,
      deck: [bottomCard, topCard],
    });

    expect(testEngine.asPlayerOne().playCard(usefulItem)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(charlesMuntzObsessiveExplorer, {
        destinations: [
          { zone: "deck-top", cards: [] },
          { zone: "deck-bottom", cards: [topCard] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      topCard.id,
      bottomCard.id,
    ]);
  });

  it("may reveal Kevin from the top of the deck, put him into hand, and gain 3 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [charlesMuntzObsessiveExplorer],
      deck: [kevin],
    });

    expect(testEngine.asPlayerOne().quest(charlesMuntzObsessiveExplorer)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(charlesMuntzObsessiveExplorer, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(kevin)).toBe("hand");
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(
      charlesMuntzObsessiveExplorer.lore + 3,
    );
  });

  it("puts the top card on the bottom and gains no extra lore when it is not Kevin", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [charlesMuntzObsessiveExplorer],
      deck: [bottomCard, topCard],
    });

    expect(testEngine.asPlayerOne().quest(charlesMuntzObsessiveExplorer)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(topCard)).toBe("deck");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 2 });
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      topCard.id,
      bottomCard.id,
    ]);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(charlesMuntzObsessiveExplorer.lore);
  });
});
