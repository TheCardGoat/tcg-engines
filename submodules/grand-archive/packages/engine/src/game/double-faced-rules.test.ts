import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { prepareGrandArchiveRuleBoundEvent } from "../kernel/event-admission.ts";
import {
  grandArchiveObjectCurrentCharacteristics,
  grandArchiveObjectTimestamp,
} from "../rules/state/continuous.ts";
import { executeGrandArchiveEffect } from "../procedures/effects/effect-executor.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "./identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../kernel/kernel.ts";
import { grandArchiveObjectActiveAbilities } from "../rules/abilities/intrinsic-keywords.ts";
import { createGrandArchiveMatchProgram } from "../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "./model.ts";
import {
  chooseGrandArchiveReplacement,
  collectGrandArchiveReplacementCandidates,
} from "../rules/replacements/replacements.ts";

function singleFacedCard(
  id: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
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
        cost: { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["TAMER"], subtypes: [] },
        elements: ["NORM"],
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { power: 1, life: 3 }
              : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const transformingCard: GrandArchiveCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "double-faced-rules-card",
  slug: "double-faced-rules-card",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "double-faced-rules-card:face:default",
      catalogId: "double-faced-rules-card",
      name: "Dormant Stone",
      cost: { kind: "reserve", amount: 0 },
      typeLine: { supertypes: ["REGALIA"], types: ["ITEM"], classes: ["TAMER"], subtypes: [] },
      elements: ["NORM"],
      stats: {},
      rulesText: "Transform Dormant Stone.",
      abilities: [],
    },
    flipFace: {
      id: "double-faced-rules-card:face:flip",
      catalogId: "double-faced-rules-card-flip",
      name: "Awakened Beast",
      cost: { kind: "reserve", amount: 0 },
      typeLine: { supertypes: [], types: ["ALLY"], classes: ["TAMER"], subtypes: [] },
      elements: ["NORM"],
      stats: { power: 3, life: 3 },
      rulesText: "",
      abilities: [
        {
          id: "double-faced-rules-card-flip-a1",
          kind: "static",
          staticKind: "intrinsic",
          keyword: { name: "hindered" },
          text: "Hindered",
        },
      ],
    },
  },
};

const champion = singleFacedCard("double-faced-rules-champion", "CHAMPION");
const ordinaryAlly = singleFacedCard("double-faced-rules-ally", "ALLY");
const filler = singleFacedCard("double-faced-rules-filler", "ACTION");

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    ordinaryAlly,
    filler,
    transformingCard,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: ordinaryAlly.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 6 },
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      { definitionId: transformingCard.canonicalId, count: 1 },
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 419,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const objectId = Object.values(state.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === transformingCard.canonicalId,
  )!.id;
  const ordinaryAllyId = Object.values(state.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === ordinaryAlly.canonicalId,
  )!.id;
  return { program, state, p1, objectId, ordinaryAllyId };
}

function rulesKernel(program: ReturnType<typeof createGrandArchiveMatchProgram>) {
  return new GrandArchiveTransactionKernel({
    prepareEvent: (state, event) => prepareGrandArchiveRuleBoundEvent(program, state, event),
    collectReplacements: (state, event) =>
      collectGrandArchiveReplacementCandidates(program, state, event),
    chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
  });
}

