import { hairpinOfTransience, wildheartLyre } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import {
  grandArchivePlayerId,
  type GrandArchiveObjectId,
  type GrandArchivePlayerId,
} from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";
import { collectGrandArchiveTriggeredAbilityEvents } from "./triggers.ts";

const WITHERED_OBJECT_BINDING = "game:withered-object";

function card(
  canonicalId: string,
  type: "ACTION" | "CHAMPION",
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
          classes: ["CLERIC", "TAMER"],
          subtypes: [],
        },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("wither-test-champion", "CHAMPION");
const filler = card("wither-test-filler", "ACTION");

interface WitherFixture {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly runtime: GrandArchiveMatchRuntime;
  readonly p1: GrandArchivePlayerId;
  readonly p2: GrandArchivePlayerId;
  readonly p1ChampionId: GrandArchiveObjectId;
  readonly p2ChampionId: GrandArchiveObjectId;
  readonly hairpinId: GrandArchiveObjectId;
  readonly lyreId: GrandArchiveObjectId;
  readonly paymentIds: readonly GrandArchiveObjectId[];
}

function objectId(
  state: GrandArchiveMatchState,
  definitionId: string,
  ownerId?: GrandArchivePlayerId,
): GrandArchiveObjectId {
  const object = Object.values(state.objects).find(
    (candidate) =>
      candidate.definitionId === definitionId &&
      (ownerId === undefined || candidate.ownerId === ownerId),
  );
  if (!object) throw new Error(`Missing Wither fixture object ${definitionId}`);
  return object.id;
}

function setup(hairpinCounters = 2, lyreCounters = 1): WitherFixture {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    hairpinOfTransience,
    wildheartLyre,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [{ definitionId: filler.canonicalId, count: 12 }],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...(id === "p1"
        ? [
            { definitionId: hairpinOfTransience.canonicalId, count: 1 },
            { definitionId: wildheartLyre.canonicalId, count: 1 },
          ]
        : []),
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 487,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const hairpinId = objectId(initial, hairpinOfTransience.canonicalId, p1);
  const lyreId = objectId(initial, wildheartLyre.canonicalId, p1);
  const paymentIds = Object.values(initial.objects)
    .filter((object) => object.ownerId === p1 && object.definitionId === filler.canonicalId)
    .slice(0, 5)
    .map((object) => object.id);
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    ...(initial.opportunity ? ([{ type: "opportunity-closed" }] as const) : []),
    ...paymentIds.flatMap((paymentId) => {
      const object = initial.objects[paymentId]!;
      return object.zone === "hand"
        ? []
        : ([{ type: "object-moved", objectId: paymentId, from: object.zone, to: "hand" }] as const);
    }),
    {
      type: "object-moved",
      objectId: hairpinId,
      from: initial.objects[hairpinId]!.zone,
      to: "field",
    },
    {
      type: "object-moved",
      objectId: lyreId,
      from: initial.objects[lyreId]!.zone,
      to: "field",
    },
    { type: "counter-changed", objectId: hairpinId, counter: "wither", delta: hairpinCounters },
    { type: "counter-changed", objectId: lyreId, counter: "wither", delta: lyreCounters },
    { type: "phase-changed", phase: "materialize", materializeKind: "regular" },
  ]).state;
  return {
    program,
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    p1,
    p2,
    p1ChampionId: objectId(prepared, champion.canonicalId, p1),
    p2ChampionId: objectId(prepared, champion.canonicalId, p2),
    hairpinId,
    lyreId,
    paymentIds,
  };
}

function passUntil(
  runtime: GrandArchiveMatchRuntime,
  predicate: (state: GrandArchiveMatchState) => boolean,
): void {
  for (let step = 0; step < 20 && !predicate(runtime.state); step += 1) {
    const holderId = runtime.state.opportunity?.holderId;
    if (!holderId) throw new Error("Expected an Opportunity while advancing Wither");
    const result = runtime.execute({ move: "pass" }, { playerId: holderId });
    if (!result.ok) throw new Error(result.message);
  }
  if (!predicate(runtime.state)) throw new Error("Wither did not reach the expected state");
}

function answer(runtime: GrandArchiveMatchRuntime, answerValue: unknown) {
  const decision = runtime.state.decision;
  if (!decision) throw new Error("Expected a Wither decision");
  return runtime.execute(
    {
      move: "answer-decision",
      decisionId: decision.id,
      stateVersion: decision.stateVersion,
      answer: answerValue,
    },
    { playerId: decision.playerId },
  );
}

function enterMainAndResolveToPayment(fixture: WitherFixture): void {
  const skipped = fixture.runtime.execute(
    { move: "skip-materialization" },
    { playerId: fixture.p1 },
  );
  if (!skipped.ok) throw new Error(skipped.message);
  passUntil(fixture.runtime, (state) =>
    state.stack.some((item) => item.gameSource?.name === "wither"),
  );
  passUntil(fixture.runtime, (state) => state.decision?.kind === "resolve-effect-payment");
}

function currentWitheredObject(runtime: GrandArchiveMatchRuntime): GrandArchiveObjectId {
  const binding = runtime.state.resolution?.bindings[WITHERED_OBJECT_BINDING];
  if (!Array.isArray(binding) || binding.length !== 1) {
    throw new Error("Wither payment does not bind exactly one object");
  }
  const object = Object.values(runtime.state.objects).find(
    (candidate) => candidate.id === binding[0],
  );
  if (!object) throw new Error("Wither payment binding does not identify an object");
  return object.id;
}

