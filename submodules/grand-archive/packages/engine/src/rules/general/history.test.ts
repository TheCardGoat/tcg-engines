import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import {
  evaluateGrandArchiveCondition,
  resolveGrandArchiveCollection,
} from "../../procedures/effects/evaluation.ts";
import { grandArchivePlayerId, grandArchiveStackItemId } from "../../game/identity.ts";
import type { GrandArchiveObjectId, GrandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState, GrandArchiveStackItem } from "../../game/model.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";

function card(
  canonicalId: string,
  type: GrandArchivePlayableCardType,
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  stats: { readonly level?: number; readonly power?: number; readonly life?: number } = {},
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
        cost: { kind: "none" },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        stats,
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("history-champion", "CHAMPION", [], { level: 0, life: 15 });
const historySource = card("history-source", "ITEM", [
  {
    id: "history-source-a1",
    kind: "activated",
    activation: "ability",
    text: "(6), REST: This costs (2) less for each card you've materialized this turn.",
    cost: {
      kind: "all",
      costs: [
        { kind: "pay-reserve", amount: 6 },
        { kind: "rest", subject: { kind: "source" } },
      ],
    },
    costModifiers: [
      {
        operation: "subtract",
        amount: {
          kind: "calculate",
          operator: "multiply",
          operands: [
            {
              kind: "count",
              collection: {
                history: { event: "card-materialized", window: "this-turn" },
              },
            },
            2,
          ],
        },
      },
    ],
    effect: { kind: "no-op" },
  },
]);
const attack = card("history-attack", "ATTACK", [], { power: 1 });
const material = card("history-material", "ITEM");
const filler = card("history-filler", "ACTION");

function player(id: string): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: historySource.canonicalId, count: 1 },
      { definitionId: attack.canonicalId, count: 2 },
      { definitionId: filler.canonicalId, count: 6 },
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      { definitionId: material.canonicalId, count: 2 },
    ],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

