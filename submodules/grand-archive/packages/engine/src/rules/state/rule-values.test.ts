import { hoarfrostHold, mistResonance } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import {
  grandArchiveCombatDamageStat,
  proposeGrandArchiveCombatDamage,
} from "../../procedures/combat/combat.ts";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { grandArchiveCounterKey } from "../../procedures/effects/evaluation.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import type { GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { openGrandArchiveOpportunity } from "../../procedures/game-flow/opportunity.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";
import { collectGrandArchivePlayerLimitRules } from "./rule-modifications.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
  stats: { readonly power?: number; readonly life?: number } = {},
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
        typeLine: {
          supertypes: [],
          types: [type],
          classes: [type === "CHAMPION" ? "TAMER" : "WARRIOR"],
          subtypes: [],
        },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats: {
          ...(type === "CHAMPION" ? { level: 0, life: 20 } : {}),
          ...stats,
        },
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("rule-value-champion", "CHAMPION");
const ally = card("rule-value-ally", "ALLY", { power: 2, life: 5 });
const filler = card("rule-value-filler", "ACTION");
const recollectionWatcher = card("recollection-watcher", "ALLY", { power: 1, life: 2 }, [
  {
    id: "recollection-watcher-a1",
    kind: "triggered",
    text: "Whenever a player recollects two or more cards, put a charge counter on this.",
    trigger: {
      kind: "event",
      event: {
        name: "cards-recollected",
        amountComparison: { left: { kind: "event-amount" }, operator: "gte", right: 2 },
      },
    },
    effect: {
      kind: "add-counter",
      subject: { kind: "source" },
      counter: { named: "charge" },
      amount: 1,
    },
  },
]);

const cards = [champion, ally, filler, recollectionWatcher, mistResonance, hoarfrostHold] as const;

function setup() {
  const program = createGrandArchiveMatchProgram(cards);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: ally.canonicalId, count: 2 },
      { definitionId: filler.canonicalId, count: 10 },
      ...(id === "p1"
        ? [
            { definitionId: mistResonance.canonicalId, count: 1 },
            { definitionId: hoarfrostHold.canonicalId, count: 1 },
            { definitionId: recollectionWatcher.canonicalId, count: 1 },
          ]
        : []),
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 811,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return { program, state, p1: grandArchivePlayerId("p1"), p2: grandArchivePlayerId("p2") };
}

function objectIds(
  state: GrandArchiveMatchState,
  ownerId: ReturnType<typeof grandArchivePlayerId>,
  definitionId: string,
) {
  return Object.values(state.objects)
    .filter((object) => object.ownerId === ownerId && object.definitionId === definitionId)
    .map((object) => object.id);
}

function mistDamageRule(): GrandArchiveEffect {
  if (mistResonance.layout.kind !== "single-faced")
    throw new Error("Mist Resonance must be single-faced");
  const ability = mistResonance.layout.face.abilities.find(
    (candidate) => candidate.kind === "card-resolution" && candidate.id === "hw8dxKAnMX-a2",
  );
  if (!ability || ability.kind !== "card-resolution" || ability.effect.kind !== "conditional") {
    throw new Error("Mist Resonance Harmonize rule is missing");
  }
  return ability.effect.then;
}

