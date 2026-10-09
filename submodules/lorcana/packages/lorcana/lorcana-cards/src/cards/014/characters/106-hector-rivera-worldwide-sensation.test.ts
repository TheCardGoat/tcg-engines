// CR 2.2.0: 1.2.3, 4.4, 5.4.4.2, 6.1.14.1, 6.2.1–6.2.6, 8.10, 8.12.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { hctorRiveraWorldwideSensation } from "./106-hector-rivera-worldwide-sensation";
import { hctorRiveraStreetMusician } from "./117-hector-rivera-street-musician";

const ready = createMockAction({
  id: "hector-ww-ready",
  name: "Ready Performer",
  cost: 0,
  abilities: [{ type: "action", effect: { type: "ready", target: "CHOSEN_CHARACTER" } }],
});
const base = createMockCharacter({ id: "hector-ww-base", name: "Héctor Rivera", cost: 1 });
const firstSong = createMockSong({
  id: "hector-ww-first-song",
  name: "First Song",
  cost: 2,
  text: "A song.",
});

const secondSong = createMockSong({
  id: "hector-ww-second-song",
  name: "Second Song",
  cost: 2,
  text: "Another song.",
});

const plainAction = createMockAction({
  id: "hector-ww-plain-action",
  name: "Plain Action",
  cost: 1,
});

const plainCharacter = createMockCharacter({
  id: "hector-ww-plain-character",
  name: "Plain Character",
  cost: 1,
});

const anotherCharacter = createMockCharacter({
  id: "hector-ww-another-character",
  name: "Another Character",
  cost: 1,
});

const deckFiller = createMockCharacter({
  id: "hector-ww-deck-filler",
  name: "Deck Filler",
  cost: 1,
});

