import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op05Pell014, op05Sabo007, op13York094 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-007 Sabo", () => {
  test("K.O.s up to two opposing Characters whose combined power is at most 4000", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op05Sabo007], activeDon: op05Sabo007.cost },
      { character: [eb01Doma005, op13York094, op05Pell014] },
    );
    const threeThousandId = engine.findCardInZone("north", "character", eb01Doma005);
    const oneThousandId = engine.findCardInZone("north", "character", op13York094);
    const fourThousandId = engine.findCardInZone("north", "character", op05Pell014);

    engine.playCard(op05Sabo007, "south");

    const decision = engine.pendingDecision("effectTargetSelection", "south");
    const target = decision.steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Sabo's K.O. choice.");
    expect(target).toMatchObject({ min: 0, max: 2 });
    expect(target.constraints).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "totalConstraint", operator: "lte", value: 4000 }),
      ]),
    );
    expect(
      engine.expectFailure({
        type: "resolvePrompt",
        seat: "south",
        promptId: decision.id,
        selectedIds: [fourThousandId, oneThousandId],
      }).accepted,
    ).toBe(false);

    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [threeThousandId, oneThousandId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([threeThousandId, oneThousandId]),
    );
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(fourThousandId);
    expect(view.prompts).toHaveLength(0);
  });
});
