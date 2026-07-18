import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02EdwardNewgate001,
  op02Squard009,
  op08JewelryBonney105,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-105 Jewelry Bonney", () => {
  test("once per turn draws two then trashes a chosen card when opposing Life is removed", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op08JewelryBonney105, attachedDon: 1, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
        hand: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      },
      { life: [eb01Doma005, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const drawnId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const attackerId = engine.findCardInZone("south", "character", op08JewelryBonney105);
    const secondAttackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash).toMatchObject({ kind: "selectEntity", min: 1, max: 1 });
    if (trash?.kind !== "selectEntity") throw new Error("Expected Bonney's hand trash.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toContain(drawnId);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [drawnId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.prompts).toHaveLength(0);

    const deckAfterFirstTrigger = view.players.south.deckCount;
    engine.declareAttack(secondAttackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    expect(engine.getView("south").players.south.deckCount).toBe(deckAfterFirstTrigger);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not react when its controller removes their own Life", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02EdwardNewgate001,
      hand: [op02Squard009],
      character: [{ card: op08JewelryBonney105, attachedDon: 1, playedOnTurn: 0 }],
      life: [eb01Doma005],
      deck: [
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
      ],
      activeDon: op02Squard009.cost,
    });
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op02Squard009, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(0);
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger draws two then trashes one without DON or turn conditions", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
        life: [op08JewelryBonney105],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    expect(trash).toMatchObject({ kind: "selectEntity", min: 1, max: 1 });
  });
});
