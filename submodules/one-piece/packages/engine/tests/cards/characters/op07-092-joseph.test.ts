import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb03Stussy043,
  op03Fukurou088,
  op07Joseph092,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-092 Joseph", () => {
  test("orders two included CP trash cards, then K.O.s a cost-1-or-less opponent", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07Joseph092],
        trash: [op03Fukurou088, eb03Stussy043, eb01Doma005],
        activeDon: op07Joseph092.cost,
      },
      { character: [eb01Doma005, eb01Fourtricks025] },
    );
    const cp9Id = engine.findCardInZone("south", "trash", op03Fukurou088);
    const cp0Id = engine.findCardInZone("south", "trash", eb03Stussy043);
    const nonCpId = engine.findCardInZone("south", "trash", eb01Doma005);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op07Joseph092, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 2, max: 2, ordered: true });
    if (cost?.kind !== "payCost") throw new Error("Expected Joseph's ordered CP trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([cp9Id, cp0Id]);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonCpId);
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: [cp0Id, cp9Id] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Joseph's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(engine.getState().players.south.deck.slice(-2)).toEqual([cp0Id, cp9Id]);
    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(expensiveId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer its optional effect without two included CP trash cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07Joseph092],
      trash: [op03Fukurou088, eb01Doma005],
      activeDon: op07Joseph092.cost,
    });
    const trashBefore = [...engine.getState().players.south.trash];

    engine.playCard(op07Joseph092, "south");

    expect(engine.getState().players.south.trash).toEqual(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may decline without moving trash cards or K.O.'ing a Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07Joseph092],
        trash: [op03Fukurou088, eb03Stussy043],
        activeDon: op07Joseph092.cost,
      },
      { character: [eb01Doma005] },
    );
    const trashBefore = [...engine.getState().players.south.trash];
    const deckBefore = [...engine.getState().players.south.deck];
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op07Joseph092, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(engine.getState().players.south.trash).toEqual(trashBefore);
    expect(engine.getState().players.south.deck).toEqual(deckBefore);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });
});
