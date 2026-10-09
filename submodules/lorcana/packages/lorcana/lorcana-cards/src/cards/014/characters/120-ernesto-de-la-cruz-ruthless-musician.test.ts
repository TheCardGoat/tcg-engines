// CR 2.2.0: 6.2 (on-play/optional triggers), 8.11.1–8.11.2 (Singer), 8.15.1 (Ward).
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { singer } from "../../../helpers/abilities/singer";
import { ernestoDeLaCruzRuthlessMusician as ernesto } from "./120-ernesto-de-la-cruz-ruthless-musician";
const victim = createMockCharacter({
  id: "ruthless-singer",
  name: "Singer Victim",
  cost: 2,
  abilities: [singer(2)],
});
const plain = createMockCharacter({ id: "ruthless-plain", name: "Plain Victim", cost: 2 });
const ward = createMockCharacter({
  id: "ruthless-ward",
  name: "Ward Singer",
  cost: 2,
  abilities: [singer(2), { type: "keyword", keyword: "Ward" }],
});
const song = (cost: number) =>
  createMockSong({
    id: "ruthless-song-" + cost,
    name: "Song " + cost,
    cost,
    text: "Gain 2 lore.",
    abilities: [{ type: "action", effect: { type: "gain-lore", amount: 2, target: "CONTROLLER" } }],
  });
