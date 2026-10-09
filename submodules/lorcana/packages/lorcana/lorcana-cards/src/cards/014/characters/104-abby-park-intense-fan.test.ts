// CR 2.2.0: 6.1.4 (may), 6.2 (play triggers), 8.11.1 (Singer).
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
  createMockSong,
  createMockAction,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { singer } from "../../../helpers/abilities/singer";
import { abbyParkIntenseFan } from "./104-abby-park-intense-fan";

const singerCard = createMockCharacter({
  id: "abby-singer",
  name: "Singer Card",
  cost: 3,
  abilities: [singer(3)],
});
const song = createMockSong({ id: "abby-song", name: "Song Card", cost: 2, text: "" });
const filler = createMockItem({ id: "abby-filler", name: "Deck Filler", cost: 1 });
const plainCharacter = createMockCharacter({
  id: "abby-plain-character",
  name: "Plain Character",
  cost: 6,
});
const plainItem = createMockItem({ id: "abby-plain-item", name: "Plain Item", cost: 2 });
const plainAction = createMockAction({ id: "abby-plain-action", name: "Plain Action", cost: 2 });
const location = createMockLocation({ id: "abby-location", name: "Location", cost: 2 });

function deckOrder(game: LorcanaMultiplayerTestEngine) {
  return game
    .getCardInstanceIdsInZone("deck", PLAYER_ONE)
    .map((id) => game.getCardDefinitionId(id));
}

function publicMessages(game: LorcanaMultiplayerTestEngine) {
  return game
    .getServerEngine()
    .getRuntime()
    .getMoveLogHistory()
    .flatMap((entry) => entry.public);
}

