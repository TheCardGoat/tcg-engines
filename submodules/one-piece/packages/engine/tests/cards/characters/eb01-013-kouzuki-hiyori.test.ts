import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01KouzukiHiyori013, eb01MountainGod018 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-013 Kouzuki Hiyori", () => {
  test("trashes itself, maps the included Land of Wano type, plays it, then draws", () => {
    const engine = OnePieceTestEngine.create({
      character: [eb01KouzukiHiyori013],
      hand: [eb01MountainGod018, eb01KouzukiHiyori013, eb01Doma005],
      deck: [eb01Doma005, eb01Doma005],
    });
    const hiyoriId = engine.findCardInZone("south", "character", eb01KouzukiHiyori013);
    const legalId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const excludedNameId = engine.findCardInZone("south", "hand", eb01KouzukiHiyori013);
    const excludedTraitId = engine.findCardInZone("south", "hand", eb01Doma005);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.activateEffect(hiyoriId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const playChoice = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(playChoice?.kind).toBe("selectEntity");
    if (playChoice?.kind !== "selectEntity") {
      throw new Error("Expected Hiyori's Character-from-hand choice.");
    }
    expect(playChoice.candidates.map((candidate) => candidate.ref.id)).toEqual([legalId]);
    expect(playChoice.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      excludedNameId,
    );
    expect(playChoice.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      excludedTraitId,
    );

    engine.resolveDecision("effectPlaySelection", { selectedIds: [legalId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(hiyoriId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(legalId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      character: [eb01KouzukiHiyori013],
      hand: [eb01MountainGod018, eb01KouzukiHiyori013, eb01Doma005],
      deck: [eb01Doma005, eb01Doma005],
    });
    const hiyoriId = engine.findCardInZone("south", "character", eb01KouzukiHiyori013);
    engine.activateEffect(hiyoriId, "activateMain", "south");
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
