// CR 2.2.0: 6.1.5.1 (A to B), 6.1.3 (choices), 1.7.7 (no legal choice),
// 8.15.1 (Ward), 5.4.4.2 (singing), 1.7.5 (drying).
import { describe, expect, it } from "bun:test";
import {
  PLAYER_ONE,
  PLAYER_TWO,
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { ifSheDoesntScareYou as song } from "./130-if-she-doesnt-scare-you";
const own = createMockCharacter({ id: "scare-own", name: "Own", cost: 1, strength: 1 });
const enemy = createMockCharacter({ id: "scare-enemy", name: "Enemy", cost: 5, strength: 5 });
const ward = createMockCharacter({
  id: "scare-ward",
  name: "Ward",
  cost: 2,
  abilities: [{ type: "keyword", keyword: "Ward" }],
});
const singer = createMockCharacter({ id: "scare-singer", name: "Singer", cost: 4 });
const smallSinger = createMockCharacter({
  id: "scare-small",
  name: "Small Singer",
  cost: 1,
  abilities: [{ type: "keyword", keyword: "Singer", value: 4 }],
});
const tooSmall = createMockCharacter({ id: "scare-too-small", name: "Too Small", cost: 3 });
const item = createMockItem({ id: "scare-item", name: "Item", cost: 1 });
const place = createMockLocation({ id: "scare-place", name: "Place", cost: 1 });

describe("If She Doesn't Scare You", () => {
  it("pays four and banishes own first then opposing character without affecting an unchosen card", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [song], play: [own, ward], inkwell: 4 },
      { play: [enemy] },
    );
    expect(g.asPlayerOne().playCard(song, { targets: [own, enemy] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(own)).toBe("discard");
    expect(g.asPlayerTwo().getCardZone(enemy)).toBe("discard");
    expect(g.asPlayerOne().getCardZone(ward)).toBe("play");
    expect(g.asPlayerOne().getCardZone(song)).toBe("discard");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });
  it("can choose own Ward first and another own character second", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [song], play: [ward, own], inkwell: 4 },
      { play: [enemy] },
    );
    expect(g.asPlayerOne().playCard(song, { targets: [ward, own] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(ward)).toBe("discard");
    expect(g.asPlayerOne().getCardZone(own)).toBe("discard");
    expect(g.asPlayerTwo().getCardZone(enemy)).toBe("play");
  });
  it("cannot banish an opposing character when no own character can be banished", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [song], inkwell: 4 },
      { play: [enemy] },
    );
    expect(g.asPlayerOne().playCard(song, { targets: [enemy] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(enemy)).toBe("play");
    expect(g.asPlayerOne()).toHavePendingEffectCount(0);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });
  it("banishes its sole own character even when the second step has no legal target", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [song], play: [own], inkwell: 4 },
      { play: [ward, item, place] },
    );
    expect(g.asPlayerOne().playCard(song, { targets: [own] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(own)).toBe("discard");
    expect(g.asPlayerTwo().getCardZone(ward)).toBe("play");
    expect(g.asPlayerOne()).toHavePendingEffectCount(0);
  });
  it("keeps the second choice pending when the supplied order does not resolve it", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [song], play: [own], inkwell: 4 },
      { play: [enemy] },
    );
    expect(g.asPlayerOne().playCard(song, { targets: [enemy, own] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(own)).toBe("discard");
    expect(g.asPlayerTwo().getCardZone(enemy)).toBe("play");
    expect(g.asPlayerOne()).toHavePendingEffectCount(1);
    expect(g.asPlayerOne().resolveNextPending({ targets: [enemy] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(enemy)).toBe("discard");
  });
  for (const invalid of ["opposing-ward", "item", "location", "hand", "discard", "same"])
    it("rejects " + invalid + " as a supplied second target", () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [song, singer], play: [own, item, place], discard: [smallSinger], inkwell: 4 },
        { play: [enemy, ward] },
      );
      const target =
        invalid === "opposing-ward"
          ? ward
          : invalid === "item"
            ? item
            : invalid === "location"
              ? place
              : invalid === "hand"
                ? singer
                : invalid === "discard"
                  ? smallSinger
                  : own;
      expect(g.asPlayerOne().playCard(song, { targets: [own, target] }).success).toBe(false);
      expect(g.asPlayerOne().getCardZone(own)).toBe("play");
      expect(g.asPlayerOne().getCardZone(song)).toBe("hand");
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(4);
      expect(g.asPlayerOne().playCard(song, { targets: [own, enemy] })).toBeSuccessfulCommand();
      expect(g.asPlayerTwo().getCardZone(enemy)).toBe("discard");
    });
  for (const singing of [singer, smallSinger])
    it(
      "sings for free and can banish the singer to pay the first requirement: " + singing.name,
      () => {
        const g = LorcanaMultiplayerTestEngine.createWithFixture(
          { hand: [song], play: [{ card: singing, isDrying: false }], inkwell: 4 },
          { play: [enemy] },
        );
        expect(g.asPlayerOne().singSong(song, singing)).toBeSuccessfulCommand();
        expect(g.asPlayerOne().resolveNextPending({ targets: [singing] })).toBeSuccessfulCommand();
        expect(g.asPlayerOne().getCardZone(singing)).toBe("discard");
        expect(g.asPlayerOne().resolveNextPending({ targets: [enemy] })).toBeSuccessfulCommand();
        expect(g.asPlayerOne().getCardZone(singing)).toBe("discard");
        expect(g.asPlayerTwo().getCardZone(enemy)).toBe("discard");
        expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(4);
      },
    );
  for (const state of ["drying", "exerted", "small", "opponent"])
    it("rejects " + state + " singer without paying or banishing", () => {
      const selected = state === "small" ? tooSmall : singer;
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [song],
          play:
            state === "opponent"
              ? [own]
              : [{ card: selected, isDrying: state === "drying", exerted: state === "exerted" }],
          inkwell: 4,
        },
        { play: state === "opponent" ? [selected, enemy] : [enemy] },
      );
      expect(g.asPlayerOne().singSong(song, selected).success).toBe(false);
      expect(g.asPlayerOne().getCardZone(song)).toBe("hand");
      expect(g.asPlayerTwo().getCardZone(enemy)).toBe("play");
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(4);
    });
  it("cannot pay with only three ink", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [song], play: [own], inkwell: 3 },
      { play: [enemy] },
    );
    expect(g.asPlayerOne().playCard(song, { targets: [own, enemy] }).success).toBe(false);
    expect(g.asPlayerOne().getCardZone(own)).toBe("play");
    expect(g.asPlayerTwo().getCardZone(enemy)).toBe("play");
  });
  it("pays four with three ink plus one claimed drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [song], play: [own], inkwell: 3, inkDrops: 1 },
      { play: [enemy] },
    );
    expect(
      g.asPlayerOne().playCard(song, { targets: [own, enemy], inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerTwo().getCardZone(enemy)).toBe("discard");
  });
  it("is inkable and does not banish anything when inked", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [song], play: [own] },
      { play: [enemy] },
    );
    expect(g.asPlayerOne().putIntoInkwell(PLAYER_ONE, song)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(song)).toBe("inkwell");
    expect(g.asPlayerOne().getCardZone(own)).toBe("play");
    expect(g.asPlayerTwo().getCardZone(enemy)).toBe("play");
  });
});

