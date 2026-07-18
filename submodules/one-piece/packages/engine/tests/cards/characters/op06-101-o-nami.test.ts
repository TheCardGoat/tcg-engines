import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Inazuma022,
  eb01MountainGod018,
  op01Kawamatsu037,
  op06ONami101,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-101 O-Nami", () => {
  test("grants Banish to a chosen Leader or Character for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06ONami101],
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        activeDon: op06ONami101.cost,
      },
      { life: [op01Kawamatsu037] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const lifeId = engine.findCardInZone("north", "life", op01Kawamatsu037);

    engine.playCard(op06ONami101, "south");
    const onamiId = engine.findCardInZone("south", "character", op06ONami101);
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected O-Nami's Banish target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), attackerId, onamiId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [attackerId] }, "south");

    engine.declareAttack(attackerId, engine.leader("north"), "south");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(0);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(lifeId);
    expect(view.decisions).toHaveLength(0);
  });

  test("Life Trigger may K.O. only an opposing cost-5-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01Inazuma022, playedOnTurn: 0 },
          { card: eb01Doma005, rested: true },
        ],
      },
      { life: [op06ONami101] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Inazuma022);
    const eligibleId = engine.findCardInZone("south", "character", eb01Doma005);
    const onamiId = engine.findCardInZone("north", "life", op06ONami101);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected O-Nami's Trigger target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(onamiId);
  });
});
