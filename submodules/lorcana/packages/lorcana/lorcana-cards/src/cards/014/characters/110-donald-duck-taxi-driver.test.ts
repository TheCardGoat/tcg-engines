import { describe, expect, it } from "bun:test";
// CR 8.9.1: Rush permits challenges while drying; it does not permit questing.
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockLocation,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { donaldDuckTaxiDriver } from "./110-donald-duck-taxi-driver";

const freshPassenger = createMockCharacter({
  id: "donald-fresh-passenger",
  name: "Fresh Passenger",
  cost: 1,
  strength: 3,
  willpower: 4,
});

const defender = createMockCharacter({
  id: "donald-defender",
  name: "Defender",
  cost: 2,
  strength: 1,
  willpower: 4,
});

describe("Donald Duck - Taxi Driver", () => {
  it("rejects insufficient payment without playing or creating a trigger", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [donaldDuckTaxiDriver],
      inkwell: 2,
    });
    expect(game.asPlayerOne().playCard(donaldDuckTaxiDriver)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(donaldDuckTaxiDriver)).toBe("hand");
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(game.asPlayerOne().getBagEffects()).toHaveLength(0);
  });

  it("grants Rush to exactly one chosen character without readying it", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [donaldDuckTaxiDriver],
        inkwell: 3,
        play: [{ card: freshPassenger, exerted: true }],
      },
      { play: [{ card: defender, exerted: true }] },
    );
    expect(game.asPlayerOne().playCard(donaldDuckTaxiDriver)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(donaldDuckTaxiDriver, {
        targets: [donaldDuckTaxiDriver, freshPassenger],
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(donaldDuckTaxiDriver, {
        targets: [freshPassenger],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().hasKeyword(freshPassenger, "Rush")).toBe(true);
    expect(game.asPlayerOne().hasKeyword(donaldDuckTaxiDriver, "Rush")).toBe(false);
    expect(game.asPlayerOne().isExerted(freshPassenger)).toBe(true);
    expect(game.asPlayerOne().challenge(freshPassenger, defender)).not.toBeSuccessfulCommand();
  });
  it("a character played this turn can challenge after gaining Rush", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [donaldDuckTaxiDriver, freshPassenger],
        inkwell: 4,
      },
      {
        play: [{ card: defender, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().playCard(freshPassenger)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(donaldDuckTaxiDriver)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(donaldDuckTaxiDriver, {
        targets: [freshPassenger],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: freshPassenger,
      keyword: "Rush",
    });
    expect(testEngine.asPlayerOne().quest(freshPassenger)).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().challenge(freshPassenger, defender)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getDamage(defender)).toBe(3);
    expect(testEngine.asPlayerOne().getDamage(freshPassenger)).toBe(1);
    expect(testEngine.asPlayerOne().isExerted(freshPassenger)).toBe(true);
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });

  it("without the Rush grant a just-played character cannot challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [freshPassenger],
        inkwell: 1,
      },
      {
        play: [{ card: defender, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne().playCard(freshPassenger)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().challenge(freshPassenger, defender),
    ).not.toBeSuccessfulCommand();
  });

  it("the granted Rush expires at the end of the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [donaldDuckTaxiDriver, freshPassenger],
        inkwell: 4,
        deck: 3,
      },
      {
        play: [{ card: defender, exerted: true }],
        deck: 3,
      },
    );

    expect(testEngine.asPlayerOne().playCard(freshPassenger)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(donaldDuckTaxiDriver)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(donaldDuckTaxiDriver, {
        targets: [freshPassenger],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(freshPassenger, "Rush")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(freshPassenger, "Rush")).toBe(false);
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(freshPassenger)).toBeSuccessfulCommand();
  });

  it("can choose Donald himself and deal his printed four challenge damage", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [donaldDuckTaxiDriver], inkwell: 3 },
      { play: [{ card: defender, exerted: true }] },
    );
    expect(game.asPlayerOne().playCard(donaldDuckTaxiDriver)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(
      game.asPlayerOne().resolvePendingByCard(donaldDuckTaxiDriver, {
        targets: [donaldDuckTaxiDriver],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(donaldDuckTaxiDriver)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().challenge(donaldDuckTaxiDriver, defender)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(defender)).toBe("discard");
    expect(game.asPlayerOne().getDamage(donaldDuckTaxiDriver)).toBe(1);
  });

  it("can grant Rush to an opponent without changing its controller", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [donaldDuckTaxiDriver], inkwell: 3, deck: 3 },
      { play: [freshPassenger], deck: 3 },
    );
    expect(game.asPlayerOne().playCard(donaldDuckTaxiDriver)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(donaldDuckTaxiDriver, {
        targets: [freshPassenger],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().hasKeyword(freshPassenger, "Rush")).toBe(true);
    expect(game.asPlayerOne().hasKeyword(donaldDuckTaxiDriver, "Rush")).toBe(false);
    expect(game.asPlayerOne().quest(freshPassenger)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().hasKeyword(freshPassenger, "Rush")).toBe(false);
  });

  it("rejects non-character and hidden-zone targets, then allows a valid retry", () => {
    const item = createMockItem({ id: "taxi-item", name: "Item", cost: 1 });
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [donaldDuckTaxiDriver, freshPassenger],
      play: [item],
      inkwell: 3,
    });
    expect(game.asPlayerOne().playCard(donaldDuckTaxiDriver)).toBeSuccessfulCommand();
    for (const target of [item, freshPassenger]) {
      expect(
        game.asPlayerOne().resolvePendingByCard(donaldDuckTaxiDriver, {
          targets: [target],
        }),
      ).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().hasKeyword(donaldDuckTaxiDriver, "Rush")).toBe(false);
    }
    expect(
      game.asPlayerOne().resolvePendingByCard(donaldDuckTaxiDriver, {
        targets: [donaldDuckTaxiDriver],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().hasKeyword(donaldDuckTaxiDriver, "Rush")).toBe(true);
  });

  it("Rush does not permit challenging a ready defender", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [donaldDuckTaxiDriver], inkwell: 3 },
      { play: [defender] },
    );
    expect(game.asPlayerOne().playCard(donaldDuckTaxiDriver)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(donaldDuckTaxiDriver, {
        targets: [donaldDuckTaxiDriver],
      }),
    ).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().challenge(donaldDuckTaxiDriver, defender),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(donaldDuckTaxiDriver)).toBe(false);
    expect(game.asPlayerTwo().getDamage(defender)).toBe(0);
  });
});

