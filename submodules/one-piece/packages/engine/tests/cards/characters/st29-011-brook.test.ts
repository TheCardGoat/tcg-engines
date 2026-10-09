import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST29-011 Brook", () => {
  test("Blocker redirects battle to Brook", () => {
    const e = OnePieceTestEngine.create(
      {},
      { character: ["ST29-011"], life: 3 },
      { activeSeat: "south", firstPlayer: "north" },
    );
    const id = e.findCardInZone("north", "character", "ST29-011");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseBlocker(id);
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(id);
  });
  test("declines optional Blocker", () => {
    const e = OnePieceTestEngine.create(
      {},
      { character: ["ST29-011"], life: 3 },
      { activeSeat: "south", firstPlayer: "north" },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseBlocker();
    expect(e.getView("north").players.north.lifeCount).toBe(2);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
  });
});
