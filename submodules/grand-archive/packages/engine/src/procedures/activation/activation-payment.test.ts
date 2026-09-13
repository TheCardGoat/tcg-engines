import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { resolveGrandArchiveCollection } from "../effects/evaluation.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";
import { collectGrandArchiveTriggeredAbilityEvents } from "../../rules/abilities/triggers.ts";

function card(
  canonicalId: string,
  type: GrandArchivePlayableCardType,
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
        cost: type === "ITEM" ? { kind: "reserve", amount: 1 } : { kind: "none" },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        speed: type === "ITEM" ? "slow" : undefined,
        stats: type === "CHAMPION" ? { level: 0, life: 15 } : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("payment-champion", "CHAMPION");
const filler = card("payment-filler", "ACTION");
const paymentCard = card("payment-banish", "ACTION");
const source = card("payment-source", "ITEM", [
  {
    id: "payment-source-a1",
    kind: "card-resolution",
    text: "Test activation payment context and provenance.",
    additionalCost: {
      kind: "select-and-move",
      player: "controller",
      from: "hand",
      to: "banishment",
      count: { kind: "exactly", amount: 1 },
      filter: { kind: "name", value: paymentCard.canonicalId, match: "exact" },
    },
    effect: {
      kind: "sequence",
      effects: [
        {
          kind: "conditional",
          condition: {
            kind: "source-activation-context",
            phase: "main",
            from: "hand",
            reservedCardsToMemory: {
              left: { kind: "activation-payment-card-count", from: "hand", to: "memory" },
              operator: "eq",
              right: 1,
            },
          },
          then: { kind: "draw", player: "controller", amount: 1 },
        },
        {
          kind: "conditional",
          condition: {
            kind: "collection-exists",
            collection: {
              zones: ["banishment"],
              host: { kind: "source" },
              relationship: "activation-payment-of",
              filter: { kind: "name", value: paymentCard.canonicalId, match: "exact" },
            },
          },
          then: { kind: "draw", player: "controller", amount: 2 },
        },
      ],
    },
  },
  {
    id: "payment-source-a2",
    kind: "triggered",
    text: "On Leave: Retain activation payment last-known information.",
    trigger: {
      kind: "event",
      event: { name: "object-left-field", subject: { kind: "source" } },
    },
    effect: { kind: "no-op" },
  },
]);

function player(id: string): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: source.canonicalId, count: 1 },
      { definitionId: paymentCard.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 8 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

describe("Grand Archive activation payment provenance", () => {
  it("carries exact payment objects through resolution and into the resulting object", () => {
    const program = createGrandArchiveMatchProgram([champion, filler, paymentCard, source]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 81,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === source.canonicalId,
    )!.id;
    const banishedPaymentId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === paymentCard.canonicalId,
    )!.id;
    const reservePaymentId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === filler.canonicalId,
    )!.id;
    const kernel = new GrandArchiveTransactionKernel();
    const prepared = kernel.transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: banishedPaymentId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: reservePaymentId, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    const activation = runtime.execute(
      {
        move: "activate-card",
        cardId: sourceId,
        reservePayment: [{ kind: "card", cardId: reservePaymentId }],
        costSelections: [[banishedPaymentId]],
      },
      { playerId: p1 },
    );
    if (!activation.ok) throw new Error(activation.message);
    expect(runtime.state.stack[0]?.activationPayment).toEqual([
      { objectId: reservePaymentId, from: "hand", to: "memory" },
      { objectId: banishedPaymentId, from: "hand", to: "banishment" },
    ]);

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    const resolution = runtime.execute({ move: "pass" }, { playerId: p2 });
    if (!resolution.ok) throw new Error(resolution.message);
    expect(runtime.state.objects[sourceId]?.zone).toBe("field");
    expect(runtime.state.zones[p1].hand).toHaveLength(3);
    expect(runtime.state.objects[sourceId]?.activationPayment).toEqual([
      { objectId: reservePaymentId, from: "hand", to: "memory" },
      { objectId: banishedPaymentId, from: "hand", to: "banishment" },
    ]);
    const restored = restoreGrandArchiveMatchSnapshot(
      program,
      serializeGrandArchiveMatchSnapshot(runtime.state),
    );
    expect(restored.objects[sourceId]?.activationPayment).toEqual(
      runtime.state.objects[sourceId]?.activationPayment,
    );
    expect(
      resolveGrandArchiveCollection(
        {
          zones: ["banishment"],
          host: { kind: "source" },
          relationship: "activation-payment-of",
        },
        { program, state: runtime.state, controllerId: p1, sourceId, bindings: {} },
      ).map((object) => object.id),
    ).toEqual([banishedPaymentId]);

    const departure = kernel.transact(runtime.state, [
      { type: "object-moved", objectId: sourceId, from: "field", to: "graveyard" },
    ]);
    const triggerEvents = collectGrandArchiveTriggeredAbilityEvents(
      program,
      departure.state,
      departure.result.events,
    );
    const pending = triggerEvents.find((event) => event.type === "pending-trigger-added");
    expect(pending?.trigger.activationPayment).toEqual(
      runtime.state.objects[sourceId]?.activationPayment,
    );
  });
});