describe("Ernesto de la Cruz - Ruthless Musician", () => {
  it.each([1, 2, 3, 4, 5, 6, 7, 8])(
    "Singer 8 pays cost %s at zero ink and resolves the song",
    (cost: number) => {
      const chosen = song(cost);
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [ernesto],
        hand: [chosen],
      });
      expect(game.asPlayerOne().singSong(chosen, ernesto)).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(chosen)).toBe("discard");
      expect(game.asPlayerOne().isExerted(ernesto)).toBe(true);
      expect(game.getLore(PLAYER_ONE)).toBe(2);
    },
  );
  it("rejects cost nine despite bank ink then sings eight without spending ink", () => {
    const eight = song(8),
      nine = song(9);
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ernesto],
      hand: [eight, nine],
      inkwell: 9,
    });
    expect(game.asPlayerOne().singSong(nine, ernesto)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(nine)).toBe("hand");
    expect(game.asPlayerOne().isExerted(ernesto)).toBe(false);
    expect(game.asPlayerOne().singSong(eight, ernesto)).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(9);
  });
  it.each([{ isDrying: true }, { exerted: true }])(
    "rejects unavailable singer %j",
    (state: { isDrying?: boolean; exerted?: boolean }) => {
      const eight = song(8);
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: ernesto, ...state }],
        hand: [eight],
      });
      expect(game.asPlayerOne().singSong(eight, ernesto)).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(eight)).toBe("hand");
      expect(game.getLore(PLAYER_ONE)).toBe(0);
    },
  );
  it("cannot use an opposing singer", () => {
    const eight = song(8);
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [eight] },
      { play: [ernesto] },
    );
    const enemy = game.findCardInstanceId(ernesto, "play", PLAYER_TWO);
    expect(game.asPlayerOne().singSong(eight, enemy)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().isExerted(enemy)).toBe(false);
  });
  it.each(["own", "opposing", "self", "own Ward"])(
    "banishes %s Singer on entry",
    (side: string) => {
      const own = side === "own" ? [victim] : side === "own Ward" ? [ward] : [];
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [ernesto], play: own, inkwell: 6 },
        { play: side === "opposing" ? [victim] : [] },
      );
      expect(game.asPlayerOne().playCard(ernesto)).toBeSuccessfulCommand();
      const target = side === "self" ? ernesto : side === "own Ward" ? ward : victim;
      expect(
        game
          .asPlayerOne()
          .resolvePendingByCard(ernesto, { resolveOptional: true, targets: [target] }),
      ).toBeSuccessfulCommand();
      expect(game.asServer().getCardZone(target)).toBe("discard");
      expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    },
  );
  it("declines without targets and retains every Singer", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [ernesto], play: [victim], inkwell: 6 },
      { play: [ward] },
    );
    expect(game.asPlayerOne().playCard(ernesto)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(ernesto, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(ernesto)).toBe("play");
    expect(game.asPlayerOne().getCardZone(victim)).toBe("play");
    expect(game.asPlayerTwo().getCardZone(ward)).toBe("play");
  });
  it("rejects non-Singer and opposing Ward then allows a legal retry", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [ernesto], inkwell: 6 },
      { play: [plain, ward, victim] },
    );
    expect(game.asPlayerOne().playCard(ernesto)).toBeSuccessfulCommand();
    for (const target of [plain, ward]) {
      expect(
        game
          .asPlayerOne()
          .resolvePendingByCard(ernesto, { resolveOptional: true, targets: [target] }),
      ).not.toBeSuccessfulCommand();
      expect(game.asPlayerTwo().getCardZone(target)).toBe("play");
    }
    expect(
      game
        .asPlayerOne()
        .resolvePendingByCard(ernesto, { resolveOptional: true, targets: [victim] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(victim)).toBe("discard");
  });
  it("rejects Singer in hand/discard and multiple targets with retry", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [ernesto, victim], discard: [ward], inkwell: 6 },
      { play: [victim] },
    );
    expect(game.asPlayerOne().playCard(ernesto)).toBeSuccessfulCommand();
    const hand = game.findCardInstanceId(victim, "hand", PLAYER_ONE),
      enemy = game.findCardInstanceId(victim, "play", PLAYER_TWO);
    for (const targets of [[hand], [ward], [ernesto, enemy]])
      expect(
        game.asPlayerOne().resolvePendingByCard(ernesto, { resolveOptional: true, targets }),
      ).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(ernesto, { resolveOptional: true, targets: [enemy] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(enemy)).toBe("discard");
    expect(game.asPlayerOne().getCardZone(hand)).toBe("hand");
  });
  it("normal six-ink play dries; later quest gains one without repeating entry", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [ernesto, song(8)], inkwell: 6, deck: 6 },
      { play: [victim], deck: 6 },
    );
    expect(game.asPlayerOne().playCard(ernesto)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(ernesto, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(ernesto)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().singSong(song(8), ernesto)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(ernesto)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerTwo().getCardZone(victim)).toBe("play");
  });
  it("five ink cannot play or create an entry trigger", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [ernesto], inkwell: 5 },
      { play: [victim] },
    );
    expect(game.asPlayerOne().playCard(ernesto)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(ernesto)).toBe("hand");
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(5);
  });
  it("player two controls its entry choice and can banish its own Ward Singer", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [ward, victim], inkwell: 6, deck: 6 },
      { hand: [ernesto], play: [ward], inkwell: 6, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(ernesto)).toBeSuccessfulCommand();
    const own = game.findCardInstanceId(ward, "play", PLAYER_TWO);
    const enemy = game.findCardInstanceId(ward, "play", PLAYER_ONE);
    expect(game.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(6);
    expect(
      game.asPlayerOne().resolvePendingByCard(ernesto, { resolveOptional: true, targets: [own] }),
    ).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().resolvePendingByCard(ernesto, { resolveOptional: true, targets: [enemy] }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(enemy)).toBe("play");
    expect(
      game.asPlayerTwo().resolvePendingByCard(ernesto, { resolveOptional: true, targets: [own] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(own)).toBe("discard");
    expect(game.asPlayerOne().getCardZone(victim)).toBe("play");
    expect(game.asPlayerTwo().getCardZone(ernesto)).toBe("play");
    expect(game.asPlayerTwo().quest(ernesto)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });
  it("can be inked without triggering entry", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [ernesto] },
      { play: [victim] },
    );
    expect(game.asPlayerOne().putIntoInkwell(PLAYER_ONE, ernesto)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(ernesto)).toBe("inkwell");
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });
});
