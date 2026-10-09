import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { centralStationTransportationHub } from "./203-central-station-transportation-hub";
import { hyperiaCityExpress } from "../items/201-hyperia-city-express";

const traveler = createMockCharacter({
  id: "central-station-traveler",
  name: "Central Station Traveler",
  cost: 2,
});

const secondTraveler = createMockCharacter({
  id: "central-station-second-traveler",
  name: "Central Station Second Traveler",
  cost: 2,
});

const otherLocation = createMockLocation({
  id: "central-station-other-location",
  name: "Central Station Other Location",
  cost: 1,
  moveCost: 1,
});

describe("Central Station - Transportation Hub", () => {
  it("does not reward playing the location without movement", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [centralStationTransportationHub],
      play: [traveler],
      inkwell: 1,
      deck: [],
    });
    const player = engine.asPlayerOne();
    expect(player.playCard(centralStationTransportationHub)).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(player.getBagCount()).toBe(0);
    expect(player).not.toBeAtLocation({
      card: traveler,
      location: centralStationTransportationHub,
    });
  });

  it("does not reward a second arrival after the same character leaves and returns", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [centralStationTransportationHub, otherLocation, traveler],
      inkwell: 3,
      deck: [],
    });
    const player = engine.asPlayerOne();
    expect(
      player.moveCharacterToLocation(traveler, centralStationTransportationHub),
    ).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(player.moveCharacterToLocation(traveler, otherLocation)).toBeSuccessfulCommand();
    expect(
      player.moveCharacterToLocation(traveler, centralStationTransportationHub),
    ).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(player).toBeAtLocation({ card: traveler, location: centralStationTransportationHub });
  });
  it("rewards free movement of a drying character without paying movement ink", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        centralStationTransportationHub,
        hyperiaCityExpress,
        { card: traveler, isDrying: true },
      ],
      inkwell: 0,
      deck: [],
    });
    const player = engine.asPlayerOne();
    expect(
      player.activateAbility(hyperiaCityExpress, {
        ability: "EASY COMMUTE",
        targets: [traveler, centralStationTransportationHub],
      }),
    ).toBeSuccessfulCommand();
    expect(player).toBeAtLocation({ card: traveler, location: centralStationTransportationHub });
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(player.getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("resets the once-per-turn reward on the controller's next turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [centralStationTransportationHub, traveler, secondTraveler],
        inkwell: 2,
        deck: 6,
      },
      { deck: 6 },
    );
    const player = engine.asPlayerOne();
    expect(
      player.moveCharacterToLocation(traveler, centralStationTransportationHub),
    ).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(player.passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(player.hasGameEnded()).toBe(false);
    expect(
      player.moveCharacterToLocation(secondTraveler, centralStationTransportationHub),
    ).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(player).toBeAtLocation({
      card: secondTraveler,
      location: centralStationTransportationHub,
    });
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
  });

  it("rewards Player Two's movement only to Player Two", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6, inkDrops: 2 },
      {
        play: [centralStationTransportationHub, traveler],
        inkwell: 1,
        deck: 6,
        inkDrops: 3,
      },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const player = engine.asPlayerTwo();
    expect(
      player.moveCharacterToLocation(traveler, centralStationTransportationHub),
    ).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(4);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(player.getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(player).toBeAtLocation({ card: traveler, location: centralStationTransportationHub });
  });
  it("Free Souvenir - gets 1 ink drop the first time a character moves here during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [centralStationTransportationHub, { card: traveler, exerted: true }],
      inkwell: centralStationTransportationHub.moveCost,
      deck: 1,
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(traveler, centralStationTransportationHub)
        .success,
    ).toBe(true);

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(testEngine.getInkDrops(PLAYER_TWO)).toBe(0);
  });

  it("Free Souvenir - only triggers once per turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        centralStationTransportationHub,
        { card: traveler, exerted: true },
        { card: secondTraveler, exerted: true },
      ],
      inkwell: centralStationTransportationHub.moveCost * 2,
      deck: 1,
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(traveler, centralStationTransportationHub)
        .success,
    ).toBe(true);
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);

    expect(
      testEngine
        .asPlayerOne()
        .moveCharacterToLocation(secondTraveler, centralStationTransportationHub).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("Free Souvenir - does not trigger when a character moves to a different location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [centralStationTransportationHub, otherLocation, { card: traveler, exerted: true }],
      inkwell: otherLocation.moveCost,
      deck: 1,
    });

    expect(testEngine.asPlayerOne().moveCharacterToLocation(traveler, otherLocation).success).toBe(
      true,
    );
    expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(testEngine.getInkDrops(PLAYER_TWO)).toBe(0);
  });
});

it("does not reward an effect-driven arrival on the opponent's turn or consume the next own reward", () => {
  const transport = createMockAction({
    id: "station-off-turn-transport",
    name: "Transport",
    cost: 0,
    abilities: [
      {
        type: "action",
        effect: {
          type: "move-to-location",
          cost: "free",
          character: "CHOSEN_CHARACTER",
          location: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["location"],
          },
        },
      },
    ],
  });
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [centralStationTransportationHub, traveler, secondTraveler], inkwell: 1, deck: 6 },
    { hand: [transport], deck: 6 },
  );
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    g.asPlayerTwo().playCard(transport, { targets: [traveler, centralStationTransportationHub] }),
  ).toBeSuccessfulCommand();
  expect(g.asPlayerOne()).toBeAtLocation({
    card: traveler,
    location: centralStationTransportationHub,
  });
  expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(g.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(g.asPlayerTwo().getBagCount()).toBe(0);
  expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(
    g.asPlayerOne().moveCharacterToLocation(secondTraveler, centralStationTransportationHub),
  ).toBeSuccessfulCommand();
  expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(g.getInkDrops(PLAYER_TWO)).toBe(0);
});

it("tracks each exact Station copy separately and preserves the limit when returning", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [centralStationTransportationHub, centralStationTransportationHub, traveler],
    inkwell: 3,
    deck: 6,
  });
  const p = g.asPlayerOne();
  const stations = g
    .getCardInstanceIdsInZone("play", "player_one")
    .filter((id) => g.getCardDefinitionId(id) === centralStationTransportationHub.id);
  expect(stations).toHaveLength(2);
  expect(p.moveCharacterToLocation(traveler, stations[1]!)).toBeSuccessfulCommand();
  expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(p).toBeAtLocation({ card: traveler, location: stations[1]! });
  expect(p.moveCharacterToLocation(traveler, stations[0]!)).toBeSuccessfulCommand();
  expect(g.getInkDrops(PLAYER_ONE)).toBe(2);
  expect(p).toBeAtLocation({ card: traveler, location: stations[0]! });
  expect(p.moveCharacterToLocation(traveler, stations[1]!)).toBeSuccessfulCommand();
  expect(g.getInkDrops(PLAYER_ONE)).toBe(2);
  expect(p.getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(p.getBagCount()).toBe(0);
});
