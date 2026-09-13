import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { prepareGrandArchiveRuleBoundEvent } from "../../kernel/event-admission.ts";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import {
  evaluateGrandArchiveCondition,
  matchesGrandArchiveCardFilter,
} from "../../procedures/effects/evaluation.ts";
import {
  grandArchiveObjectId,
  grandArchivePlayerId,
  type GrandArchiveObjectId,
} from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import {
  grandArchiveObjectEffectiveStates,
  grandArchiveObjectHasState,
} from "../../game/object-state.ts";
import { projectGrandArchiveViewerState } from "../../projection/view.ts";

function card(id: string, type: "ACTION" | "CHAMPION"): GrandArchiveAnyCard {
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
        cost: { kind: type === "CHAMPION" ? "memory" : "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        rulesText: "",
        abilities: [] satisfies readonly GrandArchiveAbilityDefinition[],
      },
    },
  };
}

const champion = card("property-state-champion", "CHAMPION");
const filler = card("property-state-filler", "ACTION");

function setup() {
  const program = createGrandArchiveMatchProgram([champion, filler]);
  const player = (id: string): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [{ definitionId: filler.canonicalId, count: 6 }],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 431,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const objectId = state.zones[p1].field[0]!;
  return { program, state, p1, objectId };
}

function execute(
  fixture: ReturnType<typeof setup>,
  state: GrandArchiveMatchState,
  effect: GrandArchiveEffect,
) {
  const kernel = new GrandArchiveTransactionKernel({
    prepareEvent: (candidateState, event) =>
      prepareGrandArchiveRuleBoundEvent(fixture.program, candidateState, event),
  });
  return executeGrandArchiveEffect(
    effect,
    {
      program: fixture.program,
      state,
      controllerId: fixture.p1,
      bindings: { subject: [fixture.objectId] satisfies readonly GrandArchiveObjectId[] },
    },
    (effectState, events) => {
      const transaction = kernel.transact(effectState, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  );
}

describe("Grand Archive property state transitions", () => {
  it("derives Awake, Damaged, Loaded, and activation-backed object states", () => {
    const fixture = setup();
    const object = fixture.state.objects[fixture.objectId]!;
    const context = {
      program: fixture.program,
      state: fixture.state,
      controllerId: fixture.p1,
      sourceId: fixture.objectId,
      bindings: { subject: [fixture.objectId] satisfies readonly GrandArchiveObjectId[] },
    };

    expect(grandArchiveObjectHasState(fixture.state, object, "awake")).toBe(true);
    expect(object.states.has("awake")).toBe(false);
    expect(
      evaluateGrandArchiveCondition(
        { kind: "object-state", subject: { kind: "source" }, state: "awake" },
        context,
      ),
    ).toBe(true);
    expect(
      matchesGrandArchiveCardFilter(object, { kind: "object-state", state: "awake" }, context),
    ).toBe(true);

    const load = Object.values(fixture.state.objects).find(
      (candidate) => candidate.ownerId === fixture.p1 && candidate.id !== fixture.objectId,
    )!;
    const derived = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "damage-marked", objectId: fixture.objectId, amount: 1 },
      {
        type: "object-moved",
        objectId: load.id,
        from: load.zone,
        to: "loaded",
        hostId: fixture.objectId,
      },
      {
        type: "object-activation-state-changed",
        objectId: fixture.objectId,
        state: "prepared",
        value: true,
      },
    ]).state;
    const derivedObject = derived.objects[fixture.objectId]!;
    const effective = grandArchiveObjectEffectiveStates(derived, derivedObject);

    expect(grandArchiveObjectHasState(derived, derivedObject, "damaged")).toBe(true);
    expect(grandArchiveObjectHasState(derived, derivedObject, "loaded")).toBe(true);
    expect(grandArchiveObjectHasState(derived, derivedObject, "prepared")).toBe(true);
    expect(effective).toEqual(new Set(["awake", "damaged", "loaded", "prepared"]));
    const projected = projectGrandArchiveViewerState(fixture.program, derived, fixture.p1);
    const projectedObject = projected.players
      .flatMap((player) => {
        const field = player.zones.field;
        return field.visibility === "visible" ? field.objects : [];
      })
      .find((candidate) => candidate.id === fixture.objectId);
    expect(projectedObject?.states).toEqual(["awake", "damaged", "loaded", "prepared"]);
  });

  it("preserves unknown-object transitions for atomic reducer refusal", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel({
      prepareEvent: (state, event) =>
        prepareGrandArchiveRuleBoundEvent(fixture.program, state, event),
    });

    expect(() =>
      kernel.transact(fixture.state, [
        {
          type: "object-state-changed",
          objectId: grandArchiveObjectId("missing-object"),
          state: "rested",
          value: true,
        },
      ]),
    ).toThrow("Unknown object missing-object");
  });

  it("does not observe or perform assignments to an object's current state", () => {
    const fixture = setup();
    const effects: readonly GrandArchiveEffect[] = [
      {
        kind: "set-object-state",
        subject: { kind: "bound", binding: "subject" },
        state: "rested",
        value: false,
      },
      {
        kind: "set-activation-state",
        subject: { kind: "bound", binding: "subject" },
        state: "prepared",
        value: false,
      },
      {
        kind: "deal-damage",
        recipient: { kind: "bound", binding: "subject" },
        amount: 0,
      },
    ];

    for (const effect of effects) {
      const result = execute(fixture, fixture.state, effect);
      expect(result.outcome).toBe("not-performed");
      expect(result.events).toEqual([]);
      expect(result.state).toBe(fixture.state);
    }
  });

  it("performs a real state transition once and skips an identical repeat", () => {
    const fixture = setup();
    const effect: GrandArchiveEffect = {
      kind: "set-object-state",
      subject: { kind: "bound", binding: "subject" },
      state: "rested",
      value: true,
    };
    const changed = execute(fixture, fixture.state, effect);
    const repeated = execute(fixture, changed.state, effect);

    expect(changed.outcome).toBe("performed");
    expect(changed.events).toHaveLength(1);
    expect(changed.state.objects[fixture.objectId]?.states.has("rested")).toBe(true);
    expect(repeated.outcome).toBe("not-performed");
    expect(repeated.events).toEqual([]);
    expect(repeated.state).toBe(changed.state);
  });

  it("represents Awake by removing Rested instead of persisting a contradictory flag", () => {
    const fixture = setup();
    const rest = execute(fixture, fixture.state, {
      kind: "set-object-state",
      subject: { kind: "bound", binding: "subject" },
      state: "awake",
      value: false,
    });
    const wake = execute(fixture, rest.state, {
      kind: "set-object-state",
      subject: { kind: "bound", binding: "subject" },
      state: "awake",
      value: true,
    });

    expect(rest.events).toMatchObject([
      { type: "object-state-changed", state: "rested", value: true },
    ]);
    expect(
      grandArchiveObjectHasState(rest.state, rest.state.objects[fixture.objectId]!, "awake"),
    ).toBe(false);
    expect(wake.events).toMatchObject([
      { type: "object-state-changed", state: "rested", value: false },
    ]);
    expect(wake.state.objects[fixture.objectId]?.states.has("awake")).toBe(false);
    expect(
      grandArchiveObjectHasState(wake.state, wake.state.objects[fixture.objectId]!, "awake"),
    ).toBe(true);
  });

  it("changes retained Prepared as an activation property", () => {
    const fixture = setup();
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-activation-state-changed",
        objectId: fixture.objectId,
        state: "prepared",
        value: true,
      },
    ]).state;
    const cleared = execute(fixture, prepared, {
      kind: "set-object-state",
      subject: { kind: "bound", binding: "subject" },
      state: "prepared",
      value: false,
    });

    expect(cleared.events).toMatchObject([
      { type: "object-activation-state-changed", state: "prepared", value: false },
    ]);
    expect(cleared.state.objects[fixture.objectId]?.activationStates.has("prepared")).toBe(false);
  });
});
