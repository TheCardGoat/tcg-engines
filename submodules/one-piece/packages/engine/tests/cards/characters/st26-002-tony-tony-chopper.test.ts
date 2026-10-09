import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST26-002 Chopper", () => {
  test.each(["don", "character", "zero"])("returns two DON then mixed rest chooses %s", (kind) => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST26-002"], activeDon: 3, donDeckCount: 7 },
      { activeDon: 1, character: ["ST01-006", "ST02-006"] },
    );
    const target = e.findCardInZone("north", "character", "ST01-006"),
      high = e.findCardInZone("north", "character", "ST02-006");
    e.asSouth().play("ST26-002");
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectMixedRestSelection", "south").steps[0];
    if (p?.kind !== "payCost") throw Error("mixed rest");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([target, "active-don:north:0"]);
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(high);
    e.resolveDecision(
      "effectMixedRestSelection",
      { selectedIds: kind === "zero" ? [] : [kind === "don" ? "active-don:north:0" : target] },
      "south",
    );
    expect(e.getView("north").players.north.activeDon).toBe(kind === "don" ? 0 : 1);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(kind === "character");
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("south").players.south.donDeckCount).toBe(9);
  });
  test("declines optional DON return", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST26-002"], activeDon: 3, donDeckCount: 7 },
      { activeDon: 1, character: ["ST01-006"] },
    );
    e.asSouth().play("ST26-002");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.restedDon).toBe(3);
    expect(e.getView("south").players.south.donDeckCount).toBe(7);
    expect(e.getView("north").players.north.activeDon).toBe(1);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
  });
  test("Blocker intercepts attack and protects Life", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST26-002"], life: 2 },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    const c = e.findCardInZone("south", "character", "ST26-002");
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker(c);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(c);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
  });
  test("declines Blocker and remains active", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST26-002"], life: 2 },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker();
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
});
