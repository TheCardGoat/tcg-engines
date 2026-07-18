import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op07Capote063, op07Foxy059, op07Foxy071 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-063 Capote", () => {
  test("may return one DON!! to stop only an opposing cost-6-or-less Character through its next turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op07Foxy059,
        hand: [op07Capote063],
        activeDon: op07Capote063.cost + 1,
      },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: op07Foxy071, playedOnTurn: 0 },
        ],
      },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", op07Foxy071);

    engine.playCard(op07Capote063, "south");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const donCost = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(donCost?.kind).toBe("payCost");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Capote's attack lock target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 3 });
    engine.endTurn("south");
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: eligibleId,
        targetId: engine.leader("south"),
      }).reason,
    ).toMatch(/cannot attack/i);

    engine.endTurn("north");
    engine.endTurn("south");
    engine.declareAttack(eligibleId, engine.leader("south"), "north");
  });
});
