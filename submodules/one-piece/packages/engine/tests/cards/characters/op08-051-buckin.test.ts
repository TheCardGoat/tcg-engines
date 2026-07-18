import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op08Buckin051, op08EdwardWeevil042 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-051 Buckin", () => {
  test("during your turn gives only an own Edward Weevil +2000 until turn end", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08Buckin051],
      character: [op08EdwardWeevil042, eb01Doma005],
      activeDon: op08Buckin051.cost,
    });
    const weevilId = engine.findCardInZone("south", "character", op08EdwardWeevil042);
    const unrelatedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op08Buckin051, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Buckin's Weevil choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([weevilId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(unrelatedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [weevilId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === weevilId)
        ?.power,
    ).toBe((op08EdwardWeevil042.power ?? 0) + 2000);
    engine.endTurn("south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === weevilId)
        ?.power,
    ).toBe(op08EdwardWeevil042.power);
  });
});
