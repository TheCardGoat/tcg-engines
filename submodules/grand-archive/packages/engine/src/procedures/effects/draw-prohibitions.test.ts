import { bloodSurge, devotionsPrice, mandateOfHonor } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
  GrandArchiveSupertype,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "./effect-executor.ts";
import type { GrandArchiveObjectId } from "../../game/identity.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
  reserveCost = 0,
  supertypes: readonly GrandArchiveSupertype[] = [],
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
        cost:
          type === "CHAMPION"
            ? { kind: "memory", amount: 0 }
            : { kind: "reserve", amount: reserveCost },
        typeLine: {
          supertypes,
          types: [type],
          classes: ["GUARDIAN"],
          subtypes: [],
        },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { power: 1, life: 1 }
              : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("draw-prohibition-champion", "CHAMPION");
const filler = card("draw-prohibition-filler", "ACTION");
const omenZero = card("draw-prohibition-omen-zero", "ACTION", 0);
const omenOne = card("draw-prohibition-omen-one", "ACTION", 1);
const omenTwo = card("draw-prohibition-omen-two", "ACTION", 2);
const uniqueAlly = card("draw-prohibition-unique-ally", "ALLY", 1, ["UNIQUE"]);

const cards = [
  champion,
  filler,
  omenZero,
  omenOne,
  omenTwo,
  uniqueAlly,
  bloodSurge,
  devotionsPrice,
  mandateOfHonor,
] as const;

function setup() {
  const program = createGrandArchiveMatchProgram(cards);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 15 },
      ...(id === "p1"
        ? [
            { definitionId: omenZero.canonicalId, count: 1 },
            { definitionId: omenOne.canonicalId, count: 1 },
            { definitionId: omenTwo.canonicalId, count: 1 },
            { definitionId: uniqueAlly.canonicalId, count: 1 },
            { definitionId: bloodSurge.canonicalId, count: 1 },
            { definitionId: devotionsPrice.canonicalId, count: 1 },
          ]
        : []),
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...(id === "p1" ? [{ definitionId: mandateOfHonor.canonicalId, count: 1 }] : []),
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 481,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return { program, state, p1: grandArchivePlayerId("p1"), p2: grandArchivePlayerId("p2") };
}

function objectId(
  state: GrandArchiveMatchState,
  playerId: ReturnType<typeof grandArchivePlayerId>,
  definitionId: string,
): GrandArchiveObjectId {
  const object = Object.values(state.objects).find(
    (candidate) => candidate.ownerId === playerId && candidate.definitionId === definitionId,
  );
  if (!object) throw new Error(`Missing test object ${definitionId}`);
  return object.id;
}

function cardResolutionEffect(
  definition: typeof bloodSurge | typeof devotionsPrice,
  predicate: (effect: GrandArchiveEffect) => boolean = () => true,
): GrandArchiveEffect {
  if (definition.layout.kind !== "single-faced") throw new Error("Expected a single-faced card");
  const ability = definition.layout.face.abilities.find(
    (candidate) =>
      candidate.kind === "card-resolution" && candidate.effect && predicate(candidate.effect),
  );
  if (!ability || ability.kind !== "card-resolution" || !ability.effect) {
    throw new Error(`Missing card-resolution effect for ${definition.slug}`);
  }
  return ability.effect;
}

