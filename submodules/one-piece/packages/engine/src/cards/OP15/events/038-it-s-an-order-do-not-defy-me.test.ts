import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-038 It's an Order! Do Not Defy Me!!", () => {
  test("[Main] freezes a rested cost-8-or-less Character that was given 2 DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-038"], activeDon: 1 },
      {
        character: [{ cardId: "OP13-013", rested: true, attachedDon: 2 }, "OP16-003"],
        activeDon: 5,
      },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("OP15-038");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the freeze target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    engine.endTurn("south");
    engine.endTurn("north");
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === higumaId)
        ?.rested,
    ).toBe(true);
  });

  test("[Counter] saving a [Krieg] with +4000 power during battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-008", rested: true }], hand: ["OP15-038"], activeDon: 5 },
      { character: ["OP16-074"], activeDon: 5 },
    );
    const kriegId = engine.findCardInZone("south", "character", "OP15-008");
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-074", "OP15-008");
    engine.asSouth().chooseCounter("OP15-038");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the [Krieg] target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [kriegId] }, "south");

    // 9000 + 4000 >= 10000: the interceptor survives.
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      kriegId,
    );
  });
});
