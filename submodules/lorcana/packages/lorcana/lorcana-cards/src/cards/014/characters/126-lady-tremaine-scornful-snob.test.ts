// Official CR 2.2.0 6.1.1 and 6.1.13.2: decline or fully prevented damage does not consume once.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { hctorRiveraStreetMusician as hector } from "./117-hector-rivera-street-musician";
import { miguelRiveraStreetMusician as miguel } from "./021-miguel-rivera-street-musician";
import { resist } from "../../../helpers/abilities/resist";
import { shift } from "../../../helpers/abilities/shift";
import { singer } from "../../../helpers/abilities/singer";
import { ladyTremaineScornfulSnob } from "./126-lady-tremaine-scornful-snob";

const firstSong = createMockSong({
  id: "tremaine-first-song",
  name: "First Song",
  cost: 1,
  text: "A song.",
});

const secondSong = createMockSong({
  id: "tremaine-second-song",
  name: "Second Song",
  cost: 1,
  text: "Another song.",
});

const opponentSinger = createMockCharacter({
  id: "tremaine-opponent-singer",
  name: "Opponent Singer",
  cost: 2,
  abilities: [singer(2)],
});

const opponentPlain = createMockCharacter({
  id: "tremaine-opponent-plain",
  name: "Opponent Plain",
  cost: 2,
});

