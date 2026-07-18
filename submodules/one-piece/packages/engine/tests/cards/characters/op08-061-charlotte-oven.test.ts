import { describe, expect, test } from "vite-plus/test";
import { eb01Fourtricks025, eb01MountainGod018, op08CharlotteOven061 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-061 Charlotte Oven", () => {
  test("when attacking may return a DON!! to K.O. only a cost-3-or-less opponent", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op08CharlotteOven061, playedOnTurn: 0 }], activeDon: 1 },
      { character: [eb01Fourtricks025, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ovenId = engine.findCardInZone("south", "character", op08CharlotteOven061);
    const eligibleId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(ovenId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Oven's K.O. choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      eligibleId,
    );
  });

  test("may decline without returning DON!! or K.O.'ing a Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op08CharlotteOven061, playedOnTurn: 0 }], activeDon: 1 },
      { character: [eb01Fourtricks025] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ovenId = engine.findCardInZone("south", "character", op08CharlotteOven061);
    const targetId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.declareAttack(ovenId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(1);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
  });
});
