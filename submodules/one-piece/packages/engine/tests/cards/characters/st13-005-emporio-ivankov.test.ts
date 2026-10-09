import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st13-005-emporio-ivankov", () => {
  test("pays bottom Life, reveals exact-cost-five hand Character and puts that same card face-down atop Life", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST13-005", "ST13-015", "ST02-006", "ST10-016"],
      activeDon: 3,
      life: ["ST02-002", "ST02-012"],
    });
    const target = e.findCardInZone("south", "hand", "ST13-015");
    const old = e.getState().players.south.life[1]!;
    e.playCard("ST13-005", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectCostTrashLife", { optionId: "bottom" }, "south");
    const step = e.pendingDecision("effectRevealFromHandSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("reveal");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.resolveDecision("effectRevealFromHandSelection", { selectedIds: [target] }, "south");
    expect(e.getState().players.south.life[0]).toBe(target);
    expect(e.getState().cards[target]!.faceUp).toBe(false);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(old);
    expect(e.getView("south").players.south.handCount).toBe(2);
  });
  test("declines the optional Life cost and keeps both Life and candidate hand card", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST13-005", "ST13-015"], activeDon: 3, life: 2 });
    e.playCard("ST13-005", "south");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST13-015"]);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("Blocker redirects an attack", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { character: ["ST13-005"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const blocker = e.findCardInZone("north", "character", "ST13-005");
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("battleBlocker", { selectedIds: [blocker] }, "north");
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(blocker);
    expect(e.getView("south").players.north.lifeCount).toBe(4);
  });

  test("declines Blocker and leaves the Character active", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { character: ["ST13-005"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("battleBlocker", { selectedIds: [] }, "north");
    expect(e.getView("north").players.north.lifeCount).toBe(3);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
    expect(e.getView("north").players.north.trash).toHaveLength(0);
  });

  test("pays Life but declines the optional reveal without moving another hand card", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST13-005", "ST13-015"],
      activeDon: 3,
      life: ["ST02-002", "ST02-012"],
    });
    e.playCard("ST13-005", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectCostTrashLife", { optionId: "top" }, "south");
    e.resolveDecision("effectRevealFromHandSelection", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["ST13-015"]);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
