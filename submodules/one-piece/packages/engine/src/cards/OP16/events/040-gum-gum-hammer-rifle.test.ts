import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-040 Gum-Gum Hammer Rifle", () => {
  test("[Counter] saves the Leader with +3000 power", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-040"], activeDon: 5 },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-012", engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP16-040");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("[Main] freezes a rested cost-6-or-less Character with both names on field", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: ["OP16-095", "OP09-056"],
        hand: ["OP16-040"],
        activeDon: 5,
      },
      { character: [{ cardId: "OP13-013", rested: true }], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("OP16-040");
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
});
