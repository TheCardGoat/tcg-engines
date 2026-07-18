import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op05Hotori111, op05Kotori103 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-103 Kotori", () => {
  test("with Hotori, K.O.'s up to one Character at the opponent-Life cost boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05Kotori103],
        character: [op05Hotori111],
        activeDon: op05Kotori103.cost,
      },
      {
        life: [eb01Doma005, eb01Fourtricks025],
        character: [eb01Doma005, eb01Fourtricks025],
      },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op05Kotori103, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Kotori's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      eligibleId,
    );
  });

  test("without Hotori, does not offer a K.O. target", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05Kotori103],
        activeDon: op05Kotori103.cost,
      },
      {
        life: [eb01Doma005],
        character: [eb01Doma005],
      },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op05Kotori103, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });
});
