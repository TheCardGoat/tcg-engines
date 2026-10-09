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
  test.each([0, 1, 2, 3])(
    "Life Trigger's opponent discards %i available cards; only three prevent KO",
    (handCount) => {
      const e = OnePieceTestEngine.create(
        { life: ["OP17-117", "ST02-002"] },
        { hand: Array.from({ length: handCount }, () => "ST02-002"), character: ["EB01-005"] },
        { activeSeat: "north", firstPlayer: "south" },
      );
      const victim = e.findCardInZone("north", "character", "EB01-005");
      e.asNorth().attack(e.leader("north"), e.leader("south"));
      e.asSouth().activateLifeTrigger();
      e.resolveDecision("effectActionChoice", { optionId: "0" }, "north");
      expect(e.getView("north").players.north.handCount).toBe(0);
      expect(
        e.getView("north").players.north.trash.filter((c) => c.cardId === "ST02-002"),
      ).toHaveLength(handCount);
      if (handCount < 3) {
        const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
        if (step.kind !== "selectEntity") throw new Error("Expected controller's KO choice");
        expect(step.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([victim]);
        e.asSouth().chooseTargets(victim);
      }
      expect(
        e.getView("south").players.north.characters.some((c) => c?.instanceId === victim),
      ).toBe(handCount === 3);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
  test("Life Trigger's opponent may keep three cards and allow the controller's KO", () => {
    const e = OnePieceTestEngine.create(
      { life: ["OP17-117", "ST02-002"] },
      { hand: ["ST02-002", "ST02-002", "ST02-002"], character: ["EB01-005"] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    e.resolveDecision("effectActionChoice", { optionId: "1" }, "north");
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "EB01-005"));
    expect(e.getView("north").players.north.handCount).toBe(3);
    expect(e.getView("south").players.north.trash.map((c) => c.cardId)).toContain("EB01-005");
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