function execute(
  fixture: ReturnType<typeof setup>,
  state: GrandArchiveMatchState,
  effect: GrandArchiveEffect,
) {
  const kernel = new GrandArchiveTransactionKernel();
  return executeGrandArchiveEffect(
    effect,
    {
      program: fixture.program,
      state,
      controllerId: fixture.p1,
      bindings: {},
    },
    (effectState, events) => {
      const transaction = kernel.transact(effectState, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  );
}

function finishRecollection(runtime: GrandArchiveMatchRuntime) {
  for (let pass = 0; pass < 2; pass += 1) {
    const holderId = runtime.state.opportunity?.holderId;
    if (!holderId) throw new Error("Expected recollection Opportunity");
    const result = runtime.execute({ move: "pass" }, { playerId: holderId });
    if (!result.ok) throw new Error(result.message);
  }
}

describe("Grand Archive draw prohibitions", () => {
  it("prevents effect and turn-based draws without creating an empty-deck attempt", () => {
    const fixture = setup();
    const forbidDraw = cardResolutionEffect(
      bloodSurge,
      (effect) => effect.kind === "rule-modification" && effect.action === "draw",
    );
    const restricted = execute(fixture, fixture.state, forbidDraw).state;
    const emptyDeck = new GrandArchiveTransactionKernel().transact(
      restricted,
      restricted.zones[fixture.p1]["main-deck"].map((id) => ({
        type: "object-moved" as const,
        objectId: id,
        from: "main-deck" as const,
        to: "graveyard" as const,
      })),
    ).state;
    const handSize = emptyDeck.zones[fixture.p1].hand.length;

    const effectDraw = execute(fixture, emptyDeck, {
      kind: "draw",
      player: "controller",
      amount: 2,
    });
    expect(effectDraw.state.zones[fixture.p1].hand).toHaveLength(handSize);
    expect(effectDraw.events).toEqual([]);

    const atRecollection = new GrandArchiveTransactionKernel().transact(effectDraw.state, [
      { type: "phase-changed", phase: "recollection" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, atRecollection);
    finishRecollection(runtime);

    expect(runtime.state.turn.phase).toBe("main");
    expect(runtime.state.zones[fixture.p1].hand).toHaveLength(handSize);
    expect(runtime.state.players[fixture.p1]?.lost).toBe(false);
  });

  it("reevaluates Mandate of Honor between discrete cards in one draw action", () => {
    const fixture = setup();
    const mandateId = objectId(fixture.state, fixture.p1, mandateOfHonor.canonicalId);
    const allyId = objectId(fixture.state, fixture.p1, uniqueAlly.canonicalId);
    const handCards = Object.values(fixture.state.objects)
      .filter(
        (object) =>
          object.ownerId === fixture.p1 &&
          object.definitionId === filler.canonicalId &&
          object.zone === "main-deck",
      )
      .slice(0, 7);
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: mandateId, from: "material-deck", to: "field" },
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
      ...handCards.map((object) => ({
        type: "object-moved" as const,
        objectId: object.id,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
    ]).state;

    const result = execute(fixture, positioned, {
      kind: "draw",
      player: "controller",
      amount: 3,
    });

    expect(positioned.zones[fixture.p1].hand).toHaveLength(7);
    expect(result.state.zones[fixture.p1].hand).toHaveLength(8);
    expect(result.events.filter((event) => event.type === "object-moved")).toHaveLength(1);

    const inactive = new GrandArchiveTransactionKernel().transact(result.state, [
      { type: "object-moved", objectId: allyId, from: "field", to: "graveyard" },
    ]).state;
    expect(
      execute(fixture, inactive, { kind: "draw", player: "controller", amount: 1 }).events,
    ).toContainEqual(expect.objectContaining({ type: "object-moved" }));
  });

  it("resolves all of Devotion's Price draws before applying its prohibition", () => {
    const fixture = setup();
    const omenIds = [omenZero, omenOne, omenTwo].map((definition) =>
      objectId(fixture.state, fixture.p1, definition.canonicalId),
    );
    const positioned = new GrandArchiveTransactionKernel().transact(
      fixture.state,
      omenIds.flatMap((id) => [
        {
          type: "object-moved" as const,
          objectId: id,
          from: "main-deck" as const,
          to: "banishment" as const,
        },
        { type: "counter-changed" as const, objectId: id, counter: "omen" as const, delta: 1 },
      ]),
    ).state;
    const handSize = positioned.zones[fixture.p1].hand.length;
    const result = execute(fixture, positioned, cardResolutionEffect(devotionsPrice));

    expect(result.state.zones[fixture.p1].hand).toHaveLength(handSize + 3);
    expect(result.events.filter((event) => event.type === "object-moved")).toHaveLength(3);

    const subsequent = execute(fixture, result.state, {
      kind: "draw",
      player: "controller",
      amount: 1,
    });
    expect(subsequent.events).toEqual([]);
  });
});
