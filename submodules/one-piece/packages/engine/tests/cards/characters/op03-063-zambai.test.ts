import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op03Iceburg058, op03Zambai063 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-063 Zambai", () => {
  test("may return DON!! and draws with an included Water Seven Leader trait", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op03Iceburg058,
      hand: [op03Zambai063],
      deck: [eb01Doma005, eb01Doma005],
      activeDon: op03Zambai063.cost + 1,
    });
    const handBefore = engine.getView("south").players.south.handCount;
    engine.playCard(op03Zambai063, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    expect(engine.getView("south").players.south.handCount).toBe(handBefore);
  });

  test("may pay with a nonmatching Leader but does not draw, or decline entirely", () => {
    const paid = OnePieceTestEngine.create({
      hand: [op03Zambai063],
      deck: [eb01Doma005],
      activeDon: op03Zambai063.cost + 1,
    });
    paid.playCard(op03Zambai063, "south");
    const handBefore = paid.getView("south").players.south.handCount;
    paid.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    paid.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    expect(paid.getView("south").players.south.handCount).toBe(handBefore);

    const declined = OnePieceTestEngine.create({
      hand: [op03Zambai063],
      activeDon: op03Zambai063.cost + 1,
    });
    declined.playCard(op03Zambai063, "south");
    const donBefore = declined.getView("south").players.south.activeDon;
    declined.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(declined.getView("south").players.south.activeDon).toBe(donBefore);
  });

  test("is a Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op03Zambai063] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const zambaiId = engine.findCardInZone("south", "character", op03Zambai063);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Zambai's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(zambaiId);
  });
});
