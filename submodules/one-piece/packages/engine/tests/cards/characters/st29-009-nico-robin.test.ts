import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST29-009", () => {
  test.each(["ST29-001", "ST02-001"])("Trigger named Leader gate %s", (leader) => {
    const e = OnePieceTestEngine.create(
      {},
      { leaderCardId: leader, life: ["ST29-009", "ST02-002"] },
      { activeSeat: "south", firstPlayer: "north" },
    );
    const physical = e.findCardInZone("north", "life", "ST29-009");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().activateLifeTrigger();
    expect(
      e.getView("north").players.north.characters.some((c) => c?.instanceId === physical),
    ).toBe(leader === "ST29-001");
    expect(
      e
        .getView("north")
        .players.north.trash.map((c) => c.instanceId)
        .includes(physical),
    ).toBe(leader !== "ST29-001");
  });
  test("Blocker intercepts actual attack", () => {
    const e = OnePieceTestEngine.create(
      {},
      { character: ["ST29-009"], life: 3 },
      { activeSeat: "south", firstPlayer: "north" },
    );
    const id = e.findCardInZone("north", "character", "ST29-009");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseBlocker(id);
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(id);
  });
  test("declines optional Blocker", () => {
    const e = OnePieceTestEngine.create(
      {},
      { character: ["ST29-009"], life: 3 },
      { activeSeat: "south", firstPlayer: "north" },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().chooseBlocker();
    expect(e.getView("north").players.north.lifeCount).toBe(2);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
  });
});
