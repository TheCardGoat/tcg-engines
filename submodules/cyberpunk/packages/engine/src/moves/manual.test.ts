import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  createMockGear,
  createMockLegend,
  createMockUnit,
} from "../testing/index.ts";
import { enumerateMoves } from "../command/processor.ts";
import type { QueuedTrigger } from "../types/match-state.ts";
import { MANUAL_MOVE_IDS } from "./manual.ts";

function expectSuccess(result: { success: boolean }) {
  expect(result.success).toBe(true);
}

function queuedTrigger(id: string, sourceCardId: string, order: number): QueuedTrigger {
  const brandedCardId = sourceCardId as QueuedTrigger["sourceCardId"];
  return {
    id,
    sourceCardId: brandedCardId,
    sourcePlayerId: P1,
    abilityIndex: 0,
    abilityText: "Queued test trigger",
    event: {
      type: "effectTriggered",
      sourceCardId: brandedCardId,
      effectType: "event",
      playerId: P1,
    },
    contextTargets: {},
    boundTargets: {},
    order,
  };
}

describe("manual board-correction moves", () => {
  it("does not enumerate manual moves as legal actions", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [createMockUnit()], gigArea: [4], fixerDice: ["d6"] },
      { gigArea: [3] },
    );
    const available = enumerateMoves(engine.getState(), P1);
    for (const id of MANUAL_MOVE_IDS) {
      expect(available).not.toContain(id);
    }
  });

  it("sets a gig face without emitting steal or roll events", () => {
    const engine = CyberpunkTestEngine.createWithFixture({ gigArea: [4] }, { gigArea: [3] });
    const die = engine.getGigDice(P1)[0]!;
    const result = engine.executeMove(
      "manualSetGigValue",
      { args: { dieId: die.id, value: 1 } },
      P1,
    );
    expectSuccess(result);
    expect(engine.getGigValue(P1, 0)).toBe(1);
    expect(engine.getStreetCred(P1)).toBe(1);
    if (!result.success) return;
    expect(result.gameEvents.some((event) => event.type === "gigStolen")).toBe(false);
    expect(result.gameEvents.some((event) => event.type === "gigDieRolled")).toBe(false);
    expect(result.gameEvents).toContainEqual(
      expect.objectContaining({ type: "gigValueChanged", newValue: 1 }),
    );
  });

  it("rejects a gig face above the die maximum", () => {
    const engine = CyberpunkTestEngine.createWithFixture({ gigArea: [4] }, {});
    const die = engine.getGigDice(P1)[0]!;
    const result = engine.executeMove(
      "manualSetGigValue",
      { args: { dieId: die.id, value: 20 } },
      P1,
    );
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errorCode).toBe("INVALID_GIG_VALUE");
  });

  it("moves a gig between players without steal events or overtime win", () => {
    const engine = CyberpunkTestEngine.createWithFixture({ gigArea: [6] }, { gigArea: [3] });
    const die = engine.getGigDice(P1)[0]!;
    const result = engine.executeMove(
      "manualMoveGig",
      { args: { dieId: die.id, toPlayerId: P2, location: "gigArea" } },
      P1,
    );
    expectSuccess(result);
    expect(engine.getGigCount(P1)).toBe(0);
    expect(engine.getGigCount(P2)).toBe(2);
    expect(engine.getState().G.gameEnded).toBe(false);
    if (!result.success) return;
    expect(result.gameEvents.some((event) => event.type === "gigStolen")).toBe(false);
    expect(result.gameEvents).toContainEqual(
      expect.objectContaining({
        type: "gigDieMoved",
        from: "gigArea",
        to: "gigArea",
        playerId: P2,
        fromPlayerId: P1,
      }),
    );
  });

  it("returns a gig to the fixer zone and clears its face", () => {
    const engine = CyberpunkTestEngine.createWithFixture({ gigArea: [6], fixerDice: ["d8"] }, {});
    const die = engine.getGigDice(P1)[0]!;
    const fixerBefore = engine.getFixerDice(P1).length;
    const result = engine.executeMove(
      "manualMoveGig",
      { args: { dieId: die.id, toPlayerId: P1, location: "fixerArea" } },
      P1,
    );
    expectSuccess(result);
    expect(engine.getGigCount(P1)).toBe(0);
    expect(engine.getFixerDice(P1)).toHaveLength(fixerBefore + 1);
    const returned = engine.getState().G.gigDice[die.id as string];
    expect(returned?.location).toBe("fixerArea");
    expect(returned?.faceValue).toBe(0);
  });

  it("places a fixer die into the gig area", () => {
    const engine = CyberpunkTestEngine.createWithFixture({ fixerDice: ["d10"], gigArea: [2] }, {});
    const fixerDie = engine.getFixerDice(P1)[0]!;
    const result = engine.executeMove(
      "manualMoveGig",
      { args: { dieId: fixerDie.id, toPlayerId: P1, location: "gigArea" } },
      P1,
    );
    expectSuccess(result);
    expect(engine.getGigDice(P1).some((die) => die.id === fixerDie.id)).toBe(true);
    expect(engine.getState().G.gigDice[fixerDie.id as string]?.faceValue).toBe(1);
    if (!result.success) return;
    expect(result.gameEvents.some((event) => event.type === "gigDieRolled")).toBe(false);
  });

  it("moves a card from hand to field without play events", () => {
    const unit = createMockUnit({ name: "Street Unit" });
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [unit], eddies: 3 }, {});
    const card = engine.getCardsInZone("hand", P1)[0]!;
    const result = engine.executeMove(
      "manualMoveCard",
      { args: { cardId: card.instanceId, toZone: "field" } },
      P1,
    );
    expectSuccess(result);
    expect(engine.getCardsInZone("field", P1).map((entry) => entry.instanceId)).toContain(
      card.instanceId,
    );
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
    if (!result.success) return;
    expect(result.gameEvents.some((event) => event.type === "cardPlayed")).toBe(false);
    expect(result.gameEvents).toContainEqual(
      expect.objectContaining({ type: "cardMoved", fromZone: "hand", toZone: "field" }),
    );
  });

  it("syncs eddie membership when moving to and from Eddie", () => {
    const unit = createMockUnit({ name: "For Sale" });
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [unit], eddies: 2 }, {});
    const card = engine.getCardsInZone("hand", P1)[0]!;
    const eddiesBefore = engine.getEddies(P1);

    expectSuccess(
      engine.executeMove(
        "manualMoveCard",
        { args: { cardId: card.instanceId, toZone: "eddieArea" } },
        P1,
      ),
    );
    expect(engine.getCardsInZone("eddieArea", P1)).toHaveLength(1);
    expect(engine.getEddies(P1)).toBe(eddiesBefore + 1);
    expect(engine.getState().G.players[P1]!.eddieCardIds).toContain(card.instanceId);
    expect(engine.getState().G.players[P1]!.soldThisTurn).toBe(false);

    expectSuccess(
      engine.executeMove(
        "manualMoveCard",
        { args: { cardId: card.instanceId, toZone: "trash" } },
        P1,
      ),
    );
    expect(engine.getCardsInZone("trash", P1)).toHaveLength(1);
    expect(engine.getEddies(P1)).toBe(eddiesBefore);
    expect(engine.getState().G.players[P1]!.eddieCardIds).not.toContain(card.instanceId);
  });

  it("detaches hosted gear when the host leaves the field", () => {
    const gear = createMockGear({ name: "Optics" });
    const host = createMockUnit({ name: "Host Unit" });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: host, attachedGears: [gear] }] },
      {},
    );
    const hostCard = engine.getCardsInZone("field", P1).find((card) => !card.meta.attachedToId)!;
    const gearCard = engine
      .getCardsInZone("field", P1)
      .find((card) => card.meta.attachedToId === hostCard.instanceId)!;

    expectSuccess(
      engine.executeMove(
        "manualMoveCard",
        { args: { cardId: hostCard.instanceId, toZone: "trash" } },
        P1,
      ),
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.instanceId)).toContain(
      hostCard.instanceId,
    );
    const leftover = engine.getState().G.cardIndex[gearCard.instanceId as string]!;
    expect(leftover.zone).toBe("field");
    expect(leftover.meta.attachedToId).toBeNull();
  });

  it("attaches and unattaches gear without play events", () => {
    const gear = createMockGear({ name: "Mantis Blades" });
    const host = createMockUnit({ name: "Solo" });
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [gear], field: [host] }, {});
    const gearCard = engine.getCardsInZone("hand", P1)[0]!;
    const hostCard = engine.getCardsInZone("field", P1)[0]!;

    const attach = engine.executeMove(
      "manualAttachGear",
      { args: { gearId: gearCard.instanceId, hostId: hostCard.instanceId } },
      P1,
    );
    expectSuccess(attach);
    const attachedGear = engine.getState().G.cardIndex[gearCard.instanceId as string]!;
    expect(attachedGear.zone).toBe("field");
    expect(attachedGear.meta.attachedToId).toBe(hostCard.instanceId);
    expect(
      engine.getState().G.cardIndex[hostCard.instanceId as string]!.meta.attachedGearIds,
    ).toContain(gearCard.instanceId);
    if (attach.success) {
      expect(attach.gameEvents.some((event) => event.type === "cardPlayed")).toBe(false);
    }

    const detach = engine.executeMove(
      "manualDetachGear",
      { args: { gearId: gearCard.instanceId } },
      P1,
    );
    expectSuccess(detach);
    const freeGear = engine.getState().G.cardIndex[gearCard.instanceId as string]!;
    expect(freeGear.zone).toBe("field");
    expect(freeGear.meta.attachedToId).toBeNull();
  });

  it("moves a Legend to the Legend area and to trash", () => {
    const legend = createMockLegend({ name: "Street Legend" });
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [legend] }, {});
    const card = engine.getCardsInZone("hand", P1)[0]!;
    expectSuccess(
      engine.executeMove(
        "manualMoveCard",
        { args: { cardId: card.instanceId, toZone: "legendArea" } },
        P1,
      ),
    );
    expect(engine.getCardsInZone("legendArea", P1).map((entry) => entry.instanceId)).toContain(
      card.instanceId,
    );
    expect(engine.getState().G.cardIndex[card.instanceId as string]!.meta.faceDown).toBe(true);

    expectSuccess(
      engine.executeMove(
        "manualMoveCard",
        { args: { cardId: card.instanceId, toZone: "trash" } },
        P1,
      ),
    );
    expect(engine.getCardsInZone("trash", P1).map((entry) => entry.instanceId)).toContain(
      card.instanceId,
    );
  });

  it("rejects moving a non-Legend into the Legend area", () => {
    const unit = createMockUnit({ name: "Not a Legend" });
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [unit] }, {});
    const card = engine.getCardsInZone("hand", P1)[0]!;
    const result = engine.executeMove(
      "manualMoveCard",
      { args: { cardId: card.instanceId, toZone: "legendArea" } },
      P1,
    );
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errorCode).toBe("NOT_LEGEND");
  });

  it("moves a card to the top or bottom of the deck", () => {
    const first = createMockUnit({ name: "First" });
    const second = createMockUnit({ name: "Second" });
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [first, second] }, {});
    const [topCard, bottomCard] = engine.getCardsInZone("hand", P1);
    expect(topCard && bottomCard).toBeTruthy();
    if (!topCard || !bottomCard) return;

    expectSuccess(
      engine.executeMove(
        "manualMoveCard",
        { args: { cardId: topCard.instanceId, toZone: "deck", deckPosition: "top" } },
        P1,
      ),
    );
    expect(engine.getState().G.players[P1]!.zones.deck[0]).toBe(topCard.instanceId);

    expectSuccess(
      engine.executeMove(
        "manualMoveCard",
        { args: { cardId: bottomCard.instanceId, toZone: "deck", deckPosition: "bottom" } },
        P1,
      ),
    );
    const deck = engine.getState().G.players[P1]!.zones.deck;
    expect(deck[deck.length - 1]).toBe(bottomCard.instanceId);
  });

  it("draws from the top or bottom of the deck without ending the game", () => {
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [] }, {});
    const deckBefore = engine.getState().G.players[P1]!.zones.deck.slice();
    expect(deckBefore.length).toBeGreaterThan(1);
    const topId = deckBefore[0]!;
    const bottomId = deckBefore[deckBefore.length - 1]!;

    expectSuccess(engine.executeMove("manualDrawCard", { args: { from: "top" } }, P1));
    expect(engine.getCardsInZone("hand", P1).map((card) => card.instanceId)).toContain(topId);

    expectSuccess(engine.executeMove("manualDrawCard", { args: { from: "bottom" } }, P1));
    expect(engine.getCardsInZone("hand", P1).map((card) => card.instanceId)).toContain(bottomId);
    expect(engine.getState().G.gameEnded).toBe(false);
  });

  it("spends and readies a field unit", () => {
    const unit = createMockUnit({ name: "Huscle" });
    const engine = CyberpunkTestEngine.createWithFixture({ field: [unit] }, {});
    const card = engine.getCardsInZone("field", P1)[0]!;
    expectSuccess(engine.executeMove("manualExertCard", { args: { cardId: card.instanceId } }, P1));
    expect(engine.getState().G.cardIndex[card.instanceId as string]!.meta.spent).toBe(true);
    expectSuccess(engine.executeMove("manualReadyCard", { args: { cardId: card.instanceId } }, P1));
    expect(engine.getState().G.cardIndex[card.instanceId as string]!.meta.spent).toBe(false);
  });

  it("syncs eddie count when spending and readying an Eddie card", () => {
    const unit = createMockUnit({ name: "Sold" });
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [unit], eddies: 2 }, {});
    const card = engine.getCardsInZone("hand", P1)[0]!;
    expectSuccess(
      engine.executeMove(
        "manualMoveCard",
        { args: { cardId: card.instanceId, toZone: "eddieArea" } },
        P1,
      ),
    );
    const afterMove = engine.getEddies(P1);
    expectSuccess(engine.executeMove("manualExertCard", { args: { cardId: card.instanceId } }, P1));
    expect(engine.getEddies(P1)).toBe(afterMove - 1);
    expectSuccess(engine.executeMove("manualReadyCard", { args: { cardId: card.instanceId } }, P1));
    expect(engine.getEddies(P1)).toBe(afterMove);
  });

  it("runs while a pending choice is open", () => {
    const unit = createMockUnit();
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [unit], gigArea: [5] }, {});
    engine.judgeSetPendingChoice({
      type: "gainGig",
      chooserId: P1,
      effectId: "test",
      payload: { allowedDieIds: [] },
    });
    const card = engine.getCardsInZone("hand", P1)[0]!;
    const result = engine.executeMove(
      "manualMoveCard",
      { args: { cardId: card.instanceId, toZone: "field" } },
      P1,
    );
    expectSuccess(result);
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("gainGig");
    expect(engine.getCardsInZone("field", P1)).toHaveLength(1);
  });
});

