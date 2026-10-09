import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("P101 Chopper", () => {
  test("OnPlay attaches one rested payment DON to own Leader", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-101"], activeDon: 4 });
    e.asSouth().play("P-101");
    e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.leader.attachedDon).toBe(1);
    expect(e.getView("south").players.south.restedDon).toBe(3);
    expect(e.getView("north").players.north.leader.attachedDon).toBe(0);
  });
  test("declines optional restedDON transfer", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-101"], activeDon: 4 });
    e.asSouth().play("P-101");
    e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.restedDon).toBe(4);
    expect(e.getView("south").players.south.leader.attachedDon).toBe(0);
  });
  test("Blocker intercepts and isKOd instead of Leader taking Life", () => {
    const e = OnePieceTestEngine.create({}, { character: ["P-101"], life: 3 });
    const id = e.findCardInZone("north", "character", "P-101");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseBlocker(id);
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(id);
  });
  test("declines optional Blocker", () => {
    const e = OnePieceTestEngine.create({}, { character: ["P-101"], life: 3 });
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseBlocker();
    expect(e.getView("north").players.north.lifeCount).toBe(2);
  });
});
