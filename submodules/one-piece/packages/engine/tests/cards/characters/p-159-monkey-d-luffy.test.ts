import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-159", () => {
  test.each([0, 1])("On K.O. needs DON on Leader, boundary %i", (don) => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST01-001",
        activeDon: 1,
        character: [{ cardId: "P-159", rested: true }],
        hand: ["ST01-012", "EB01-025", "OP05-119"],
      },
      { character: ["OP16-003"] },
    );
    if (don) e.attachDon(e.leader("south"), 1, "south");
    e.endTurn("south");
    const target = e.findCardInZone("south", "hand", "ST01-012");
    e.asNorth().attack("OP16-003", "P-159");
    e.asSouth().chooseCounter();
    if (don) {
      const s = e.pendingDecision("effectPlaySelection", "south").steps[0];
      if (s.kind !== "selectEntity") throw Error("play");
      expect(s.candidates.map((c) => c.ref.id)).toEqual([target]);
      e.resolveDecision("effectPlaySelection", { selectedIds: [target] }, "south");
    }
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === target)).toBe(
      Boolean(don),
    );
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
