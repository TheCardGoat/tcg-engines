import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { op11CharlottePerospero071 } from "../../../../../cards/src/cards/OP11/characters/071-charlotte-perospero.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-071 Charlotte Perospero", () => {
  test("trashes a physical hand card, matches the revealed cost, draws, and adds active DON!! once", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op11CharlottePerospero071],
        hand: [eb01Doma005],
        deck: [eb01MountainGod018, eb01Doma005],
        donDeckCount: 1,
      },
      { deck: [eb01Doma005, eb01MountainGod018] },
    );
    const perosperoId = engine.findCardInZone("south", "character", op11CharlottePerospero071);
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const drawnId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.activateEffect(perosperoId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectGuessTopDeckCost", { optionId: "1" }, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south).toMatchObject({ activeDon: 1, donDeckCount: 0 });
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: perosperoId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op11CharlottePerospero071],
        hand: [eb01Doma005],
        deck: [eb01MountainGod018, eb01Doma005],
        donDeckCount: 1,
      },
      { deck: [eb01Doma005, eb01MountainGod018] },
    );
    const perosperoId = engine.findCardInZone("south", "character", op11CharlottePerospero071);
    engine.activateEffect(perosperoId, "activateMain", "south");
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