it("player two chooses their own fresh passenger and the opponent cannot resolve Rush", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [defender], deck: 6 },
    { hand: [freshPassenger, donaldDuckTaxiDriver], inkwell: 4, deck: 6 },
  );
  expect(game.asPlayerOne().quest(defender)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(freshPassenger)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(donaldDuckTaxiDriver)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(donaldDuckTaxiDriver, { targets: [freshPassenger] }),
  ).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().resolvePendingByCard(donaldDuckTaxiDriver, { targets: [freshPassenger] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().hasKeyword(freshPassenger, "Rush")).toBe(true);
  expect(game.asPlayerTwo().hasKeyword(donaldDuckTaxiDriver, "Rush")).toBe(false);
  expect(game.asPlayerTwo().quest(freshPassenger)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().challenge(freshPassenger, defender)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getDamage(defender)).toBe(3);
  expect(game.asPlayerTwo().getDamage(freshPassenger)).toBe(1);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().hasKeyword(freshPassenger, "Rush")).toBe(false);
});

it("Player Two retries invalid choices, resolves three exact Donald copies and keeps native Rush at expiry", () => {
  const item = createMockItem({ id: "taxi-p2-item", name: "Item", cost: 1 });
  const place = createMockLocation({ id: "taxi-p2-location", name: "Location", cost: 1, lore: 0 });
  const ward = createMockCharacter({
    id: "taxi-p2-ward",
    name: "Ward",
    cost: 1,
    abilities: [{ type: "keyword", keyword: "Ward" }],
  });
  const native = createMockCharacter({
    id: "taxi-p2-rush",
    name: "Native Rush",
    cost: 1,
    abilities: [{ type: "keyword", keyword: "Rush" }],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [ward, { card: defender, exerted: true }], inkDrops: 4, deck: 8 },
    {
      hand: [
        donaldDuckTaxiDriver,
        donaldDuckTaxiDriver,
        donaldDuckTaxiDriver,
        freshPassenger,
        freshPassenger,
      ],
      play: [ward, native, item, place],
      discard: [freshPassenger],
      inkDrops: 10,
      deck: 8,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const p2 = game.asPlayerTwo();
  const copies = game
    .getCardInstanceIdsInZone("hand", PLAYER_TWO)
    .filter((id) => p2.getCardDefinitionByInstanceId(id).id === donaldDuckTaxiDriver.id);
  expect(
    p2.playCard(game.findCardInstanceId(freshPassenger, "hand", PLAYER_TWO)!, { inkDrops: 1 }),
  ).toBeSuccessfulCommand();
  const passenger = game.findCardInstanceId(freshPassenger, "play", PLAYER_TWO)!;
  const ownWard = game.findCardInstanceId(ward, "play", PLAYER_TWO)!;
  const enemyWard = game.findCardInstanceId(ward, "play", PLAYER_ONE)!;
  const nativeId = game.findCardInstanceId(native, "play", PLAYER_TWO)!;
  const enemyDefender = game.findCardInstanceId(defender, "play", PLAYER_ONE)!;
  expect(p2.playCard(copies[0]!, { inkDrops: 3 })).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(copies[0]!, { targets: [passenger] }),
  ).not.toBeSuccessfulCommand();
  for (const targets of [
    [],
    [item],
    [place],
    [enemyWard],
    [game.findCardInstanceId(freshPassenger, "hand", PLAYER_TWO)!],
    [game.findCardInstanceId(freshPassenger, "discard", PLAYER_TWO)!],
    [passenger, nativeId],
  ]) {
    expect(p2.resolvePendingByCard(copies[0]!, { targets })).not.toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(6);
    expect(p2.getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(p2).not.toHaveKeyword({ card: passenger, keyword: "Rush" });
  }
  expect(p2.resolvePendingByCard(copies[0]!, { targets: [passenger] })).toBeSuccessfulCommand();
  expect(p2).toHaveKeyword({ card: passenger, keyword: "Rush" });
  expect(p2).not.toHaveKeyword({ card: copies[0]!, keyword: "Rush" });
  expect(p2.quest(passenger)).not.toBeSuccessfulCommand();
  expect(p2.challenge(passenger, enemyDefender)).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toHaveDamage({ card: enemyDefender, value: 3 });
  expect(p2).toHaveDamage({ card: passenger, value: 1 });
  expect(p2.playCard(copies[1]!, { inkDrops: 3 })).toBeSuccessfulCommand();
  expect(p2.resolvePendingByCard(copies[1]!, { targets: [ownWard] })).toBeSuccessfulCommand();
  expect(p2).toHaveKeyword({ card: ownWard, keyword: "Rush" });
  expect(game.asPlayerOne()).not.toHaveKeyword({ card: enemyWard, keyword: "Rush" });
  expect(p2.playCard(copies[2]!, { inkDrops: 3 })).toBeSuccessfulCommand();
  expect(p2.resolvePendingByCard(copies[2]!, { targets: [nativeId] })).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
  expect(p2).toHaveKeyword({ card: nativeId, keyword: "Rush" });
  expect(p2.passTurn()).toBeSuccessfulCommand();
  expect(p2).not.toHaveKeyword({ card: passenger, keyword: "Rush" });
  expect(p2).not.toHaveKeyword({ card: ownWard, keyword: "Rush" });
  expect(p2).toHaveKeyword({ card: nativeId, keyword: "Rush" });
  expect(p2).toHaveDamage({ card: passenger, value: 1 });
  expect(p2.getZonesCardCount().hand).toBe(2);
});