describe("Héctor Rivera - Worldwide Sensation", () => {
  it("shifts onto another character named Héctor Rivera for 4 ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hctorRiveraStreetMusician, hctorRiveraWorldwideSensation],
      inkwell: 5,
      deck: 1,
    });

    expect(testEngine.asPlayerOne().playCard(hctorRiveraStreetMusician)).toBeSuccessfulCommand();
    // Resolve (decline) Street Musician's pending Strike a Chord before shifting.
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hctorRiveraStreetMusician),
    ).toBeSuccessfulCommand();

    const shiftTarget = testEngine.findCardInstanceId(
      hctorRiveraStreetMusician,
      "play",
      PLAYER_ONE,
    );

    expect(
      testEngine.asPlayerOne().playCard(hctorRiveraWorldwideSensation, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.getCardsUnder(hctorRiveraWorldwideSensation)).toHaveLength(1);
  });

  it("looks at the top 3 when questing after shifting onto Héctor Rivera", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: hctorRiveraStreetMusician, isDrying: false }],
      hand: [hctorRiveraWorldwideSensation],
      inkwell: 4,
      deck: [plainAction, firstSong, plainCharacter],
    });

    const shiftTarget = testEngine.findCardInstanceId(
      hctorRiveraStreetMusician,
      "play",
      PLAYER_ONE,
    );
    expect(
      testEngine.asPlayerOne().playCard(hctorRiveraWorldwideSensation, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(hctorRiveraWorldwideSensation)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hctorRiveraWorldwideSensation, {
        destinations: [
          { zone: "hand", cards: [firstSong] },
          { zone: "discard", cards: [plainCharacter, plainAction] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(firstSong)).toBe("hand");
  });

  it("on quest, may reveal a song from the top 3 into hand and puts the rest into discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: hctorRiveraWorldwideSensation, isDrying: false }],
      deck: [plainAction, firstSong, plainCharacter],
    });

    expect(testEngine.asPlayerOne().quest(hctorRiveraWorldwideSensation)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hctorRiveraWorldwideSensation, {
        destinations: [
          { zone: "hand", cards: [firstSong] },
          { zone: "discard", cards: [plainCharacter, plainAction] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(firstSong)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(testEngine.getCardDefinitionIdsInZone("discard", PLAYER_ONE)).toEqual([
      plainCharacter.id,
      plainAction.id,
    ]);
  });

  it("puts the whole top 3 into discard when no song is there", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: hctorRiveraWorldwideSensation, isDrying: false }],
      deck: [plainAction, plainCharacter, anotherCharacter],
    });

    expect(testEngine.asPlayerOne().quest(hctorRiveraWorldwideSensation)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hctorRiveraWorldwideSensation, {
        destinations: [
          { zone: "hand", cards: [] },
          { zone: "discard", cards: [anotherCharacter, plainCharacter, plainAction] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(0);
    expect(testEngine.getCardDefinitionIdsInZone("discard", PLAYER_ONE)).toEqual([
      anotherCharacter.id,
      plainCharacter.id,
      plainAction.id,
    ]);
  });

  it("looks at the top 3 the first time he sings a song each turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: hctorRiveraWorldwideSensation, isDrying: false }],
      hand: [firstSong],
      inkwell: 2,
      deck: [plainAction, secondSong, plainCharacter],
    });

    expect(
      testEngine.asPlayerOne().singSong(firstSong, hctorRiveraWorldwideSensation),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hctorRiveraWorldwideSensation, {
        destinations: [
          { zone: "hand", cards: [secondSong] },
          { zone: "discard", cards: [plainCharacter, plainAction] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(secondSong)).toBe("hand");
  });

  it("does not look again on the second sing even when cards remain in the deck", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [hctorRiveraWorldwideSensation],
      hand: [firstSong, secondSong, ready],
      deck: [firstSong, plainAction, plainCharacter, anotherCharacter],
    });
    expect(
      game.asPlayerOne().singSong(firstSong, hctorRiveraWorldwideSensation),
    ).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(hctorRiveraWorldwideSensation, {
        destinations: [
          { zone: "hand", cards: [] },
          { zone: "discard", cards: [anotherCharacter, plainCharacter, plainAction] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().playCard(ready, { targets: [hctorRiveraWorldwideSensation] }),
    ).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().singSong(secondSong, hctorRiveraWorldwideSensation),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne()).toHaveZoneCounts({ deck: 1, hand: 0, discard: 6 });
    expect(game.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([firstSong.id]);
  });

  it("looks again when he sings on a later turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: hctorRiveraWorldwideSensation, isDrying: false }],
        hand: [firstSong, secondSong],
        inkwell: 4,
        deck: [
          plainAction,
          plainCharacter,
          anotherCharacter,
          deckFiller,
          deckFiller,
          deckFiller,
          deckFiller,
        ],
      },
      { deck: 2 },
    );

    expect(
      testEngine.asPlayerOne().singSong(firstSong, hctorRiveraWorldwideSensation),
    ).toBeSuccessfulCommand();
    const lookedAt = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE).slice(-3);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(hctorRiveraWorldwideSensation, {
        destinations: [
          { zone: "hand", cards: [] },
          { zone: "discard", cards: lookedAt },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(4);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().singSong(secondSong, hctorRiveraWorldwideSensation),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
  });

  it("auto-resolves Big Hit as a silent no-op when the deck is empty (no prompt)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: hctorRiveraWorldwideSensation, isDrying: false }],
      deck: [],
    });

    expect(testEngine.asPlayerOne().quest(hctorRiveraWorldwideSensation)).toBeSuccessfulCommand();
    // Nothing to look at, so the scry drains without a player decision.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("keeps the Big Hit prompt pending while there are deck cards to look at", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: hctorRiveraWorldwideSensation, isDrying: false }],
      deck: [plainAction, plainCharacter, anotherCharacter],
    });

    expect(testEngine.asPlayerOne().quest(hctorRiveraWorldwideSensation)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
  });
});

