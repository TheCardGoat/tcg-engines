import { tomeOfAbyssalHeaven } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "./effect-executor.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";

function card(
  id: string,
  type: "ACTION" | "CHAMPION",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
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
        cost: { kind: "none" },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("effect-attempt-champion", "CHAMPION");
const filler = card("effect-attempt-filler", "ACTION");
const replacedAttemptAction = card("effect-attempt-replaced-action", "ACTION", [
  {
    id: "effectAttemptReplacedAction-a1",
    kind: "card-resolution",
    text: "Banish this card. If you do, draw a card.",
    effect: {
      kind: "sequence",
      effects: [
        {
          kind: "attempt",
          bindSucceededAs: "banishment-performed",
          effect: { kind: "banish-object", subject: { kind: "source" } },
        },
        {
          kind: "conditional",
          condition: { kind: "effect-succeeded", binding: "banishment-performed" },
          then: { kind: "draw", player: "controller", amount: 1 },
        },
      ],
    },
  },
]);

function tomeEffect(): GrandArchiveEffect {
  const layout = tomeOfAbyssalHeaven.layout;
  if (layout.kind !== "single-faced") throw new Error("Tome must be single-faced");
  const ability = layout.face.abilities[2];
  if (ability?.kind !== "triggered" || !ability.effect) {
    throw new Error("Missing Tome page-counter trigger");
  }
  return ability.effect;
}

function setup(pageCounters: number) {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    replacedAttemptAction,
    tomeOfAbyssalHeaven,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 4 },
      ...(id === "p1"
        ? [
            { definitionId: tomeOfAbyssalHeaven.canonicalId, count: 1 },
            { definitionId: replacedAttemptAction.canonicalId, count: 1 },
          ]
        : []),
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
      randomSeed: 808,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const tomeId = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === tomeOfAbyssalHeaven.canonicalId,
  )!.id;
  const kernel = new GrandArchiveTransactionKernel();
  const prepared = kernel.transact(initial, [
    { type: "object-moved", objectId: tomeId, from: "main-deck", to: "field" },
    ...(pageCounters > 0
      ? [
          {
            type: "counter-changed" as const,
            objectId: tomeId,
            counter: "named:page",
            delta: pageCounters,
          },
        ]
      : []),
  ]).state;
  return { program, kernel, state: prepared, p1, tomeId };
}

function resolve(fixture: ReturnType<typeof setup>) {
  return executeGrandArchiveEffect(
    tomeEffect(),
    {
      program: fixture.program,
      state: fixture.state,
      controllerId: fixture.p1,
      sourceId: fixture.tomeId,
      abilityBearerId: fixture.tomeId,
      bindings: {},
    },
    (state, events) => {
      const transaction = fixture.kernel.transact(state, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  ).state;
}

describe("Grand Archive attempted effect outcomes", () => {
  it("does not partially remove counters and takes the failure branch", () => {
    const fixture = setup(3);
    const resolved = resolve(fixture);

    expect(resolved.objects[fixture.tomeId]?.counters["named:page"]).toBe(3);
    expect(resolved.players[fixture.p1]?.lost).toBe(true);
  });

  it("records a complete counter removal as successful", () => {
    const fixture = setup(8);
    const handBefore = fixture.state.zones[fixture.p1].hand.length;
    const resolved = resolve(fixture);

    expect(resolved.objects[fixture.tomeId]?.counters["named:page"]).toBe(0);
    expect(resolved.players[fixture.p1]?.lost).toBe(false);
    expect(resolved.zones[fixture.p1].hand).toHaveLength(handBefore + 1);
  });

  it("treats an action as performed when a replacement prevents its outcome", () => {
    const fixture = setup(0);
    const actionId = Object.values(fixture.state.objects).find(
      (object) =>
        object.ownerId === fixture.p1 && object.definitionId === replacedAttemptAction.canonicalId,
    )!.id;
    const replacement = executeGrandArchiveEffect(
      {
        kind: "replacement",
        event: { name: "card-moved", to: "banishment" },
        operation: { kind: "prevent" },
        duration: { kind: "permanent" },
      },
      {
        program: fixture.program,
        state: fixture.state,
        controllerId: fixture.p1,
        sourceId: fixture.tomeId,
        abilityBearerId: fixture.tomeId,
        bindings: {},
      },
      (state, events) => {
        const transaction = fixture.kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    const ready = fixture.kernel.transact(replacement.state, [
      {
        type: "object-moved",
        objectId: actionId,
        from: replacement.state.objects[actionId]!.zone,
        to: "hand",
      },
    ]).state;
    const handBefore = ready.zones[fixture.p1].hand.length;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, ready);
    expect(
      runtime.execute({ move: "activate-card", cardId: actionId }, { playerId: fixture.p1 }).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    const resolved = runtime.execute({ move: "pass" }, { playerId: grandArchivePlayerId("p2") });
    if (!resolved.ok) throw new Error(resolved.message);

    expect(runtime.state.zones[fixture.p1].hand).toHaveLength(handBefore);
    expect(runtime.state.objects[actionId]?.zone).toBe("graveyard");
  });
});
