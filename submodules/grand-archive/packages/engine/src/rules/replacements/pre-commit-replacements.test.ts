import { blastshotPump, clockworkAmalgam, opticalControl } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveClass,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId, grandArchiveStackItemId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveReplacementPreCommit, GrandArchiveStackItem } from "../../game/model.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";
import { collectGrandArchiveTriggeredAbilityEvents } from "../abilities/triggers.ts";

function card(
  id: string,
  type: "ACTION" | "ALLY" | "CHAMPION" | "ITEM",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  classes: readonly [GrandArchiveClass, ...GrandArchiveClass[]] = ["CLERIC"],
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
        typeLine: { supertypes: [], types: [type], classes, subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { life: 2, power: 1 }
              : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("pre-commit-champion", "CHAMPION");
const rangerChampion = card("pre-commit-ranger-champion", "CHAMPION", [], ["RANGER"]);
const ally = card("pre-commit-ally", "ALLY", [
  {
    id: "preCommitAlly-a1",
    kind: "triggered",
    text: "On Enter: Put a buff counter on this ally.",
    trigger: {
      kind: "event",
      event: { name: "object-entered-field", subject: { kind: "source" } },
    },
    effect: {
      kind: "add-counter",
      subject: { kind: "source" },
      counter: "buff",
      amount: 1,
    },
  },
]);
const filler = card("pre-commit-filler", "ACTION");
const returner = card("pre-commit-returner", "ITEM", [
  {
    id: "preCommitReturner-a1",
    kind: "activated",
    activation: "ability",
    cost: { kind: "pay-reserve", amount: 0 },
    text: "Return target card to the field, then put a resolved counter on this item.",
    targets: [
      {
        id: "returned-card",
        kind: "target",
        declared: "announcement",
        chooser: "controller",
        count: { kind: "exactly", amount: 1 },
        candidates: { kind: "card", zones: ["graveyard"] },
      },
    ],
    effect: {
      kind: "sequence",
      effects: [
        {
          kind: "move",
          subject: { kind: "bound", binding: "returned-card" },
          from: "graveyard",
          destination: { zone: "field", controller: "controller" },
        },
        {
          kind: "add-counter",
          subject: { kind: "source" },
          counter: { named: "resolved" },
          amount: 1,
        },
      ],
    },
  },
]);

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    ally,
    filler,
    opticalControl,
    clockworkAmalgam,
    returner,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: ally.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 6 },
      ...(id === "p1"
        ? [
            { definitionId: opticalControl.canonicalId, count: 1 },
            { definitionId: clockworkAmalgam.canonicalId, count: 1 },
            { definitionId: returner.canonicalId, count: 1 },
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
      randomSeed: 1301,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const optical = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === opticalControl.canonicalId,
  )!;
  const returnerObject = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === returner.canonicalId,
  )!;
  const clockwork = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === clockworkAmalgam.canonicalId,
  )!;
  const allyObject = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === ally.canonicalId,
  )!;
  const item: GrandArchiveStackItem = {
    id: grandArchiveStackItemId(`stack-${initial.nextStackOrdinal}`),
    kind: "card-activation",
    controllerId: p1,
    sourceId: optical.id,
    selectedModeIds: [],
    targets: [],
    cardId: optical.id,
    originZone: "main-deck",
    paidCostKind: "reserve",
    elysianAuraActiveAtAnnouncement: false,
    announcedCardResolutionAbilities: [],
    createdAtVersion: initial.stateVersion,
    activationPhase: initial.turn.phase,
    isCopy: false,
    negated: false,
    opportunityPolicy: "normal",
    activationStates: [],
    activationPayment: [],
    championLevelModifier: 0,
    variables: {},
    bindings: {},
  };
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    {
      type: "object-moved",
      objectId: optical.id,
      from: "main-deck",
      to: "effects-stack",
    },
    { type: "stack-item-added", item },
  ]).state;
  return {
    program,
    initial,
    prepared,
    p1,
    p2,
    opticalId: optical.id,
    clockworkId: clockwork.id,
    allyId: allyObject.id,
    returnerId: returnerObject.id,
  };
}

