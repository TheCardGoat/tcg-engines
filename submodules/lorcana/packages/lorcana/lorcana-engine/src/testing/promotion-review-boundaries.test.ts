// CR 2.2.0: 6.1.13.2 (fully resolved once), 6.7.6/7.1.6 (retained source), 9.2.2 (seat order).
import { describe, expect, it } from "bun:test";
import type { Effect } from "@tcg/lorcana-types";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
  createMockItem,
  createMockSong,
} from ".";
const songs = [0, 1, 2].map((i) =>
  createMockSong({ id: `review-song-${i}`, name: `Review Song ${i}`, cost: 0, text: "Test song." }),
);
const guest = createMockCharacter({
  id: "review-guest",
  name: "Review Guest",
  cost: 0,
  strength: 1,
});
const giveOpponentLore = createMockAction({
  id: "review-opponent-lore",
  name: "Opponent Lore",
  cost: 0,
  abilities: [{ type: "action", effect: { type: "gain-lore", amount: 1, target: "OPPONENT" } }],
});
const restoreDeck = createMockAction({
  id: "review-deck-restore",
  name: "Restore Deck",
  cost: 0,
  abilities: [
    {
      type: "action",
      effect: {
        type: "put-on-top",
        target: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["hand"],
          cardTypes: ["character"],
        },
      },
    },
  ],
});
function limited(effect: Effect, restriction: "once-per-turn" | "once-per-song" = "once-per-turn") {
  return createMockItem({
    id: `review-limited-${restriction}`,
    name: "Limited Review",
    cost: 0,
    abilities: [
      {
        type: "triggered",
        trigger: {
          event: restriction === "once-per-song" ? "sing" : "play",
          on:
            restriction === "once-per-song"
              ? "YOUR_CHARACTERS"
              : { cardType: "song", controller: "you" },
          timing: "whenever",
          restrictions: [{ type: restriction }],
        },
        effect,
      },
    ],
  });
}
function drain(g: LorcanaMultiplayerTestEngine) {
  for (let i = 0; i < 10 && g.asPlayerOne().getBagCount(); i++)
    expect(
      g.asPlayerOne().resolveBag(g.asPlayerOne().getBagEffects()[0]!.id),
    ).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getBagCount()).toBe(0);
}
describe("promotion review: full-resolution boundaries", () => {
  for (const [name, effect] of [
    [
      "false condition",
      {
        type: "conditional",
        condition: {
          type: "comparison",
          left: { type: "lore", controller: "opponent" },
          comparison: "greater-or-equal",
          right: { type: "constant", value: 1 },
        },
        then: { type: "gain-lore", amount: 1, target: "CONTROLLER" },
      },
    ],
    ["zero lore loss", { type: "lose-lore", amount: 1, target: "OPPONENT" }],
  ] satisfies Array<[string, Effect]>)
    it(`${name} retries after the outcome becomes possible`, () => {
      const source = limited(effect);
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [...songs, giveOpponentLore],
        play: [source],
      });
      expect(g.asPlayerOne().playCard(songs[0]!)).toBeSuccessfulCommand();
      drain(g);
      expect(g.getLore(PLAYER_ONE)).toBe(0);
      expect(g.getLore(PLAYER_TWO)).toBe(0);
      expect(g.asPlayerOne().playCard(giveOpponentLore)).toBeSuccessfulCommand();
      expect(g.asPlayerOne().playCard(songs[1]!)).toBeSuccessfulCommand();
      drain(g);
      expect(g.getLore(name === "false condition" ? PLAYER_ONE : PLAYER_TWO)).toBe(
        name === "false condition" ? 1 : 0,
      );
      expect(g.asPlayerOne().playCard(songs[2]!)).toBeSuccessfulCommand();
      drain(g);
      expect(g.getLore(name === "false condition" ? PLAYER_ONE : PLAYER_TWO)).toBe(
        name === "false condition" ? 1 : 0,
      );
    });
  for (const [name, effect] of [
    ["empty search", { type: "search-deck", cardType: "character", putInto: "hand" }],
    ["empty scry", { type: "scry", amount: 1 }],
  ] satisfies Array<[string, Effect]>)
    it(`${name} retries after the deck is replenished`, () => {
      const source = limited(effect);
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [...songs, restoreDeck, guest],
        play: [source],
        deck: [],
      });
      expect(g.asPlayerOne().playCard(songs[0]!)).toBeSuccessfulCommand();
      drain(g);
      expect(g.asPlayerOne().playCard(restoreDeck, { targets: [guest] })).toBeSuccessfulCommand();
      expect(g.asPlayerOne().playCard(songs[1]!)).toBeSuccessfulCommand();
      drain(g);
      expect(g.asPlayerOne().playCard(songs[2]!)).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getBagCount()).toBe(0);
    });
  it("a successful inkwell reveal consumes once despite provisional false marks", () => {
    const source = limited({
      type: "sequence",
      steps: [
        { type: "reveal-inkwell", target: "CONTROLLER" },
        { type: "gain-lore", amount: 1, target: "CONTROLLER" },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: songs,
      play: [source],
      inkwell: 1,
    });
    expect(g.asPlayerOne().playCard(songs[0]!)).toBeSuccessfulCommand();
    drain(g);
    expect(g.getLore(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().playCard(songs[1]!)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.getLore(PLAYER_ONE)).toBe(1);
  });
  it("a targetless modifier does not consume its use", () => {
    const source = limited({
      type: "modify-stat",
      stat: "strength",
      modifier: 1,
      duration: "this-turn",
      target: {
        selector: "chosen",
        count: 1,
        owner: "you",
        zones: ["play"],
        cardTypes: ["character"],
      },
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [...songs, guest],
      play: [source],
    });
    expect(g.asPlayerOne().playCard(songs[0]!)).toBeSuccessfulCommand();
    drain(g);
    expect(g.asPlayerOne().playCard(guest)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(songs[1]!)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(source, { targets: [guest] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(guest)).toBe(2);
    expect(g.asPlayerOne().playCard(songs[2]!)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });
  it("queued Sing Together events resolve once per song", () => {
    const source = limited({ type: "gain-lore", amount: 1, target: "CONTROLLER" }, "once-per-song");
    const song = createMockSong({
      id: "review-group-song",
      name: "Group Song",
      cost: 2,
      text: "Sing Together 2",
      abilities: [{ type: "keyword", keyword: "SingTogether", value: 2 }],
    });
    const singer = createMockCharacter({ id: "review-singer", name: "Singer", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [song],
      play: [source, singer, singer],
    });
    const sourceId = g.findCardInstanceId(source, "play", PLAYER_ONE);
    const ids = g.getCardInstanceIdsInZone("play", PLAYER_ONE).filter((id) => id !== sourceId);
    expect(g.asPlayerOne().playSongTogether(song, ids)).toBeSuccessfulCommand();
    drain(g);
    expect(g.getLore(PLAYER_ONE)).toBe(1);
  });
});

describe("promotion review: deferred choices and ownership", () => {
  it("blocked lore does not consume once and succeeds after the source leaves", () => {
    const source = limited({ type: "gain-lore", amount: 1, target: "CONTROLLER" });
    const blocker = createMockCharacter({
      id: "review-blocker",
      name: "Blocker",
      cost: 0,
      abilities: [
        {
          type: "static",
          effect: { type: "restriction", restriction: "cant-gain-lore", target: "OPPONENTS" },
        },
      ],
    });
    const remove = createMockAction({
      id: "review-remove",
      name: "Remove",
      cost: 0,
      abilities: [{ type: "action", effect: { type: "banish", target: "CHOSEN_CHARACTER" } }],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [...songs, remove], play: [source] },
      { play: [blocker] },
    );
    expect(g.asPlayerOne().playCard(songs[0]!)).toBeSuccessfulCommand();
    drain(g);
    expect(g.getLore(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().playCard(remove, { targets: [blocker] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(songs[1]!)).toBeSuccessfulCommand();
    drain(g);
    expect(g.getLore(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().playCard(songs[2]!)).toBeSuccessfulCommand();
    drain(g);
    expect(g.getLore(PLAYER_ONE)).toBe(1);
  });
  it("staged distinct target prompts preserve the once ledger", () => {
    const source = limited({
      type: "sequence",
      steps: [
        {
          type: "modify-stat",
          stat: "strength",
          modifier: 1,
          duration: "this-turn",
          target: {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        {
          type: "modify-stat",
          stat: "strength",
          modifier: 1,
          duration: "this-turn",
          target: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: songs, play: [source, guest] },
      { play: [guest] },
    );
    const own = g.findCardInstanceId(guest, "play", PLAYER_ONE);
    const opposing = g.findCardInstanceId(guest, "play", PLAYER_TWO);
    expect(g.asPlayerOne().playCard(songs[0]!)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolvePendingByCard(source, {})).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolveNextPending({ targets: [own] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolveNextPending({ targets: [opposing] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(own)).toBe(2);
    expect(g.asPlayerOne().getCardStrength(opposing)).toBe(2);
    expect(g.asPlayerOne().playCard(songs[1]!)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });
  it("a controller can choose an opponent's discard when the effect assigns that choice", () => {
    const action = createMockAction({
      id: "review-controller-discard",
      name: "Chosen Discard",
      cost: 0,
      abilities: [
        {
          type: "action",
          effect: {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "discard",
              amount: 1,
              target: "OPPONENT",
              chosen: true,
              chosenBy: "you",
            },
          },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [action, guest] },
      { hand: [guest] },
    );
    const own = g.findCardInstanceId(guest, "hand", PLAYER_ONE),
      enemy = g.findCardInstanceId(guest, "hand", PLAYER_TWO);
    expect(g.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({ resolveOptional: true, targets: [own] }),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({ resolveOptional: true, targets: [enemy] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(enemy)).toBe("discard");
    expect(g.asPlayerOne().getCardZone(own)).toBe("hand");
  });
});
