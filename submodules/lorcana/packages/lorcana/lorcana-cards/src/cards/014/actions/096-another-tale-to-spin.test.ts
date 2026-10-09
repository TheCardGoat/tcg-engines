import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { aladdinPrinceAli } from "../../001/characters/069-aladdin-prince-ali";
import { fruFruVipGuest } from "../characters/001-fru-fru-vip-guest";
import { anotherTaleToSpin } from "./096-another-tale-to-spin";

const drawn = createMockCharacter({ id: "tale-drawn", name: "Drawn", cost: 1 });
const bottom = createMockCharacter({ id: "tale-bottom", name: "Bottom", cost: 1 });

describe("Another Tale to Spin", () => {
  it("draws exactly the top card only for you and adds one to both existing pools", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [anotherTaleToSpin], inkwell: 2, deck: [bottom, drawn], inkDrops: 2 },
      { hand: [bottom], deck: 6, inkDrops: 3 },
    );
    const bottomId = game.findCardInstanceId(bottom, "deck", PLAYER_ONE);
    expect(
      game.asPlayerOne().playCard(anotherTaleToSpin, { targets: [PLAYER_TWO] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(drawn)).toBe("hand");
    expect(game.asPlayerOne().getCardZone(bottomId)).toBe("deck");
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(1);
    expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(1);
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(6);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(4);
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getCardZone(anotherTaleToSpin)).toBe("discard");
  });

  it("rejects yourself, an unknown player and multiple selections before paying or drawing", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [anotherTaleToSpin], inkwell: 2, deck: [bottom, drawn] },
      { deck: 6 },
    );
    for (const targets of [
      [PLAYER_ONE],
      ["not-a-player"],
      [PLAYER_ONE, PLAYER_TWO],
      [PLAYER_TWO, PLAYER_TWO],
    ]) {
      expect(
        game.asPlayerOne().playCard(anotherTaleToSpin, { targets }),
      ).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
      expect(game.asPlayerOne().getCardZone(anotherTaleToSpin)).toBe("hand");
      expect(game.asPlayerOne().getCardZone(drawn)).toBe("deck");
      expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
      expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
    }
    expect(
      game.asPlayerOne().playCard(anotherTaleToSpin, { targets: [PLAYER_TWO] }),
    ).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
  });

  it("can be sung by a cost-two character at zero bank ink", () => {
    const singer = createMockCharacter({ id: "tale-singer-two", name: "Singer", cost: 2 });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [anotherTaleToSpin], play: [singer], deck: [drawn] },
      { deck: 6 },
    );
    const id = game.findCardInstanceId(singer, "play", PLAYER_ONE);
    expect(
      game
        .asPlayerOne()
        .playCard(anotherTaleToSpin, { cost: { cost: "sing", singer: id }, targets: [PLAYER_TWO] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(singer)).toBe(true);
    expect(game.asPlayerOne().getCardZone(drawn)).toBe("hand");
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
  });

  it("rejects cost-one, drying and exerted singers without rewards", () => {
    for (const [cost, isDrying, exerted] of [
      [1, false, false],
      [2, true, false],
      [2, false, true],
    ] as const) {
      const singer = createMockCharacter({
        id: `tale-singer-${cost}-${isDrying}-${exerted}`,
        name: "Singer",
        cost,
      });
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [anotherTaleToSpin], play: [{ card: singer, isDrying, exerted }], deck: [drawn] },
        { deck: 6 },
      );
      const id = game.findCardInstanceId(singer, "play", PLAYER_ONE);
      expect(
        game.asPlayerOne().playCard(anotherTaleToSpin, {
          cost: { cost: "sing", singer: id },
          targets: [PLAYER_TWO],
        }),
      ).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().isExerted(singer)).toBe(exerted);
      expect(game.asPlayerOne().getCardZone(drawn)).toBe("deck");
      expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
      expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
    }
  });

  it("adds a draw and one drop to each pool on every independent play", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [anotherTaleToSpin, anotherTaleToSpin], inkwell: 4, deck: [bottom, drawn] },
      { deck: 6 },
    );
    const copies = game.getCardInstanceIdsInZone("hand", PLAYER_ONE);
    for (const [i, copy] of copies.entries()) {
      expect(game.asPlayerOne().playCard(copy, { targets: [PLAYER_TWO] })).toBeSuccessfulCommand();
      expect(game.getInkDrops(PLAYER_ONE)).toBe(i + 1);
      expect(game.getInkDrops(PLAYER_TWO)).toBe(i + 1);
      expect(game.asPlayerOne().getZonesCardCount().deck).toBe(1 - i);
    }
  });

  it("cannot fund its cost with its future ink drop", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [anotherTaleToSpin], inkwell: 1, deck: [drawn] },
      { deck: 6 },
    );
    expect(
      game.asPlayerOne().playCard(anotherTaleToSpin, { targets: [PLAYER_TWO] }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerOne().getCardZone(drawn)).toBe("deck");
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  });

  it("uses two saved drops for payment and the new drop can pay for the drawn character", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [anotherTaleToSpin], inkDrops: 2, deck: [drawn] },
      { inkDrops: 3, deck: 6 },
    );
    expect(
      game.asPlayerOne().playCard(anotherTaleToSpin, { targets: [PLAYER_TWO], inkDrops: 2 }),
    ).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(4);
    expect(game.asPlayerOne().playCard(drawn, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("both rewards persist across valid turn transitions", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [anotherTaleToSpin], inkwell: 2, deck: 6 },
      { deck: 6 },
    );
    expect(
      game.asPlayerOne().playCard(anotherTaleToSpin, { targets: [PLAYER_TWO] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
  });

  it("awards both drops with an empty deck and loses at the turn boundary", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [anotherTaleToSpin], inkwell: 2, deck: [] },
      { deck: 6 },
    );
    expect(
      game.asPlayerOne().playCard(anotherTaleToSpin, { targets: [PLAYER_TWO] }),
    ).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(game.asPlayerOne().hasGameEnded()).toBe(false);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asServer().getWinner()).toBe(PLAYER_TWO);
  });

  it("is inkable", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [anotherTaleToSpin] });
    expect(game.asPlayerOne().ink(anotherTaleToSpin)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(anotherTaleToSpin)).toBe("inkwell");
  });
});

