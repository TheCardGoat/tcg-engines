import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
} from "../../../../testing";

const singer = createMockCharacter({
  id: "scry-singer",
  name: "Singer",
  cost: 1,
  abilities: [{ type: "keyword", keyword: "Singer", value: 2 }],
});
const ordinary = createMockCharacter({ id: "scry-ordinary", name: "Ordinary", cost: 1 });
const search = createMockAction({
  id: "scry-search",
  name: "Search",
  cost: 1,
  text: "Look for a Singer.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "scry",
        amount: 2,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            filters: [
              { type: "card-type", cardType: "character" },
              { type: "has-keyword", keyword: "Singer" },
            ],
          },
          { zone: "deck-bottom", remainder: true },
        ],
      },
    },
  ],
});

describe("scry keyword filters", () => {
  it("rejects a character without the keyword and leaves the choice available", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [search],
      inkwell: 1,
      deck: [singer, ordinary],
    });
    expect(game.asPlayerOne().playCard(search)).toBeSuccessfulCommand();
    expect(
      game
        .asPlayerOne()
        .resolveNextPending({ destinations: [{ zone: "hand", cards: [ordinary] }] }),
    ).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolveNextPending({ destinations: [{ zone: "hand", cards: [singer] }] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(singer)).toBe("hand");
    expect(game.asPlayerOne().getCardZone(ordinary)).toBe("deck");
  });
});
