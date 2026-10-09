import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-101 Mahoroba", () => {
  test("[Main] paid Event is the tenth trash card and enables K.O. after power", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP16-101"],
        trash: Array.from({ length: 9 }, () => "OP13-013"),
        activeDon: 2,
      },
      { character: ["OP16-002"], activeDon: 5 },
    );
    const izoId = engine.findCardInZone("north", "character", "OP16-002");
    const base = engine.getView("south").players.south.leader?.power ?? 0;

    engine.playCard("OP16-101");
    const boost = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (boost?.kind !== "selectEntity") throw new Error("Expected the boost target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.getView("south").players.south.leader!.instanceId!] },
      "south",
    );
    expect(engine.getView("south").players.south.leader?.power).toBe(base + 3000);

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [izoId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      izoId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("with fewer than 10 trash cards the K.O. does not trigger", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-101"], trash: 3, activeDon: 2 },
      { character: ["OP16-002"], activeDon: 5 },
    );
    const izoId = engine.findCardInZone("north", "character", "OP16-002");

    engine.playCard("OP16-101");
    const boost = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (boost?.kind !== "selectEntity") throw new Error("Expected the boost target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    expect(engine.getView("south").players.north.characters.map((c) => c?.instanceId)).toContain(
      izoId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Life Trigger returns only Yamato from the owner's trash to hand", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP01-001", life: ["OP16-101"], trash: ["OP01-121", "EB01-005"] },
      { leaderCardId: "OP01-001", activeDon: 2 },
      { activeSeat: "north" },
    );
    const yamato = engine.asSouth().findInZone("trash", "OP01-121");
    engine.asNorth().attachDon(engine.asNorth().leader(), 2);
    engine.asNorth().attack(engine.asNorth().leader(), engine.asSouth().leader());
    engine.asSouth().activateLifeTrigger();
    const step = engine.asSouth().pendingDecision("effectTargetSelection").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected Yamato recovery choice");
    expect(step.candidates.map((card) => card.ref.id)).toEqual([yamato]);
    engine.asSouth().chooseTargets(yamato);
    expect(
      engine
        .asSouth()
        .view()
        .players.south.hand.map((card) => card.instanceId),
    ).toEqual([yamato]);
    expect(
      engine
        .asSouth()
        .view()
        .players.south.trash.map((card) => card.cardId),
    ).toContain("OP16-101");
  });
});
