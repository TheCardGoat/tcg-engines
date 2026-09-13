import { divineComedy, flourishingQi, shiftingCurrents } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
  GrandArchiveElement,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import type { GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";
import {
  collectGrandArchivePendingTriggerProgressEvents,
  collectGrandArchiveTriggeredAbilityEvents,
} from "./triggers.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "CHAMPION",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  elements: readonly [GrandArchiveElement, ...GrandArchiveElement[]] = ["NORM"],
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
        ...(type === "CHAMPION" ? { lineageName: "Kongming" } : {}),
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements,
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("mastery-direction-champion", "CHAMPION");
const filler = card("mastery-direction-filler", "ACTION");

function sourceCard(
  effect: GrandArchiveEffect,
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return card("mastery-direction-source", "ACTION", [
    {
      id: "masteryDirectionSource-a1",
      kind: "card-resolution",
      text: "Gain Shifting Currents and choose a direction.",
      effect,
    },
  ]);
}

function setup(effect: GrandArchiveEffect): {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly runtime: GrandArchiveMatchRuntime;
  readonly sourceId: GrandArchiveObjectId;
} {
  const source = sourceCard(effect);
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    source,
    shiftingCurrents,
    divineComedy,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: source.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: filler.canonicalId, count: 9 },
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
      randomSeed: 115,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const sourceObject = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === source.canonicalId,
  )!;
  const prepared = new GrandArchiveTransactionKernel().transact(
    initial,
    sourceObject.zone === "hand"
      ? []
      : [
          {
            type: "object-moved",
            objectId: sourceObject.id,
            from: sourceObject.zone,
            to: "hand",
          },
        ],
  ).state;
  return {
    program,
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    sourceId: sourceObject.id,
  };
}

function resolveSource(runtime: GrandArchiveMatchRuntime, sourceId: GrandArchiveObjectId): void {
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  expect(runtime.execute({ move: "activate-card", cardId: sourceId }, { playerId: p1 }).ok).toBe(
    true,
  );
  expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
  expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
}

const gainShiftingCurrents: GrandArchiveEffect = {
  kind: "gain-mastery",
  player: "controller",
  mastery: "Shifting Currents",
};

