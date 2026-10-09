// CR 2.2.0: 6.1.8 (count once during resolution), 5.4.1.2 (resolving
// song stays in play), 6.1.13.4 (this turn), 8.15.1 (Ward),
// 1.8.1.2 (empty-deck loss at the end of the player's turn).
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockItem,
  createMockLocation,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { thoughIHaveToSayGoodbye } from "./131-though-i-have-to-say-goodbye";

const chosenCharacter = createMockCharacter({
  id: "goodbye-chosen",
  name: "Chosen Character",
  cost: 3,
  strength: 2,
  willpower: 4,
});

const songOne = createMockSong({
  id: "goodbye-song-one",
  name: "First Song",
  cost: 2,
  text: "Test song.",
});

const songTwo = createMockSong({
  id: "goodbye-song-two",
  name: "Second Song",
  cost: 3,
  text: "Test song.",
});

const fillerOne = createMockCharacter({
  id: "goodbye-filler-one",
  name: "Filler One",
  cost: 1,
});

const fillerTwo = createMockCharacter({
  id: "goodbye-filler-two",
  name: "Filler Two",
  cost: 1,
});

const fillerThree = createMockCharacter({
  id: "goodbye-filler-three",
  name: "Filler Three",
  cost: 1,
});

const fillerFour = createMockCharacter({
  id: "goodbye-filler-four",
  name: "Filler Four",
  cost: 1,
});

describe("Though I Have to Say Goodbye", () => {
  it("mills the top 3 cards of your deck and boosts the chosen character by the number of songs milled into your discard", () => {
    // Deck index 0 = bottom, last = top: the top 3 are songOne, fillerOne and songTwo.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [thoughIHaveToSayGoodbye],
      inkwell: thoughIHaveToSayGoodbye.cost,
      deck: [fillerTwo, songOne, fillerOne, songTwo],
      play: [chosenCharacter],
    });

    expect(
      testEngine.asPlayerOne().playCard(thoughIHaveToSayGoodbye, {
        targets: [chosenCharacter],
      }),
    ).toBeSuccessfulCommand();

    // Milled 3 cards (deck keeps 1); the played song adds the 4th discard card.
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(1);
    expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(4);

    // Two songs milled into the discard → +2 {S} this turn.
    expect(testEngine.asPlayerOne().getCardStrength(chosenCharacter)).toBe(
      chosenCharacter.strength + 2,
    );
  });

  it("does not boost the chosen character when no songs were milled", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [thoughIHaveToSayGoodbye],
      inkwell: thoughIHaveToSayGoodbye.cost,
      deck: [fillerOne, fillerTwo, fillerThree, fillerFour],
      play: [chosenCharacter],
    });

    expect(
      testEngine.asPlayerOne().playCard(thoughIHaveToSayGoodbye, {
        targets: [chosenCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(4);
    expect(testEngine.asPlayerOne().getCardStrength(chosenCharacter)).toBe(
      chosenCharacter.strength,
    );
  });

  it("boost lasts only this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [thoughIHaveToSayGoodbye],
      inkwell: thoughIHaveToSayGoodbye.cost,
      deck: [fillerTwo, songOne, fillerOne, songTwo],
      play: [chosenCharacter],
    });

    expect(
      testEngine.asPlayerOne().playCard(thoughIHaveToSayGoodbye, {
        targets: [chosenCharacter],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardStrength(chosenCharacter)).toBe(
      chosenCharacter.strength + 2,
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(chosenCharacter)).toBe(
      chosenCharacter.strength,
    );
  });

  it("costs 2 ink to play when no singer is available", () => {
    // No character in play, so the song cannot be sung for free and must be
    // paid for with ink from the inkwell.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [thoughIHaveToSayGoodbye],
      inkwell: thoughIHaveToSayGoodbye.cost - 1,
    });

    expect(testEngine.asPlayerOne().playCard(thoughIHaveToSayGoodbye).success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(thoughIHaveToSayGoodbye)).toBe("hand");
  });
});

const ward = createMockCharacter({
  id: "goodbye-ward",
  name: "Ward",
  cost: 2,
  strength: 1,
  abilities: [{ type: "keyword", keyword: "Ward" }],
});
const enemy = createMockCharacter({ id: "goodbye-enemy", name: "Enemy", cost: 3, strength: 3 });
const item = createMockItem({ id: "goodbye-item", name: "Item", cost: 1 });
const place = createMockLocation({ id: "goodbye-place", name: "Place", cost: 1 });
const plainAction = createMockAction({ id: "goodbye-action", name: "Action", cost: 0 });
const extraSong = createMockSong({
  id: "goodbye-extra-song",
  name: "Extra Song",
  cost: 0,
  text: "",
});
const song = thoughIHaveToSayGoodbye;

