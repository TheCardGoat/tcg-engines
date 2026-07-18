import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Koza004 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-004 Koza", () => {
  test("pays the active-Leader power cost before choosing the opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Koza004, playedOnTurn: 0 }] },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kozaId = engine.findCardInZone("south", "character", eb01Koza004);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(kozaId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Koza's opposing target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(0);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      0,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
