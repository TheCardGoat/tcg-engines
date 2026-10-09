import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-108", () => {
  test("Life Trigger rests a cost-six-or-less Character without playing the source", () => {
    const e = OnePieceTestEngine.create(
      { life: ["OP17-108", "ST02-002"], hand: [] },
      { character: ["OP17-008", "OP17-027"] },
      { activeSeat: "north" },
    );
    const id = e.findCardInZone("north", "character", "OP17-008");
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step.kind !== "selectEntity") throw new Error("Expected rest");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([id]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [id] }, "south");
    expect(e.getView("south").players.north.characters[0]?.rested).toBe(true);
    expect(e.getView("south").players.south.trash.some((c) => c.cardId === "OP17-108")).toBe(true);
  });

  test("Blocker redirects an attack and preserves Leader Life", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP17-108"], life: 3 },
      {},
      { activeSeat: "north" },
    );
    const id = e.findCardInZone("south", "character", "OP17-108");
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.resolveDecision("battleBlocker", { selectedIds: [id] }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(3);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toEqual([id]);
  });
});