describe("Though I Have to Say Goodbye boundaries", () => {
  it("counts old and newly milled own songs but excludes opposing songs and other card types", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [song],
        play: [chosenCharacter],
        discard: [extraSong, songOne, plainAction, item],
        inkwell: 2,
        deck: [fillerFour, songTwo, fillerOne, songTwo],
      },
      { discard: [songOne, songOne, songOne] },
    );
    expect(g.asPlayerOne().playCard(song, { targets: [chosenCharacter] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(chosenCharacter)).toBe(6);
    expect(g.asPlayerOne().getCardZone(fillerFour)).toBe("deck");
    expect(g.asPlayerOne().getCardZone(fillerOne)).toBe("discard");
    expect(g.asPlayerOne().getZonesCardCount().discard).toBe(8);
    expect(g.asPlayerTwo().getZonesCardCount().discard).toBe(3);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });
  it("counts existing songs even if all three milled cards are non-songs", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [song],
      play: [chosenCharacter],
      discard: [songOne],
      inkwell: 2,
      deck: [fillerFour, fillerThree, fillerTwo, fillerOne],
    });
    expect(g.asPlayerOne().playCard(song, { targets: [chosenCharacter] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(chosenCharacter)).toBe(3);
    expect(g.asPlayerOne().getZonesCardCount().discard).toBe(5);
  });
  it("does not recalculate the bonus when another song later enters discard", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [song, extraSong],
      play: [chosenCharacter],
      discard: [songOne],
      inkwell: 2,
      deck: [fillerFour, fillerThree, fillerTwo, fillerOne],
    });
    expect(g.asPlayerOne().playCard(song, { targets: [chosenCharacter] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(chosenCharacter)).toBe(3);
    expect(g.asPlayerOne().playCard(extraSong)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(extraSong)).toBe("discard");
    expect(g.asPlayerOne().getCardStrength(chosenCharacter)).toBe(3);
  });
  it("can boost an opposing character while milling only its controller's deck", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [song], inkwell: 2, deck: [fillerFour, songTwo, fillerOne, songOne] },
      { play: [enemy], deck: [extraSong] },
    );
    expect(g.asPlayerOne().playCard(song, { targets: [enemy] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardStrength(enemy)).toBe(5);
    expect(g.asPlayerTwo().getZonesCardCount().deck).toBe(1);
    expect(g.asPlayerTwo().getZonesCardCount().discard).toBe(0);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardStrength(enemy)).toBe(3);
  });
  it("sings for free with a dry cost-three character and can boost that singer", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [song],
      play: [{ card: chosenCharacter, isDrying: false }],
      inkwell: 2,
      deck: [fillerFour, songTwo, fillerOne, songOne],
    });
    expect(g.asPlayerOne().singSong(song, chosenCharacter)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({ targets: [chosenCharacter] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(chosenCharacter)).toBe(4);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(g.asPlayerOne().quest(chosenCharacter).success).toBe(false);
  });
  for (const size of [0, 1, 2, 3])
    it(
      "mills only available cards from deck size " + size + " and loses only at own turn end",
      () => {
        const deckCards = [songOne, fillerOne, songTwo].slice(0, size);
        const g = LorcanaMultiplayerTestEngine.createWithFixture({
          hand: [song],
          play: [chosenCharacter],
          inkwell: 2,
          deck: deckCards,
        });
        expect(
          g.asPlayerOne().playCard(song, { targets: [chosenCharacter] }),
        ).toBeSuccessfulCommand();
        expect(g.asPlayerOne().getZonesCardCount().deck).toBe(0);
        expect(g.asPlayerOne().getZonesCardCount().discard).toBe(size + 1);
        expect(g.asPlayerOne().getCardStrength(chosenCharacter)).toBe(
          2 + (size === 0 ? 0 : size === 3 ? 2 : 1),
        );
        expect(g.asServer().getWinner()).toBeUndefined();
        expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
        expect(g.asServer().getWinner()).toBe(PLAYER_TWO);
        expect(g.asPlayerOne().getCardStrength(chosenCharacter)).toBe(2);
      },
    );
  for (const invalid of ["opposing-ward", "item", "location", "hand", "discard", "multiple"])
    it("rejects " + invalid + " before paid play, then permits own Ward", () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [song, chosenCharacter],
          play: [ward, item, place],
          discard: [enemy],
          inkwell: 2,
          deck: [fillerFour, songTwo, fillerOne, songOne],
        },
        { play: [ward] },
      );
      const target =
        invalid === "opposing-ward"
          ? g.findCardInstanceId(ward, "play", PLAYER_TWO)
          : invalid === "item"
            ? item
            : invalid === "location"
              ? place
              : invalid === "hand"
                ? chosenCharacter
                : invalid === "discard"
                  ? enemy
                  : ward;
      const targets = invalid === "multiple" ? [target, item] : [target];
      expect(g.asPlayerOne().playCard(song, { targets }).success).toBe(false);
      expect(g.asPlayerOne().getZonesCardCount().deck).toBe(4);
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
      const ownWard = g.findCardInstanceId(ward, "play", PLAYER_ONE);
      expect(g.asPlayerOne().playCard(song, { targets: [ownWard] })).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardStrength(ownWard)).toBe(3);
    });
  it("does not undo already completed mill after an illegal pending target choice", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [song],
        play: [chosenCharacter],
        inkwell: 2,
        deck: [fillerFour, songTwo, fillerOne, songOne],
      },
      { play: [ward] },
    );
    expect(g.asPlayerOne().playCard(song)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(1);
    expect(g.asPlayerOne().resolveNextPending({ targets: [ward] }).success).toBe(false);
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(1);
    expect(
      g.asPlayerOne().resolveNextPending({ targets: [chosenCharacter] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(chosenCharacter)).toBe(4);
  });
  it("still mills when no legal character can receive the bonus", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [song], inkwell: 2, deck: [fillerFour, songTwo, fillerOne, songOne] },
      { play: [ward] },
    );
    expect(g.asPlayerOne().playCard(song)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(1);
    expect(g.asPlayerOne().getZonesCardCount().discard).toBe(4);
    expect(g.asPlayerOne()).toHavePendingEffectCount(0);
    expect(g.asPlayerTwo().getCardStrength(ward)).toBe(1);
  });
  it("can pay two with one ink and an existing claimed drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [song],
      play: [ward],
      inkwell: 1,
      inkDrops: 1,
      deck: [fillerFour, songTwo, fillerOne, songOne],
    });
    expect(
      g.asPlayerOne().playCard(song, { targets: [ward], inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getCardStrength(ward)).toBe(3);
  });
  it("is inkable and neither mills nor grants a bonus when inked", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [song],
      play: [ward],
      deck: [fillerFour, songTwo, fillerOne, songOne],
    });
    expect(g.asPlayerOne().putIntoInkwell(PLAYER_ONE, song)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(song)).toBe("inkwell");
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(4);
    expect(g.asPlayerOne().getCardStrength(ward)).toBe(1);
  });
});

