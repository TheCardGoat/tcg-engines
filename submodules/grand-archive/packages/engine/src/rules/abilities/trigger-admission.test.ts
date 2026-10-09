import { flowerbud, trivialTrinket } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAbilityId,
  GrandArchiveAnyCard,
  GrandArchiveEffectTriggeredAbility,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";
import { collectGrandArchiveTriggeredAbilityEvents } from "./triggers.ts";

function card(
  id: string,
  type: "ACTION" | "CHAMPION" | "ITEM",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
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
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("trigger-admission-champion", "CHAMPION");
const filler = card("trigger-admission-filler", "ACTION");

function triggered(
  id: GrandArchiveAbilityId,
  trigger: GrandArchiveEffectTriggeredAbility["trigger"],
  limit?: GrandArchiveEffectTriggeredAbility["limit"],
): GrandArchiveAbilityDefinition {
  return {
    id,
    kind: "triggered",
    text: id,
    trigger,
    ...(limit ? { limit } : {}),
    effect: { kind: "draw", player: "controller", amount: 1 },
  };
}

function setup(abilities: readonly GrandArchiveAbilityDefinition[]) {
  const watcher = card("trigger-admission-watcher", "ITEM", abilities);
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    watcher,
    trivialTrinket,
    flowerbud,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 6 },
      ...(id === "p1" ? [{ definitionId: watcher.canonicalId, count: 1 }] : []),
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...(id === "p1" ? [{ definitionId: trivialTrinket.canonicalId, count: 1 }] : []),
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 121,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const owned = Object.values(initial.objects).filter((object) => object.ownerId === p1);
  const watcherId = owned.find((object) => object.definitionId === watcher.canonicalId)!.id;
  const fillerIds = owned
    .filter((object) => object.definitionId === filler.canonicalId)
    .map((object) => object.id);
  const kernel = new GrandArchiveTransactionKernel();
  const positioned = kernel.transact(initial, [
    {
      type: "object-moved",
      objectId: watcherId,
      from: initial.objects[watcherId]!.zone,
      to: "field",
    },
  ]).state;
  return { program, kernel, state: positioned, p1, p2, watcherId, fillerIds };
}

function pendingAbilityIds(
  events: ReturnType<typeof collectGrandArchiveTriggeredAbilityEvents>,
): readonly string[] {
  return events.flatMap((event) =>
    event.type === "pending-trigger-added" ? [event.trigger.ability.id] : [],
  );
}

