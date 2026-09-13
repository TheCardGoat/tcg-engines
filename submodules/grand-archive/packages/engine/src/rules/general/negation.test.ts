import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveTriggeredAbility,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import {
  grandArchiveObjectId,
  grandArchivePlayerId,
  grandArchiveStackItemId,
} from "../../game/identity.ts";
import type { GrandArchiveObjectId, GrandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState, GrandArchiveStackItem } from "../../game/model.ts";
import { collectGrandArchiveStateBasedEvents } from "../state/state-based.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId,
    slug: canonicalId,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${canonicalId}:face:default`,
        catalogId: canonicalId,
        name: canonicalId,
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { power: 1, life: 2 }
              : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("negation-champion", "CHAMPION");
const action = card("negation-action", "ACTION");
const triggerSource = card("negation-trigger-source", "ALLY");
const filler = card("negation-filler", "ACTION");

function player(id: "p1" | "p2"): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: action.canonicalId, count: 2 },
      { definitionId: triggerSource.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 6 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

function cardItem(
  id: string,
  cardId: GrandArchiveObjectId,
  controllerId: GrandArchivePlayerId,
  createdAtVersion: number,
): GrandArchiveStackItem {
  return {
    id: grandArchiveStackItemId(id),
    kind: "card-activation",
    controllerId,
    sourceId: cardId,
    cardId,
    originZone: "hand",
    paidCostKind: "reserve",
    elysianAuraActiveAtAnnouncement: false,
    announcedCardResolutionAbilities: [],
    selectedModeIds: [],
    targets: [],
    createdAtVersion,
    activationPhase: "main",
    isCopy: false,
    negated: false,
    opportunityPolicy: "normal",
    activationStates: [],
    activationPayment: [],
    championLevelModifier: 0,
    variables: {},
    bindings: {},
  };
}

function triggeredItem(
  id: string,
  sourceId: GrandArchiveObjectId,
  controllerId: GrandArchivePlayerId,
  triggerName: "object-entered-field" | "card-drawn",
  createdAtVersion: number,
): GrandArchiveStackItem {
  const ability: GrandArchiveTriggeredAbility = {
    id: triggerName === "object-entered-field" ? "negationEntered-a1" : "negationDrawn-a1",
    kind: "triggered",
    text: `Triggered by ${triggerName}.`,
    trigger: { kind: "event", event: { name: triggerName } },
    effect: { kind: "no-op" },
  };
  return {
    id: grandArchiveStackItemId(id),
    kind: "triggered-ability",
    controllerId,
    sourceId,
    ability,
    selectedModeIds: [],
    targets: [],
    createdAtVersion,
    activationPhase: "main",
    isCopy: false,
    negated: false,
    opportunityPolicy: "normal",
    activationStates: [],
    activationPayment: [],
    championLevelModifier: 0,
    variables: {},
    bindings: {},
  };
}

function setup(): {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly state: GrandArchiveMatchState;
  readonly p1ActionId: GrandArchiveObjectId;
  readonly p2ActionId: GrandArchiveObjectId;
  readonly triggerSourceId: GrandArchiveObjectId;
} {
  const program = createGrandArchiveMatchProgram([champion, action, triggerSource, filler]);
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 808,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const p1Action = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === action.canonicalId,
  )!;
  const p2Action = Object.values(initial.objects).find(
    (object) => object.ownerId === p2 && object.definitionId === action.canonicalId,
  )!;
  const source = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === triggerSource.canonicalId,
  )!;
  const kernel = new GrandArchiveTransactionKernel();
  const first = cardItem("stack-negation-1", p1Action.id, p1, initial.stateVersion);
  const second = cardItem("stack-negation-2", p2Action.id, p2, initial.stateVersion + 1);
  const state = kernel.transact(initial, [
    { type: "object-moved", objectId: p1Action.id, from: p1Action.zone, to: "effects-stack" },
    { type: "stack-item-added", item: first },
    { type: "object-moved", objectId: p2Action.id, from: p2Action.zone, to: "effects-stack" },
    { type: "stack-item-added", item: second },
    { type: "object-moved", objectId: source.id, from: source.zone, to: "field" },
  ]).state;
  return {
    program,
    state,
    p1ActionId: p1Action.id,
    p2ActionId: p2Action.id,
    triggerSourceId: source.id,
  };
}

describe("Grand Archive negation primitives", () => {
  it("negates every stack item matching the structured stack selection", () => {
    const { program, state, p1ActionId, p2ActionId } = setup();
    const p1 = grandArchivePlayerId("p1");
    const kernel = new GrandArchiveTransactionKernel();
    const result = executeGrandArchiveEffect(
      {
        kind: "negate-matching-stack-items",
        candidates: {
          kind: "stack-item",
          itemTypes: ["card-activation"],
          controller: "opponent",
          activationFrom: ["hand"],
          sourceFilter: { kind: "type", oneOf: ["ACTION"] },
        },
      },
      { program, state, controllerId: p1, bindings: {} },
      (current, events) => {
        const transaction = kernel.transact(current, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    expect(
      result.state.stack.flatMap((item) => (item.kind === "card-activation" ? [item.cardId] : [])),
    ).toEqual([p1ActionId]);
    expect(result.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "stack-item-negated",
          item: expect.objectContaining({ cardId: p2ActionId, negated: true }),
        }),
      ]),
    );
  });

  it("negates only triggered abilities from the named source and event", () => {
    const { program, state, triggerSourceId } = setup();
    const p1 = grandArchivePlayerId("p1");
    const kernel = new GrandArchiveTransactionKernel();
    const entered = triggeredItem(
      "stack-negation-trigger-1",
      triggerSourceId,
      p1,
      "object-entered-field",
      state.stateVersion,
    );
    const drawn = triggeredItem(
      "stack-negation-trigger-2",
      triggerSourceId,
      p1,
      "card-drawn",
      state.stateVersion + 1,
    );
    const withTriggers = kernel.transact(state, [
      { type: "stack-item-added", item: entered },
      { type: "stack-item-added", item: drawn },
    ]).state;
    const result = executeGrandArchiveEffect(
      {
        kind: "negate-triggered-abilities",
        source: { kind: "bound", binding: "suppressed-source" },
        triggerEvent: "object-entered-field",
      },
      {
        program,
        state: withTriggers,
        controllerId: p1,
        bindings: { "suppressed-source": [triggerSourceId] },
      },
      (current, events) => {
        const transaction = kernel.transact(current, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    expect(result.state.stack.some((item) => item.id === entered.id)).toBe(false);
    expect(result.state.stack.some((item) => item.id === drawn.id)).toBe(true);
  });

  it("makes a negated copied card activation cease instead of entering a game zone", () => {
    const { program, state, p1ActionId } = setup();
    const p1 = grandArchivePlayerId("p1");
    const source = state.objects[p1ActionId]!;
    const copiedCard = {
      ...source,
      id: grandArchiveObjectId(`object-${state.nextObjectOrdinal}`),
      ownerId: p1,
      controllerId: p1,
      zone: "effects-stack" as const,
      copy: { sourceObjectId: source.id, expires: "when-unassociated" as const },
      objectVersion: 1,
    };
    const copiedItem = {
      ...cardItem("stack-negation-copy", copiedCard.id, p1, state.stateVersion),
      isCopy: true,
    };
    const kernel = new GrandArchiveTransactionKernel();
    const withCopy = kernel.transact(state, [
      { type: "object-created", object: copiedCard },
      { type: "stack-item-added", item: copiedItem },
    ]).state;
    const negated = executeGrandArchiveEffect(
      {
        kind: "negate",
        subject: { kind: "bound", binding: "copied-item" },
      },
      {
        program,
        state: withCopy,
        controllerId: p1,
        bindings: { "copied-item": [copiedItem.id] },
      },
      (current, events) => {
        const transaction = kernel.transact(current, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    const ceaseEvents = collectGrandArchiveStateBasedEvents(program, negated.state);
    expect(ceaseEvents).toEqual([
      expect.objectContaining({
        type: "object-ceased",
        objectId: copiedCard.id,
        from: "effects-stack",
      }),
    ]);
    const ceased = kernel.transact(negated.state, ceaseEvents).state;
    expect(ceased.objects[copiedCard.id]).toBeUndefined();
  });
});
