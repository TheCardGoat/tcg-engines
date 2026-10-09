import { expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "../../../testing";

const destination = createMockLocation({
  id: "destination",
  name: "Destination",
  cost: 1,
  moveCost: 5,
});
const origin = createMockLocation({ id: "origin", name: "Origin", cost: 1 });
const walker = createMockCharacter({
  id: "walker",
  name: "Walker",
  cost: 1,
  abilities: [
    {
      type: "activated",
      cost: {},
      effect: {
        type: "move-to-location",
        character: "SELF",
        cost: "free",
        location: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["location"],
          filter: [{ type: "not", filter: { type: "same-location-as-source" } }],
        },
        forEach: [{ type: "gain-lore", amount: 1 }],
      },
    },
  ],
});

it("a location candidate is its own location for a character-source destination filter", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [origin, destination, { card: walker, atLocation: origin }],
    deck: 6,
  });
  expect(
    game.asPlayerOne().activateAbility(walker, { targets: [origin] }),
  ).not.toBeSuccessfulCommand();
  expect(game.getLore("player_one")).toBe(0);
  expect(
    game.asPlayerOne().activateAbility(walker, { targets: [destination] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toBeAtLocation({ card: walker, location: destination });
  expect(game.getLore("player_one")).toBe(1);
});

it("a move with no other destination completes without awarding per-move lore", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [origin, { card: walker, atLocation: origin }],
    deck: 6,
  });
  expect(game.asPlayerOne().activateAbility(walker)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  expect(game.getLore("player_one")).toBe(0);
  expect(game.asPlayerOne()).toBeAtLocation({ card: walker, location: origin });
});

it("location-source filtering still selects only characters at that location", () => {
  const resident = createMockCharacter({ id: "resident", name: "Resident", cost: 1 });
  const elsewhere = createMockCharacter({ id: "elsewhere", name: "Elsewhere", cost: 1 });
  const source = createMockLocation({
    id: "source",
    name: "Source",
    cost: 1,
    abilities: [
      {
        type: "activated",
        cost: {},
        effect: {
          type: "exert",
          target: {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
            filter: [{ type: "same-location-as-source" }],
          },
        },
      },
    ],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [
      source,
      destination,
      { card: resident, atLocation: source },
      { card: elsewhere, atLocation: destination },
    ],
    deck: 6,
  });
  expect(
    game.asPlayerOne().activateAbility(source, { targets: [elsewhere] }),
  ).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().activateAbility(source, { targets: [resident] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().isExerted(resident)).toBe(true);
});
