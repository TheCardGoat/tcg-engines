import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op07DraculeMihawk044,
  op09Yasopp013,
  op11HonestyImpact018,
  op14eb04Kaido030,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP11-018 Honesty Impact", () => {
  test("Main applies the official −4000 value before an independent power-6000 K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op11HonestyImpact018], activeDon: 6 },
      { character: [op07DraculeMihawk044, eb01Doma005] },
    );
    const reducedId = engine.findCardInZone("north", "character", op07DraculeMihawk044);
    const koId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op11HonestyImpact018);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [reducedId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [koId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === reducedId)?.power,
    ).toBe(6000);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(koId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger K.O.s the 6000-power boundary and excludes higher power", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op09Yasopp013, op14eb04Kaido030],
      },
      { life: [op11HonestyImpact018] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("south", "character", op09Yasopp013);
    const excludedId = engine.findCardInZone("south", "character", op14eb04Kaido030);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const decision = engine.pendingDecision("effectTargetSelection", "north");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected a power-filtered K.O. choice.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toContain(selectedId);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
