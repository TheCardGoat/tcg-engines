import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op11CharlottePraline029 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-029 Charlotte Praline", () => {
  test("rests only a cost-1 opponent on play, then can block a later attack", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op11CharlottePraline029],
        activeDon: op11CharlottePraline029.cost,
      },
      {
        character: [eb01Doma005, { card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op11CharlottePraline029, "south");
    const pralineId = engine.findCardInZone("south", "character", op11CharlottePraline029);
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Praline's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    engine.endTurn("south");
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Praline as Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(pralineId);
    engine.resolveDecision("battleBlocker", { selectedIds: [pralineId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(pralineId);
  });
});
