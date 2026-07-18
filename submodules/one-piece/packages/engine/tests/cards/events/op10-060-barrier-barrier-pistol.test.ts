import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op09Yasopp013, op10BarrierBarrierPistol060 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP10-060 Barrier-Barrier Pistol", () => {
  test("Life Trigger activates Main and sends the power-6000 boundary to its owner's deck bottom", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op09Yasopp013],
      },
      { life: [op10BarrierBarrierPistol060] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", op09Yasopp013);
    const deckBefore = engine.getView("north").players.south.deckCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.characters.some((card) => card?.instanceId === targetId)).toBe(false);
    expect(view.players.south.deckCount).toBe(deckBefore + 1);
    expect(view.players.north.activeDon).toBe(0);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
