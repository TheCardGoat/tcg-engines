import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-107", () => {
  test("Life damage activates the Trigger and plays the same physical card", () => {
    const e = OnePieceTestEngine.create(
      { life: ["OP17-107", "ST02-002"], hand: [] },
      {},
      { activeSeat: "north" },
    );
    const physical = e.findCardInZone("south", "life", "OP17-107");
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    expect(
      e.getView("south").players.south.characters.some((c) => c?.instanceId === physical),
    ).toBe(true);
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.lifeCount).toBe(1);
  });

  test("declines Life Trigger and retains the same card in hand", () => {
    const e = OnePieceTestEngine.create(
      { life: ["OP17-107", "ST02-002"] },
      {},
      { activeSeat: "north" },
    );
    const id = e.findCardInZone("south", "life", "OP17-107");
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.resolveDecision("lifeTrigger", { optionId: "take" }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([id]);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
  });
});
