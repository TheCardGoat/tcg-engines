import { describe, expect, test } from "vite-plus/test";
import { op11Hibari010, op11Koby001, op11Tashigi007 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-007 Tashigi", () => {
  test("rests itself and boosts an included Navy Character with a Navy Leader", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op11Koby001,
      character: [op11Tashigi007, op11Hibari010],
    });
    const tashigiId = engine.findCardInZone("south", "character", op11Tashigi007);
    const hibariId = engine.findCardInZone("south", "character", op11Hibari010);

    engine.activateEffect(tashigiId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Tashigi's Navy target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(hibariId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [hibariId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === tashigiId)?.rested,
    ).toBe(true);
    expect(view.players.south.characters.find((card) => card?.instanceId === hibariId)?.power).toBe(
      8000,
    );
  });

  test("may pay the rest cost before a non-Navy Leader prevents the boost", () => {
    const engine = OnePieceTestEngine.create({ character: [op11Tashigi007, op11Hibari010] });
    const tashigiId = engine.findCardInZone("south", "character", op11Tashigi007);
    const hibariId = engine.findCardInZone("south", "character", op11Hibari010);

    engine.activateEffect(tashigiId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === tashigiId)?.rested,
    ).toBe(true);
    expect(view.players.south.characters.find((card) => card?.instanceId === hibariId)?.power).toBe(
      6000,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op11Koby001,
      character: [op11Tashigi007, op11Hibari010],
    });
    const tashigiId = engine.findCardInZone("south", "character", op11Tashigi007);
    engine.activateEffect(tashigiId, "activateMain", "south");
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
