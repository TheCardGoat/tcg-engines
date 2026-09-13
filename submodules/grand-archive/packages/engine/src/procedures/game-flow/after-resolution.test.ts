import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "./initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveStackItem } from "../../game/model.ts";
import { GrandArchiveMatchRuntime } from "./runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "CHAMPION" | "ITEM",
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
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("after-resolution-champion", "CHAMPION");
const filler = card("after-resolution-filler", "ACTION");
const selfSchedulingAction = card("after-resolution-self", "ACTION", [
  {
    id: "afterResolutionSelf-a1",
    kind: "card-resolution",
    text: "Banish this card after it resolves.",
    effect: {
      kind: "after-resolution",
      stackItem: { kind: "source" },
      effect: { kind: "banish-object", subject: { kind: "source" } },
    },
  },
]);
const watchedAction = card("after-resolution-watched", "ACTION", [
  {
    id: "afterResolutionWatched-a1",
    kind: "card-resolution",
    text: "Resolve without an immediate effect.",
    effect: { kind: "no-op" },
  },
]);
const watcher = card("after-resolution-watcher", "ITEM", [
  {
    id: "afterResolutionWatcher-a1",
    kind: "triggered",
    text: "Whenever you activate a card, banish it after it resolves.",
    trigger: {
      kind: "event",
      event: { name: "card-activated", actor: "controller" },
    },
    effect: {
      kind: "after-resolution",
      stackItem: { kind: "event-subject" },
      effect: { kind: "banish-object", subject: { kind: "event-subject" } },
    },
  },
]);
const schedulingCopier = card("after-resolution-scheduling-copier", "ITEM", [
  {
    id: "afterResolutionSchedulingCopier-a1",
    kind: "triggered",
    text: "Whenever you activate a card, mark this item after that activation resolves.",
    trigger: {
      kind: "event",
      event: { name: "card-activated", actor: "controller" },
    },
    effect: {
      kind: "after-resolution",
      stackItem: { kind: "event-subject" },
      effect: {
        kind: "add-counter",
        subject: { kind: "source" },
        counter: { named: "resolved" },
        amount: 1,
      },
    },
  },
  {
    id: "afterResolutionSchedulingCopier-a2",
    kind: "triggered",
    text: "Whenever you activate a card, copy that activation.",
    trigger: {
      kind: "event",
      event: { name: "card-activated", actor: "controller" },
    },
    effect: {
      kind: "copy",
      subject: { kind: "event-subject" },
      copy: "card-activation",
    },
  },
]);

function setup(includeWatcher = true): {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly runtime: GrandArchiveMatchRuntime;
  readonly selfId: GrandArchiveObjectId;
  readonly watchedId: GrandArchiveObjectId;
  readonly watcherId: GrandArchiveObjectId;
  readonly schedulingCopierId: GrandArchiveObjectId;
} {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    selfSchedulingAction,
    watchedAction,
    watcher,
    schedulingCopier,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: selfSchedulingAction.canonicalId, count: 1 },
      { definitionId: watchedAction.canonicalId, count: 1 },
      { definitionId: watcher.canonicalId, count: 1 },
      { definitionId: schedulingCopier.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 5 },
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
      randomSeed: 729,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const objectId = (definitionId: string): GrandArchiveObjectId => {
    const object = Object.values(initial.objects).find(
      (candidate) => candidate.ownerId === p1 && candidate.definitionId === definitionId,
    );
    if (!object) throw new Error(`Missing ${definitionId}`);
    return object.id;
  };
  const selfId = objectId(selfSchedulingAction.canonicalId);
  const watchedId = objectId(watchedAction.canonicalId);
  const watcherId = objectId(watcher.canonicalId);
  const schedulingCopierId = objectId(schedulingCopier.canonicalId);
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    {
      type: "object-moved",
      objectId: selfId,
      from: initial.objects[selfId]!.zone,
      to: "hand",
    },
    {
      type: "object-moved",
      objectId: watchedId,
      from: initial.objects[watchedId]!.zone,
      to: "hand",
    },
    ...(includeWatcher
      ? [
          {
            type: "object-moved" as const,
            objectId: watcherId,
            from: initial.objects[watcherId]!.zone,
            to: "field" as const,
          },
        ]
      : []),
  ]).state;
  return {
    program,
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    selfId,
    watchedId,
    watcherId,
    schedulingCopierId,
  };
}

function passPriority(runtime: GrandArchiveMatchRuntime) {
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
  const result = runtime.execute({ move: "pass" }, { playerId: p2 });
  if (!result.ok) throw new Error(result.message);
  return result;
}

function watchedStackItem(runtime: GrandArchiveMatchRuntime, watchedId: GrandArchiveObjectId) {
  const item = runtime.state.stack.find(
    (candidate): candidate is GrandArchiveStackItem & { readonly cardId: GrandArchiveObjectId } =>
      (candidate.kind === "card-activation" ||
        candidate.kind === "materialization" ||
        candidate.kind === "bestowment") &&
      candidate.cardId === watchedId,
  );
  if (!item) throw new Error("Expected watched activation");
  return item;
}

