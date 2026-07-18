import { describe, expect, test } from "vite-plus/test";
import {
  op01MonkeyDLuffy024,
  op10RoronoaZoro113,
  op10TrafalgarLaw022,
  op10Urouge101,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-022 Trafalgar Law", () => {
  test("returns one chosen Character after the field reaches 5 total cost, then reveals and plays qualifying Life", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op10TrafalgarLaw022,
      character: [op01MonkeyDLuffy024, op10RoronoaZoro113],
      life: [op10Urouge101],
      activeDon: 1,
    });
    const luffyId = engine.findCardInZone("south", "character", op01MonkeyDLuffy024);
    const zoroId = engine.findCardInZone("south", "character", op10RoronoaZoro113);
    const lifeId = engine.findCardInZone("south", "life", op10Urouge101);

    engine.attachDon(engine.leader("south"), 1, "south");
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostReturnCharacter", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Trafalgar Law's return cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([luffyId, zoroId]);
    engine.resolveDecision("effectCostReturnCharacter", { selectedIds: [luffyId] }, "south");

    const play = engine.pendingDecision("effectRevealFromLifePlay", "south").steps[0];
    expect(play?.kind).toBe("confirm");
    if (play?.kind !== "confirm") throw new Error("Expected the revealed-Life play choice.");
    expect(play.options.map((option) => option.id)).toEqual(["play", "keep"]);
    engine.resolveDecision("effectRevealFromLifePlay", { optionId: "play" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(luffyId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(lifeId);
    expect(view.players.south.lifeCount).toBe(0);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