describe("Lady Tremaine - Scornful Snob", () => {
  // CR 6.1.5.1, 6.2.3: each copy resolves its own once allowance; lethal damage still pays it.
  it("player two fresh and lethal copies draw exact cards independently of a declined copy", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [ladyTremaineScornfulSnob], deck: 6 },
      {
        play: [
          { card: ladyTremaineScornfulSnob, damage: 2 },
          ladyTremaineScornfulSnob,
          opponentSinger,
          opponentPlain,
        ],
        hand: [ladyTremaineScornfulSnob, firstSong, secondSong],
        inkwell: 3,
        deck: 6,
      },
    );
    const [lethal, declined] = g.getCardInstanceIdsInZone("play", PLAYER_TWO);
    const fresh = g.findCardInstanceId(ladyTremaineScornfulSnob, "hand", PLAYER_TWO);
    const opposing = g.findCardInstanceId(ladyTremaineScornfulSnob, "play", PLAYER_ONE);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(fresh)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(fresh)).toBe(0);
    expect(g.asPlayerTwo().isDrying(fresh)).toBe(true);
    const deckBefore = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
    expect(g.asPlayerTwo().singSong(firstSong, opponentSinger)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getBagCount()).toBe(3);
    expect(
      g.asPlayerOne().resolvePendingByCard(fresh, { resolveOptional: true }),
    ).not.toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(deckBefore);
    expect(
      g.asPlayerTwo().resolvePendingByCard(lethal!, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(lethal!)).toBe("discard");
    expect(
      g.asPlayerTwo().resolvePendingByCard(declined!, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolvePendingByCard(fresh, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(declined!)).toBe(0);
    expect(g.asPlayerTwo().getDamage(fresh)).toBe(1);
    expect(g.asPlayerOne().getDamage(opposing)).toBe(0);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(deckBefore.slice(0, -2));
    const hand = g.getCardInstanceIdsInZone("hand", PLAYER_TWO);
    expect(hand).toContain(deckBefore.at(-1)!);
    expect(hand).toContain(deckBefore.at(-2)!);
    expect(g.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(g.asPlayerTwo().singSong(secondSong, opponentPlain)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getBagCount()).toBe(1);
    expect(
      g.asPlayerTwo().resolvePendingByCard(declined!, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(deckBefore.slice(0, -3));
    expect(g.asPlayerTwo().getDamage(declined!)).toBe(1);
    expect(g.asPlayerTwo().getDamage(fresh)).toBe(1);
  });
  it("a nonsong and failed song payment leave the next successful song eligible", () => {
    const action = createMockAction({ id: "tremaine-nonsong", name: "Nonsong", cost: 0 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ladyTremaineScornfulSnob, { card: opponentSinger, isDrying: false }],
      hand: [action, firstSong],
      inkwell: 0,
      deck: 6,
    });
    const originalDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(
      g.asPlayerOne().playCard(firstSong, { cost: { cost: "standard" } }),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(firstSong)).toBe("hand");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(originalDeck);
    expect(g.asPlayerOne().getDamage(ladyTremaineScornfulSnob)).toBe(0);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne().singSong(firstSong, opponentSinger)).toBeSuccessfulCommand();
    expect(g.isExerted(opponentSinger)).toBe(true);
    expect(g.asPlayerOne().getBagCount()).toBe(1);
    expect(
      g.asPlayerOne().resolvePendingByCard(ladyTremaineScornfulSnob, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(ladyTremaineScornfulSnob)).toBe(1);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toEqual([originalDeck[5]!]);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(originalDeck.slice(0, 5));
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("cannot be inked and rejected inking leaves her in hand", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [ladyTremaineScornfulSnob], inkwell: 3, deck: 6 },
      { deck: 6 },
    );
    expect(g.asPlayerOne().ink(ladyTremaineScornfulSnob)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(ladyTremaineScornfulSnob)).toBe("hand");
    expect(g.asPlayerOne().getZonesCardCount().inkwell).toBe(3);
    expect(g.asPlayerOne().playCard(ladyTremaineScornfulSnob)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(ladyTremaineScornfulSnob)).toBe(0);
  });
  it("rejects an unaffordable play without enabling entry damage", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [ladyTremaineScornfulSnob], inkwell: 2, deck: 6 },
      { hand: [opponentSinger], inkwell: 2, deck: 6 },
    );
    expect(g.asPlayerOne().playCard(ladyTremaineScornfulSnob)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(ladyTremaineScornfulSnob)).toBe("hand");
    expect(g.asPlayerOne().getZonesCardCount().play).toBe(0);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(opponentSinger)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(opponentSinger)).toBe(0);
  });
  it("normal play dries before questing for two lore and then cannot quest again", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [ladyTremaineScornfulSnob], inkwell: 3, deck: 6 },
      { deck: 6 },
    );
    expect(g.asPlayerOne().playCard(ladyTremaineScornfulSnob)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(ladyTremaineScornfulSnob)).toBe(0);
    expect(g.asPlayerOne().quest(ladyTremaineScornfulSnob)).not.toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(ladyTremaineScornfulSnob)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(2);
    expect(g.asPlayerOne().quest(ladyTremaineScornfulSnob)).not.toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(2);
  });
  it("playing a song: may deal 1 damage to herself to draw a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ladyTremaineScornfulSnob],
      hand: [firstSong],
      inkwell: 1,
    });

    expect(testEngine.asPlayerOne().playCard(firstSong)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: true }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({
      card: ladyTremaineScornfulSnob,
      value: 1,
    });
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });

  it("declining deals no damage and draws no card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ladyTremaineScornfulSnob],
      hand: [firstSong],
      inkwell: 1,
    });

    expect(testEngine.asPlayerOne().playCard(firstSong)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(ladyTremaineScornfulSnob, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({
      card: ladyTremaineScornfulSnob,
      value: 0,
    });
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
  });

  it("only triggers once per turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ladyTremaineScornfulSnob],
      hand: [firstSong, secondSong],
      inkwell: 2,
    });

    expect(testEngine.asPlayerOne().playCard(firstSong)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(ladyTremaineScornfulSnob, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().playCard(secondSong)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });

  it("declining preserves this turn's allowance, and a completed use refreshes on the next own turn", () => {
    const third = createMockSong({
      id: "tremaine-third",
      name: "Third",
      text: "Test song.",
      cost: 1,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [ladyTremaineScornfulSnob],
        hand: [firstSong, secondSong, third],
        inkwell: 3,
        deck: 6,
      },
      { deck: 6 },
    );
    expect(g.asPlayerOne().playCard(firstSong)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(ladyTremaineScornfulSnob, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(secondSong)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(1);
    expect(
      g.asPlayerOne().resolvePendingByCard(ladyTremaineScornfulSnob, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(ladyTremaineScornfulSnob)).toBe(1);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    const before = g.asPlayerOne().getZonesCardCount().hand;
    expect(g.asPlayerOne().playCard(third)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(ladyTremaineScornfulSnob, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(ladyTremaineScornfulSnob)).toBe(2);
    expect(g.asPlayerOne().getZonesCardCount().hand).toBe(before);
  });
  it("own Singer enters undamaged and existing opposing Singer is not retroactively damaged", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [ladyTremaineScornfulSnob], hand: [opponentSinger], inkwell: 2 },
      { play: [opponentSinger] },
    );
    const own = g.findCardInstanceId(opponentSinger, "hand", PLAYER_ONE);
    const enemy = g.findCardInstanceId(opponentSinger, "play", PLAYER_TWO);
    expect(g.asPlayerOne().playCard(own)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(own)).toBe(0);
    expect(g.asPlayerTwo().getDamage(enemy)).toBe(0);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });
  it("two copies choose independently and the declined copy can resolve on the second song", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ladyTremaineScornfulSnob, ladyTremaineScornfulSnob],
      hand: [firstSong, secondSong],
      inkwell: 2,
      deck: 6,
    });
    const [first, second] = g.getCardInstanceIdsInZone("play", PLAYER_ONE);
    expect(g.asPlayerOne().playCard(firstSong)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(2);
    expect(
      g.asPlayerOne().resolvePendingByCard(first!, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(second!, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(first!)).toBe(1);
    expect(g.asPlayerOne().getDamage(second!)).toBe(0);
    expect(g.asPlayerOne().getZonesCardCount().hand).toBe(2);
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(5);
    expect(g.asPlayerOne().playCard(secondSong)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(1);
    expect(
      g.asPlayerOne().resolvePendingByCard(second!, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(first!)).toBe(1);
    expect(g.asPlayerOne().getDamage(second!)).toBe(1);
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(4);
  });
  it("opposing songs and ordinary characters do not consume the next own song allowance", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [ladyTremaineScornfulSnob], hand: [firstSong, opponentPlain], inkwell: 3, deck: 6 },
      { hand: [secondSong], inkwell: 1, deck: 6 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(secondSong)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getBagCount()).toBe(0);
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(opponentPlain)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne().playCard(firstSong)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(1);
    expect(
      g.asPlayerOne().resolvePendingByCard(ladyTremaineScornfulSnob, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(ladyTremaineScornfulSnob)).toBe(1);
  });
  it("player two singing triggers only their Tremaine and only their controller can accept", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [ladyTremaineScornfulSnob], deck: 6, inkwell: 2 },
      { play: [ladyTremaineScornfulSnob, opponentSinger], hand: [firstSong], deck: 6, inkwell: 2 },
    );
    const own = g.getCardInstanceIdsInZone("play", PLAYER_TWO)[0]!;
    const singerId = g.getCardInstanceIdsInZone("play", PLAYER_TWO)[1]!;
    const enemy = g.getCardInstanceIdsInZone("play", PLAYER_ONE)[0]!;
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const availableInk = g.asPlayerTwo().getAvailableInk(PLAYER_TWO);
    expect(g.asPlayerTwo().singSong(firstSong, singerId)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getBagCount()).toBe(1);
    expect(
      g.asPlayerOne().resolvePendingByCard(own, { resolveOptional: true }),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolvePendingByCard(own, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(own)).toBe(1);
    expect(g.asPlayerOne().getDamage(enemy)).toBe(0);
    expect(g.asPlayerTwo().getZonesCardCount().hand).toBe(2);
    expect(g.asPlayerTwo().getZonesCardCount().deck).toBe(4);
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(6);
    expect(g.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(availableInk);
  });
  // CR 6.1.5.1 and 8.8.2: no dealt damage cannot satisfy the conditional draw.
  it("fully resisted self-damage draws no card", () => {
    const grant = createMockAction({
      id: "tremaine-grant-resist",
      name: "Grant Resist",
      cost: 0,
      abilities: [
        {
          type: "action",
          effect: {
            type: "gain-keyword",
            keyword: "Resist",
            value: 1,
            target: "CHOSEN_CHARACTER",
            duration: "this-turn",
          },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ladyTremaineScornfulSnob],
      hand: [grant, firstSong, secondSong],
      inkwell: 2,
      deck: 6,
    });
    expect(
      g.asPlayerOne().playCard(grant, { targets: [ladyTremaineScornfulSnob] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(firstSong)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(ladyTremaineScornfulSnob, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(ladyTremaineScornfulSnob)).toBe(0);
    expect(g.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(6);
    expect(g.asPlayerOne().playCard(secondSong)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(1);
    expect(
      g.asPlayerOne().resolvePendingByCard(ladyTremaineScornfulSnob, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(ladyTremaineScornfulSnob)).toBe(0);
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(6);
  });
  it("a song removing Tremaine before her trigger resolves cannot damage her in discard or draw", () => {
    const removalSong = createMockSong({
      id: "tremaine-removal-song",
      name: "Removal Song",
      text: "Banish chosen character.",
      cost: 1,
      abilities: [{ type: "action", effect: { type: "banish", target: "CHOSEN_CHARACTER" } }],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ladyTremaineScornfulSnob],
      hand: [removalSong],
      inkwell: 1,
      deck: 6,
    });
    expect(
      g.asPlayerOne().playCard(removalSong, { targets: [ladyTremaineScornfulSnob] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(ladyTremaineScornfulSnob)).toBe("discard");
    expect(g.asPlayerOne().getBagCount()).toBe(1);
    expect(
      g.asPlayerOne().resolvePendingByCard(ladyTremaineScornfulSnob, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(ladyTremaineScornfulSnob)).toBe(0);
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(6);
    expect(g.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });
  it("accepting with an empty deck deals damage and loses at turn end", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [ladyTremaineScornfulSnob], hand: [firstSong], inkwell: 1, deck: [] },
      { deck: 6 },
    );
    expect(g.asPlayerOne().playCard(firstSong)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(ladyTremaineScornfulSnob, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(ladyTremaineScornfulSnob)).toBe(1);
    expect(g.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(g.asPlayerOne().hasGameEnded()).toBe(false);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asServer().getWinner()).toBe(PLAYER_TWO);
  });
  it("accepting lethal self-damage banishes Tremaine and still draws one card", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: ladyTremaineScornfulSnob, damage: 2 }],
      hand: [firstSong],
      inkwell: 1,
      deck: 6,
    });
    expect(g.asPlayerOne().playCard(firstSong)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(ladyTremaineScornfulSnob, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(ladyTremaineScornfulSnob)).toBe("discard");
    expect(g.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(5);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });
  it("two opposing copies each add entry damage to a Singer but not a plain character", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [ladyTremaineScornfulSnob, ladyTremaineScornfulSnob], deck: 6 },
      { hand: [opponentSinger, opponentPlain], inkwell: 4, deck: 6 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(opponentSinger)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(opponentSinger)).toBe(2);
    expect(g.asPlayerTwo().playCard(opponentPlain)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(opponentPlain)).toBe(0);
    expect(g.asPlayerTwo().getBagCount()).toBe(0);
  });
  it("opposing Singer Shift adds entry damage to inherited damage and keeps the base underneath", () => {
    const shifted = createMockCharacter({
      id: "tremaine-shifted-singer",
      name: "Opponent Singer",
      cost: 4,
      willpower: 6,
      abilities: [singer(4), shift(1)],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [ladyTremaineScornfulSnob], deck: 6 },
      { play: [{ card: opponentSinger, damage: 1 }], hand: [shifted], inkwell: 1, deck: 6 },
    );
    const base = g.getCardInstanceIdsInZone("play", PLAYER_TWO)[0]!;
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().playCard(shifted, { cost: { cost: "shift", shiftTarget: base } }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(shifted)).toBe(2);
    expect(g.asPlayerTwo().getCardZone(shifted)).toBe("play");
    const top = g.getCardInstanceIdsInZone("play", PLAYER_TWO)[0]!;
    expect(g.getCardsUnder(top)).toContain(base);
    expect(g.asPlayerOne().getDamage(ladyTremaineScornfulSnob)).toBe(0);
  });
  it.each(["hand", "discard"] as const)(
    "opposing Singer played free from %s receives entry damage",
    (from: "hand" | "discard") => {
      const freePlay = createMockAction({
        id: "tremaine-free-play-" + from,
        name: "Free Singer",
        cost: 0,
        abilities: [
          {
            type: "action",
            effect: { type: "play-card", from, cardType: "character", cost: "free" },
          },
        ],
      });
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [ladyTremaineScornfulSnob], deck: 6 },
        {
          hand: from === "hand" ? [freePlay, opponentSinger] : [freePlay],
          discard: from === "discard" ? [opponentSinger] : [],
          deck: 6,
          inkwell: 0,
        },
      );
      expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        g.asPlayerTwo().playCard(freePlay, { targets: [opponentSinger] }),
      ).toBeSuccessfulCommand();
      if (g.asPlayerTwo().getPendingEffects().length > 0) {
        expect(
          g.asPlayerTwo().resolvePendingByCard(freePlay, { targets: [opponentSinger] }),
        ).toBeSuccessfulCommand();
      }
      expect(g.asPlayerTwo().getCardZone(opponentSinger)).toBe("play");
      expect(g.asPlayerTwo().getDamage(opponentSinger)).toBe(1);
      expect(g.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
      expect(g.asPlayerOne().getDamage(ladyTremaineScornfulSnob)).toBe(0);
    },
  );
  it("removing Tremaine ends her entry aura without removing existing Singer damage", () => {
    const remove = createMockAction({
      id: "tremaine-remove-source",
      name: "Remove Source",
      cost: 0,
      abilities: [{ type: "action", effect: { type: "banish", target: "CHOSEN_CHARACTER" } }],
    });
    const secondSinger = createMockCharacter({
      id: "tremaine-second-singer",
      name: "Second Singer",
      cost: 2,
      abilities: [singer(2)],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [ladyTremaineScornfulSnob], deck: 6 },
      { hand: [opponentSinger, remove, secondSinger], inkwell: 4, deck: 6 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(opponentSinger)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(opponentSinger)).toBe(1);
    expect(
      g.asPlayerTwo().playCard(remove, { targets: [ladyTremaineScornfulSnob] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(ladyTremaineScornfulSnob)).toBe("discard");
    expect(g.asPlayerTwo().playCard(secondSinger)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(secondSinger)).toBe(0);
    expect(g.asPlayerTwo().getDamage(opponentSinger)).toBe(1);
    expect(g.asPlayerTwo().getBagCount()).toBe(0);
  });
  // CR 8.8.1-8.8.3: Resist reduces dealt damage, not counters placed at entry.
  it("Resist does not reduce damage an opposing Singer enters with", () => {
    const resistant = createMockCharacter({
      id: "tremaine-resistant-singer",
      name: "Resistant Singer",
      cost: 2,
      abilities: [singer(2), resist(1)],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [ladyTremaineScornfulSnob], deck: 6 },
      { hand: [resistant], inkwell: 2, deck: 6 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(resistant)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(resistant)).toBe(1);
    expect(g.asPlayerTwo().getCardZone(resistant)).toBe("play");
  });
  it.each(["hand", "discard"] as const)(
    "lethal Singer entry from %s by a free-play effect banishes it",
    (from: "hand" | "discard") => {
      const fragile = createMockCharacter({
        id: "tremaine-free-fragile-" + from,
        name: "Fragile Free Singer",
        cost: 1,
        willpower: 1,
        abilities: [singer(1)],
      });
      const freePlay = createMockAction({
        id: "tremaine-free-lethal-" + from,
        name: "Free Entry",
        cost: 0,
        abilities: [
          {
            type: "action",
            effect: { type: "play-card", from, cardType: "character", cost: "free" },
          },
        ],
      });
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [ladyTremaineScornfulSnob], deck: 6 },
        {
          hand: from === "hand" ? [freePlay, fragile] : [freePlay],
          discard: from === "discard" ? [fragile] : [],
          deck: 6,
        },
      );
      expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(g.asPlayerTwo().playCard(freePlay, { targets: [fragile] })).toBeSuccessfulCommand();
      expect(g.asPlayerTwo().getCardZone(fragile)).toBe("discard");
      expect(g.asPlayerTwo().getZonesCardCount().play).toBe(0);
      expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    },
  );
  it.each(["hand", "discard"] as const)(
    "free-play Hector from %s retains his entry trigger after lethal banishment",
    (from: "hand" | "discard") => {
      const freePlay = createMockAction({
        id: "tremaine-hector-free-" + from,
        name: "Free Hector",
        cost: 0,
        abilities: [
          {
            type: "action",
            effect: { type: "play-card", from, cardType: "character", cost: "free" },
          },
        ],
      });
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: from === "hand" ? [freePlay, hector] : [freePlay],
          discard: from === "discard" ? [hector] : [],
          deck: 6,
        },
        { play: [ladyTremaineScornfulSnob], deck: 6 },
      );
      expect(g.asPlayerOne().playCard(freePlay, { targets: [hector] })).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardZone(hector)).toBe("discard");
      expect(g.asPlayerOne().getBagCount()).toBe(1);
      expect(
        g.asPlayerOne().resolvePendingByCard(hector, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getZonesCardCount().deck).toBe(5);
      expect(g.asPlayerOne().getZonesCardCount().discard).toBe(3);
    },
  );
  it.each(["hand", "discard"] as const)(
    "effect-driven Miguel entry from %s evaluates his own conditional Singer",
    (from: "hand" | "discard") => {
      for (const hasSong of [false, true]) {
        const freePlay = createMockAction({
          id: "tremaine-miguel-free-" + from,
          name: "Free Miguel",
          cost: 0,
          abilities: [
            {
              type: "action",
              effect: { type: "play-card", from, cardType: "character", cost: "free" },
            },
          ],
        });
        const g = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: from === "hand" ? [freePlay, miguel] : [freePlay],
            discard: [...(from === "discard" ? [miguel] : []), ...(hasSong ? [firstSong] : [])],
            deck: 6,
          },
          { play: [ladyTremaineScornfulSnob], discard: [secondSong], deck: 6 },
        );
        expect(g.asPlayerOne().playCard(freePlay, { targets: [miguel] })).toBeSuccessfulCommand();
        expect(g.asPlayerOne().getCardZone(miguel)).toBe("play");
        expect(g.asPlayerOne().getDamage(miguel)).toBe(hasSong ? 1 : 0);
        expect(g.asPlayerOne().getZonesCardCount().inkwell).toBe(0);
        expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
      }
    },
  );
  it("Hector retains his play trigger after lethal Singer entry and mills from discard", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [hector], inkwell: 1, deck: 6 },
      { play: [ladyTremaineScornfulSnob], deck: 6 },
    );
    expect(g.asPlayerOne().playCard(hector)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(hector)).toBe("discard");
    expect(g.asPlayerOne().getBagCount()).toBe(1);
    expect(
      g.asPlayerOne().resolvePendingByCard(hector, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(5);
    expect(g.asPlayerOne().getZonesCardCount().discard).toBe(2);
  });
  it.each([false, true])(
    "Miguel entry uses conditional Singer only when own song discard is %s",
    (hasSong: boolean) => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [miguel], inkwell: 1, deck: 6, discard: hasSong ? [firstSong] : [] },
        { play: [ladyTremaineScornfulSnob], discard: [secondSong], deck: 6 },
      );
      expect(g.asPlayerOne().playCard(miguel)).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getDamage(miguel)).toBe(hasSong ? 1 : 0);
      expect(g.asPlayerOne().getCardZone(miguel)).toBe("play");
    },
  );
  it("entry damage banishes a one-willpower opposing Singer", () => {
    const fragile = createMockCharacter({
      id: "tremaine-fragile-singer",
      name: "Fragile Singer",
      cost: 1,
      willpower: 1,
      abilities: [singer(1)],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [ladyTremaineScornfulSnob], deck: 6 },
      { hand: [fragile], inkwell: 1, deck: 6 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(fragile)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(fragile)).toBe("discard");
    expect(g.asPlayerTwo().getZonesCardCount().play).toBe(0);
    expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });
  it("Ward does not block the unchosen opposing Singer entry effect", () => {
    const protectedSinger = createMockCharacter({
      id: "tremaine-ward-singer",
      name: "Ward Singer",
      cost: 2,
      abilities: [singer(2), { type: "keyword", keyword: "Ward" }],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [ladyTremaineScornfulSnob], deck: 6 },
      { hand: [protectedSinger], inkwell: 2, deck: 6 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(protectedSinger)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(protectedSinger)).toBe(1);
    expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });
  it("opposing characters with Singer enter play with 1 damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [ladyTremaineScornfulSnob],
      },
      {
        hand: [opponentSinger],
        inkwell: 2,
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().playCard(opponentSinger)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo()).toHaveDamage({ card: opponentSinger, value: 1 });
  });

  it("opposing characters without Singer enter play undamaged", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [ladyTremaineScornfulSnob],
      },
      {
        hand: [opponentPlain],
        inkwell: 2,
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().playCard(opponentPlain)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo()).toHaveDamage({ card: opponentPlain, value: 0 });
  });
});
