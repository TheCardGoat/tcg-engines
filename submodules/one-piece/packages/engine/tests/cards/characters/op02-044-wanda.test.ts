import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op02Inuarashi027, op02Wanda044, op06Inuarashi100 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-044 Wanda", () => {
  test("plays a compound-trait cost-3-or-less Minks Character other than Wanda", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02Wanda044, op02Inuarashi027, op02Wanda044, op06Inuarashi100, eb01Doma005],
      activeDon: op02Wanda044.cost,
    });
    const eligibleId = engine.findCardInZone("south", "hand", op02Inuarashi027);
    const wandaId = engine.findCardInZone("south", "hand", op02Wanda044);
    const wrongCostId = engine.findCardInZone("south", "hand", op06Inuarashi100);
    const unrelatedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op02Wanda044, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Wanda's play choice.");
    const candidateIds = play.candidates.map((candidate) => candidate.ref.id);
    expect(candidateIds).toContain(eligibleId);
    expect(candidateIds).not.toContain(wandaId);
    expect(candidateIds).not.toContain(wrongCostId);
    expect(candidateIds).not.toContain(unrelatedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === eligibleId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
