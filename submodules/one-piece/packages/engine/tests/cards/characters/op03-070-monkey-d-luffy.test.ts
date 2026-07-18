import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op03Kalifa081,
  op03MonkeyDLuffy070,
  op03RobLucci071,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-070 Monkey.D.Luffy", () => {
  test("returns DON!! and trashes exactly a cost-5 Character to gain Rush", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03MonkeyDLuffy070, eb01MountainGod018, op03RobLucci071, op03Kalifa081],
        activeDon: 7,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const paymentId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const alternatePaymentId = engine.findCardInZone("south", "hand", op03RobLucci071);
    const wrongCostId = engine.findCardInZone("south", "hand", op03Kalifa081);
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.playCard(op03MonkeyDLuffy070, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Luffy's Character cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([paymentId, alternatePaymentId]),
    );
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongCostId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");

    const luffyId = engine.findCardInZone("south", "character", op03MonkeyDLuffy070);
    expect(Object.values(engine.getState().modifiers)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ targetId: luffyId, type: "keyword", keyword: "rush" }),
      ]),
    );
    engine.declareAttack(luffyId, engine.leader("north"), "south");
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
  });

  test("may decline without paying either cost or gaining Rush", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op03MonkeyDLuffy070, eb01MountainGod018], activeDon: 7 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.playCard(op03MonkeyDLuffy070, "south");
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const luffyId = engine.findCardInZone("south", "character", op03MonkeyDLuffy070);
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: luffyId,
        targetId: engine.leader("north"),
      }).reason,
    ).toContain("cannot attack");
    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 1,
      donDeckCount: donDeckBefore,
      handCount: 1,
    });
  });
});
