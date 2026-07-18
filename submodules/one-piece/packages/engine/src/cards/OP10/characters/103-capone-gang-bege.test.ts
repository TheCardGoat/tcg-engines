import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005 } from "@tcg/op-cards";
import { op10CaponeGangBege103 } from "../../../../../cards/src/cards/OP10/characters/103-capone-gang-bege.ts";
import { op10Urouge101 } from "../../../../../cards/src/cards/OP10/characters/101-urouge.ts";
import { OnePieceTestEngine } from "../../../index.ts";

describe('OP10-103 Capone"Gang"Bege', () => {
  test("pays with top or bottom Life and accepts a compound Supernovas Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10CaponeGangBege103, op10Urouge101],
      life: [eb01Doma005, eb01Doma005],
      activeDon: 1,
    });
    engine.playCard(op10CaponeGangBege103, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostAddLifeToHand", "south").steps[0];
    if (cost?.kind !== "chooseOption") throw new Error("Expected Bege's top-or-bottom Life cost.");
    expect(cost.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");
    const urougeId = engine.findCardInZone("south", "hand", op10Urouge101);
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Bege's Supernovas target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(urougeId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [urougeId] }, "south");
    expect(engine.getView("south").players.south.life[0]).toMatchObject({
      instanceId: urougeId,
      cardId: op10Urouge101.id,
      hidden: false,
    });
  });
});
