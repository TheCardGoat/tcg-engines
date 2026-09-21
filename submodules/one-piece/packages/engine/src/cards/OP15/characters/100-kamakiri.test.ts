import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005 } from "@tcg/op-cards";
import { op15Kamakiri100 } from "../../../../../cards/src/cards/characters/op15-100-kamakiri.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-100 Kamakiri", () => {
  test("[On Play] self-trashes and pays top Life to K.O. a cost-6-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Kamakiri100], activeDon: 5 },
      { character: [eb01Doma005] },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard(op15Kamakiri100);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const kamakiriId = engine
      .getView("south")
      .players.south.trash.find((card) => card.cardId === "OP15-100")!.instanceId!;
    // The Life cost auto-pays from the top of Life.

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([domaId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.trash.map((card) => card.instanceId)).toContain(kamakiriId);
    expect(south.lifeCount).toBe(lifeBefore - 1);
    expect(south.hand.map((card) => card.instanceId)).toContain(
      // The top Life card moved to hand.
      south.hand[0].instanceId,
    );
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      domaId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On Play] declined keeps Kamakiri on the field and Life untouched", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Kamakiri100], activeDon: 5 },
      { character: [eb01Doma005] },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard(op15Kamakiri100);
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.characters.map((card) => card?.cardId)).toContain("OP15-100");
    expect(south.lifeCount).toBe(lifeBefore);
    expect(south.trash.map((card) => card.cardId)).not.toContain("OP15-100");
    expect(engine.getView("south").players.north.trash).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