it("does not allow an opposing first target in a live resolution prompt", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [song], play: [own], inkwell: 4 },
    { play: [enemy] },
  );
  expect(g.asPlayerOne().playCard(song)).toBeSuccessfulCommand();
  expect(g.asPlayerOne().resolveNextPending({ targets: [enemy] }).success).toBe(false);
  expect(g.asPlayerOne().getCardZone(own)).toBe("play");
  expect(g.asPlayerTwo().getCardZone(enemy)).toBe("play");
  expect(g.asPlayerOne().resolveNextPending({ targets: [own] })).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getCardZone(own)).toBe("discard");
  expect(g.asPlayerTwo().getCardZone(enemy)).toBe("play");
  expect(g.asPlayerOne().resolveNextPending({ targets: [enemy] })).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().getCardZone(enemy)).toBe("discard");
});
it("rejects opposing Ward at the second prompt without undoing the completed first banishment", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [song], play: [own], inkwell: 4 },
    { play: [enemy, ward] },
  );
  expect(g.asPlayerOne().playCard(song)).toBeSuccessfulCommand();
  expect(g.asPlayerOne().resolveNextPending({ targets: [own] })).toBeSuccessfulCommand();
  expect(g.asPlayerOne().resolveNextPending({ targets: [ward] }).success).toBe(false);
  expect(g.asPlayerOne().getCardZone(own)).toBe("discard");
  expect(g.asPlayerTwo().getCardZone(ward)).toBe("play");
  expect(g.asPlayerOne()).toHavePendingEffectCount(1);
  expect(g.asPlayerOne().resolveNextPending({ targets: [enemy] })).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().getCardZone(enemy)).toBe("discard");
});