describe("manualClearPendingResolution", () => {
  function setupStuckResolution() {
    const unit = createMockUnit({ name: "Stuck Source" });
    const engine = CyberpunkTestEngine.createWithFixture({ field: [unit] }, {});
    const card = engine.getCardsInZone("field", P1)[0]!;
    engine.judgeSetTurnMetadata({
      currentTrigger: {
        ...queuedTrigger("t-current", card.instanceId as string, 0),
        nextEffectIndex: 1,
      },
      triggerQueue: [
        queuedTrigger("t-1", card.instanceId as string, 1),
        queuedTrigger("t-2", card.instanceId as string, 2),
      ],
    });
    engine.judgeSetPendingChoice({
      type: "chooseTarget",
      chooserId: P1,
      effectId: "test",
      payload: {
        type: "effectTarget",
        min: 1,
        max: 1,
        canDecline: false,
      },
    });
    return engine;
  }

  it("skips the current trigger and surfaces the next queued resolution", () => {
    const engine = setupStuckResolution();
    const result = engine.executeMove(
      "manualClearPendingResolution",
      { args: { scope: "current" } },
      P1,
    );
    expectSuccess(result);
    const metadata = engine.getState().G.turnMetadata;
    expect(metadata.currentTrigger).toBeUndefined();
    expect(metadata.pendingChoice?.type).toBe("chooseTrigger");
    expect(metadata.triggerQueue).toHaveLength(2);
    if (!result.success) return;
    expect(result.gameEvents).toContainEqual(
      expect.objectContaining({
        type: "actionLog",
        messageKey: "move.manualClearPendingResolution",
      }),
    );
  });

  it("clears the whole stack with scope all", () => {
    const engine = setupStuckResolution();
    const result = engine.executeMove(
      "manualClearPendingResolution",
      { args: { scope: "all" } },
      P1,
    );
    expectSuccess(result);
    const metadata = engine.getState().G.turnMetadata;
    expect(metadata.currentTrigger).toBeUndefined();
    expect(metadata.pendingChoice).toBeUndefined();
    expect(metadata.triggerQueue).toHaveLength(0);
    if (!result.success) return;
    expect(result.gameEvents).toContainEqual(
      expect.objectContaining({
        type: "actionLog",
        messageKey: "move.manualClearTriggerStack",
        params: expect.objectContaining({ count: 2 }),
      }),
    );
  });

  it("clears a wedged choice without currentTrigger when the queue backs up", () => {
    const unit = createMockUnit({ name: "Queue Source" });
    const engine = CyberpunkTestEngine.createWithFixture({ field: [unit] }, {});
    const card = engine.getCardsInZone("field", P1)[0]!;
    engine.judgeSetTurnMetadata({
      triggerQueue: [queuedTrigger("t-1", card.instanceId as string, 1)],
    });
    engine.judgeSetPendingChoice({
      type: "gainGig",
      chooserId: P1,
      effectId: "test",
      payload: { allowedDieIds: [] },
    });
    const result = engine.executeMove(
      "manualClearPendingResolution",
      { args: { scope: "current" } },
      P1,
    );
    expectSuccess(result);
    const metadata = engine.getState().G.turnMetadata;
    expect(metadata.pendingChoice).toBeUndefined();
    expect(metadata.triggerQueue).toHaveLength(0);
  });

  it("rejects when nothing is resolving and rejects an unknown scope", () => {
    const engine = CyberpunkTestEngine.createWithFixture({ field: [createMockUnit()] }, {});
    const idle = engine.executeMove(
      "manualClearPendingResolution",
      { args: { scope: "current" } },
      P1,
    );
    expect(idle.success).toBe(false);
    if (idle.success) return;
    expect(idle.errorCode).toBe("NO_PENDING_RESOLUTION");

    const stuck = setupStuckResolution();
    const badScope = stuck.executeMove(
      "manualClearPendingResolution",
      { args: { scope: "everything" } as never },
      P1,
    );
    expect(badScope.success).toBe(false);
    if (badScope.success) return;
    expect(badScope.errorCode).toBe("INVALID_CLEAR_SCOPE");
  });
});

