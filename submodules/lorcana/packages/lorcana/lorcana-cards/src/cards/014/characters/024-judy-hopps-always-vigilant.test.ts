import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { judyHoppsAlwaysVigilant } from "./024-judy-hopps-always-vigilant";

const shiftBase = createMockCharacter({
  id: "judy-av-shift-base",
  name: "Judy Hopps",
  version: "Shift Base",
  cost: 4,
  strength: 4,
  willpower: 4,
});

const cheapCharacter = createMockCharacter({
  id: "judy-av-cheap",
  name: "Cheap Character",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const bigTarget = createMockCharacter({
  id: "judy-av-big-target",
  name: "Big Target",
  cost: 5,
  strength: 5,
  willpower: 5,
});

describe("Judy Hopps - Always Vigilant", () => {
  it("Player Two pays Shift 2 and keeps damage and exertion while owning the banishment choice", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [bigTarget], deck: 6 },
      {
        hand: [cheapCharacter, judyHoppsAlwaysVigilant],
        play: [{ card: shiftBase, damage: 2, exerted: true }],
        inkwell: 3,
        deck: 6,
      },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    // The base readies at Player Two's start, then quests before being shifted.
    expect(game.asPlayerTwo().quest(shiftBase)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(cheapCharacter)).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().playCard(judyHoppsAlwaysVigilant, {
        cost: {
          cost: "shift",
          shiftTarget: game.findCardInstanceId(shiftBase, "play", PLAYER_TWO),
        },
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().getDamage(judyHoppsAlwaysVigilant)).toBe(2);
    expect(game.asPlayerTwo().isExerted(judyHoppsAlwaysVigilant)).toBe(true);
    expect(
      game.asPlayerOne().resolvePendingByCard(judyHoppsAlwaysVigilant, {
        resolveOptional: true,
        targets: [bigTarget],
      }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(bigTarget)).toBe("play");
    expect(game.asPlayerTwo().getBagCount()).toBe(1);
    expect(
      game.asPlayerTwo().resolvePendingByCard(judyHoppsAlwaysVigilant, {
        resolveOptional: true,
        targets: [bigTarget],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(bigTarget)).toBe("discard");
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });

  it("finishes after another character is played when no target has strength five", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cheapCharacter, judyHoppsAlwaysVigilant],
      inkwell: 5,
      deck: 6,
    });
    expect(game.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(judyHoppsAlwaysVigilant)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().getCardZone(cheapCharacter)).toBe("play");
    expect(game.asPlayerOne().getCardZone(judyHoppsAlwaysVigilant)).toBe("play");
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("rejects a printed strength-five target reduced below five without consuming the choice", () => {
    const reduced = createMockCharacter({
      id: "judy-reduced-five",
      name: "Reduced Five",
      cost: 5,
      strength: 5,
      abilities: [
        {
          type: "static",
          effect: { type: "modify-stat", stat: "strength", modifier: -1, target: "SELF" },
        },
      ],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [cheapCharacter, judyHoppsAlwaysVigilant], inkwell: 5, deck: 6 },
      { play: [reduced, bigTarget], deck: 6 },
    );
    expect(game.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(judyHoppsAlwaysVigilant)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(judyHoppsAlwaysVigilant, {
        resolveOptional: true,
        targets: [reduced],
      }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(reduced)).toBe("play");
    expect(game.asPlayerOne().getBagCount()).toBe(1);
    expect(
      game.asPlayerOne().resolvePendingByCard(judyHoppsAlwaysVigilant, {
        resolveOptional: true,
        targets: [bigTarget],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(bigTarget)).toBe("discard");
    expect(game.asPlayerOne().getBagCount()).toBe(0);
  });
  it("shifts for 2 {I} onto a Judy Hopps character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: shiftBase, isDrying: false }],
      hand: [judyHoppsAlwaysVigilant],
      inkwell: 2,
      deck: 6,
    });

    const shiftTargetId = testEngine.findCardInstanceId(shiftBase, "play");
    expect(
      testEngine.asPlayerOne().playCard(judyHoppsAlwaysVigilant, {
        cost: { cost: "shift", shiftTarget: shiftTargetId },
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(judyHoppsAlwaysVigilant)).toBe("play");
  });

  it("may banish a chosen character with 5 {S} or more after playing another character this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cheapCharacter, judyHoppsAlwaysVigilant],
        inkwell: cheapCharacter.cost + judyHoppsAlwaysVigilant.cost,
        deck: 6,
      },
      {
        play: [bigTarget],
        deck: 6,
      },
    );

    expect(testEngine.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(judyHoppsAlwaysVigilant)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(judyHoppsAlwaysVigilant, {
        resolveOptional: true,
        targets: [bigTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(bigTarget)).toBe("discard");
  });

  it("does not trigger when no other character was played this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [judyHoppsAlwaysVigilant],
        inkwell: judyHoppsAlwaysVigilant.cost,
        deck: 6,
      },
      {
        play: [bigTarget],
        deck: 6,
      },
    );

    expect(testEngine.asPlayerOne().playCard(judyHoppsAlwaysVigilant)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerTwo().getCardZone(bigTarget)).toBe("play");
  });

  it("does not banish when declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cheapCharacter, judyHoppsAlwaysVigilant],
        inkwell: cheapCharacter.cost + judyHoppsAlwaysVigilant.cost,
        deck: 6,
      },
      {
        play: [bigTarget],
        deck: 6,
      },
    );

    expect(testEngine.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(judyHoppsAlwaysVigilant)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(judyHoppsAlwaysVigilant, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(bigTarget)).toBe("play");
  });
  it("rejects strength four and may banish your own strength-five character", () => {
    const smallTarget = createMockCharacter({
      id: "judy-four-strength",
      name: "Four Strength",
      cost: 2,
      strength: 4,
      willpower: 6,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cheapCharacter, judyHoppsAlwaysVigilant],
        play: [bigTarget],
        inkwell: 10,
        deck: 6,
      },
      { play: [smallTarget], deck: 6 },
    );
    expect(engine.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(judyHoppsAlwaysVigilant)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(judyHoppsAlwaysVigilant, {
        resolveOptional: true,
        targets: [smallTarget],
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(judyHoppsAlwaysVigilant, {
        resolveOptional: true,
        targets: [bigTarget],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(bigTarget)).toBe("discard");
    expect(engine.asPlayerTwo().getCardZone(smallTarget)).toBe("play");
  });

  it("rejects opposing Ward but permits your own Ward at strength five", () => {
    const wardTarget = createMockCharacter({
      id: "judy-ward-five",
      name: "Ward Five",
      cost: 5,
      strength: 5,
      willpower: 5,
      abilities: [{ type: "keyword", keyword: "Ward" }],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [cheapCharacter, judyHoppsAlwaysVigilant], play: [wardTarget], inkwell: 5, deck: 6 },
      { play: [wardTarget], deck: 6 },
    );
    const own = game.findCardInstanceId(wardTarget, "play", PLAYER_ONE);
    const opposing = game.findCardInstanceId(wardTarget, "play", PLAYER_TWO);
    expect(game.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(judyHoppsAlwaysVigilant)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(judyHoppsAlwaysVigilant, {
        resolveOptional: true,
        targets: [opposing],
      }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(opposing)).toBe("play");
    expect(game.asPlayerOne().getBagCount()).toBe(1);
    expect(
      game
        .asPlayerOne()
        .resolvePendingByCard(judyHoppsAlwaysVigilant, { resolveOptional: true, targets: [own] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(own)).toBe("discard");
    expect(game.asPlayerOne().getCardZone(opposing)).toBe("play");
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("does not count an action or a character played on an earlier turn", () => {
    const action = createMockAction({
      id: "judy-prior-action",
      name: "Action",
      cost: 1,
      text: "An action.",
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cheapCharacter, action, judyHoppsAlwaysVigilant],
        inkwell: 10,
        deck: 6,
      },
      { play: [bigTarget], deck: 6 },
    );
    expect(engine.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(judyHoppsAlwaysVigilant)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
    expect(engine.asPlayerTwo().getCardZone(bigTarget)).toBe("play");
  });

  it("requires the Shift name and two ready ink", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [shiftBase, cheapCharacter],
      hand: [judyHoppsAlwaysVigilant],
      inkwell: 1,
      deck: 6,
    });
    expect(
      engine.asPlayerOne().playCard(judyHoppsAlwaysVigilant, {
        cost: { cost: "shift", shiftTarget: engine.findCardInstanceId(shiftBase, "play") },
      }),
    ).not.toBeSuccessfulCommand();
    const wrongName = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [cheapCharacter],
      hand: [judyHoppsAlwaysVigilant],
      inkwell: 2,
      deck: 6,
    });
    expect(
      wrongName.asPlayerOne().playCard(judyHoppsAlwaysVigilant, {
        cost: {
          cost: "shift",
          shiftTarget: wrongName.findCardInstanceId(cheapCharacter, "play"),
        },
      }),
    ).not.toBeSuccessfulCommand();
  });

  it("uses current strength rather than printed strength for the five-strength limit", () => {
    const boostedTarget = createMockCharacter({
      id: "judy-boosted-target",
      name: "Boosted Target",
      cost: 2,
      strength: 4,
      abilities: [
        {
          type: "static",
          effect: { type: "modify-stat", stat: "strength", modifier: 1, target: "SELF" },
        },
      ],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [cheapCharacter, judyHoppsAlwaysVigilant], inkwell: 10, deck: 6 },
      { play: [boostedTarget], deck: 6 },
    );
    expect(engine.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(judyHoppsAlwaysVigilant)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(judyHoppsAlwaysVigilant, {
        resolveOptional: true,
        targets: [boostedTarget],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardZone(boostedTarget)).toBe("discard");
  });

  it("triggers when shifted onto a Judy played earlier in this turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [shiftBase, judyHoppsAlwaysVigilant], inkwell: 6, deck: 6 },
      { play: [bigTarget], deck: 6 },
    );
    expect(engine.asPlayerOne().playCard(shiftBase)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().playCard(judyHoppsAlwaysVigilant, {
        cost: { cost: "shift", shiftTarget: engine.findCardInstanceId(shiftBase, "play") },
      }),
    ).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(judyHoppsAlwaysVigilant, {
        resolveOptional: true,
        targets: [bigTarget],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardZone(bigTarget)).toBe("discard");
  });
});
