import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-095 Sanji", () => {
  test("Event payment buffs the Leader for one battle and uses OPT", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST02-012"] },
      { character: ["P-095"], hand: ["ST01-015", "ST01-016", "ST01-009"], life: 3 },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().acceptOptional();
    const pay = e.findCardInZone("north", "hand", "ST01-015");
    e.resolveDecision("effectCostTrashFromHand", { selectedIds: [pay] }, "north");
    e.asNorth().chooseTargets(e.leader("north"));
    expect(e.getView("north").players.north.leader.power).toBe(7000);
    e.asNorth().chooseCounter();
    expect(e.getView("north").players.north.leader.power).toBe(5000);
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    e.asSouth().attack(e.findCardInZone("south", "character", "ST02-012"), e.leader("north"));
    expect(e.pendingDecision("battleCounter", "north").steps[0]?.kind).toBe("selectEntity");
    e.asNorth().chooseCounter();
    expect(e.getView("north").players.north.handCount).toBe(2);
  });
  test("declines optional Event payment and preserves its physical card", () => {
    const e = OnePieceTestEngine.create(
      {},
      { character: ["P-095"], hand: ["ST01-015", "ST01-009"], life: 3 },
    );
    const pay = e.findCardInZone("north", "hand", "ST01-015");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().declineOptional();
    e.asNorth().chooseCounter();
    expect(e.findCardInZone("north", "hand", "ST01-015")).toBe(pay);
    expect(e.getView("north").players.north.lifeCount).toBe(2);
  });
  test("Event cost excludes Characters and can protect a Character for the battle", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST04-003"] },
      {
        character: [{ cardId: "P-095", rested: true }],
        hand: ["ST01-015", "ST01-016", "ST01-009"],
      },
    );
    const target = e.findCardInZone("north", "character", "P-095");
    e.asSouth().attack(e.findCardInZone("south", "character", "ST04-003"), target);
    e.asNorth().acceptOptional();
    const p = e.pendingDecision("effectCostTrashFromHand", "north").steps[0];
    if (p?.kind !== "payCost") throw Error("cost");
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(
      e.findCardInZone("north", "hand", "ST01-009"),
    );
    e.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: [e.findCardInZone("north", "hand", "ST01-015")] },
      "north",
    );
    e.asNorth().chooseTargets(target);
    expect(e.getView("north").players.north.characters[0]?.power).toBe(9000);
    e.asNorth().chooseCounter();
    expect(e.getView("north").players.north.trash.some((c) => c.instanceId === target)).toBe(true);
  });
  test("a Character in hand cannot pay the Event-only discard cost", () => {
    const e = OnePieceTestEngine.create({}, { character: ["P-095"], hand: ["ST01-009"], life: 3 });
    const id = e.findCardInZone("north", "hand", "ST01-009");
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    expect(e.pendingDecision("battleCounter", "north").steps[0]).toBeDefined();
    e.asNorth().chooseCounter();
    expect(e.findCardInZone("north", "hand", "ST01-009")).toBe(id);
    expect(e.getView("north").players.north.lifeCount).toBe(2);
  });
});
