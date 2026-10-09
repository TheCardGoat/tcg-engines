// CR 2.2.0: 6.1.6 (another), 6.2.4 (secondary condition at resolution).
// CR 5.1.1.1 and 6.1.5.1: an already-ready card has no ready transition,
// so the sequential "if you do" restriction is not performed.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockSong,
  createMockItem,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { jukebox } from "./134-jukebox";

const repeatSongA = createMockSong({
  id: "jukebox-song-a",
  name: "Same Old Song",
  cost: 2,
  text: "A song.",
});
const repeatSongB = createMockSong({
  id: "jukebox-song-b",
  name: "Same Old Song",
  cost: 2,
  text: "A song.",
});
const exertedCharacter = createMockCharacter({
  id: "jukebox-dancer",
  name: "Dancer",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 2,
});
const unrelatedFiller = createMockItem({ id: "jukebox-filler", name: "Filler", cost: 1 });

describe("Jukebox", () => {
  it("two Jukebox copies have independent once-per-turn uses", () => {
    const other = createMockCharacter({
      id: "jukebox-other-dancer",
      name: "Other Dancer",
      cost: 3,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [repeatSongA],
      inkwell: 2,
      discard: [repeatSongB],
      play: [
        jukebox,
        jukebox,
        { card: exertedCharacter, exerted: true, isDrying: false },
        { card: other, exerted: true, isDrying: false },
      ],
    });
    expect(g.asPlayerOne().playCard(repeatSongA)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(2);
    const [first, second] = g.asPlayerOne().getBagEffects();
    expect(
      g.asPlayerOne().resolveBag(first.id, { resolveOptional: true, targets: [exertedCharacter] }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveBag(second.id, { resolveOptional: true, targets: [other] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().isExerted(exertedCharacter)).toBe(false);
    expect(g.asPlayerOne().isExerted(other)).toBe(false);
    expect(g.hasRestriction(exertedCharacter, "cant-quest")).toBe(true);
    expect(g.hasRestriction(other, "cant-quest")).toBe(true);
  });

  it("refreshes its use on its controller's next turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [repeatSongA, repeatSongB],
      inkwell: 4,
      play: [jukebox, { card: exertedCharacter, exerted: true, isDrying: false }],
      discard: [createMockItem({ id: "jukebox-reset-copy", name: "Same Old Song", cost: 1 })],
    });
    expect(g.asPlayerOne().playCard(repeatSongA)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(jukebox, { resolveOptional: true, targets: [exertedCharacter] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(exertedCharacter)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(repeatSongB)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(jukebox, { resolveOptional: true, targets: [exertedCharacter] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().isExerted(exertedCharacter)).toBe(false);
  });

  it("works for player two during their own turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {},
      {
        hand: [repeatSongA],
        inkwell: 2,
        discard: [repeatSongB],
        play: [jukebox, { card: exertedCharacter, exerted: true, isDrying: false }],
      },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    // The new turn readies this character. Exert it before the paid song.
    expect(g.asPlayerTwo().quest(exertedCharacter)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(repeatSongA)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getBagCount()).toBe(1);
    expect(
      g
        .asPlayerTwo()
        .resolvePendingByCard(jukebox, { resolveOptional: true, targets: [exertedCharacter] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().isExerted(exertedCharacter)).toBe(false);
    expect(g.asPlayerTwo().quest(exertedCharacter)).not.toBeSuccessfulCommand();
  });

  it("does not trigger for an opponent's song", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [jukebox, { card: exertedCharacter, exerted: true }], discard: [repeatSongB] },
      { hand: [repeatSongA], inkwell: 2 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(repeatSongA)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getBagCount()).toBe(0);
    expect(g.asPlayerOne().isExerted(exertedCharacter)).toBe(true);
  });

  it("does not trigger from hand or discard", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [jukebox, repeatSongA],
      discard: [jukebox, repeatSongB],
      inkwell: 2,
      play: [{ card: exertedCharacter, exerted: true }],
    });
    expect(g.asPlayerOne().playCard(repeatSongA)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne().isExerted(exertedCharacter)).toBe(true);
  });

  it("can resolve after another song trigger creates the matching discard card", () => {
    const miller = createMockItem({
      id: "jukebox-trigger-mill",
      name: "Triggered Miller",
      cost: 1,
      abilities: [
        {
          type: "triggered",
          trigger: {
            event: "play",
            on: { cardType: "song", controller: "you" },
            timing: "whenever",
          },
          effect: {
            type: "optional",
            chooser: "CONTROLLER",
            effect: { type: "mill", amount: 1, target: "CONTROLLER" },
          },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [repeatSongA],
      inkwell: 2,
      deck: [unrelatedFiller, repeatSongB],
      play: [miller, jukebox, { card: exertedCharacter, exerted: true, isDrying: false }],
    });
    expect(g.asPlayerOne().playCard(repeatSongA)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(2);
    expect(
      g.asPlayerOne().resolvePendingByCard(miller, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(repeatSongB)).toBe("discard");
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(jukebox, { resolveOptional: true, targets: [exertedCharacter] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().isExerted(exertedCharacter)).toBe(false);
  });

  it("cancels if another bag effect removes the other matching discard card", () => {
    const retriever = createMockItem({
      id: "jukebox-retriever",
      name: "Song Retriever",
      cost: 1,
      abilities: [
        {
          type: "triggered",
          trigger: {
            event: "play",
            on: { cardType: "song", controller: "you" },
            timing: "whenever",
          },
          effect: {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "return-to-hand",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["discard"],
                cardTypes: ["action"],
              },
            },
          },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [repeatSongA],
      inkwell: 2,
      discard: [repeatSongB],
      play: [retriever, jukebox, { card: exertedCharacter, exerted: true, isDrying: false }],
    });
    const otherSongId = g.findCardInstanceId(repeatSongB, "discard", PLAYER_ONE);
    expect(g.asPlayerOne().playCard(repeatSongA)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(2);
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(retriever, { resolveOptional: true, targets: [otherSongId] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(otherSongId)).toBe("hand");
    // The remaining trigger automatically cancels when its condition is false.
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne().isExerted(exertedCharacter)).toBe(true);
    expect(g.hasRestriction(exertedCharacter, "cant-quest")).toBe(false);
  });

  for (const invalid of ["item", "hand", "discard", "opposing-ward", "multiple"] as const)
    it("rejects " + invalid + " as a ready target and preserves the trigger for retry", () => {
      const ward = createMockCharacter({
        id: "jukebox-ward",
        name: "Ward Dancer",
        cost: 3,
        abilities: [{ type: "keyword", keyword: "Ward" }],
      });
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [repeatSongA, exertedCharacter],
          inkwell: 2,
          discard: [repeatSongB, exertedCharacter],
          play: [jukebox, { card: ward, exerted: true, isDrying: false }],
        },
        { play: [{ card: ward, exerted: true, isDrying: false }] },
      );
      expect(g.asPlayerOne().playCard(repeatSongA)).toBeSuccessfulCommand();
      const own = g.findCardInstanceId(ward, "play", PLAYER_ONE);
      const other = g.findCardInstanceId(ward, "play", PLAYER_TWO);
      const targets =
        invalid === "multiple"
          ? [own, other]
          : [
              invalid === "item"
                ? jukebox
                : invalid === "opposing-ward"
                  ? other
                  : g.findCardInstanceId(exertedCharacter, invalid, PLAYER_ONE),
            ];
      expect(
        g.asPlayerOne().resolvePendingByCard(jukebox, { resolveOptional: true, targets }),
      ).not.toBeSuccessfulCommand();
      expect(g.asPlayerOne().getBagCount()).toBe(1);
      expect(
        g.asPlayerOne().resolvePendingByCard(jukebox, { resolveOptional: true, targets: [own] }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().isExerted(own)).toBe(false);
      expect(g.asPlayerTwo().isExerted(other)).toBe(true);
    });

  it("does not restrict a character that cannot be readied", () => {
    const locked = createMockCharacter({
      id: "jukebox-cant-ready",
      name: "Cannot Ready",
      cost: 3,
      abilities: [
        {
          type: "static",
          effect: { type: "restriction", restriction: "cant-ready", target: "SELF" },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [repeatSongA],
      inkwell: 2,
      discard: [repeatSongB],
      play: [jukebox, { card: locked, exerted: true, isDrying: false }],
    });
    expect(g.asPlayerOne().playCard(repeatSongA)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(jukebox, { resolveOptional: true, targets: [locked] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().isExerted(locked)).toBe(true);
    expect(g.hasRestriction(locked, "cant-quest")).toBe(false);
  });

  it("checks the matching discard card after the song's effect resolves", () => {
    const millSong = createMockSong({
      id: "jukebox-mill-song",
      name: "Same Old Song",
      cost: 2,
      text: "Mill a card.",
      abilities: [{ type: "action", effect: { type: "mill", amount: 1, target: "CONTROLLER" } }],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [millSong],
      inkwell: 2,
      deck: [repeatSongB],
      play: [jukebox, { card: exertedCharacter, exerted: true, isDrying: false }],
    });
    expect(g.asPlayerOne().playCard(millSong)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(repeatSongB)).toBe("discard");
    expect(g.asPlayerOne().getBagCount()).toBe(1);
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(jukebox, { resolveOptional: true, targets: [exertedCharacter] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().isExerted(exertedCharacter)).toBe(false);
  });

  it("resolves only once in the same turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [repeatSongA, repeatSongB],
      inkwell: 4,
      play: [jukebox, { card: exertedCharacter, exerted: true, isDrying: false }],
      discard: [createMockItem({ id: "jukebox-named-item", name: "Same Old Song", cost: 1 })],
    });
    expect(g.asPlayerOne().playCard(repeatSongA)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(jukebox, { resolveOptional: true, targets: [exertedCharacter] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().singSong(repeatSongB, exertedCharacter)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne().isExerted(exertedCharacter)).toBe(true);
  });

  it("does not use an opponent's same-name discard card", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [repeatSongA],
        inkwell: 2,
        play: [jukebox, { card: exertedCharacter, exerted: true, isDrying: false }],
      },
      { discard: [repeatSongB] },
    );
    expect(g.asPlayerOne().playCard(repeatSongA)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne().isExerted(exertedCharacter)).toBe(true);
  });

  it("can ready an opposing character", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [repeatSongA], inkwell: 2, play: [jukebox], discard: [repeatSongB] },
      { play: [{ card: exertedCharacter, exerted: true, isDrying: false }] },
    );
    expect(g.asPlayerOne().playCard(repeatSongA)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(jukebox, { resolveOptional: true, targets: [exertedCharacter] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().isExerted(exertedCharacter)).toBe(false);
  });

  it("does not trigger when the played card is an item", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [unrelatedFiller],
      inkwell: 1,
      play: [jukebox, { card: exertedCharacter, exerted: true, isDrying: false }],
      discard: [createMockItem({ id: "jukebox-filler-copy", name: "Filler", cost: 1 })],
    });
    expect(g.asPlayerOne().playCard(unrelatedFiller)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne().isExerted(exertedCharacter)).toBe(true);
  });

  it("readies a singer after a matching song is sung for free", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [repeatSongA],
      play: [jukebox, { card: exertedCharacter, isDrying: false }],
      discard: [repeatSongB],
    });
    expect(g.asPlayerOne().singSong(repeatSongA, exertedCharacter)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().isExerted(exertedCharacter)).toBe(true);
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(jukebox, { resolveOptional: true, targets: [exertedCharacter] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().isExerted(exertedCharacter)).toBe(false);
    expect(g.asPlayerOne().quest(exertedCharacter)).not.toBeSuccessfulCommand();
  });

  it("declining leaves the character exerted", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [repeatSongA],
      inkwell: 2,
      play: [jukebox, { card: exertedCharacter, exerted: true, isDrying: false }],
      discard: [repeatSongB],
    });
    expect(g.asPlayerOne().playCard(repeatSongA)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(jukebox, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne().isExerted(exertedCharacter)).toBe(true);
  });

  it("readies a chosen character when you play a song sharing a name with a discard card, then it can't quest", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [repeatSongA],
        inkwell: 4,
        play: [jukebox, { card: exertedCharacter, exerted: true, isDrying: false }],
        discard: [repeatSongB],
      },
      {},
    );

    expect(testEngine.asPlayerOne().playCard(repeatSongA)).toBeSuccessfulCommand();

    // Resolve the trigger: accept the optional and choose the exerted
    // character to ready.
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(jukebox, {
        resolveOptional: true,
        targets: [exertedCharacter],
      }),
    ).toBeSuccessfulCommand();

    // Readied by the effect (public card-state accessor).
    expect(testEngine.asPlayerOne().isExerted(exertedCharacter)).toBe(false);

    // Readied but locked: the controller's own quest on the READY dancer is
    // refused for the rest of the turn (the pass/fail pair is what proves the
    // lock — a rival-side quest would fail for wrong-actor reasons anyway).
    expect(testEngine.asPlayerOne().quest(exertedCharacter)).not.toBeSuccessfulCommand();

    // The lock expires with the turn: on the controller's next turn the
    // dancer quests normally.
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(exertedCharacter)).toBeSuccessfulCommand();
  });

  it("doesn't trigger for songs with no same-name card in your discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [repeatSongA],
        inkwell: 4,
        play: [jukebox, { card: exertedCharacter, exerted: true, isDrying: false }],
        discard: [unrelatedFiller],
      },
      {},
    );

    expect(testEngine.asPlayerOne().playCard(repeatSongA)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(repeatSongA)).toBe("discard");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().isExerted(exertedCharacter)).toBe(true);
  });
});

