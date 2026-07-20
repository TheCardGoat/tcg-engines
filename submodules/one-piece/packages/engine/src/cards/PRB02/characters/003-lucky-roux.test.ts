import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb02ThePeak008,
  op01ScratchmenApoo103,
  op01Shanks120,
} from "@tcg/op-cards";
import { prb02LuckyRoux003 } from "../../../../../cards/src/cards/PRB02/characters/003-lucky-roux.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("PRB02-003 Lucky.Roux", () => {
  test("may trash only a 6000-or-more-power Character from hand to draw two", () => {
    const engine = OnePieceTestEngine.create({
      hand: [prb02LuckyRoux003, op01Shanks120, op01ScratchmenApoo103, eb01Doma005, eb02ThePeak008],
      deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
      activeDon: prb02LuckyRoux003.cost,
    });
    const paymentId = engine.findCardInZone("south", "hand", op01Shanks120);
    const lowPowerId = engine.findCardInZone("south", "hand", eb01Doma005);
    const eventId = engine.findCardInZone("south", "hand", eb02ThePeak008);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(prb02LuckyRoux003, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Lucky.Roux's hand-trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(paymentId);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(lowPowerId);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(eventId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.south.deckCount).toBe(deckBefore - 2);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing a card or drawing", () => {
    const engine = OnePieceTestEngine.create({
      hand: [prb02LuckyRoux003, op01Shanks120],
      deck: [eb01Doma005, eb01MountainGod018, eb01Doma005],
      activeDon: prb02LuckyRoux003.cost,
    });
    const paymentId = engine.findCardInZone("south", "hand", op01Shanks120);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(prb02LuckyRoux003, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.prompts).toHaveLength(0);
  });

  test("uses Blocker to redirect an attack and protect Leader Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: [prb02LuckyRoux003] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", prb02LuckyRoux003);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Lucky.Roux's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(blockerId);
    expect(view.prompts).toHaveLength(0);
  });
});
