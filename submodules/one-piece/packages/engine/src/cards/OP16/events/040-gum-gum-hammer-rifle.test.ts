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
  test("Main counts the Luffy Leader and expires after the opponent's next Refresh", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", character: ["OP09-056"], hand: ["OP16-040"], activeDon: 5 },
      { character: [{ cardId: "OP13-013", rested: true }] },
    );
    const target = engine.findCardInZone("north", "character", "OP13-013");
    engine.asSouth().play("OP16-040");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    engine.endTurn("south");
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === target)
        ?.rested,
    ).toBe(true);
    engine.endTurn("north");
    engine.endTurn("south");
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === target)
        ?.rested,
    ).toBe(false);
  });

  test("Main does not freeze without Mr.3 even with the Luffy Leader", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", hand: ["OP16-040"], activeDon: 5 },
      { character: [{ cardId: "OP13-013", rested: true }] },
    );
    engine.asSouth().play("OP16-040");
    expect(engine.getView("south").prompts).toHaveLength(0);
    engine.endTurn("south");
    expect(engine.getView("south").players.north.characters[0]?.rested).toBe(false);
  });
});
