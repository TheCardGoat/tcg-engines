import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op11MermanCombatUltramarine116 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP11-116 Merman Combat Ultramarine", () => {
  test("Main offers both fields and places the chosen Character in its owner's Life face-up", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op11MermanCombatUltramarine116],
        character: [eb01Doma005],
        activeDon: 6,
      },
      { character: [eb01MountainGod018] },
    );
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op11MermanCombatUltramarine116);
    const decision = engine.pendingDecision("effectTargetSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity")
      throw new Error("Expected an owner-neutral Character choice.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([ownId, opposingId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "south");
    engine.resolveDecision("effectLifePosition", { optionId: "bottom" }, "south");

    expect(engine.getState().players.north.life.at(-1)).toBe(opposingId);
    expect(engine.getState().cards[opposingId]?.faceUp).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger places only an opposing cost-4-or-less Character in owner Life face-up", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { life: [op11MermanCombatUltramarine116] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");
    engine.resolveDecision("effectLifePosition", { optionId: "top" }, "north");

    expect(engine.getState().players.south.life[0]).toBe(targetId);
    expect(engine.getState().cards[targetId]?.faceUp).toBe(true);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
