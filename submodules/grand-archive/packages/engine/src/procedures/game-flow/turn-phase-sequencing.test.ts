import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveTriggeredAbility,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "./initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { GrandArchiveMatchRuntime } from "./runtime.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
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
        cost: { kind: "none" },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { power: 1, life: 5 }
              : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

function observedStateAbility(
  id: GrandArchiveTriggeredAbility["id"],
  trigger: NonNullable<GrandArchiveTriggeredAbility["trigger"]>,
  stateName: string,
): GrandArchiveTriggeredAbility {
  return {
    id,
    kind: "triggered",
    text: stateName,
    trigger,
    effect: {
      kind: "set-player-state",
      player: "controller",
      state: { named: stateName },
      value: true,
    },
  };
}

const champion = card("turn-sequencing-champion", "CHAMPION");
const filler = card("turn-sequencing-filler", "ACTION");
const wakeWatcher = card("turn-sequencing-wake-watcher", "ALLY", [
  observedStateAbility(
    "turnSequencingWakeWatcher-a1",
    {
      kind: "event",
      event: {
        name: "object-state-changed",
        subject: { kind: "source" },
        state: "rested",
        from: true,
        to: false,
      },
    },
    "observed-wake-up",
  ),
]);
const drawWatcher = card("turn-sequencing-draw-watcher", "ALLY", [
  observedStateAbility(
    "turnSequencingDrawWatcher-a1",
    {
      kind: "event",
      event: {
        name: "card-drawn",
        actor: "controller",
        subject: { kind: "event-object" },
      },
    },
    "observed-draw",
  ),
]);
const cleanupWatcher = card("turn-sequencing-cleanup-watcher", "ALLY", [
  observedStateAbility(
    "turnSequencingCleanupWatcher-a1",
    {
      kind: "event",
      event: {
        name: "object-state-changed",
        subject: { kind: "source" },
        state: "distant",
        from: true,
        to: false,
      },
    },
    "observed-end-cleanup",
  ),
]);
const turnEndsWatcher = card("turn-sequencing-turn-ends-watcher", "ALLY", [
  observedStateAbility(
    "turnSequencingTurnEndsWatcher-a1",
    { kind: "event", event: { name: "turn-ends", actor: "controller" } },
    "observed-turn-end",
  ),
]);

function setupPlayer(id: string): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: wakeWatcher.canonicalId, count: 1 },
      { definitionId: drawWatcher.canonicalId, count: 1 },
      { definitionId: cleanupWatcher.canonicalId, count: 1 },
      { definitionId: turnEndsWatcher.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 8 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

function setup(): {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly state: GrandArchiveMatchState;
  readonly p1: ReturnType<typeof grandArchivePlayerId>;
  readonly p2: ReturnType<typeof grandArchivePlayerId>;
  readonly p1CleanupWatcherId: GrandArchiveObjectId;
  readonly p1TurnEndsWatcherId: GrandArchiveObjectId;
  readonly p2WakeWatcherId: GrandArchiveObjectId;
  readonly p2DrawWatcherId: GrandArchiveObjectId;
} {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    wakeWatcher,
    drawWatcher,
    cleanupWatcher,
    turnEndsWatcher,
  ]);
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [setupPlayer("p1"), setupPlayer("p2")],
      firstPlayerId: "p1",
      randomSeed: 757,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const objectId = (ownerId: ReturnType<typeof grandArchivePlayerId>, definitionId: string) =>
    Object.values(state.objects).find(
      (object) => object.ownerId === ownerId && object.definitionId === definitionId,
    )!.id;
  return {
    program,
    state,
    p1,
    p2,
    p1CleanupWatcherId: objectId(p1, cleanupWatcher.canonicalId),
    p1TurnEndsWatcherId: objectId(p1, turnEndsWatcher.canonicalId),
    p2WakeWatcherId: objectId(p2, wakeWatcher.canonicalId),
    p2DrawWatcherId: objectId(p2, drawWatcher.canonicalId),
  };
}

function passCycle(runtime: GrandArchiveMatchRuntime) {
  for (let pass = 0; pass < 2; pass += 1) {
    const playerId = runtime.state.opportunity?.holderId;
    if (!playerId) throw new Error("Expected Opportunity while completing a pass cycle");
    const result = runtime.execute({ move: "pass" }, { playerId });
    if (!result.ok) throw new Error(result.message);
  }
}

