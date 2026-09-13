import { fannedSynchron } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "./effect-executor.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";
import { collectGrandArchiveTriggeredAbilityEvents } from "../../rules/abilities/triggers.ts";

function card(
  id: string,
  type: "ACTION" | "CHAMPION" | "ITEM",
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId: id,
    slug: id,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${id}:face:default`,
        catalogId: id,
        name: id,
        cost: { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("suppress-rule-champion", "CHAMPION");
const filler = card("suppress-rule-filler", "ACTION");
const ordinaryItem = card("suppress-rule-item", "ITEM");

function player(id: "p1" | "p2"): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: ordinaryItem.canonicalId, count: 1 },
      { definitionId: fannedSynchron.canonicalId, count: id === "p2" ? 1 : 0 },
      { definitionId: filler.canonicalId, count: 4 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

describe("Grand Archive suppress restrictions", () => {
  it("keeps Fanned Synchron on the field while suppressing other legal subjects", () => {
    const program = createGrandArchiveMatchProgram([
      champion,
      filler,
      ordinaryItem,
      fannedSynchron,
    ]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 5001,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const protectedId = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === fannedSynchron.canonicalId,
    )?.id;
    const ordinaryId = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === ordinaryItem.canonicalId,
    )?.id;
    const sourceId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === ordinaryItem.canonicalId,
    )?.id;
    if (!protectedId || !ordinaryId || !sourceId) {
      throw new Error("Suppress restriction fixture is incomplete");
    }
    const kernel = new GrandArchiveTransactionKernel();
    const positioned = kernel.transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: protectedId, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: ordinaryId, from: "main-deck", to: "field" },
    ]).state;

    const result = executeGrandArchiveEffect(
      {
        kind: "keyword-action",
        action: "suppress",
        subject: { kind: "bound", binding: "subjects" },
        bindResultAs: "suppressed",
      },
      {
        program,
        state: positioned,
        controllerId: p1,
        sourceId,
        bindings: { subjects: [protectedId, ordinaryId] },
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );

    expect(result.state.objects[protectedId]?.zone).toBe("field");
    expect(result.state.objects[ordinaryId]?.zone).toBe("banishment");
    expect(result.state.delayedTriggers).toHaveLength(1);
    expect(result.bindings.suppressed).toEqual([ordinaryId]);
    expect(result.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "keyword-action-performed",
          action: "suppress",
          objectIds: [ordinaryId],
        }),
      ]),
    );

    const suppressedIncarnation = result.state.objects[ordinaryId]!.incarnation;
    expect(result.state.delayedTriggers[0]?.bindingObjectIncarnations.suppressedObject).toEqual({
      [ordinaryId]: suppressedIncarnation,
    });
    const restored = restoreGrandArchiveMatchSnapshot(
      program,
      serializeGrandArchiveMatchSnapshot(result.state),
    );
    expect(restored.delayedTriggers[0]?.bindingObjectIncarnations.suppressedObject).toEqual({
      [ordinaryId]: suppressedIncarnation,
    });

    // Glossary — Suppress rule 2: leaving banishment invalidates this return,
    // even if the same physical card is put into banishment again beforehand.
    const rebound = kernel.transact(restored, [
      {
        type: "object-moved",
        objectId: ordinaryId,
        from: "banishment",
        to: "graveyard",
      },
      {
        type: "object-moved",
        objectId: ordinaryId,
        from: "graveyard",
        to: "banishment",
      },
    ]).state;
    const endPhase = kernel.transact(rebound, [
      { type: "phase-changed", phase: "end", actorId: p1 },
    ]);
    const pendingEvents = collectGrandArchiveTriggeredAbilityEvents(
      program,
      endPhase.state,
      endPhase.result.events,
    );
    const pending = pendingEvents.find((event) => event.type === "pending-trigger-added");
    expect(pending?.trigger.bindings.suppressedObject).toEqual([]);
    if (!pending?.trigger.sourceId || !pending.trigger.ability.effect) {
      throw new Error("Expected the suppress delayed trigger");
    }
    const attemptedReturn = executeGrandArchiveEffect(
      pending.trigger.ability.effect,
      {
        program,
        state: endPhase.state,
        controllerId: pending.trigger.controllerId,
        sourceId: pending.trigger.sourceId,
        bindings: pending.trigger.bindings,
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    expect(attemptedReturn.state.objects[ordinaryId]?.zone).toBe("banishment");
  });
});
