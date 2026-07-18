import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01TonyTonyChopper006 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-006 Tony Tony.Chopper", () => {
  test("blocks through the public battle choice, then applies its DON!! x2 attack effect", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01TonyTonyChopper006, attachedDon: 2, playedOnTurn: 0 }],
      },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const chopperId = engine.findCardInZone("south", "character", eb01TonyTonyChopper006);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Chopper's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", chopperId]);
    engine.resolveDecision("battleBlocker", { selectedIds: [chopperId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === chopperId)?.rested,
    ).toBe(true);

    engine.endTurn("north");
    engine.attachDon(chopperId, 2, "south");
    engine.declareAttack(chopperId, attackerId, "south");

    const powerTarget = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(powerTarget?.kind).toBe("selectEntity");
    if (powerTarget?.kind !== "selectEntity") {
      throw new Error("Expected Chopper's opposing Character target.");
    }
    expect(powerTarget.candidates.map((candidate) => candidate.ref.id)).toEqual([attackerId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [attackerId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      attackerId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