describe("Grand Archive automatic phase sequencing", () => {
  it("observes turn end once at the first cleanup iteration", () => {
    const fixture = setup();
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.p1TurnEndsWatcherId,
        from: "main-deck",
        to: "field",
      },
      { type: "phase-changed", phase: "end" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);

    passCycle(runtime);
    expect(runtime.state.stack.at(-1)?.activationPhase).toBe("end");
    passCycle(runtime);
    expect(runtime.state.players[fixture.p1]?.states["observed-turn-end"]).toBe(true);
    passCycle(runtime);
    expect(runtime.state.turn.playerId).toBe(fixture.p2);
  });

  it("starts the second Standard player's first turn with Draw before Main", () => {
    const fixture = setup();
    const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
    expect(runtime.state.turn).toMatchObject({ playerId: fixture.p1, phase: "main" });
    expect(runtime.state.zones[fixture.p1].hand).toHaveLength(0);

    passCycle(runtime);
    expect(runtime.state.turn).toMatchObject({ playerId: fixture.p1, phase: "end" });
    const endEvents = [];
    for (let pass = 0; pass < 2; pass += 1) {
      const playerId = runtime.state.opportunity?.holderId;
      if (!playerId) throw new Error("Expected End phase Opportunity");
      const result = runtime.execute({ move: "pass" }, { playerId });
      if (!result.ok) throw new Error(result.message);
      endEvents.push(...result.events);
    }

    expect(runtime.state.turn).toMatchObject({ playerId: fixture.p2, phase: "main" });
    expect(runtime.state.zones[fixture.p2].hand).toHaveLength(1);
    expect(
      endEvents.flatMap((event) => (event.type === "phase-changed" ? [event.phase] : [])),
    ).toEqual(["draw", "main"]);
  });

  it("resolves cleanup-generated triggers in the End phase before starting the next turn", () => {
    const fixture = setup();
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.p1CleanupWatcherId,
        from: "main-deck",
        to: "field",
      },
      {
        type: "object-state-changed",
        objectId: fixture.p1CleanupWatcherId,
        state: "distant",
        value: true,
      },
      { type: "phase-changed", phase: "end" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);

    passCycle(runtime);
    expect(runtime.state.turn).toMatchObject({ playerId: fixture.p1, phase: "end" });
    expect(runtime.state.turn.cleanupPending).toBe(true);
    expect(runtime.state.stack.at(-1)?.activationPhase).toBe("end");

    passCycle(runtime);
    expect(runtime.state.players[fixture.p1]?.states["observed-end-cleanup"]).toBe(true);
    expect(runtime.state.turn.phase).toBe("end");
    passCycle(runtime);
    expect(runtime.state.turn).toMatchObject({ playerId: fixture.p2, phase: "main" });
  });

  it("resolves wake-generated triggers in the Wake Up phase before Materialize", () => {
    const fixture = setup();
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "player-first-turn-completed", playerId: fixture.p1 },
      { type: "player-first-turn-completed", playerId: fixture.p2 },
      {
        type: "object-moved",
        objectId: fixture.p2WakeWatcherId,
        from: "main-deck",
        to: "field",
      },
      {
        type: "object-state-changed",
        objectId: fixture.p2WakeWatcherId,
        state: "rested",
        value: true,
      },
      { type: "phase-changed", phase: "end" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);

    passCycle(runtime);
    expect(runtime.state.turn).toMatchObject({ playerId: fixture.p2, phase: "wake-up" });
    expect(runtime.state.stack.at(-1)?.activationPhase).toBe("wake-up");
    expect(runtime.state.opportunity?.holderId).toBe(fixture.p2);
    expect(
      runtime.state.eventHistory
        .filter(
          (event) =>
            event.type === "object-state-changed" &&
            event.cause?.kind === "rule" &&
            event.cause.rule === "wake-up-turn-based-action",
        )
        .map((event) => (event.type === "object-state-changed" ? event.objectId : undefined)),
    ).toEqual([fixture.p2WakeWatcherId]);

    passCycle(runtime);
    expect(runtime.state.players[fixture.p2]?.states["observed-wake-up"]).toBe(true);
    expect(runtime.state.turn.phase).toBe("wake-up");
    passCycle(runtime);
    expect(runtime.state.turn.phase).toBe("materialize");
  });

  it("resolves draw-generated triggers in the Draw phase before Main", () => {
    const fixture = setup();
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.p2DrawWatcherId,
        from: "main-deck",
        to: "field",
      },
      { type: "phase-changed", phase: "end" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared);

    passCycle(runtime);
    expect(runtime.state.turn).toMatchObject({ playerId: fixture.p2, phase: "draw" });
    expect(runtime.state.stack.at(-1)?.activationPhase).toBe("draw");

    passCycle(runtime);
    expect(runtime.state.players[fixture.p2]?.states["observed-draw"]).toBe(true);
    expect(runtime.state.turn.phase).toBe("draw");
    passCycle(runtime);
    expect(runtime.state.turn.phase).toBe("main");
  });
});
