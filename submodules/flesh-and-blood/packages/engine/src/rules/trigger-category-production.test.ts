import type { FabCardDefinitionInput } from "../cards.ts";
import type { FabEffect } from "@tcg/flesh-and-blood-types";
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";

const gainLife = { type: "gain-life", amount: 1, target: { selector: "controller" } } as const;

const playerOneHero = {
  canonicalId: "trigger-category-player-one",
  name: "Trigger Category Player One",
  types: ["Hero"],
  health: 20,
};

const playerTwoHero = {
  canonicalId: "trigger-category-player-two",
  name: "Trigger Category Player Two",
  types: ["Hero"],
  health: 20,
};

const deckCard: FabCardDefinitionInput = {
  canonicalId: "deck-card",
  name: "Deck Card",
  types: ["Action"],
};

function runtimeWith(
  action: FabCardDefinitionInput,
  watcher?: FabCardDefinitionInput,
  includeDeckCard = false,
): FabTestEngine {
  return FabTestEngine.start(
    {
      hero: playerOneHero,
      hand: [action],
      arena: watcher ? [watcher] : [],
      deck: includeDeckCard ? [deckCard] : [],
      resourcePoints: 0,
    },
    { hero: playerTwoHero, hand: [], deck: [], resourcePoints: 0 },
    {
      seed: "trigger-category-production",
      autoPassPriority: false,
    },
  );
}

function playAndResolve(game: FabTestEngine): void {
  const player = game.as(playerOneHero);
  expect(
    player.exec({
      move: "begin-play",
      payload: { instanceId: player.ref(actionInHand(game)).instanceId },
    }),
  ).toMatchObject({
    accepted: true,
  });
  passBoth(game);
}

function actionInHand(game: FabTestEngine): string {
  const player = game.as(playerOneHero);
  const [instanceId] = game.getState().containers.zonesByPlayerId[player.id]!.hand;
  if (!instanceId) throw new Error("Expected the action fixture card to be in hand.");
  return game.getState().objects[instanceId]!.canonicalId;
}

function passBoth(game: FabTestEngine): void {
  expect(game.as(playerOneHero).exec({ move: "pass" })).toMatchObject({ accepted: true });
  expect(game.as(playerTwoHero).exec({ move: "pass" })).toMatchObject({ accepted: true });
}

function freeAction(canonicalId: string, effect?: FabEffect): FabCardDefinitionInput {
  return {
    canonicalId,
    name: canonicalId,
    types: ["Action"],
    cost: 0,
    abilities: effect
      ? [{ id: `${canonicalId}-a1`, kind: "resolution", text: canonicalId, effect }]
      : [],
  };
}

