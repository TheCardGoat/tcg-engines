import { describe, expect, test } from "vite-plus/test";
import {
  eb02Enel052,
  op05Enel100,
  op06JigoroOfTheWind084,
  op06Oars083,
  op06TheArkMaxim117,
  op13Higuma013,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-117 The Ark Maxim", () => {
  test("rests the Stage and a chosen Enel to K.O. every opposing cost-2-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        stage: op06TheArkMaxim117,
        character: [op05Enel100, eb02Enel052],
      },
      {
        character: [op13Higuma013, op06JigoroOfTheWind084, op06Oars083],
      },
    );
    const stageId = engine.findCardInZone("south", "stage", op06TheArkMaxim117);
    const selectedEnelId = engine.findCardInZone("south", "character", op05Enel100);
    const unselectedEnelId = engine.findCardInZone("south", "character", eb02Enel052);
    const costOneId = engine.findCardInZone("north", "character", op13Higuma013);
    const costTwoId = engine.findCardInZone("north", "character", op06JigoroOfTheWind084);
    const costFourId = engine.findCardInZone("north", "character", op06Oars083);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const costDecision = engine.pendingDecision("effectCostRestCards", "south");
    const costStep = costDecision.steps[0];
    expect(costDecision.actorId).toBe("south");
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected The Ark Maxim to publish its Enel rest cost.");
    }
    expect(costStep).toMatchObject({ min: 1, max: 1, costType: "restCards" });
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selectedEnelId,
      unselectedEnelId,
    ]);

    engine.resolveDecision("effectCostRestCards", { selectedIds: [selectedEnelId] }, "south");

    const view = engine.getView("south");
    const restedById = new Map(
      view.players.south.characters.flatMap((card) =>
        card ? [[card.instanceId, card.rested] as const] : [],
      ),
    );
    expect(view.players.south.stage?.rested).toBe(true);
    expect(restedById.get(selectedEnelId)).toBe(true);
    expect(restedById.get(unselectedEnelId)).toBe(false);
    expect(
      view.players.north.characters.flatMap((card) => (card ? [card.instanceId] : [])),
    ).toEqual([costFourId]);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual([costOneId, costTwoId]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