describe("manualResetCombat", () => {
  function setupCombat() {
    const unit = createMockUnit({ name: "Attacker" });
    const engine = CyberpunkTestEngine.createWithFixture({ field: [unit], gigArea: [3] }, {});
    const card = engine.getCardsInZone("field", P1)[0]!;
    engine.judgeSetAttackState({
      attackerId: card.instanceId,
      defenderId: null,
      rivalId: P2,
      kind: "direct",
      step: "attack",
    });
    return engine;
  }

  it("clears the attack and its combat prompt, staying in the main phase", () => {
    const engine = setupCombat();
    const attacker = engine.getCardsInZone("field", P1)[0]!;
    engine.judgeSetPendingChoice({
      type: "chooseGigsToSteal",
      chooserId: P1,
      effectId: "attack",
      payload: {
        count: 1,
        attackerId: attacker.instanceId,
        rivalId: P2,
        eligibleDieIds: [],
      },
    });

    const result = engine.executeMove("manualResetCombat", { args: {} }, P1);
    expectSuccess(result);
    expect(engine.getState().G.attackState).toBeNull();
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getState().G.gamePhase).toBe("main");
    if (!result.success) return;
    expect(result.gameEvents).toContainEqual(
      expect.objectContaining({
        type: "actionLog",
        messageKey: "move.manualResetCombat",
      }),
    );
  });

  it("clears the current resolution, queued triggers, and pending choice with the combat", () => {
    const engine = setupCombat();
    const attacker = engine.getCardsInZone("field", P1)[0]!;
    engine.judgeSetTurnMetadata({
      currentTrigger: {
        ...queuedTrigger("combat-current", attacker.instanceId as string, 0),
        nextEffectIndex: 0,
      },
      triggerQueue: [queuedTrigger("combat-queued", attacker.instanceId as string, 1)],
    });
    engine.judgeSetPendingChoice({
      type: "gainGig",
      chooserId: P1,
      effectId: "test",
      payload: { allowedDieIds: [] },
    });

    const result = engine.executeMove("manualResetCombat", { args: {} }, P1);
    expectSuccess(result);
    expect(engine.getState().G.attackState).toBeNull();
    expect(engine.getState().G.turnMetadata.currentTrigger).toBeUndefined();
    expect(engine.getState().G.turnMetadata.triggerQueue).toHaveLength(0);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    if (!result.success) return;
    expect(result.gameEvents).toContainEqual(
      expect.objectContaining({
        type: "actionLog",
        messageKey: "move.manualClearTriggerStack",
        params: expect.objectContaining({ count: 1 }),
      }),
    );
  });

  it("rejects when no combat is in progress", () => {
    const engine = CyberpunkTestEngine.createWithFixture({ field: [createMockUnit()] }, {});
    const result = engine.executeMove("manualResetCombat", { args: {} }, P1);
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errorCode).toBe("NO_ACTIVE_COMBAT");
  });
});

