import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-102", () => {
  test("battle KO revives a different 4000-power Character and excludes Oven", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ cardId: "OP17-102", rested: true }],
        trash: ["OP17-102", "OP17-107", "OP02-018"],
        hand: [],
      },
      { character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const target = e.findCardInZone("south", "trash", "OP17-107");
    e.asNorth().attack("EB01-018", "OP17-102");
    const step = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (step.kind !== "selectEntity") throw new Error("Expected revival");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.resolveDecision("effectPlaySelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(target);
  });

  test("Life Trigger plays this physical Oven without a DON!! payment", () => {
    const e = OnePieceTestEngine.create(
      { life: ["OP17-102", "ST02-002"], activeDon: 0 },
      {},
      { activeSeat: "north" },
    );
    const oven = e.findCardInZone("south", "life", "OP17-102");
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(oven);
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.activeDon).toBe(0);
  });
  test("declines OnKO play with an eligible 4000-power card in trash", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-102", rested: true }], trash: ["OP17-107"] },
      {},
      { activeSeat: "north" },
    );
    const target = e.findCardInZone("south", "trash", "OP17-107");
    e.asNorth().attack(e.leader("north"), "OP17-102");
    e.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(target);
  });
});