function materializationItem(
  id: string,
  cardId: GrandArchiveObjectId,
  controllerId: GrandArchivePlayerId,
  createdAtVersion: number,
): GrandArchiveStackItem {
  return {
    id: grandArchiveStackItemId(id),
    kind: "materialization",
    materializationContext: "effect-instruction",
    controllerId,
    sourceId: cardId,
    cardId,
    originZone: "material-deck",
    paidCostKind: "none",
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

function cardActivationItem(
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
    originZone: "memory",
    paidCostKind: "none",
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

function abilityActivationItem(
  id: string,
  sourceId: GrandArchiveObjectId,
  controllerId: GrandArchivePlayerId,
  ability: Extract<GrandArchiveAbilityDefinition, { readonly kind: "activated" }>,
  createdAtVersion: number,
): GrandArchiveStackItem {
  return {
    id: grandArchiveStackItemId(id),
    kind: "activated-ability",
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

function recordMaterialization(
  kernel: GrandArchiveTransactionKernel,
  state: GrandArchiveMatchState,
  cardId: GrandArchiveObjectId,
  playerId: GrandArchivePlayerId,
  ordinal: number,
): GrandArchiveMatchState {
  const item = materializationItem(
    `history-materialization-${ordinal}`,
    cardId,
    playerId,
    state.stateVersion,
  );
  return kernel.transact(state, [
    { type: "stack-item-added", item, actorId: playerId },
    { type: "stack-item-removed", itemId: item.id, outcome: "resolved" },
  ]).state;
}

describe("Grand Archive historical collections", () => {
  it("applies current-turn materialization history to activated-ability reserve costs", () => {
    const program = createGrandArchiveMatchProgram([
      champion,
      historySource,
      attack,
      material,
      filler,
    ]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 60,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === historySource.canonicalId,
    )!.id;
    const materialIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p1 && object.definitionId === material.canonicalId)
      .map((object) => object.id);
    const paymentIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p1 && object.definitionId === filler.canonicalId)
      .slice(0, 2)
      .map((object) => object.id);
    const kernel = new GrandArchiveTransactionKernel();
    let prepared = kernel.transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "main-deck", to: "field" },
      ...paymentIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
    ]).state;
    prepared = recordMaterialization(kernel, prepared, materialIds[0]!, p1, 1);
    prepared = recordMaterialization(kernel, prepared, materialIds[1]!, p1, 2);
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId,
          abilityId: "history-source-a1",
          reservePayment: [{ kind: "card", cardId: paymentIds[0]! }],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(false);
    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId,
          abilityId: "history-source-a1",
          reservePayment: paymentIds.map((cardId) => ({ kind: "card" as const, cardId })),
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(paymentIds.every((cardId) => runtime.state.objects[cardId]?.zone === "memory")).toBe(
      true,
    );
    expect(runtime.state.objects[sourceId]?.states.has("rested")).toBe(true);
  });

  it("honors turn, resolution, actor, origin-zone, filter, and source-exclusion boundaries", () => {
    const program = createGrandArchiveMatchProgram([
      champion,
      historySource,
      attack,
      material,
      filler,
    ]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 61,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const p1AttackIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p1 && object.definitionId === attack.canonicalId)
      .map((object) => object.id);
    const p2AttackId = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === attack.canonicalId,
    )!.id;
    const kernel = new GrandArchiveTransactionKernel();
    let state = kernel.transact(initial, [
      { type: "object-moved", objectId: p1AttackIds[0]!, from: "main-deck", to: "memory" },
      { type: "object-moved", objectId: p1AttackIds[1]!, from: "main-deck", to: "memory" },
      { type: "object-moved", objectId: p2AttackId, from: "main-deck", to: "memory" },
      { type: "card-revealed", objectId: p1AttackIds[0]!, playerId: p1 },
    ]).state;
    const resolutionStart = state.eventHistory.length;
    state = kernel.transact(state, [
      { type: "card-revealed", objectId: p1AttackIds[1]!, playerId: p1 },
      { type: "card-revealed", objectId: p2AttackId, playerId: p2 },
      {
        type: "object-moved",
        objectId: p1AttackIds[1]!,
        from: "memory",
        to: "graveyard",
      },
    ]).state;
    const resolutionCards = resolveGrandArchiveCollection(
      {
        history: {
          event: "card-revealed",
          window: "this-resolution",
          from: "memory",
        },
        filter: { kind: "type", oneOf: ["ATTACK"] },
      },
      {
        program,
        state,
        controllerId: p1,
        sourceId: p1AttackIds[0]!,
        resolutionStartedEventHistoryIndex: resolutionStart,
        bindings: {},
      },
    );
    expect(resolutionCards.map((object) => object.id)).toEqual([p1AttackIds[1]]);

    const beforeTurnBoundary = kernel.transact(state, [
      {
        type: "keyword-action-performed",
        action: "suppress",
        playerId: p1,
        objectIds: [p1AttackIds[0]!],
      },
      { type: "turn-started", playerId: p2, turnNumber: 2 },
      {
        type: "keyword-action-performed",
        action: "suppress",
        playerId: p1,
        objectIds: [p1AttackIds[0]!],
      },
      {
        type: "keyword-action-performed",
        action: "glimpse",
        playerId: p1,
        objectIds: [p1AttackIds[1]!],
      },
      {
        type: "keyword-action-performed",
        action: "suppress",
        playerId: p2,
        objectIds: [p2AttackId],
      },
    ]).state;
    expect(
      resolveGrandArchiveCollection(
        {
          history: {
            event: "keyword-action-performed",
            window: "this-turn",
            keywordAction: "suppress",
          },
        },
        { program, state: beforeTurnBoundary, controllerId: p1, bindings: {} },
      ).map((object) => object.id),
    ).toEqual([p1AttackIds[0]]);
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "history",
          event: "keyword-action-performed",
          window: "this-turn",
          actor: "controller",
          keywordAction: "suppress",
          subject: { kind: "bound", binding: "suppressed-object" },
          minimum: 1,
        },
        {
          program,
          state: beforeTurnBoundary,
          controllerId: p1,
          bindings: { "suppressed-object": [p1AttackIds[0]!] },
        },
      ),
    ).toBe(true);

    const activation = cardActivationItem(
      "history-attack-activation",
      p1AttackIds[0]!,
      p1,
      beforeTurnBoundary.stateVersion,
    );
    const secondActivation = cardActivationItem(
      "history-attack-activation-2",
      p1AttackIds[1]!,
      p1,
      beforeTurnBoundary.stateVersion,
    );
    const withActivations = kernel.transact(beforeTurnBoundary, [
      {
        type: "stack-item-added",
        item: activation,
        actorId: p1,
      },
      { type: "stack-item-removed", itemId: activation.id, outcome: "resolved" },
      {
        type: "stack-item-added",
        item: secondActivation,
        actorId: p1,
      },
      { type: "stack-item-removed", itemId: secondActivation.id, outcome: "resolved" },
    ]).state;
    expect(
      resolveGrandArchiveCollection(
        {
          history: { event: "card-activated", window: "this-turn" },
          filter: { kind: "type", oneOf: ["ATTACK"] },
          excludingSource: true,
        },
        {
          program,
          state: withActivations,
          controllerId: p1,
          sourceId: p1AttackIds[0]!,
          bindings: {},
        },
      ).map((object) => object.id),
    ).toEqual([p1AttackIds[1]]);

    const sourceId = Object.values(withActivations.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === historySource.canonicalId,
    )!.id;
    const sourceFace =
      historySource.layout.kind === "single-faced"
        ? historySource.layout.face
        : historySource.layout.defaultFace;
    const sourceAbility = sourceFace.abilities[0];
    if (!sourceAbility || sourceAbility.kind !== "activated") {
      throw new Error("History source must expose its activated ability");
    }
    const activationContext = {
      program,
      state: withActivations,
      controllerId: p1,
      sourceId,
      abilityId: sourceAbility.id,
      bindings: {},
    };
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "ability-activation-count",
          ability: "this",
          scope: "source-instance",
          window: "this-turn",
          operator: "eq",
          value: 0,
        },
        activationContext,
      ),
    ).toBe(true);
    const abilityItem = abilityActivationItem(
      "history-source-ability-activation",
      sourceId,
      p1,
      sourceAbility,
      withActivations.stateVersion,
    );
    const afterAbilityActivation = kernel.transact(withActivations, [
      { type: "stack-item-added", item: abilityItem, actorId: p1 },
      { type: "stack-item-removed", itemId: abilityItem.id, outcome: "resolved" },
    ]).state;
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "ability-activation-count",
          ability: "this",
          scope: "source-instance",
          window: "this-turn",
          operator: "eq",
          value: 1,
        },
        { ...activationContext, state: afterAbilityActivation },
      ),
    ).toBe(true);

    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "ability-resolution-count",
          ability: "this",
          scope: "source-instance",
          window: "game",
          operator: "eq",
          value: 1,
        },
        { ...activationContext, state: afterAbilityActivation },
      ),
    ).toBe(true);

    const fizzledItem = abilityActivationItem(
      "history-source-ability-fizzled",
      sourceId,
      p1,
      sourceAbility,
      afterAbilityActivation.stateVersion,
    );
    const afterFizzle = kernel.transact(afterAbilityActivation, [
      { type: "stack-item-added", item: fizzledItem, actorId: p1 },
      { type: "stack-item-removed", itemId: fizzledItem.id, outcome: "fizzled" },
    ]).state;
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "ability-resolution-count",
          ability: "this",
          scope: "source-instance",
          window: "game",
          operator: "eq",
          value: 1,
        },
        { ...activationContext, state: afterFizzle },
      ),
    ).toBe(true);

    const resolvingItem = abilityActivationItem(
      "history-source-ability-resolving",
      sourceId,
      p1,
      sourceAbility,
      afterFizzle.stateVersion,
    );
    const duringResolution = kernel.transact(afterFizzle, [
      { type: "stack-item-added", item: resolvingItem, actorId: p1 },
    ]).state;
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "ability-resolution-count",
          ability: "this",
          scope: "source-instance",
          window: "game",
          operator: "eq",
          value: 2,
          includesCurrent: true,
        },
        {
          ...activationContext,
          state: duringResolution,
          resolvingStackItemId: resolvingItem.id,
        },
      ),
    ).toBe(true);

    const abandoned = kernel.transact(duringResolution, [
      { type: "stack-item-removed", itemId: resolvingItem.id, outcome: "abandoned" },
    ]).state;
    expect(
      evaluateGrandArchiveCondition(
        { kind: "history", event: "effect-resolved", window: "game", minimum: 4 },
        { ...activationContext, state: abandoned },
      ),
    ).toBe(false);
    const sourceZone = abandoned.objects[sourceId]!.zone;
    const newIncarnation = kernel.transact(abandoned, [
      { type: "object-moved", objectId: sourceId, from: sourceZone, to: "field" },
    ]).state;
    for (const kind of ["ability-activation-count", "ability-resolution-count"] as const) {
      expect(
        evaluateGrandArchiveCondition(
          {
            kind,
            ability: "this",
            scope: "source-instance",
            window: "game",
            operator: "eq",
            value: 0,
          },
          { ...activationContext, state: newIncarnation },
        ),
      ).toBe(true);
    }
  });
});
