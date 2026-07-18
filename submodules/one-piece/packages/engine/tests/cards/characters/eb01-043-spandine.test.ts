import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Spandine043,
  op03Fukurou088,
  op03Jerry084,
  op03Nero087,
  op03Spandam086,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-043 Spandine", () => {
  test("orders three included CP cards as cost, then maps the remaining rested play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb01Spandine043],
      trash: [
        op03Spandam086,
        op03Nero087,
        op03Fukurou088,
        op03Jerry084,
        eb01Spandine043,
        eb01Doma005,
      ],
      activeDon: 3,
    });
    const spandamId = engine.findCardInZone("south", "trash", op03Spandam086);
    const neroId = engine.findCardInZone("south", "trash", op03Nero087);
    const fukurouId = engine.findCardInZone("south", "trash", op03Fukurou088);
    const jerryId = engine.findCardInZone("south", "trash", op03Jerry084);
    const excludedSpandineId = engine.findCardInZone("south", "trash", eb01Spandine043);
    const nonCpId = engine.findCardInZone("south", "trash", eb01Doma005);

    engine.playCard(eb01Spandine043);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") {
      throw new Error("Expected Spandine's ordered three-card CP trash cost.");
    }
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([
      spandamId,
      neroId,
      fukurouId,
      jerryId,
      excludedSpandineId,
    ]);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonCpId);
    engine.resolveDecision(
      "effectCostReturnTrashToDeck",
      { selectedIds: [neroId, spandamId, fukurouId] },
      "south",
    );

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") {
      throw new Error("Expected Spandine's remaining CP Character play choice.");
    }
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([jerryId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [jerryId] }, "south");

    const view = engine.getView("south");
    expect(engine.getState().players.south.deck.slice(-3)).toEqual([neroId, spandamId, fukurouId]);
    expect(view.players.south.characters.find((card) => card?.instanceId === jerryId)?.rested).toBe(
      true,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual([
      excludedSpandineId,
      nonCpId,
    ]);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
