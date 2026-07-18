import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op05Pell014, op09GetOutOfHere018, op13York094 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-018 Get Out of Here!", () => {
  test("Main projects and enforces the combined 4000-power budget before K.O.ing up to two Characters", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op09GetOutOfHere018], activeDon: 3 },
      { character: [eb01Doma005, op13York094, op05Pell014] },
    );
    const threeThousandId = engine.findCardInZone("north", "character", eb01Doma005);
    const oneThousandId = engine.findCardInZone("north", "character", op13York094);
    const fourThousandId = engine.findCardInZone("north", "character", op05Pell014);

    engine.playCard(op09GetOutOfHere018);

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the aggregate-power Character choice.");
    }
    expect(targetStep).toMatchObject({ min: 0, max: 2 });
    expect(targetStep.constraints).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "totalConstraint", operator: "lte", value: 4000 }),
      ]),
    );
    const failure = engine.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: targetDecision.id,
      selectedIds: [fourThousandId, threeThousandId],
    });
    expect(failure.reason).toBe("Prompt resolution could not be applied.");

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
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
