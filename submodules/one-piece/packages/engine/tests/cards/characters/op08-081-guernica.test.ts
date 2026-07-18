import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard } from "@tcg/op-types";
import {
  eb01Doma005,
  eb03Kalifa040,
  eb03Stussy043,
  op03Fukurou088,
  op08Guernica081,
} from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const costZeroTarget: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP08-081-COST-ZERO",
  canonicalId: "TEST-OP08-081-COST-ZERO",
  name: "Guernica Cost Zero Target",
  cost: 0,
};

registerCards([costZeroTarget]);

describe("OP08-081 Guernica", () => {
  test("orders three included CP trash cards as its attack cost, then K.O.s a cost-0 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op08Guernica081, playedOnTurn: 0 }],
        trash: [op03Fukurou088, eb03Kalifa040, eb03Stussy043, eb01Doma005],
      },
      { character: [costZeroTarget] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const guernicaId = engine.findCardInZone("south", "character", op08Guernica081);
    const cp9Id = engine.findCardInZone("south", "trash", op03Fukurou088);
    const cp0Id = engine.findCardInZone("south", "trash", eb03Kalifa040);
    const cpId = engine.findCardInZone("south", "trash", eb03Stussy043);
    const wrongTraitId = engine.findCardInZone("south", "trash", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", costZeroTarget);

    engine.declareAttack(guernicaId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 3, max: 3, ordered: true });
    if (cost?.kind !== "payCost") throw new Error("Expected Guernica's ordered CP cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([cp9Id, cp0Id, cpId]);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    const submittedOrder = [cpId, cp9Id, cp0Id];
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: submittedOrder }, "south");

    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(ko).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (ko?.kind !== "selectEntity") throw new Error("Expected Guernica's K.O. target.");
    expect(ko.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual([wrongTraitId]);
    expect(engine.getState().players.south.deck.slice(-3)).toEqual(submittedOrder);
    expect(view.prompts).toHaveLength(0);
  });
});
