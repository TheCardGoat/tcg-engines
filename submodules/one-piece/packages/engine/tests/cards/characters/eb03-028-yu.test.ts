import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb03Yu028 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-028 Yu", () => {
  test("trashes a chosen On Play card, then trashes itself to draw at four or less cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb03Yu028, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: 2,
    });
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(eb03Yu028, "south");
    const yuId = engine.findCardInZone("south", "character", eb03Yu028);

    const discard = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(discard?.kind).toBe("selectEntity");
    if (discard?.kind !== "selectEntity") throw new Error("Expected Yu's On Play hand choice.");
    expect(discard.candidates.map((candidate) => candidate.ref.id)).toContain(discardedId);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "south");

    const handBeforeDraw = engine.getView("south").players.south.hand.length;
    engine.activateEffect(yuId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("south").players.south.hand).toHaveLength(handBeforeDraw + 2);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([discardedId, yuId]),
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("allows paying the self-trash cost above four cards but does not draw", () => {
    const engine = OnePieceTestEngine.create({
      hand: [
        eb03Yu028,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
      ],
      activeDon: 2,
    });

    engine.playCard(eb03Yu028, "south");
    const yuId = engine.findCardInZone("south", "character", eb03Yu028);
    const discard = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(discard?.kind).toBe("selectEntity");
    if (discard?.kind !== "selectEntity") throw new Error("Expected Yu's On Play hand choice.");
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [discard.candidates[0]!.ref.id] },
      "south",
    );

    const handBeforeActivation = engine.getView("south").players.south.hand.length;
    expect(handBeforeActivation).toBeGreaterThan(4);
    engine.activateEffect(yuId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("south").players.south.hand).toHaveLength(handBeforeActivation);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      yuId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb03Yu028, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: 2,
    });
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(eb03Yu028, "south");
    const yuId = engine.findCardInZone("south", "character", eb03Yu028);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "south");
    engine.activateEffect(yuId, "activateMain", "south");
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
