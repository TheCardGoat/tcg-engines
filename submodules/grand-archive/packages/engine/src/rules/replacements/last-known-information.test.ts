import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { prepareGrandArchiveRuleBoundEvent } from "../../kernel/event-admission.ts";
import {
  evaluateGrandArchiveAmount,
  evaluateGrandArchiveCondition,
  grandArchiveLastKnownObject,
} from "../../procedures/effects/evaluation.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";

function card(
  canonicalId: string,
  type: "ALLY" | "ACTION" | "CHAMPION",
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
        cost: { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        stats,
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("lki-champion", "CHAMPION", { level: 0, life: 20 });
const ally = card("lki-ally", "ALLY", { power: 2, life: 4 });
const filler = card("lki-filler", "ACTION");

function player(id: string): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: ally.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 8 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

describe("Grand Archive last-known information", () => {
  it("uses exactly the complete checkpoint before the latest zone change and persists it", () => {
    const program = createGrandArchiveMatchProgram([champion, ally, filler]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 311,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const allyId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === ally.canonicalId,
    )!.id;
    const kernel = new GrandArchiveTransactionKernel({
      prepareEvent: (state, event) => prepareGrandArchiveRuleBoundEvent(program, state, event),
    });
    const onField = kernel.transact(initial, [
      {
        type: "object-moved",
        objectId: allyId,
        from: initial.objects[allyId]!.zone,
        to: "field",
      },
      { type: "counter-changed", objectId: allyId, counter: "buff", delta: 3 },
      { type: "object-state-changed", objectId: allyId, state: "rested", value: true },
    ]).state;
    const departed = kernel.transact(onField, [
      { type: "object-moved", objectId: allyId, from: "field", to: "graveyard" },
    ]).state;
    const restored = restoreGrandArchiveMatchSnapshot(
      program,
      serializeGrandArchiveMatchSnapshot(departed),
    );
    const context = {
      program,
      state: restored,
      controllerId: p1,
      bindings: { eventSource: [allyId] },
    };

    expect(restored.objects[allyId]?.counters.buff).toBeUndefined();
    expect(grandArchiveLastKnownObject(restored, allyId)?.counters.buff).toBe(3);
    expect(
      evaluateGrandArchiveAmount(
        {
          kind: "property",
          subject: { kind: "event-source" },
          property: "power",
          basis: "last-known",
        },
        context,
      ),
    ).toBe(5);
    expect(
      evaluateGrandArchiveAmount(
        {
          kind: "counter-count",
          subject: { kind: "event-source" },
          counter: "buff",
          basis: "last-known",
        },
        context,
      ),
    ).toBe(3);
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "object-state",
          subject: { kind: "event-source" },
          state: "rested",
          basis: "last-known",
        },
        context,
      ),
    ).toBe(true);
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "numeric-property-parity",
          subject: { kind: "event-source" },
          property: "power",
          basis: "last-known",
          value: "odd",
        },
        context,
      ),
    ).toBe(true);
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "counter-count-parity",
          subject: { kind: "event-source" },
          counter: "buff",
          value: "even",
        },
        context,
      ),
    ).toBe(true);
  });
});
