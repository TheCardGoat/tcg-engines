import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";
describe("OP17-009 Haruta", () => {
  test("On Play K.O.s base2000 and excludes base3000; opponent-turn power then expires", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-009"], activeDon: 4 },
      { character: ["OP17-004", "OP13-013"] },
    );
    const target = e.findCardInZone("north", "character", "OP17-004");
    e.playCard("OP17-009");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected base-power target selection");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toEqual([target]);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    e.endTurn("south");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(8000);
    e.endTurn("north");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
  });
});
