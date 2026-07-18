import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  eb03Lilith058,
  op01Hajrudin018,
  op03BuzzCutMochi119,
  op03Hatchan033,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP03-119 Buzz Cut Mochi", () => {
  test("with fewer Life, maps the opposing effective cost-4 K.O. boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03BuzzCutMochi119],
        activeDon: 2,
        life: 1,
      },
      {
        character: [op01Hajrudin018, eb01MountainGod018],
        life: 2,
      },
    );
    const selectedId = engine.findCardInZone("north", "character", op01Hajrudin018);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op03BuzzCutMochi119);

    const koDecision = engine.pendingDecision("effectTargetSelection", "south");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the lower-Life player to choose an opposing low-cost Character.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(selectedId);
    expect(view.players.north.characters.some((card) => card?.instanceId === excludedId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger offers only a cost-4-or-less Character that has a Trigger", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op03Hatchan033, op01Hajrudin018, eb03Lilith058],
        life: [op03BuzzCutMochi119],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("north", "hand", op03Hatchan033);
    const noTriggerId = engine.findCardInZone("north", "hand", op01Hajrudin018);
    const tooExpensiveId = engine.findCardInZone("north", "hand", eb03Lilith058);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const playDecision = engine.pendingDecision("effectPlaySelection", "north");
    const playStep = playDecision.steps[0];
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose a low-cost Trigger Character.");
    }
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(noTriggerId);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [selectedId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === selectedId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