describe("Grand Archive masteries and Shifting Currents", () => {
  it("stores Flourishing Qi counters on its pending activation and uses them for damage", () => {
    const teraChampion = card("activation-counter-champion", "CHAMPION", [], ["TERA"]);
    const program = createGrandArchiveMatchProgram([
      teraChampion,
      filler,
      flourishingQi,
      shiftingCurrents,
    ]);
    const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: flourishingQi.canonicalId, count: id === "p1" ? 1 : 0 },
        { definitionId: filler.canonicalId, count: 8 },
      ],
      materialDeck: [{ definitionId: teraChampion.canonicalId, count: 1 }],
      startingChampionDefinitionId: teraChampion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 116,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const source = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === flourishingQi.canonicalId,
    );
    const targetId = initial.zones[p2].field[0];
    if (!source || !targetId) throw new Error("Missing Flourishing Qi fixture objects");
    const paymentIds = initial.zones[p1]["main-deck"]
      .filter((objectId) => objectId !== source.id)
      .slice(0, 4);
    const championId = initial.zones[p1].field[0]!;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: source.id, from: source.zone, to: "hand" },
      ...paymentIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
      { type: "counter-changed", objectId: championId, counter: "level", delta: 2 },
      { type: "mastery-changed", playerId: p1, mastery: "Shifting Currents" },
      {
        type: "player-state-changed",
        playerId: p1,
        state: "shifting-currents",
        value: "east",
      },
    ]).state;
    let runtime = new GrandArchiveMatchRuntime(program, prepared);
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: source.id,
          targets: { "target-1": [targetId] },
          reservePayment: paymentIds.map((cardId) => ({ kind: "card" as const, cardId })),
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);

    const kernel = new GrandArchiveTransactionKernel();
    const turnedNorth = kernel.transact(runtime.state, [
      {
        type: "player-state-changed",
        playerId: p1,
        state: "shifting-currents",
        value: "north",
      },
    ]);
    const triggerEvents = collectGrandArchiveTriggeredAbilityEvents(
      program,
      turnedNorth.state,
      turnedNorth.result.events,
    );
    const pending = kernel.transact(turnedNorth.state, triggerEvents).state;
    const progress = collectGrandArchivePendingTriggerProgressEvents(program, pending);
    runtime = new GrandArchiveMatchRuntime(program, kernel.transact(pending, progress).state);
    expect(runtime.state.stack.map((item) => item.kind)).toEqual([
      "card-activation",
      "triggered-ability",
    ]);

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[source.id]?.counters["named:charge"]).toBe(4);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.objects[targetId]?.damage).toBe(6);
    expect(runtime.state.objects[source.id]?.zone).toBe("graveyard");
    expect(runtime.state.objects[source.id]?.counters["named:charge"]).toBeUndefined();
  });

  it("collects the catalog mastery trigger as a non-object player function", () => {
    const fixture = setup(gainShiftingCurrents);
    resolveSource(fixture.runtime, fixture.sourceId);
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const kernel = new GrandArchiveTransactionKernel();
    const phase = kernel.transact(fixture.runtime.state, [
      { type: "phase-changed", phase: "end", actorId: p1 },
    ]);
    const triggerEvents = collectGrandArchiveTriggeredAbilityEvents(
      fixture.program,
      phase.state,
      phase.result.events,
    );
    const pending = kernel.transact(phase.state, triggerEvents).state;
    const progress = collectGrandArchivePendingTriggerProgressEvents(fixture.program, pending);
    const onStack = kernel.transact(pending, progress).state;
    const stackItem = onStack.stack.at(-1);

    expect(stackItem).toMatchObject({
      kind: "triggered-ability",
      controllerId: p1,
      ability: { id: "qh5mpkyl60-a1" },
      masterySource: { playerId: p1, name: "Shifting Currents" },
      bindings: {
        masterySourcePlayer: [p1],
        masterySourceName: "Shifting Currents",
      },
    });
    expect(stackItem).not.toHaveProperty("sourceId");

    const runtime = new GrandArchiveMatchRuntime(fixture.program, onStack);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(runtime.state.decision).toMatchObject({
      kind: "resolve-optional-effect",
      playerId: p1,
    });
  });

  it("initializes North and snapshots an adjacent direction choice", () => {
    const fixture = setup({
      kind: "sequence",
      effects: [
        gainShiftingCurrents,
        {
          kind: "choose-direction",
          player: "controller",
          state: "shifting-currents",
          directions: ["north", "east", "south", "west"],
          differentFromCurrent: true,
          relationToCurrent: "adjacent",
        },
      ],
    });
    resolveSource(fixture.runtime, fixture.sourceId);
    const p1 = grandArchivePlayerId("p1");
    expect(fixture.runtime.state.players[p1]?.mastery).toEqual({
      name: "Shifting Currents",
      timestamp: 8,
      counters: {},
    });
    expect(fixture.runtime.state.players[p1]?.states["shifting-currents"]).toBe("north");
    expect(fixture.runtime.state.decision).toMatchObject({
      kind: "resolve-direction-choice",
      from: "north",
      directions: ["east", "west"],
    });
    const decision = fixture.runtime.state.decision;
    if (!decision || decision.kind !== "resolve-direction-choice") {
      throw new Error("Expected a direction decision");
    }
    const restored = new GrandArchiveMatchRuntime(
      fixture.program,
      restoreGrandArchiveMatchSnapshot(
        fixture.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(fixture.runtime.state))),
      ),
    );
    expect(restored.state.players[p1]?.mastery).toEqual({
      name: "Shifting Currents",
      timestamp: 8,
      counters: {},
    });
    const illegal = restored.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: "south",
      },
      { playerId: p1 },
    );
    expect(illegal.ok).toBe(false);
    const selected = restored.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: "east",
      },
      { playerId: p1 },
    );
    if (!selected.ok) throw new Error(selected.message);
    expect(restored.state.players[p1]?.states["shifting-currents"]).toBe("east");
    expect(selected.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "player-state-changed",
          state: "shifting-currents",
          previousValue: "north",
          value: "east",
        }),
      ]),
    );
  });

  it("automatically moves to the sole opposite direction", () => {
    const fixture = setup({
      kind: "sequence",
      effects: [
        gainShiftingCurrents,
        {
          kind: "choose-direction",
          player: "controller",
          state: "shifting-currents",
          directions: ["north", "east", "south", "west"],
          differentFromCurrent: true,
          relationToCurrent: "opposite",
        },
      ],
    });
    resolveSource(fixture.runtime, fixture.sourceId);
    const p1 = grandArchivePlayerId("p1");
    expect(fixture.runtime.state.decision).toBeNull();
    expect(fixture.runtime.state.players[p1]?.states["shifting-currents"]).toBe("south");
  });

  it("replaces the existing mastery and clears Shifting Currents state", () => {
    const fixture = setup({ kind: "no-op" });
    const p1 = grandArchivePlayerId("p1");
    const kernel = new GrandArchiveTransactionKernel();
    const result = executeGrandArchiveEffect(
      {
        kind: "sequence",
        effects: [
          gainShiftingCurrents,
          { kind: "gain-mastery", player: "controller", mastery: "Divine Comedy" },
        ],
      },
      { program: fixture.program, state: fixture.runtime.state, controllerId: p1, bindings: {} },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    expect(result.state.players[p1]?.mastery).toEqual({
      name: "Divine Comedy",
      timestamp: 4,
      counters: {},
    });
    expect(result.state.players[p1]?.states["shifting-currents"]).toBe(false);
  });

  it("matches Shifting Currents triggers only on the printed direction transition", () => {
    const source = {
      canonicalId: "direction-transition-source",
      slug: "direction-transition-source",
      definitionKind: "card" as const,
      layout: {
        kind: "single-faced" as const,
        face: {
          id: "direction-transition-source:face:default" as const,
          catalogId: "direction-transition-source",
          name: "direction-transition-source",
          cost: { kind: "none" as const },
          typeLine: {
            supertypes: [],
            types: ["ITEM"] as const,
            classes: ["MAGE"] as const,
            subtypes: [],
          },
          elements: ["NORM" as const],
          stats: {},
          rulesText: "",
          abilities: [
            {
              id: "direction-transition-source-a1" as const,
              kind: "triggered" as const,
              text: "Whenever your Shifting Currents change from facing West to East, draw a card.",
              trigger: {
                kind: "event" as const,
                event: {
                  name: "player-state-changed" as const,
                  actor: "controller" as const,
                  state: "shifting-currents",
                  directionTransition: { from: "west" as const, to: "east" as const },
                },
              },
              effect: { kind: "draw" as const, player: "controller" as const, amount: 1 },
            },
          ],
        },
      },
    };
    const program = createGrandArchiveMatchProgram([champion, filler, source]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [{ definitionId: filler.canonicalId, count: 8 }],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: source.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 19,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const sourceId = Object.values(initial.objects).find(
      (object) => object.definitionId === source.canonicalId,
    )!.id;
    const kernel = new GrandArchiveTransactionKernel();
    const onField = kernel.transact(initial, [
      { type: "object-moved", objectId: sourceId, from: "material-deck", to: "field" },
      {
        type: "player-state-changed",
        playerId: p1,
        state: "shifting-currents",
        value: "north",
      },
    ]).state;
    const west = kernel.transact(onField, [
      {
        type: "player-state-changed",
        playerId: p1,
        state: "shifting-currents",
        value: "west",
      },
    ]);
    expect(
      collectGrandArchiveTriggeredAbilityEvents(program, west.state, west.result.events),
    ).toEqual([]);
    const east = kernel.transact(west.state, [
      {
        type: "player-state-changed",
        playerId: p1,
        state: "shifting-currents",
        value: "east",
      },
    ]);
    expect(
      collectGrandArchiveTriggeredAbilityEvents(program, east.state, east.result.events),
    ).toEqual(expect.arrayContaining([expect.objectContaining({ type: "pending-trigger-added" })]));
  });
});
