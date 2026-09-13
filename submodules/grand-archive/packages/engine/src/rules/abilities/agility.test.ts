import { speedPotion } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";
import { GrandArchiveMatchRuntime as MatchRuntime } from "../../procedures/game-flow/runtime.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "CHAMPION",
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
        typeLine: { supertypes: [], types: [type], classes: ["CLERIC"], subtypes: [] },
        elements: ["NORM"],
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("agility-catalog-champion", "CHAMPION");
const filler = card("agility-catalog-filler", "ACTION");
const p1 = grandArchivePlayerId("p1");
const p2 = grandArchivePlayerId("p2");

function player(id: "p1" | "p2"): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [{ definitionId: filler.canonicalId, count: 10 }],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...(id === "p1" ? [{ definitionId: speedPotion.canonicalId, count: 2 }] : []),
    ],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

function setup(firstPlayerId: "p1" | "p2", memoryCount: number) {
  const program = createGrandArchiveMatchProgram([champion, filler, speedPotion]);
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player(firstPlayerId), player(firstPlayerId === "p1" ? "p2" : "p1")],
      firstPlayerId,
      randomSeed: 2_509,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const potionIds = Object.values(initial.objects)
    .filter((object) => object.ownerId === p1 && object.definitionId === speedPotion.canonicalId)
    .map((object) => object.id);
  const memoryIds = initial.zones[p1]["main-deck"].slice(0, memoryCount);
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    ...potionIds.map((objectId) => ({
      type: "object-moved" as const,
      objectId,
      from: "material-deck" as const,
      to: "field" as const,
    })),
    ...memoryIds.map((objectId) => ({
      type: "object-moved" as const,
      objectId,
      from: "main-deck" as const,
      to: "memory" as const,
    })),
  ]).state;
  return {
    runtime: new MatchRuntime(program, prepared),
    potionIds,
    memoryIds,
  };
}

function pass(runtime: GrandArchiveMatchRuntime, playerId: typeof p1 | typeof p2): void {
  const result = runtime.execute({ move: "pass" }, { playerId });
  if (!result.ok) throw new Error(result.message);
}

function passCurrent(runtime: GrandArchiveMatchRuntime): void {
  const holderId = runtime.state.opportunity?.holderId;
  if (!holderId) throw new Error("Expected an Opportunity holder");
  pass(runtime, holderId);
}

function activatePotion(runtime: GrandArchiveMatchRuntime, sourceId: GrandArchiveObjectId): void {
  const activated = runtime.execute(
    { move: "activate-ability", sourceId, abilityId: "0Z1r8GC8a8-a3" },
    { playerId: p1 },
  );
  if (!activated.ok) throw new Error(activated.message);
  pass(runtime, p1);
  pass(runtime, p2);
}

function answerCurrentAgility(
  runtime: GrandArchiveMatchRuntime,
  selectedIds: readonly GrandArchiveObjectId[],
): void {
  const decision = runtime.state.decision;
  if (!decision || decision.kind !== "resolve-effect-choice") {
    throw new Error("Expected an Agility memory-return choice");
  }
  const answered = runtime.execute(
    {
      move: "answer-decision",
      decisionId: decision.id,
      stateVersion: decision.stateVersion,
      answer: selectedIds,
    },
    { playerId: p1 },
  );
  if (!answered.ok) throw new Error(answered.message);
}

describe("Grand Archive Agility", () => {
  it("creates and orders a separate end-phase trigger for every gained instance", () => {
    const { runtime, potionIds, memoryIds } = setup("p1", 5);

    activatePotion(runtime, potionIds[0]!);
    activatePotion(runtime, potionIds[1]!);

    expect(runtime.state.players[p1]?.states.agility).toBe(true);
    expect(runtime.state.delayedTriggers).toHaveLength(2);
    expect(new Set(runtime.state.delayedTriggers.map((trigger) => trigger.id)).size).toBe(2);

    passCurrent(runtime);
    passCurrent(runtime);

    expect(runtime.state.turn.phase).toBe("end");
    const ordering = runtime.state.decision;
    if (!ordering || ordering.kind !== "order-triggered-abilities") {
      throw new Error("Expected the Agility controller to order simultaneous triggers");
    }
    expect(ordering.playerId).toBe(p1);
    expect(ordering.pendingTriggerIds).toHaveLength(2);

    const ordered = runtime.execute(
      {
        move: "answer-decision",
        decisionId: ordering.id,
        stateVersion: ordering.stateVersion,
        answer: [...ordering.pendingTriggerIds].reverse(),
      },
      { playerId: p1 },
    );
    if (!ordered.ok) throw new Error(ordered.message);
    expect(runtime.state.stack).toHaveLength(2);

    passCurrent(runtime);
    passCurrent(runtime);
    answerCurrentAgility(runtime, memoryIds.slice(0, 3));
    pass(runtime, p1);
    pass(runtime, p2);
    answerCurrentAgility(runtime, memoryIds.slice(3));

    expect(runtime.state.zones[p1].memory).toHaveLength(0);
    expect(runtime.state.zones[p1].hand).toEqual(expect.arrayContaining(memoryIds));

    pass(runtime, p1);
    pass(runtime, p2);
    expect(runtime.state.players[p1]?.states.agility).toBe(false);
    expect(runtime.state.delayedTriggers).toHaveLength(0);
    expect(runtime.state.turn.playerId).toBe(p2);
  });

  it("triggers during the active opponent's end phase", () => {
    const { runtime, potionIds, memoryIds } = setup("p2", 3);

    pass(runtime, p2);
    const activated = runtime.execute(
      {
        move: "activate-ability",
        sourceId: potionIds[0]!,
        abilityId: "0Z1r8GC8a8-a3",
      },
      { playerId: p1 },
    );
    if (!activated.ok) throw new Error(activated.message);
    passCurrent(runtime);
    passCurrent(runtime);

    expect(runtime.state.players[p1]?.states.agility).toBe(true);
    expect(runtime.state.delayedTriggers).toHaveLength(1);

    passCurrent(runtime);
    passCurrent(runtime);
    expect(runtime.state.turn).toMatchObject({ playerId: p2, phase: "end" });

    passCurrent(runtime);
    passCurrent(runtime);
    answerCurrentAgility(runtime, memoryIds);
    expect(runtime.state.zones[p1].memory).toHaveLength(0);
    expect(runtime.state.zones[p1].hand).toEqual(expect.arrayContaining(memoryIds));
  });
});