describe("manualForcePassTurn", () => {
  it("clears triggers, stack, and combat, then advances to the rival's turn", () => {
    const unit = createMockUnit({ name: "Force Pass Attacker" });
    const engine = CyberpunkTestEngine.createWithFixture({ field: [unit] }, {});
    const card = engine.getCardsInZone("field", P1)[0]!;
    engine.judgeSetAttackState({
      attackerId: card.instanceId,
      defenderId: null,
      rivalId: P2,
      kind: "direct",
      step: "react",
    });
    engine.judgeSetTurnMetadata({
      currentTrigger: {
        id: "fp-1",
        sourceCardId: card.instanceId,
        sourcePlayerId: P1,
        abilityIndex: 0,
        abilityText: "Wedged",
        event: {
          type: "effectTriggered",
          sourceCardId: card.instanceId,
          effectType: "event",
          playerId: P1,
        },
        contextTargets: {},
        boundTargets: {},
        order: 1,
        nextEffectIndex: 0,
      },
      triggerQueue: [
        {
          id: "fp-q1",
          sourceCardId: card.instanceId,
          sourcePlayerId: P1,
          abilityIndex: 0,
          abilityText: "Queued",
          event: {
            type: "effectTriggered",
            sourceCardId: card.instanceId,
            effectType: "event",
            playerId: P1,
          },
          contextTargets: {},
          boundTargets: {},
          order: 2,
        },
      ],
    });
    engine.judgeSetPendingChoice({
      type: "chooseTarget",
      chooserId: P1,
      effectId: "wedged",
      payload: { type: "effectTarget", min: 1, max: 1, canDecline: false },
    });

    const turnBefore = engine.getState().G.turnMetadata.turnNumber;
    const result = engine.executeMove("manualForcePassTurn", { args: {} }, P1);
    expectSuccess(result);

    const state = engine.getState();
    expect(state.G.attackState).toBeNull();
    expect(state.G.turnMetadata.turnNumber).toBe(turnBefore + 1);
    expect(state.G.turnMetadata.activePlayerId).toBe(P2);
    expect(state.G.turnMetadata.currentTrigger).toBeUndefined();
    expect(state.G.turnMetadata.triggerQueue).toHaveLength(0);
    if (!result.success) return;
    expect(result.gameEvents).toContainEqual(
      expect.objectContaining({
        type: "actionLog",
        messageKey: "move.manualClearTriggerStack",
        params: expect.objectContaining({ count: 1 }),
      }),
    );
  });

  it("rejects outside the main phase", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [createMockUnit()] },
      {},
      { gamePhase: "start", autoGainGig: false },
    );
    expect(engine.getState().G.gamePhase).toBe("start");
    const result = engine.executeMove("manualForcePassTurn", { args: {} }, P1);
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errorCode).toBe("INVALID_PHASE");
  });

  it("passes cleanly from a main phase with nothing pending", () => {
    const engine = CyberpunkTestEngine.createWithFixture({ field: [createMockUnit()] }, {});
    const result = engine.executeMove("manualForcePassTurn", { args: {} }, P1);
    expectSuccess(result);
    expect(engine.getState().G.turnMetadata.activePlayerId).toBe(P2);
  });
});

