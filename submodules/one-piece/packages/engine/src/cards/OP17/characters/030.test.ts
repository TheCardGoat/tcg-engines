import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";
describe("OP17-030 Monkey.D.Luffy", () => {
  test("pays one DON!! for Rush and attacks the Leader on the turn played", () => {
    const e = OnePieceTestEngine.create({ hand: ["OP17-030"], activeDon: 5 }, { life: 3 });
    e.playCard("OP17-030");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.south.restedDon).toBe(5);
    e.declareAttack(e.findCardInZone("south", "character", "OP17-030"), e.leader("north"), "south");
    expect(e.getView("south").players.north.lifeCount).toBe(2);
  });
  test("declines optional payable DON!! cost and cannot attack on the turn played", () => {
    const e = OnePieceTestEngine.create({ hand: ["OP17-030"], activeDon: 5 });
    e.playCard("OP17-030");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const failed = e.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: e.findCardInZone("south", "character", "OP17-030"),
      targetId: e.leader("north"),
    });
    const v = OnePieceTestEngine.fromState(failed.state).getView("south");
    expect(v.players.south.activeDon).toBe(1);
    expect(v.players.south.restedDon).toBe(4);
    expect(v.players.south.characters[0]?.rested).toBe(false);
  });
  test("five hand cards enable one reactivation and OPT stops a second with rested DON!! remaining", () => {
    const e = OnePieceTestEngine.create({
      character: ["OP17-030"],
      hand: Array(5).fill("EB01-005"),
      restedDon: 2,
    });
    const luffy = e.findCardInZone("south", "character", "OP17-030");
    e.activateEffect(luffy, "activateMain", "south");
    e.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.restedDon).toBe(1);
    const failed = e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: luffy,
      trigger: "activateMain",
    });
    expect(failed.reason).toBe("This effect has already been used this turn.");
    expect(
      OnePieceTestEngine.fromState(failed.state).getView("south").players.south.restedDon,
    ).toBe(1);
  });
  test("six hand cards fail the condition with a rested DON!! available", () => {
    const e = OnePieceTestEngine.create({
      character: ["OP17-030"],
      hand: Array(6).fill("EB01-005"),
      restedDon: 1,
    });
    const failed = e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.findCardInZone("south", "character", "OP17-030"),
      trigger: "activateMain",
    });
    expect(
      OnePieceTestEngine.fromState(failed.state).getView("south").players.south.restedDon,
    ).toBe(1);
  });
});