function execute(
  fixture: ReturnType<typeof setup>,
  state: GrandArchiveMatchState,
  effect: GrandArchiveEffect,
  sourceId?: GrandArchiveObjectId,
) {
  const kernel = new GrandArchiveTransactionKernel();
  return executeGrandArchiveEffect(
    effect,
    {
      program: fixture.program,
      state,
      controllerId: fixture.p1,
      ...(sourceId ? { sourceId } : {}),
      bindings: {},
    },
    (effectState, events) => {
      const transaction = kernel.transact(effectState, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  );
}

function atRecollection(
  fixture: ReturnType<typeof setup>,
  options: { readonly frostCounters?: number; readonly watcher?: boolean; readonly memory: number },
) {
  const kernel = new GrandArchiveTransactionKernel();
  const hoarfrostId = objectIds(fixture.state, fixture.p1, hoarfrostHold.canonicalId)[0]!;
  const watcherId = objectIds(fixture.state, fixture.p1, recollectionWatcher.canonicalId)[0]!;
  const memoryIds = fixture.state.zones[fixture.p2]["main-deck"].slice(0, options.memory);
  const positioned = kernel.transact(fixture.state, [
    { type: "player-first-turn-completed", playerId: fixture.p1 },
    { type: "player-first-turn-completed", playerId: fixture.p2 },
    ...(options.frostCounters === undefined
      ? []
      : [
          {
            type: "object-moved" as const,
            objectId: hoarfrostId,
            from: "main-deck" as const,
            to: "field" as const,
          },
          {
            type: "counter-changed" as const,
            objectId: hoarfrostId,
            counter: grandArchiveCounterKey({ named: "frost" }),
            delta: options.frostCounters,
          },
        ]),
    ...(options.watcher
      ? [
          {
            type: "object-moved" as const,
            objectId: watcherId,
            from: "main-deck" as const,
            to: "field" as const,
          },
        ]
      : []),
    ...memoryIds.map((objectId) => ({
      type: "object-moved" as const,
      objectId,
      from: "main-deck" as const,
      to: "memory" as const,
    })),
    { type: "turn-started", playerId: fixture.p2, turnNumber: 2 },
    { type: "phase-changed", phase: "recollection" },
  ]).state;
  return kernel.transact(positioned, [
    {
      type: "opportunity-opened",
      window: openGrandArchiveOpportunity(positioned, fixture.p2, "phase-begin"),
    },
  ]).state;
}

function finishOpportunity(runtime: GrandArchiveMatchRuntime) {
  const first = runtime.state.opportunity?.holderId;
  if (!first) throw new Error("Expected an Opportunity holder");
  expect(runtime.execute({ move: "pass" }, { playerId: first }).ok).toBe(true);
  const second = runtime.state.opportunity?.holderId;
  if (!second) throw new Error("Expected the next Opportunity holder");
  return runtime.execute({ move: "pass" }, { playerId: second });
}

describe("Grand Archive rule values and limits", () => {
  it("uses life for Mist Resonance's locked allies when assigning attack and retaliation damage", () => {
    const fixture = setup();
    const [affectedId, laterId] = objectIds(fixture.state, fixture.p1, ally.canonicalId);
    const sourceId = objectIds(fixture.state, fixture.p1, mistResonance.canonicalId)[0]!;
    const targetId = fixture.state.zones[fixture.p2].field[0]!;
    const kernel = new GrandArchiveTransactionKernel();
    const withAffected = kernel.transact(fixture.state, [
      { type: "object-moved", objectId: affectedId!, from: "main-deck", to: "field" },
    ]).state;
    const modified = execute(fixture, withAffected, mistDamageRule(), sourceId).state;
    const withLaterAlly = kernel.transact(modified, [
      { type: "object-moved", objectId: laterId!, from: "main-deck", to: "field" },
    ]).state;

    expect(withLaterAlly.ruleModifications[0]?.affectedObjectIds).toEqual([affectedId]);
    expect(
      grandArchiveCombatDamageStat(
        fixture.program,
        withLaterAlly,
        withLaterAlly.objects[affectedId!]!,
      ),
    ).toBe(5);
    expect(
      grandArchiveCombatDamageStat(
        fixture.program,
        withLaterAlly,
        withLaterAlly.objects[laterId!]!,
      ),
    ).toBe(2);

    const combat = kernel.transact(withLaterAlly, [
      { type: "object-state-changed", objectId: affectedId!, state: "attacking", value: true },
      { type: "object-state-changed", objectId: targetId, state: "defending", value: true },
      {
        type: "combat-started",
        combat: {
          attackerId: affectedId!,
          attackingPlayerId: fixture.p1,
          defendingPlayerIds: [fixture.p2],
          targetIds: [targetId],
          retaliatorIds: [],
          retaliationOrderConfirmed: true,
          weaponIds: [],
          intentIds: [],
          step: "damage",
        },
      },
    ]).state;
    const events = proposeGrandArchiveCombatDamage(fixture.program, combat);
    expect(events).toContainEqual(
      expect.objectContaining({ type: "damage-marked", objectId: targetId, amount: 5 }),
    );

    const reincarnated = kernel.transact(withLaterAlly, [
      { type: "object-moved", objectId: affectedId!, from: "field", to: "graveyard" },
      { type: "object-moved", objectId: affectedId!, from: "graveyard", to: "field" },
    ]).state;
    expect(
      grandArchiveCombatDamageStat(
        fixture.program,
        reincarnated,
        reincarnated.objects[affectedId!]!,
      ),
    ).toBe(2);
  });

  it("lets Hoarfrost Hold's opponent choose exactly X fewer cards to recollect", () => {
    const fixture = setup();
    const runtime = new GrandArchiveMatchRuntime(
      fixture.program,
      atRecollection(fixture, { frostCounters: 2, memory: 4 }),
    );
    expect(runtime.state.turn).toMatchObject({ phase: "recollection", recollectionPending: true });
    expect(runtime.state.zones[fixture.p2].memory).toHaveLength(4);
    expect(
      collectGrandArchivePlayerLimitRules({
        action: "recollect",
        playerId: fixture.p2,
        evaluation: {
          program: fixture.program,
          state: runtime.state,
          controllerId: fixture.p2,
          bindings: {},
        },
      }),
    ).toHaveLength(1);
    const pass = finishOpportunity(runtime);
    if (!pass.ok) throw new Error(pass.message);
    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "choose-recollection") {
      throw new Error(
        `Expected a recollection choice: ${JSON.stringify({ turn: runtime.state.turn, decision, events: pass.events })}`,
      );
    }
    expect(decision.amount).toBe(2);
    const invalid = runtime.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: decision.candidateIds.slice(0, 1),
      },
      { playerId: fixture.p2 },
    );
    expect(invalid).toMatchObject({ ok: false, code: "illegal-command" });
    expect(runtime.state.decision?.id).toBe(decision.id);
    const selected = decision.candidateIds.slice(0, 2);
    const answer = runtime.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: selected,
      },
      { playerId: fixture.p2 },
    );
    if (!answer.ok) throw new Error(answer.message);
    expect(runtime.state.zones[fixture.p2].memory).toHaveLength(2);
    expect(
      selected.every((objectId) => runtime.state.zones[fixture.p2].hand.includes(objectId)),
    ).toBe(true);
    expect(answer.events).toContainEqual(
      expect.objectContaining({
        type: "cards-recollected",
        playerId: fixture.p2,
        objectIds: selected,
      }),
    );
    expect(runtime.state.turn.phase).toBe("main");
  });

  it("keeps recollection triggers in the Recollection phase before advancing to Draw", () => {
    const fixture = setup();
    const runtime = new GrandArchiveMatchRuntime(
      fixture.program,
      atRecollection(fixture, { watcher: true, memory: 3 }),
    );
    const result = finishOpportunity(runtime);
    if (!result.ok) throw new Error(result.message);
    expect(result.events).toContainEqual(
      expect.objectContaining({ type: "cards-recollected", playerId: fixture.p2 }),
    );
    expect(result.events.some((event) => event.type === "stack-item-added")).toBe(true);
    expect(
      result.events.some((event) => event.type === "phase-changed" && event.phase === "draw"),
    ).toBe(false);
    expect(runtime.state.turn.phase).toBe("recollection");
    expect(runtime.state.turn.recollectionPending).toBe(false);
  });
});
