import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-017", () => {
  test("[Blocker] can block an attack on its Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "EB01-018", playedOnTurn: 0 }], activeDon: 5 },
      { character: ["OP15-017"], activeDon: 5 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", "EB01-018");
    const morganId = engine.findCardInZone("north", "character", "OP15-017");
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    const block = engine.pendingDecision("battleBlocker", "north").steps[0];
    if (block?.kind !== "selectEntity") throw new Error("Expected a Blocker decision.");
    expect(block.candidates.map((candidate) => candidate.ref.id)).toContain(morganId);
    engine.resolveDecision("battleBlocker", { selectedIds: [morganId] }, "north");

    const north = engine.getView("north").players.north;
    expect(north.lifeCount).toBe(lifeBefore);
    expect(north.characters.map((c) => c?.instanceId)).not.toContain(morganId);
    expect(north.trash.map((c) => c.instanceId)).toContain(morganId);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-017", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP15-017",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
