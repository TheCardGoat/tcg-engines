import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st13-018-gum-gum-jet-spear", () => {
  test("Counter grants 2000 and draws at zero Life, then power expires", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { hand: ["ST13-018"], activeDon: 1, life: 0, deck: ["ST01-006", "ST02-002"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("north", "hand", "ST13-018")] },
      "north",
    );
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("north")] }, "north");
    expect(e.getView("north").players.north.hand.map((c) => c.cardId)).toEqual(["ST01-006"]);
    expect(e.getView("north").players.north.lifeCount).toBe(0);
    expect(e.getView("north").players.north.leader.power).toBe(5000);
  });
  test("Counter at one Life does not draw", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { hand: ["ST13-018"], activeDon: 1, life: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("north", "hand", "ST13-018")] },
      "north",
    );
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("north")] }, "north");
    expect(e.getView("north").players.north.handCount).toBe(0);
    expect(e.getView("north").players.north.lifeCount).toBe(1);
  });

  test("Trigger pays bottom Life and can return that newly added card to top Life", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { life: ["ST13-018", "ST02-002", "ST02-012"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const paid = e.getState().players.north.life[2]!;
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    e.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "north");
    e.resolveDecision("effectTargetSelection", { selectedIds: [paid] }, "north");
    expect(e.getState().players.north.life[0]).toBe(paid);
    expect(e.getView("north").players.north.lifeCount).toBe(2);
    expect(e.getView("north").players.north.handCount).toBe(0);
    expect(e.getState().cards[paid]!.faceUp).toBe(false);
  });
  test("declines the optional Trigger Life payment", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { life: ["ST13-018", "ST02-002", "ST02-012"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    e.resolveDecision("effectOptional", { optionId: "no" }, "north");
    expect(e.getView("north").players.north.lifeCount).toBe(2);
    expect(e.getView("north").players.north.handCount).toBe(0);
    expect(e.getView("north").prompts).toHaveLength(0);
  });
});
