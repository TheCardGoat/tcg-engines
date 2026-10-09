import { describe, expect, test } from "vite-plus/test";
import { eb01ConquererOfThreeWorldsRagnaraku039 } from "@tcg/op-cards";
import { op15Absalom079 } from "../../../../../cards/src/cards/characters/op15-079-absalom.ts";
import { op15DrHogback084 } from "../../../../../cards/src/cards/characters/op15-084-dr-hogback.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-079 Absalom", () => {
  test("[On K.O.] returns a Thriller Bark Pirates card from trash to hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op15Absalom079],
        trash: [op15DrHogback084],
        activeDon: 2,
      },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const absalomId = engine.findCardInZone("south", "character", op15Absalom079);
    const hogbackId = engine.findCardInZone("south", "trash", op15DrHogback084);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [absalomId] }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Absalom's return target.");
    const candidates = target.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toHaveLength(2);
    expect(candidates).toContain(hogbackId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [hogbackId] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      hogbackId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("Life Trigger activates the recovery without requiring a field K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { life: [op15Absalom079, "OP12-013"], trash: [op15DrHogback084] },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const target = engine.findCardInZone("south", "trash", op15DrHogback084);
    const source = engine.findCardInZone("south", "life", op15Absalom079);
    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    const choice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (choice?.kind !== "selectEntity") throw new Error("Expected recovery choice");
    expect(choice.candidates.map((c) => c.ref.id)).toContain(target);
    expect(choice.candidates.map((c) => c.ref.id)).not.toContain(source);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    const view = engine.getView("south");
    expect(view.players.south.hand.map((c) => c.instanceId)).toContain(target);
    expect(view.players.south.trash.map((c) => c.instanceId)).toContain(source);
    expect(view.players.south.lifeCount).toBe(1);
  });
});
