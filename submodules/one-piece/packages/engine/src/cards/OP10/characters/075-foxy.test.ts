import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op10Foxy075 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-075 Foxy", () => {
  test("trashes itself and draws when its DON!! field count equals the opponent's", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op10Foxy075],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: 2,
      },
      { activeDon: 2 },
    );
    const foxyId = engine.findCardInZone("south", "character", op10Foxy075);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.activateEffect(foxyId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(foxyId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay the trash-self cost before a failed DON!! comparison prevents the draw", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10Foxy075], deck: [eb01Doma005, eb01Fourtricks025], activeDon: 3 },
      { activeDon: 2 },
    );
    const foxyId = engine.findCardInZone("south", "character", op10Foxy075);

    engine.activateEffect(foxyId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(foxyId);
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op10Foxy075],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: 2,
      },
      { activeDon: 2 },
    );
    const foxyId = engine.findCardInZone("south", "character", op10Foxy075);
    engine.activateEffect(foxyId, "activateMain", "south");
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
