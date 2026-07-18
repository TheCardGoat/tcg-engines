import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op03KaidoWantedPoster003 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST04-003_p1 Kaido (Wanted Poster)", () => {
  test("may decline the entire DON!! return, K.O., and Rush block", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op03KaidoWantedPoster003], activeDon: 10 },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op03KaidoWantedPoster003, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore);
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may return five DON!! to K.O. a cost-6-or-less Character and gain Rush", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op03KaidoWantedPoster003], activeDon: 10 },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.playCard(op03KaidoWantedPoster003, "south");
    const kaidoId = engine.findCardInZone("south", "character", op03KaidoWantedPoster003);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Kaido's DON!! return cost.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: cost.candidates.slice(0, 5).map((candidate) => candidate.ref.id) },
      "south",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    engine.declareAttack(kaidoId, engine.leader("north"), "south");
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
  });
});
