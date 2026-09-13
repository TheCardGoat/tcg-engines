import { streamOfConsciousness } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";

const clericChampion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "memory-restriction-cleric-champion",
  slug: "memory-restriction-cleric-champion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "memory-restriction-cleric-champion:face:default",
      catalogId: "memory-restriction-cleric-champion",
      name: "Memory Restriction Cleric Champion",
      lineageName: "Memory Restriction Tester",
      cost: { kind: "none" },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC"],
      },
      elements: ["WATER"],
      stats: { level: 0, life: 20 },
      rulesText: "",
      abilities: [],
    },
  },
};

const filler: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "memory-restriction-filler",
  slug: "memory-restriction-filler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "memory-restriction-filler:face:default",
      catalogId: "memory-restriction-filler",
      name: "Memory Restriction Filler",
      cost: { kind: "reserve", amount: 0 },
      typeLine: { supertypes: [], types: ["ACTION"], classes: ["CLERIC"], subtypes: [] },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText: "",
      abilities: [],
    },
  },
};

const memoryDrainAction: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "memory-restriction-drain-action",
  slug: "memory-restriction-drain-action",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "memory-restriction-drain-action:face:default",
      catalogId: "memory-restriction-drain-action",
      name: "Memory Restriction Drain Action",
      cost: { kind: "reserve", amount: 0 },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, pay 1 memory. [Memory 4+] Put a threshold counter on your champion.",
      abilities: [
        {
          id: "memoryRestrictionDrainAction-a1",
          kind: "card-resolution",
          text: "As an additional cost to activate this card, pay 1 memory.",
          additionalCost: { kind: "pay-memory", amount: 1 },
          effect: {
            kind: "add-counter",
            subject: { kind: "champion", player: "controller" },
            counter: { named: "always" },
            amount: 1,
          },
        },
        {
          id: "memoryRestrictionDrainAction-a2",
          kind: "card-resolution",
          text: "[Memory 4+] Put a threshold counter on your champion.",
          restrictions: [
            {
              kind: "static",
              name: "memory-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: { zones: ["memory"], player: "controller" },
                  },
                  operator: "gte",
                  right: 4,
                },
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: { kind: "champion", player: "controller" },
            counter: { named: "threshold" },
            amount: 1,
          },
        },
      ],
    },
  },
};

const p1 = grandArchivePlayerId("p1");
const p2 = grandArchivePlayerId("p2");

function player(
  id: "p1" | "p2",
  mainCard?: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      ...(mainCard ? [{ definitionId: mainCard.canonicalId, count: 1 }] : []),
      { definitionId: filler.canonicalId, count: mainCard ? 9 : 10 },
    ],
    materialDeck: [{ definitionId: clericChampion.canonicalId, count: 1 }],
    startingChampionDefinitionId: clericChampion.canonicalId,
  };
}

function ownedIds(
  state: GrandArchiveMatchState,
  definitionId: string,
): readonly GrandArchiveObjectId[] {
  return Object.values(state.objects)
    .filter((object) => object.ownerId === p1 && object.definitionId === definitionId)
    .map((object) => object.id);
}

function passCurrent(runtime: GrandArchiveMatchRuntime): void {
  const holderId = runtime.state.opportunity?.holderId;
  if (!holderId) throw new Error("Expected an Opportunity holder");
  const result = runtime.execute({ move: "pass" }, { playerId: holderId });
  if (!result.ok) throw new Error(result.message);
}

function setup(memoryBeforeActivation: number) {
  const program = createGrandArchiveMatchProgram([clericChampion, filler, streamOfConsciousness]);
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1", streamOfConsciousness), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 4_004,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const streamId = ownedIds(initial, streamOfConsciousness.canonicalId)[0]!;
  const fillerIds = ownedIds(initial, filler.canonicalId);
  const memoryIds = fillerIds.slice(0, memoryBeforeActivation);
  const paymentIds = fillerIds.slice(memoryBeforeActivation, memoryBeforeActivation + 2);
  const positioned = new GrandArchiveTransactionKernel().transact(initial, [
    { type: "object-moved", objectId: streamId, from: "main-deck", to: "hand" },
    ...memoryIds.map((objectId) => ({
      type: "object-moved" as const,
      objectId,
      from: "main-deck" as const,
      to: "memory" as const,
    })),
    ...paymentIds.map((objectId) => ({
      type: "object-moved" as const,
      objectId,
      from: "main-deck" as const,
      to: "hand" as const,
    })),
  ]).state;
  return {
    runtime: new GrandArchiveMatchRuntime(program, positioned),
    streamId,
    paymentIds,
  };
}

function setupMemoryDrain() {
  const program = createGrandArchiveMatchProgram([clericChampion, filler, memoryDrainAction]);
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1", memoryDrainAction), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 4_005,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const actionId = ownedIds(initial, memoryDrainAction.canonicalId)[0]!;
  const memoryIds = ownedIds(initial, filler.canonicalId).slice(0, 4);
  const positioned = new GrandArchiveTransactionKernel().transact(initial, [
    { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
    ...memoryIds.map((objectId) => ({
      type: "object-moved" as const,
      objectId,
      from: "main-deck" as const,
      to: "memory" as const,
    })),
  ]).state;
  return {
    runtime: new GrandArchiveMatchRuntime(program, positioned),
    actionId,
    championId: positioned.zones[p1].field[0]!,
  };
}

describe("Memory N+ restrictions during card activation", () => {
  it("unlocks Stream of Consciousness when its reserve payment reaches Memory 4+", () => {
    const { runtime, streamId, paymentIds } = setup(2);

    const activated = runtime.execute(
      {
        move: "activate-card",
        cardId: streamId,
        reservePayment: paymentIds.map((cardId) => ({ kind: "card", cardId })),
      },
      { playerId: p1 },
    );
    if (!activated.ok) throw new Error(activated.message);
    expect(runtime.state.zones[p1].memory).toHaveLength(4);

    passCurrent(runtime);
    passCurrent(runtime);

    expect(runtime.state.decision).toMatchObject({ kind: "resolve-glimpse", playerId: p1 });
  });

  it("keeps Stream of Consciousness locked when payment leaves only three cards in memory", () => {
    const { runtime, streamId, paymentIds } = setup(1);

    const activated = runtime.execute(
      {
        move: "activate-card",
        cardId: streamId,
        reservePayment: paymentIds.map((cardId) => ({ kind: "card", cardId })),
      },
      { playerId: p1 },
    );
    if (!activated.ok) throw new Error(activated.message);

    passCurrent(runtime);
    passCurrent(runtime);

    expect(runtime.state.decision).toBeNull();
    expect(runtime.state.zones[p1].memory).toHaveLength(4);
  });

  it("locks a previously enabled paragraph when an additional memory payment drops below N", () => {
    const { runtime, actionId, championId } = setupMemoryDrain();

    const activated = runtime.execute(
      { move: "activate-card", cardId: actionId },
      { playerId: p1 },
    );
    if (!activated.ok) throw new Error(activated.message);
    expect(runtime.state.zones[p1].memory).toHaveLength(3);

    passCurrent(runtime);
    passCurrent(runtime);

    expect(runtime.state.objects[championId]?.counters["named:always"]).toBe(1);
    expect(runtime.state.objects[championId]?.counters).not.toHaveProperty("named:threshold");
  });
});
