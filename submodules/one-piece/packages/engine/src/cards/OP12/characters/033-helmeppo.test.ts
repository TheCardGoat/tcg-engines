import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op12Helmeppo033 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-033 Helmeppo", () => {
  test("blocks, protects Life, and rests an eligible opposing Character on block", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op12Helmeppo033] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const helmeppoId = engine.findCardInZone("south", "character", op12Helmeppo033);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const restedTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [helmeppoId] }, "south");
    const rest = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(rest).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (rest?.kind !== "selectEntity") throw new Error("Expected Helmeppo's On Block target.");
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toContain(restedTargetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [restedTargetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === restedTargetId)?.rested,
    ).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(helmeppoId);
  });
});
