// CR 2.2.0: 6.2.1–6.2.3 (entry trigger), 6.7.2.3 (resolve as much as possible),
// 5.4.4.2 and 8.11.1–8.11.2 (song payment and Singer).
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { hesATramp } from "../../007/actions/117-hes-a-tramp";
import { hctorRiveraStreetMusician as hector } from "./117-hector-rivera-street-musician";
const bottom = createMockCharacter({ id: "street-bottom", name: "Bottom", cost: 1 });
const middle = createMockCharacter({ id: "street-middle", name: "Middle", cost: 1 });
const top = createMockCharacter({ id: "street-top", name: "Top", cost: 1 });
const song = (cost: number) =>
  createMockSong({
    id: `street-song-${cost}`,
    name: `Song ${cost}`,
    cost,
    text: "Gain 2 lore.",
    abilities: [{ type: "action", effect: { type: "gain-lore", amount: 2, target: "CONTROLLER" } }],
  });
const two = song(2);
const three = song(3);
describe("Héctor Rivera - Street Musician", () => {
  it("accepting discards exactly the top card and preserves the next draw", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [hector], inkwell: 1, deck: [bottom, middle, top] },
      { deck: 6 },
    );
    expect(game.asPlayerOne().playCard(hector)).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getCardZone(top)).toBe("deck");
    expect(
      game.asPlayerOne().resolvePendingByCard(hector, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(game.asServer().getCardZone(top)).toBe("discard");
    expect(game.asServer().getCardZone(middle)).toBe("deck");
    expect(game.asPlayerOne().getZonesCardCount().discard).toBe(1);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asServer().getCardZone(middle)).toBe("hand");
    expect(game.asServer().getCardZone(bottom)).toBe("deck");
  });
  it("declining leaves the top card for the next draw", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [hector], inkwell: 1, deck: [bottom, top] },
      { deck: 6 },
    );
    expect(game.asPlayerOne().playCard(hector)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(hector, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(game.asServer().getCardZone(top)).toBe("deck");
    expect(game.asPlayerOne().getZonesCardCount().discard).toBe(0);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asServer().getCardZone(top)).toBe("hand");
  });
  it("accepting on an empty deck neither draws nor loses the game", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [hector], inkwell: 1, deck: [] },
      { deck: 6 },
    );
    expect(game.asPlayerOne().playCard(hector)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(hector, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getZonesCardCount().discard).toBe(0);
    expect(game.asPlayerOne().quest(hector)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(hector)).toBe("play");
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  });
  it("opponent's Héctor mills only the opponent's deck", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: [bottom, middle] },
      { hand: [hector], inkwell: 1, deck: [top, middle] },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(hector)).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().resolvePendingByCard(hector, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(2);
    expect(game.asPlayerOne().getZonesCardCount().discard).toBe(0);
    expect(game.asPlayerTwo().getZonesCardCount().discard).toBe(1);
    expect(game.asPlayerTwo().getCardZone(top)).toBe("discard");
  });
  it("two copies each offer an independent choice", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hector, hector],
      inkwell: 2,
      deck: [bottom, middle, top],
    });
    const ids = game.getCardInstanceIdsInZone("hand", PLAYER_ONE);
    expect(game.asPlayerOne().playCard(ids[0]!)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(ids[0]!, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(ids[1]!)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(ids[1]!, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(game.asServer().getCardZone(top)).toBe("discard");
    expect(game.asServer().getCardZone(middle)).toBe("deck");
    expect(game.asPlayerOne().getZonesCardCount().discard).toBe(1);
  });
  it("insufficient payment creates no entry effect", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [hector], deck: [top] });
    expect(game.asPlayerOne().playCard(hector)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(hector)).toBe("hand");
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(game.asServer().getCardZone(top)).toBe("deck");
  });
  it.each([1, 2])("Singer 2 sings cost %s at zero ink without milling", (cost: number) => {
    const chosen = song(cost);
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [hector],
      hand: [chosen],
      deck: [top],
    });
    expect(game.asPlayerOne().singSong(chosen, hector)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(hector)).toBe(true);
    expect(game.asPlayerOne().getCardZone(chosen)).toBe("discard");
    expect(game.getLore(PLAYER_ONE)).toBe(2);
    expect(game.asServer().getCardZone(top)).toBe("deck");
  });
  it("rejects cost three despite available ink and preserves a legal sing", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [hector],
      hand: [two, three],
      inkwell: 3,
    });
    expect(game.asPlayerOne().singSong(three, hector)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(three)).toBe("hand");
    expect(game.asPlayerOne().isExerted(hector)).toBe(false);
    expect(game.asPlayerOne().singSong(two, hector)).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(3);
  });
  it.each([{ isDrying: true }, { exerted: true }])(
    "rejects an unavailable singer %j",
    (state: { isDrying?: boolean; exerted?: boolean }) => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: hector, ...state }],
        hand: [two],
      });
      expect(game.asPlayerOne().singSong(two, hector)).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(two)).toBe("hand");
      expect(game.getLore(PLAYER_ONE)).toBe(0);
    },
  );
  it("rejects opposing singer", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [two] },
      { play: [hector] },
    );
    const enemy = game.findCardInstanceId(hector, "play", PLAYER_TWO);
    expect(game.asPlayerOne().singSong(two, enemy)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().isExerted(enemy)).toBe(false);
  });
  it("player two sings with its own Héctor without spending either player's ink or milling", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [hector], inkwell: 3, lore: 4, deck: [bottom, middle] },
      { play: [hector], hand: [two, three], inkwell: 3, lore: 7, deck: [bottom, middle, top] },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const own = game.findCardInstanceId(hector, "play", PLAYER_TWO);
    const enemy = game.findCardInstanceId(hector, "play", PLAYER_ONE);
    expect(game.asPlayerTwo().singSong(two, enemy)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().singSong(three, own)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().isExerted(own)).toBe(false);
    expect(game.asPlayerTwo().singSong(two, own)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().isExerted(own)).toBe(true);
    expect(game.asPlayerOne().isExerted(enemy)).toBe(false);
    expect(game.getLore(PLAYER_TWO)).toBe(9);
    expect(game.getLore(PLAYER_ONE)).toBe(4);
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(game.asServer().getAvailableInk(PLAYER_TWO)).toBe(3);
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(2);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(2);
    expect(game.asPlayerTwo().getCardZone(three)).toBe("hand");
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });
  it("quest gains one lore without milling or triggering", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({ play: [hector], deck: [top] });
    expect(game.asPlayerOne().quest(hector)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(1);
    expect(game.asServer().getCardZone(top)).toBe("deck");
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });
});

