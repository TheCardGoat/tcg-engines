import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { evasive } from "../../../helpers/abilities/evasive";
import { cruellaDeVilDodgingTraffic } from "./113-cruella-de-vil-dodging-traffic";

const defender = createMockCharacter({
  id: "cruella-traffic-defender",
  name: "Defender",
  cost: 3,
  strength: 1,
  willpower: 4,
});

describe("Cruella De Vil - Dodging Traffic", () => {
  // CR 8.9.1: Rush changes challenge drying eligibility only.
  it("has Rush and can challenge the turn she is played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cruellaDeVilDodgingTraffic],
        inkwell: cruellaDeVilDodgingTraffic.cost,
      },
      {
        play: [{ card: defender, exerted: true }],
      },
    );

    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: cruellaDeVilDodgingTraffic,
      keyword: "Rush",
    });

    expect(testEngine.asPlayerOne().playCard(cruellaDeVilDodgingTraffic)).toBeSuccessfulCommand();
    expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);
    expect(testEngine.asPlayerOne().quest(cruellaDeVilDodgingTraffic)).not.toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().challenge(cruellaDeVilDodgingTraffic, defender),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(defender)).toBe("discard");
    expect(testEngine.asPlayerOne().getDamage(cruellaDeVilDodgingTraffic)).toBe(1);
    expect(testEngine.asPlayerOne().isExerted(cruellaDeVilDodgingTraffic)).toBe(true);
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });

  it("deals five damage and cannot challenge again while exerted", () => {
    const sturdy = createMockCharacter({
      id: "cruella-sturdy",
      name: "Sturdy",
      cost: 1,
      strength: 1,
      willpower: 20,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [cruellaDeVilDodgingTraffic], inkwell: 6 },
      { play: [{ card: sturdy, exerted: true }] },
    );
    expect(game.asPlayerOne().playCard(cruellaDeVilDodgingTraffic)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().challenge(cruellaDeVilDodgingTraffic, sturdy),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getDamage(sturdy)).toBe(5);
    expect(
      game.asPlayerOne().challenge(cruellaDeVilDodgingTraffic, sturdy),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getDamage(sturdy)).toBe(5);
  });

  it("cannot challenge a ready defender despite Rush", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [cruellaDeVilDodgingTraffic], inkwell: 6 },
      { play: [defender] },
    );
    expect(game.asPlayerOne().playCard(cruellaDeVilDodgingTraffic)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().challenge(cruellaDeVilDodgingTraffic, defender),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(cruellaDeVilDodgingTraffic)).toBe(false);
    expect(game.asPlayerTwo().getDamage(defender)).toBe(0);
  });

  it("cannot challenge an Evasive defender with Rush alone", () => {
    const flyer = createMockCharacter({
      id: "cruella-flyer",
      name: "Flyer",
      cost: 1,
      strength: 1,
      willpower: 10,
      abilities: [evasive],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [cruellaDeVilDodgingTraffic], inkwell: 6 },
      { play: [{ card: flyer, exerted: true }] },
    );
    expect(game.asPlayerOne().playCard(cruellaDeVilDodgingTraffic)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().challenge(cruellaDeVilDodgingTraffic, flyer),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(cruellaDeVilDodgingTraffic)).toBe(false);
    expect(game.asPlayerTwo().getDamage(flyer)).toBe(0);
  });

  it("retains printed Rush after the turn and can quest for two when dry", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [cruellaDeVilDodgingTraffic], inkwell: 6, deck: 3 },
      { deck: 3 },
    );
    expect(game.asPlayerOne().playCard(cruellaDeVilDodgingTraffic)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().hasKeyword(cruellaDeVilDodgingTraffic, "Rush")).toBe(true);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(cruellaDeVilDodgingTraffic)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(2);
  });

  it("rejects insufficient payment without spending ink or playing", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cruellaDeVilDodgingTraffic],
      inkwell: 5,
    });
    expect(game.asPlayerOne().playCard(cruellaDeVilDodgingTraffic)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(cruellaDeVilDodgingTraffic)).toBe("hand");
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(5);
  });

  it("cannot be put into the inkwell", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cruellaDeVilDodgingTraffic],
    });
    expect(
      game.asPlayerOne().putIntoInkwell(PLAYER_ONE, cruellaDeVilDodgingTraffic),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(cruellaDeVilDodgingTraffic)).toBe("hand");
  });
});

it("player two can Rush into fatal combat and still deals printed damage before banishment", () => {
  const fatalDefender = createMockCharacter({
    id: "cruella-fatal",
    name: "Fatal Defender",
    cost: 1,
    strength: 20,
    willpower: 20,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [fatalDefender], inkwell: 6, deck: 6 },
    { hand: [cruellaDeVilDodgingTraffic], inkwell: 6, deck: 6 },
  );
  expect(game.asPlayerOne().quest(fatalDefender)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(cruellaDeVilDodgingTraffic)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk("player_two")).toBe(0);
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(6);
  expect(game.asPlayerTwo().quest(cruellaDeVilDodgingTraffic)).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().challenge(cruellaDeVilDodgingTraffic, fatalDefender),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(cruellaDeVilDodgingTraffic)).toBe("discard");
  expect(game.asPlayerOne().getCardZone(fatalDefender)).toBe("play");
  expect(game.asPlayerOne().getDamage(fatalDefender)).toBe(5);
  expect(
    game.asPlayerTwo().challenge(cruellaDeVilDodgingTraffic, fatalDefender),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getDamage(fatalDefender)).toBe(5);
  expect(game.getLore("player_two")).toBe(0);
});
