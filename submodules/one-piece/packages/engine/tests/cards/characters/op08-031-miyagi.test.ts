import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op01Nekomamushi048, op08Miyagi031 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-031 Miyagi", () => {
  test("on play sets active only a cost-2-or-less Character whose type includes Minks", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08Miyagi031],
      activeDon: op08Miyagi031.cost,
      character: [
        { card: op01Nekomamushi048, rested: true },
        { card: eb01Doma005, rested: true },
        { card: eb01MountainGod018, rested: true },
      ],
    });
    const eligibleId = engine.findCardInZone("south", "character", op01Nekomamushi048);
    const wrongTraitId = engine.findCardInZone("south", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.playCard(op08Miyagi031, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Miyagi's active target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(false);
  });
});
