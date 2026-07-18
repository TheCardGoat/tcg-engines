import { describe, expect, test } from "vite-plus/test";
import {
  eb01Hannyabal021,
  eb02MerryGo041,
  op11NicoRobin009,
  op13Higuma013,
  op13MonkeyDLuffy001,
  op13Otama043,
  op13RoronoaZoro037,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-041 Merry Go", () => {
  test("draws on play only for a Straw Hat Crew Leader", () => {
    const eligibleEngine = OnePieceTestEngine.create({
      leaderCardId: op13MonkeyDLuffy001,
      hand: [eb02MerryGo041],
      deck: [op13Otama043],
      activeDon: 1,
    });
    eligibleEngine.playCard(eb02MerryGo041);

    const eligibleView = eligibleEngine.getView("south");
    expect(eligibleView.players.south.stage?.cardId).toBe(eb02MerryGo041.id);
    expect(eligibleView.players.south.hand.map((card) => card.cardId)).toEqual([op13Otama043.id]);
    expect(eligibleView.players.south.deckCount).toBe(0);

    const ineligibleEngine = OnePieceTestEngine.create({
      leaderCardId: eb01Hannyabal021,
      hand: [eb02MerryGo041],
      deck: [op13Otama043],
      activeDon: 1,
    });
    ineligibleEngine.playCard(eb02MerryGo041);

    const ineligibleView = ineligibleEngine.getView("south");
    expect(ineligibleView.players.south.stage?.cardId).toBe(eb02MerryGo041.id);
    expect(ineligibleView.players.south.handCount).toBe(0);
    expect(ineligibleView.players.south.deckCount).toBe(1);
  });

  test("lets its controller give a Straw Hat Crew Character +2 cost through the opponent's next turn", () => {
    const aheadEngine = OnePieceTestEngine.create(
      {
        stage: eb02MerryGo041,
        character: [{ card: op13Higuma013, attachedDon: 2 }],
      },
      { activeDon: 1 },
    );
    const aheadStageId = aheadEngine.findCardInZone("south", "stage", eb02MerryGo041);
    const aheadCharacterId = aheadEngine.findCardInZone("south", "character", op13Higuma013);
    aheadEngine.activateEffect(aheadStageId, "activateMain");
    aheadEngine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const aheadView = aheadEngine.getView("south");
    expect(aheadView.players.south.stage?.rested).toBe(true);
    expect(
      aheadView.players.south.characters.find((card) => card?.instanceId === aheadCharacterId)
        ?.cost,
    ).toBe(op13Higuma013.cost);
    expect(aheadView.prompts).toHaveLength(0);

    const engine = OnePieceTestEngine.create(
      {
        stage: eb02MerryGo041,
        character: [{ card: op13Higuma013, attachedDon: 1 }, op13RoronoaZoro037, op11NicoRobin009],
      },
      { activeDon: 1 },
    );
    const stageId = engine.findCardInZone("south", "stage", eb02MerryGo041);
    const ineligibleId = engine.findCardInZone("south", "character", op13Higuma013);
    const selectedId = engine.findCardInZone("south", "character", op13RoronoaZoro037);
    const unselectedId = engine.findCardInZone("south", "character", op11NicoRobin009);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetDecision.actorId).toBe("south");
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected Merry Go to publish its Character selection.");
    }
    expect(targetStep.min).toBe(0);
    expect(targetStep.max).toBe(1);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selectedId,
      unselectedId,
    ]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);

    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === selectedId)?.cost,
    ).toBe(6);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === unselectedId)?.cost,
    ).toBe(3);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === selectedId)?.cost,
    ).toBe(6);

    engine.endTurn("north");
    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === selectedId)?.cost,
    ).toBe(4);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
