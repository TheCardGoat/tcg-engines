import type { FabCardDefinitionInput } from "../cards.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { describe, expect, it } from "vitest";
import {
  nextFabDestinationRef,
  snapshotEventSubjectTriggerSources,
  snapshotFunctionalTriggerSources,
  snapshotObject,
} from "./snapshots.ts";
import { executeFabEventTransaction } from "../kernel/transaction/index.ts";

const watcher: FabCardDefinitionInput = {
  canonicalId: "watcher",
  name: "Arena Watcher",
  types: ["Action", "Aura"],
  abilities: [
    {
      kind: "static",
      staticKind: "triggered",
      id: "watcher-a1",
      text: "Whenever an opponent pitches a card, gain 1 life.",
      trigger: {
        kind: "event",
        event: {
          name: "pitch",
          actor: {
            kind: "player",
            player: "opponent",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
      },
    },
  ],
};

const compositeWatcher: FabCardDefinitionInput = {
  canonicalId: "composite-watcher",
  name: "Composite Watcher",
  types: ["Action", "Aura"],
  abilities: [
    {
      kind: "static",
      staticKind: "triggered",
      id: "inline-a1",
      text: "When this resolves, draw a card.",
      trigger: {
        kind: "event",
        event: {
          name: "chain-link-resolve",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: { type: "draw", count: 1, player: "controller" },
      },
      functionalZones: ["permanent"],
    },
    {
      id: "grant-a1",
      kind: "static",
      staticKind: "continuous",
      text: "This has a triggered ability.",
      functionalZones: ["permanent"],
      effect: {
        type: "grant-property",
        target: { selector: "self" },
        duration: "this-turn",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            id: "granted-a1",
            text: "Whenever you pitch, gain 1 life.",
            trigger: {
              kind: "event",
              event: {
                name: "pitch",
                actor: {
                  kind: "player",
                  player: "ability-controller",
                },
                observes: {
                  kind: "none",
                },
              },
            },
            resolution: {
              kind: "effect",
              effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
            },
          },
        },
      },
    },
  ],
};

describe("FAB event-boundary snapshots", () => {
  it("does not invent a controller for an object in a private zone", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "private-zone-controller",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { card1: "card" },
        owners: { p1: ["card1"], p2: [] },
      },
      cardDefinitions: {
        card: { canonicalId: "card", name: "Card", types: ["Action"] },
      },
    });

    expect(snapshotObject(state, "card1", "p1", "hand").controllerId).toBeNull();
  });

  it("includes a seated hero as a public schema-v2 object in heroZone", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "hero-snapshot",
      player1Id: "p1",
      player2Id: "p2",
      heroes: { p1: "watcher" },
      cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
      cardDefinitions: { watcher },
    });

    expect(state.containers.zonesByPlayerId["p1"]!.heroZone).toEqual(["fab-hero:p1"]);
    expect(state.objects["fab-hero:p1"]).toMatchObject({
      canonicalId: "watcher",
      ownerId: "p1",
      visibility: "public",
    });
    expect(snapshotFunctionalTriggerSources(state)).toEqual([
      expect.objectContaining({
        abilityId: "watcher-a1",
        controllerId: "p1",
        source: expect.objectContaining({
          instanceId: "fab-hero:p1",
          canonicalId: "watcher",
          zone: "hero",
        }),
      }),
    ]);
  });

  it("separates immutable ownership from current control and finds functional triggers", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "snapshots",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { watcher1: "watcher" },
        owners: { p1: ["watcher1"], p2: [] },
      },
      cardDefinitions: { watcher },
    });
    state.containers.zonesByPlayerId["p1"]!.hand = [];
    state.containers.zonesByPlayerId["p2"]!.arena = ["watcher1"];

    const object = snapshotObject(state, "watcher1", "p2", "arena");
    const sources = snapshotFunctionalTriggerSources(state);

    expect(object).toMatchObject({ ownerId: "p1", controllerId: "p2", zone: "permanent" });
    expect(Object.isFrozen(object)).toBe(true);
    expect(Object.isFrozen(object.current)).toBe(true);
    expect(Object.isFrozen(object.history.moves)).toBe(true);
    expect(sources).toHaveLength(1);
    expect(sources[0]).toMatchObject({
      abilityId: "watcher-a1",
      controllerId: "p2",
      origin: "static",
      resolution: { kind: "effect" },
    });
  });

  it("does not collect a default arena trigger from a non-functional zone", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "snapshots-private-zone",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { watcher1: "watcher" },
        owners: { p1: ["watcher1"], p2: [] },
      },
      cardDefinitions: { watcher },
    });
    expect(snapshotFunctionalTriggerSources(state)).toEqual([]);
  });

  it("snapshots static, granted, and persisted delayed trigger sources", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "snapshot-all-sources",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { composite1: "composite-watcher" },
        owners: { p1: ["composite1"], p2: [] },
      },
      cardDefinitions: { "composite-watcher": compositeWatcher },
    });
    state.containers.zonesByPlayerId["p1"]!.hand = [];
    state.containers.zonesByPlayerId["p1"]!.deck = [];
    state.containers.zonesByPlayerId["p1"]!.arena = ["composite1"];
    const reconciled = executeFabEventTransaction(
      state,
      (processId) => [
        {
          name: "gain-assets",
          processId,
          cause: { kind: "rule", rule: "grant-trigger-test", controllerId: "p1" },
          controllerId: "p1",
          source: null,
          affected: [],
          bindings: {},
          data: {
            playerId: "p1",
            resources: 0,
            chi: 0,
            actionPoints: 1,
            amp: 0,
            origin: "procedure" as const,
          },
        },
      ],
      {
        triggerContext: { evaluateStateCondition: () => true },
        legalTargets: () => [],
        evaluateAmount: (_state, amount) => (typeof amount === "number" ? amount : null),
        randomIndex: () => 0,
      },
    ).state;
    const source = snapshotObject(reconciled, "composite1", "p1", "arena");
    expect(source.current.abilities.map((ability) => ability.id)).toContain("granted-a1");
    reconciled.delayedTriggers.push({
      delayedTriggerId: "delayed-1",
      controllerId: "p1",
      source,
      trigger: {
        kind: "event",
        event: {
          name: "end-phase",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: { type: "draw", count: 1, player: "controller" },
      },
      policy: {
        kind: "windowed",
        expiresAt: { kind: "turn", turnNumber: reconciled.turnNumber },
        matching: "first",
      },
      createdByEventId: null,
    });

    expect(
      snapshotFunctionalTriggerSources(reconciled)
        .map((entry) => entry.origin)
        .sort(),
    ).toEqual(["delayed", "granted", "static"]);
  });

  it("retains a trigger on the exact event subject as last-known information", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "subject-lki",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { heart1: "heart" },
        owners: { p1: ["heart1"], p2: [] },
      },
      cardDefinitions: {
        heart: {
          canonicalId: "heart",
          name: "Heart",
          types: ["Resource", "Gem"],
          pitch: 3,
          abilities: [
            {
              kind: "static",
              staticKind: "triggered",
              id: "heart-a1",
              text: "When you pitch this, gain 1 life.",
              trigger: {
                kind: "event",
                event: {
                  name: "pitch",
                  actor: {
                    kind: "player",
                    player: "ability-controller",
                  },
                  observes: {
                    kind: "none",
                  },
                },
              },
              resolution: {
                kind: "effect",
                effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
              },
            },
          ],
        },
      },
    });
    const object = snapshotObject(state, "heart1", "p1", "hand");
    const sources = snapshotEventSubjectTriggerSources(state, [
      {
        name: "pitch",
        processId: "process-1",
        cause: { kind: "player-command", actorId: "p1", command: "pitch" },
        controllerId: "p1",
        source: object,
        affected: [object],
        bindings: {},
        data: {
          playerId: "p1",
          object,
          destinationRef: nextFabDestinationRef(state, object),
          resourcesGenerated: 3,
        },
      },
    ]);
    expect(sources).toMatchObject([{ abilityId: "heart-a1", source: { zone: "hand" } }]);
  });
});
