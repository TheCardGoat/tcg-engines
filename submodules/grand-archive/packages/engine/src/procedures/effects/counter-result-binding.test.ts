import { steadySharpshooter, surreptitiousScheme } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAmount,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "./effect-executor.ts";
import { evaluateGrandArchiveAmount } from "./evaluation.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";

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
        typeLine: { supertypes: [], types: [type], classes: ["RANGER"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("counter-result-champion", "CHAMPION");
const filler = card("counter-result-filler", "ACTION");

function steadySharpshooterCounterEffects(): {
  readonly remove: GrandArchiveEffect;
  readonly repeatCount: GrandArchiveAmount;
} {
  if (steadySharpshooter.layout.kind !== "single-faced") {
    throw new Error("Steady Sharpshooter must be single-faced");
  }
  const ability = steadySharpshooter.layout.face.abilities[0];
  if (ability?.kind !== "triggered" || ability.effect?.kind !== "sequence") {
    throw new Error("Steady Sharpshooter must have its On Attack sequence");
  }
  const optional = ability.effect.effects[1];
  if (optional?.kind !== "optional" || optional.effect.kind !== "sequence") {
    throw new Error("Steady Sharpshooter must optionally remove all aim counters");
  }
  const [remove, repeat] = optional.effect.effects;
  if (remove?.kind !== "remove-counter" || repeat?.kind !== "repeat") {
    throw new Error("Steady Sharpshooter must repeat ranged for the removed counter count");
  }
  return { remove, repeatCount: repeat.count };
}

describe("Grand Archive counter result bindings", () => {
  it("binds Steady Sharpshooter's removed aim counters as a numeric result", () => {
    const program = createGrandArchiveMatchProgram([champion, filler, steadySharpshooter]);
    const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: filler.canonicalId, count: 6 },
        ...(id === "p1" ? [{ definitionId: steadySharpshooter.canonicalId, count: 1 }] : []),
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
        randomSeed: 429,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const source = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === steadySharpshooter.canonicalId,
    );
    if (!source) throw new Error("Missing Steady Sharpshooter fixture card");
    const kernel = new GrandArchiveTransactionKernel();
    const prepared = kernel.transact(initial, [
      { type: "object-moved", objectId: source.id, from: source.zone, to: "field" },
      {
        type: "counter-changed",
        objectId: source.id,
        counter: "named:aim",
        delta: 3,
      },
    ]).state;
    const effects = steadySharpshooterCounterEffects();
    const result = executeGrandArchiveEffect(
      effects.remove,
      {
        program,
        state: prepared,
        controllerId: p1,
        sourceId: source.id,
        abilityBearerId: source.id,
        bindings: {},
      },
      (effectState, events) => {
        const transaction = kernel.transact(effectState, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );

    expect(result.state.objects[source.id]?.counters["named:aim"] ?? 0).toBe(0);
    expect(result.bindings["removed-aim-count"]).toBe(3);
    expect(
      evaluateGrandArchiveAmount(effects.repeatCount, {
        program,
        state: result.state,
        controllerId: p1,
        sourceId: source.id,
        abilityBearerId: source.id,
        bindings: result.bindings,
      }),
    ).toBe(3);
  });

  it("resolves Surreptitious Scheme's conditional draw from its committed counter removal", () => {
    const program = createGrandArchiveMatchProgram([champion, filler, surreptitiousScheme]);
    const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: filler.canonicalId, count: 6 },
        ...(id === "p1" ? [{ definitionId: surreptitiousScheme.canonicalId, count: 1 }] : []),
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
        randomSeed: 430,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const championId = initial.zones[p1].field[0]!;
    const scheme = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === surreptitiousScheme.canonicalId,
    );
    const payment = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === filler.canonicalId,
    );
    if (!scheme || !payment) throw new Error("Missing Surreptitious Scheme fixture cards");
    const kernel = new GrandArchiveTransactionKernel();
    const prepared = kernel.transact(initial, [
      { type: "object-moved", objectId: scheme.id, from: scheme.zone, to: "hand" },
      { type: "object-moved", objectId: payment.id, from: payment.zone, to: "hand" },
      { type: "counter-changed", objectId: championId, counter: "level", delta: 1 },
    ]).state;
    const handSizeBeforeActivation = prepared.zones[p1].hand.length;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: scheme.id,
          targets: { "target-1": [championId] },
          reservePayment: [{ kind: "card", cardId: payment.id }],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);

    expect(runtime.state.objects[championId]?.counters.level ?? 0).toBe(0);
    expect(runtime.state.zones[p1].hand).toHaveLength(handSizeBeforeActivation - 1);
    expect(runtime.state.objects[scheme.id]?.zone).toBe("graveyard");
  });
});

