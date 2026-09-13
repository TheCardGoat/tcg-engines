import { describe, expect, test } from "vite-plus/test";
import {
  op03Camie101,
  op03Jabra085,
  op03Kumadori082,
  op03RobLucci092,
  op07Hattori088,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-092 Rob Lucci", () => {
  test("orders two CP cards from trash at deck bottom, then gains Rush", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03RobLucci092],
        trash: [op03Kumadori082, op07Hattori088, op03Jabra085, op03Camie101],
        activeDon: op03RobLucci092.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const firstCpId = engine.findCardInZone("south", "trash", op03Kumadori082);
    const compoundCpId = engine.findCardInZone("south", "trash", op07Hattori088);
    const otherCpId = engine.findCardInZone("south", "trash", op03Jabra085);
    const wrongTraitId = engine.findCardInZone("south", "trash", op03Camie101);
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.playCard(op03RobLucci092, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Lucci's ordered CP cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([firstCpId, compoundCpId, otherCpId]),
    );
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    const paymentOrder = [compoundCpId, firstCpId];
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: paymentOrder }, "south");

    expect(engine.getState().players.south.deck.slice(-2)).toEqual(paymentOrder);
    const lucciId = engine.findCardInZone("south", "character", op03RobLucci092);
    engine.declareAttack(lucciId, engine.leader("north"), "south");
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03RobLucci092],
        trash: [op03Kumadori082, op07Hattori088, op03Jabra085, op03Camie101],
        activeDon: op03RobLucci092.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.playCard(op03RobLucci092, "south");
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
