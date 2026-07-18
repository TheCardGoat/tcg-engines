import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op04KinEmon102 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-102 Kin'emon", () => {
  test("rests 1 DON!!, takes top or bottom Life, sets itself active, and spends Once Per Turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op04KinEmon102, rested: true, playedOnTurn: 0 }],
      life: [eb01Doma005, eb01Fourtricks025],
      activeDon: 1,
    });
    const kinEmonId = engine.findCardInZone("south", "character", op04KinEmon102);

    engine.activateEffect(kinEmonId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const lifeCost = engine.pendingDecision("effectCostAddLifeToHand", "south").steps[0];
    expect(lifeCost?.kind).toBe("chooseOption");
    if (lifeCost?.kind !== "chooseOption") throw new Error("Expected Kin'emon's Life choice.");
    expect(lifeCost.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({
      activeDon: 0,
      restedDon: 1,
      lifeCount: 1,
      handCount: 1,
    });
    expect(
      view.players.south.characters.find((card) => card?.instanceId === kinEmonId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: kinEmonId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("may decline without resting DON!!, moving Life, or setting itself active", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op04KinEmon102, rested: true, playedOnTurn: 0 }],
      life: [eb01Doma005],
      activeDon: 1,
    });
    const kinEmonId = engine.findCardInZone("south", "character", op04KinEmon102);

    engine.activateEffect(kinEmonId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 0, lifeCount: 1 });
    expect(
      view.players.south.characters.find((card) => card?.instanceId === kinEmonId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
