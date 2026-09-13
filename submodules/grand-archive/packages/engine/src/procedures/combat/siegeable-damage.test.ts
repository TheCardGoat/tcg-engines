import { glacierRemnants, stockedOutpost } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { prepareGrandArchiveRuleBoundEvent } from "../../kernel/event-admission.ts";
import type { GrandArchiveCommittedEvent } from "../../kernel/events.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { matchesGrandArchiveCardFilter } from "../effects/evaluation.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { observeGrandArchiveCommittedEvent } from "../../kernel/observed-events.ts";
import {
  chooseGrandArchiveReplacement,
  collectGrandArchiveReplacementCandidates,
} from "../../rules/replacements/replacements.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";

function card(
  id: string,
  type: GrandArchivePlayableCardType,
  stats: {
    readonly level?: number;
    readonly power?: number;
    readonly life?: number;
    readonly durability?: number;
  },
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
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["GUARDIAN"],
          subtypes: [],
        },
        elements: ["NORM"],
        stats,
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("siegeable-test-champion", "CHAMPION", { level: 0, life: 30 });
const attacker = card("siegeable-test-attacker", "ALLY", { power: 2, life: 3 });
const filler = card("siegeable-test-filler", "ACTION", {});

function rulesKernel(program: GrandArchiveMatchProgram): GrandArchiveTransactionKernel {
  return new GrandArchiveTransactionKernel({
    prepareEvent: (state, event) => prepareGrandArchiveRuleBoundEvent(program, state, event),
    collectReplacements: (state, event) =>
      collectGrandArchiveReplacementCandidates(program, state, event),
    chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
  });
}

function setup(
  definitions: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[],
  options: {
    readonly p1Champion?: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
    readonly p2Champion?: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
    readonly p1Main: readonly {
      readonly definition: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
      readonly count: number;
    }[];
    readonly p2Main: readonly {
      readonly definition: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
      readonly count: number;
    }[];
  },
): {
  readonly program: GrandArchiveMatchProgram;
  readonly state: GrandArchiveMatchState;
} {
  const p1Champion = options.p1Champion ?? champion;
  const p2Champion = options.p2Champion ?? champion;
  const program = createGrandArchiveMatchProgram([
    ...definitions,
    p1Champion,
    ...(p2Champion.canonicalId === p1Champion.canonicalId ? [] : [p2Champion]),
    filler,
  ]);
  const player = (
    id: "p1" | "p2",
    selectedChampion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
    main: typeof options.p1Main,
  ): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      ...main.map(({ definition, count }) => ({ definitionId: definition.canonicalId, count })),
      { definitionId: filler.canonicalId, count: 6 },
    ],
    materialDeck: [{ definitionId: selectedChampion.canonicalId, count: 1 }],
    startingChampionDefinitionId: selectedChampion.canonicalId,
  });
  return {
    program,
    state: createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [
          player("p1", p1Champion, options.p1Main),
          player("p2", p2Champion, options.p2Main),
        ],
        firstPlayerId: "p1",
        randomSeed: 1049,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    ),
  };
}

function resolveCombat(
  runtime: GrandArchiveMatchRuntime,
  attackerId: GrandArchiveObjectId,
  targetId: GrandArchiveObjectId,
): readonly GrandArchiveCommittedEvent[] {
  const before = runtime.state.eventHistory.length;
  const declaration = runtime.execute(
    { move: "declare-attack", attackerId, targetIds: [targetId] },
    { playerId: grandArchivePlayerId("p1") },
  );
  if (!declaration.ok) throw new Error(declaration.message);

  for (let step = 0; runtime.state.combat && step < 16; step += 1) {
    const decision = runtime.state.decision;
    if (decision) {
      if (decision.kind !== "choose-retaliators") {
        throw new Error(`Unexpected combat decision ${decision.kind}`);
      }
      const answered = runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: [],
        },
        { playerId: decision.playerId },
      );
      if (!answered.ok) throw new Error(answered.message);
      continue;
    }
    const holderId = runtime.state.opportunity?.holderId;
    if (!holderId) throw new Error("Combat has no decision or Opportunity");
    const passed = runtime.execute({ move: "pass" }, { playerId: holderId });
    if (!passed.ok) throw new Error(passed.message);
  }
  if (runtime.state.combat) throw new Error("Combat did not finish");
  return runtime.state.eventHistory.slice(before);
}