it("may decline an eligible song; all three cards go to discard and the lower deck stays intact", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [hctorRiveraWorldwideSensation],
    deck: [deckFiller, firstSong, plainAction, secondSong],
  });
  expect(game.asPlayerOne().quest(hctorRiveraWorldwideSensation)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(2);
  expect(
    game.asPlayerOne().resolvePendingByCard(hctorRiveraWorldwideSensation, {
      destinations: [
        { zone: "hand", cards: [] },
        { zone: "discard", cards: [secondSong, plainAction, firstSong] },
      ],
    }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toHaveZoneCounts({ deck: 1, hand: 0, discard: 3 });
  expect(game.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([deckFiller.id]);
});
it("rejects non-songs, two songs and cards outside the top three, then accepts one valid song", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [hctorRiveraWorldwideSensation],
      deck: [deckFiller, firstSong, plainAction, secondSong],
    },
    { deck: [firstSong] },
  );
  expect(game.asPlayerOne().quest(hctorRiveraWorldwideSensation)).toBeSuccessfulCommand();
  const enemy = game.findCardInstanceId(firstSong, "deck", PLAYER_TWO);
  const ownFirst = game.findCardInstanceId(firstSong, "deck", PLAYER_ONE);
  const ownSecond = game.findCardInstanceId(secondSong, "deck", PLAYER_ONE);
  const ownAction = game.findCardInstanceId(plainAction, "deck", PLAYER_ONE);
  const outside = game.findCardInstanceId(deckFiller, "deck", PLAYER_ONE);
  const looked = [ownSecond, ownAction, ownFirst];
  for (const cards of [[ownAction], [ownFirst, ownSecond], [outside], [enemy]]) {
    expect(
      game.asPlayerOne().resolvePendingByCard(hctorRiveraWorldwideSensation, {
        destinations: [
          { zone: "hand", cards },
          { zone: "discard", cards: looked.filter((id) => !cards.includes(id)) },
        ],
      }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne()).toHaveZoneCounts({ deck: 4, hand: 0, discard: 0 });
    expect(game.asPlayerOne().getBagCount()).toBe(1);
  }
  expect(
    game.asPlayerOne().resolvePendingByCard(hctorRiveraWorldwideSensation, {
      destinations: [
        { zone: "hand", cards: [ownSecond] },
        { zone: "discard", cards: [ownAction, ownFirst] },
      ],
    }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toHaveZoneCounts({ deck: 1, hand: 1, discard: 2 });
  expect(game.getCardDefinitionIdsInZone("hand", PLAYER_ONE)).toEqual([secondSong.id]);
});
for (const shortDeck of [[firstSong], [plainAction, firstSong]]) {
  it("looks at all available cards in a short deck of " + shortDeck.length, () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [hctorRiveraWorldwideSensation],
      deck: shortDeck,
    });
    expect(game.asPlayerOne().quest(hctorRiveraWorldwideSensation)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(hctorRiveraWorldwideSensation, {
        destinations: [
          { zone: "hand", cards: [firstSong] },
          { zone: "discard", cards: shortDeck.filter((c) => c !== firstSong) },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne()).toHaveZoneCounts({
      deck: 0,
      hand: 1,
      discard: shortDeck.length - 1,
    });
  });
}
it("quest triggers are independent of singing and repeat after a legal ready effect", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [hctorRiveraWorldwideSensation],
    hand: [firstSong, ready, ready],
    deck: 9,
  });
  expect(
    game.asPlayerOne().singSong(firstSong, hctorRiveraWorldwideSensation),
  ).toBeSuccessfulCommand();
  const discardTop = () => {
    const ids = game.getCardInstanceIdsInZone("deck", PLAYER_ONE).slice(-3).reverse();
    expect(
      game.asPlayerOne().resolvePendingByCard(hctorRiveraWorldwideSensation, {
        destinations: [
          { zone: "hand", cards: [] },
          { zone: "discard", cards: ids },
        ],
      }),
    ).toBeSuccessfulCommand();
  };
  discardTop();
  for (let n = 0; n < 2; n++) {
    const readyId = game.findCardInstanceId(ready, "hand", PLAYER_ONE);
    expect(
      game.asPlayerOne().playCard(readyId, { targets: [hctorRiveraWorldwideSensation] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(hctorRiveraWorldwideSensation)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getBagCount()).toBe(1);
    discardTop();
  }
  expect(game.getLore(PLAYER_ONE)).toBe(4);
  expect(game.asPlayerOne()).toHaveZoneCounts({ deck: 0, discard: 12 });
});
it("another character singing and paying ink for songs do not trigger Big Hit", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [
      hctorRiveraWorldwideSensation,
      createMockCharacter({ id: "other-singer", name: "Other Singer", cost: 3 }),
    ],
    hand: [firstSong, secondSong],
    inkwell: 2,
    deck: 4,
  });
  const other = game.getCardInstanceIdsInZone("play", PLAYER_ONE)[1];
  expect(game.asPlayerOne().singSong(firstSong, other)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(secondSong)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getBagCount()).toBe(0);
  expect(game.asPlayerOne()).toHaveZoneCounts({ deck: 4, discard: 2 });
});
it("each copy can sing once independently in the same turn", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [hctorRiveraWorldwideSensation, hctorRiveraWorldwideSensation],
    hand: [firstSong, secondSong],
    deck: 6,
  });
  const copies = game.getCardInstanceIdsInZone("play", PLAYER_ONE);
  for (const [i, song] of [firstSong, secondSong].entries()) {
    expect(game.asPlayerOne().singSong(song, copies[i])).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getBagCount()).toBe(1);
    const ids = game.getCardInstanceIdsInZone("deck", PLAYER_ONE).slice(-3).reverse();
    expect(
      game.asPlayerOne().resolvePendingByCard(copies[i], {
        destinations: [
          { zone: "hand", cards: [] },
          { zone: "discard", cards: ids },
        ],
      }),
    ).toBeSuccessfulCommand();
  }
  expect(game.asPlayerOne()).toHaveZoneCounts({ deck: 0, discard: 8 });
});
it("Shift pays exactly four and inherits exertion and damage without a Big Hit trigger", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [{ card: base, exerted: true, damage: 2, isDrying: false }],
    hand: [hctorRiveraWorldwideSensation],
    inkwell: 4,
    deck: 4,
  });
  const shiftTarget = game.findCardInstanceId(base, "play", PLAYER_ONE);
  expect(
    game
      .asPlayerOne()
      .playCard(hctorRiveraWorldwideSensation, { cost: { cost: "shift", shiftTarget } }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne()).toHaveDamage({ card: hctorRiveraWorldwideSensation, value: 2 });
  expect(game.asPlayerOne().quest(hctorRiveraWorldwideSensation)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getBagCount()).toBe(0);
  expect(game.getCardsUnder(hctorRiveraWorldwideSensation)).toHaveLength(1);
});
it("rejects wrong-name and opposing Shift bases before a valid dry-base retry", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [base, plainCharacter], hand: [hctorRiveraWorldwideSensation], inkwell: 4, deck: [] },
    { play: [base] },
  );
  for (const shiftTarget of [
    game.findCardInstanceId(plainCharacter, "play", PLAYER_ONE),
    game.findCardInstanceId(base, "play", PLAYER_TWO),
  ]) {
    expect(
      game
        .asPlayerOne()
        .playCard(hctorRiveraWorldwideSensation, { cost: { cost: "shift", shiftTarget } }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(4);
  }
  const shiftTarget = game.findCardInstanceId(base, "play", PLAYER_ONE);
  expect(
    game
      .asPlayerOne()
      .playCard(hctorRiveraWorldwideSensation, { cost: { cost: "shift", shiftTarget } }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(hctorRiveraWorldwideSensation)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(2);
});
it("Shift onto a newly played base stays drying and cannot quest or sing", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [base, hctorRiveraWorldwideSensation, firstSong],
    inkwell: 5,
    deck: 4,
  });
  expect(game.asPlayerOne().playCard(base)).toBeSuccessfulCommand();
  const shiftTarget = game.findCardInstanceId(base, "play", PLAYER_ONE);
  expect(
    game
      .asPlayerOne()
      .playCard(hctorRiveraWorldwideSensation, { cost: { cost: "shift", shiftTarget } }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(hctorRiveraWorldwideSensation)).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().singSong(firstSong, hctorRiveraWorldwideSensation),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getBagCount()).toBe(0);
});
it("rejects insufficient normal and Shift payment without spending ink", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [base],
    hand: [hctorRiveraWorldwideSensation],
    inkwell: 3,
    deck: 4,
  });
  expect(game.asPlayerOne().playCard(hctorRiveraWorldwideSensation)).not.toBeSuccessfulCommand();
  const shiftTarget = game.findCardInstanceId(base, "play", PLAYER_ONE);
  expect(
    game
      .asPlayerOne()
      .playCard(hctorRiveraWorldwideSensation, { cost: { cost: "shift", shiftTarget } }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
  expect(game.asPlayerOne().getCardZone(hctorRiveraWorldwideSensation)).toBe("hand");
});
it("normal play pays six, does not look at the deck, and remains drying", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [hctorRiveraWorldwideSensation, firstSong],
    inkwell: 6,
    deck: 4,
  });
  expect(game.asPlayerOne().playCard(hctorRiveraWorldwideSensation)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().getBagCount()).toBe(0);
  expect(game.asPlayerOne().quest(hctorRiveraWorldwideSensation)).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().singSong(firstSong, hctorRiveraWorldwideSensation),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toHaveZoneCounts({ deck: 4, hand: 1, play: 1 });
});

