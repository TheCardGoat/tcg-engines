import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-008 Distorted Future", () => {
  test("[Main] with 2-or-less Life gives -3000 to an opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["EB04-008"],
        life: ["OP13-013", "EB01-005"],
        activeDon: 5,
      },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const bennId = engine.findCardInZone("north", "character", "OP16-012");

    engine.playCard("EB04-008");
    engine.acceptLeadingOptional("south");
    const drop = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (drop?.kind !== "selectEntity") throw new Error("Expected the drop target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [bennId] }, "south");
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === bennId)?.power,
    ).toBe(3000);
  });

  test("[Counter] saves the Leader with +3000 power", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["EB04-008"], life: ["OP13-013", "EB01-005"], activeDon: 5 },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-012", engine.asSouth().leader());
    engine.asSouth().chooseCounter("EB04-008");
    // The lone Leader target auto-selects for the +3000 boost.
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });
});
