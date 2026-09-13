import { exhilaratingPlume, greaterBoonOfFlock } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { matchesGrandArchiveEventPattern } from "../procedures/effects/evaluation.ts";
import {
  grandArchivePlayerId,
  grandArchiveStackItemId,
  type GrandArchiveObjectId,
} from "../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "./kernel.ts";
import { createGrandArchiveMatchProgram } from "./match-program.ts";
import type { GrandArchiveMatchState, GrandArchiveStackItem } from "../game/model.ts";
import { observeGrandArchiveProposedEvent } from "./observed-events.ts";
import {
  collectGrandArchiveReplacementCandidates,
  chooseGrandArchiveReplacement,
} from "../rules/replacements/replacements.ts";
import { GrandArchiveMatchRuntime } from "../procedures/game-flow/runtime.ts";

function card(
  id: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
  options: {
    readonly abilities?: readonly GrandArchiveAbilityDefinition[];
    readonly subtypes?: readonly string[];
  } = {},
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
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["WARRIOR"],
          subtypes: options.subtypes ?? [],
        },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 30 }
            : type === "ALLY"
              ? { life: 3, power: 1 }
              : {},
        rulesText: "",
        abilities: options.abilities ?? [],
      },
    },
  };
}

const champion = card("event-cause-champion", "CHAMPION", {
  abilities: [
    {
      id: "eventCauseChampion-a1",
      kind: "activated",
      activation: "ability",
      cost: { kind: "pay-reserve", amount: 0 },
      text: "Put a Human ally from your graveyard onto the field.",
      effect: {
        kind: "move",
        subject: { kind: "bound", binding: "human" },
        from: "graveyard",
        destination: { zone: "field" },
      },
    },
  ],
});
const human = card("event-cause-human", "ALLY", { subtypes: ["HUMAN"] });
const bird = card("event-cause-bird", "ALLY", { subtypes: ["BIRD"] });
const filler = card("event-cause-filler", "ACTION");

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    human,
    bird,
    filler,
    exhilaratingPlume,
    greaterBoonOfFlock,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 6 },
      ...(id === "p1"
        ? [
            { definitionId: human.canonicalId, count: 1 },
            { definitionId: bird.canonicalId, count: 1 },
            { definitionId: exhilaratingPlume.canonicalId, count: 1 },
            { definitionId: greaterBoonOfFlock.canonicalId, count: 1 },
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
      randomSeed: 20260825,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const objectId = (definitionId: string): GrandArchiveObjectId => {
    const object = Object.values(initial.objects).find(
      (candidate) => candidate.ownerId === p1 && candidate.definitionId === definitionId,
    );
    if (!object) throw new Error(`Missing event-cause object ${definitionId}`);
    return object.id;
  };
  return {
    program,
    initial,
    p1,
    p2,
    championId: initial.zones[p1].field[0]!,
    humanId: objectId(human.canonicalId),
    birdId: objectId(bird.canonicalId),
    plumeId: objectId(exhilaratingPlume.canonicalId),
    boonId: objectId(greaterBoonOfFlock.canonicalId),
  };
}

function rulesKernel(fixture: ReturnType<typeof setup>) {
  return new GrandArchiveTransactionKernel({
    collectReplacements: (state, event) =>
      collectGrandArchiveReplacementCandidates(fixture.program, state, event),
    chooseReplacement: chooseGrandArchiveReplacement,
  });
}

function moveTo(
  state: GrandArchiveMatchState,
  objectId: GrandArchiveObjectId,
  to: "field" | "graveyard" | "hand" | "pantheon",
) {
  const object = state.objects[objectId];
  if (!object) throw new Error(`Missing object ${objectId}`);
  if (object.zone === to) return state;
  return new GrandArchiveTransactionKernel().transact(state, [
    { type: "object-moved", objectId, from: object.zone, to },
  ]).state;
}

describe("Grand Archive event causes", () => {
  it("retains card-activation provenance after the stack item is removed", () => {
    const fixture = setup();
    let prepared = moveTo(fixture.initial, fixture.plumeId, "field");
    prepared = moveTo(prepared, fixture.humanId, "hand");
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);

    expect(
      runtime.execute({ move: "activate-card", cardId: fixture.humanId }, { playerId: fixture.p1 })
        .ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);

    expect(runtime.state.objects[fixture.humanId]?.zone).toBe("field");
    expect(runtime.state.objects[fixture.humanId]?.counters.buff).toBe(1);
    const entries = runtime.state.eventHistory.filter(
      (event) => event.type === "object-moved" && event.objectId === fixture.humanId,
    );
    const entry = entries[entries.length - 1];
    expect(entry?.cause).toMatchObject({
      kind: "stack-item",
      stackItemKind: "card-activation",
      controllerId: fixture.p1,
    });
  });

  it("does not treat an ability-caused Human entry as a card activation", () => {
    const fixture = setup();
    let prepared = moveTo(fixture.initial, fixture.plumeId, "field");
    prepared = moveTo(prepared, fixture.humanId, "graveyard");
    const ability =
      champion.layout.kind === "single-faced" ? champion.layout.face.abilities[0] : null;
    if (!ability || ability.kind !== "activated") throw new Error("Missing movement ability");
    const item: GrandArchiveStackItem = {
      id: grandArchiveStackItemId(`stack-${prepared.nextStackOrdinal}`),
      kind: "activated-ability",
      controllerId: fixture.p1,
      sourceId: fixture.championId,
      ability,
      selectedModeIds: [],
      targets: [],
      createdAtVersion: prepared.stateVersion,
      activationPhase: prepared.turn.phase,
      isCopy: false,
      negated: false,
      opportunityPolicy: "normal",
      activationStates: [],
      activationPayment: [],
      championLevelModifier: 0,
      variables: {},
      bindings: { human: [fixture.humanId] },
    };

    const result = rulesKernel(fixture).transact(prepared, [
      { type: "stack-item-added", item },
      {
        type: "object-moved",
        objectId: fixture.humanId,
        from: "graveyard",
        to: "field",
        cause: { kind: "stack-item", stackItemId: item.id },
      },
    ]);

    expect(result.state.objects[fixture.humanId]?.counters.buff ?? 0).toBe(0);
    expect(result.result.events.at(-1)?.cause).toMatchObject({
      kind: "stack-item",
      stackItemKind: "activated-ability",
      controllerId: fixture.p1,
      abilityId: ability.id,
    });
  });

  it("uses printed ability identity for Greater Boon of Flock's self-cause exclusion", () => {
    const fixture = setup();
    let state = moveTo(fixture.initial, fixture.boonId, "pantheon");
    state = moveTo(state, fixture.birdId, "graveyard");
    const source = state.objects[fixture.boonId];
    if (!source || greaterBoonOfFlock.layout.kind !== "single-faced") {
      throw new Error("Missing Greater Boon fixture");
    }
    const ability = greaterBoonOfFlock.layout.face.abilities[0];
    const trigger = ability?.kind === "triggered" ? ability.trigger : undefined;
    if (!ability || ability.kind !== "triggered" || !trigger || trigger.kind !== "event") {
      throw new Error("Missing Greater Boon trigger");
    }
    if ("anyOf" in trigger.event) throw new Error("Unexpected Greater Boon composite trigger");
    const pattern = trigger.event;
    const event = {
      type: "object-moved" as const,
      objectId: fixture.birdId,
      from: "graveyard" as const,
      to: "field" as const,
      cause: {
        kind: "stack-item" as const,
        stackItemId: grandArchiveStackItemId("stack-cause"),
        stackItemKind: "triggered-ability" as const,
        controllerId: fixture.p1,
        abilityId: ability.id,
      },
    };
    const observed = observeGrandArchiveProposedEvent(event).find(
      (candidate) => candidate.name === "object-entered-field",
    );
    if (!observed) throw new Error("Missing field-entry observation");
    const context = {
      program: fixture.program,
      state,
      controllerId: fixture.p1,
      sourceId: source.id,
      abilityBearerId: source.id,
      abilityId: ability.id,
      bindings: {},
    };

    expect(matchesGrandArchiveEventPattern(pattern, observed, source, context)).toBe(false);
    expect(
      matchesGrandArchiveEventPattern(
        pattern,
        {
          ...observed,
          committedEvent: {
            ...event,
            cause: { ...event.cause, abilityId: "another-ability" },
          },
        },
        source,
        context,
      ),
    ).toBe(true);
  });
});