it.each([PLAYER_ONE, PLAYER_TWO])(
  "sings real cost-one song with exact own Hector in seat %s without re-triggering entry",
  (owner: typeof PLAYER_ONE | typeof PLAYER_TWO) => {
    const other = owner === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
    const own = { play: [hector, bottom], hand: [hesATramp], inkDrops: 4, deck: 6 };
    const opponent = { play: [hector], inkDrops: 3, deck: 6 };
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      owner === PLAYER_ONE ? own : opponent,
      owner === PLAYER_TWO ? own : opponent,
    );
    if (owner === PLAYER_TWO) expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const client = game.asLorcanaPlayer(owner);
    const singer = game.findCardInstanceId(hector, "play", owner)!;
    const wrongSinger = game.findCardInstanceId(hector, "play", other)!;
    const card = game.findCardInstanceId(hesATramp, "hand", owner)!;
    const before = client.getZonesCardCount();
    expect(
      client.playCard(card, { cost: { cost: "sing", singer: wrongSinger }, targets: [singer] }),
    ).not.toBeSuccessfulCommand();
    expect(client.isExerted(singer)).toBe(false);
    expect(
      client.playCard(card, { cost: { cost: "sing", singer }, targets: [singer] }),
    ).toBeSuccessfulCommand();
    expect(client.isExerted(singer)).toBe(true);
    expect(game.asLorcanaPlayer(other).isExerted(wrongSinger)).toBe(false);
    expect(client.getCardZone(card)).toBe("discard");
    expect(client.getCardStrength(singer)).toBe(4);
    expect(client.getZonesCardCount().deck).toBe(before.deck);
    expect(client.getZonesCardCount().discard).toBe(before.discard + 1);
    expect(client.getAvailableInk(owner)).toBe(0);
    expect(game.getInkDrops(owner)).toBe(4);
    expect(game.getInkDrops(other)).toBe(3);
    expect(client.getBagEffects()).toHaveLength(0);
    expect(client.passTurn()).toBeSuccessfulCommand();
    expect(client.getCardStrength(singer)).toBe(2);
  },
);
