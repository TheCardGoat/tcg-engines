import {
  speedPotion,
  spiritOfWind,
  woodlandSquirrels,
  hiddenSecrets,
  grayWolf,
} from "@tcg/grand-archive-cards";
import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "../testing/test-engine.ts";
import { grandArchivePlayerId } from "../game/identity.ts";
import { GrandArchiveTransactionKernel } from "../kernel/kernel.ts";
import { executeGrandArchiveEffect } from "../procedures/effects/effect-executor.ts";
import { projectGrandArchiveViewerState } from "./view.ts";

describe("public player state projection", () => {
  it("shows Agility gained through native Speed Potion activation to both players", () => {
    const engine = GrandArchiveTestEngine.startFixture({
      playerOne: {
        id: "p1",
        champion: spiritOfWind,
        zones: { field: [speedPotion], hand: [woodlandSquirrels] },
      },
      playerTwo: { id: "p2", champion: spiritOfWind },
    });
    engine.player("p1").activateAbility(speedPotion, "0Z1r8GC8a8-a3");
    expect(engine.resolveStackUntilChoice()).toBe("stack-empty");
    for (const id of ["p1", "p2"]) {
      const view = projectGrandArchiveViewerState(
        engine.program,
        engine.state,
        grandArchivePlayerId(id),
      );
      expect(view.players.find((player) => player.id === "p1")?.states.agility).toBe(true);
      if (id === "p2")
        expect(view.players.find((player) => player.id === "p1")?.zones.hand).toMatchObject({
          visibility: "hidden",
          revealedObjects: [],
        });
    }
  });
});

it("projects Stealth granted by native Hidden Secrets to both viewers", () => {
  const engine = GrandArchiveTestEngine.startFixture({
    playerOne: {
      id: "p1",
      champion: spiritOfWind,
      zones: { field: [grayWolf], hand: [hiddenSecrets, woodlandSquirrels, woodlandSquirrels] },
    },
    playerTwo: { id: "p2", champion: spiritOfWind },
  });
  const target = engine.player("p1").card(grayWolf).objectId;
  const payments = engine.player("p1").cards(woodlandSquirrels, { zone: "hand" });
  engine.player("p1").activate(hiddenSecrets, {
    modeIds: ["mode-1"],
    targets: { "target-1": [target] },
    reservePayment: payments.map((card) => ({ kind: "card", cardId: card.objectId })),
  });
  expect(engine.resolveStackUntilChoice()).toBe("stack-empty");
  for (const id of ["p1", "p2"]) {
    const view = projectGrandArchiveViewerState(
      engine.program,
      engine.state,
      grandArchivePlayerId(id),
    );
    const zone = view.players.find((player) => player.id === "p1")!.zones.field;
    if (zone.visibility !== "visible") throw new Error("Field must be public");
    expect(zone.objects.find((object) => object.id === target)?.keywords).toContainEqual({
      name: "stealth",
    });
  }
});

it("does not display a stored named value removed by a continuous effect", () => {
  const engine = GrandArchiveTestEngine.startFixture({
    playerOne: { id: "p1", champion: spiritOfWind },
    playerTwo: { id: "p2", champion: spiritOfWind },
  });
  const p1 = grandArchivePlayerId("p1");
  const state = {
    ...engine.state,
    players: {
      ...engine.state.players,
      [p1]: { ...engine.state.players[p1]!, states: { "enabled-element": "fire" } },
    },
  };
  const kernel = new GrandArchiveTransactionKernel();
  const removed = executeGrandArchiveEffect(
    {
      kind: "continuous-player-state",
      players: "controller",
      state: { named: "enabled-element", value: "fire" },
      value: false,
      duration: { kind: "this-turn" },
    },
    { program: engine.program, state, controllerId: p1, bindings: {} },
    (current, events) => {
      const transaction = kernel.transact(current, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  );
  const view = projectGrandArchiveViewerState(engine.program, removed.state, p1);
  const states = view.players.find((player) => player.id === p1)!.states;
  expect(states["enabled-element"]).toBeUndefined();
  expect(states["enabled-element:fire"]).toBe(false);
});