describe("manualSetEddies", () => {
  it("sets the count and zeroes spentEddies", () => {
    const eddieCard = createMockUnit({ name: "Eddie Card" });
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [eddieCard], eddies: 0 }, {});
    const card = engine.getCardsInZone("hand", P1)[0]!;
    expectSuccess(
      engine.executeMove(
        "manualMoveCard",
        { args: { cardId: card.instanceId, toZone: "eddieArea" } },
        P1,
      ),
    );
    expectSuccess(engine.executeMove("manualExertCard", { args: { cardId: card.instanceId } }, P1));
    expect(engine.getEddies(P1)).toBe(0);

    const result = engine.executeMove("manualSetEddies", { args: { amount: 1 } }, P1);
    expectSuccess(result);
    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getState().G.players[P1]!.spentEddies).toBe(0);
  });

  it("rejects negative amounts", () => {
    const engine = CyberpunkTestEngine.createWithFixture({ eddies: 0 }, {});
    for (const amount of [-1]) {
      const result = engine.executeMove("manualSetEddies", { args: { amount } }, P1);
      expect(result.success).toBe(false);
      if (result.success) return;
      expect(result.errorCode).toBe("INVALID_EDDIE_AMOUNT");
    }
  });
});

describe("manualResetOncePerTurn", () => {
  it("re-arms the gig flag and clears only this player's ability ledger entries", () => {
    const p1Unit = createMockUnit({ name: "P1 Trigger" });
    const p2Unit = createMockUnit({ name: "P2 Trigger" });
    const engine = CyberpunkTestEngine.createWithFixture({ field: [p1Unit] }, { field: [p2Unit] });
    const p1Card = engine.getCardsInZone("field", P1)[0]!;
    const p2Card = engine.getCardsInZone("field", P2)[0]!;
    engine.judgeSetTurnMetadata({
      gigTakenThisTurn: true,
      abilityFiredThisTurn: [
        { cardId: p1Card.instanceId, abilityIndex: 0 },
        { cardId: p2Card.instanceId, abilityIndex: 0 },
      ],
    });

    const result = engine.executeMove("manualResetOncePerTurn", { args: {} }, P1);
    expectSuccess(result);
    const metadata = engine.getState().G.turnMetadata;
    expect(metadata.gigTakenThisTurn).toBe(false);
    expect(metadata.abilityFiredThisTurn).toEqual([{ cardId: p2Card.instanceId, abilityIndex: 0 }]);
  });

  it("re-arms the legend call after it was spent this turn", () => {
    const legend = createMockLegend({ name: "Callable Legend" });
    const engine = CyberpunkTestEngine.createWithFixture(
      { legendArea: [{ card: legend, faceDown: true }], eddies: 1 },
      {},
    );
    expectSuccess(engine.callLegend(legend, { as: P1 }));
    expect(engine.getState().G.players[P1]!.calledLegendThisTurn).toBe(true);

    expectSuccess(engine.executeMove("manualResetOncePerTurn", { args: {} }, P1));
    expect(engine.getState().G.players[P1]!.calledLegendThisTurn).toBe(false);
  });
});