describe("Grand Archive after-resolution effects", () => {
  it("runs a self-scheduled consequence after default card disposition without a response gap", () => {
    const fixture = setup(false);
    const p1 = grandArchivePlayerId("p1");
    expect(
      fixture.runtime.execute({ move: "activate-card", cardId: fixture.selfId }, { playerId: p1 })
        .ok,
    ).toBe(true);
    const result = passPriority(fixture.runtime);

    expect(fixture.runtime.state.objects[fixture.selfId]?.zone).toBe("banishment");
    const moves = result.events.filter(
      (event) => event.type === "object-moved" && event.objectId === fixture.selfId,
    );
    expect(
      moves.map((event) => (event.type === "object-moved" ? [event.from, event.to] : [])),
    ).toEqual([
      ["effects-stack", "graveyard"],
      ["graveyard", "banishment"],
    ]);
  });

  it("captures the triggering stack item and bindings across a snapshot", () => {
    const fixture = setup();
    const p1 = grandArchivePlayerId("p1");
    expect(
      fixture.runtime.execute(
        { move: "activate-card", cardId: fixture.watchedId },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    passPriority(fixture.runtime);

    const target = watchedStackItem(fixture.runtime, fixture.watchedId);
    expect(target.scheduledAfterResolutionItems).toHaveLength(1);
    expect(fixture.runtime.state.objects[fixture.watchedId]?.zone).toBe("effects-stack");
    const restored = new GrandArchiveMatchRuntime(
      fixture.program,
      restoreGrandArchiveMatchSnapshot(
        fixture.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(fixture.runtime.state))),
      ),
    );
    const result = passPriority(restored);

    expect(restored.state.objects[fixture.watchedId]).toMatchObject({
      zone: "banishment",
      banishedBySourceId: fixture.watcherId,
    });
    expect(result.events.some((event) => event.type === "opportunity-opened")).toBe(true);
    const firstOpportunity = result.events.findIndex(
      (event) => event.type === "opportunity-opened",
    );
    const banished = result.events.findIndex(
      (event) =>
        event.type === "object-moved" &&
        event.objectId === fixture.watchedId &&
        event.to === "banishment",
    );
    expect(banished).toBeGreaterThanOrEqual(0);
    expect(firstOpportunity).toBeGreaterThan(banished);
  });

  it("does not run a scheduled consequence when its target activation fizzles", () => {
    const fixture = setup();
    const p1 = grandArchivePlayerId("p1");
    expect(
      fixture.runtime.execute(
        { move: "activate-card", cardId: fixture.watchedId },
        { playerId: p1 },
      ).ok,
    ).toBe(true);
    passPriority(fixture.runtime);
    const target = watchedStackItem(fixture.runtime, fixture.watchedId);
    const negated = new GrandArchiveTransactionKernel().transact(fixture.runtime.state, [
      {
        type: "stack-item-negated",
        item: { ...target, negated: true },
        actorId: grandArchivePlayerId("p2"),
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, negated);
    passPriority(runtime);

    expect(runtime.state.objects[fixture.watchedId]?.zone).toBe("graveyard");
    expect(runtime.state.stack).toHaveLength(0);
  });

  it("does not copy external consequences scheduled for the original activation", () => {
    const fixture = setup(false);
    const p1 = grandArchivePlayerId("p1");
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.runtime.state, [
      {
        type: "object-moved",
        objectId: fixture.schedulingCopierId,
        from: fixture.runtime.state.objects[fixture.schedulingCopierId]!.zone,
        to: "field",
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, positioned);

    expect(
      runtime.execute({ move: "activate-card", cardId: fixture.watchedId }, { playerId: p1 }).ok,
    ).toBe(true);
    const ordering = runtime.state.decision;
    if (!ordering || ordering.kind !== "order-triggered-abilities") {
      throw new Error("Expected simultaneous scheduler and copier triggers");
    }
    const scheduler = runtime.state.pendingTriggers.find(
      (trigger) => trigger.ability.id === "afterResolutionSchedulingCopier-a1",
    );
    const copier = runtime.state.pendingTriggers.find(
      (trigger) => trigger.ability.id === "afterResolutionSchedulingCopier-a2",
    );
    if (!scheduler || !copier) throw new Error("Expected both scheduling copier triggers");
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: ordering.id,
          stateVersion: ordering.stateVersion,
          // The last item enters last and resolves first: schedule, then copy.
          answer: [copier.id, scheduler.id],
        },
        { playerId: p1 },
      ).ok,
    ).toBe(true);

    passPriority(runtime);
    expect(watchedStackItem(runtime, fixture.watchedId).scheduledAfterResolutionItems).toHaveLength(
      1,
    );
    passPriority(runtime);
    const copy = runtime.state.stack.at(-1);
    expect(copy).toMatchObject({ kind: "card-activation", isCopy: true });
    expect(copy?.scheduledAfterResolutionItems).toBeUndefined();

    passPriority(runtime);
    expect(
      runtime.state.objects[fixture.schedulingCopierId]?.counters["named:resolved"],
    ).toBeUndefined();
    passPriority(runtime);
    expect(runtime.state.objects[fixture.schedulingCopierId]?.counters["named:resolved"]).toBe(1);
    expect(runtime.state.stack).toHaveLength(0);
  });
});
