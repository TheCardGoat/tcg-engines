import { describe, expect, test } from "vite-plus/test";
import {
  op02Blugori084,
  op05Pagaya109,
  op05Shura106,
  op05UpperYard117,
  op13Higuma013,
  op13Otama043,
  op13York094,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-117 Upper Yard", () => {
  test("plays from hand and searches an included Sky Island type through controller choices", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05UpperYard117],
      deck: [op05Shura106, op13Higuma013, op05Pagaya109, op13Otama043, op13York094, op02Blugori084],
      activeDon: 1,
    });
    const stageId = engine.findCardInZone("south", "hand", op05UpperYard117);
    const compositeEligibleId = engine.findCardInZone("south", "deck", op05Shura106);
    const ineligibleId = engine.findCardInZone("south", "deck", op13Higuma013);
    const exactEligibleId = engine.findCardInZone("south", "deck", op05Pagaya109);
    const otamaId = engine.findCardInZone("south", "deck", op13Otama043);
    const yorkId = engine.findCardInZone("south", "deck", op13York094);
    const untouchedBottomId = engine.findCardInZone("south", "deck", op02Blugori084);

    engine.playCard(op05UpperYard117);

    const searchDecision = engine.pendingDecision("effectSearchSelection", "south");
    const searchStep = searchDecision.steps[0];
    expect(searchDecision.actorId).toBe("south");
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected Upper Yard to publish its revealed-card selection.");
    }
    expect(searchStep).toMatchObject({ min: 0, max: 1 });
    expect(
      searchStep.candidates.map((candidate) => ({
        id: candidate.ref.id,
        legal: candidate.legal,
      })),
    ).toEqual([
      { id: compositeEligibleId, legal: true },
      { id: ineligibleId, legal: false },
      { id: exactEligibleId, legal: true },
      { id: otamaId, legal: false },
      { id: yorkId, legal: false },
    ]);

    engine.resolveDecision(
      "effectSearchSelection",
      { selectedIds: [compositeEligibleId] },
      "south",
    );
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: [yorkId, otamaId, exactEligibleId, ineligibleId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.stage?.instanceId).toBe(stageId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([compositeEligibleId]);
    expect(view.players.south.deckCount).toBe(5);
    expect(engine.getState().players.south.deck).toEqual([
      untouchedBottomId,
      yorkId,
      otamaId,
      exactEligibleId,
      ineligibleId,
    ]);
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.restedDon).toBe(1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
