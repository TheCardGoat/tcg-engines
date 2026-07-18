import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op05BartholomewKuma011,
  op05FourThousandBrickFist020,
  op05Pell014,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

function leaderPower(engine: OnePieceTestEngine, seat: "south" | "north") {
  const power = engine.getView(seat).players[seat].leader.power;
  if (power === undefined || power === null) {
    throw new Error("Expected the Leader to expose its current power.");
  }
  return power;
}

describe("OP05-020 Four Thousand-Brick Fist", () => {
  test("Main maps its power recipient before the opposing printed-power K.O. boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05FourThousandBrickFist020],
        activeDon: 2,
      },
      {
        character: [op05BartholomewKuma011, op05Pell014],
      },
    );
    const selectedId = engine.findCardInZone("north", "character", op05BartholomewKuma011);
    const excludedId = engine.findCardInZone("north", "character", op05Pell014);
    const powerBefore = leaderPower(engine, "south");

    engine.playCard(op05FourThousandBrickFist020);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    const koDecision = engine.pendingDecision("effectTargetSelection", "south");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected an opposing power-2000-or-less Character choice.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    expect(leaderPower(engine, "south")).toBe(powerBefore + 2000);
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger grants only its smaller turn-scoped power modifier", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op05FourThousandBrickFist020],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const powerBefore = leaderPower(engine, "north");

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    expect(leaderPower(engine, "north")).toBe(powerBefore + 1000);
    engine.endTurn("south");
    expect(leaderPower(engine, "north")).toBe(powerBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