describe("Abby Park - Intense Fan", () => {
  for (const accept of [true, false]) {
    it(`player two ${accept ? "accepts" : "declines"} their own revealed song with public identity and destination`, () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: [filler, song], inkDrops: 3 },
        { hand: [abbyParkIntenseFan], deck: [filler, song, plainItem], inkDrops: 4 },
      );
      expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      const top = game.findCardInstanceId(song, "deck", PLAYER_TWO);
      const enemyDeck = game.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      expect(
        game.asPlayerTwo().playCard(abbyParkIntenseFan, { inkDrops: 4 }),
      ).toBeSuccessfulCommand();
      const destinations = [
        { zone: "hand", cards: accept ? [top] : [] },
        { zone: "deck-bottom", cards: accept ? [] : [top] },
      ];
      expect(
        game.asPlayerOne().resolvePendingByCard(abbyParkIntenseFan, { destinations }),
      ).not.toBeSuccessfulCommand();
      expect(
        game.asPlayerTwo().resolvePendingByCard(abbyParkIntenseFan, { destinations }),
      ).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().getCardZone(top)).toBe(accept ? "hand" : "deck");
      expect(game.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(enemyDeck);
      expect(game.getCardInstanceIdsInZone("deck", PLAYER_TWO)[0]).toBe(
        accept ? game.findCardInstanceId(filler, "deck", PLAYER_TWO) : top,
      );
      expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
      expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
      expect(JSON.stringify(publicMessages(game))).toContain(top);
    });
  }
  for (const top of [singerCard, song]) {
    it(`accepts the revealed ${top.name} into hand and leaves other deck cards in order`, () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [abbyParkIntenseFan], inkwell: 4, deck: [filler, plainItem, top] },
        { deck: [plainAction, location] },
      );
      const opponentDeck = game.getCardInstanceIdsInZone("deck", PLAYER_TWO);
      expect(game.asPlayerOne().playCard(abbyParkIntenseFan)).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
      expect(game.asPlayerOne().getCardZone(top)).toBe("deck");
      expect(
        game.asPlayerOne().resolvePendingByCard(abbyParkIntenseFan, {
          destinations: [
            { zone: "hand", cards: [top] },
            { zone: "deck-bottom", cards: [] },
          ],
        }),
      ).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(top)).toBe("hand");
      expect(game.asPlayerOne().getZonesCardCount().hand).toBe(1);
      expect(deckOrder(game)).toEqual([filler.id, plainItem.id]);
      expect(game.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(opponentDeck);
      expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(game.getLore(PLAYER_ONE)).toBe(0);
    });
    it(`declines the revealed ${top.name} and puts it below an existing deck`, () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [abbyParkIntenseFan],
        inkwell: 4,
        deck: [filler, plainItem, top],
      });
      expect(game.asPlayerOne().playCard(abbyParkIntenseFan)).toBeSuccessfulCommand();
      expect(
        game.asPlayerOne().resolvePendingByCard(abbyParkIntenseFan, {
          destinations: [
            { zone: "hand", cards: [] },
            { zone: "deck-bottom", cards: [top] },
          ],
        }),
      ).toBeSuccessfulCommand();
      expect(deckOrder(game)).toEqual([top.id, filler.id, plainItem.id]);
      expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
      expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
    });
  }
  for (const top of [plainCharacter, plainItem, plainAction, location]) {
    it(`puts non-matching ${top.name} on the bottom without offering the hand route`, () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [abbyParkIntenseFan],
        inkwell: 4,
        deck: [filler, song, top],
      });
      expect(game.asPlayerOne().playCard(abbyParkIntenseFan)).toBeSuccessfulCommand();
      expect(
        game.asPlayerOne().resolvePendingByCard(abbyParkIntenseFan, {
          destinations: [
            { zone: "hand", cards: [top] },
            { zone: "deck-bottom", cards: [] },
          ],
        }),
      ).not.toBeSuccessfulCommand();
      expect(
        game.asPlayerOne().resolvePendingByCard(abbyParkIntenseFan, {
          destinations: [
            { zone: "hand", cards: [] },
            { zone: "deck-bottom", cards: [top] },
          ],
        }),
      ).toBeSuccessfulCommand();
      expect(deckOrder(game)).toEqual([top.id, filler.id, song.id]);
      expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
    });
  }
  it("does not treat a non-character with a Singer ability as a Singer character", () => {
    const item = createMockItem({
      id: "abby-keyword-item",
      name: "Keyword Item",
      cost: 1,
      abilities: [singer(3)],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [abbyParkIntenseFan],
      inkwell: 4,
      deck: [filler, item],
    });
    expect(game.asPlayerOne().playCard(abbyParkIntenseFan)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(abbyParkIntenseFan, {
        destinations: [
          { zone: "hand", cards: [item] },
          { zone: "deck-bottom", cards: [] },
        ],
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(abbyParkIntenseFan, {
        destinations: [
          { zone: "hand", cards: [] },
          { zone: "deck-bottom", cards: [item] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(deckOrder(game)).toEqual([item.id, filler.id]);
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });
  it("publicly reveals the top card when accepted", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [abbyParkIntenseFan],
      inkwell: 4,
      deck: [filler, singerCard],
    });
    expect(game.asPlayerOne().playCard(abbyParkIntenseFan)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().resolvePendingByCard(abbyParkIntenseFan)).toBeSuccessfulCommand();
    const reveals = publicMessages(game).filter(
      (message) => message.key === "lorcana.effect.resolve.revealTopCard",
    );
    expect(reveals).toHaveLength(1);
    expect(
      game.asPlayerOne().resolvePendingByCard(abbyParkIntenseFan, {
        destinations: [
          { zone: "hand", cards: [singerCard] },
          { zone: "deck-bottom", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(singerCard)).toBe("hand");
  });
  it("publicly reveals a non-matching top card before putting it on the bottom", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [abbyParkIntenseFan],
      inkwell: 4,
      deck: [filler, plainItem],
    });
    expect(game.asPlayerOne().playCard(abbyParkIntenseFan)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().resolvePendingByCard(abbyParkIntenseFan)).toBeSuccessfulCommand();
    expect(
      publicMessages(game).filter(
        (message) => message.key === "lorcana.effect.resolve.revealTopCard",
      ),
    ).toHaveLength(1);
    expect(
      game.asPlayerOne().resolvePendingByCard(abbyParkIntenseFan, {
        destinations: [
          { zone: "hand", cards: [] },
          { zone: "deck-bottom", cards: [plainItem] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(deckOrder(game)).toEqual([plainItem.id, filler.id]);
  });
  it("does nothing with an empty deck and completes without a choice", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [abbyParkIntenseFan], inkwell: 4, deck: [] },
      { deck: 6 },
    );
    expect(game.asPlayerOne().playCard(abbyParkIntenseFan)).toBeSuccessfulCommand();
    if (game.asPlayerOne().getBagCount() > 0)
      expect(game.asPlayerOne().resolvePendingByCard(abbyParkIntenseFan)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(
      publicMessages(game).filter(
        (message) => message.key === "lorcana.effect.resolve.revealTopCard",
      ),
    ).toHaveLength(0);
  });
  it("resolves two independent plays against the current top card", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [abbyParkIntenseFan, abbyParkIntenseFan],
      inkwell: 8,
      deck: [filler, song, singerCard],
    });
    const copies = game.getCardInstanceIdsInZone("hand", PLAYER_ONE);
    expect(game.asPlayerOne().playCard(copies[0]!)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(copies[0]!, {
        destinations: [
          { zone: "hand", cards: [singerCard] },
          { zone: "deck-bottom", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(copies[1]!)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(copies[1]!, {
        destinations: [
          { zone: "hand", cards: [] },
          { zone: "deck-bottom", cards: [song] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(singerCard)).toBe("hand");
    expect(deckOrder(game)).toEqual([song.id, filler.id]);
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  });
  it("does not reveal on quest and quests for her printed two lore", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [abbyParkIntenseFan],
      deck: [filler, song],
    });
    expect(game.asPlayerOne().quest(abbyParkIntenseFan)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(2);
    expect(deckOrder(game)).toEqual([filler.id, song.id]);
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });
  it("rejects insufficient play ink before a reveal or deck change", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [abbyParkIntenseFan],
      inkwell: 3,
      deck: [filler, song],
    });
    expect(game.asPlayerOne().playCard(abbyParkIntenseFan)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(game.asPlayerOne().getCardZone(abbyParkIntenseFan)).toBe("hand");
    expect(deckOrder(game)).toEqual([filler.id, song.id]);
    expect(publicMessages(game)).toHaveLength(0);
  });
  it("rejects cards outside the one revealed card before a valid retry", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [abbyParkIntenseFan], inkwell: 4, deck: [filler, singerCard, song], discard: [song] },
      { deck: [singerCard], discard: [song] },
    );
    const top = game.findCardInstanceId(song, "deck", PLAYER_ONE);
    const wrongCards = [
      game.findCardInstanceId(singerCard, "deck", PLAYER_ONE),
      game.findCardInstanceId(song, "discard", PLAYER_ONE),
      game.findCardInstanceId(singerCard, "deck", PLAYER_TWO),
    ];
    expect(game.asPlayerOne().playCard(abbyParkIntenseFan)).toBeSuccessfulCommand();
    for (const wrong of wrongCards) {
      expect(
        game.asPlayerOne().resolvePendingByCard(abbyParkIntenseFan, {
          destinations: [
            { zone: "hand", cards: [wrong] },
            { zone: "deck-bottom", cards: [] },
          ],
        }),
      ).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(top)).toBe("deck");
    }
    expect(
      game.asPlayerOne().resolvePendingByCard(abbyParkIntenseFan, {
        destinations: [
          { zone: "hand", cards: [top] },
          { zone: "deck-bottom", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(top)).toBe("hand");
  });
});

for (const topCard of [singerCard, song]) {
  for (const accept of [true, false]) {
    it(`player two ${accept ? "takes" : "bottoms"} the only deck card, ${topCard.name}`, () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 6, inkDrops: 3 },
        { hand: [abbyParkIntenseFan], inkwell: 4, deck: [topCard, filler], inkDrops: 4 },
      );
      const top = game.findCardInstanceId(topCard, "deck", PLAYER_TWO)!;
      const enemyDeck = game.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().playCard(abbyParkIntenseFan)).toBeSuccessfulCommand();
      expect(
        game.asPlayerTwo().resolvePendingByCard(abbyParkIntenseFan, {
          destinations: [
            { zone: "hand", cards: accept ? [top] : [] },
            { zone: "deck-bottom", cards: accept ? [] : [top] },
          ],
        }),
      ).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().getCardZone(top)).toBe(accept ? "hand" : "deck");
      expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(accept ? 2 : 1);
      expect(game.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(accept ? [] : [top]);
      expect(game.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(enemyDeck);
      expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
      expect(game.getInkDrops(PLAYER_TWO)).toBe(4);
      expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
      expect(
        publicMessages(game).filter((m) => m.key === "lorcana.effect.resolve.revealTopCard"),
      ).toHaveLength(1);
    });
  }
}
it("player two completes an empty-deck entry without a reveal or routing choice", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6 },
    { hand: [abbyParkIntenseFan], inkwell: 4, deck: [filler] },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(abbyParkIntenseFan)).toBeSuccessfulCommand();
  if (game.asPlayerTwo().getBagCount() > 0)
    expect(game.asPlayerTwo().resolvePendingByCard(abbyParkIntenseFan)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(filler)).toBe("hand");
  expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(1);
  expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(0);
  expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
  expect(
    publicMessages(game).filter((m) => m.key === "lorcana.effect.resolve.revealTopCard"),
  ).toHaveLength(0);
  expect(game.asServer().hasGameEnded()).toBe(false);
});
it("player two cannot route extra cards or duplicate the revealed card across destinations", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: [song, filler] },
    { hand: [abbyParkIntenseFan], inkwell: 4, deck: [singerCard, song, filler] },
  );
  const top = game.findCardInstanceId(song, "deck", PLAYER_TWO)!;
  const hidden = game.findCardInstanceId(singerCard, "deck", PLAYER_TWO)!;
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(abbyParkIntenseFan)).toBeSuccessfulCommand();
  for (const destinations of [
    [
      { zone: "hand", cards: [top, hidden] },
      { zone: "deck-bottom", cards: [] },
    ],
    [
      { zone: "hand", cards: [top] },
      { zone: "deck-bottom", cards: [top] },
    ],
  ]) {
    expect(
      game.asPlayerTwo().resolvePendingByCard(abbyParkIntenseFan, { destinations }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(top)).toBe("deck");
    expect(game.asPlayerTwo().getCardZone(hidden)).toBe("deck");
  }
  expect(
    game.asPlayerTwo().resolvePendingByCard(abbyParkIntenseFan, {
      destinations: [
        { zone: "hand", cards: [top] },
        { zone: "deck-bottom", cards: [] },
      ],
    }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(top)).toBe("hand");
  expect(game.asPlayerTwo().getCardZone(hidden)).toBe("deck");
  expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
});
