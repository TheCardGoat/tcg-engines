import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { belleReflectiveWriter } from "./075-belle-reflective-writer";
import { createMockAction } from "@tcg/lorcana-engine/testing";

const cityGuide = createMockItem({
  id: "belle-reflective-city-guide",
  name: "Belle's City Guide",
  cost: 2,
});

const otherItem = createMockItem({
  id: "belle-reflective-other-item",
  name: "Unrelated Keepsake",
  cost: 2,
});

const actionCard = createMockAction({
  id: "belle-reflective-action",
  name: "Simple Action",
  cost: 2,
});

const characterCard = createMockCharacter({
  id: "belle-reflective-character",
  name: "Plain Character",
  cost: 2,
});

describe("Belle - Reflective Writer", () => {
  it("CITY ADVENTURES reveals an action card on top and may put it into your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [belleReflectiveWriter],
      inkwell: belleReflectiveWriter.cost,
      deck: [characterCard, actionCard],
    });

    expect(testEngine.asPlayerOne().playCard(belleReflectiveWriter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    // Top of deck is the last fixture card.
    const topOfDeck = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE).at(-1)!;
    expect(testEngine.getCardDefinitionId(topOfDeck)).toBe(actionCard.id);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(belleReflectiveWriter, {
        destinations: [
          { zone: "hand", cards: [topOfDeck] },
          { zone: "deck-bottom", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(actionCard)).toBe("hand");
    expect(testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toContain(topOfDeck);
    expect(testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE)).not.toContain(topOfDeck);
  });

  it("takes an item named Belle's City Guide into your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [belleReflectiveWriter],
      inkwell: belleReflectiveWriter.cost,
      deck: [characterCard, cityGuide],
    });

    expect(testEngine.asPlayerOne().playCard(belleReflectiveWriter)).toBeSuccessfulCommand();

    const topOfDeck = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE).at(-1)!;
    expect(testEngine.getCardDefinitionId(topOfDeck)).toBe(cityGuide.id);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(belleReflectiveWriter, {
        destinations: [
          { zone: "hand", cards: [topOfDeck] },
          { zone: "deck-bottom", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(cityGuide)).toBe("hand");
  });

  it("puts a non-matching card on the bottom of your deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [belleReflectiveWriter],
      inkwell: belleReflectiveWriter.cost,
      deck: [otherItem, characterCard],
    });

    expect(testEngine.asPlayerOne().playCard(belleReflectiveWriter)).toBeSuccessfulCommand();

    const topOfDeck = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE).at(-1)!;
    expect(testEngine.getCardDefinitionId(topOfDeck)).toBe(characterCard.id);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(belleReflectiveWriter, {
        destinations: [
          { zone: "hand", cards: [] },
          { zone: "deck-bottom", cards: [topOfDeck] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(characterCard)).toBe("deck");
    // Bottom of the deck is the first entry in the zone list.
    const deckOrder = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(testEngine.getCardDefinitionId(deckOrder[0]!)).toBe(characterCard.id);
  });
});

describe("City Adventures boundaries", () => {
  for (const top of [actionCard, cityGuide]) {
    it(`can decline ${top.name} and puts it below untouched cards`, () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [belleReflectiveWriter],
        inkwell: 2,
        deck: [characterCard, top],
      });
      expect(game.asPlayerOne().playCard(belleReflectiveWriter)).toBeSuccessfulCommand();
      expect(
        game.asPlayerOne().resolvePendingByCard(belleReflectiveWriter, {
          destinations: [
            { zone: "hand", cards: [] },
            { zone: "deck-bottom", cards: [top] },
          ],
        }),
      ).toBeSuccessfulCommand();
      expect(
        game.getCardInstanceIdsInZone("deck", PLAYER_ONE).map((id) => game.getCardDefinitionId(id)),
      ).toEqual([top.id, characterCard.id]);
      expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
    });
  }
  for (const top of [
    otherItem,
    createMockCharacter({ id: "belle-wrong-type-guide", name: "Belle's City Guide", cost: 2 }),
  ]) {
    it(`does not take ${top.id} into hand`, () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [belleReflectiveWriter],
        inkwell: 2,
        deck: [characterCard, top],
      });
      expect(game.asPlayerOne().playCard(belleReflectiveWriter)).toBeSuccessfulCommand();
      if (game.asPlayerOne().getBagCount() > 0) {
        expect(
          game.asPlayerOne().resolvePendingByCard(belleReflectiveWriter, {
            destinations: [
              { zone: "hand", cards: [top] },
              { zone: "deck-bottom", cards: [] },
            ],
          }),
        ).not.toBeSuccessfulCommand();
      }
      expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
      expect(game.asPlayerOne().getCardZone(top)).toBe("deck");
    });
  }
  it("can take a song because it is an action", () => {
    const song = createMockSong({ id: "belle-song", name: "Song", cost: 2, text: "" });
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [belleReflectiveWriter],
      inkwell: 2,
      deck: [song],
    });
    expect(game.asPlayerOne().playCard(belleReflectiveWriter)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(belleReflectiveWriter, {
        destinations: [
          { zone: "hand", cards: [song] },
          { zone: "deck-bottom", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(song)).toBe("hand");
  });
  it("publicly reveals a non-matching top card before putting it on the bottom", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [belleReflectiveWriter],
      inkwell: 2,
      deck: [actionCard, otherItem],
    });
    expect(game.asPlayerOne().playCard(belleReflectiveWriter)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().resolvePendingByCard(belleReflectiveWriter)).toBeSuccessfulCommand();
    const reveals = game
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .flatMap((entry) => entry.public)
      .filter((message) => message.key === "lorcana.effect.resolve.revealTopCard");
    expect(reveals).toHaveLength(1);
  });
});

it("does nothing with an empty deck and does not count as a failed draw", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [belleReflectiveWriter], inkwell: 2, deck: [] },
    { deck: 6 },
  );
  expect(game.asPlayerOne().playCard(belleReflectiveWriter)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getBagCount()).toBe(0);
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
});

it("player two reveals only their top song and adds it to their hand", () => {
  const song = createMockSong({ id: "belle-player-two-song", name: "Song", cost: 2, text: "" });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [actionCard], deck: [cityGuide, otherItem] },
    { hand: [belleReflectiveWriter], inkwell: 2, deck: [characterCard, song, otherItem] },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(belleReflectiveWriter)).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().resolvePendingByCard(belleReflectiveWriter, {
      destinations: [
        { zone: "hand", cards: [song] },
        { zone: "deck-bottom", cards: [] },
      ],
    }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(song)).toBe("hand");
  expect(
    game.getCardInstanceIdsInZone("deck", PLAYER_TWO).map((id) => game.getCardDefinitionId(id)),
  ).toEqual([characterCard.id]);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(1);
  expect(
    game.getCardInstanceIdsInZone("deck", PLAYER_ONE).map((id) => game.getCardDefinitionId(id)),
  ).toEqual([cityGuide.id, otherItem.id]);
});
