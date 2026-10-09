import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST08-007 Nefeltari Vivi", () => {
  test("Blocker intercepts the Leader attack", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST08-007"] },
      { character: [{ cardId: "ST08-010", playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const vivi = e.findCardInZone("south", "character", "ST08-007"),
      life = e.getView("south").players.south.lifeCount;
    e.asNorth().attack(e.findCardInZone("north", "character", "ST08-010"), e.leader("south"));
    e.asSouth().chooseBlocker(vivi);
    expect(e.getView("south").players.south.lifeCount).toBe(life);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(vivi);
  });
  test("Life Trigger plays the same physical card without DON payment", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST08-007"] },
      { character: [{ cardId: "ST08-010", playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const vivi = e.findCardInZone("south", "life", "ST08-007");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST08-010"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(vivi);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("south").players.south.activeDon).toBe(0);
  });
});
