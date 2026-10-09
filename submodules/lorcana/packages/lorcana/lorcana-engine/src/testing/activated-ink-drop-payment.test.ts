import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter, PLAYER_ONE } from "./index";

const character = createMockCharacter({
  id: "activated-drop-payment",
  name: "Paid Ability",
  cost: 1,
  abilities: [
    {
      type: "activated",
      cost: { ink: 6 },
      effect: { type: "gain-lore", amount: 1, target: "CONTROLLER" },
    },
  ],
});

describe("activated ability ink-drop payment", () => {
  it("forwards the requested payment through the public player helper", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [character],
      inkwell: 5,
      inkDrops: 1,
      deck: [],
    });
    expect(
      engine.asPlayerOne().activateAbility(character, { abilityIndex: 0, inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(engine.getLore(PLAYER_ONE)).toBe(1);
    expect(
      engine.asPlayerOne().activateAbility(character, { abilityIndex: 0 }),
    ).not.toBeSuccessfulCommand();
  });

  it("rejects unavailable drop payments without gaining lore or spending the remaining drop", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [character],
      inkwell: 5,
      inkDrops: 1,
      deck: [],
    });
    expect(
      engine.asPlayerOne().activateAbility(character, { abilityIndex: 0, inkDrops: 2 }),
    ).not.toBeSuccessfulCommand();
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(engine.getLore(PLAYER_ONE)).toBe(0);
  });
});

it("discovers paid abilities and their options only with a valid claimed drop payment", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [character],
    inkwell: 5,
    inkDrops: 1,
    deck: 6,
  });
  const player = game.asPlayerOne();
  const cardId = game.findCardInstanceId(character, "play", PLAYER_ONE);
  expect(player.getAvailableMoves().some((move) => move.moveId === "activateAbility")).toBe(false);
  expect(player.getMoveOptions("activateAbility", cardId)).toEqual([]);
  expect(
    player.getAvailableMoves({ inkDrops: 1 }).find((move) => move.moveId === "activateAbility")
      ?.selectableCardIds,
  ).toContain(cardId);
  expect(player.getMoveOptions("activateAbility", cardId, { inkDrops: 1 })).toContainEqual({
    kind: "ability",
    abilityIndex: 0,
    abilityLabel: "Ability 1",
  });
  expect(
    player.getAvailableMoves({ inkDrops: 2 }).some((move) => move.moveId === "activateAbility"),
  ).toBe(false);
  expect(player.getMoveOptions("activateAbility", cardId, { inkDrops: 2 })).toEqual([]);
});
it("offers and executes a drop-only activation with zero bank ink", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [character],
    inkDrops: 6,
    deck: 6,
  });
  const player = game.asPlayerOne();
  const cardId = game.findCardInstanceId(character, "play", PLAYER_ONE);
  expect(
    player.getAvailableMoves({ inkDrops: 6 }).find((move) => move.moveId === "activateAbility")
      ?.selectableCardIds,
  ).toContain(cardId);
  expect(player.getMoveOptions("activateAbility", cardId, { inkDrops: 6 })).toHaveLength(1);
  expect(
    player.activateAbility(character, { abilityIndex: 0, inkDrops: 6 }),
  ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.getLore(PLAYER_ONE)).toBe(1);
  expect(
    player.getAvailableMoves({ inkDrops: 6 }).some((move) => move.moveId === "activateAbility"),
  ).toBe(false);
});
