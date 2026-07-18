import { describe, expect, test } from "vite-plus/test";
import {
  op11MonkeyDLuffy058,
  op13Higuma013,
  st01MonkeyDLuffy001,
  st01ThousandSunny017,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST01-017 Thousand Sunny", () => {
  test("rests itself and lets its controller give a Straw Hat Crew Character +1000 power for the turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: st01MonkeyDLuffy001,
      stage: st01ThousandSunny017,
      character: [op11MonkeyDLuffy058, op13Higuma013],
    });
    const leaderId = engine.leader("south");
    const stageId = engine.findCardInZone("south", "stage", st01ThousandSunny017);
    const eligibleId = engine.findCardInZone("south", "character", op11MonkeyDLuffy058);
    const ineligibleId = engine.findCardInZone("south", "character", op13Higuma013);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetDecision.actorId).toBe("south");
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected Thousand Sunny to publish its power target choice.");
    }
    expect(targetStep).toMatchObject({ min: 0, max: 1 });
    const candidateIds = targetStep.candidates.map((candidate) => candidate.ref.id);
    expect(candidateIds).toHaveLength(2);
    expect(candidateIds).toEqual(expect.arrayContaining([leaderId, eligibleId]));
    expect(candidateIds).not.toContain(ineligibleId);

    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId)?.power,
    ).toBe(8000);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId)?.power,
    ).toBe(7000);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
