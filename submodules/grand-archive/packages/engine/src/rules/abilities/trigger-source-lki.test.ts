import { lustrousSlime } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { prepareGrandArchiveRuleBoundEvent } from "../../kernel/event-admission.ts";
import { resolveGrandArchiveSubjectObjects } from "../../procedures/effects/evaluation.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
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
import {
  collectGrandArchivePendingTriggerProgressEvents,
  collectGrandArchiveTriggeredAbilityEvents,
} from "./triggers.ts";

const champion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "trigger-source-lki-champion",
  slug: "trigger-source-lki-champion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "trigger-source-lki-champion:face:default",
      catalogId: "trigger-source-lki-champion",
      name: "Trigger Source LKI Champion",
      cost: { kind: "memory", amount: 0 },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["TAMER"],
        subtypes: ["HUMAN"],
      },
      elements: ["NORM"],
      stats: { level: 0, life: 20 },
      rulesText: "",
      abilities: [],
    },
  },
};

const filler: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "trigger-source-lki-filler",
  slug: "trigger-source-lki-filler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "trigger-source-lki-filler:face:default",
      catalogId: "trigger-source-lki-filler",
      name: "Trigger Source LKI Filler",
      cost: { kind: "reserve", amount: 0 },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: [],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText: "",
      abilities: [],
    },
  },
};

const sourceTrackingAlly: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "trigger-source-lki-tracking-ally",
  slug: "trigger-source-lki-tracking-ally",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "trigger-source-lki-tracking-ally:face:default",
      catalogId: "trigger-source-lki-tracking-ally",
      name: "Trigger Source LKI Tracking Ally",
      cost: { kind: "reserve", amount: 0 },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: [],
      },
      elements: ["NORM"],
      stats: { power: 1, life: 1 },
      rulesText: "On Death, if this object was rested, banish it.",
      abilities: [
        {
          id: "trackingAlly-a1",
          kind: "triggered",
          text: "On Death, if this object was rested, banish it.",
          trigger: {
            kind: "event",
            event: { name: "object-died", subject: { kind: "source" } },
          },
          restrictions: [
            {
              kind: "static",
              condition: {
                kind: "object-state",
                subject: { kind: "source" },
                state: "rested",
              },
            },
          ],
          effect: { kind: "banish-object", subject: { kind: "source" } },
        },
      ],
    },
  },
};

function player(id: "p1" | "p2"): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: lustrousSlime.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: filler.canonicalId, count: 12 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