// CR 7.1.6: replay removes a previously gained Strength bonus from the same card.
it("player two mills exact own top cards, chooses either owner and loses the bonus on replay", () => {
  const bounce = createMockAction({
    id: "goodbye-bounce",
    name: "Bounce",
    cost: 0,
    abilities: [{ type: "action", effect: { type: "return-to-hand", target: "CHOSEN_CHARACTER" } }],
  });
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [enemy, ward, item, place], discard: [songOne, songOne, songOne], deck: 6 },
    {
      play: [chosenCharacter, item, place],
      hand: [song, song, bounce, extraSong, ward],
      discard: [songOne, plainAction, item, place],
      inkwell: 6,
      inkDrops: 2,
      deck: [
        fillerFour,
        fillerThree,
        fillerTwo,
        fillerOne,
        songTwo,
        fillerOne,
        songOne,
        fillerFour,
      ],
    },
  );
  const firstSong = g.findCardInstanceId(song, "hand", PLAYER_TWO);
  const ownWard = g.findCardInstanceId(ward, "hand", PLAYER_TWO);
  const opposingWard = g.findCardInstanceId(ward, "play", PLAYER_ONE);
  const opposing = g.findCardInstanceId(enemy, "play", PLAYER_ONE);
  const singerId = g.findCardInstanceId(chosenCharacter, "play", PLAYER_TWO);
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().playCard(ownWard)).toBeSuccessfulCommand();
  const deckBefore = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
  const discardBefore = g.getCardInstanceIdsInZone("discard", PLAYER_TWO);
  const opposingDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
  const opposingDiscard = g.getCardInstanceIdsInZone("discard", PLAYER_ONE);
  expect(g.asPlayerTwo().playCard(firstSong)).toBeSuccessfulCommand();
  expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(deckBefore.slice(0, -3));
  for (const id of deckBefore.slice(-3)) expect(g.asPlayerTwo().getCardZone(id)).toBe("discard");
  const [pending] = g.asPlayerTwo().getPendingEffects();
  if (pending?.selectionContext?.kind !== "target-selection")
    throw new Error("Expected Strength choice");
  expect(pending.selectionContext.cardCandidateIds.slice().sort()).toEqual(
    [ownWard, singerId, opposing].sort(),
  );
  expect(g.asPlayerOne().resolveNextPending({ targets: [opposing] })).not.toBeSuccessfulCommand();
  expect(
    g.asPlayerTwo().resolveNextPending({ targets: [opposingWard] }),
  ).not.toBeSuccessfulCommand();
  expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(deckBefore.slice(0, -3));
  expect(g.asPlayerTwo().resolveNextPending({ targets: [opposing] })).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getCardStrength(opposing)).toBe(6);
  expect(g.getCardInstanceIdsInZone("discard", PLAYER_TWO).slice().sort()).toEqual(
    [...discardBefore, ...deckBefore.slice(-3), firstSong].sort(),
  );
  const secondSong = g.findCardInstanceId(song, "hand", PLAYER_TWO);
  const beforeSecond = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
  expect(g.asPlayerTwo().singSong(secondSong, singerId)).toBeSuccessfulCommand();
  expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(beforeSecond.slice(0, -3));
  expect(g.asPlayerTwo().resolveNextPending({ targets: [ownWard] })).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().getCardStrength(ownWard)).toBe(5);
  expect(g.asPlayerTwo().isDrying(ownWard)).toBe(true);
  expect(g.asPlayerOne().getCardStrength(opposing)).toBe(6);
  expect(g.asPlayerTwo().playCard(bounce, { targets: [ownWard] })).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().getCardZone(ownWard)).toBe("hand");
  expect(g.asPlayerTwo().playCard(ownWard)).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().getCardStrength(ownWard)).toBe(1);
  expect(g.asPlayerTwo().playCard(extraSong)).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getCardStrength(opposing)).toBe(6);
  expect(g.asPlayerTwo().getCardStrength(ownWard)).toBe(1);
  expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(opposingDeck);
  expect(g.getCardInstanceIdsInZone("discard", PLAYER_ONE)).toEqual(opposingDiscard);
  expect(g.getInkDrops(PLAYER_TWO)).toBe(2);
  expect(g.asPlayerTwo()).toHavePendingEffectCount(0);
  expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getCardStrength(opposing)).toBe(3);
});

