import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op13JewelryBonney100 } from "@tcg/op-cards";
import { op13JewelryBonney108 } from "../../../../../cards/src/cards/OP13/characters/108-jewelry-bonney.ts";
import { op13JewelryBonney109 } from "../../../../../cards/src/cards/OP13/characters/109-jewelry-bonney.ts";
import { op13Stussy110 } from "../../../../../cards/src/cards/OP13/characters/110-stussy.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-110 Stussy", () => {
  test("with an included Egghead Leader may play only a cost-5-or-less Trigger Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op13JewelryBonney100,
        hand: [op13Stussy110, op13JewelryBonney109, op13JewelryBonney108, eb01Doma005],
        activeDon: op13Stussy110.cost,
      },
      {},
    );
    const eligibleId = engine.findCardInZone("south", "hand", op13JewelryBonney109);
    const tooExpensiveId = engine.findCardInZone("south", "hand", op13JewelryBonney108);
    const noTriggerId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op13Stussy110, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Stussy's hand play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(noTriggerId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may choose no Character, while a non-Egghead Leader receives no play choice", () => {
    const enabled = OnePieceTestEngine.create({
      leaderCardId: op13JewelryBonney100,
      hand: [op13Stussy110, op13JewelryBonney109],
      activeDon: op13Stussy110.cost,
    });
    const enabledCandidateId = enabled.findCardInZone("south", "hand", op13JewelryBonney109);
    enabled.playCard(op13Stussy110, "south");
    enabled.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");
    expect(enabled.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      enabledCandidateId,
    );
    expect(enabled.getView("south").prompts).toHaveLength(0);

    const disabled = OnePieceTestEngine.create({
      hand: [op13Stussy110, op13JewelryBonney109],
      activeDon: op13Stussy110.cost,
    });
    const disabledCandidateId = disabled.findCardInZone("south", "hand", op13JewelryBonney109);
    disabled.playCard(op13Stussy110, "south");
    expect(disabled.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      disabledCandidateId,
    );
    expect(disabled.getView("south").prompts).toHaveLength(0);
  });

  test("uses Blocker to redirect an attack and is K.O.'d instead of losing Life", () => {
    const engine = OnePieceTestEngine.create(
      { life: 2, character: [op13Stussy110] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const stussyId = engine.findCardInZone("south", "character", op13Stussy110);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Stussy's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(stussyId);
    engine.resolveDecision("battleBlocker", { selectedIds: [stussyId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(stussyId);
    expect(view.prompts).toHaveLength(0);
  });
});
