import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb03Stussy043,
  op03Fukurou088,
  op07Kaku080,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-080 Kaku", () => {
  test("orders two included CP trash cards, then reduces an opposing Character for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07Kaku080],
        trash: [op03Fukurou088, eb03Stussy043, eb01Doma005],
        activeDon: op07Kaku080.cost,
      },
      { character: [eb01MountainGod018] },
    );
    const cp9Id = engine.findCardInZone("south", "trash", op03Fukurou088);
    const cp0Id = engine.findCardInZone("south", "trash", eb03Stussy043);
    const nonCpId = engine.findCardInZone("south", "trash", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const baseCost = eb01MountainGod018.cost;

    engine.playCard(op07Kaku080, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 2, max: 2, ordered: true });
    if (cost?.kind !== "payCost") throw new Error("Expected Kaku's ordered CP trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([cp9Id, cp0Id]);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonCpId);
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: [cp0Id, cp9Id] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Kaku's cost target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getState().players.south.deck.slice(-2)).toEqual([cp0Id, cp9Id]);
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(baseCost - 3);

    engine.endTurn("south");
    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      baseCost,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer its optional effect without two included CP trash cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op07Kaku080],
      trash: [op03Fukurou088, eb01Doma005],
      activeDon: op07Kaku080.cost,
    });
    const trashBefore = [...engine.getState().players.south.trash];

    engine.playCard(op07Kaku080, "south");

    expect(engine.getState().players.south.trash).toEqual(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may decline without moving trash cards or reducing a Character's cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07Kaku080],
        trash: [op03Fukurou088, eb03Stussy043],
        activeDon: op07Kaku080.cost,
      },
      { character: [eb01MountainGod018] },
    );
    const trashBefore = [...engine.getState().players.south.trash];
    const deckBefore = [...engine.getState().players.south.deck];
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op07Kaku080, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(engine.getState().players.south.trash).toEqual(trashBefore);
    expect(engine.getState().players.south.deck).toEqual(deckBefore);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      eb01MountainGod018.cost,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
