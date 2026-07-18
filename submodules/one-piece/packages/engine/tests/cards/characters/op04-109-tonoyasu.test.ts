import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01KouzukiOden001,
  op04KouzukiHiyori103,
  op04Tonoyasu109,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-109 Tonoyasu", () => {
  test("trashes itself and buffs an included Land of Wano Leader or Character this turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: eb01KouzukiOden001,
      character: [op04Tonoyasu109, op04KouzukiHiyori103, eb01Doma005],
    });
    const sourceId = engine.findCardInZone("south", "character", op04Tonoyasu109);
    const compoundTraitId = engine.findCardInZone("south", "character", op04KouzukiHiyori103);
    const unrelatedId = engine.findCardInZone("south", "character", eb01Doma005);
    const leaderId = engine.leader("south");

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Tonoyasu's target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([leaderId, compoundTraitId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(unrelatedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [leaderId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      sourceId,
    );
    expect(engine.getView("south").players.south.leader.power).toBe(8000);
    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(5000);
  });

  test("may pay its trash cost and choose zero targets", () => {
    const engine = OnePieceTestEngine.create({ character: [op04Tonoyasu109] });
    const sourceId = engine.findCardInZone("south", "character", op04Tonoyasu109);
    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      sourceId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may decline without trashing itself", () => {
    const engine = OnePieceTestEngine.create({ character: [op04Tonoyasu109] });
    const sourceId = engine.findCardInZone("south", "character", op04Tonoyasu109);
    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(sourceId);
  });
});
