import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op03Striker020, op06Kamakiri102 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-102 Kamakiri", () => {
  test("K.O.s only an opposing cost-2-or-less Character and spends Once Per Turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op06Kamakiri102], stage: op03Striker020 },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const kamakiriId = engine.findCardInZone("south", "character", op06Kamakiri102);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const deckCountBefore = engine.getView("south").players.south.deckCount;

    engine.activateEffect(kamakiriId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Kamakiri's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getView("south").players.south.stage).toBeNull();
    expect(engine.getView("south").players.south.deckCount).toBe(deckCountBefore + 1);
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      eligibleId,
    );
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: kamakiriId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("cannot activate without returning a cost-1 Stage to the owner's deck", () => {
    const engine = OnePieceTestEngine.create({ character: [op06Kamakiri102] });
    const kamakiriId = engine.findCardInZone("south", "character", op06Kamakiri102);

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: kamakiriId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op06Kamakiri102], stage: op03Striker020 },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const kamakiriId = engine.findCardInZone("south", "character", op06Kamakiri102);
    engine.activateEffect(kamakiriId, "activateMain", "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