it("player two must choose player one and draws privately from their own deck", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6, inkDrops: 3 },
    { hand: [anotherTaleToSpin], deck: [bottom, drawn, bottom], inkDrops: 2 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const top = game.findCardInstanceId(drawn, "deck", PLAYER_TWO);
  const opponentDeck = game.getCardInstanceIdsInZone("deck", PLAYER_ONE);
  expect(
    game.asPlayerTwo().playCard(anotherTaleToSpin, { targets: [PLAYER_TWO], inkDrops: 2 }),
  ).not.toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
  expect(game.asPlayerTwo().getCardZone(top)).toBe("deck");
  expect(
    game.asPlayerTwo().playCard(anotherTaleToSpin, { targets: [PLAYER_ONE], inkDrops: 2 }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(top)).toBe("hand");
  expect(game.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(opponentDeck);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
  const log = JSON.stringify(
    game
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .flatMap((entry) => entry.public),
  );
  expect(log).not.toContain(top);
});

for (const caster of [PLAYER_ONE, PLAYER_TWO, "player_three"]) {
  it(`three-player ${caster} gives drops only to each chosen player and retains rewards`, () => {
    const players = [PLAYER_ONE, PLAYER_TWO, "player_three"];
    const fixture = {
      hand: [anotherTaleToSpin, anotherTaleToSpin, fruFruVipGuest],
      play: [aladdinPrinceAli],
      deck: 8,
      inkDrops: 2,
    };
    const game = LorcanaMultiplayerTestEngine.createWithFixture(fixture, fixture, {
      additionalPlayers: { player_three: fixture },
    });
    for (const player of players.slice(0, players.indexOf(caster)))
      expect(game.asLorcanaPlayer(player).passTurn()).toBeSuccessfulCommand();
    const client = game.asLorcanaPlayer(caster);
    const [first, second] = game.getCardInstanceIdsInZone("hand", caster).slice(0, 2);
    const others = players.filter((player) => player !== caster);
    const counts = Object.fromEntries(
      players.map((player) => [player, game.asLorcanaPlayer(player).getZonesCardCount().deck]),
    );
    expect(client.playCard(first!, { targets: [caster], inkDrops: 2 })).not.toBeSuccessfulCommand();
    expect(client.playCard(first!, { targets: others, inkDrops: 2 })).not.toBeSuccessfulCommand();
    expect(game.getInkDrops(caster)).toBe(2);
    expect(client.getCardZone(first!)).toBe("hand");
    expect(client.getZonesCardCount().deck).toBe(counts[caster]);
    expect(client.playCard(first!, { targets: [others[0]!], inkDrops: 2 })).toBeSuccessfulCommand();
    expect(game.getInkDrops(caster)).toBe(1);
    expect(game.getInkDrops(others[0]!)).toBe(3);
    expect(game.getInkDrops(others[1]!)).toBe(2);
    const singer = game.findCardInstanceId(aladdinPrinceAli, "play", caster)!;
    expect(
      client.playCard(second!, { targets: [others[1]!], cost: { cost: "sing", singer } }),
    ).toBeSuccessfulCommand();
    expect(client.isExerted(singer)).toBe(true);
    expect(client.getZonesCardCount().deck).toBe(counts[caster]! - 2);
    expect(client.getAvailableInk(caster)).toBe(0);
    for (const player of others) {
      expect(game.getInkDrops(player)).toBe(3);
      expect(game.asLorcanaPlayer(player).getZonesCardCount().deck).toBe(counts[player]);
    }
    expect(game.getInkDrops(caster)).toBe(2);
    const order = [
      ...players.slice(players.indexOf(caster)),
      ...players.slice(0, players.indexOf(caster)),
    ];
    for (const player of order)
      expect(game.asLorcanaPlayer(player).passTurn()).toBeSuccessfulCommand();
    expect(game.getInkDrops(caster)).toBe(2);
    for (const player of others) expect(game.getInkDrops(player)).toBe(3);
    expect(
      client.playCard(game.findCardInstanceId(fruFruVipGuest, "hand", caster)!, { inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    expect(game.getInkDrops(caster)).toBe(1);
    for (const player of others) expect(game.getInkDrops(player)).toBe(3);
  });
}
