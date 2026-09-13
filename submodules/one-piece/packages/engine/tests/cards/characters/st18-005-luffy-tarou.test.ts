import { describe, expect, test } from "vite-plus/test";
import { op02Jinbe033, op05Jinbe066, op10Giolla066, op11LuffyTarouSp005 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST18-005 Luffy-Tarou", () => {
  test("may return one DON!! to play a purple cost-5 included Straw Hat Crew Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op11LuffyTarouSp005, op05Jinbe066, op02Jinbe033, op10Giolla066],
      activeDon: op11LuffyTarouSp005.cost + 1,
    });
    const eligibleId = engine.findCardInZone("south", "hand", op05Jinbe066);
    const wrongColorId = engine.findCardInZone("south", "hand", op02Jinbe033);
    const wrongTraitId = engine.findCardInZone("south", "hand", op10Giolla066);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op11LuffyTarouSp005, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Luffy-Tarou's play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongColorId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op11LuffyTarouSp005, op05Jinbe066, op02Jinbe033, op10Giolla066],
      activeDon: op11LuffyTarouSp005.cost + 1,
    });
    engine.playCard(op11LuffyTarouSp005, "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
