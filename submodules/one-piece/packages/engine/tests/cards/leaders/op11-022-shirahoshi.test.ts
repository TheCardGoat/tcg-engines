import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op11BulgeEyedNeptunian027,
  op11Megalo112,
  op11ScaledNeptunian026,
  op11Shirahoshi022,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP11-022 Shirahoshi", () => {
  test("cannot attack and pays both costs to play an affordable Megalo alternative", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op11Shirahoshi022,
      hand: [op11Megalo112, op11BulgeEyedNeptunian027, op11ScaledNeptunian026],
      life: [eb01Doma005],
      activeDon: 4,
    });
    const megaloId = engine.findCardInZone("south", "hand", op11Megalo112);
    const neptunianId = engine.findCardInZone("south", "hand", op11BulgeEyedNeptunian027);
    const expensiveId = engine.findCardInZone("south", "hand", op11ScaledNeptunian026);

    const attackFailure = engine.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: engine.leader("south"),
      targetId: engine.leader("north"),
    });
    expect(attackFailure.reason).toBe("The selected attacker cannot attack.");

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const playStep = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") throw new Error("Expected a hand-play choice.");
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      megaloId,
      neptunianId,
    ]);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [megaloId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === megaloId)).toBe(true);
    expect(view.players.south).toMatchObject({ activeDon: 3, restedDon: 1 });
    expect(view.players.south.life[0]).toMatchObject({ cardId: eb01Doma005.id, hidden: false });
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op11Shirahoshi022,
      hand: [op11Megalo112, op11BulgeEyedNeptunian027, op11ScaledNeptunian026],
      life: [eb01Doma005],
      activeDon: 4,
    });
    engine.activateEffect(engine.leader("south"), "activateMain", "south");

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
