import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { isGrandArchiveTargetCandidate } from "../../procedures/activation/activation.ts";
import { payGrandArchiveAbilityCost } from "../../procedures/activation/costs.ts";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { resolveGrandArchiveCollection } from "../../procedures/effects/evaluation.ts";
import { grandArchiveObjectId, grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";
import { projectGrandArchiveViewerState } from "../../projection/view.ts";

function card(
  canonicalId: string,
  type: GrandArchivePlayableCardType,
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  stats: { readonly level?: number; readonly life?: number } = {},
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

const champion = card("provenance-champion", "CHAMPION", [], { level: 0, life: 15 });
const sourceItem = card("provenance-source", "ITEM", [
  {
    id: "provenance-source-a1",
    kind: "activated",
    activation: "ability",
    text: "Banish a card from your hand.",
    cost: { kind: "pay-reserve", amount: 0 },
    effect: {
      kind: "banish",
      player: "controller",
      selection: {
        id: "banished-card",
        kind: "choice",
        declared: "resolution",
        chooser: "controller",
        count: { kind: "exactly", amount: 1 },
        candidates: {
          kind: "card",
          zones: ["hand"],
          relationship: "zone-of",
          player: "controller",
        },
      },
    },
  },
]);
const payload = card("provenance-payload", "ACTION");

function player(id: string): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: sourceItem.canonicalId, count: 1 },
      { definitionId: payload.canonicalId, count: 3 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

describe("Grand Archive banishment provenance", () => {
  it("attaches provenance to a selection-backed banish during stack resolution", () => {
    const program = createGrandArchiveMatchProgram([champion, sourceItem, payload]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 50,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === sourceItem.canonicalId,
    )!.id;
    const payloadId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === payload.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: payloadId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    expect(
      runtime.execute(
        { move: "activate-ability", sourceId, abilityId: "provenance-source-a1" },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.decision).toBeNull();
    expect(runtime.state.objects[payloadId]).toMatchObject({
      zone: "banishment",
      banishedBy: { sourceId, sourceIncarnation: runtime.state.objects[sourceId]!.incarnation },
    });
  });

  it("tracks the exact source, powers relationships, survives snapshots, and clears on exit", () => {
    const program = createGrandArchiveMatchProgram([champion, sourceItem, payload]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 51,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === sourceItem.canonicalId,
    )!.id;
    const payloadIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p1 && object.definitionId === payload.canonicalId)
      .map((object) => object.id);
    const [banishedId, unrelatedId, additionalCostId] = payloadIds;
    if (!banishedId || !unrelatedId || !additionalCostId) {
      throw new Error("Banishment provenance test setup is incomplete");
    }
    const kernel = new GrandArchiveTransactionKernel();
    const arranged = kernel.transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: banishedId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: unrelatedId, from: "main-deck", to: "banishment" },
      { type: "object-moved", objectId: additionalCostId, from: "main-deck", to: "graveyard" },
    ]).state;

    const execution = executeGrandArchiveEffect(
      { kind: "banish-object", subject: { kind: "bound", binding: "chosen" } },
      {
        program,
        state: arranged,
        controllerId: p1,
        sourceId,
        bindings: { chosen: [banishedId] },
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    expect(execution.state.objects[banishedId]).toMatchObject({
      zone: "banishment",
      banishedBy: { sourceId, sourceIncarnation: arranged.objects[sourceId]!.incarnation },
    });
    expect(execution.state.objects[unrelatedId]?.banishedBy?.sourceId).toBeUndefined();

    const evaluation = {
      program,
      state: execution.state,
      controllerId: p1,
      sourceId,
      bindings: {},
    };
    expect(
      resolveGrandArchiveCollection(
        {
          zones: ["banishment"],
          host: { kind: "source" },
          relationship: "banished-by",
        },
        evaluation,
      ).map((object) => object.id),
    ).toEqual([banishedId]);

    const sourceObject = execution.state.objects[sourceId]!;
    const copiedSource = {
      ...sourceObject,
      id: grandArchiveObjectId(`object-${execution.state.nextObjectOrdinal}`),
      zone: "effects-stack" as const,
      copy: { sourceObjectId: sourceId, expires: "when-unassociated" as const },
    };
    const withCopiedActivation = kernel.transact(execution.state, [
      { type: "object-created", object: copiedSource },
    ]).state;
    expect(
      resolveGrandArchiveCollection(
        {
          zones: ["banishment"],
          host: { kind: "source" },
          relationship: "banished-by",
        },
        {
          ...evaluation,
          state: withCopiedActivation,
          sourceId: copiedSource.id,
        },
      ),
    ).toEqual([]);
    expect(
      isGrandArchiveTargetCandidate(
        banishedId,
        {
          id: "banished-card",
          kind: "target",
          declared: "announcement",
          chooser: "controller",
          count: { kind: "exactly", amount: 1 },
          candidates: {
            kind: "card",
            zones: ["banishment"],
            host: { kind: "source" },
            relationship: "banished-by",
          },
        },
        evaluation,
      ),
    ).toBe(true);
    expect(
      isGrandArchiveTargetCandidate(
        unrelatedId,
        {
          id: "banished-card",
          kind: "target",
          declared: "announcement",
          chooser: "controller",
          count: { kind: "exactly", amount: 1 },
          candidates: {
            kind: "card",
            zones: ["banishment"],
            host: { kind: "source" },
            relationship: "banished-by",
          },
        },
        evaluation,
      ),
    ).toBe(false);

    const revealPayment = payGrandArchiveAbilityCost(
      {
        kind: "select-and-reveal",
        player: "controller",
        from: "banishment",
        count: { kind: "exactly", amount: 1 },
        host: { kind: "source" },
        relationship: "banished-by",
      },
      {
        move: "activate-ability",
        sourceId,
        abilityId: "reveal-banished-card",
        costSelections: [[banishedId]],
      },
      evaluation,
    );
    expect(revealPayment.events).toEqual([
      expect.objectContaining({ type: "card-revealed", objectId: banishedId }),
    ]);
    expect(() =>
      payGrandArchiveAbilityCost(
        {
          kind: "select-and-reveal",
          player: "controller",
          from: "banishment",
          count: { kind: "exactly", amount: 1 },
          host: { kind: "source" },
          relationship: "banished-by",
        },
        {
          move: "activate-ability",
          sourceId,
          abilityId: "reveal-banished-card",
          costSelections: [[unrelatedId]],
        },
        evaluation,
      ),
    ).toThrow("ineligible object");

    const projected = projectGrandArchiveViewerState(program, execution.state, p1);
    const banishment = projected.players.find((viewer) => viewer.id === p1)?.zones.banishment;
    if (banishment?.visibility !== "visible") {
      throw new Error("A player's banishment must be publicly visible");
    }
    expect(banishment.objects.find((object) => object.id === banishedId)?.banishedBySourceId).toBe(
      sourceId,
    );
    const restored = restoreGrandArchiveMatchSnapshot(
      program,
      serializeGrandArchiveMatchSnapshot(execution.state),
    );
    expect(restored.objects[banishedId]?.banishedBy?.sourceId).toBe(sourceId);

    const leftBanishment = kernel.transact(restored, [
      { type: "object-moved", objectId: banishedId, from: "banishment", to: "graveyard" },
    ]).state;
    expect(leftBanishment.objects[banishedId]?.banishedBy?.sourceId).toBeUndefined();

    const additionalCost = payGrandArchiveAbilityCost(
      {
        kind: "select-and-move",
        player: "controller",
        from: "graveyard",
        to: "banishment",
        count: { kind: "exactly", amount: 1 },
        relationship: "owned-by",
      },
      {
        move: "activate-card",
        cardId: sourceId,
        costSelections: [[additionalCostId]],
      },
      {
        program,
        state: leftBanishment,
        controllerId: p1,
        sourceId,
        bindings: {},
      },
    );
    expect(additionalCost.events).toEqual([
      expect.objectContaining({
        type: "object-moved",
        objectId: additionalCostId,
        to: "banishment",
        banishedBy: { sourceId, sourceIncarnation: arranged.objects[sourceId]!.incarnation },
      }),
    ]);
    const additionalCostPaid = kernel.transact(leftBanishment, additionalCost.events).state;
    expect(additionalCostPaid.objects[additionalCostId]?.banishedBy?.sourceId).toBe(sourceId);
  });
});
