import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op12Alvida042,
  op12Gyukimaru024,
  op12Mizerka092,
  op12Sakazuki044,
  op12Shiki005,
  op12UrsaShock096,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP12-096 Ursa Shock", () => {
  test("Main without a cost-8 Character offers only opposing cost-4-or-less Characters", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op12UrsaShock096], activeDon: 4 },
      { character: [op12Alvida042, op12Mizerka092] },
    );
    const cost4Id = engine.findCardInZone("north", "character", op12Alvida042);
    const cost6Id = engine.findCardInZone("north", "character", op12Mizerka092);

    engine.playCard(op12UrsaShock096);
    const decision = engine.pendingDecision("effectTargetSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected a K.O. target choice.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([cost4Id]);
    expect(step.candidates.some((candidate) => candidate.ref.id === cost6Id)).toBe(false);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [cost4Id] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      cost4Id,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Main with a cost-8 Character raises the target ceiling to 6 but not 7", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op12UrsaShock096],
        character: [op12Shiki005],
        activeDon: 4,
      },
      { character: [op12Mizerka092, op12Sakazuki044] },
    );
    const cost6Id = engine.findCardInZone("north", "character", op12Mizerka092);
    const cost7Id = engine.findCardInZone("north", "character", op12Sakazuki044);

    engine.playCard(op12UrsaShock096);
    const decision = engine.pendingDecision("effectTargetSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected the upgraded K.O. choice.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([cost6Id]);
    expect(step.candidates.some((candidate) => candidate.ref.id === cost7Id)).toBe(false);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [cost6Id] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      cost6Id,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws one and trashes the next deck card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op12UrsaShock096],
        deck: [eb01Doma005, op12Gyukimaru024, eb01Doma005, op12Gyukimaru024],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const drawId = engine.findCardInZone("north", "deck", eb01Doma005);
    const trashId = engine.findCardInZone("north", "deck", op12Gyukimaru024);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(drawId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(trashId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