describe("manualSetCardFace", () => {
  it("flips a Legend in the Legend area without moving it", () => {
    const legend = createMockLegend({ name: "Face Legend" });
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [legend] }, {});
    const card = engine.getCardsInZone("hand", P1)[0]!;
    expectSuccess(
      engine.executeMove(
        "manualMoveCard",
        { args: { cardId: card.instanceId, toZone: "legendArea" } },
        P1,
      ),
    );
    expect(engine.getState().G.cardIndex[card.instanceId as string]!.meta.faceDown).toBe(true);

    expectSuccess(
      engine.executeMove(
        "manualSetCardFace",
        { args: { cardId: card.instanceId, faceDown: false } },
        P1,
      ),
    );
    expect(engine.getState().G.cardIndex[card.instanceId as string]!.meta.faceDown).toBe(false);
    expect(engine.getCardsInZone("legendArea", P1).map((c) => c.instanceId)).toContain(
      card.instanceId,
    );
  });

  it("rejects cards outside the Legend area", () => {
    const unit = createMockUnit({ name: "Field Unit" });
    const engine = CyberpunkTestEngine.createWithFixture({ field: [unit] }, {});
    const card = engine.getCardsInZone("field", P1)[0]!;
    const result = engine.executeMove(
      "manualSetCardFace",
      { args: { cardId: card.instanceId, faceDown: true } },
      P1,
    );
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errorCode).toBe("NOT_IN_LEGEND_AREA");
  });
});

