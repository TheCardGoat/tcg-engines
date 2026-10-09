import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";
describe("OP17-029 Hongo", () => {
  test.each(["0", "1"])(
    "sets %s DON!! active, then rests two cost2 targets but not cost3",
    (count) => {
      const e = OnePieceTestEngine.create(
        { hand: ["OP17-029"], activeDon: 4 },
        { character: ["OP17-012", "ST01-009", "OP17-052"] },
      );
      const first = e.findCardInZone("north", "character", "OP17-012"),
        second = e.findCardInZone("north", "character", "ST01-009"),
        excluded = e.findCardInZone("north", "character", "OP17-052");
      e.playCard("OP17-029");
      e.resolveDecision("effectSetActiveDon", { optionId: count }, "south");
      const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (step?.kind !== "selectEntity") throw new Error("Expected rest targets");
      expect(step.candidates.map((c) => c.ref.id)).toEqual([first, second]);
      e.resolveDecision("effectTargetSelection", { selectedIds: [first, second] }, "south");
      const v = e.getView("south");
      expect(v.players.south.activeDon).toBe(Number(count));
      expect(v.players.south.restedDon).toBe(4 - Number(count));
      expect(v.players.north.characters.filter((c) => c?.rested).map((c) => c?.instanceId)).toEqual(
        [first, second],
      );
      expect(v.players.north.characters.find((c) => c?.instanceId === excluded)?.rested).toBe(
        false,
      );
    },
  );
  test("Blocker redirects damage from the Leader", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP17-029"], life: 3 },
      {},
      { activeSeat: "north" },
    );
    const hongo = e.findCardInZone("south", "character", "OP17-029");
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("battleBlocker", { selectedIds: [hongo] }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(3);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toEqual([hongo]);
  });
});
