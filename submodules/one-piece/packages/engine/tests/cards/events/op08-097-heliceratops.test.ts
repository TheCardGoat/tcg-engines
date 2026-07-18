import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op01Kaido061,
  op05BartholomewKuma011,
  op05Pell014,
  op08Heliceratops097,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP08-097 Heliceratops", () => {
  test("Main applies the official −2 cost through an included Leader trait before the cost-0 K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op01Kaido061, hand: [op08Heliceratops097], activeDon: 3 },
      { character: [op05BartholomewKuma011, op05Pell014] },
    );
    const reducedId = engine.findCardInZone("north", "character", op05BartholomewKuma011);
    const excludedId = engine.findCardInZone("north", "character", op05Pell014);

    engine.playCard(op08Heliceratops097);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [reducedId] }, "south");

    const koDecision = engine.pendingDecision("effectTargetSelection", "south");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the effective cost-0 K.O. choice.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([reducedId]);
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [reducedId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      reducedId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger K.O.s the printed cost-3 boundary without the Main Leader gate", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op05Pell014] },
      { life: [op08Heliceratops097] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", op05Pell014);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
