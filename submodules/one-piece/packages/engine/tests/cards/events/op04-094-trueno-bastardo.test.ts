import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op01Hajrudin018,
  op03RobLucci092,
  op04Olin099,
  op04TruenoBastardo094,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP04-094 Trueno Bastardo", () => {
  test("below 15 trash after payment, maps only the effective cost-4 K.O. range", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04TruenoBastardo094],
        trash: 13,
        activeDon: 4,
      },
      {
        character: [op01Hajrudin018, eb01MountainGod018],
      },
    );
    const selectedId = engine.findCardInZone("north", "character", op01Hajrudin018);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op04TruenoBastardo094);

    const koDecision = engine.pendingDecision("effectTargetSelection", "south");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to receive the normal cost-4 K.O. range.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(selectedId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("the played Event can become the fifteenth trash card and unlock the cost-6 range", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04TruenoBastardo094],
        trash: 14,
        activeDon: 4,
      },
      {
        character: [op03RobLucci092, op04Olin099],
      },
    );
    const selectedId = engine.findCardInZone("north", "character", op03RobLucci092);
    const excludedId = engine.findCardInZone("north", "character", op04Olin099);

    engine.playCard(op04TruenoBastardo094);

    const koDecision = engine.pendingDecision("effectTargetSelection", "south");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to receive the upgraded cost-6 K.O. range.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger rests its controller's Leader before the effective cost-5 K.O. choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op03RobLucci092, playedOnTurn: 0 },
        ],
      },
      {
        life: [op04TruenoBastardo094],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const selectedId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const excludedId = engine.findCardInZone("south", "character", op03RobLucci092);

    engine.declareAttack(selectedId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const koDecision = engine.pendingDecision("effectTargetSelection", "north");
    const koStep = koDecision.steps[0];
    expect(koStep?.kind).toBe("selectEntity");
    if (koStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose an opposing cost-5 Character.");
    }
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(koStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.leader.rested).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(selectedId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
