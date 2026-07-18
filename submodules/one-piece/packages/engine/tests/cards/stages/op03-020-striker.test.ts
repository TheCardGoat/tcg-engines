import { describe, expect, test } from "vite-plus/test";
import {
  op03PortgasDAce001,
  op03Striker020,
  op13GumGumElephantGun038,
  op13Higuma013,
  op13KouzukiMomonosuke105,
  op13Otama043,
  op13PhoenixPyreapple058,
  op13York094,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-020 Striker", () => {
  test("pays both rest costs but skips its search for a non-Ace Leader", () => {
    const engine = OnePieceTestEngine.create({
      stage: op03Striker020,
      activeDon: 2,
      deck: [op13GumGumElephantGun038],
    });
    const stageId = engine.findCardInZone("south", "stage", op03Striker020);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 0,
      restedDon: 2,
      stage: { rested: true },
    });
    expect(engine.getView("south").players.south.hand).toHaveLength(0);
    expect(engine.getView("south").players.south.deckCount).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("rejects insufficient DON!! and executes its Event search for Ace", () => {
    const insufficientEngine = OnePieceTestEngine.create({
      leaderCardId: op03PortgasDAce001,
      stage: op03Striker020,
      activeDon: 1,
      deck: [op13GumGumElephantGun038],
    });
    const insufficientStageId = insufficientEngine.findCardInZone("south", "stage", op03Striker020);
    expect(
      insufficientEngine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: insufficientStageId,
        trigger: "activateMain",
      }).reason,
    ).toBe("The activation costs cannot be paid.");
    expect(insufficientEngine.getView("south").players.south).toMatchObject({
      activeDon: 1,
      restedDon: 0,
      stage: { rested: false },
    });
    expect(insufficientEngine.getView("south").prompts).toHaveLength(0);

    const engine = OnePieceTestEngine.create({
      leaderCardId: op03PortgasDAce001,
      stage: op03Striker020,
      activeDon: 2,
      deck: [
        op13GumGumElephantGun038,
        op13Higuma013,
        op13PhoenixPyreapple058,
        op13Otama043,
        op13York094,
        op13KouzukiMomonosuke105,
      ],
    });
    const stageId = engine.findCardInZone("south", "stage", op03Striker020);
    const selectedEventId = engine.findCardInZone("south", "deck", op13GumGumElephantGun038);
    const higumaId = engine.findCardInZone("south", "deck", op13Higuma013);
    const otherEventId = engine.findCardInZone("south", "deck", op13PhoenixPyreapple058);
    const otamaId = engine.findCardInZone("south", "deck", op13Otama043);
    const yorkId = engine.findCardInZone("south", "deck", op13York094);
    const untouchedBottomId = engine.findCardInZone("south", "deck", op13KouzukiMomonosuke105);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 0,
      restedDon: 2,
      stage: { rested: true },
    });
    const searchDecision = engine.pendingDecision("effectSearchSelection", "south");
    const searchStep = searchDecision.steps[0];
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected Striker to publish its Event selection.");
    }
    expect(searchStep).toMatchObject({ min: 0, max: 1 });
    expect(
      searchStep.candidates.map((candidate) => ({
        id: candidate.ref.id,
        legal: candidate.legal,
      })),
    ).toEqual([
      { id: selectedEventId, legal: true },
      { id: higumaId, legal: false },
      { id: otherEventId, legal: true },
      { id: otamaId, legal: false },
      { id: yorkId, legal: false },
    ]);

    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedEventId] }, "south");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: [yorkId, otherEventId, higumaId, otamaId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([selectedEventId]);
    expect(engine.getState().players.south.deck).toEqual([
      untouchedBottomId,
      yorkId,
      otherEventId,
      higumaId,
      otamaId,
    ]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
