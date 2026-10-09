import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST02-016 repel", () => {
  test.each(["0", "1"])("Counter buffs the Leader and optionally readies DON %s", (optionId) => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { hand: ["ST02-016"], activeDon: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const event = e.findCardInZone("north", "hand", "ST02-016");
    const life = e.getView("north").players.north.lifeCount;
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("battleCounter", { selectedIds: [event] }, "north");
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("north")] }, "north");
    expect(e.getView("north").players.north.leader.power).toBe(9000);
    e.resolveDecision("effectSetActiveDon", { optionId }, "north");
    expect(e.getView("north").players.north.activeDon).toBe(Number(optionId));
    expect(e.getView("north").players.north.lifeCount).toBe(life);
    expect(e.getView("north").players.north.leader.power).toBe(5000);
  });
});
