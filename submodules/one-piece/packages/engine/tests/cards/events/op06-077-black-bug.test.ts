import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01Hajrudin018, op05Sabo007, op06BlackBug077 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP06-077 Black Bug", () => {
  test("Main compares live DON!! fields after Event payment before the effective cost-5 return", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06BlackBug077],
        activeDon: 4,
      },
      {
        activeDon: 4,
        character: [eb01MountainGod018, op05Sabo007],
      },
    );
    const selectedId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const excludedId = engine.findCardInZone("north", "character", op05Sabo007);

    engine.playCard(op06BlackBug077);

    const returnDecision = engine.pendingDecision("effectTargetSelection", "south");
    const returnStep = returnDecision.steps[0];
    expect(returnStep?.kind).toBe("selectEntity");
    if (returnStep?.kind !== "selectEntity") {
      throw new Error("Expected the equal-DON!! effective cost-5 return choice.");
    }
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    expect(engine.getState().players.north.deck.at(-1)).toBe(selectedId);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger uses its narrower effective cost-4 return without Main payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op01Hajrudin018],
      },
      {
        life: [op06BlackBug077],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("south", "character", op01Hajrudin018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const returnDecision = engine.pendingDecision("effectTargetSelection", "north");
    const returnStep = returnDecision.steps[0];
    expect(returnStep?.kind).toBe("selectEntity");
    if (returnStep?.kind !== "selectEntity") {
      throw new Error("Expected the Trigger's effective cost-4 return choice.");
    }
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    expect(engine.getState().players.south.deck.at(-1)).toBe(selectedId);
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
