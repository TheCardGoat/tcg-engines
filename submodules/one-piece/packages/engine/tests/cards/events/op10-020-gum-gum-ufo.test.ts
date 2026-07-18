import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op09Yasopp013,
  op10GumGumUfo020,
  op10Mocha015,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP10-020 Gum-Gum UFO", () => {
  test("Main gives an opposing Character −4000 before the low-Life self +1000 choice", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op10GumGumUfo020], life: 2, activeDon: 2 },
      { character: [op09Yasopp013, eb01Doma005] },
    );
    const opposingId = engine.findCardInZone("north", "character", op09Yasopp013);

    engine.playCard(op10GumGumUfo020);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "south");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingId)?.power,
    ).toBe(2000);
    expect(view.players.south.leader.power).toBe(6000);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger K.O.s the 3000-power boundary without Main payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op10Mocha015, eb01Doma005],
      },
      { life: [op10GumGumUfo020] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const boundaryId = engine.findCardInZone("south", "character", op10Mocha015);
    const excludedId = attackerId;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const decision = engine.pendingDecision("effectTargetSelection", "north");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected the power-3000 Trigger K.O. choice.");
    }
    expect(step.candidates.map((candidate) => candidate.ref.id)).toContain(boundaryId);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [boundaryId] }, "north");

    expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toContain(
      boundaryId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
