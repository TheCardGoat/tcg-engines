import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST29-005", () => {
  test.each(["ST29-001", "ST02-001"])("Trigger named Leader gate %s", (leader) => {
    const e = OnePieceTestEngine.create(
      {},
      { leaderCardId: leader, life: ["ST29-005", "ST02-002"] },
      { activeSeat: "south", firstPlayer: "north" },
    );
    const physical = e.findCardInZone("north", "life", "ST29-005");
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
  test("declines optional Life Trigger with named Leader", () => {
    const e = OnePieceTestEngine.create(
      {},
      { leaderCardId: "ST29-001", life: ["ST29-005", "ST02-002"] },
      { activeSeat: "south", firstPlayer: "north" },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.resolveDecision("lifeTrigger", { optionId: "no" }, "north");
    expect(e.getView("north").players.north.hand.map((c) => c.cardId)).toContain("ST29-005");
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(0);
  });
});