describe("Grand Archive triggered source last-known information", () => {
  it("resolves Lustrous Slime's On Death X from its exact departing counters after snapshot restore", () => {
    const program = createGrandArchiveMatchProgram([champion, filler, lustrousSlime]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 823,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const slime = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === lustrousSlime.canonicalId,
    );
    const p1Champion = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === champion.canonicalId,
    );
    if (!slime || !p1Champion) throw new Error("Missing trigger source LKI fixture object");

    const kernel = new GrandArchiveTransactionKernel({
      prepareEvent: (state, event) => prepareGrandArchiveRuleBoundEvent(program, state, event),
    });
    const prepared = kernel.transact(initial, [
      { type: "object-moved", objectId: slime.id, from: slime.zone, to: "field" },
      { type: "counter-changed", objectId: slime.id, counter: "buff", delta: 3 },
      { type: "damage-marked", objectId: p1Champion.id, amount: 5 },
    ]).state;
    const departed = kernel.transact(prepared, [
      {
        type: "object-moved",
        objectId: slime.id,
        from: "field",
        to: "graveyard",
        cause: { kind: "rule", rule: "lethal-damage-state-check" },
      },
    ]);
    const pending = kernel.transact(
      departed.state,
      collectGrandArchiveTriggeredAbilityEvents(program, departed.state, departed.result.events),
    ).state;
    const trigger = pending.pendingTriggers.find(
      (candidate) => candidate.ability.id === "ejvddohjdu-a3",
    );
    if (!trigger || !trigger.sourceId) throw new Error("Missing Lustrous Slime On Death trigger");
    expect(trigger.sourceIncarnation).toBe(pending.objects[slime.id]?.incarnation);
    expect(trigger.sourceLkiEventId).toBe(departed.result.events[0]?.eventId);

    const restored = restoreGrandArchiveMatchSnapshot(
      program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(pending))),
    );
    const ready = kernel.transact(
      restored,
      collectGrandArchivePendingTriggerProgressEvents(program, restored),
    ).state;
    const runtime = new GrandArchiveMatchRuntime(program, ready);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);

    expect(runtime.state.objects[p1Champion.id]?.damage).toBe(2);
  });

  it.each([
    { movedAgain: false, expectedZone: "banishment" as const },
    { movedAgain: true, expectedZone: "hand" as const },
  ])(
    "uses pre-departure state to trigger but only references the immediate post-departure card when movedAgain=$movedAgain",
    ({ movedAgain, expectedZone }) => {
      const program = createGrandArchiveMatchProgram([champion, filler, sourceTrackingAlly]);
      const setupPlayer = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
        id,
        name: id,
        mainDeck: [
          { definitionId: sourceTrackingAlly.canonicalId, count: id === "p1" ? 1 : 0 },
          { definitionId: filler.canonicalId, count: 12 },
        ],
        materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
        startingChampionDefinitionId: champion.canonicalId,
      });
      const initial = createGrandArchiveMatchInitialState(
        program,
        {
          mode: "standard",
          players: [setupPlayer("p1"), setupPlayer("p2")],
          firstPlayerId: "p1",
          randomSeed: movedAgain ? 827 : 829,
        },
        { validateDeckConstruction: false, skipPregameForTests: true },
      );
      const p1 = grandArchivePlayerId("p1");
      const p2 = grandArchivePlayerId("p2");
      const source = Object.values(initial.objects).find(
        (object) => object.ownerId === p1 && object.definitionId === sourceTrackingAlly.canonicalId,
      );
      if (!source) throw new Error("Missing trigger source tracking fixture object");
      const kernel = new GrandArchiveTransactionKernel({
        prepareEvent: (state, event) => prepareGrandArchiveRuleBoundEvent(program, state, event),
      });
      const prepared = kernel.transact(initial, [
        { type: "object-moved", objectId: source.id, from: source.zone, to: "field" },
        { type: "object-state-changed", objectId: source.id, state: "rested", value: true },
      ]).state;
      const departed = kernel.transact(prepared, [
        { type: "object-moved", objectId: source.id, from: "field", to: "graveyard" },
      ]);
      const pending = kernel.transact(
        departed.state,
        collectGrandArchiveTriggeredAbilityEvents(program, departed.state, departed.result.events),
      ).state;
      expect(pending.pendingTriggers).toHaveLength(1);
      const ready = kernel.transact(
        pending,
        collectGrandArchivePendingTriggerProgressEvents(program, pending),
      ).state;
      const beforeResolution = movedAgain
        ? kernel.transact(ready, [
            { type: "object-moved", objectId: source.id, from: "graveyard", to: "hand" },
          ]).state
        : ready;
      const triggeredItem = beforeResolution.stack.at(-1);
      expect(triggeredItem?.sourceIncarnation).toBe(
        movedAgain
          ? beforeResolution.objects[source.id]!.incarnation - 1
          : beforeResolution.objects[source.id]!.incarnation,
      );
      expect(
        triggeredItem?.sourceId
          ? resolveGrandArchiveSubjectObjects(
              { kind: "source" },
              {
                program,
                state: beforeResolution,
                controllerId: p1,
                sourceId: triggeredItem.sourceId,
                abilityBearerId: triggeredItem.sourceId,
                sourceIdentityId: triggeredItem.sourceId,
                sourceIncarnation: triggeredItem.sourceIncarnation,
                sourceLkiEventId: triggeredItem.sourceLkiEventId,
                bindings: triggeredItem.bindings,
              },
            ).length
          : undefined,
      ).toBe(movedAgain ? 0 : 1);
      const runtime = new GrandArchiveMatchRuntime(program, beforeResolution);
      expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
      expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);

      expect(runtime.state.objects[source.id]?.zone).toBe(expectedZone);
    },
  );
});