it("player two routes only their own top three and rejects the opponent as chooser", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: [deckFiller, firstSong, plainAction], lore: 4 },
    {
      play: [hctorRiveraWorldwideSensation],
      deck: [deckFiller, firstSong, plainAction, plainCharacter, anotherCharacter],
      lore: 7,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const enemyDeck = game.getCardInstanceIdsInZone("deck", PLAYER_ONE);
  const chosen = game.findCardInstanceId(firstSong, "deck", PLAYER_TWO);
  const action = game.findCardInstanceId(plainAction, "deck", PLAYER_TWO);
  const character = game.findCardInstanceId(plainCharacter, "deck", PLAYER_TWO);
  const bottom = game.findCardInstanceId(deckFiller, "deck", PLAYER_TWO);
  expect(game.asPlayerTwo().quest(hctorRiveraWorldwideSensation)).toBeSuccessfulCommand();
  const destinations = [
    { zone: "hand", cards: [chosen] },
    { zone: "discard", cards: [character, action] },
  ];
  expect(
    game.asPlayerOne().resolvePendingByCard(hctorRiveraWorldwideSensation, { destinations }),
  ).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().resolvePendingByCard(hctorRiveraWorldwideSensation, { destinations }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(chosen)).toBe("hand");
  expect(game.getCardInstanceIdsInZone("discard", PLAYER_TWO)).toEqual([character, action]);
  expect(game.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual([bottom]);
  expect(game.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(enemyDeck);
  expect(game.getLore(PLAYER_TWO)).toBe(9);
  expect(game.getLore(PLAYER_ONE)).toBe(4);
});

it("Player Two singing together consumes each copy's first sing independently and resets next turn", () => {
  const together = createMockSong({
    id: "hector-ww-together",
    name: "Duet",
    cost: 8,
    text: "Sing Together 8",
    abilities: [{ type: "keyword", keyword: "SingTogether", value: 8 }],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6, lore: 5 },
    {
      play: [hctorRiveraWorldwideSensation, hctorRiveraWorldwideSensation],
      hand: [together, firstSong, secondSong, ready, ready, firstSong],
      deck: 14,
      inkDrops: 3,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const copies = game.getCardInstanceIdsInZone("play", PLAYER_TWO);
  const enemyDeck = game.getCardInstanceIdsInZone("deck", PLAYER_ONE);
  expect(game.asPlayerTwo().playSongTogether(together, copies)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getBagCount()).toBe(2);
  const discardTop = (copy: string) => {
    const cards = game.getCardInstanceIdsInZone("deck", PLAYER_TWO).slice(-3).reverse();
    expect(
      game.asPlayerTwo().resolvePendingByCard(copy, {
        destinations: [
          { zone: "hand", cards: [] },
          { zone: "discard", cards },
        ],
      }),
    ).toBeSuccessfulCommand();
  };
  for (const copy of copies) discardTop(copy);
  expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(7);
  for (const [index, copy] of copies.entries()) {
    expect(game.asPlayerTwo().playCard(ready, { targets: [copy] })).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().singSong(index === 0 ? firstSong : secondSong, copy),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(7);
  }
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().singSong(firstSong, copies[0])).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getBagCount()).toBe(1);
  discardTop(copies[0]);
  // A different copy's quest is independent of the singing limit.
  expect(game.asPlayerTwo().quest(copies[1])).toBeSuccessfulCommand();
  discardTop(copies[1]);
  expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(0);
  expect(game.getLore(PLAYER_TWO)).toBe(2);
  expect(game.getLore(PLAYER_ONE)).toBe(5);
  expect(game.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(enemyDeck.slice(0, -1));
  expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
});

it("Player Two's drop-funded Shift keeps drying, then repeats quests through a short and empty deck", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [base], deck: 6, inkDrops: 4, lore: 5 },
    {
      hand: [base, hctorRiveraWorldwideSensation, firstSong, ready],
      inkwell: 4,
      inkDrops: 1,
      deck: [plainAction, secondSong, deckFiller, anotherCharacter],
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const ownBase = game.findCardInstanceId(base, "hand", PLAYER_TWO);
  expect(game.asPlayerTwo().playCard(ownBase)).toBeSuccessfulCommand();
  const shiftTarget = game.findCardInstanceId(base, "play", PLAYER_TWO);
  expect(
    game.asPlayerTwo().playCard(hctorRiveraWorldwideSensation, {
      cost: { cost: "shift", shiftTarget },
    }),
  ).not.toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
  expect(
    game.asPlayerTwo().playCard(hctorRiveraWorldwideSensation, {
      cost: { cost: "shift", shiftTarget },
      inkDrops: 1,
    }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
  expect(game.asPlayerTwo().quest(hctorRiveraWorldwideSensation)).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().singSong(firstSong, hctorRiveraWorldwideSensation),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(hctorRiveraWorldwideSensation)).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().resolvePendingByCard(hctorRiveraWorldwideSensation, {
      destinations: [
        { zone: "hand", cards: [secondSong] },
        { zone: "discard", cards: [plainAction] },
      ],
    }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(0);
  expect(game.asPlayerTwo().getCardZone(secondSong)).toBe("hand");
  expect(
    game.asPlayerTwo().playCard(ready, { targets: [hctorRiveraWorldwideSensation] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(hctorRiveraWorldwideSensation)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
  expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  expect(game.getLore(PLAYER_TWO)).toBe(4);
  expect(game.getLore(PLAYER_ONE)).toBe(5);
});
