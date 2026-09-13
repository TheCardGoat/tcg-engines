import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import type { GrandArchiveObjectId } from "../../game/identity.ts";
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
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { power: 1, life: 10 }
              : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("distribution-champion", "CHAMPION");
const ally = card("distribution-ally", "ALLY");
const filler = card("distribution-filler", "ACTION");

function sourceCard(
  effect: GrandArchiveEffect,
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return card("distribution-source", "ACTION", [
    {
      id: "distributionSource-a1",
      kind: "card-resolution",
      text: "Distribute the test payload.",
      effect,
    },
  ]);
}

function setup(effect: GrandArchiveEffect): {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly runtime: GrandArchiveMatchRuntime;
  readonly sourceId: GrandArchiveObjectId;
  readonly p1ChampionId: GrandArchiveObjectId;
  readonly p2ChampionId: GrandArchiveObjectId;
  readonly p1AllyIds: readonly [GrandArchiveObjectId, GrandArchiveObjectId];
  readonly p2AllyId: GrandArchiveObjectId;
} {
  const source = sourceCard(effect);
  const program = createGrandArchiveMatchProgram([champion, ally, filler, source]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: source.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: ally.canonicalId, count: id === "p1" ? 2 : 1 },
      { definitionId: filler.canonicalId, count: 7 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 366,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const owned = (playerId: typeof p1, definitionId: string) =>
    Object.values(initial.objects).filter(
      (object) => object.ownerId === playerId && object.definitionId === definitionId,
    );
  const sourceObject = owned(p1, source.canonicalId)[0]!;
  const p1Champion = owned(p1, champion.canonicalId)[0]!;
  const p2Champion = owned(p2, champion.canonicalId)[0]!;
  const p1Allies = owned(p1, ally.canonicalId);
  const p2Ally = owned(p2, ally.canonicalId)[0]!;
  const moved = [...(sourceObject.zone === "hand" ? [] : [sourceObject]), ...p1Allies, p2Ally];
  const prepared = new GrandArchiveTransactionKernel().transact(
    initial,
    moved.map((object) => ({
      type: "object-moved" as const,
      objectId: object.id,
      from: object.zone,
      to: object.id === sourceObject.id ? ("hand" as const) : ("field" as const),
    })),
  ).state;
  return {
    program,
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    sourceId: sourceObject.id,
    p1ChampionId: p1Champion.id,
    p2ChampionId: p2Champion.id,
    p1AllyIds: [p1Allies[0]!.id, p1Allies[1]!.id],
    p2AllyId: p2Ally.id,
  };
}

function resolveToDistribution(runtime: GrandArchiveMatchRuntime, sourceId: GrandArchiveObjectId) {
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  expect(runtime.execute({ move: "activate-card", cardId: sourceId }, { playerId: p1 }).ok).toBe(
    true,
  );
  expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
  expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
  const decision = runtime.state.decision;
  if (!decision || decision.kind !== "resolve-distribution") {
    throw new Error("Expected a distribution decision");
  }
  return decision;
}

const anyUnits = {
  id: "distributed-units",
  kind: "choice" as const,
  declared: "resolution" as const,
  chooser: "controller" as const,
  count: { kind: "any-number" as const },
  unique: true as const,
  candidates: {
    kind: "object" as const,
    zones: ["field" as const],
    filter: { kind: "type" as const, oneOf: ["ALLY" as const, "CHAMPION" as const] },
  },
};

describe("Grand Archive distribution effects", () => {
  it("requires a positive, unique, exact allocation among legal recipients across snapshots", () => {
    const fixture = setup({
      kind: "distribute",
      amount: 7,
      among: anyUnits,
      payload: { kind: "damage" },
    });
    const decision = resolveToDistribution(fixture.runtime, fixture.sourceId);
    const restored = new GrandArchiveMatchRuntime(
      fixture.program,
      restoreGrandArchiveMatchSnapshot(
        fixture.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(fixture.runtime.state))),
      ),
    );
    const answer = (
      allocations: readonly { readonly objectId: GrandArchiveObjectId; readonly amount: number }[],
    ) =>
      restored.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: { allocations },
        },
        { playerId: decision.playerId },
      );
    expect(answer([{ objectId: fixture.p1ChampionId, amount: 6 }]).ok).toBe(false);
    expect(
      answer([
        { objectId: fixture.p1ChampionId, amount: 2 },
        { objectId: fixture.p1ChampionId, amount: 5 },
      ]).ok,
    ).toBe(false);
    expect(answer([{ objectId: fixture.sourceId, amount: 7 }]).ok).toBe(false);
    const resolved = answer([
      { objectId: fixture.p1ChampionId, amount: 2 },
      { objectId: fixture.p2AllyId, amount: 5 },
    ]);
    if (!resolved.ok) throw new Error(resolved.message);
    expect(restored.state.objects[fixture.p1ChampionId]?.damage).toBe(2);
    expect(restored.state.objects[fixture.p2AllyId]?.damage).toBe(5);
  });

  it("distributes counters while honoring controlled-recipient restrictions", () => {
    const fixture = setup({
      kind: "distribute",
      amount: 3,
      among: {
        ...anyUnits,
        id: "distributed-allies",
        candidates: {
          kind: "object",
          zones: ["field"],
          relationship: "controlled-by",
          player: "controller",
          filter: { kind: "type", oneOf: ["ALLY"] },
        },
      },
      payload: { kind: "counter", counter: { named: "sheen" } },
    });
    const decision = resolveToDistribution(fixture.runtime, fixture.sourceId);
    const result = fixture.runtime.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: {
          allocations: [
            { objectId: fixture.p1AllyIds[0], amount: 1 },
            { objectId: fixture.p1AllyIds[1], amount: 2 },
          ],
        },
      },
      { playerId: decision.playerId },
    );
    if (!result.ok) throw new Error(result.message);
    expect(fixture.runtime.state.objects[fixture.p1AllyIds[0]]?.counters["named:sheen"]).toBe(1);
    expect(fixture.runtime.state.objects[fixture.p1AllyIds[1]]?.counters["named:sheen"]).toBe(2);
    expect(fixture.runtime.state.objects[fixture.p2AllyId]?.counters["named:sheen"] ?? 0).toBe(0);
  });
});
