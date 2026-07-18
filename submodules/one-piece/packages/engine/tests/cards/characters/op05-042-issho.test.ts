import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op05Issho042, op05JohnGiant044 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-042 Issho", () => {
  test("on play restricts only an opposing cost-7-or-less Character until the start of your next turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05Issho042],
        activeDon: op05Issho042.cost,
      },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op05JohnGiant044, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const tooExpensiveId = engine.findCardInZone("north", "character", op05JohnGiant044);

    engine.playCard(op05Issho042, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Issho's attack-lock target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    engine.endTurn("south");
    expect(() => engine.declareAttack(eligibleId, engine.leader("south"), "north")).toThrow();

    engine.declareAttack(tooExpensiveId, engine.leader("south"), "north");
    engine.endTurn("north");
    engine.endTurn("south");
    expect(() => engine.declareAttack(eligibleId, engine.leader("south"), "north")).not.toThrow();
  });
});
