import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { pantheonBarrier } from "@tcg/grand-archive-cards";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId, grandArchiveStackItemId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchivePantheonPlayerSetup,
  type GrandArchiveStandardPlayerSetup,
} from "./initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveStackItem } from "../../game/model.ts";
import { observeGrandArchiveCommittedEvent } from "../../kernel/observed-events.ts";
import { GrandArchiveMatchRuntime } from "./runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";
import { collectGrandArchiveStateBasedEvents } from "../../rules/state/state-based.ts";
import { collectGrandArchiveTriggeredAbilityEvents } from "../../rules/abilities/triggers.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "CHAMPION" | "GREATER BOON" | "LESSER BOON" | "PHANTASIA",
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
        abilities: [],
      },
    },
  };
}

const champion = card("game-ending-champion", "CHAMPION");
const filler = card("game-ending-filler", "ACTION");
const lesserBoon = card("game-ending-lesser-boon", "LESSER BOON");
const greaterBoon = card("game-ending-greater-boon", "GREATER BOON");
const barrier = pantheonBarrier;
const lossWatcher: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "game-ending-loss-watcher",
  slug: "game-ending-loss-watcher",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "game-ending-loss-watcher:face:default",
      catalogId: "game-ending-loss-watcher",
      name: "Game Ending Loss Watcher",
      cost: { kind: "reserve", amount: 0 },
      typeLine: { supertypes: [], types: ["ALLY"], classes: ["MAGE"], subtypes: [] },
      elements: ["NORM"],
      stats: { power: 1, life: 1 },
      rulesText: "Whenever an object leaves the field, remember it.",
      abilities: [
        {
          id: "game-ending-loss-watcher-a1",
          kind: "triggered",
          text: "Whenever an object leaves the field, remember it.",
          trigger: { kind: "event", event: { name: "object-left-field" } },
          effect: {
            kind: "set-player-state",
            player: "controller",
            state: { named: "observed-player-loss-departure" },
            value: true,
          },
        },
      ],
    },
  },
};

function setup(playerCount: 2 | 3 = 2) {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    lesserBoon,
    greaterBoon,
    barrier,
    lossWatcher,
  ]);
  const player = (id: string): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 8 },
      { definitionId: lossWatcher.canonicalId, count: 1 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const pantheonPlayer = (id: string): GrandArchivePantheonPlayerSetup => ({
    ...player(id),
    sideboard: undefined,
    pantheon: {
      lesserBoonDefinitionId: lesserBoon.canonicalId,
      greaterBoonDefinitionId: greaterBoon.canonicalId,
      barrierDefinitionId: barrier.canonicalId,
    },
  });
  const input =
    playerCount === 2
      ? {
          mode: "standard" as const,
          players: [player("p1"), player("p2")] as const,
          firstPlayerId: "p1",
          randomSeed: 719,
        }
      : {
          mode: "pantheon" as const,
          players: [pantheonPlayer("p1"), pantheonPlayer("p2"), pantheonPlayer("p3")] as const,
          firstPlayerId: "p1",
          randomSeed: 719,
        };
  const state = createGrandArchiveMatchInitialState(program, input, {
    validateDeckConstruction: false,
    skipPregameForTests: true,
  });
  const ids = playerCount === 2 ? ["p1", "p2"] : ["p1", "p2", "p3"];
  return { program, state, ids: ids.map(grandArchivePlayerId) };
}

function championId(
  state: ReturnType<typeof setup>["state"],
  playerId: ReturnType<typeof grandArchivePlayerId>,
) {
  const objectId = state.zones[playerId].field.find(
    (candidateId) => state.objects[candidateId]?.definitionId === champion.canonicalId,
  );
  if (!objectId) throw new Error(`Missing champion for ${playerId}`);
  return objectId;
}