// CR 6.1.13.2: each source has its own once allowance; 6.2.4: match at resolution.
it("Player Two's two copies ready singer and opponent independently, reject wrong chooser, and expire", () => {
  const ward = createMockCharacter({
    id: "jukebox-p2-ward",
    name: "Ward",
    cost: 2,
    abilities: [{ type: "keyword", keyword: "Ward" }],
  });
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [
        { card: exertedCharacter, exerted: true, isDrying: false },
        { card: ward, exerted: true, isDrying: false },
      ],
      deck: 6,
    },
    {
      hand: [repeatSongA, repeatSongB],
      play: [jukebox, jukebox, { card: exertedCharacter, isDrying: false }],
      discard: [repeatSongB],
      inkwell: 2,
      deck: 6,
    },
  );
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const singer = g.findCardInstanceId(exertedCharacter, "play", PLAYER_TWO);
  const opposing = g.findCardInstanceId(exertedCharacter, "play", PLAYER_ONE);
  const forbidden = g.findCardInstanceId(ward, "play", PLAYER_ONE);
  const sources = g.getCardInstanceIdsInZone("play", PLAYER_TWO).filter((id) => id !== singer);
  expect(g.asPlayerTwo().singSong(repeatSongA, singer)).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().getBagCount()).toBe(2);
  expect(
    g.asPlayerOne().resolvePendingByCard(sources[0]!, { resolveOptional: true, targets: [singer] })
      .success,
  ).toBe(false);
  expect(
    g
      .asPlayerTwo()
      .resolvePendingByCard(sources[0]!, { resolveOptional: true, targets: [forbidden] }).success,
  ).toBe(false);
  expect(g.asPlayerTwo().getBagCount()).toBe(2);
  expect(
    g.asPlayerTwo().resolvePendingByCard(sources[0]!, { resolveOptional: true, targets: [singer] }),
  ).toBeSuccessfulCommand();
  expect(
    g
      .asPlayerTwo()
      .resolvePendingByCard(sources[1]!, { resolveOptional: true, targets: [opposing] }),
  ).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().isExerted(singer)).toBe(false);
  expect(g.asPlayerOne().isExerted(opposing)).toBe(false);
  expect(g.asPlayerOne().isExerted(forbidden)).toBe(true);
  expect(g.hasRestriction(singer, "cant-quest")).toBe(true);
  expect(g.hasRestriction(opposing, "cant-quest")).toBe(true);
  expect(g.asPlayerTwo().quest(singer).success).toBe(false);
  expect(g.asPlayerTwo().playCard(repeatSongB)).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().getBagCount()).toBe(0);
  expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(g.hasRestriction(opposing, "cant-quest")).toBe(false);
  expect(g.hasRestriction(singer, "cant-quest")).toBe(false);
  expect(g.asPlayerOne().quest(opposing)).toBeSuccessfulCommand();
});
it("an already-ready target has no ready event and no if-you-do quest restriction", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [repeatSongA],
    inkwell: 2,
    discard: [repeatSongB],
    play: [jukebox, { card: exertedCharacter, isDrying: false }],
  });
  expect(g.asPlayerOne().playCard(repeatSongA)).toBeSuccessfulCommand();
  expect(
    g
      .asPlayerOne()
      .resolvePendingByCard(jukebox, { resolveOptional: true, targets: [exertedCharacter] }),
  ).toBeSuccessfulCommand();
  expect(g.asPlayerOne().isExerted(exertedCharacter)).toBe(false);
  expect(g.hasRestriction(exertedCharacter, "cant-quest")).toBe(false);
  expect(g.asPlayerOne().quest(exertedCharacter)).toBeSuccessfulCommand();
});
it("no legal character completes its optional trigger without moving hidden cards or restricting anything", () => {
  const ward = createMockCharacter({
    id: "jukebox-no-target-ward",
    name: "Ward",
    cost: 2,
    abilities: [{ type: "keyword", keyword: "Ward" }],
  });
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [repeatSongA, exertedCharacter],
      inkwell: 2,
      discard: [repeatSongB, exertedCharacter],
      play: [jukebox],
      deck: [exertedCharacter],
    },
    { play: [{ card: ward, exerted: true, isDrying: false }], deck: 6 },
  );
  const deck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
  const hand = g.getCardInstanceIdsInZone("hand", PLAYER_ONE);
  const discard = g.getCardInstanceIdsInZone("discard", PLAYER_ONE);
  const played = g.findCardInstanceId(repeatSongA, "hand", PLAYER_ONE);
  expect(g.asPlayerOne().playCard(played)).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getBagCount()).toBe(1);
  expect(
    g.asPlayerOne().resolvePendingByCard(jukebox, { resolveOptional: true }),
  ).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getBagCount()).toBe(0);
  expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(deck);
  expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toEqual(
    hand.filter((id) => id !== played),
  );
  expect(g.getCardInstanceIdsInZone("discard", PLAYER_ONE)).toEqual([...discard, played]);
  expect(g.asPlayerTwo().isExerted(ward)).toBe(true);
  expect(g.hasRestriction(ward, "cant-quest")).toBe(false);
});

