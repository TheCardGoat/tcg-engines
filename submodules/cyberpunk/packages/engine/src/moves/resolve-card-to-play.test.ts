import { beforeAll, describe, expect, it } from "vite-plus/test";
import "../testing/matchers.d.ts";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  createMockGear,
  createMockLegend,
  createMockUnit,
  registerMatchers,
} from "../testing/index.ts";
import type { CardInstanceId } from "../types/branded.ts";

beforeAll(() => {
  registerMatchers();
});

function setChooseCardToPlayChoice(
  engine: CyberpunkTestEngine,
  cardId: CardInstanceId,
  free = false,
  canDecline = false,
) {
  engine.judgeSetPendingChoice({
    type: "chooseCardToPlay",
    chooserId: P1,
    effectId: "",
    payload: {
      cardIds: [cardId],
      free,
      canDecline,
      boundTargets: {},
      sourceCardId: cardId,
      sourcePlayerId: P1,
      abilityIndex: 0,
      ifEffects: [],
    },
  });
}

describe("resolveCardToPlay", () => {
  it("rejects a Gear host argument for a non-Gear choice", () => {
    const unit = createMockUnit({ name: "Non-Gear Follow-Up" });
    const host = createMockUnit({ name: "Invalid Host Argument" });
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [unit], field: [host] });
    const cardId = engine.findCardId(unit, "hand", P1) as CardInstanceId;
    const hostId = engine.findCardId(host, "field", P1) as CardInstanceId;
    setChooseCardToPlayChoice(engine, cardId, true);

    const failure = engine.expectFailure(() =>
      engine.resolveCardToPlay(unit, { as: P1, attachToId: hostId }),
    );
    expect(failure.errorCode).toBe("INVALID_ARGS");
    expect(engine.getCard(unit, "hand", P1).zone).toBe("hand");
  });

  it("rejects a non-free pending card choice when the player cannot pay the effective cost", () => {
    const unit = createMockUnit({ name: "Expensive Follow-Up", cost: 3 });
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [unit], eddies: 1 });
    engine.spendAllLegends();
    const cardId = engine.findCardId(unit, "hand", P1) as CardInstanceId;
    setChooseCardToPlayChoice(engine, cardId, false, true);

    const failure = engine.expectFailure(() => engine.resolveCardToPlay(unit, { as: P1 }));

    expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    expect(engine.getCard(unit, "hand", P1)).toBeInZone("hand");
    expect(engine.getState()).toHaveEddies({ player: "p1", count: 1 });

    expect(engine.resolveCardToPlay(undefined, { as: P1, pass: true })).toBeSuccessfulCommand();
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCard(unit, "hand", P1)).toBeInZone("hand");
    expect(engine.completeTurn({ as: P1 })).toBeSuccessfulCommand();
  });

  it("allows a free pending card choice without eddies", () => {
    const unit = createMockUnit({ name: "Free Follow-Up", cost: 3 });
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [unit], eddies: 0 });
    engine.spendAllLegends();
    const cardId = engine.findCardId(unit, "hand", P1) as CardInstanceId;
    setChooseCardToPlayChoice(engine, cardId, true);

    expect(engine.resolveCardToPlay(unit, { as: P1 })).toBeSuccessfulCommand();
    expect(engine.getCard(unit, "field", P1)).toBeInZone("field");
    expect(engine.getState()).toHaveEddies({ player: "p1", count: 0 });
  });

  it("matches payment triggers before an effect-selected Gear is equipped", () => {
    const drawnCard = createMockUnit({ name: "Must remain in deck" });
    const futureHost = createMockLegend({ name: "Future selected-play host", hasSellTag: true });
    const gear = createMockGear({
      name: "Selected-play spend trigger Gear",
      cost: 2,
      abilities: [
        {
          kind: "triggered",
          text: "When this Unit or Legend is spent, draw 1.",
          trigger: {
            trigger: "event",
            event: { event: "cardSpent", player: "friendly", target: { selector: "host" } },
          },
          source: { selector: "host" },
          effects: [{ effect: "draw", player: "friendly", amount: 1 }],
        },
      ],
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [gear],
        deck: [drawnCard],
        legendArea: [{ card: futureHost, faceDown: false }],
        eddies: 1,
      },
      {},
      { preserveDeckOrder: true },
    );
    const gearId = engine.findCardId(gear, "hand", P1) as CardInstanceId;
    const hostId = engine.findCardId(futureHost, "legendArea", P1) as CardInstanceId;
    engine.judgeSetPendingChoice({
      type: "chooseCardToPlay",
      chooserId: P1,
      effectId: "paid-selected-gear",
      payload: {
        cardIds: [gearId],
        free: false,
        resolvedAttachToId: hostId,
        sourceCardId: gearId,
        sourcePlayerId: P1,
        abilityIndex: 0,
      },
    });

    expect(engine.resolveCardToPlay(gear, { as: P1 })).toBeSuccessfulCommand();

    engine.expectNoPendingChoice();
    expect(engine.getCard(futureHost, "legendArea", P1).meta.spent).toBe(true);
    expect(engine.getCard(gear, "field", P1).meta.attachedToId).toBe(hostId);
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
    expect(engine.getCardsInZone("deck", P1)[0]?.definitionId).toBe(drawnCard.id);
  });

  it("resumes later ability effects after an optional free Gear is declined", () => {
    const offeredGear = createMockGear({ name: "Optional Gear" });
    const drawnCard = createMockUnit({ name: "Later Effect Draw" });
    const source = createMockUnit({
      name: "Optional Gear Source",
      abilities: [
        {
          kind: "triggered",
          text: "You may play a Gear for free. Draw 1.",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            {
              effect: "playCard",
              target: { selector: "bound", id: "gear" },
              free: true,
              optional: true,
            },
            { effect: "draw", player: "friendly", amount: 1 },
          ],
        },
      ],
    });
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [offeredGear],
      field: [source],
      deck: [drawnCard],
    });
    const sourceCard = engine.getCard(source, "field", P1);
    const offeredGearId = engine.findCardId(offeredGear, "hand", P1) as CardInstanceId;
    engine.judgeSetTurnMetadata({
      currentTrigger: {
        kind: "authored",
        id: "optional-gear-trigger",
        sourceCardId: sourceCard.instanceId as CardInstanceId,
        sourcePlayerId: P1,
        abilityIndex: 0,
        abilityText: "You may play a Gear for free. Draw 1.",
        event: {
          type: "effectTriggered",
          sourceCardId: sourceCard.instanceId as CardInstanceId,
          effectType: "play",
          playerId: P1,
        },
        contextTargets: {},
        boundTargets: { gear: [offeredGearId] },
        order: 0,
        nextEffectIndex: 1,
        costsPaid: true,
      },
    });
    engine.judgeSetPendingChoice({
      type: "chooseCardToPlay",
      chooserId: P1,
      effectId: "optional-gear-trigger",
      payload: {
        cardIds: [offeredGearId],
        free: true,
        canDecline: true,
        sourceCardId: sourceCard.instanceId as CardInstanceId,
        sourcePlayerId: P1,
        abilityIndex: 0,
        boundTargets: { gear: [offeredGearId] },
        onDecline: "resumeTrigger",
      },
    });
    const handCountBeforeDecline = engine.getCardsInZone("hand", P1).length;

    expect(engine.resolveCardToPlay(undefined, { as: P1, pass: true })).toBeSuccessfulCommand();

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handCountBeforeDecline + 1);
    expect(engine.getState().G.turnMetadata.currentTrigger).toBeUndefined();
  });

  it("assigns a configured rival Gear host choice to the rival", () => {
    const gear = createMockGear({ name: "Rival-Chosen Gear" });
    const host = createMockUnit({ name: "Friendly Host" });
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [gear], field: [host] }, {});
    const gearId = engine.findCardId(gear, "hand", P1) as CardInstanceId;
    const hostId = engine.findCardId(host, "field", P1) as CardInstanceId;
    engine.judgeSetPendingChoice({
      type: "chooseCardToPlay",
      chooserId: P1,
      effectId: "rival-host-choice",
      payload: {
        cardIds: [gearId],
        free: true,
        sourceCardId: gearId,
        sourcePlayerId: P1,
        attachTo: {
          selector: "card",
          controller: "friendly",
          zones: ["field"],
          cardTypes: ["unit"],
          selection: { mode: "choose", min: 1, max: 1, chooser: "rival" },
        },
      },
    });

    expect(engine.resolveCardToPlay(gear, { as: P1 })).toBeSuccessfulCommand();
    const hostChoice = engine.getState().G.turnMetadata.pendingChoice;
    expect(hostChoice?.type).toBe("chooseTarget");
    expect(hostChoice?.chooserId).toBe(P2);

    expect(engine.resolveEffectTarget(host, { as: P2 })).toBeSuccessfulCommand();
    expect(engine.getCard(gear, "field", P1).meta.attachedToId).toBe(hostId);
  });
});