function execute(
  fixture: ReturnType<typeof setup>,
  state: GrandArchiveMatchState,
  effect: GrandArchiveEffect,
  bindings: Readonly<Record<string, readonly GrandArchiveObjectId[]>>,
) {
  const kernel = rulesKernel(fixture.program);
  return executeGrandArchiveEffect(
    effect,
    { program: fixture.program, state, controllerId: fixture.p1, bindings },
    (effectState, events) => {
      const transaction = kernel.transact(effectState, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  );
}

describe("Grand Archive double-faced card rules", () => {
  it("transforms in place, then resets outside the field while retaining transformed LKI", () => {
    const fixture = setup();
    const kernel = rulesKernel(fixture.program);
    const onField = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.objectId,
        from: fixture.state.objects[fixture.objectId]!.zone,
        to: "field",
      },
    ]).state;
    const before = onField.objects[fixture.objectId]!;
    const transformed = execute(
      fixture,
      onField,
      { kind: "transform", subject: { kind: "bound", binding: "stone" } },
      { stone: [fixture.objectId] },
    );
    const active = transformed.state.objects[fixture.objectId]!;

    expect(transformed.outcome).toBe("performed");
    expect(active).toMatchObject({
      face: "transformed",
      incarnation: before.incarnation,
      objectVersion: before.objectVersion + 1,
    });
    expect(
      grandArchiveObjectTimestamp(active, {
        program: fixture.program,
        state: transformed.state,
        controllerId: fixture.p1,
        sourceId: fixture.objectId,
        abilityBearerId: fixture.objectId,
        bindings: {},
      }),
    ).toBe(transformed.state.stateVersion);

    const departure = kernel.transact(transformed.state, [
      {
        type: "object-moved",
        objectId: fixture.objectId,
        from: "field",
        to: "graveyard",
      },
    ]);
    const move = departure.result.events.find(
      (event) => event.type === "object-moved" && event.objectId === fixture.objectId,
    );

    expect(move).toMatchObject({ previousObject: { face: "transformed" } });
    expect(departure.state.objects[fixture.objectId]).toMatchObject({
      zone: "banishment",
      face: "default",
      incarnation: active.incarnation + 1,
    });
  });

  it("enters on the instructed transformed face and applies that face's entry characteristics", () => {
    const fixture = setup();
    const result = execute(
      fixture,
      fixture.state,
      {
        kind: "move",
        subject: { kind: "bound", binding: "stone" },
        destination: { zone: "field", face: "transformed" },
      },
      { stone: [fixture.objectId] },
    );

    expect(result.outcome).toBe("performed");
    expect(result.state.objects[fixture.objectId]).toMatchObject({
      zone: "field",
      face: "transformed",
    });
    expect(result.events.find((event) => event.type === "object-moved")).toMatchObject({
      entryFace: "transformed",
      entryStates: ["rested"],
    });
    expect(result.state.objects[fixture.objectId]?.states.has("rested")).toBe(true);
    expect(result.events.some((event) => event.type === "object-transformed")).toBe(false);
  });

  it("resets a transformed card when it becomes face-down without treating that as a transform", () => {
    const fixture = setup();
    const kernel = rulesKernel(fixture.program);
    const transformed = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.objectId,
        from: fixture.state.objects[fixture.objectId]!.zone,
        to: "field",
        entryFace: "transformed",
      },
    ]).state;
    const hidden = kernel.transact(transformed, [
      { type: "object-facing-changed", objectId: fixture.objectId, facing: "face-down" },
    ]);

    expect(hidden.state.objects[fixture.objectId]).toMatchObject({
      facing: "face-down",
      face: "default",
    });
    expect(
      grandArchiveObjectCurrentCharacteristics(
        fixture.program,
        hidden.state,
        hidden.state.objects[fixture.objectId]!,
      ),
    ).toEqual({
      names: [],
      supertypes: [],
      types: [],
      classes: [],
      subtypes: [],
      elements: [],
    });
    expect(
      grandArchiveObjectActiveAbilities(
        fixture.program,
        hidden.state,
        hidden.state.objects[fixture.objectId]!,
      ),
    ).toEqual([]);
    expect(hidden.result.events.some((event) => event.type === "object-transformed")).toBe(false);
  });

  it("uses the default Regalia face when an effect returns the transformed side to hand", () => {
    const fixture = setup();
    const kernel = rulesKernel(fixture.program);
    const transformed = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.objectId,
        from: fixture.state.objects[fixture.objectId]!.zone,
        to: "field",
        entryFace: "transformed",
      },
    ]).state;
    const returned = execute(
      fixture,
      transformed,
      {
        kind: "move",
        subject: { kind: "bound", binding: "stone" },
        from: "field",
        destination: { zone: "hand" },
      },
      { stone: [fixture.objectId] },
    );

    expect(returned.state.objects[fixture.objectId]).toMatchObject({
      zone: "material-deck",
      face: "default",
    });
  });

  it("skips transform attempts for single-faced objects and copies", () => {
    const fixture = setup();
    const kernel = rulesKernel(fixture.program);
    const onField = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.objectId,
        from: fixture.state.objects[fixture.objectId]!.zone,
        to: "field",
      },
      {
        type: "object-moved",
        objectId: fixture.ordinaryAllyId,
        from: fixture.state.objects[fixture.ordinaryAllyId]!.zone,
        to: "field",
      },
      { type: "object-transformed", objectId: fixture.objectId },
    ]).state;
    const copied = execute(
      fixture,
      onField,
      {
        kind: "copy",
        copy: "object",
        subject: { kind: "bound", binding: "stone" },
        bindResultAs: "copy",
      },
      { stone: [fixture.objectId] },
    );
    const copyId = copied.resultObjectIds[0]!;

    expect(copied.state.objects[copyId]).toMatchObject({
      face: "transformed",
      copy: { sourceObjectId: fixture.objectId },
    });

    const attempted = execute(
      fixture,
      copied.state,
      { kind: "transform", subject: { kind: "bound", binding: "subjects" } },
      { subjects: [fixture.ordinaryAllyId, copyId] },
    );

    expect(attempted.outcome).toBe("not-performed");
    expect(attempted.events).toEqual([]);
    expect(attempted.state.objects[fixture.ordinaryAllyId]?.face).toBe("default");
    expect(attempted.state.objects[copyId]?.face).toBe("transformed");
  });

  it("returns a single-faced object on its default face when transformed entry is inapplicable", () => {
    const fixture = setup();
    const ordinary = fixture.state.objects[fixture.ordinaryAllyId]!;
    const result = rulesKernel(fixture.program).transact(fixture.state, [
      {
        type: "object-moved",
        objectId: ordinary.id,
        from: ordinary.zone,
        to: "field",
        entryFace: "transformed",
      },
    ]);

    expect(result.state.objects[ordinary.id]).toMatchObject({ zone: "field", face: "default" });
    expect(result.result.events).toEqual([
      expect.objectContaining({ type: "object-moved", objectId: ordinary.id, to: "field" }),
    ]);
    expect(result.result.events[0]).not.toHaveProperty("entryFace");
  });

  it("summons the current face as a marked token copy that cannot transform", () => {
    const fixture = setup();
    const kernel = rulesKernel(fixture.program);
    const transformed = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.objectId,
        from: fixture.state.objects[fixture.objectId]!.zone,
        to: "field",
      },
      { type: "object-transformed", objectId: fixture.objectId },
    ]).state;
    const summoned = execute(
      fixture,
      transformed,
      {
        kind: "summon",
        controller: "controller",
        copyOf: { kind: "bound", binding: "stone" },
        bindResultAs: "summoned-copy",
      },
      { stone: [fixture.objectId] },
    );
    const copyId = summoned.resultObjectIds[0]!;

    expect(summoned.state.objects[copyId]).toMatchObject({
      definitionId: transformingCard.canonicalId,
      face: "transformed",
      isToken: true,
      copy: {
        sourceObjectId: fixture.objectId,
        expires: "when-unassociated",
      },
    });

    const attempted = execute(
      fixture,
      summoned.state,
      { kind: "transform", subject: { kind: "bound", binding: "copy" } },
      { copy: [copyId] },
    );
    expect(attempted.outcome).toBe("not-performed");
    expect(attempted.state.objects[copyId]?.face).toBe("transformed");
  });
});
