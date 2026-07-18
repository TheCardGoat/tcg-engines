import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op06Cerberus087,
  op06DrHogback090,
  op06Taralan089,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-090 Dr. Hogback", () => {
  test("orders two trash cards as its optional cost, then recovers another Thriller Bark Pirates card", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06DrHogback090],
      trash: [eb01Doma005, eb01Fourtricks025, op06Cerberus087, op06Taralan089, op06DrHogback090],
      activeDon: op06DrHogback090.cost,
    });
    const firstCostId = engine.findCardInZone("south", "trash", eb01Doma005);
    const secondCostId = engine.findCardInZone("south", "trash", eb01Fourtricks025);
    const eligibleId = engine.findCardInZone("south", "trash", op06Cerberus087);
    const excludedNameId = engine.findCardInZone("south", "trash", op06DrHogback090);

    engine.playCard(op06DrHogback090, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 2, max: 2, ordered: true });
    engine.resolveDecision(
      "effectCostReturnTrashToDeck",
      { selectedIds: [secondCostId, firstCostId] },
      "south",
    );

    const recover = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recover).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (recover?.kind !== "selectEntity") throw new Error("Expected Dr. Hogback's trash recovery.");
    expect(recover.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(recover.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedNameId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      eligibleId,
    );
  });
});
