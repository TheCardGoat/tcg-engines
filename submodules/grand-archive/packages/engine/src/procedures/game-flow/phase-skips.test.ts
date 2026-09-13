import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../effects/effect-executor.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "./initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { GrandArchiveMatchRuntime } from "./runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
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
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
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

const champion = card("phase-skip-champion", "CHAMPION");
const filler = card("phase-skip-filler", "ACTION");
const ally = card("phase-skip-ally", "ALLY");

function setup(): {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly state: GrandArchiveMatchState;
  readonly p1: ReturnType<typeof grandArchivePlayerId>;
  readonly p2: ReturnType<typeof grandArchivePlayerId>;
  readonly p2Allies: readonly [GrandArchiveObjectId, GrandArchiveObjectId];
} {
  const program = createGrandArchiveMatchProgram([champion, filler, ally]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: ally.canonicalId, count: 2 },
      { definitionId: filler.canonicalId, count: 8 },
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
      randomSeed: 633,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const p2Allies = Object.values(initial.objects).filter(
    (object) => object.ownerId === p2 && object.definitionId === ally.canonicalId,
  );
  if (!p2Allies[0] || !p2Allies[1]) throw new Error("Missing phase skip allies");
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    { type: "player-first-turn-completed", playerId: p1 },
    { type: "player-first-turn-completed", playerId: p2 },
  ]).state;
  return {
    program,
    state: prepared,
    p1,
    p2,
    p2Allies: [p2Allies[0].id, p2Allies[1].id],
  };
}

