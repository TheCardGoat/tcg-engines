import { eb01Doma005, op14eb04EdwardNewgate044 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Gladius062 } from "../../../../../cards/src/cards/OP14EB04/characters/062-gladius.ts";

import { OnePieceTestEngine } from "../../../index.ts";

function koGladius(engine: OnePieceTestEngine) {
  const gladiusId = engine.findCardInZone("south", "character", op14eb04Gladius062);
  const attackerId = engine.findCardInZone("north", "character", op14eb04EdwardNewgate044);
  engine.declareAttack(attackerId, gladiusId, "north");
  return gladiusId;
}

function createGladiusEngine() {
  return OnePieceTestEngine.create(
    { character: [{ card: op14eb04Gladius062, rested: true }], activeDon: 1 },
    {
      character: [eb01Doma005, { card: op14eb04EdwardNewgate044, playedOnTurn: 0 }],
    },
    { firstPlayer: "south", activeSeat: "north" },
  );
}

describe("OP14-062 Gladius", () => {
  test("on K.O. may return one DON and choose to K.O. an opposing base-power-6000-or-less Character", () => {
    const engine = createGladiusEngine();
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("north", "character", op14eb04EdwardNewgate044);
    const gladiusId = koGladius(engine);

    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Gladius's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(gladiusId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 0 });
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("on K.O. may choose to rest an opposing base-power-6000-or-less Character", () => {
    const engine = createGladiusEngine();
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("north", "character", op14eb04EdwardNewgate044);
    koGladius(engine);

    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Gladius's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(excludedId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the DON return after being K.O.'d", () => {
    const engine = createGladiusEngine();
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    koGladius(engine);

    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(1);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