// Official CR 2.2.0 6.1.1 and 6.1.13.2: only a fully resolved ability
// consumes "once"; declining or failing to ready leaves the use available.
for (const boundary of ["decline", "already-ready", "cant-ready"] as const) {
  it("does not consume once after " + boundary + ", then consumes it after an actual ready", () => {
    const locked = createMockCharacter({
      id: "jukebox-once-locked",
      name: "Locked Dancer",
      cost: 3,
      abilities: [
        {
          type: "static",
          effect: { type: "restriction", restriction: "cant-ready", target: "SELF" },
        },
      ],
    });
    const thirdSong = createMockSong({
      id: "jukebox-once-third",
      text: "Test song.",
      name: "Same Old Song",
      cost: 2,
    });
    const fourthSong = createMockSong({
      id: "jukebox-once-fourth",
      text: "Test song.",
      name: "Same Old Song",
      cost: 2,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [repeatSongA, repeatSongB, thirdSong],
      inkwell: 6,
      discard: [fourthSong],
      play: [
        jukebox,
        { card: exertedCharacter, isDrying: false },
        { card: locked, exerted: true, isDrying: false },
      ],
    });
    expect(g.asPlayerOne().playCard(repeatSongA)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(1);
    expect(
      g.asPlayerOne().resolvePendingByCard(
        jukebox,
        boundary === "decline"
          ? { resolveOptional: false }
          : {
              resolveOptional: true,
              targets: [boundary === "cant-ready" ? locked : exertedCharacter],
            },
      ),
    ).toBeSuccessfulCommand();
    expect(g.hasRestriction(exertedCharacter, "cant-quest")).toBe(false);
    expect(g.hasRestriction(locked, "cant-quest")).toBe(false);
    expect(g.asPlayerOne().quest(exertedCharacter)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(repeatSongB)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(1);
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(jukebox, { resolveOptional: true, targets: [exertedCharacter] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().isExerted(exertedCharacter)).toBe(false);
    expect(g.hasRestriction(exertedCharacter, "cant-quest")).toBe(true);
    expect(g.asPlayerOne().playCard(thirdSong)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });
}

it("a no-target resolution leaves the use available for a later character", () => {
  const arriving = createMockCharacter({ id: "jukebox-late-dancer", name: "Late Dancer", cost: 0 });
  const exert = createMockAction({
    id: "jukebox-exert-dancer",
    name: "Exert Dancer",
    cost: 0,
    abilities: [{ type: "action", effect: { type: "exert", target: "CHOSEN_CHARACTER" } }],
  });
  const g = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [repeatSongA, repeatSongB, arriving, exert],
    inkwell: 4,
    discard: [createMockItem({ id: "jukebox-late-match", name: "Same Old Song", cost: 0 })],
    play: [jukebox],
  });
  expect(g.asPlayerOne().playCard(repeatSongA)).toBeSuccessfulCommand();
  expect(
    g.asPlayerOne().resolvePendingByCard(jukebox, { resolveOptional: true }),
  ).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getBagCount()).toBe(0);
  expect(g.asPlayerOne().playCard(arriving)).toBeSuccessfulCommand();
  expect(g.asPlayerOne().playCard(exert, { targets: [arriving] })).toBeSuccessfulCommand();
  expect(g.asPlayerOne().isExerted(arriving)).toBe(true);
  expect(g.asPlayerOne().playCard(repeatSongB)).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getBagCount()).toBe(1);
  expect(
    g.asPlayerOne().resolvePendingByCard(jukebox, { resolveOptional: true, targets: [arriving] }),
  ).toBeSuccessfulCommand();
  expect(g.asPlayerOne().isExerted(arriving)).toBe(false);
  expect(g.hasRestriction(arriving, "cant-quest")).toBe(true);
});