import { GrandArchiveTestEngine } from "../../testing/test-engine.ts";

describe("Move-counter quantities", () => {
  for (const counter of ["damage", "buff"] as const)
    for (const available of [0, 3])
      for (const all of [false, true]) {
        it(`moves ${all ? "all" : "two"} ${counter} counters from ${available} available`, () => {
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: { champion },
            playerTwo: { champion },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const source = p.card(champion),
            target = q.card(champion);
          const kernel = new GrandArchiveTransactionKernel();
          const prepared = kernel.transact(game.state, [
            { type: "counter-changed", objectId: source.objectId, counter, delta: available },
            { type: "counter-changed", objectId: target.objectId, counter, delta: 1 },
          ]).state;
          const result = executeGrandArchiveEffect(
            {
              kind: "move-counter",
              from: { kind: "source" },
              to: { kind: "champion", player: "opponent" },
              counter,
              amount: all ? { kind: "all" } : 2,
            },
            {
              program: game.program,
              state: prepared,
              controllerId: p.id,
              sourceId: source.objectId,
              // An unrelated triggering event must not define the meaning of "all".
              bindings: { eventAmount: 99 },
            },
            (state, events) => {
              const result = kernel.transact(state, events);
              return { state: result.state, events: result.result.events };
            },
          );
          const moved = all ? available : Math.min(2, available);
          const count = (id: typeof source.objectId) =>
            counter === "damage"
              ? result.state.objects[id]!.damage
              : (result.state.objects[id]!.counters.buff ?? 0);
          expect(count(source.objectId)).toBe(available - moved);
          expect(count(target.objectId)).toBe(1 + moved);
        });
      }
});

describe("Grand Archive reused effect result bindings", () => {
  it("replaces prior draw results on every execution, including a zero-result draw", () => {
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, zones: { "main-deck": [filler, filler, filler] } },
      playerTwo: { champion },
    });
    const p = game.player("player-one"),
      hero = p.card(champion),
      deck = p.zone("main-deck");
    const kernel = new GrandArchiveTransactionKernel();
    const commit = (
      state: typeof game.state,
      events: readonly import("../../kernel/events.ts").GrandArchiveProposedEvent[],
    ) => {
      const result = kernel.transact(state, events);
      return { state: result.state, events: result.result.events };
    };
    const first = executeGrandArchiveEffect(
      { kind: "draw", player: "controller", amount: 1, to: "memory", bindResultAs: "drawn" },
      {
        program: game.program,
        state: game.state,
        controllerId: p.id,
        sourceId: hero.objectId,
        bindings: { drawn: [hero.objectId], unrelated: 17 },
      },
      commit,
    );
    expect(first.bindings.drawn).toEqual([deck[0]!.objectId]);
    const second = executeGrandArchiveEffect(
      { kind: "draw", player: "controller", amount: 1, to: "memory", bindResultAs: "drawn" },
      {
        program: game.program,
        state: first.state,
        controllerId: p.id,
        sourceId: hero.objectId,
        bindings: first.bindings,
      },
      commit,
    );
    expect(second.bindings.drawn).toEqual([deck[1]!.objectId]);
    const empty = executeGrandArchiveEffect(
      { kind: "draw", player: "controller", amount: 0, to: "memory", bindResultAs: "drawn" },
      {
        program: game.program,
        state: second.state,
        controllerId: p.id,
        sourceId: hero.objectId,
        bindings: second.bindings,
      },
      commit,
    );
    expect(empty.bindings.drawn).toEqual([]);
    expect(empty.bindings.unrelated).toBe(17);
    expect(empty.state.zones[p.id].memory).toEqual([deck[0]!.objectId, deck[1]!.objectId]);
  });
});
