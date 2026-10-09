import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST04-002 Ulti", () => {
  test("pays DON to play only Page One with cost 4 or less", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST04-002", "ST04-012", "OP08-092", "ST04-013"],
      activeDon: 5,
    });
    const page = e.findCardInZone("south", "hand", "ST04-012");
    e.asSouth().play("ST04-002");

    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    const step = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("play");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([page]);
    e.asSouth().choosePlay(page);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === page)?.rested,
    ).toBe(false);
  });
  test("declines DON payment and keeps Page One in hand", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST04-002", "ST04-012", "OP08-092", "ST04-013"],
      activeDon: 5,
    });
    const page = e.findCardInZone("south", "hand", "ST04-012");
    e.asSouth().play("ST04-002");

    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(page);
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
  });
});
