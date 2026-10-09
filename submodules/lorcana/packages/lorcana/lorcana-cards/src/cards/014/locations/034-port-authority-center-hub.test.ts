import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockAction,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { portAuthorityCenterHub } from "./034-port-authority-center-hub";

const traveler = createMockCharacter({
  id: "port-authority-traveler",
  name: "Port Authority Traveler",
  cost: 2,
});

const secondTraveler = createMockCharacter({
  id: "port-authority-second-traveler",
  name: "Port Authority Second Traveler",
  cost: 2,
});

const otherLocation = createMockLocation({
  id: "port-authority-other-location",
  name: "Port Authority Other Location",
  cost: 1,
  moveCost: 1,
  lore: 0,
});

describe("Port Authority - Center Hub", () => {
  it("WELCOME TO TOWN - each player gets 1 ink drop and gains 1 lore the first time a character moves here during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [portAuthorityCenterHub, { card: traveler, exerted: true }],
      inkwell: portAuthorityCenterHub.moveCost,
      deck: 1,
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(traveler, portAuthorityCenterHub).success,
    ).toBe(true);

    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    expect(testEngine.getLore(PLAYER_TWO)).toBe(1);
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(testEngine.getInkDrops(PLAYER_TWO)).toBe(1);
  });

  it("WELCOME TO TOWN - only triggers once per turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        portAuthorityCenterHub,
        { card: traveler, exerted: true },
        { card: secondTraveler, exerted: true },
      ],
      inkwell: portAuthorityCenterHub.moveCost * 2,
      deck: 1,
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(traveler, portAuthorityCenterHub).success,
    ).toBe(true);
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(secondTraveler, portAuthorityCenterHub)
        .success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);

    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    expect(testEngine.getLore(PLAYER_TWO)).toBe(1);
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(testEngine.getInkDrops(PLAYER_TWO)).toBe(1);
  });

  it("WELCOME TO TOWN - does not trigger when a character moves to a different location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [portAuthorityCenterHub, otherLocation, { card: traveler, exerted: true }],
      inkwell: otherLocation.moveCost,
      deck: 1,
    });

    expect(testEngine.asPlayerOne().moveCharacterToLocation(traveler, otherLocation).success).toBe(
      true,
    );
    expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    expect(testEngine.getLore(PLAYER_TWO)).toBe(0);
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(testEngine.getInkDrops(PLAYER_TWO)).toBe(0);
  });
});

describe("Port Authority turn boundaries", () => {
  it("triggers for player two's location only on that player's turn and charges the movement cost", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6 },
      { play: [portAuthorityCenterHub, traveler, secondTraveler], inkwell: 2, deck: 6 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_TWO)).toBe(2);
    expect(
      engine.asPlayerTwo().moveCharacterToLocation(traveler, portAuthorityCenterHub),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(1);
    const messages = engine
      .asServer()
      .getMoveLogHistory()
      .flatMap((log) => log.public);
    for (const playerId of [PLAYER_ONE, PLAYER_TWO]) {
      expect(messages).toContainEqual({
        key: "lorcana.outcome.inkDropsGained",
        values: { playerId, amount: 1 },
      });
      expect(messages).toContainEqual({
        key: "lorcana.outcome.loreGained",
        values: { playerId, amount: 1 },
      });
    }
    expect(engine.getLore(PLAYER_ONE)).toBe(1);
    expect(engine.getLore(PLAYER_TWO)).toBe(3);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(engine.asPlayerTwo()).toBeAtLocation({
      card: traveler,
      location: portAuthorityCenterHub,
    });
    expect(
      engine.asPlayerTwo().moveCharacterToLocation(secondTraveler, portAuthorityCenterHub),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(engine.getLore(PLAYER_ONE)).toBe(1);
    expect(engine.getLore(PLAYER_TWO)).toBe(3);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(1);
  });

  it("resets its trigger next turn and gains printed location lore at the start", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [portAuthorityCenterHub, otherLocation, traveler], inkwell: 5, deck: 5 },
      { deck: 5 },
    );
    expect(
      engine.asPlayerOne().moveCharacterToLocation(traveler, portAuthorityCenterHub),
    ).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().moveCharacterToLocation(traveler, otherLocation),
    ).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().moveCharacterToLocation(traveler, portAuthorityCenterHub),
    ).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(1);
    expect(engine.getLore(PLAYER_TWO)).toBe(1);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(3);
    expect(
      engine.asPlayerOne().moveCharacterToLocation(traveler, otherLocation),
    ).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().moveCharacterToLocation(traveler, portAuthorityCenterHub),
    ).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(4);
    expect(engine.getLore(PLAYER_TWO)).toBe(2);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(2);
  });

  it("keeps the once-per-turn limit separate for each location instance", () => {
    const secondHub = { ...portAuthorityCenterHub, id: "second-port-hub" };
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [portAuthorityCenterHub, secondHub, traveler],
      inkwell: 3,
    });
    expect(
      engine.asPlayerOne().moveCharacterToLocation(traveler, portAuthorityCenterHub),
    ).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().moveCharacterToLocation(traveler, secondHub),
    ).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(2);
    expect(engine.getLore(PLAYER_TWO)).toBe(2);
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(2);
  });
});

it("Port Authority does not trigger when an effect moves a character here on the opposing turn", () => {
  const move = createMockAction({
    id: "port-opponent-move",
    name: "Move Rival",
    cost: 1,
    abilities: [
      {
        type: "action",
        effect: {
          type: "move-to-location",
          cost: "free",
          character: {
            selector: "all",
            count: "all",
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
          location: {
            selector: "all",
            count: "all",
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["location"],
          },
        },
      },
    ],
  });
  const engine = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [portAuthorityCenterHub, traveler], deck: 5 },
    { hand: [move], inkwell: 1, deck: 5 },
  );
  expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().playCard(move)).toBeSuccessfulCommand();
  expect(engine.asPlayerOne()).toBeAtLocation({ card: traveler, location: portAuthorityCenterHub });
  expect(engine.getLore(PLAYER_ONE)).toBe(0);
  expect(engine.getLore(PLAYER_TWO)).toBe(0);
  expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(engine.getInkDrops(PLAYER_TWO)).toBe(0);
});
