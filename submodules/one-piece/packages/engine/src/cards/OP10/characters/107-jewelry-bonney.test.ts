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
  });
});
