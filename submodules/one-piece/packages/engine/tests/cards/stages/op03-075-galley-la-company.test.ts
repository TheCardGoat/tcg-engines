import { describe, expect, test } from "vite-plus/test";
import { op03GalleyLaCompany075, op03Iceburg058 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-075 Galley-La Company", () => {
  test("rests for a non-Iceburg Leader before its DON!! addition is skipped", () => {
    const engine = OnePieceTestEngine.create({
      stage: op03GalleyLaCompany075,
      donDeckCount: 2,
    });
    const stageId = engine.findCardInZone("south", "stage", op03GalleyLaCompany075);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      donDeckCount: 2,
      activeDon: 0,
      restedDon: 0,
      stage: { rested: true },
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("with Iceburg, lets its controller choose whether to add a rested DON!! card", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op03Iceburg058,
      stage: op03GalleyLaCompany075,
      donDeckCount: 2,
    });
    const stageId = engine.findCardInZone("south", "stage", op03GalleyLaCompany075);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const decision = engine.pendingDecision("effectAddDon", "south");
    const step = decision.steps[0];
    expect(decision.actorId).toBe("south");
    expect(step?.kind).toBe("chooseOption");
    if (step?.kind !== "chooseOption") {
      throw new Error("Expected Galley-La Company to publish a DON!! count choice.");
    }
    expect(step.options.map((option) => option.id)).toEqual(["0", "1"]);
    expect(engine.getView("south").players.south.stage?.rested).toBe(true);

    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({
      restedDon: 1,
      activeDon: 0,
      donDeckCount: 1,
      stage: { rested: true },
    });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