describe("Grand Archive trigger occurrence admission", () => {
  for (const own of [false, true])
    for (const hosted of [false, true])
      for (const hostType of ["CHAMPION", "ITEM"] as const)
        it(`matches and binds the destination host: own=${own}, hosted=${hosted}, type=${hostType}`, () => {
          const fixture = setup([
            triggered("lineageHost-a1", {
              kind: "event",
              event: {
                name: "card-moved",
                to: hosted ? "inner-lineage" : "graveyard",
                host: {
                  kind: "event-object",
                  filter: { kind: "type", oneOf: [hostType] },
                  bindAs: "host",
                },
              },
            }),
          ]);
          const host = Object.values(fixture.state.objects).find(
            (object) =>
              object.definitionId === champion.canonicalId &&
              object.controllerId === (own ? fixture.p1 : fixture.p2),
          )!;
          const sourceId = fixture.fillerIds[0]!;
          const moved = fixture.kernel.transact(fixture.state, [
            {
              type: "object-moved",
              objectId: sourceId,
              from: fixture.state.objects[sourceId]!.zone,
              to: hosted ? "inner-lineage" : "graveyard",
              ...(hosted ? { hostId: host.id } : {}),
            },
          ]);
          const restored = restoreGrandArchiveMatchSnapshot(
            fixture.program,
            JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(moved.state))),
          );
          for (const state of [moved.state, restored]) {
            const triggers = collectGrandArchiveTriggeredAbilityEvents(
              fixture.program,
              state,
              moved.result.events,
            );
            expect(pendingAbilityIds(triggers)).toEqual(
              hosted && hostType === "CHAMPION" ? ["lineageHost-a1"] : [],
            );
            for (const event of triggers)
              if (event.type === "pending-trigger-added")
                expect(event.trigger.bindings.host).toEqual([host.id]);
          }
        });

  it("distinguishes each-event triggers from one-or-more game-event batches", () => {
    const fixture = setup([
      triggered("triggerEach-a1", {
        kind: "event",
        cardinality: "each-event",
        event: { name: "card-moved", from: "main-deck", to: "graveyard" },
      }),
      triggered("triggerGrouped-a1", {
        kind: "event",
        cardinality: "one-or-more",
        event: { name: "card-moved", from: "main-deck", to: "graveyard" },
      }),
    ]);
    const milled = executeGrandArchiveEffect(
      { kind: "mill", player: "controller", amount: 2 },
      {
        program: fixture.program,
        state: fixture.state,
        controllerId: fixture.p1,
        sourceId: fixture.watcherId,
        abilityBearerId: fixture.watcherId,
        bindings: {},
      },
      (state, events) => {
        const transaction = fixture.kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    const moved = milled.events.filter((event) => event.type === "object-moved");
    expect(new Set(moved.map((event) => event.eventId)).size).toBe(2);
    expect(new Set(moved.map((event) => event.gameEventId)).size).toBe(1);
    const abilityIds = pendingAbilityIds(
      collectGrandArchiveTriggeredAbilityEvents(fixture.program, milled.state, milled.events),
    );

    expect(abilityIds.filter((id) => id === "triggerEach-a1")).toHaveLength(2);
    expect(abilityIds.filter((id) => id === "triggerGrouped-a1")).toHaveLength(1);
  });

  it("admits each token entry separately while grouping one-or-more token entries", () => {
    const fixture = setup([
      triggered("tokenEach-a1", {
        kind: "event",
        cardinality: "each-event",
        event: { name: "object-entered-field" },
      }),
      triggered("tokenGrouped-a1", {
        kind: "event",
        cardinality: "one-or-more",
        event: { name: "object-entered-field" },
      }),
    ]);
    const summoned = executeGrandArchiveEffect(
      { kind: "summon", object: "Flowerbud", controller: "opponent", amount: 4 },
      {
        program: fixture.program,
        state: fixture.state,
        controllerId: fixture.p1,
        sourceId: fixture.watcherId,
        abilityBearerId: fixture.watcherId,
        bindings: {},
      },
      (state, events) => {
        const transaction = fixture.kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    expect(summoned.events.filter((event) => event.type === "tokens-summoned")).toHaveLength(1);
    const abilityIds = pendingAbilityIds(
      collectGrandArchiveTriggeredAbilityEvents(fixture.program, summoned.state, summoned.events),
    );
    expect(abilityIds.filter((id) => id === "tokenEach-a1")).toHaveLength(4);
    expect(abilityIds.filter((id) => id === "tokenGrouped-a1")).toHaveLength(1);
  });

  it("derives each discrete Trivial Trinket mill from the current top of the deck", () => {
    const fixture = setup([]);
    const face =
      trivialTrinket.layout.kind === "single-faced"
        ? trivialTrinket.layout.face
        : trivialTrinket.layout.defaultFace;
    const ability = face.abilities.find((candidate) => candidate.id === "Nym5Y3JsO5-a1");
    if (!ability || ability.kind !== "activated" || !ability.effect) {
      throw new Error("Missing Trivial Trinket mill ability");
    }
    const originalDeck = fixture.state.zones[fixture.p1]["main-deck"];
    const first = originalDeck[0];
    const last = originalDeck.at(-1);
    const penultimate = originalDeck.at(-2);
    if (!first || !last || !penultimate) throw new Error("Mill fixture deck is too small");

    let reordered = false;
    const result = executeGrandArchiveEffect(
      ability.effect,
      {
        program: fixture.program,
        state: fixture.state,
        controllerId: fixture.p1,
        sourceId: fixture.watcherId,
        abilityBearerId: fixture.watcherId,
        bindings: { "target-player": [fixture.p1] },
      },
      (state, events) => {
        const committed = fixture.kernel.transact(state, events);
        if (reordered || !events.some((event) => event.type === "object-moved")) {
          return { state: committed.state, events: committed.result.events };
        }
        reordered = true;
        const remaining = committed.state.zones[fixture.p1]["main-deck"];
        const changed = fixture.kernel.transact(committed.state, [
          {
            type: "zone-reordered",
            playerId: fixture.p1,
            zone: "main-deck",
            objectIds: [...remaining].reverse(),
            cause: { kind: "rule", rule: "test-fixture-order" },
          },
        ]);
        return {
          state: changed.state,
          events: [...committed.result.events, ...changed.result.events],
        };
      },
    );

    const milledIds = result.events.flatMap((event) =>
      event.type === "object-moved" &&
      event.cause?.kind === "rule" &&
      event.cause.rule === "mill-effect"
        ? [event.objectId]
        : [],
    );
    expect(milledIds).toEqual([first, last, penultimate]);
    expect(
      new Set(
        result.events.flatMap((event) =>
          event.type === "object-moved" &&
          event.cause?.kind === "rule" &&
          event.cause.rule === "mill-effect"
            ? [event.gameEventId]
            : [],
        ),
      ).size,
    ).toBe(1);

    expect(() =>
      executeGrandArchiveEffect(
        { kind: "mill", player: "controller", amount: -1 },
        {
          program: fixture.program,
          state: fixture.state,
          controllerId: fixture.p1,
          sourceId: fixture.watcherId,
          abilityBearerId: fixture.watcherId,
          bindings: {},
        },
        (state, events) => {
          const transaction = fixture.kernel.transact(state, events);
          return { state: transaction.state, events: transaction.result.events };
        },
      ),
    ).toThrow("mill amount must be a non-negative integer");
  });

  it("creates at most one trigger when one committed event has multiple matching observations", () => {
    const fixture = setup([
      triggered("triggerAnyObservation-a1", {
        kind: "event",
        event: {
          anyOf: [{ name: "card-moved", to: "field" }, { name: "object-entered-field" }],
        },
      }),
    ]);
    const entered = fixture.kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.fillerIds[0]!,
        from: "main-deck",
        to: "field",
      },
    ]);

    expect(
      pendingAbilityIds(
        collectGrandArchiveTriggeredAbilityEvents(
          fixture.program,
          entered.state,
          entered.result.events,
        ),
      ),
    ).toEqual(["triggerAnyObservation-a1"]);
  });

  it("persists a per-turn trigger-limit receipt and resets it on the next turn", () => {
    const fixture = setup([
      triggered(
        "triggerOncePerTurn-a1",
        { kind: "event", event: { name: "card-revealed", actor: "controller" } },
        { count: 1, per: "turn" },
      ),
    ]);
    const firstReveal = fixture.kernel.transact(fixture.state, [
      {
        type: "card-revealed",
        objectId: fixture.fillerIds[0]!,
        playerId: fixture.p1,
      },
      {
        type: "card-revealed",
        objectId: fixture.fillerIds[1]!,
        playerId: fixture.p1,
      },
    ]);
    const firstTriggers = collectGrandArchiveTriggeredAbilityEvents(
      fixture.program,
      firstReveal.state,
      firstReveal.result.events,
    );
    expect(pendingAbilityIds(firstTriggers)).toEqual(["triggerOncePerTurn-a1"]);
    const pending = fixture.kernel.transact(firstReveal.state, firstTriggers).state;
    expect(pending.pendingTriggers[0]?.triggerLimitUsageKey).toContain(
      `turn:${pending.turn.number}`,
    );
    const restored = restoreGrandArchiveMatchSnapshot(
      fixture.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(pending))),
    );

    const sameTurnReveal = fixture.kernel.transact(restored, [
      {
        type: "card-revealed",
        objectId: fixture.fillerIds[2]!,
        playerId: fixture.p1,
      },
    ]);
    expect(
      pendingAbilityIds(
        collectGrandArchiveTriggeredAbilityEvents(
          fixture.program,
          sameTurnReveal.state,
          sameTurnReveal.result.events,
        ),
      ),
    ).toEqual([]);

    const nextTurn = fixture.kernel.transact(sameTurnReveal.state, [
      {
        type: "turn-started",
        playerId: fixture.p2,
        turnNumber: sameTurnReveal.state.turn.number + 1,
      },
    ]).state;
    const nextTurnReveal = fixture.kernel.transact(nextTurn, [
      {
        type: "card-revealed",
        objectId: fixture.fillerIds[3]!,
        playerId: fixture.p1,
      },
    ]);
    expect(
      pendingAbilityIds(
        collectGrandArchiveTriggeredAbilityEvents(
          fixture.program,
          nextTurnReveal.state,
          nextTurnReveal.result.events,
        ),
      ),
    ).toEqual(["triggerOncePerTurn-a1"]);
  });

  it("reinstances a source-instance trigger limit after its source changes zones", () => {
    const fixture = setup([
      triggered(
        "triggerOncePerObject-a1",
        { kind: "event", event: { name: "card-revealed", actor: "controller" } },
        { count: 1, per: "source-instance" },
      ),
    ]);
    const reveal = fixture.kernel.transact(fixture.state, [
      {
        type: "card-revealed",
        objectId: fixture.fillerIds[0]!,
        playerId: fixture.p1,
      },
    ]);
    const firstTriggers = collectGrandArchiveTriggeredAbilityEvents(
      fixture.program,
      reveal.state,
      reveal.result.events,
    );
    const used = fixture.kernel.transact(reveal.state, firstTriggers).state;
    const oldUsageKey = used.pendingTriggers[0]?.triggerLimitUsageKey;
    const reentered = fixture.kernel.transact(used, [
      {
        type: "object-moved",
        objectId: fixture.watcherId,
        from: "field",
        to: "graveyard",
      },
      {
        type: "object-moved",
        objectId: fixture.watcherId,
        from: "graveyard",
        to: "field",
      },
    ]).state;
    const secondReveal = fixture.kernel.transact(reentered, [
      {
        type: "card-revealed",
        objectId: fixture.fillerIds[1]!,
        playerId: fixture.p1,
      },
    ]);
    const secondTriggers = collectGrandArchiveTriggeredAbilityEvents(
      fixture.program,
      secondReveal.state,
      secondReveal.result.events,
    );

    expect(pendingAbilityIds(secondTriggers)).toEqual(["triggerOncePerObject-a1"]);
    const secondUsageKey = secondTriggers.find((event) => event.type === "pending-trigger-added")
      ?.trigger.triggerLimitUsageKey;
    expect(secondUsageKey).not.toBe(oldUsageKey);
  });
});

