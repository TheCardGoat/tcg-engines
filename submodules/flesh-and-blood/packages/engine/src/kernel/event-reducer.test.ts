import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import { registerFabCardDefinition, toFabCardDefinition } from "../cards.ts";
import type { FabMatchState } from "../state.ts";
import { reduceFabGameEvent } from "./event-reducer.ts";
import type { ProposedEvent } from "../rules/events.ts";
import { nextFabDestinationRef, snapshotObject } from "../rules/snapshots.ts";
import { commitProposedEventBatch } from "./transaction-kernel.ts";
import { buildFabRulesView } from "../rules/state-rules-view.ts";

function stateWithCard(): FabMatchState {
  return FabTestEngine.createStateForRulesTest({
    seed: "event-reducer",
    player1Id: "p1",
    player2Id: "p2",
    cardsMaps: { canonicalIdsByInstance: { card1: "card" }, owners: { p1: ["card1"], p2: [] } },
    cardDefinitions: {
      card: {
        canonicalId: "card",
        name: "Pitch Card",
        types: ["Action", "Attack"],
        pitch: 3,
        power: 5,
      },
    },
  });
}

describe("FAB rules-visible event reducer", () => {
  it("moves a card with its named result through the transaction kernel", () => {
    const initial = stateWithCard();
    initial.objects.card1 = {
      ...initial.objects.card1!,
      declarationFacts: [{ kind: "fusion", revealedSupertypes: ["Earth"] }],
    };
    const object = snapshotObject(initial, "card1", "p1", "hand");
    const proposal: ProposedEvent<"put-into-graveyard"> = {
      name: "put-into-graveyard",
      processId: "process-1",
      cause: { kind: "player-command", actorId: "p1", command: "put-into-graveyard" },
      bindings: {},
      controllerId: "p1",
      source: object,
      affected: [object],
      data: {
        object,
        destinationRef: nextFabDestinationRef(initial, object),
        from: "hand",
        to: "graveyard",
        reason: "put-into-graveyard",
      },
    };

    const result = commitProposedEventBatch(initial, [proposal], reduceFabGameEvent);
    expect(proposal.data.destinationRef).not.toBeNull();

    expect(initial.containers.zonesByPlayerId["p1"]!.hand).toEqual(["card1"]);
    expect(result.state.containers.zonesByPlayerId["p1"]!.hand).toEqual([]);
    expect(result.state.containers.zonesByPlayerId["p1"]!.graveyard).toEqual(["card1"]);
    expect(result.state.objects.card1!.incarnation).toBe(proposal.data.destinationRef!.incarnation);
    expect(result.batch?.events[0]?.data).toMatchObject({
      destinationRef: proposal.data.destinationRef,
    });
    expect(result.state.objects.card1).toMatchObject({
      visibility: "public",
      activeFace: { kind: "single" },
      declarationFacts: [],
      counters: [],
      markers: [],
      history: {
        moves: [
          {
            from: { playerId: "p1", zone: "hand" },
            to: { playerId: "p1", zone: "graveyard" },
            eventId: "event-1",
            turnNumber: 1,
            combatNumber: null,
            chainLinkNumber: null,
          },
        ],
      },
    });
    expect(
      buildFabRulesView(result.state).evaluateCondition(
        {
          type: "zone-count",
          zone: "graveyard",
          player: "controller",
          per: "turn",
          filter: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
          comparison: { op: "eq", value: 1 },
        },
        {
          controllerId: "p1",
          source: object.ref,
          bindings: { objects: {}, numbers: {}, strings: {} },
        },
      ),
    ).toBe(true);
    expect(result.batch?.events[0]!.name).toBe("put-into-graveyard");
  });

  it("emits one exact post-transition enter observation for a generic arena move", () => {
    const initial = stateWithCard();
    initial.containers.zonesByPlayerId.p1!.hand = [];
    initial.containers.zonesByPlayerId.p1!.banished = ["card1"];
    const object = snapshotObject(initial, "card1", "p1", "banished");
    const destinationRef = null;
    const proposal: ProposedEvent<"move-zone"> = {
      name: "move-zone",
      processId: "process-1",
      cause: { kind: "player-command", actorId: "p1", command: "move-zone" },
      bindings: {},
      controllerId: "p1",
      source: object,
      affected: [object],
      data: {
        object,
        destinationRef,
        from: "banished",
        to: "arena",
        reason: "move",
      },
    };

    const result = commitProposedEventBatch(initial, [proposal], reduceFabGameEvent);
    const events = result.batch?.events ?? [];

    expect(events.map((event) => event.name)).toEqual([
      "move-zone",
      "enter-arena",
      "enter-or-leave-arena",
    ]);
    expect(result.state.containers.zonesByPlayerId.p1!.banished).toEqual([]);
    expect(result.state.containers.zonesByPlayerId.p1!.arena).toEqual(["card1"]);
    expect(result.state.objects.card1!.incarnation).toBe(object.ref.incarnation);
    for (const event of events.slice(1)) {
      expect(event.affected).toHaveLength(1);
      expect(event.affected[0]?.ref).toEqual(object.ref);
      expect(event.data).toMatchObject({
        object: { ref: object.ref, zoneRef: { playerId: "p1", zone: "arena" } },
        transition: {
          before: { ref: object.ref, zoneRef: { playerId: "p1", zone: "banished" } },
          after: { ref: object.ref, zoneRef: { playerId: "p1", zone: "arena" } },
          identity: "preserved",
        },
      });
    }
  });

  it("indexes a played object in the current turn without reading its reset destination", () => {
    const initial = stateWithCard();
    const object = snapshotObject(initial, "card1", "p1", "hand");
    const announce: ProposedEvent<"announce-card"> = {
      name: "announce-card",
      processId: "process-1",
      cause: { kind: "player-command", actorId: "p1", command: "begin-play" },
      bindings: {},
      controllerId: "p1",
      source: object,
      affected: [object],
      data: {
        actorId: "p1",
        object,
        from: "hand",
        destinationRef: null,
        splitPlayMethod: null,
      },
    };
    const result = commitProposedEventBatch(initial, [announce], reduceFabGameEvent);
    const view = buildFabRulesView(result.state);
    expect(
      view.evaluateCondition(
        {
          type: "played-this",
          per: "turn",
          filter: {
            typeBox: {
              subtypes: ["Attack"],
            },
          },
        },
        {
          controllerId: "p1",
          source: object.ref,
          bindings: { objects: {}, numbers: {}, strings: {} },
        },
      ),
    ).toBe(true);
  });

  it("commits destroy and its arena/graveyard results in one atomic batch", () => {
    const initial = stateWithCard();
    initial.containers.zonesByPlayerId["p1"]!.hand = [];
    initial.containers.zonesByPlayerId["p1"]!.arena = ["card1"];
    const object = snapshotObject(initial, "card1", "p1", "arena");
    const proposal: ProposedEvent<"destroy"> = {
      name: "destroy",
      processId: "process-1",
      cause: { kind: "player-command", actorId: "p1", command: "destroy" },
      bindings: {},
      controllerId: "p1",
      source: object,
      affected: [object],
      data: {
        object,
        destinationRef: nextFabDestinationRef(initial, object),
        from: "arena",
        to: "graveyard",
        reason: "destroy",
      },
    };

    const result = commitProposedEventBatch(initial, [proposal], reduceFabGameEvent);

    expect(result.state.containers.zonesByPlayerId["p1"]!.arena).toEqual([]);
    expect(result.state.containers.zonesByPlayerId["p1"]!.graveyard).toEqual(["card1"]);
    expect(result.batch?.events.map((event) => event.name)).toEqual([
      "destroy",
      "leave-arena",
      "enter-or-leave-arena",
      "put-into-graveyard",
    ]);
    const lkiId = result.state.objects.card1?.history.moves[0]?.lki;
    expect(lkiId).toMatch(/^lki:/);
    expect(Object.keys(result.state.lkiArena)).toEqual([lkiId]);
    expect(lkiId ? result.state.lkiArena[lkiId] : null).toMatchObject({
      ref: object.ref,
      zone: { playerId: "p1", zone: "arena" },
      current: { numeric: { power: 5 } },
    });
    expect(
      buildFabRulesView(result.state).evaluateCondition(
        {
          type: "left-arena-count",
          per: "turn",
          filter: {
            numeric: [{ property: "power", basis: "current", comparison: { op: "gte", value: 5 } }],
          },
          comparison: { op: "eq", value: 1 },
        },
        {
          controllerId: "p1",
          source: object.ref,
          bindings: { objects: {}, numbers: {}, strings: {} },
        },
      ),
    ).toBe(true);
    expect(new Set(result.batch?.events.map((event) => event.batchId))).toEqual(
      new Set(["batch-1"]),
    );
  });

  it("emits dies as an observational result when an ally is destroyed", () => {
    const initial = stateWithCard();
    const { base: _base, ...card } = initial.cardDefinitions.card!;
    initial.cardDefinitions.card = registerFabCardDefinition({
      ...card,
      types: ["Guardian", "Ally"],
    });
    initial.containers.zonesByPlayerId["p1"]!.hand = [];
    initial.containers.zonesByPlayerId["p1"]!.arena = ["card1"];
    const object = snapshotObject(initial, "card1", "p1", "arena");
    const proposal: ProposedEvent<"destroy"> = {
      name: "destroy",
      processId: "process-1",
      cause: { kind: "player-command", actorId: "p1", command: "destroy" },
      bindings: {},
      controllerId: "p1",
      source: object,
      affected: [object],
      data: {
        object,
        destinationRef: nextFabDestinationRef(initial, object),
        from: "arena",
        to: "graveyard",
        reason: "destroy",
      },
    };

    const result = commitProposedEventBatch(initial, [proposal], reduceFabGameEvent);

    expect(result.batch?.events.map((event) => event.name)).toEqual([
      "destroy",
      "dies",
      "leave-arena",
      "enter-or-leave-arena",
      "put-into-graveyard",
    ]);
    expect(result.batch?.events[1]).toMatchObject({
      name: "dies",
      bindings: { resultingEvent: true },
      data: {
        object: { instanceId: "card1" },
        destinationRef: proposal.data.destinationRef,
        from: "arena",
        to: "graveyard",
        reason: "die",
      },
    });
  });

  it("commits pitch movement and resource generation atomically", () => {
    const initial = stateWithCard();
    const { base: _base, ...card } = initial.cardDefinitions.card!;
    initial.cardDefinitions.card = toFabCardDefinition({
      ...card,
      types: ["Action", "Attack"],
      color: "blue",
      power: 6,
    });
    const object = snapshotObject(initial, "card1", "p1", "hand");
    const proposal: ProposedEvent<"pitch"> = {
      name: "pitch",
      processId: "process-1",
      cause: { kind: "player-command", actorId: "p1", command: "pitch" },
      bindings: {},
      controllerId: "p1",
      source: object,
      affected: [object],
      data: {
        object,
        playerId: "p1",
        destinationRef: nextFabDestinationRef(initial, object),
        resourcesGenerated: 3,
      },
    };

    const result = commitProposedEventBatch(initial, [proposal], reduceFabGameEvent);
    expect(result.state.containers.zonesByPlayerId["p1"]!.pitch).toEqual(["card1"]);
    expect(result.state.players.p1!.resourcePoints).toBe(3);
    expect(result.state.players.p1!.history.turn).toMatchObject({
      pitchedPower6: true,
      pitchedBlue: true,
    });

    const advance: ProposedEvent<"advance-turn"> = {
      name: "advance-turn",
      processId: "process-1",
      cause: { kind: "rule", rule: "turn-advance", controllerId: null },
      bindings: {},
      controllerId: null,
      source: null,
      affected: [],
      data: { previousPlayerId: "p1", nextPlayerId: "p2", nextTurnNumber: 2 },
    };
    const advanced = commitProposedEventBatch(result.state, [advance], reduceFabGameEvent);
    expect(advanced.state.players.p1!.history.turn).toMatchObject({
      turnNumber: 2,
      pitchedPower6: false,
      pitchedBlue: false,
    });
  });

  it("indexes committed damage by type and resets the scoped totals", () => {
    const initial = stateWithCard();
    const source = snapshotObject(initial, "card1", "p1", "hand");
    const damage: ProposedEvent<"deal-damage"> = {
      name: "deal-damage",
      processId: "process-1",
      cause: { kind: "rule", rule: "history-damage", controllerId: "p1" },
      bindings: {},
      controllerId: "p1",
      source,
      affected: [],
      data: {
        source,
        target: { kind: "hero", playerId: "p2" },
        amount: 3,
        damageType: "physical",
      },
    };
    const dealt = commitProposedEventBatch(initial, [damage], reduceFabGameEvent);

    expect(dealt.state.players.p1!.history.turn).toMatchObject({
      dealtDamage: true,
      damageDealtByType: { arcane: 0, physical: 3, generic: 0 },
    });
    expect(dealt.state.players.p1!.history.chainLink.damageDealtByType).toEqual({
      arcane: 0,
      physical: 3,
      generic: 0,
    });

    const advance: ProposedEvent<"advance-turn"> = {
      name: "advance-turn",
      processId: "process-1",
      cause: { kind: "rule", rule: "turn-advance", controllerId: null },
      bindings: {},
      controllerId: null,
      source: null,
      affected: [],
      data: { previousPlayerId: "p1", nextPlayerId: "p2", nextTurnNumber: 2 },
    };
    const advanced = commitProposedEventBatch(dealt.state, [advance], reduceFabGameEvent);
    expect(advanced.state.players.p1!.history.turn.damageDealtByType).toEqual({
      arcane: 0,
      physical: 0,
      generic: 0,
    });
    expect(advanced.state.players.p1!.history.chainLink.damageDealtByType).toEqual({
      arcane: 0,
      physical: 0,
      generic: 0,
    });
  });

  it("suppresses impossible zone moves and zero damage as no-op events", () => {
    const initial = stateWithCard();
    const object = snapshotObject(initial, "card1", "p1", "hand");
    const impossible: ProposedEvent<"move-zone"> = {
      name: "move-zone",
      processId: "process-1",
      cause: { kind: "player-command", actorId: "p1", command: "move-zone" },
      bindings: {},
      controllerId: "p1",
      source: object,
      affected: [object],
      data: {
        object,
        destinationRef: nextFabDestinationRef(initial, object),
        from: "deck",
        to: "banished",
        reason: "move",
      },
    };
    const zeroDamage: ProposedEvent<"deal-damage"> = {
      name: "deal-damage",
      processId: "process-1",
      cause: { kind: "player-command", actorId: "p1", command: "deal-damage" },
      bindings: {},
      controllerId: "p1",
      source: object,
      affected: [],
      data: {
        source: object,
        target: { kind: "hero", playerId: "p2" },
        amount: 0,
        damageType: "physical",
      },
    };

    const result = commitProposedEventBatch(initial, [impossible, zeroDamage], reduceFabGameEvent);
    expect(result.batch).toBeNull();
    expect(result.state.players.p2!.life).toBe(20);
  });

  it("validates an entire turn-reset group before mutating any player", () => {
    const initial = stateWithCard();
    initial.players.p1!.actionPoints = 2;
    initial.players.p1!.resourcePoints = 3;
    const reset: ProposedEvent<"reset-turn-assets"> = {
      name: "reset-turn-assets",
      processId: "process-1",
      cause: { kind: "rule", rule: "turn-reset", controllerId: null },
      bindings: {},
      controllerId: null,
      source: null,
      affected: [],
      data: { playerIds: ["p1"], allyInstanceIds: ["missing-ally"] },
    };

    const result = commitProposedEventBatch(initial, [reset], reduceFabGameEvent);

    expect(result.batch).toBeNull();
    expect(result.state.players.p1).toMatchObject({ actionPoints: 2, resourcePoints: 3 });
    expect(initial.players.p1).toMatchObject({ actionPoints: 2, resourcePoints: 3 });
  });

  it("announces an activated layer before costs and completes it without duplication", () => {
    const initial = stateWithCard();
    initial.cardDefinitions.card = registerFabCardDefinition({
      canonicalId: "card",
      name: "Ability Source",
      types: ["Action", "Item"],
      abilities: [
        {
          id: "activate-a1",
          kind: "activated",
          text: "Action — 0: Gain 1 life.",
          abilityType: "action",
          cost: { class: "asset", type: "resources", amount: 0 },
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      ],
    });
    const object = snapshotObject(initial, "card1", "p1", "hand");
    const announcement: ProposedEvent<"announce-activation"> = {
      name: "announce-activation",
      processId: "process-1",
      cause: { kind: "player-command", actorId: "p1", command: "activate" },
      bindings: {},
      controllerId: "p1",
      source: object,
      affected: [object],
      data: {
        actorId: "p1",
        object,
        abilityId: "activate-a1",
        ability: {
          id: "activate-a1",
          kind: "activated",
          text: "Action — 0: Gain 1 life.",
          abilityType: "action",
          cost: { class: "asset", type: "resources", amount: 0 },
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
        targets: {},
        equipDestination: null,
        attackTarget: null,
      },
    };

    const announced = commitProposedEventBatch(initial, [announcement], reduceFabGameEvent);
    expect(announced.state.containers.zonesByPlayerId["p1"]!.hand).toEqual(["card1"]);
    expect(announced.state.rulesStack).toMatchObject([
      {
        kind: "activated",
        abilityId: "activate-a1",
        controllerId: "p1",
      },
    ]);

    const activation: ProposedEvent<"activate"> = { ...announcement, name: "activate" };
    const completed = commitProposedEventBatch(announced.state, [activation], reduceFabGameEvent);
    expect(completed.state.rulesStack).toHaveLength(1);
  });

  it("moves a resolving attack from stack to the combat chain", () => {
    const initial = stateWithCard();
    initial.containers.zonesByPlayerId["p1"]!.hand = [];
    initial.containers.zonesByPlayerId["p1"]!.stack = ["card1"];
    const object = snapshotObject(initial, "card1", "p1", "stack");
    const proposal: ProposedEvent<"move-zone"> = {
      name: "move-zone",
      processId: "process-1",
      cause: { kind: "rule", rule: "attack-layer-resolves", controllerId: "p1" },
      bindings: {},
      controllerId: "p1",
      source: object,
      affected: [object],
      data: {
        object,
        destinationRef: null,
        from: "stack",
        to: "combat-chain",
        reason: "resolve",
      },
    };
    const result = commitProposedEventBatch(initial, [proposal], reduceFabGameEvent);
    // CR 3.0.5 / 7.0.3f: the combat chain is an arena zone, so stack → chain
    // is also observed as entering the arena.
    expect(result.batch?.events.map((event) => event.name)).toEqual([
      "move-zone",
      "enter-arena",
      "enter-or-leave-arena",
    ]);
    expect(result.state.containers.zonesByPlayerId["p1"]!.combatChain).toEqual(["card1"]);
  });
});
