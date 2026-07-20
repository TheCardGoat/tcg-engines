import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Shanks120, op13Koby025 } from "@tcg/op-cards";
import { op13TrafalgarLaw031 } from "../../../../../cards/src/cards/OP13/characters/031-trafalgar-law.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-031 Trafalgar Law", () => {
  test("returns the selected Character, then plays a chosen cost-5 Character rested and resolves its On Play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13TrafalgarLaw031, op13Koby025, op01Shanks120],
      character: [eb01Doma005],
      activeDon: op13TrafalgarLaw031.cost,
      restedDon: 1,
    });
    const returnedId = engine.findCardInZone("south", "character", eb01Doma005);
    const kobyId = engine.findCardInZone("south", "hand", op13Koby025);
    const expensiveId = engine.findCardInZone("south", "hand", op01Shanks120);

    engine.playCard(op13TrafalgarLaw031, "south");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const payment = engine.pendingDecision("effectCostReturnCharacter", "south").steps[0];
    if (payment?.kind !== "payCost") throw new Error("Expected Law's Character return cost.");
    expect(payment).toMatchObject({ min: 1, max: 1 });
    expect(payment.candidates.map((candidate) => candidate.ref.id)).toContain(returnedId);
    engine.resolveDecision("effectCostReturnCharacter", { selectedIds: [returnedId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Law's rested play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(kobyId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [kobyId] }, "south");

    expect(engine.pendingDecision("effectSetActiveDon", "south").actorId).toBe("south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(returnedId);
    expect(view.players.south.characters.find((card) => card?.instanceId === kobyId)?.rested).toBe(
      true,
    );
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 6 });
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the On Play cost without returning or playing any Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13TrafalgarLaw031, op13Koby025],
      character: [eb01Doma005],
      activeDon: op13TrafalgarLaw031.cost,
    });
    const fieldId = engine.findCardInZone("south", "character", eb01Doma005);
    const handId = engine.findCardInZone("south", "hand", op13Koby025);

    engine.playCard(op13TrafalgarLaw031, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(fieldId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(handId);
    expect(view.prompts).toHaveLength(0);
  });

  test("gains Blocker only while its controller has one or less Life", () => {
    const enabled = OnePieceTestEngine.create(
      { life: 1, character: [op13TrafalgarLaw031] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const lawId = enabled.findCardInZone("south", "character", op13TrafalgarLaw031);
    const attackerId = enabled.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = enabled.getView("south").players.south.lifeCount;

    enabled.declareAttack(attackerId, enabled.leader("south"), "north");
    const blocker = enabled.pendingDecision("battleBlocker", "south");
    expect(blocker.actorId).toBe("south");
    const choice = blocker.steps[0];
    if (choice?.kind !== "selectEntity") throw new Error("Expected Law's Blocker choice.");
    expect(choice.candidates.map((candidate) => candidate.ref.id)).toContain(lawId);
    enabled.resolveDecision("battleBlocker", { selectedIds: [lawId] }, "south");

    expect(enabled.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(
      enabled.getView("south").players.south.characters.find((card) => card?.instanceId === lawId)
        ?.rested,
    ).toBe(true);
    expect(enabled.getView("south").prompts).toHaveLength(0);

    const disabled = OnePieceTestEngine.create(
      { life: 2, character: [op13TrafalgarLaw031] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const disabledAttackerId = disabled.findCardInZone("north", "character", eb01Doma005);
    disabled.declareAttack(disabledAttackerId, disabled.leader("south"), "north");

    expect(() => disabled.pendingDecision("battleBlocker", "south")).toThrow();
    expect(disabled.getView("south").prompts).toHaveLength(0);
  });
});