for (const second of ["own Ward", "opposing Resist"])
  it(`player two controls both choices when Singer 4 banishes itself, then ${second}`, () => {
    const resistant = createMockCharacter({
      id: "scare-p2-resistant",
      name: "Resistant",
      cost: 1,
      willpower: 9,
      abilities: [{ type: "keyword", keyword: "Resist", value: 9 }],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [resistant, ward, item, place], hand: [own], discard: [own], deck: 6 },
      {
        play: [smallSinger, ward, own, item, place],
        hand: [song, singer],
        discard: [own],
        inkwell: 4,
        inkDrops: 2,
        deck: 6,
      },
    );
    const first = g.findCardInstanceId(smallSinger, "play", PLAYER_TWO);
    const ownWard = g.findCardInstanceId(ward, "play", PLAYER_TWO);
    const otherOwn = g.findCardInstanceId(own, "play", PLAYER_TWO);
    const opposingWard = g.findCardInstanceId(ward, "play", PLAYER_ONE);
    const opposingResist = g.findCardInstanceId(resistant, "play", PLAYER_ONE);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const ownDeck = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
    const opponentDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerTwo().singSong(song, first)).toBeSuccessfulCommand();
    const [firstChoice] = g.asPlayerTwo().getPendingEffects();
    if (firstChoice?.selectionContext?.kind !== "target-selection")
      throw new Error("Expected own choice");
    expect(firstChoice.selectionContext.cardCandidateIds.slice().sort()).toEqual(
      [first, ownWard, otherOwn].sort(),
    );
    expect(g.asPlayerOne().resolveNextPending({ targets: [first] })).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolveNextPending({ targets: [opposingResist] }),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerTwo().resolveNextPending({ targets: [first] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(first)).toBe("discard");
    expect(g.asPlayerOne().getCardZone(opposingResist)).toBe("play");
    const firstLog = g.asServer().getMoveLogHistory().at(-1)?.public ?? [];
    expect(firstLog).toContainEqual({
      key: "lorcana.outcome.cardBanished",
      values: { playerId: PLAYER_TWO, cardId: first },
    });
    const [secondChoice] = g.asPlayerTwo().getPendingEffects();
    if (secondChoice?.selectionContext?.kind !== "target-selection")
      throw new Error("Expected second choice");
    expect(secondChoice.selectionContext.cardCandidateIds.slice().sort()).toEqual(
      [ownWard, otherOwn, opposingResist].sort(),
    );
    const chosen = second === "own Ward" ? ownWard : opposingResist;
    expect(g.asPlayerOne().resolveNextPending({ targets: [chosen] })).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolveNextPending({ targets: [opposingWard] }),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(first)).toBe("discard");
    expect(g.asPlayerTwo().resolveNextPending({ targets: [chosen] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(chosen)).toBe("discard");
    expect(g.asPlayerTwo().getCardZone(second === "own Ward" ? opposingResist : ownWard)).toBe(
      "play",
    );
    expect(g.asPlayerTwo().getCardZone(otherOwn)).toBe("play");
    expect(g.asPlayerOne().getCardZone(opposingWard)).toBe("play");
    expect(g.asPlayerTwo()).toHavePendingEffectCount(0);
    expect(g.asPlayerTwo().getBagCount()).toBe(0);
    const secondLog = g.asServer().getMoveLogHistory().at(-1)?.public ?? [];
    expect(secondLog).toContainEqual({
      key: "lorcana.outcome.cardBanished",
      values: { playerId: PLAYER_TWO, cardId: chosen },
    });
    expect(secondLog.some((message) => /damage/i.test(message.key))).toBe(false);
    expect(g.asPlayerTwo().getDamage(chosen)).toBe(0);
    expect(g.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(4);
    expect(g.getInkDrops(PLAYER_TWO)).toBe(2);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(ownDeck);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(opponentDeck);
  });

for (const ownCharacter of [false, true])
  it(`player two finishes without a ${ownCharacter ? "second" : "first"} legal character choice`, () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: ownCharacter ? [ward, item, place] : [enemy, ward, item, place], deck: 6 },
      {
        play: ownCharacter ? [own, item, place] : [item, place],
        hand: [song, singer],
        discard: [smallSinger],
        inkwell: [own, own, own, own],
        deck: 6,
        inkDrops: 2,
      },
    );
    const opposingWard = g.findCardInstanceId(ward, "play", PLAYER_ONE);
    const first = ownCharacter ? g.findCardInstanceId(own, "play", PLAYER_TWO) : undefined;
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const hiddenDiscard = g.getCardInstanceIdsInZone("discard", PLAYER_TWO);
    const ownDeck = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
    expect(
      g.asPlayerTwo().playCard(song, first ? { targets: [first] } : {}),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo()).toHavePendingEffectCount(0);
    expect(g.asPlayerTwo().getBagCount()).toBe(0);
    expect(g.asPlayerOne().getCardZone(opposingWard)).toBe("play");
    expect(g.asPlayerTwo().getCardZone(song)).toBe("discard");
    expect(g.asPlayerTwo().getCardZone(singer)).toBe("hand");
    for (const id of hiddenDiscard) expect(g.asPlayerTwo().getCardZone(id)).toBe("discard");
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(ownDeck);
    expect(g.getInkDrops(PLAYER_TWO)).toBe(2);
    const log = g.asServer().getMoveLogHistory().at(-1)?.public ?? [];
    const banishments = log.filter((message) => message.key === "lorcana.outcome.cardBanished");
    if (first) {
      expect(g.asPlayerTwo().getCardZone(first)).toBe("discard");
      expect(banishments).toEqual([
        { key: "lorcana.outcome.cardBanished", values: { playerId: PLAYER_TWO, cardId: first } },
      ]);
    } else {
      expect(g.asPlayerOne().getCardZone(enemy)).toBe("play");
      expect(banishments).toHaveLength(0);
    }
  });
