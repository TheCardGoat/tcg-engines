import { describe, expect, test } from "vite-plus/test";
import {
  op09SpecialMuggyBall058,
  op09ThousandSunny080,
  op13Higuma013,
  op13SunnyKun026,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-080 Thousand Sunny", () => {
  test("reacts only when an opponent's effect removes its controller's Straw Hat Crew Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        stage: op09ThousandSunny080,
        character: [op13Higuma013, op13SunnyKun026],
        donDeckCount: 2,
      },
      {
        hand: [op09SpecialMuggyBall058, op09SpecialMuggyBall058],
        activeDon: 4,
      },
    );
    const unrelatedId = engine.findCardInZone("south", "character", op13Higuma013);
    const strawHatCrewId = engine.findCardInZone("south", "character", op13SunnyKun026);

    engine.endTurn("south");

    engine.playCard(op09SpecialMuggyBall058, "north");
    const removalDecision = engine.pendingDecision("effectTargetSelection", "south");
    expect(removalDecision.actorId).toBe("south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [unrelatedId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(false);
    expect(view.prompts).toHaveLength(0);

    engine.playCard(op09SpecialMuggyBall058, "north");

    const confirmation = engine.pendingDecision("effectOptional", "south");
    expect(confirmation).toMatchObject({ actorId: "south", kind: "confirm" });
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const donDecision = engine.pendingDecision("effectAddDon", "south");
    const donStep = donDecision.steps[0];
    expect(donDecision.actorId).toBe("south");
    expect(donStep?.kind).toBe("chooseOption");
    if (donStep?.kind !== "chooseOption") {
      throw new Error("Expected Thousand Sunny to publish its DON!! count choice.");
    }
    expect(donStep.options.map((option) => option.id)).toEqual(["0", "1"]);
    expect(engine.getView("south").players.south.stage?.rested).toBe(true);

    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(strawHatCrewId);
    expect(view.players.south).toMatchObject({ restedDon: 1, donDeckCount: 1 });
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