describe("Grand Archive game-ending state checks", () => {
  it("makes a player lose after their previously controlled champion leaves the field", () => {
    const fixture = setup();
    const [p1, p2] = fixture.ids;
    if (!p1 || !p2) throw new Error("Expected two players");
    const withoutChampion = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: championId(fixture.state, p1),
        from: "field",
        to: "banishment",
      },
    ]).state;

    expect(collectGrandArchiveStateBasedEvents(fixture.program, withoutChampion)).toEqual([
      expect.objectContaining({
        type: "player-lost",
        playerId: p1,
        reason: "champion-absent",
      }),
      expect.objectContaining({ type: "match-finished", winnerIds: [p2] }),
    ]);
  });

  it("ends in a draw when all remaining players lose champion control simultaneously", () => {
    const fixture = setup();
    const [p1, p2] = fixture.ids;
    if (!p1 || !p2) throw new Error("Expected two players");
    const withoutChampions = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: championId(fixture.state, p1),
        from: "field",
        to: "banishment",
      },
      {
        type: "object-moved",
        objectId: championId(fixture.state, p2),
        from: "field",
        to: "banishment",
      },
    ]).state;
    const events = collectGrandArchiveStateBasedEvents(fixture.program, withoutChampions);

    expect(events.filter((event) => event.type === "player-lost")).toHaveLength(2);
    expect(events.at(-1)).toEqual(
      expect.objectContaining({ type: "match-finished", winnerIds: [] }),
    );
  });

  it("continues a multiplayer game while more than one player remains", () => {
    const fixture = setup(3);
    const [p1] = fixture.ids;
    if (!p1) throw new Error("Expected the first player");
    const withoutChampion = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: championId(fixture.state, p1),
        from: "field",
        to: "banishment",
      },
    ]).state;
    const events = collectGrandArchiveStateBasedEvents(fixture.program, withoutChampion);

    expect(events).toEqual([
      expect.objectContaining({
        type: "player-lost",
        playerId: p1,
        reason: "champion-absent",
      }),
    ]);
  });

  it("makes a player lose when they would win and lose simultaneously", () => {
    const fixture = setup();
    const [p1, p2] = fixture.ids;
    if (!p1 || !p2) throw new Error("Expected two players");
    const simultaneous = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "player-lost", playerId: p1, reason: "effect" },
      { type: "game-outcome-declared", outcome: { kind: "wins", playerIds: [p1] } },
    ]).state;

    expect(collectGrandArchiveStateBasedEvents(fixture.program, simultaneous)).toEqual([
      expect.objectContaining({ type: "match-finished", winnerIds: [p2] }),
    ]);
  });

  it("honors an explicit draw even when a player loses simultaneously", () => {
    const fixture = setup();
    const [p1] = fixture.ids;
    if (!p1) throw new Error("Expected the first player");
    const simultaneous = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "player-lost", playerId: p1, reason: "effect" },
      { type: "game-outcome-declared", outcome: { kind: "draw" } },
    ]).state;

    expect(collectGrandArchiveStateBasedEvents(fixture.program, simultaneous)).toEqual([
      expect.objectContaining({ type: "match-finished", winnerIds: [] }),
    ]);
  });

  it("draws when all remaining players are declared winners simultaneously", () => {
    const fixture = setup(3);
    const declared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "game-outcome-declared",
        outcome: { kind: "wins", playerIds: fixture.ids },
      },
    ]).state;
    const restored = restoreGrandArchiveMatchSnapshot(
      fixture.program,
      serializeGrandArchiveMatchSnapshot(declared),
    );
    expect(restored.pendingGameOutcome).toEqual({ kind: "wins", playerIds: fixture.ids });

    expect(collectGrandArchiveStateBasedEvents(fixture.program, restored)).toEqual([
      expect.objectContaining({ type: "match-finished", winnerIds: [] }),
    ]);
  });

  it("removes a losing player's owned objects and emits only leave-field observations", () => {
    const fixture = setup(3);
    const [p1, , p3] = fixture.ids;
    if (!p1 || !p3) throw new Error("Expected three players");
    const watcherIds = Object.values(fixture.state.objects).filter(
      (object) => object.definitionId === lossWatcher.canonicalId,
    );
    const p1Watcher = watcherIds.find((object) => object.ownerId === p1);
    const p3Watcher = watcherIds.find((object) => object.ownerId === p3);
    if (!p1Watcher || !p3Watcher) throw new Error("Missing loss watchers");
    const staged = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: p1Watcher.id, from: p1Watcher.zone, to: "field" },
      { type: "object-moved", objectId: p3Watcher.id, from: p3Watcher.zone, to: "field" },
      { type: "player-lost", playerId: p1, reason: "effect" },
    ]).state;
    const cleanupEvents = collectGrandArchiveStateBasedEvents(fixture.program, staged);
    expect(cleanupEvents.length).toBeGreaterThan(0);
    expect(cleanupEvents.every((event) => event.type === "object-removed-from-game")).toBe(true);

    const cleanup = new GrandArchiveTransactionKernel().transact(staged, cleanupEvents);
    expect(Object.values(cleanup.state.objects).some((object) => object.ownerId === p1)).toBe(
      false,
    );
    const observations = cleanup.result.events.flatMap(observeGrandArchiveCommittedEvent);
    const removedChampion = cleanup.result.events.find(
      (event) =>
        event.type === "object-removed-from-game" &&
        event.object.id === championId(fixture.state, p1),
    );
    expect(removedChampion).toMatchObject({ leftFieldAsChampion: true });
    if (!removedChampion) throw new Error("Missing removed Champion event");
    expect(
      observeGrandArchiveCommittedEvent(removedChampion).some(
        (event) => event.name === "object-left-field",
      ),
    ).toBe(false);
    expect(observations.some((event) => event.name === "object-left-field")).toBe(true);
    expect(observations.some((event) => event.name === "object-destroyed")).toBe(false);
    expect(observations.some((event) => event.name === "object-died")).toBe(false);

    const triggerEvents = collectGrandArchiveTriggeredAbilityEvents(
      fixture.program,
      cleanup.state,
      cleanup.result.events,
    );
    expect(
      triggerEvents.some(
        (event) =>
          event.type === "pending-trigger-added" && event.trigger.sourceId === p3Watcher.id,
      ),
    ).toBe(true);
    const restored = restoreGrandArchiveMatchSnapshot(
      fixture.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(cleanup.state))),
    );
    expect(Object.values(restored.objects).some((object) => object.ownerId === p1)).toBe(false);
    expect(
      restored.eventHistory.some(
        (event) => event.type === "object-removed-from-game" && event.object.ownerId === p1,
      ),
    ).toBe(true);
    expect(collectGrandArchiveStateBasedEvents(fixture.program, cleanup.state)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "phase-changed", phase: "end" }),
        expect.objectContaining({
          type: "opportunity-opened",
          window: expect.objectContaining({ holderId: grandArchivePlayerId("p2") }),
        }),
      ]),
    );
  });

  it("returns foreign objects to their previous active controller", () => {
    const fixture = setup(3);
    const [p1, p2, p3] = fixture.ids;
    if (!p1 || !p2 || !p3) throw new Error("Expected three players");
    const foreign = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === lossWatcher.canonicalId,
    );
    if (!foreign) throw new Error("Missing foreign object");
    const staged = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: foreign.id, from: foreign.zone, to: "field" },
      { type: "object-controller-changed", objectId: foreign.id, controllerId: p3 },
      { type: "object-controller-changed", objectId: foreign.id, controllerId: p1 },
      { type: "player-lost", playerId: p1, reason: "effect" },
    ]).state;
    const cleanupEvents = collectGrandArchiveStateBasedEvents(fixture.program, staged);
    expect(cleanupEvents).toContainEqual(
      expect.objectContaining({
        type: "object-controller-changed",
        objectId: foreign.id,
        controllerId: p3,
      }),
    );
    const cleaned = new GrandArchiveTransactionKernel().transact(staged, cleanupEvents).state;
    expect(cleaned.objects[foreign.id]).toMatchObject({ ownerId: p2, controllerId: p3 });
  });

  it("preserves a losing player's pending card source until its stack item leaves", () => {
    const fixture = setup(3);
    const [p1] = fixture.ids;
    if (!p1) throw new Error("Expected the first player");
    const cardObject = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === filler.canonicalId,
    );
    if (!cardObject) throw new Error("Missing pending card");
    const item: GrandArchiveStackItem = {
      id: grandArchiveStackItemId("stack-player-loss-pending"),
      kind: "card-activation",
      controllerId: p1,
      sourceId: cardObject.id,
      cardId: cardObject.id,
      originZone: cardObject.zone,
      paidCostKind: "reserve",
      elysianAuraActiveAtAnnouncement: false,
      announcedCardResolutionAbilities: [],
      selectedModeIds: [],
      targets: [],
      createdAtVersion: fixture.state.stateVersion,
      activationPhase: fixture.state.turn.phase,
      isCopy: false,
      negated: false,
      opportunityPolicy: "normal",
      activationStates: [],
      activationPayment: [],
      championLevelModifier: 0,
      variables: {},
      bindings: {},
    };
    const staged = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: cardObject.id,
        from: cardObject.zone,
        to: "effects-stack",
      },
      { type: "stack-item-added", item },
      { type: "player-lost", playerId: p1, reason: "effect" },
    ]).state;
    const cleanupEvents = collectGrandArchiveStateBasedEvents(fixture.program, staged);
    const cleaned = new GrandArchiveTransactionKernel().transact(staged, cleanupEvents).state;
    expect(cleaned.objects[cardObject.id]?.zone).toBe("effects-stack");
    expect(collectGrandArchiveStateBasedEvents(fixture.program, cleaned)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: "opportunity-closed" }),
        expect.objectContaining({
          type: "opportunity-opened",
          window: expect.objectContaining({ holderId: grandArchivePlayerId("p2") }),
        }),
      ]),
    );

    const withoutStackItem = new GrandArchiveTransactionKernel().transact(cleaned, [
      { type: "stack-item-removed", itemId: item.id, outcome: "resolved" },
    ]).state;
    const finalCleanup = collectGrandArchiveStateBasedEvents(fixture.program, withoutStackItem);
    expect(finalCleanup).toContainEqual(
      expect.objectContaining({
        type: "object-removed-from-game",
        object: expect.objectContaining({ id: cardObject.id }),
      }),
    );
  });

  it("stabilizes multiplayer concession cleanup through the command runtime", () => {
    const fixture = setup(3);
    const [p1, p2, p3] = fixture.ids;
    if (!p1 || !p2 || !p3) throw new Error("Expected three players");
    const p1Watcher = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === lossWatcher.canonicalId,
    );
    const p2Watcher = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === lossWatcher.canonicalId,
    );
    const p3Watcher = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === p3 && object.definitionId === lossWatcher.canonicalId,
    );
    if (!p1Watcher || !p2Watcher || !p3Watcher) throw new Error("Missing runtime watchers");
    const staged = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: p1Watcher.id, from: p1Watcher.zone, to: "field" },
      { type: "object-moved", objectId: p2Watcher.id, from: p2Watcher.zone, to: "field" },
      { type: "object-moved", objectId: p3Watcher.id, from: p3Watcher.zone, to: "field" },
      { type: "object-controller-changed", objectId: p2Watcher.id, controllerId: p1 },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, staged);
    const result = runtime.execute({ move: "concede" }, { playerId: p1 });
    if (!result.ok) throw new Error(result.message);

    expect(runtime.state.status).toBe("playing");
    expect(runtime.state.players[p1]?.lost).toBe(true);
    expect(Object.values(runtime.state.objects).some((object) => object.ownerId === p1)).toBe(
      false,
    );
    expect(runtime.state.objects[p2Watcher.id]).toMatchObject({ ownerId: p2, controllerId: p2 });
    expect(
      result.events.some(
        (event) => event.type === "object-removed-from-game" && event.object.id === p1Watcher.id,
      ),
    ).toBe(true);
    expect(
      result.events.some(
        (event) => event.type === "pending-trigger-batch-ordered" && event.controllerId === p1,
      ),
    ).toBe(true);
  });
});