describe("manualReadyAll", () => {
  it("readies every spent card and re-grants spent Eddie-card Eddies", () => {
    const spentUnit = createMockUnit({ name: "Spent Unit" });
    const eddieCard = createMockUnit({ name: "Eddie Card" });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [spentUnit], hand: [eddieCard], eddies: 0 },
      {},
    );
    const unitCard = engine.getCardsInZone("field", P1)[0]!;
    const eddie = engine.getCardsInZone("hand", P1)[0]!;
    expectSuccess(
      engine.executeMove("manualExertCard", { args: { cardId: unitCard.instanceId } }, P1),
    );
    expectSuccess(
      engine.executeMove(
        "manualMoveCard",
        { args: { cardId: eddie.instanceId, toZone: "eddieArea" } },
        P1,
      ),
    );
    expectSuccess(
      engine.executeMove("manualExertCard", { args: { cardId: eddie.instanceId } }, P1),
    );
    expect(engine.getEddies(P1)).toBe(0);

    const result = engine.executeMove("manualReadyAll", { args: {} }, P1);
    expectSuccess(result);
    expect(engine.getState().G.cardIndex[unitCard.instanceId as string]!.meta.spent).toBe(false);
    expect(engine.getState().G.cardIndex[eddie.instanceId as string]!.meta.spent).toBe(false);
    expect(engine.getEddies(P1)).toBe(1);
    if (!result.success) return;
    expect(result.gameEvents).toContainEqual(
      expect.objectContaining({
        type: "actionLog",
        messageKey: "move.manualReadyAll",
        params: expect.objectContaining({ count: 2 }),
      }),
    );
  });
});

describe("manualRecomputeActiveEffects", () => {
  it("runs and reports the rebuilt effect count", () => {
    const engine = CyberpunkTestEngine.createWithFixture({ field: [createMockUnit()] }, {});
    const result = engine.executeMove("manualRecomputeActiveEffects", { args: {} }, P1);
    expectSuccess(result);
    if (!result.success) return;
    expect(result.gameEvents).toContainEqual(
      expect.objectContaining({
        type: "actionLog",
        messageKey: "move.manualRecomputeActiveEffects",
        params: expect.objectContaining({ count: engine.getState().G.activeEffects.length }),
      }),
    );
  });
});

describe("manualDropEffectBagEntry", () => {
  // The happy path delegates to `operations.game.removeBagEntry`, which the
  // delayed-effect card suites already cover; here we pin the validation.
  it("rejects unknown bag entry ids", () => {
    const engine = CyberpunkTestEngine.createWithFixture({ field: [createMockUnit()] }, {});
    const result = engine.executeMove(
      "manualDropEffectBagEntry",
      { args: { entryId: "missing" } },
      P1,
    );
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errorCode).toBe("BAG_ENTRY_NOT_FOUND");
  });
});
