import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op05Gedatsu102 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-102 Gedatsu", () => {
  test("K.O.'s up to one Character whose cost does not exceed the opponent's Life count", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05Gedatsu102],
        activeDon: op05Gedatsu102.cost,
      },
      {
        life: [eb01Doma005, eb01Fourtricks025],
        character: [eb01Doma005, eb01Fourtricks025],
      },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op05Gedatsu102, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Gedatsu's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(tooExpensiveId);
    expect(view.prompts).toHaveLength(0);
  });
});
