import { fracturingSlash, triboelectricFortification } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveCardFace,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "./kernel.ts";
import { createGrandArchiveMatchProgram } from "./match-program.ts";
import { GrandArchiveMatchRuntime } from "../procedures/game-flow/runtime.ts";

function face(definition: typeof fracturingSlash | typeof triboelectricFortification) {
  if (definition.layout.kind !== "single-faced") throw new Error("Expected a single-faced card");
  return definition.layout.face;
}

function card(
  canonicalId: string,
  type: GrandArchivePlayableCardType,
  options: {
    readonly abilities?: readonly GrandArchiveAbilityDefinition[];
    readonly subtypes?: readonly string[];
  } = {},
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
          classes: ["WARRIOR"],
          subtypes: options.subtypes ?? [],
        },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { power: 1, life: 10 }
              : type === "WEAPON"
                ? { power: 1, durability: 3 }
                : {},
        rulesText: "",
        abilities: options.abilities ?? [],
      },
    },
  };
}

const champion = card("counter-allocation-champion", "CHAMPION");
const ally = card("counter-allocation-ally", "ALLY");
const weapon = card("counter-allocation-weapon", "WEAPON", { subtypes: ["WARRIOR"] });
const filler = card("counter-allocation-filler", "ACTION");

function catalogResolution(
  catalogFace: GrandArchiveCardFace<GrandArchiveAbilityDefinition>,
): Extract<GrandArchiveAbilityDefinition, { readonly kind: "card-resolution" }> {
  const ability = catalogFace.abilities.find((candidate) => candidate.kind === "card-resolution");
  if (!ability || ability.kind !== "card-resolution") throw new Error("Missing card resolution");
  return ability;
}

function fracturingEffect() {
  const ability = face(fracturingSlash).abilities.find(
    (candidate) => candidate.kind === "triggered",
  );
  if (!ability || ability.kind !== "triggered" || !ability.effect) {
    throw new Error("Missing Fracturing Slash trigger");
  }
  return ability.effect;
}

function setup(source: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>) {
  const program = createGrandArchiveMatchProgram([champion, ally, weapon, filler, source]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: source.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: ally.canonicalId, count: 1 },
      { definitionId: weapon.canonicalId, count: 1 },
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
      randomSeed: 742,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const find = (ownerId: typeof p1, definitionId: string, zone?: "field"): GrandArchiveObjectId => {
    const object = Object.values(initial.objects).find(
      (candidate) =>
        candidate.ownerId === ownerId &&
        candidate.definitionId === definitionId &&
        (zone === undefined || candidate.zone === zone),
    );
    if (!object) throw new Error(`Missing ${ownerId} ${definitionId}`);
    return object.id;
  };
  const sourceId = find(p1, source.canonicalId);
  const allyId = find(p1, ally.canonicalId);
  const weaponId = find(p1, weapon.canonicalId);
  const championId = find(p1, champion.canonicalId, "field");
  const defendingChampionId = find(p2, champion.canonicalId, "field");
  const events = [
    ...(initial.objects[sourceId]!.zone === "hand"
      ? []
      : [
          {
            type: "object-moved" as const,
            objectId: sourceId,
            from: initial.objects[sourceId]!.zone,
            to: "hand" as const,
          },
        ]),
    ...[allyId, weaponId].flatMap((objectId) =>
      initial.objects[objectId]!.zone === "field"
        ? []
        : [
            {
              type: "object-moved" as const,
              objectId,
              from: initial.objects[objectId]!.zone,
              to: "field" as const,
              ...(objectId === weaponId ? { initialCounters: { durability: 3 } } : {}),
            },
          ],
    ),
  ];
  const prepared = new GrandArchiveTransactionKernel().transact(initial, events).state;
  return {
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    p1,
    p2,
    sourceId,
    allyId,
    weaponId,
    championId,
    defendingChampionId,
  };
}

function resolveCard(
  runtime: GrandArchiveMatchRuntime,
  p1: ReturnType<typeof grandArchivePlayerId>,
  p2: ReturnType<typeof grandArchivePlayerId>,
  sourceId: GrandArchiveObjectId,
  targets: Readonly<Record<string, readonly GrandArchiveObjectId[]>>,
) {
  const activated = runtime.execute(
    { move: "activate-card", cardId: sourceId, targets },
    { playerId: p1 },
  );
  if (!activated.ok) throw new Error(activated.message);
  const firstPass = runtime.execute({ move: "pass" }, { playerId: p1 });
  if (!firstPass.ok) throw new Error(firstPass.message);
  const secondPass = runtime.execute({ move: "pass" }, { playerId: p2 });
  if (!secondPass.ok) throw new Error(secondPass.message);
}