describe("Grand Archive pre-commit replacement continuations", () => {
  it("round-trips Set-backed objects held inside a pre-commit transaction queue", () => {
    const fixture = setup();
    const queuedObject = fixture.initial.objects[fixture.allyId]!;
    const replacementPreCommit: GrandArchiveReplacementPreCommit = {
      followUp: {
        kind: "effect",
        effect: { kind: "rest", subject: { kind: "source" } },
        controllerId: fixture.p1,
        sourceId: queuedObject.id,
        bindings: {},
        variables: {},
      },
      continuation: {
        queue: [
          {
            event: { type: "object-created", object: queuedObject },
            depth: 0,
            appliedReplacementIds: ["synthetic-entry-replacement"],
          },
        ],
        startedEventHistoryIndex: fixture.initial.eventHistory.length,
      },
      afterResolutionEvents: [],
      status: "pending",
    };
    const serialized = serializeGrandArchiveMatchSnapshot({
      ...fixture.initial,
      replacementPreCommit,
    });
    const serializedEvent = serialized.replacementPreCommit?.continuation.queue[0].event;
    if (!serializedEvent || serializedEvent.type !== "object-created") {
      throw new Error("Expected a serialized object-created continuation event");
    }
    expect(Array.isArray(serializedEvent.object.states)).toBe(true);
    expect(Array.isArray(serializedEvent.object.activationStates)).toBe(true);

    const restored = restoreGrandArchiveMatchSnapshot(
      fixture.program,
      JSON.parse(JSON.stringify(serialized)),
    );
    const restoredEvent = restored.replacementPreCommit?.continuation.queue[0].event;
    if (!restoredEvent || restoredEvent.type !== "object-created") {
      throw new Error("Expected a restored object-created continuation event");
    }
    expect(restoredEvent.object.states).toBeInstanceOf(Set);
    expect(restoredEvent.object.activationStates).toBeInstanceOf(Set);
    expect([...restoredEvent.object.states]).toEqual([...queuedObject.states]);
    expect([...restoredEvent.object.activationStates]).toEqual([...queuedObject.activationStates]);
  });

  it("holds Optical Control's field-entry event until its type choice resolves", () => {
    const fixture = setup();
    const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.prepared);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);

    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-effect-choice") {
      throw new Error("Expected Optical Control's entry-processing choice");
    }
    expect(runtime.state.objects[fixture.opticalId]?.zone).toBe("effects-stack");
    expect(runtime.state.replacementPreCommit?.status).toBe("resolving");
    expect(
      runtime.state.eventHistory.some(
        (event) =>
          event.type === "object-moved" &&
          event.objectId === fixture.opticalId &&
          event.to === "field",
      ),
    ).toBe(false);

    const restored = new GrandArchiveMatchRuntime(
      fixture.program,
      restoreGrandArchiveMatchSnapshot(
        fixture.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(runtime.state))),
      ),
    );
    const answered = restored.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: "ALLY",
      },
      { playerId: fixture.p1 },
    );
    if (!answered.ok) throw new Error(answered.message);

    const entered = restored.state.objects[fixture.opticalId]!;
    expect(entered.zone).toBe("field");
    expect(restored.state.replacementPreCommit).toBeNull();
    expect(restored.state.trackedCharacteristics[entered.id]).toEqual({
      incarnation: entered.incarnation,
      values: { "chosen-card-type": ["ALLY"] },
    });
    expect(restored.state.decision).toBeNull();
    expect(restored.state.stack).toHaveLength(0);
  });

  it("resumes the parent ability only after its pre-commit choice and entry finish", () => {
    const fixture = setup();
    const staged = new GrandArchiveTransactionKernel().transact(fixture.initial, [
      {
        type: "object-moved",
        objectId: fixture.opticalId,
        from: "main-deck",
        to: "graveyard",
      },
      {
        type: "object-moved",
        objectId: fixture.returnerId,
        from: "main-deck",
        to: "field",
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, staged);
    expect(
      runtime.execute(
        {
          move: "activate-ability",
          sourceId: fixture.returnerId,
          abilityId: "preCommitReturner-a1",
          targets: { "returned-card": [fixture.opticalId] },
        },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);

    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-effect-choice") {
      throw new Error("Expected nested Optical Control choice");
    }
    expect(runtime.state.objects[fixture.opticalId]?.zone).toBe("graveyard");
    expect(runtime.state.objects[fixture.returnerId]?.counters["named:resolved"]).toBeUndefined();

    const answered = runtime.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: "PHANTASIA",
      },
      { playerId: fixture.p1 },
    );
    if (!answered.ok) throw new Error(answered.message);
    expect(runtime.state.objects[fixture.opticalId]?.zone).toBe("field");
    expect(runtime.state.objects[fixture.returnerId]?.counters["named:resolved"]).toBe(1);
    expect(runtime.state.resolution).toBeNull();
    expect(runtime.state.stack).toHaveLength(0);
  });

  it("lets Clockwork Amalgam copy a chosen field object before its entry commits", () => {
    const fixture = setup();
    const staged = new GrandArchiveTransactionKernel().transact(fixture.initial, [
      {
        type: "object-moved",
        objectId: fixture.clockworkId,
        from: "main-deck",
        to: "graveyard",
      },
      {
        type: "object-moved",
        objectId: fixture.allyId,
        from: "main-deck",
        to: "field",
      },
      {
        type: "object-moved",
        objectId: fixture.returnerId,
        from: "main-deck",
        to: "field",
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, staged);
    runtime.execute(
      {
        move: "activate-ability",
        sourceId: fixture.returnerId,
        abilityId: "preCommitReturner-a1",
        targets: { "returned-card": [fixture.clockworkId] },
      },
      { playerId: fixture.p1 },
    );
    runtime.execute({ move: "pass" }, { playerId: fixture.p1 });
    runtime.execute({ move: "pass" }, { playerId: fixture.p2 });

    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-effect-choice") {
      throw new Error("Expected Clockwork Amalgam's copy choice");
    }
    expect(runtime.state.objects[fixture.clockworkId]?.zone).toBe("graveyard");
    const answered = runtime.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: [fixture.allyId],
      },
      { playerId: fixture.p1 },
    );
    if (!answered.ok) throw new Error(answered.message);

    expect(runtime.state.objects[fixture.clockworkId]).toMatchObject({
      zone: "field",
      activeDefinitionId: ally.canonicalId,
    });
    expect(
      runtime.state.stack.some(
        (item) =>
          item.kind === "triggered-ability" &&
          item.sourceId === fixture.clockworkId &&
          item.ability.id === "preCommitAlly-a1",
      ),
    ).toBe(true);
    expect(
      runtime.state.continuousEffects.some(
        (effect) =>
          effect.sourceId === fixture.clockworkId &&
          effect.effect.kind === "continuous" &&
          effect.effect.change.kind === "grant-ability",
      ),
    ).toBe(true);
    expect(runtime.state.objects[fixture.returnerId]?.counters["named:resolved"]).toBe(1);

    const recollection = new GrandArchiveTransactionKernel().transact(runtime.state, [
      {
        type: "phase-changed",
        phase: "recollection",
        actorId: fixture.p1,
        cause: { kind: "rule", rule: "clockwork-granted-ability-test" },
      },
    ]);
    const grantedEffect = runtime.state.continuousEffects.find(
      (effect) =>
        effect.sourceId === fixture.clockworkId &&
        effect.effect.kind === "continuous" &&
        effect.effect.change.kind === "grant-ability",
    );
    if (!grantedEffect) throw new Error("Missing Clockwork granted effect");
    expect(grantedEffect.affectedObjectIncarnations[fixture.clockworkId]).toBe(
      runtime.state.objects[fixture.clockworkId]?.incarnation,
    );
    expect(
      collectGrandArchiveTriggeredAbilityEvents(
        fixture.program,
        recollection.state,
        recollection.result.events,
      ).some(
        (event) =>
          event.type === "pending-trigger-added" &&
          event.trigger.sourceId === fixture.clockworkId &&
          event.trigger.ability.id === "granted-kaobkz-a1",
      ),
    ).toBe(true);
  });

  it("resolves Blastshot Pump's interactive damage replacement before combat damage commits", () => {
    const program = createGrandArchiveMatchProgram([rangerChampion, ally, filler, blastshotPump]);
    const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: filler.canonicalId, count: id === "p1" ? 6 : 5 },
        ...(id === "p2" ? [{ definitionId: ally.canonicalId, count: 1 }] : []),
      ],
      materialDeck: [
        { definitionId: rangerChampion.canonicalId, count: 1 },
        ...(id === "p1" ? [{ definitionId: blastshotPump.canonicalId, count: 1 }] : []),
      ],
      startingChampionDefinitionId: rangerChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 1302,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const attackerId = initial.zones[p1].field[0]!;
    const defenderId = initial.zones[p2].field[0]!;
    const pump = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === blastshotPump.canonicalId,
    )!;
    const load = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === filler.canonicalId,
    )!;
    const additionalUnit = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === ally.canonicalId,
    )!;
    const ready = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "object-moved",
        objectId: pump.id,
        from: "material-deck",
        to: "field",
        initialCounters: { durability: 2 },
      },
      {
        type: "object-moved",
        objectId: load.id,
        from: "main-deck",
        to: "loaded",
        hostId: pump.id,
      },
      {
        type: "object-moved",
        objectId: additionalUnit.id,
        from: "main-deck",
        to: "field",
      },
      { type: "player-first-turn-completed", playerId: p1 },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, ready);

    const declared = runtime.execute(
      {
        move: "declare-attack",
        attackerId,
        targetIds: [defenderId],
        weaponIds: [pump.id],
      },
      { playerId: p1 },
    );
    if (!declared.ok) throw new Error(declared.message);
    for (let pass = 0; pass < 8 && !runtime.state.decision; pass += 1) {
      const holderId = runtime.state.opportunity?.holderId;
      if (!holderId) throw new Error("Blastshot Pump combat requires Opportunity");
      const result = runtime.execute({ move: "pass" }, { playerId: holderId });
      if (!result.ok) throw new Error(result.message);
    }

    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-effect-choice") {
      throw new Error("Expected Blastshot Pump's additional-unit choice");
    }
    expect(decision.selection.id).toBe("additional-unit");
    expect(runtime.state.objects[defenderId]?.damage).toBe(0);
    expect(runtime.state.objects[additionalUnit.id]?.damage).toBe(0);
    expect(runtime.state.replacementPreCommit?.status).toBe("resolving");

    const rejected = runtime.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: [defenderId],
      },
      { playerId: p1 },
    );
    expect(rejected.ok).toBe(false);
    expect(runtime.state.decision?.id).toBe(decision.id);

    const answered = runtime.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: [additionalUnit.id],
      },
      { playerId: p1 },
    );
    if (!answered.ok) throw new Error(answered.message);

    expect(runtime.state.objects[defenderId]?.damage).toBe(1);
    expect(runtime.state.objects[additionalUnit.id]?.damage).toBe(1);
    expect(runtime.state.objects[pump.id]?.counters.durability).toBe(1);
    expect(runtime.state.replacementPreCommit).toBeNull();
    expect(runtime.state.decision).toBeNull();
  });
});