import { GrandArchiveTestEngine } from "../../testing/test-engine.ts";

describe("Champion transition trigger discovery", () => {
  for (const nextLevel of [0, 1])
    for (const sameBaseLevel of [false, true]) {
      it(`uses the old face for leveling and the new face for entry: next=${nextLevel}, same=${sameBaseLevel}`, () => {
        const previous = card("previous-champion", "CHAMPION", [
          triggered("previous-champion-a1", {
            kind: "event",
            event: {
              name: "champion-leveled-up",
              actor: "controller",
              previousObject: { kind: "source" },
              sameBaseLevel,
            },
          }),
          triggered("previous-champion-a2", {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: { kind: "source" },
            },
          }),
        ]);
        const baseNext = card("next-champion", "CHAMPION", [
          triggered("next-champion-a1", {
            kind: "event",
            event: {
              name: "champion-leveled-up",
              actor: "controller",
              previousObject: { kind: "source" },
            },
          }),
          triggered("next-champion-a2", {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: { kind: "source" },
            },
          }),
        ]);
        if (baseNext.layout.kind !== "single-faced") throw new Error("Expected one fixture face");
        const next: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
          ...baseNext,
          layout: {
            kind: "single-faced",
            face: { ...baseNext.layout.face, stats: { level: nextLevel, life: 20 } },
          },
        };
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: { champion: previous, zones: { "material-deck": [next] } },
          playerTwo: { champion },
        });
        const p = game.player("player-one");
        const hero = p.card(previous),
          destination = p.card(next);
        const transitioned = new GrandArchiveTransactionKernel().transact(game.state, [
          {
            type: "champion-leveled-up",
            championId: hero.objectId,
            cardId: destination.objectId,
            actorId: p.id,
          },
        ]);
        const restored = restoreGrandArchiveMatchSnapshot(
          game.program,
          JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(transitioned.state))),
        );
        for (const state of [transitioned.state, restored]) {
          const ids = pendingAbilityIds(
            collectGrandArchiveTriggeredAbilityEvents(
              game.program,
              state,
              transitioned.result.events,
            ),
          );
          expect([...ids].sort()).toEqual(
            [
              "next-champion-a2",
              ...((nextLevel === 0) === sameBaseLevel ? ["previous-champion-a1"] : []),
            ].sort(),
          );
        }
      });
    }
});