function answer(runtime: GrandArchiveMatchRuntime, value: unknown) {
  const decision = runtime.state.decision;
  if (!decision) throw new Error("Expected a decision");
  return runtime.execute(
    {
      move: "answer-decision",
      decisionId: decision.id,
      stateVersion: decision.stateVersion,
      answer: value,
    },
    { playerId: decision.playerId },
  );
}

describe("Grand Archive collection counter allocation", () => {
  it("moves Fracturing Slash's sheen counters from multiple units onto its defender", () => {
    const source = card("fracturing-slash-harness", "ACTION", {
      abilities: [
        {
          id: "fracturingSlashHarness-a1",
          kind: "card-resolution",
          text: face(fracturingSlash).rulesText,
          targets: [
            {
              id: "eventRecipient",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: { kind: "exactly", amount: 1 },
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: { kind: "type", oneOf: ["CHAMPION"] },
              },
            },
          ],
          effect: fracturingEffect(),
        },
      ],
    });
    const fixture = setup(source);
    const seeded = new GrandArchiveTransactionKernel().transact(fixture.runtime.state, [
      { type: "counter-changed", objectId: fixture.championId, counter: "named:sheen", delta: 2 },
      { type: "counter-changed", objectId: fixture.allyId, counter: "named:sheen", delta: 2 },
    ]).state;
    fixture.runtime = new GrandArchiveMatchRuntime(
      createGrandArchiveMatchProgram([champion, ally, weapon, filler, source]),
      seeded,
    );
    resolveCard(fixture.runtime, fixture.p1, fixture.p2, fixture.sourceId, {
      eventRecipient: [fixture.defendingChampionId],
    });
    expect(fixture.runtime.state.decision?.kind).toBe("resolve-optional-effect");
    expect(answer(fixture.runtime, true).ok).toBe(true);
    expect(fixture.runtime.state.decision).toMatchObject({
      kind: "resolve-counter-allocation",
      maximum: 3,
    });
    expect(
      answer(fixture.runtime, {
        allocations: [
          { objectId: fixture.championId, amount: 2 },
          { objectId: fixture.allyId, amount: 1 },
        ],
      }).ok,
    ).toBe(true);
    expect(fixture.runtime.state.objects[fixture.championId]?.counters["named:sheen"]).toBe(0);
    expect(fixture.runtime.state.objects[fixture.allyId]?.counters["named:sheen"]).toBe(1);
    expect(
      fixture.runtime.state.objects[fixture.defendingChampionId]?.counters["named:sheen"],
    ).toBe(3);
  });

  it("uses Triboelectric Fortification's committed removal total for damage and durability", () => {
    const catalogAbility = catalogResolution(face(triboelectricFortification));
    const source = card("triboelectric-fortification-harness", "ACTION", {
      abilities: [{ ...catalogAbility, id: "triboelectricFortificationHarness-a1" }],
    });
    const fixture = setup(source);
    const seeded = new GrandArchiveTransactionKernel().transact(fixture.runtime.state, [
      { type: "counter-changed", objectId: fixture.championId, counter: "static", delta: 1 },
      { type: "counter-changed", objectId: fixture.allyId, counter: "static", delta: 3 },
    ]).state;
    fixture.runtime = new GrandArchiveMatchRuntime(
      createGrandArchiveMatchProgram([champion, ally, weapon, filler, source]),
      seeded,
    );
    resolveCard(fixture.runtime, fixture.p1, fixture.p2, fixture.sourceId, {
      "target-unit": [fixture.defendingChampionId],
    });
    expect(fixture.runtime.state.decision?.kind).toBe("resolve-counter-allocation");
    expect(
      answer(fixture.runtime, { allocations: [{ objectId: fixture.allyId, amount: 4 }] }).ok,
    ).toBe(false);
    expect(
      answer(fixture.runtime, {
        allocations: [
          { objectId: fixture.championId, amount: 1 },
          { objectId: fixture.allyId, amount: 2 },
        ],
      }).ok,
    ).toBe(true);
    expect(fixture.runtime.state.objects[fixture.defendingChampionId]?.damage).toBe(3);
    expect(fixture.runtime.state.decision?.kind).toBe("resolve-effect-choice");
    expect(answer(fixture.runtime, [fixture.weaponId]).ok).toBe(true);
    expect(fixture.runtime.state.objects[fixture.weaponId]?.counters.durability).toBe(6);
    expect(fixture.runtime.state.objects[fixture.championId]?.counters.static).toBe(0);
    expect(fixture.runtime.state.objects[fixture.allyId]?.counters.static).toBe(1);
  });
});
