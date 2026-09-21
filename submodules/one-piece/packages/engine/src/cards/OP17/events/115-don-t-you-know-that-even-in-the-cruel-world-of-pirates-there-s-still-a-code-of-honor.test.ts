import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-115 Don't You Know That Even in the Cruel World of Pirates There's Still a Code of Honor?!", () => {
  test("[Main] gives the [Charlotte Linlin] Leader [Unblockable]", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP03-077", hand: ["OP17-115"], activeDon: 5 },
      {},
    );

    engine.playCard("OP17-115");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the unblockable target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [target.candidates[0]!.ref.id] },
      "south",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Counter] boosts a [Charlotte Linlin] Character with +4000", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-115"], character: [{ cardId: "OP17-112", rested: true }], activeDon: 5 },
      { character: ["OP16-004"], activeDon: 5 },
    );
    const linlinId = engine.findCardInZone("south", "character", "OP17-112");
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    const curielId = engine.findCardInZone("north", "character", "OP16-004");
    engine.declareAttack(curielId, linlinId, "north");
    engine.asSouth().chooseCounter("OP17-115");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the boost target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [linlinId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });
});
