import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005 } from "@tcg/op-cards";
import { op10JewelryBonney107 } from "../../../../../cards/src/cards/OP10/characters/107-jewelry-bonney.ts";
import { op10Urouge101 } from "../../../../../cards/src/cards/OP10/characters/101-urouge.ts";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-107 Jewelry Bonney", () => {
  test("offers its top-or-bottom Life cost before adding a cost-5 Supernovas Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10JewelryBonney107, op10Urouge101],
      life: [eb01Doma005, eb01Doma005],
      activeDon: 3,
    });
    engine.playCard(op10JewelryBonney107, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostAddLifeToHand", "south").steps[0];
    expect(cost?.kind).toBe("chooseOption");
    engine.resolveDecision("effectCostAddLifeToHand", { optionId: "top" }, "south");
    const urougeId = engine.findCardInZone("south", "hand", op10Urouge101);
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Bonney's cost-5 target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(urougeId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [urougeId] }, "south");
    expect(engine.getView("south").players.south.life[0]).toMatchObject({
      instanceId: urougeId,
      cardId: op10Urouge101.id,
      hidden: false,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10JewelryBonney107, op10Urouge101],
      life: [eb01Doma005, eb01Doma005],
      activeDon: 3,
    });
    engine.playCard(op10JewelryBonney107, "south");
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
