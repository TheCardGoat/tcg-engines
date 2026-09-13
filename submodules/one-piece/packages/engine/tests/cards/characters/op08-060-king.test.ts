import { describe, expect, test } from "vite-plus/test";
import { op08King060 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-060 King", () => {
  test("may return a DON!! and gains Rush when the opponent has at least 5 field DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op08King060], activeDon: op08King060.cost + 1 },
      { activeDon: 5 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.playCard(op08King060, "south");
    const kingId = engine.findCardInZone("south", "character", op08King060);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    expect(() => engine.declareAttack(kingId, engine.leader("north"), "south")).not.toThrow();
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
  });

  test("may pay the DON!! cost but gains no Rush below the opponent threshold", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op08King060], activeDon: op08King060.cost + 1 },
      { activeDon: 4 },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op08King060, "south");
    const kingId = engine.findCardInZone("south", "character", op08King060);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    expect(() => engine.declareAttack(kingId, engine.leader("north"), "south")).toThrow();
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op08King060], activeDon: op08King060.cost + 1 },
      { activeDon: 5 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.playCard(op08King060, "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
