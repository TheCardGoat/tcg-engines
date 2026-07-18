import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op03Patty049 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-049 Patty", () => {
  test("at 20 deck cards may return a cost-3-or-less Character from either field", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03Patty049],
        character: [eb01Doma005],
        deck: Array.from({ length: 20 }, () => eb01Doma005),
        activeDon: op03Patty049.cost,
      },
      { character: [eb01Fourtricks025, eb01MountainGod018] },
    );
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op03Patty049, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Patty's return target.");
    const candidateIds = target.candidates.map((candidate) => candidate.ref.id);
    expect(candidateIds).toContain(ownId);
    expect(candidateIds).toContain(opposingId);
    expect(candidateIds).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      ownId,
    );
  });

  test("does not offer a return target above 20 deck cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03Patty049],
      deck: Array.from({ length: 21 }, () => eb01Doma005),
      activeDon: op03Patty049.cost,
    });

    engine.playCard(op03Patty049, "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
