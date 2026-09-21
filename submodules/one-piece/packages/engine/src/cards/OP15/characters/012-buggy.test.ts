import { describe, expect, test } from "vite-plus/test";
import { eb01ConquererOfThreeWorldsRagnaraku039, eb01Doma005 } from "@tcg/op-cards";
import { op15Buggy012 } from "../../../../../cards/src/cards/characters/op15-012-buggy.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-012 Buggy", () => {
  test("[When Attacking] moves one rested opposing DON!! onto their Leader or Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Buggy012], activeDon: 4 },
      { character: [eb01Doma005], restedDon: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const buggyId = engine.findCardInZone("south", "character", op15Buggy012);
    const domaId = engine.findCardInZone("north", "character", eb01Doma005);
    const leaderId = engine.leader("north");

    engine.declareAttack(buggyId, engine.leader("north"), "south");
    engine.acceptLeadingOptional("south");

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected Buggy's DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Buggy's DON!! recipient.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([leaderId, domaId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    const north = engine.getView("south").players.north;
    expect(north.restedDon).toBe(1);
    expect(north.characters.find((card) => card?.instanceId === domaId)?.attachedDon).toBe(1);
  });

  test("[On K.O.] draws 1 card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op15Buggy012], activeDon: 2, deck: [eb01Doma005, eb01Doma005, eb01Doma005] },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const buggyId = engine.findCardInZone("south", "character", op15Buggy012);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [buggyId] }, "north");

    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      buggyId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[When Attacking] may be declined", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-012", attachedDon: 2 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const donBefore =
      engine.getView("south").players.south.activeDon +
      engine.getView("south").players.south.restedDon;

    engine.asSouth().attack("OP15-012", engine.asNorth().leader());
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(
      engine.getView("south").players.south.activeDon +
        engine.getView("south").players.south.restedDon,
    ).toBe(donBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
