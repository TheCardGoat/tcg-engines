import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("P099 Luffy", () => {
  test("pays all10DON then reactivates for a second attack", () => {
    const e = OnePieceTestEngine.create({ character: ["P-099"], restedDon: 10, donDeckCount: 0 });
    const id = e.findCardInZone("south", "character", "P-099");
    e.asSouth().attack(id, e.leader("north"));
    const restored = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    restored.asSouth().acceptOptional();
    expect(restored.getView("south").players.south.restedDon).toBe(0);
    expect(restored.getView("south").players.south.donDeckCount).toBe(10);
    expect(restored.getView("south").players.south.characters[0]?.rested).toBe(false);
    restored.asSouth().attack(id, restored.leader("north"));
    // No usable Counter remains, so the Counter Step ends automatically.
    expect(restored.getView("north").players.north.lifeCount).toBe(2);
  });
  test("declines optional DON10 with payment available", () => {
    const e = OnePieceTestEngine.create({ character: ["P-099"], restedDon: 10, donDeckCount: 0 });
    e.asSouth().attack(e.findCardInZone("south", "character", "P-099"), e.leader("north"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.restedDon).toBe(10);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
  });
  test("nineDON cannot pay reactivation", () => {
    const e = OnePieceTestEngine.create({ character: ["P-099"], restedDon: 9 });
    e.asSouth().attack(e.findCardInZone("south", "character", "P-099"), e.leader("north"));
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.restedDon).toBe(9);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
  });
});
