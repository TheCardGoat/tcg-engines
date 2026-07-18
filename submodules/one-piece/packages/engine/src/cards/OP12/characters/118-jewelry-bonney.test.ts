import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { op12JewelryBonney118 } from "../../../../../cards/src/cards/OP12/characters/118-jewelry-bonney.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-118 Jewelry Bonney", () => {
  test("at eight rested cards draws two, trashes one chosen card, and sets a DON!! active", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op12JewelryBonney118, eb01Doma005],
      deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
      activeDon: op12JewelryBonney118.cost,
      restedDon: 3,
    });
    const paidId = engine.findCardInZone("south", "hand", eb01Doma005);
    const handBefore = engine.getView("south").players.south.handCount;

    engine.playCard(op12JewelryBonney118, "south");
    const discard = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (discard?.kind !== "selectEntity") throw new Error("Expected Bonney's hand trash choice.");
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [paidId] }, "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.handCount).toBe(handBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paidId);
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 7 });
    expect(view.prompts).toHaveLength(0);
  });

  test("below eight rested cards does not resolve its On Play effect and remains a legal Blocker", () => {
    const boundary = OnePieceTestEngine.create({
      hand: [op12JewelryBonney118, eb01Doma005],
      deck: [eb01Doma005, eb01MountainGod018],
      activeDon: op12JewelryBonney118.cost,
    });
    const handBefore = boundary.getView("south").players.south.handCount;
    boundary.playCard(op12JewelryBonney118, "south");
    expect(boundary.getView("south").players.south.handCount).toBe(handBefore - 1);
    expect(boundary.getView("south").prompts).toHaveLength(0);

    const blocker = OnePieceTestEngine.create(
      { character: [op12JewelryBonney118] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const bonneyId = blocker.findCardInZone("south", "character", op12JewelryBonney118);
    blocker.declareAttack(
      blocker.findCardInZone("north", "character", eb01MountainGod018),
      blocker.leader("south"),
      "north",
    );
    const choice = blocker.pendingDecision("battleBlocker", "south").steps[0];
    if (choice?.kind !== "selectEntity") throw new Error("Expected Bonney's Blocker choice.");
    expect(choice.candidates.map((candidate) => candidate.ref.id)).toContain(bonneyId);
  });
});
