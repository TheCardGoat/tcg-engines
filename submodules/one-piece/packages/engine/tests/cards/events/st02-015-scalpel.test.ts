import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST02-015 scalpel", () => {
  test.each(["0", "1"])("Counter buffs the Leader and optionally readies DON %s", (optionId) => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { hand: ["ST02-015"], activeDon: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const event = e.findCardInZone("north", "hand", "ST02-015");
    const life = e.getView("north").players.north.lifeCount;
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("battleCounter", { selectedIds: [event] }, "north");
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("north")] }, "north");
    expect(e.getView("north").players.north.leader.power).toBe(7000);
    e.resolveDecision("effectSetActiveDon", { optionId }, "north");
    expect(e.getView("north").players.north.activeDon).toBe(Number(optionId));
    expect(e.getView("north").players.north.lifeCount).toBe(life);
    expect(e.getView("north").players.north.leader.power).toBe(5000);
  });
  test("Life Trigger readies up to two DON", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { life: ["ST02-015"], restedDon: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    e.resolveDecision("effectSetActiveDon", { optionId: "2" }, "north");
    expect(e.getView("north").players.north).toMatchObject({ activeDon: 2, restedDon: 0 });
  });
});