describe("production move sequences for supported FAB trigger categories", () => {
  it("collects and resolves a static event trigger", () => {
    const watcher: FabCardDefinitionInput = {
      canonicalId: "static-watcher",
      name: "Static Watcher",
      types: ["Action", "Aura"],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          id: "static-watcher-a1",
          text: "Whenever you play a card, gain 1 life.",
          trigger: {
            kind: "event",
            event: {
              name: "play",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "none",
              },
            },
          },
          resolution: {
            kind: "effect",
            effect: gainLife,
          },
        },
      ],
    };
    const game = runtimeWith(freeAction("plain-action"), watcher);
    const player = game.as(playerOneHero);
    const before = game.getState().players[player.id]!.life;

    expect(
      player.exec({
        move: "begin-play",
        payload: { instanceId: player.ref("plain-action").instanceId },
      }),
    ).toMatchObject({ accepted: true });
    expect(game.getState().rulesStack.at(-1)).toMatchObject({
      kind: "triggered",
      abilityId: "static-watcher-a1",
    });
    passBoth(game);

    expect(game.getState().players[player.id]!.life).toBe(before + 1);
  });

  it("collects an inline trigger from the resolving card's LKI", () => {
    const action: FabCardDefinitionInput = {
      canonicalId: "inline-action",
      name: "Inline Action",
      types: ["Action"],
      cost: 0,
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          id: "inline-action-a1",
          text: "When this is put into the graveyard, gain 1 life.",
          trigger: {
            kind: "event",
            event: {
              name: "put-into-graveyard",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "source",
                selector: "moved-object",
              },
            },
          },
          resolution: {
            kind: "effect",
            effect: gainLife,
          },
          functionalZones: ["stack"],
        },
      ],
    };
    const game = runtimeWith(action);
    const player = game.as(playerOneHero);
    const before = game.getState().players[player.id]!.life;

    playAndResolve(game);
    expect(game.getState().rulesStack.at(-1)).toMatchObject({
      kind: "triggered",
      abilityId: "inline-action-a1",
    });
    passBoth(game);

    expect(game.getState().players[player.id]!.life).toBe(before + 1);
  });

  it("collects a triggered ability granted by a canonical property effect", () => {
    const watcher: FabCardDefinitionInput = {
      canonicalId: "granting-watcher",
      name: "Granting Watcher",
      types: ["Action", "Aura"],
      abilities: [
        {
          id: "granting-watcher-a1",
          kind: "static",
          staticKind: "continuous",
          text: "This has a triggered ability.",
          effect: {
            type: "grant-property",
            target: { selector: "self" },
            duration: "while-in-arena",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "granted-a1",
                text: "Whenever you play a card, gain 1 life.",
                trigger: {
                  kind: "event",
                  event: {
                    name: "play",
                    actor: {
                      kind: "player",
                      player: "ability-controller",
                    },
                    observes: {
                      kind: "none",
                    },
                  },
                },
                resolution: {
                  kind: "effect",
                  effect: gainLife,
                },
              },
            },
          },
        },
      ],
    };
    const game = runtimeWith(freeAction("grant-action"), watcher);
    const player = game.as(playerOneHero);
    const before = game.getState().players[player.id]!.life;

    expect(
      player.exec({
        move: "begin-play",
        payload: { instanceId: player.ref("grant-action").instanceId },
      }),
    ).toMatchObject({ accepted: true });
    expect(game.getState().rulesStack.at(-1)).toMatchObject({
      kind: "triggered",
      abilityId: "granted-a1",
    });
    passBoth(game);

    expect(game.getState().players[player.id]!.life).toBe(before + 1);
  });

  it("registers, consumes, and resolves a delayed trigger", () => {
    const action = freeAction("delayed-action", {
      type: "sequence",
      steps: [
        {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "draw",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "none",
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "this-turn",
            matching: "first",
          },
          resolution: {
            kind: "effect",
            effect: gainLife,
          },
        },
        { type: "draw", count: 1, player: "controller" },
      ],
    });
    const game = runtimeWith(action, undefined, true);
    const player = game.as(playerOneHero);
    const before = game.getState().players[player.id]!.life;

    playAndResolve(game);
    expect(game.getState().delayedTriggers).toEqual([]);
    expect(game.getState().rulesStack.at(-1)).toMatchObject({
      kind: "triggered",
      trigger: { kind: "event" },
    });
    passBoth(game);

    expect(game.getState().players[player.id]!.life).toBe(before + 1);
  });

  it("scans a state trigger to quiescence before returning priority", () => {
    const watcher: FabCardDefinitionInput = {
      canonicalId: "state-watcher",
      name: "State Watcher",
      types: ["Action", "Aura"],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          id: "state-watcher-a1",
          text: "When you have 19 life, gain 1 life.",
          trigger: {
            kind: "state",
            state: { type: "life-comparison", player: "self", vs: "fixed", op: "eq", value: 19 },
          },
          resolution: {
            kind: "effect",
            effect: gainLife,
          },
        },
      ],
    };
    const game = runtimeWith(
      freeAction("state-action", {
        type: "lose-life",
        amount: 1,
        target: { selector: "controller" },
      }),
      watcher,
    );

    const player = game.as(playerOneHero);
    playAndResolve(game);
    expect(game.getState().players[player.id]!.life).toBe(19);
    expect(game.getState().rulesStack.at(-1)).toMatchObject({
      kind: "triggered",
      abilityId: "state-watcher-a1",
    });
    passBoth(game);

    expect(game.getState().players[player.id]!.life).toBe(20);
    expect(game.getState().rulesStack).toEqual([]);
  });
});