function execute(
  fixture: ReturnType<typeof setup>,
  state: GrandArchiveMatchState,
  effect: GrandArchiveEffect,
  bindings: Readonly<Record<string, readonly GrandArchiveObjectId[]>> = {},
) {
  const kernel = new GrandArchiveTransactionKernel();
  return executeGrandArchiveEffect(
    effect,
    {
      program: fixture.program,
      state,
      controllerId: fixture.p1,
      bindings,
    },
    (effectState, events) => {
      const transaction = kernel.transact(effectState, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  );
}

function passCycle(runtime: GrandArchiveMatchRuntime) {
  const first = runtime.state.opportunity?.holderId;
  if (!first) throw new Error("Expected an Opportunity window");
  expect(runtime.execute({ move: "pass" }, { playerId: first }).ok).toBe(true);
  const second = runtime.state.opportunity?.holderId;
  if (!second) throw new Error("Expected the next Opportunity holder");
  const result = runtime.execute({ move: "pass" }, { playerId: second });
  if (!result.ok) throw new Error(result.message);
  return result;
}

function completeMaterializeAndRecollection(
  runtime: GrandArchiveMatchRuntime,
  playerId: ReturnType<typeof grandArchivePlayerId>,
) {
  expect(runtime.state.turn).toMatchObject({ playerId, phase: "materialize" });
  expect(runtime.execute({ move: "skip-materialization" }, { playerId }).ok).toBe(true);
  expect(runtime.state.turn.phase).toBe("recollection");
  return passCycle(runtime);
}

describe("Grand Archive skipped phases", () => {
  it("stacks repeated skips and consumes one for each future draw phase across turns", () => {
    const fixture = setup();
    const added = execute(fixture, fixture.state, {
      kind: "sequence",
      effects: [
        { kind: "skip-next-phase", player: "opponent", phase: "draw" },
        { kind: "skip-next-phase", player: "opponent", phase: "draw" },
      ],
    });
    expect(added.state.players[fixture.p2]?.phaseSkips.draw).toBe(2);
    const restored = restoreGrandArchiveMatchSnapshot(
      fixture.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(added.state))),
    );
    const runtime = new GrandArchiveMatchRuntime(fixture.program, restored);
    const initialHandSize = runtime.state.zones[fixture.p2].hand.length;

    passCycle(runtime);
    passCycle(runtime);
    const firstSkip = completeMaterializeAndRecollection(runtime, fixture.p2);
    expect(runtime.state.turn).toMatchObject({ playerId: fixture.p2, phase: "main" });
    expect(runtime.state.players[fixture.p2]?.phaseSkips.draw).toBe(1);
    expect(runtime.state.zones[fixture.p2].hand).toHaveLength(initialHandSize);
    expect(firstSkip.events.some((event) => event.type === "phase-skip-consumed")).toBe(true);
    expect(
      firstSkip.events.some((event) => event.type === "phase-changed" && event.phase === "draw"),
    ).toBe(false);

    passCycle(runtime);
    passCycle(runtime);
    completeMaterializeAndRecollection(runtime, fixture.p1);
    passCycle(runtime);
    passCycle(runtime);
    const secondSkip = completeMaterializeAndRecollection(runtime, fixture.p2);
    expect(runtime.state.players[fixture.p2]?.phaseSkips.draw).toBe(0);
    expect(runtime.state.zones[fixture.p2].hand).toHaveLength(initialHandSize);
    expect(secondSkip.events.some((event) => event.type === "phase-skip-consumed")).toBe(true);
  });

  it("lets a wake-up phase occur while honoring object-specific wake prohibitions", () => {
    const fixture = setup();
    const moved = new GrandArchiveTransactionKernel().transact(fixture.state, [
      ...fixture.p2Allies.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "field" as const,
      })),
      ...fixture.p2Allies.map((objectId) => ({
        type: "object-state-changed" as const,
        objectId,
        state: "rested" as const,
        value: true,
      })),
      { type: "phase-changed", phase: "end" as const },
    ]).state;
    const forbidden = execute(
      fixture,
      moved,
      {
        kind: "rule-modification",
        mode: "forbid",
        action: "wake",
        subject: { kind: "bound", binding: "frozen" },
        duration: {
          kind: "until-end-of-next-phase",
          phase: "wake-up",
          whose: { controllerOf: "frozen" },
        },
      },
      { frozen: [fixture.p2Allies[0]] },
    );
    const runtime = new GrandArchiveMatchRuntime(fixture.program, forbidden.state);
    const transition = passCycle(runtime);

    expect(runtime.state.turn).toMatchObject({ playerId: fixture.p2, phase: "materialize" });
    expect(runtime.state.objects[fixture.p2Allies[0]]?.states.has("rested")).toBe(true);
    expect(runtime.state.objects[fixture.p2Allies[1]]?.states.has("rested")).toBe(false);
    expect(
      transition.events.some(
        (event) => event.type === "phase-changed" && event.phase === "wake-up",
      ),
    ).toBe(true);
  });

  it("consumes consecutive skipped phases without entering them or running End cleanup", () => {
    const fixture = setup();
    const skipped = execute(fixture, fixture.state, {
      kind: "sequence",
      effects: [
        { kind: "skip-next-phase", player: "opponent", phase: "materialize" },
        { kind: "skip-next-phase", player: "opponent", phase: "recollection" },
        { kind: "skip-next-phase", player: "opponent", phase: "draw" },
        { kind: "skip-next-phase", player: "opponent", phase: "main" },
        { kind: "skip-next-phase", player: "opponent", phase: "end" },
      ],
    });
    const prepared = new GrandArchiveTransactionKernel().transact(skipped.state, [
      {
        type: "object-moved",
        objectId: fixture.p2Allies[0],
        from: "main-deck",
        to: "field",
      },
      {
        type: "object-state-changed",
        objectId: fixture.p2Allies[0],
        state: "distant",
        value: true,
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);

    passCycle(runtime);
    const transition = passCycle(runtime);

    expect(runtime.state.turn).toMatchObject({
      number: 3,
      playerId: fixture.p1,
      phase: "materialize",
    });
    expect(runtime.state.objects[fixture.p2Allies[0]]?.states.has("distant")).toBe(true);
    expect(runtime.state.players[fixture.p2]?.phaseSkips).toMatchObject({
      materialize: 0,
      recollection: 0,
      draw: 0,
      main: 0,
      end: 0,
    });
    const p2TurnStart = transition.events.findIndex(
      (event) => event.type === "turn-started" && event.playerId === fixture.p2,
    );
    const p1TurnStart = transition.events.findIndex(
      (event, index) =>
        index > p2TurnStart && event.type === "turn-started" && event.playerId === fixture.p1,
    );
    const p2TurnEvents = transition.events.slice(p2TurnStart + 1, p1TurnStart);
    expect(
      p2TurnEvents.flatMap((event) => (event.type === "phase-skip-consumed" ? [event.phase] : [])),
    ).toEqual(["materialize", "recollection", "draw", "main", "end"]);
    expect(
      p2TurnEvents.flatMap((event) => (event.type === "phase-changed" ? [event.phase] : [])),
    ).toEqual(["wake-up"]);
  });

  it("skips a pending Combat phase without paying attack costs or changing combat state", () => {
    const fixture = setup();
    const p1Attacker = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === fixture.p1 && object.definitionId === ally.canonicalId,
    )!;
    const withSkip = execute(fixture, fixture.state, {
      kind: "skip-next-phase",
      player: "controller",
      phase: "combat",
    });
    const prepared = new GrandArchiveTransactionKernel().transact(withSkip.state, [
      { type: "object-moved", objectId: p1Attacker.id, from: p1Attacker.zone, to: "field" },
      {
        type: "object-moved",
        objectId: fixture.p2Allies[0],
        from: "main-deck",
        to: "field",
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);

    const result = runtime.execute(
      {
        move: "declare-attack",
        attackerId: p1Attacker.id,
        targetIds: [fixture.p2Allies[0]],
      },
      { playerId: fixture.p1 },
    );
    if (!result.ok) throw new Error(result.message);

    expect(result.events).toEqual([
      expect.objectContaining({ type: "phase-skip-consumed", phase: "combat" }),
    ]);
    expect(runtime.state.turn.phase).toBe("main");
    expect(runtime.state.combat).toBeNull();
    expect(runtime.state.objects[p1Attacker.id]?.states.has("rested")).toBe(false);
    expect(runtime.state.players[fixture.p1]?.phaseSkips.combat).toBe(0);
  });

  it("skips an additional Materialize phase and proceeds to End instead of Recollection", () => {
    const fixture = setup();
    const withSkip = execute(fixture, fixture.state, {
      kind: "skip-next-phase",
      player: "controller",
      phase: "materialize",
    });
    const distorted = new GrandArchiveTransactionKernel().transact(withSkip.state, [
      { type: "game-state-changed", state: "time-distorted", value: true },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, distorted);

    const transition = passCycle(runtime);

    expect(runtime.state.turn).toMatchObject({
      playerId: fixture.p1,
      phase: "end",
      materializeKind: null,
    });
    expect(runtime.state.opportunity?.holderId).toBe(fixture.p1);
    expect(runtime.state.players[fixture.p1]?.phaseSkips.materialize).toBe(0);
    expect(
      transition.events.some(
        (event) => event.type === "phase-changed" && event.phase === "materialize",
      ),
    ).toBe(false);
    expect(transition.events).toContainEqual(
      expect.objectContaining({ type: "phase-skip-consumed", phase: "materialize" }),
    );
  });
});
