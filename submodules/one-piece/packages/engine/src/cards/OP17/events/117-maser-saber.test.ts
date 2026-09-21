import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-117 Maser Saber", () => {
  test("[Counter] saves a defending [Charlotte Linlin] with +3000", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-117"], character: [{ cardId: "OP17-112", rested: true }], activeDon: 5 },
      { character: ["OP17-118"], activeDon: 5 },
    );
    const linlinId = engine.findCardInZone("south", "character", "OP17-112");
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP17-118", "OP17-112");
    engine.asSouth().chooseCounter("OP17-117");
    const boost = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (boost?.kind !== "selectEntity") throw new Error("Expected the boost target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [boost.candidates[0]!.ref.id] },
      "south",
    );

    // 12000 + 3000 >= 12000: Linlin survives.
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      linlinId,
    );
  });

  test("[Counter] resolves as a battle counter", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-117"], activeDon: 5 },
      { activeDon: 5 },
    );

    engine.endTurn("south");
    engine.asNorth().attack(engine.leader("north"), engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP17-117");
    const boost = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    if (boost?.extensions?.resolutionIntent === "effectTargetSelection") {
      engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    }

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP17-117");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
