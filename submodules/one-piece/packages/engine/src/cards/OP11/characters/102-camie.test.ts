import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01RadicalBeam029,
  op01Shanks120,
  op03Kuroobi026,
  op11Camie102,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-102 Camie", () => {
  test("on its controller's turn trashes the top Life of both players after the opponent activates an Event", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op11Camie102, { card: eb01MountainGod018, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Doma005],
      },
      {
        hand: [op01RadicalBeam029],
        life: [eb01Doma005, eb01Doma005],
        activeDon: op01RadicalBeam029.cost,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op01RadicalBeam029);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.players.north.lifeCount).toBe(1);
    expect(view.players.south.trash).toHaveLength(1);
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(op01RadicalBeam029.id);
    expect(view.players.north.trash.filter((card) => card.cardId === eb01Doma005.id)).toHaveLength(
      1,
    );
  });

  test("does nothing when the opponent has fewer than 2 Life cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op11Camie102, { card: eb01MountainGod018, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Doma005],
      },
      {
        hand: [op01RadicalBeam029],
        life: [eb01Doma005],
        activeDon: op01RadicalBeam029.cost,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op01RadicalBeam029);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(2);
    expect(view.players.north.lifeCount).toBe(1);
  });

  test("reacts when the opponent activates a Life Trigger", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op11Camie102, { card: op01Shanks120, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Doma005],
      },
      { life: [op03Kuroobi026, eb01Doma005, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.declareAttack(
      engine.findCardInZone("south", "character", op01Shanks120),
      engine.leader("north"),
      "south",
    );
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.players.north.lifeCount).toBe(1);
    expect(view.players.north.characters.map((card) => card?.cardId)).toContain(op03Kuroobi026.id);
  });

  test("shares once-per-turn usage between Event and Trigger activation", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          op11Camie102,
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: op01Shanks120, playedOnTurn: 0 },
        ],
        life: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      {
        hand: [op01RadicalBeam029],
        life: [eb01Doma005, op03Kuroobi026, eb01Doma005, eb01Doma005],
        activeDon: op01RadicalBeam029.cost,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.declareAttack(
      engine.findCardInZone("south", "character", eb01Doma005),
      engine.leader("north"),
      "south",
    );
    engine.resolveDecision(
      "battleCounter",
      {
        selectedIds: [engine.findCardInZone("north", "hand", op01RadicalBeam029)],
      },
      "north",
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.lifeCount).toBe(2);
    expect(engine.getView("south").players.north.lifeCount).toBe(3);

    engine.declareAttack(
      engine.findCardInZone("south", "character", op01Shanks120),
      engine.leader("north"),
      "south",
    );
    expect(engine.getView("south").players.south.lifeCount).toBe(2);
    expect(engine.getView("south").players.north.lifeCount).toBe(2);
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(2);
    expect(view.players.north.lifeCount).toBe(2);
  });

  test("may decline the reaction without trashing either player's Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op11Camie102, { card: eb01MountainGod018, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Doma005],
      },
      {
        hand: [op01RadicalBeam029],
        life: [eb01Doma005, eb01Doma005],
        activeDon: op01RadicalBeam029.cost,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.declareAttack(
      engine.findCardInZone("south", "character", eb01MountainGod018),
      engine.leader("north"),
      "south",
    );
    engine.resolveDecision(
      "battleCounter",
      {
        selectedIds: [engine.findCardInZone("north", "hand", op01RadicalBeam029)],
      },
      "north",
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(2);
    expect(view.players.north.lifeCount).toBe(2);
  });
});
