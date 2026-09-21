import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005 } from "@tcg/op-cards";
import { op13AceSaboLuffy007 } from "../../../../../cards/src/cards/characters/op13-007-ace-sabo-luffy.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-007 Ace & Sabo & Luffy", () => {
  test("gives active DON!! to an own card, trashes itself, and reduces an opponent for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op13AceSaboLuffy007, eb01Doma005], activeDon: 1 },
      { character: [eb01Doma005] },
    );
    const sourceId = engine.findCardInZone("south", "character", op13AceSaboLuffy007);
    const recipientId = engine.findCardInZone("south", "character", eb01Doma005);
    const opponentId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const recipient = engine.pendingDecision("effectCostGiveDon", "south").steps[0];
    if (recipient?.kind !== "payCost") throw new Error("Expected the DON!! recipient cost.");
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toContain(recipientId);
    engine.resolveDecision("effectCostGiveDon", { selectedIds: [recipientId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opponentId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sourceId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === recipientId)?.attachedDon,
    ).toBe(1);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opponentId)?.power,
    ).toBe((eb01Doma005.power ?? 0) - 3000);
    expect(view.prompts).toHaveLength(0);
    engine.endTurn("south");
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === opponentId)?.power,
    ).toBe(eb01Doma005.power);
  });

  test("cannot activate without an active DON!! card", () => {
    const engine = OnePieceTestEngine.create({ character: [op13AceSaboLuffy007], activeDon: 0 });
    const sourceId = engine.findCardInZone("south", "character", op13AceSaboLuffy007);

    expect(() => engine.activateEffect(sourceId, "activateMain", "south")).toThrow();
    expect(engine.findCardInZone("south", "character", op13AceSaboLuffy007)).toBe(sourceId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op13AceSaboLuffy007, eb01Doma005], activeDon: 1 },
      { character: [eb01Doma005] },
    );
    const sourceId = engine.findCardInZone("south", "character", op13AceSaboLuffy007);
    engine.activateEffect(sourceId, "activateMain", "south");
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
