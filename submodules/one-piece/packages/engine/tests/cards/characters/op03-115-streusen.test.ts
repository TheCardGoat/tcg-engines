import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op03CharlottePerospero113,
  op03Napoleon117,
  op03Streusen115,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-115 Streusen", () => {
  test("trashes only a Trigger card before K.O.'ing only a cost-1-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03Streusen115, op03Napoleon117, op03CharlottePerospero113, eb01Doma005],
        activeDon: op03Streusen115.cost,
      },
      { character: [eb01Doma005, eb01Fourtricks025] },
    );
    const triggerId = engine.findCardInZone("south", "hand", op03Napoleon117);
    const otherTriggerId = engine.findCardInZone("south", "hand", op03CharlottePerospero113);
    const nonTriggerId = engine.findCardInZone("south", "hand", eb01Doma005);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const overBoundaryId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op03Streusen115, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Streusen's Trigger-card cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([
      triggerId,
      otherTriggerId,
    ]);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonTriggerId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [triggerId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Streusen's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(overBoundaryId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(triggerId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.some((card) => card?.instanceId === overBoundaryId)).toBe(
      true,
    );
  });
});