describe("Grand Archive Siegeable damage", () => {
  it("enforces a catalog Siegeable subtype without printed reminder text", () => {
    const fixture = setup([attacker, glacierRemnants], {
      p1Main: [{ definition: attacker, count: 3 }],
      p2Main: [{ definition: glacierRemnants, count: 1 }],
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const attackers = Object.values(fixture.state.objects).filter(
      (object) => object.ownerId === p1 && object.definitionId === attacker.canonicalId,
    );
    const domain = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === glacierRemnants.canonicalId,
    );
    if (attackers.length !== 3 || !domain) throw new Error("Missing Siegeable combat fixture");
    const positioned = rulesKernel(fixture.program).transact(fixture.state, [
      ...attackers.map((object) => ({
        type: "object-moved" as const,
        objectId: object.id,
        from: object.zone,
        to: "field" as const,
      })),
      {
        type: "object-moved",
        objectId: domain.id,
        from: domain.zone,
        to: "field",
      },
      { type: "player-first-turn-completed", playerId: p1 },
    ]).state;
    expect(positioned.objects[domain.id]?.counters.durability).toBe(6);
    expect(
      matchesGrandArchiveCardFilter(
        positioned.objects[domain.id]!,
        { kind: "has-keyword", keyword: "siegeable" },
        {
          program: fixture.program,
          state: positioned,
          controllerId: p2,
          sourceId: domain.id,
          abilityBearerId: domain.id,
          bindings: {},
        },
      ),
    ).toBe(true);
    const runtime = new GrandArchiveMatchRuntime(fixture.program, positioned);

    const firstCombat = resolveCombat(runtime, attackers[0]!.id, domain.id);
    expect(runtime.state.objects[domain.id]).toMatchObject({ zone: "field", damage: 0 });
    expect(runtime.state.objects[domain.id]?.counters.durability).toBe(4);
    const firstDamage = firstCombat.find(
      (event) => event.type === "damage-marked" && event.objectId === domain.id,
    );
    expect(firstDamage).toMatchObject({
      type: "damage-marked",
      amount: 2,
      combatDamage: true,
      asDurabilityLoss: true,
      durabilityRemoved: 2,
    });
    if (!firstDamage || firstDamage.type !== "damage-marked") {
      throw new Error("Missing first Siegeable damage event");
    }
    expect(observeGrandArchiveCommittedEvent(firstDamage).map((event) => event.name)).toEqual([
      "damage-dealt",
      "attack-hit",
      "counter-removed",
    ]);

    resolveCombat(runtime, attackers[1]!.id, domain.id);
    expect(runtime.state.objects[domain.id]?.counters.durability).toBe(2);
    const secondCombat = resolveCombat(runtime, attackers[2]!.id, domain.id);
    expect(runtime.state.objects[domain.id]?.zone).toBe("graveyard");
    const destruction = secondCombat.find(
      (event) =>
        event.type === "object-moved" &&
        event.objectId === domain.id &&
        event.cause?.kind === "rule" &&
        event.cause.rule === "zero-durability-state-check",
    );
    if (!destruction || destruction.type !== "object-moved") {
      throw new Error("Missing Siegeable destruction event");
    }
    expect(observeGrandArchiveCommittedEvent(destruction).map((event) => event.name)).toEqual([
      "card-moved",
      "object-left-field",
      "object-destroyed",
    ]);
  });

  it("reclassifies redirected unit damage as Siegeable durability loss", () => {
    const redirectingDomain = card("siegeable-redirecting-domain", "DOMAIN", { durability: 3 }, [
      {
        id: "siegeableRedirectingDomain-a1",
        kind: "static",
        staticKind: "intrinsic",
        text: "Siegeable",
        keyword: { name: "siegeable" },
      },
      {
        id: "siegeableRedirectingDomain-a2",
        kind: "static",
        staticKind: "effects",
        text: "If damage would be dealt to an object you control, redirect it to this.",
        effects: [
          {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: { kind: "event-object", controller: "controller" },
            },
            operation: { kind: "redirect", recipient: { kind: "source" } },
            duration: { kind: "while-source-on-field" },
          },
        ],
      },
    ]);
    const fixture = setup([attacker, redirectingDomain], {
      p1Main: [{ definition: attacker, count: 1 }],
      p2Main: [{ definition: redirectingDomain, count: 1 }],
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const source = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === attacker.canonicalId,
    );
    const domain = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === redirectingDomain.canonicalId,
    );
    const recipientId = fixture.state.zones[p2].field[0]!;
    if (!source || !domain) throw new Error("Missing redirection fixture");
    const kernel = rulesKernel(fixture.program);
    const positioned = kernel.transact(fixture.state, [
      { type: "object-moved", objectId: domain.id, from: domain.zone, to: "field" },
    ]).state;
    const result = kernel.transact(positioned, [
      {
        type: "damage-marked",
        objectId: recipientId,
        sourceId: source.id,
        amount: 2,
        combatDamage: false,
      },
    ]);

    expect(result.state.objects[recipientId]?.damage).toBe(0);
    expect(result.state.objects[domain.id]?.counters.durability).toBe(1);
    expect(result.result.events.find((event) => event.type === "damage-marked")).toMatchObject({
      objectId: domain.id,
      amount: 2,
      asDurabilityLoss: true,
      durabilityRemoved: 2,
    });

    const classified = prepareGrandArchiveRuleBoundEvent(fixture.program, positioned, {
      type: "damage-marked",
      objectId: domain.id,
      amount: 1,
    });
    if (!classified || classified.type !== "damage-marked") {
      throw new Error("Damage was not classified");
    }
    expect(classified.asDurabilityLoss).toBe(true);
    expect(
      prepareGrandArchiveRuleBoundEvent(fixture.program, positioned, {
        ...classified,
        objectId: recipientId,
      }),
    ).not.toHaveProperty("asDurabilityLoss");
  });

  it("preserves durability and emits no hit when prevention reduces Siegeable damage to zero", () => {
    const preventingChampion = card(
      "siegeable-preventing-champion",
      "CHAMPION",
      { level: 0, life: 30 },
      [
        {
          id: "siegeablePreventingChampion-a1",
          kind: "static",
          staticKind: "effects",
          text: "If damage would be dealt to an object you control, prevent 2 of it.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: { kind: "event-object", controller: "controller" },
              },
              operation: { kind: "modify-amount", operation: "subtract", amount: 2 },
              duration: { kind: "while-source-on-field" },
            },
          ],
        },
      ],
    );
    const fixture = setup([attacker, stockedOutpost], {
      p2Champion: preventingChampion,
      p1Main: [{ definition: attacker, count: 1 }],
      p2Main: [{ definition: stockedOutpost, count: 1 }],
    });
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const source = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === attacker.canonicalId,
    );
    const domain = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === stockedOutpost.canonicalId,
    );
    if (!source || !domain) throw new Error("Missing prevention fixture");
    const kernel = rulesKernel(fixture.program);
    const positioned = kernel.transact(fixture.state, [
      { type: "object-moved", objectId: domain.id, from: domain.zone, to: "field" },
    ]).state;
    const result = kernel.transact(positioned, [
      {
        type: "damage-marked",
        objectId: domain.id,
        sourceId: source.id,
        amount: 2,
        combatDamage: true,
      },
    ]);

    expect(result.state.objects[domain.id]?.counters.durability).toBe(4);
    expect(result.result.events).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ type: "damage-marked" })]),
    );
    expect(result.result.events).toEqual(
      expect.arrayContaining([expect.objectContaining({ type: "damage-prevented", amount: 2 })]),
    );
  });
});
