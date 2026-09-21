import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op11CharlotteKatakuri062 } from "@tcg/op-cards";
import { op11CharlotteBrulee069 } from "../../../../../cards/src/cards/characters/op11-069-charlotte-brulee.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-069 Charlotte Brulee", () => {
  test("pays top Life before adding an active DON!! for a Big Mom Pirates Leader", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op11CharlotteKatakuri062,
      hand: [op11CharlotteBrulee069],
      life: [eb01Doma005],
      activeDon: op11CharlotteBrulee069.cost,
      donDeckCount: 1,
    });
    const lifeId = engine.findCardInZone("south", "life", eb01Doma005);

    engine.playCard(op11CharlotteBrulee069, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      lifeId,
    );
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(0);
    expect(view.players.south).toMatchObject({ activeDon: 1, donDeckCount: 0 });
    expect(view.prompts).toHaveLength(0);
  });

  test("still pays top Life when the post-colon Leader condition fails", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op11CharlotteBrulee069],
      life: [eb01Doma005],
      activeDon: op11CharlotteBrulee069.cost,
      donDeckCount: 1,
    });
    const lifeId = engine.findCardInZone("south", "life", eb01Doma005);

    engine.playCard(op11CharlotteBrulee069, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(lifeId);
    expect(view.players.south).toMatchObject({ lifeCount: 0, activeDon: 0, donDeckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op11CharlotteKatakuri062,
      hand: [op11CharlotteBrulee069],
      life: [eb01Doma005],
      activeDon: op11CharlotteBrulee069.cost,
      donDeckCount: 1,
    });
    engine.playCard(op11CharlotteBrulee069, "south");
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