it("player two still mills the exact own top three with no legal character", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [ward, item, place], discard: [songOne, songTwo], deck: 6 },
    {
      play: [item, place],
      hand: [song, chosenCharacter],
      discard: [extraSong, enemy],
      inkwell: [fillerOne, fillerOne],
      deck: [fillerFour, songTwo, fillerOne, songOne, fillerFour],
      inkDrops: 2,
    },
  );
  const source = g.findCardInstanceId(song, "hand", PLAYER_TWO);
  const opposingWard = g.findCardInstanceId(ward, "play", PLAYER_ONE);
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const before = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
  const oldDiscard = g.getCardInstanceIdsInZone("discard", PLAYER_TWO);
  const otherDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
  const otherDiscard = g.getCardInstanceIdsInZone("discard", PLAYER_ONE);
  expect(g.asPlayerTwo().playCard(source)).toBeSuccessfulCommand();
  expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(before.slice(0, -3));
  expect(g.getCardInstanceIdsInZone("discard", PLAYER_TWO).slice().sort()).toEqual(
    [...oldDiscard, ...before.slice(-3), source].sort(),
  );
  expect(g.asPlayerTwo()).toHavePendingEffectCount(0);
  expect(g.asPlayerTwo().getBagCount()).toBe(0);
  expect(g.asPlayerOne().getCardStrength(opposingWard)).toBe(1);
  expect(g.asPlayerTwo().getCardZone(chosenCharacter)).toBe("hand");
  expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(otherDeck);
  expect(g.getCardInstanceIdsInZone("discard", PLAYER_ONE)).toEqual(otherDiscard);
  expect(g.getInkDrops(PLAYER_TWO)).toBe(2);
});

for (const size of [0, 1, 2])
  it(`player two mills ${size} available non-songs, gets zero bonus and loses only at own turn end`, () => {
    const available = [fillerOne, plainAction].slice(0, size);
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { discard: [songOne, songTwo, extraSong], deck: 6 },
      { play: [ward], hand: [song], deck: [...available, fillerFour], inkwell: 2 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const before = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
    expect(before).toHaveLength(size);
    expect(g.asPlayerTwo().playCard(song, { targets: [ward] })).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toHaveLength(0);
    for (const id of before) expect(g.asPlayerTwo().getCardZone(id)).toBe("discard");
    expect(g.asPlayerTwo().getZonesCardCount().discard).toBe(size + 1);
    expect(g.asPlayerTwo().getCardStrength(ward)).toBe(1);
    expect(g.asServer().getWinner()).toBeUndefined();
    expect(g.asPlayerTwo()).toHavePendingEffectCount(0);
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asServer().getWinner()).toBe(PLAYER_ONE);
  });