describe("Grand Archive Wither game-sourced trigger", () => {
  it("creates one serializable game-sourced trigger for every affected object", () => {
    const fixture = setup();
    const skipped = fixture.runtime.execute(
      { move: "skip-materialization" },
      { playerId: fixture.p1 },
    );
    if (!skipped.ok) throw new Error(skipped.message);
    passUntil(fixture.runtime, (state) =>
      state.stack.some((item) => item.gameSource?.name === "wither"),
    );

    const witherItems = fixture.runtime.state.stack.filter(
      (item) => item.gameSource?.name === "wither",
    );
    expect(witherItems).toHaveLength(1);
    expect(witherItems[0]).toMatchObject({
      kind: "triggered-ability",
      controllerId: fixture.p1,
      gameSource: { name: "wither" },
      ability: { id: "game:wither-a1" },
    });
    expect(witherItems[0]?.sourceId).toBeUndefined();

    const restored = restoreGrandArchiveMatchSnapshot(
      fixture.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(fixture.runtime.state))),
    );
    expect(restored.stack.find((item) => item.gameSource?.name === "wither")).toEqual(
      witherItems[0],
    );
  });

  it("requires each reserve payment in full and removes surviving counters atomically", () => {
    const fixture = setup();
    enterMainAndResolveToPayment(fixture);
    let paymentCursor = 0;
    let partialPaymentRejected = false;

    while (fixture.runtime.state.decision?.kind === "resolve-effect-payment") {
      const objectId = currentWitheredObject(fixture.runtime);
      const amount = fixture.runtime.state.objects[objectId]?.counters.wither ?? 0;
      if (amount === 2 && !partialPaymentRejected) {
        const decisionBefore = fixture.runtime.state.decision;
        const invalid = answer(fixture.runtime, {
          reservePayment: [{ kind: "card", cardId: fixture.paymentIds[paymentCursor]! }],
        });
        expect(invalid.ok).toBe(false);
        expect(fixture.runtime.state.decision).toEqual(decisionBefore);
        partialPaymentRejected = true;
      }
      const payment = fixture.paymentIds.slice(paymentCursor, paymentCursor + amount);
      paymentCursor += amount;
      const paid = answer(fixture.runtime, {
        reservePayment: payment.map((cardId) => ({ kind: "card" as const, cardId })),
      });
      if (!paid.ok) throw new Error(paid.message);
    }

    expect(partialPaymentRejected).toBe(true);
    expect(fixture.runtime.state.decision?.kind).toBe("resolve-counter-allocation");
    const removed = answer(fixture.runtime, {
      allocations: [
        { objectId: fixture.hairpinId, amount: 2 },
        { objectId: fixture.lyreId, amount: 1 },
      ],
    });
    if (!removed.ok) throw new Error(removed.message);

    const removals = removed.events.flatMap((event) =>
      event.type === "counter-changed" && event.counter === "wither" && event.delta < 0
        ? [[event.objectId, event.delta] as const]
        : [],
    );
    expect(removals).toEqual([
      [fixture.hairpinId, -2],
      [fixture.lyreId, -1],
    ]);
    expect(fixture.runtime.state.objects[fixture.hairpinId]?.counters.wither ?? 0).toBe(0);
    expect(fixture.runtime.state.objects[fixture.lyreId]?.counters.wither ?? 0).toBe(0);
  });

  it("sacrifices a declined object and does not trigger again when combat returns to Main", () => {
    const fixture = setup(1, 1);
    enterMainAndResolveToPayment(fixture);
    let paymentUsed = false;

    while (fixture.runtime.state.decision?.kind === "resolve-effect-payment") {
      const objectId = currentWitheredObject(fixture.runtime);
      const result =
        objectId === fixture.hairpinId
          ? answer(fixture.runtime, false)
          : answer(fixture.runtime, {
              reservePayment: [{ kind: "card", cardId: fixture.paymentIds[paymentUsed ? 1 : 0]! }],
            });
      if (!result.ok) throw new Error(result.message);
      if (objectId !== fixture.hairpinId) paymentUsed = true;
    }

    expect(fixture.runtime.state.objects[fixture.hairpinId]?.zone).toBe("banishment");
    expect(fixture.runtime.state.decision?.kind).toBe("resolve-counter-allocation");
    const removed = answer(fixture.runtime, {
      allocations: [{ objectId: fixture.lyreId, amount: 1 }],
    });
    if (!removed.ok) throw new Error(removed.message);

    const kernel = new GrandArchiveTransactionKernel();
    const returnedToMain = kernel.transact(fixture.runtime.state, [
      ...(fixture.runtime.state.opportunity ? ([{ type: "opportunity-closed" }] as const) : []),
      {
        type: "combat-started",
        combat: {
          attackerId: fixture.p1ChampionId,
          attackingPlayerId: fixture.p1,
          defendingPlayerIds: [fixture.p2],
          targetIds: [fixture.p2ChampionId],
          retaliatorIds: [],
          retaliationOrderConfirmed: true,
          weaponIds: [],
          intentIds: [],
          step: "end",
        },
      },
      { type: "counter-changed", objectId: fixture.lyreId, counter: "wither", delta: 1 },
      { type: "combat-ended" },
    ]);
    const triggerEvents = collectGrandArchiveTriggeredAbilityEvents(
      fixture.program,
      returnedToMain.state,
      returnedToMain.result.events,
    );
    expect(
      triggerEvents.some(
        (event) =>
          event.type === "pending-trigger-added" && event.trigger.gameSource?.name === "wither",
      ),
    ).toBe(false);
    expect(returnedToMain.state.turn.phase).toBe("main");
    expect(returnedToMain.state.objects[fixture.lyreId]?.counters.wither).toBe(1);
  });
});
