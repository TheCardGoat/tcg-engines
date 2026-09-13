import { describe, expect, it } from "vitest";
import { normalizeBaseObjectProperties, registerFabCardDefinition } from "../cards.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { FabMatchRuntime as ProductionFabMatchRuntime } from "../runtime.ts";
import { FAB_RUNTIME_TEST_ACCESS, FAB_RUNTIME_TEST_RECEIPT } from "../runtime-access.ts";
import type { CommittedEvent } from "./events.ts";
import type { FabMatchState } from "../state.ts";
import type { FabTriggeredLayer } from "./layers.ts";
import { createSyntheticFabObjectSnapshot, snapshotObject } from "./snapshots.ts";
import { buildFabRulesView } from "./state-rules-view.ts";
import { openFabPriority } from "../priority.ts";
import { fabCanonicalCardId, fabObjectInstanceId, fabPlayerId } from "../game/identity.ts";
import { registerTokenDefinitions } from "../testing/token-registry.ts";
import { arcaneSeedsLifeRed } from "../../../cards/src/cards/actions/arcane-seeds-life.ts";
import { internMoveLki } from "./reducers/shared.ts";

class FabMatchRuntime extends ProductionFabMatchRuntime {
  committedEvents(): readonly CommittedEvent[] {
    return this[FAB_RUNTIME_TEST_RECEIPT]().committedEvents;
  }
}

function rulesEffectEvents(events: readonly CommittedEvent[]) {
  return events.filter(
    (event) =>
      event.name !== "declare-triggered-layer" &&
      event.name !== "consume-replacement-effects" &&
      event.name !== "consume-delayed-triggers" &&
      event.name !== "expire-replacement-effects" &&
      event.name !== "remove-rules-layer",
  );
}

function registerTestObject(
  state: FabMatchState,
  instanceId: string,
  canonicalId: string,
  ownerId: string,
): void {
  state.counters.objectIncarnation += 1;
  state.objects[instanceId] = {
    instanceId: fabObjectInstanceId(instanceId),
    canonicalId: fabCanonicalCardId(canonicalId),
    objectKind: "catalog-card",
    baseSource: { kind: "registered" },
    ownerId: fabPlayerId(ownerId),
    incarnation: state.counters.objectIncarnation,
    cardPropertyState: { kind: "whole-card" },
    visibility: "public",
    activeFace: { kind: "single" },
    counters: [],
    markers: [],
    history: { moves: [] },
  };
}

function retainMissingTargetLki(state: FabMatchState): void {
  const source = state.rulesStack[0]!.source;
  internMoveLki(
    state,
    {
      ...source,
      instanceId: "missing-target",
      ref: { instanceId: fabObjectInstanceId("missing-target"), incarnation: 1 },
    },
    source.canonicalId ?? source.instanceId,
  );
}

function setup(
  effect: FabTriggeredLayer["resolution"],
  stateCondition?: import("@tcg/flesh-and-blood-types").FabCondition,
  keywords: readonly string[] = [],
  triggerKind: "state" | "event-and-state" = "state",
) {
  const state = FabTestEngine.createStateForRulesTest({
    seed: "rules-stack-resolution",
    player1Id: "p1",
    player2Id: "p2",
    cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
  });
  registerTokenDefinitions(state.cardDefinitions);
  const layer: FabTriggeredLayer = {
    kind: "triggered",
    layerId: "layer-1",
    controllerId: "p1",
    source: createSyntheticFabObjectSnapshot({
      ref: { instanceId: "source-1", incarnation: 1 },
      canonicalId: "source",
      objectKind: "catalog-card",
      baseSource: { kind: "registered" },
      ownerId: "p1",
      controllerId: "p1",
      zone: "permanent",
      zoneRef: { playerId: fabPlayerId("p1"), zone: "arena" },
      base: normalizeBaseObjectProperties({
        canonicalId: "source",
        name: "Source",
        types: ["Action", "Aura"],
        cost: 0,
      }),
      counters: {},
    }),
    keywords,
    modes: [],
    targets: {},
    abilityId: "ability-1",
    trigger: stateCondition
      ? triggerKind === "event-and-state"
        ? {
            kind: "event-and-state",
            event: { name: "end-phase", actor: { kind: "any" }, observes: { kind: "none" } },
            state: stateCondition,
          }
        : { kind: "state", state: stateCondition }
      : {
          kind: "event",
          event: { name: "end-phase", actor: { kind: "any" }, observes: { kind: "none" } },
        },
    triggeringEvent: null,
    bindings: {},
    resolution: effect,
  };
  state.rulesStack.push(layer);
  internMoveLki(state, layer.source, layer.source.canonicalId ?? layer.source.instanceId);
  openFabPriority(state, state.activePlayerId, "layer", null);
  return { state, runtime: new FabMatchRuntime(state) };
}

describe("event-native FAB rules stack resolution", () => {
  it("never settles go again for a triggered layer because it spent no action point", () => {
    const { runtime } = setup(
      {
        kind: "effect",
        effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
      },
      undefined,
      ["go-again"],
    );
    const actionPointsBefore = runtime.getState().players.p1!.actionPoints;

    expect(dispatchTestCommand(runtime, "pass", "p1", {}).accepted).toBe(true);
    expect(dispatchTestCommand(runtime, "pass", "p2", {})).toMatchObject({ accepted: true });

    expect(runtime.getState().players.p1!.actionPoints).toBe(actionPointsBefore);
    expect(runtime.committedEvents().some((event) => event.name === "go-again")).toBe(false);
  });

  it("resolves a triggered layer after all players pass and commits its event", () => {
    const { runtime } = setup({
      kind: "effect",
      effect: { type: "gain-life", amount: 2, target: { selector: "controller" } },
    });
    const before = runtime.getState().players.p1!.life;

    expect(dispatchTestCommand(runtime, "pass", "p1", {}).accepted).toBe(true);
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);

    expect(runtime.getState().players.p1!.life).toBe(before + 2);
    expect(runtime.getState().rulesStack).toEqual([]);
    expect(rulesEffectEvents(runtime.committedEvents()).at(-1)).toMatchObject({
      name: "gain-life",
    });
  });

  it("rechecks a state condition and ceases without generating an event", () => {
    const { runtime } = setup(
      {
        kind: "effect",
        effect: { type: "gain-life", amount: 2, target: { selector: "controller" } },
      },
      { type: "turn-player", who: "opponent" },
    );
    const before = runtime.getState().players.p1!.life;
    dispatchTestCommand(runtime, "pass", "p1", {});
    const result = dispatchTestCommand(runtime, "pass", "p2", {});
    expect(result.accepted).toBe(true);
    expect(runtime.getState().players.p1!.life).toBe(before);
    expect(rulesEffectEvents(runtime.committedEvents())).toEqual([]);
    expect(runtime.getState().rulesStack).toEqual([]);
  });

  it("keeps an event-and-state trigger after its event-time condition was met", () => {
    const { runtime } = setup(
      {
        kind: "effect",
        effect: { type: "gain-life", amount: 2, target: { selector: "controller" } },
      },
      { type: "turn-player", who: "opponent" },
      [],
      "event-and-state",
    );
    const before = runtime.getState().players.p1!.life;

    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);

    expect(runtime.getState().players.p1!.life).toBe(before + 2);
    expect(rulesEffectEvents(runtime.committedEvents()).at(-1)).toMatchObject({
      name: "gain-life",
    });
    expect(runtime.getState().rulesStack).toEqual([]);
  });

  it("keeps an unsupported layer intact with an explicit failure", () => {
    const { runtime } = setup({
      kind: "effect",
      effect: { type: "take-extra-turn", player: "controller" },
    });
    dispatchTestCommand(runtime, "pass", "p1", {});
    const result = dispatchTestCommand(runtime, "pass", "p2", {});
    expect(result).toMatchObject({ accepted: false, errorCode: "unsupported_rules_effect" });
    expect(runtime.getState().rulesStack).toHaveLength(1);
  });

  it("commits damage and its resulting dealt-damage event without applying damage twice", () => {
    const { runtime } = setup({
      kind: "effect",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 2,
        target: { selector: "opponent" },
      },
    });
    const before = runtime.getState().players.p2!.life;
    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(runtime.getState().players.p2!.life).toBe(before - 2);
    expect(rulesEffectEvents(runtime.committedEvents()).map((event) => event.name)).toEqual([
      "deal-damage",
      "dealt-damage",
    ]);
  });

  it("creates a deterministic token and resulting enter-arena event", () => {
    const { runtime } = setup({
      kind: "effect",
      effect: { type: "create-token", token: "runechant", controller: "controller" },
    });
    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);

    const tokenId = "process-3:layer-1:effect-0:token-0";
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.arena).toEqual([tokenId]);
    expect(runtime.getState().objects[tokenId]?.canonicalId).toBe("token:runechant");
    expect(rulesEffectEvents(runtime.committedEvents()).map((event) => event.name)).toEqual([
      "create",
      "enter-arena",
    ]);
  });

  it("chooses and creates random tokens through the persisted RNG reducer", () => {
    const resolution: FabTriggeredLayer["resolution"] = {
      kind: "effect",
      effect: {
        type: "for-each",
        target: { selector: "each-other-hero" },
        effect: {
          type: "choose-and-create-token",
          options: ["inertia", "frailty", "bloodrot-pox"],
          chooser: "controller",
          random: true,
          controller: "opponent",
        },
      },
    };
    const first = setup(resolution).runtime;
    const restored = new FabMatchRuntime(structuredClone(setup(resolution).state));
    for (const runtime of [first, restored]) {
      dispatchTestCommand(runtime, "pass", "p1", {});
      expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    }

    expect(restored.getState()).toEqual(first.getState());
    expect(first.getState().containers.zonesByPlayerId["p2"]!.arena).toEqual([
      "process-3:layer-1:effect-0:random-token-0",
    ]);
    expect(rulesEffectEvents(first.committedEvents()).map((event) => event.name)).toEqual([
      "random-token-request",
      "create",
      "enter-arena",
    ]);
  });

  it("collects a dies trigger from the committed destruction of an ally", () => {
    const { state } = setup({
      kind: "effect",
      effect: { type: "destroy", target: { selector: "binding", binding: "victim" } },
    });
    registerTestObject(state, "ally1", "ally", "p1");
    state.cardDefinitions.ally = registerFabCardDefinition({
      canonicalId: "ally",
      name: "Arena Ally",
      types: ["Guardian", "Ally"],
    });
    state.containers.zonesByPlayerId["p1"]!.arena.push("ally1");
    registerTestObject(state, "watcher1", "watcher", "p1");
    state.cardDefinitions.watcher = registerFabCardDefinition({
      canonicalId: "watcher",
      name: "Death Watcher",
      types: ["Action", "Aura"],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          id: "watcher-a1",
          text: "When an ally dies, gain 1 life.",
          trigger: {
            kind: "event",
            event: {
              name: "dies",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "event-object",
                selector: "moved-object",
                relationship: { kind: "any" },
                filter: { typeBox: { subtypes: ["Ally"] } },
              },
            },
          },
          resolution: {
            kind: "effect",
            effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
          },
        },
      ],
    });
    state.containers.zonesByPlayerId["p1"]!.arena.push("watcher1");
    const destroyingLayer = state.rulesStack[0] as FabTriggeredLayer;
    state.rulesStack[0] = {
      ...destroyingLayer,
      bindings: { victim: snapshotObject(state, "ally1", "p1", "arena") },
    };
    const before = state.players.p1!.life;
    const runtime = new FabMatchRuntime(state);

    dispatchTestCommand(runtime, "pass", "p1", {});
    const resolution = dispatchTestCommand(runtime, "pass", "p2", {});
    if (!resolution.accepted) {
      throw new Error(`${resolution.errorCode}: ${resolution.error}`);
    }
    expect(rulesEffectEvents(runtime.committedEvents()).map((event) => event.name)).toEqual([
      "destroy",
      "dies",
      "leave-arena",
      "enter-or-leave-arena",
      "put-into-graveyard",
    ]);
    expect(runtime.getState().rulesStack).toMatchObject([
      {
        kind: "triggered",
        abilityId: "watcher-a1",
        triggeringEvent: { name: "dies" },
      },
    ]);

    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(runtime.getState().players.p1!.life).toBe(before + 1);
  });

  it("reveals the top card at resolution without moving it", () => {
    const { state } = setup({
      kind: "effect",
      effect: {
        type: "reveal",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["deck"],
          position: "top",
          count: 1,
        },
        outputBinding: "revealed",
      },
    });
    registerTestObject(state, "top1", "top-card", "p1");
    state.cardDefinitions["top-card"] = registerFabCardDefinition({
      canonicalId: "top-card",
      name: "Top Card",
      types: ["Action"],
    });
    state.containers.zonesByPlayerId["p1"]!.deck.push("top1");
    const runtime = new FabMatchRuntime(state);
    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);

    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.deck.at(-1)).toBe("top1");
    expect(rulesEffectEvents(runtime.committedEvents())[0]).toMatchObject({
      name: "reveal",
      bindings: { revealed: { instanceId: "top1" } },
    });
  });

  it("threads immutable output bindings across sequential effects in one resolution", () => {
    const { state } = setup({
      kind: "effect",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            outputBinding: "revealed",
          },
          {
            type: "move-card",
            target: { selector: "binding", binding: "revealed" },
            to: { zone: "hand" },
          },
        ],
      },
    });
    registerTestObject(state, "top1", "top-card", "p1");
    state.cardDefinitions["top-card"] = registerFabCardDefinition({
      canonicalId: "top-card",
      name: "Top Card",
      types: ["Action"],
    });
    state.containers.zonesByPlayerId["p1"]!.deck.push("top1");
    const runtime = new FabMatchRuntime(state);

    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);

    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.deck).not.toContain("top1");
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.hand).toContain("top1");
    expect(rulesEffectEvents(runtime.committedEvents()).map((event) => event.name)).toEqual([
      "reveal",
      "move-zone",
    ]);
    expect(rulesEffectEvents(runtime.committedEvents())[1]?.bindings).toMatchObject({
      revealed: { instanceId: "top1", zone: "deck" },
    });
  });

  it("lets a failed effect cease while subsequent effects remain resolvable", () => {
    const { state } = setup({
      kind: "effect",
      effect: {
        type: "sequence",
        steps: [
          { type: "destroy", target: { selector: "binding", binding: "stale" } },
          { type: "gain-life", amount: 1, target: { selector: "controller" } },
        ],
      },
    });
    registerTestObject(state, "victim1", "victim", "p1");
    state.cardDefinitions.victim = registerFabCardDefinition({
      canonicalId: "victim",
      name: "Stale Victim",
      types: ["Action", "Aura"],
    });
    state.containers.zonesByPlayerId["p1"]!.arena.push("victim1");
    const layer = state.rulesStack[0] as FabTriggeredLayer;
    state.rulesStack[0] = {
      ...layer,
      bindings: { stale: snapshotObject(state, "victim1", "p1", "arena") },
    };
    state.containers.zonesByPlayerId["p1"]!.arena = [];
    state.containers.zonesByPlayerId["p1"]!.graveyard.push("victim1");
    const before = state.players.p1!.life;
    const runtime = new FabMatchRuntime(state);

    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);

    expect(runtime.getState().players.p1!.life).toBe(before + 1);
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.graveyard).toEqual(["victim1"]);
    expect(rulesEffectEvents(runtime.committedEvents()).map((event) => event.name)).toEqual([
      "gain-life",
    ]);
    expect(runtime.getState().rulesStack).toEqual([]);
  });

  it("registers a deterministic one-shot delayed trigger with its creating event id", () => {
    const { runtime } = setup({
      kind: "effect",
      effect: {
        type: "delayed-trigger",
        trigger: {
          kind: "event",
          event: {
            name: "draw",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
          },
        },
        policy: {
          kind: "windowed",
          duration: "this-turn",
          matching: "first",
        },
        resolution: {
          kind: "effect",
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      },
    });
    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);

    expect(runtime.getState().delayedTriggers).toMatchObject([
      {
        controllerId: "p1",
        trigger: {
          kind: "event",
          event: {
            name: "draw",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
          },
        },
        policy: {
          kind: "windowed",
          expiresAt: { kind: "turn", turnNumber: runtime.getState().turnNumber },
          matching: "first",
        },
      },
    ]);
    expect(rulesEffectEvents(runtime.committedEvents())[0]?.name).toBe("register-delayed-trigger");

    const state = runtime[FAB_RUNTIME_TEST_ACCESS]();
    registerTestObject(state, "draw1", "draw-card", "p1");
    // The runtime's compiled registry is immutable; replace this fixture's
    // registry before adding a late test object.
    state.cardDefinitions = { ...state.cardDefinitions };
    state.cardDefinitions["draw-card"] = registerFabCardDefinition({
      canonicalId: "draw-card",
      name: "Draw Card",
      types: ["Action"],
    });
    state.containers.zonesByPlayerId["p1"]!.deck.push("draw1");
    state.rulesStack.push({
      kind: "triggered",
      layerId: "layer-2",
      controllerId: "p1",
      source: state.delayedTriggers[0]!.source,
      keywords: [],
      modes: [],
      targets: {},
      abilityId: "draw-a1",
      trigger: {
        kind: "event",
        event: { name: "draw", actor: { kind: "any" }, observes: { kind: "none" } },
      },
      triggeringEvent: null,
      bindings: {},
      resolution: { kind: "effect", effect: { type: "draw", count: 1, player: "controller" } },
    });
    openFabPriority(state, "p1", "layer", null);
    expect(dispatchTestCommand(runtime, "pass", "p1", {}).accepted).toBe(true);
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(runtime.getState().delayedTriggers).toEqual([]);
    expect(runtime.getState().rulesStack.at(-1)).toMatchObject({
      kind: "triggered",
      triggeringEvent: { name: "draw" },
    });
  });

  it("persists a prevention effect, applies it before damage, and consumes it deterministically", () => {
    const { runtime } = setup({
      kind: "effect",
      effect: {
        type: "prevention",
        preventionKind: "fixed",
        amount: 2,
        shielded: { selector: "controller" },
        duration: "this-turn",
      },
    });
    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(runtime.getState().replacementEffects).toMatchObject([
      {
        controllerId: "p1",
        effect: { type: "prevention", amount: 2 },
      },
    ]);

    const damageSource: FabTriggeredLayer["source"] = {
      ...rulesEffectEvents(runtime.committedEvents())[0]!.source!,
      instanceId: "damage-source",
      ref: {
        ...rulesEffectEvents(runtime.committedEvents())[0]!.source!.ref,
        instanceId: "damage-source",
      },
      controllerId: "p2",
      ownerId: "p2",
      current: {
        ...rulesEffectEvents(runtime.committedEvents())[0]!.source!.current,
        names: ["Damage Source"],
      },
    };
    runtime[FAB_RUNTIME_TEST_ACCESS]().rulesStack.push({
      kind: "triggered",
      layerId: "layer-2",
      controllerId: "p2",
      source: damageSource,
      keywords: [],
      modes: [],
      targets: {},
      abilityId: "damage-a1",
      trigger: {
        kind: "event",
        event: { name: "deal-damage", actor: { kind: "any" }, observes: { kind: "none" } },
      },
      triggeringEvent: null,
      bindings: {},
      resolution: {
        kind: "effect",
        effect: {
          type: "deal-damage",
          damageType: "arcane",
          amount: 5,
          target: { selector: "opponent" },
        },
      },
    });
    const before = runtime.getState().players.p1!.life;
    openFabPriority(runtime[FAB_RUNTIME_TEST_ACCESS](), "p2", "layer", null);
    dispatchTestCommand(runtime, "pass", "p2", {});
    expect(dispatchTestCommand(runtime, "pass", "p1", {}).accepted).toBe(true);

    expect(runtime.getState().players.p1!.life).toBe(before - 3);
    expect(runtime.getState().replacementEffects).toEqual([]);
    expect(
      rulesEffectEvents(runtime.committedEvents())
        .slice(1)
        .map((event) => event.name),
    ).toEqual(["prevent", "deal-damage", "dealt-damage"]);
    expect(rulesEffectEvents(runtime.committedEvents())[1]?.replacementIds).toHaveLength(1);
    expect(rulesEffectEvents(runtime.committedEvents())[2]).toMatchObject({ data: { amount: 3 } });
  });

  it("lets the effect controller order their simultaneous replacements and resumes identically after restoration", () => {
    const { state } = setup({
      kind: "effect",
      effect: {
        type: "deal-damage",
        damageType: "physical",
        amount: 5,
        target: { selector: "opponent" },
      },
    });
    const replacementSource: FabTriggeredLayer["source"] = {
      ...state.rulesStack[0]!.source,
      instanceId: "replacement-source",
      ref: { ...state.rulesStack[0]!.source.ref, instanceId: "replacement-source" },
      controllerId: "p2",
      ownerId: "p2",
      zone: "permanent",
      current: { ...state.rulesStack[0]!.source.current, names: ["Replacement Source"] },
    };
    internMoveLki(
      state,
      replacementSource,
      replacementSource.canonicalId ?? replacementSource.instanceId,
    );
    state.replacementEffects = [1, 2].map((amount) => ({
      replacementId: `replacement-${amount}`,
      controllerId: "p2",
      source: replacementSource,
      effect: {
        type: "prevention" as const,
        preventionKind: "fixed" as const,
        amount,
        shielded: { selector: "controller" as const },
        duration: "this-turn" as const,
      },
      createdByEventId: null,
      expiresAt: { kind: "turn" as const, turnNumber: 1 },
      consumptionPolicy: { kind: "on-application" as const },
      applicationPolicy: { kind: "mandatory" as const },
    }));
    const initial = new FabMatchRuntime(state);
    dispatchTestCommand(initial, "pass", "p1", {});
    expect(dispatchTestCommand(initial, "pass", "p2", {}).accepted).toBe(true);
    expect(initial.getState().decision).toMatchObject({
      actorId: "p2",
      kind: "ordering",
      entries: [{ id: "replacement-1" }, { id: "replacement-2" }],
      continuation: { kind: "journal-replacement-order" },
    });
    expect(initial.getState().rulesProcess).toMatchObject({ stage: "replacement-ordering" });
    expect(initial.getState().rulesProcess?.resolutionEventGroups[0]).toMatchObject({
      eventGroupId: "process-3:resolution-1",
      events: [{ name: "deal-damage", data: { amount: 5 } }],
    });

    const first = new FabMatchRuntime(structuredClone(initial.getState()));
    const restored = new FabMatchRuntime(structuredClone(initial.getState()));
    for (const runtime of [first, restored]) {
      const decision = runtime.getState().decision!;
      expect(
        dispatchTestCommand(runtime, "answer-decision", "p2", {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "ordering", orderedIds: ["replacement-2", "replacement-1"] },
        }).accepted,
      ).toBe(true);
    }

    expect(restored.getState()).toEqual(first.getState());
    expect(first.getState().players.p2!.life).toBe(18);
    expect(first.getState().replacementEffects).toEqual([]);
    expect(rulesEffectEvents(first.committedEvents()).map((event) => event.name)).toEqual([
      "prevent",
      "prevent",
      "deal-damage",
      "dealt-damage",
    ]);
    expect(
      rulesEffectEvents(first.committedEvents())
        .slice(0, 2)
        .map((event) => event.data),
    ).toMatchObject([{ preventedAmount: 2 }, { preventedAmount: 1 }]);
    expect(rulesEffectEvents(first.committedEvents())[2]).toMatchObject({ data: { amount: 2 } });
  });

  it("persists an opt partition decision and resumes the exact layer after restoration", () => {
    const { state } = setup({
      kind: "effect",
      effect: { type: "opt", count: 2 },
    });
    for (const instanceId of ["deck1", "deck2"]) {
      registerTestObject(state, instanceId, instanceId, "p1");
      state.cardDefinitions[instanceId] = registerFabCardDefinition({
        canonicalId: instanceId,
        name: instanceId,
        types: ["Action"],
      });
      state.containers.zonesByPlayerId["p1"]!.deck.push(instanceId);
    }
    const initial = new FabMatchRuntime(state);
    dispatchTestCommand(initial, "pass", "p1", {});
    expect(dispatchTestCommand(initial, "pass", "p2", {}).accepted).toBe(true);
    expect(initial.getState().decision).toMatchObject({
      kind: "partition",
      continuation: { kind: "effect-resolution", layerId: "layer-1", effectPath: [0] },
    });

    const runtime = new FabMatchRuntime(structuredClone(initial.getState()));
    const decision = runtime.getState().decision!;
    expect(
      dispatchTestCommand(runtime, "answer-decision", "p1", {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "partition", groups: { top: ["deck1"], bottom: ["deck2"] } },
      }).accepted,
    ).toBe(true);
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.deck.slice(-2)).toEqual([
      "deck2",
      "deck1",
    ]);
    expect(rulesEffectEvents(runtime.committedEvents())[0]).toMatchObject({
      name: "opt",
      data: { top: ["deck1"], bottom: ["deck2"] },
    });
    expect(runtime.getState().rulesStack).toEqual([]);
  });

  it("persists a generic effect choice and resolves only the selected branch", () => {
    const { runtime: initial } = setup({
      kind: "effect",
      effect: {
        type: "choice",
        options: [
          { type: "gain-life", amount: 1, target: { selector: "controller" } },
          { type: "gain-life", amount: 3, target: { selector: "controller" } },
        ],
      },
    });
    const before = initial.getState().players.p1!.life;
    dispatchTestCommand(initial, "pass", "p1", {});
    expect(dispatchTestCommand(initial, "pass", "p2", {}).accepted).toBe(true);
    expect(initial.getState().decision).toMatchObject({
      kind: "effect-resolution",
      continuation: { kind: "effect-resolution", effectPath: [0] },
    });
    const runtime = new FabMatchRuntime(structuredClone(initial.getState()));
    const decision = runtime.getState().decision!;
    expect(
      dispatchTestCommand(runtime, "answer-decision", "p1", {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "effect-resolution", optionId: "option-1" },
      }).accepted,
    ).toBe(true);
    expect(runtime.getState().players.p1!.life).toBe(before + 3);
    expect(rulesEffectEvents(runtime.committedEvents()).map((event) => event.name)).toEqual([
      "gain-life",
    ]);
  });

  it("adds and removes named counters through ordered child events", () => {
    const { state } = setup({
      kind: "effect",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "add-counter",
            counter: { kind: "named", name: "steam" },
            count: 2,
            target: { selector: "self" },
          },
          {
            type: "remove-counters",
            counter: { kind: "named", name: "steam" },
            count: 1,
            target: { selector: "self" },
          },
        ],
      },
    });
    registerTestObject(state, "source-1", "source", "p1");
    state.cardDefinitions.source = registerFabCardDefinition({
      canonicalId: "source",
      name: "Source",
      types: ["Action", "Aura"],
      power: 0,
    });
    state.containers.zonesByPlayerId["p1"]!.arena.push("source-1");
    const runtime = new FabMatchRuntime(state);
    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {})).toMatchObject({ accepted: true });

    expect(runtime.getState().objects["source-1"]?.counters).toContainEqual({
      kind: "named",
      name: "steam",
      count: 1,
    });
    expect(rulesEffectEvents(runtime.committedEvents()).map((event) => event.name)).toEqual([
      "counter-added",
      "counter-removed",
    ]);
  });

  it("binds each declared target to its exact effect path", () => {
    const { state } = setup({
      kind: "effect",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "destroy",
            target: { selector: "object", declared: "on-stack", zones: ["permanent"], count: 1 },
          },
          {
            type: "banish",
            target: { selector: "object", declared: "on-stack", zones: ["permanent"], count: 1 },
          },
        ],
      },
    });
    registerTestObject(state, "target1", "aura", "p2");
    registerTestObject(state, "target2", "aura", "p2");
    state.cardDefinitions.aura = registerFabCardDefinition({
      canonicalId: "aura",
      name: "Aura",
      types: ["Action", "Aura"],
    });
    state.containers.zonesByPlayerId["p2"]!.arena.push("target1", "target2");
    const layer = state.rulesStack[0]!;
    if (layer.kind === "card") throw new Error("Expected an ability layer.");
    state.rulesStack[0] = {
      ...layer,
      targets: {
        "effect-0:step-0:target": [
          {
            kind: "object",
            ref: { instanceId: "target1", incarnation: state.objects.target1!.incarnation },
          },
        ],
        "effect-0:step-1:target": [
          {
            kind: "object",
            ref: { instanceId: "target2", incarnation: state.objects.target2!.incarnation },
          },
        ],
      },
    };
    retainMissingTargetLki(state);
    const runtime = new FabMatchRuntime(state);
    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);

    expect(runtime.getState().containers.zonesByPlayerId["p2"]!.graveyard).toEqual(["target1"]);
    expect(runtime.getState().containers.zonesByPlayerId["p2"]!.banished).toEqual(["target2"]);
    expect(rulesEffectEvents(runtime.committedEvents()).map((event) => event.name)).toEqual([
      "destroy",
      "leave-arena",
      "enter-or-leave-arena",
      "put-into-graveyard",
      "banish",
      "leave-arena",
      "enter-or-leave-arena",
    ]);
  });

  it("lets a later effect resolve when an earlier declared target has disappeared", () => {
    const { state } = setup({
      kind: "effect",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "destroy",
            target: { selector: "object", declared: "on-stack", zones: ["permanent"], count: 1 },
          },
          { type: "gain-life", amount: 2, target: { selector: "controller" } },
        ],
      },
    });
    const layer = state.rulesStack[0]!;
    if (layer.kind === "card") throw new Error("Expected an ability layer.");
    state.rulesStack[0] = {
      ...layer,
      targets: {
        "effect-0:step-0:target": [
          { kind: "object", ref: { instanceId: "missing-target", incarnation: 1 } },
        ],
      },
    };
    retainMissingTargetLki(state);
    const before = state.players.p1!.life;
    const runtime = new FabMatchRuntime(state);
    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);

    expect(runtime.getState().players.p1!.life).toBe(before + 2);
    expect(rulesEffectEvents(runtime.committedEvents()).map((event) => event.name)).toEqual([
      "gain-life",
    ]);
  });

  it("keeps legal members of a multi-target effect and drops only illegal members", () => {
    const { state } = setup({
      kind: "effect",
      effect: {
        type: "destroy",
        target: { selector: "object", declared: "on-stack", zones: ["permanent"], count: 2 },
      },
    });
    registerTestObject(state, "legal-target", "aura", "p2");
    state.cardDefinitions.aura = registerFabCardDefinition({
      canonicalId: "aura",
      name: "Aura",
      types: ["Action", "Aura"],
    });
    state.containers.zonesByPlayerId.p2!.arena.push("legal-target");
    const layer = state.rulesStack[0]!;
    if (layer.kind === "card") throw new Error("Expected an ability layer.");
    state.rulesStack[0] = {
      ...layer,
      targets: {
        "effect-0:target": [
          {
            kind: "object",
            ref: {
              instanceId: "legal-target",
              incarnation: state.objects["legal-target"]!.incarnation,
            },
          },
          { kind: "object", ref: { instanceId: "missing-target", incarnation: 1 } },
        ],
      },
    };
    retainMissingTargetLki(state);
    const runtime = new FabMatchRuntime(state);
    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);

    expect(runtime.getState().containers.zonesByPlayerId.p2!.graveyard).toContain("legal-target");
    expect(rulesEffectEvents(runtime.committedEvents()).map((event) => event.name)).toContain(
      "destroy",
    );
  });

  it.each([
    [true, 2, ["gain-life"]],
    [false, 0, []],
  ] as const)(
    "persists and resumes an optional effect choice (%s)",
    (accept, lifeGain, eventNames) => {
      const { runtime: initial } = setup({
        kind: "effect",
        effect: {
          type: "optional",
          effect: { type: "gain-life", amount: 2, target: { selector: "controller" } },
        },
      });
      const before = initial.getState().players.p1!.life;
      dispatchTestCommand(initial, "pass", "p1", {});
      expect(dispatchTestCommand(initial, "pass", "p2", {}).accepted).toBe(true);
      expect(initial.getState().decision).toMatchObject({
        kind: "boolean",
        continuation: { kind: "optional-effect", effectPath: [0] },
      });
      const runtime = new FabMatchRuntime(structuredClone(initial.getState()));
      const decision = runtime.getState().decision!;
      expect(
        dispatchTestCommand(runtime, "answer-decision", "p1", {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: accept },
        }).accepted,
      ).toBe(true);

      expect(runtime.getState().players.p1!.life).toBe(before + lifeGain);
      expect(rulesEffectEvents(runtime.committedEvents()).map((event) => event.name)).toEqual(
        eventNames,
      );
      expect(runtime.getState().rulesStack).toEqual([]);
      expect(runtime.getState().decision).toBeNull();
    },
  );

  it("persists an optional arsenal defender choice and commits it through the defend reducer", () => {
    const { state } = setup({
      kind: "effect",
      effect: {
        type: "optional",
        effect: {
          type: "add-defending",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "any",
            zones: ["arsenal"],
            filter: {
              typeBox: {
                types: ["Action"],
              },
            },
            count: 1,
          },
        },
      },
    });
    registerTestObject(state, "attack1", "attack", "p2");
    state.cardDefinitions.attack = registerFabCardDefinition({
      canonicalId: "attack",
      name: "Attack",
      types: ["Action", "Attack"],
      power: 4,
    });
    state.containers.zonesByPlayerId["p2"]!.combatChain.push("attack1");
    registerTestObject(state, "hero1", "hero", "p1");
    state.cardDefinitions.hero = registerFabCardDefinition({
      canonicalId: "hero",
      name: "Defending Hero",
      types: ["Hero"],
    });
    state.containers.zonesByPlayerId["p1"]!.heroZone = ["hero1"];
    registerTestObject(state, "arsenal1", "defender", "p1");
    state.cardDefinitions.defender = registerFabCardDefinition({
      canonicalId: "defender",
      name: "Arsenal Defender",
      types: ["Action"],
      defense: 3,
    });
    state.containers.zonesByPlayerId["p1"]!.arsenal.push("arsenal1");
    registerTestObject(state, "arsenal2", "defender", "p1");
    state.containers.zonesByPlayerId["p1"]!.arsenal.push("arsenal2");
    registerTestObject(state, "opponentArsenal", "defender", "p2");
    state.containers.zonesByPlayerId["p2"]!.arsenal.push("opponentArsenal");
    state.combat = {
      open: true,
      step: "reaction",
      activeLink: {
        activeAttack: { kind: "card", sourceObjectId: fabObjectInstanceId("attack1") },
        attackingPlayerId: fabPlayerId("p2"),
        defendingPlayerId: fabPlayerId("p1"),
        attackTargetRef: {
          kind: "hero",
          playerId: fabPlayerId("p1"),
        },
        defendingInstanceIdsByTarget: { p1: [] },
        defendingOrigins: {},
        damage: { status: "pending", outcomes: [] },
        wagers: [],
      },
      defenseDeclarationPending: false,
      chainLinkNumber: 1,
      closedLinks: [],
    };
    openFabPriority(state, "p1", "layer", "reaction");
    const initial = new FabMatchRuntime(state);
    dispatchTestCommand(initial, "pass", "p1", {});
    expect(dispatchTestCommand(initial, "pass", "p2", {}).accepted).toBe(true);
    expect(initial.getState().decision).toMatchObject({ kind: "boolean" });

    let runtime = new FabMatchRuntime(structuredClone(initial.getState()));
    let decision = runtime.getState().decision!;
    expect(
      dispatchTestCommand(runtime, "answer-decision", "p1", {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "boolean", value: true },
      }).accepted,
    ).toBe(true);
    expect(runtime.getState().decision).toMatchObject({
      kind: "entity-target",
      candidates: [
        { instanceId: "arsenal1", label: "Arsenal Defender" },
        { instanceId: "arsenal2", label: "Arsenal Defender" },
        { instanceId: "opponentArsenal", label: "Arsenal Defender" },
      ],
      continuation: { kind: "effect-resolution", effectPath: [0, 0] },
    });

    runtime = new FabMatchRuntime(structuredClone(runtime.getState()));
    decision = runtime.getState().decision!;
    expect(
      dispatchTestCommand(runtime, "answer-decision", "p1", {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "entity-target", instanceIds: ["arsenal1"] },
      }).accepted,
    ).toBe(true);

    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.arsenal).toEqual(["arsenal2"]);
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.combatChain).toEqual(["arsenal1"]);
    expect(runtime.getState().combat?.activeLink).toMatchObject({
      defendingInstanceIdsByTarget: { p1: ["arsenal1"] },
      defendingOrigins: { arsenal1: { kind: "arsenal" } },
    });
    expect(rulesEffectEvents(runtime.committedEvents())).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "defend",
          data: expect.objectContaining({ actorId: "p1", from: "arsenal" }),
          bindings: expect.objectContaining({
            defendingCard: expect.objectContaining({ instanceId: "arsenal1" }),
            attack: expect.objectContaining({ instanceId: "attack1" }),
          }),
        }),
      ]),
    );
  });

  it("persists a play permission for the exact selected object", () => {
    const { state } = setup({
      kind: "effect",
      effect: {
        type: "play-card",
        fromZones: ["hand"],
        source: {
          selector: "object",
          declared: "at-resolution",
          player: "any",
          zones: ["hand"],
          filter: {
            typeBox: {
              types: ["Action"],
            },
          },
          count: 1,
        },
        costModification: "free",
        duration: "this-turn",
        asType: "instant",
      },
    });
    registerTestObject(state, "action1", "action", "p1");
    state.cardDefinitions.action = registerFabCardDefinition({
      canonicalId: "action",
      name: "Permitted Action",
      types: ["Action"],
      cost: 3,
    });
    state.containers.zonesByPlayerId["p1"]!.hand.push("action1");
    registerTestObject(state, "action2", "action", "p1");
    state.containers.zonesByPlayerId["p1"]!.hand.push("action2");
    registerTestObject(state, "opponentAction", "action", "p2");
    state.containers.zonesByPlayerId["p2"]!.hand.push("opponentAction");
    const initial = new FabMatchRuntime(state);
    dispatchTestCommand(initial, "pass", "p1", {});
    expect(dispatchTestCommand(initial, "pass", "p2", {}).accepted).toBe(true);
    expect(initial.getState().decision).toMatchObject({
      kind: "entity-target",
      candidates: [
        { instanceId: "action1", label: "Permitted Action" },
        { instanceId: "action2", label: "Permitted Action" },
        { instanceId: "opponentAction", label: "Permitted Action" },
      ],
      continuation: { kind: "effect-resolution", effectPath: [0] },
    });

    const runtime = new FabMatchRuntime(structuredClone(initial.getState()));
    const decision = runtime.getState().decision!;
    expect(
      dispatchTestCommand(runtime, "answer-decision", "p1", {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "entity-target", instanceIds: ["action1"] },
      }).accepted,
    ).toBe(true);

    expect(runtime.getState().continuousEffectInstances).toMatchObject([
      {
        effectId: "process-3:layer-1:effect-0:play-permission",
        controllerId: "p1",
        initialSubjects: [{ instanceId: "action1" }],
        futureApplicability: null,
        duration: "this-turn",
        atoms: [
          {
            kind: "rule",
            parameters: {
              kind: "play-card",
              costModification: "free",
              asType: "instant",
              fromZones: ["hand"],
            },
          },
        ],
        expiresAt: { kind: "turn", turnNumber: 1 },
      },
    ]);
    expect(rulesEffectEvents(runtime.committedEvents())).toMatchObject([
      {
        name: "continuous-effect-generated",
        affected: [{ instanceId: "action1" }],
      },
      {
        name: "continuous-effect-applied",
        affected: [{ instanceId: "action1" }],
      },
    ]);

    const resourcesBefore = runtime.getState().players.p1!.resourcePoints;
    const actionPointsBefore = runtime.getState().players.p1!.actionPoints;
    expect(
      dispatchTestCommand(runtime, "begin-play", "p1", { instanceId: "action1" }).accepted,
    ).toBe(true);
    expect(runtime.getState().decision).toBeNull();
    expect(runtime.getState().players.p1).toMatchObject({
      resourcePoints: resourcesBefore,
      actionPoints: actionPointsBefore,
    });
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.stack).toEqual(["action1"]);
    expect(runtime.getState().rulesStack).toMatchObject([
      {
        kind: "card",
        instanceId: "action1",
        playTiming: "instant",
        role: "action",
      },
    ]);
    expect(runtime.getState().continuousEffectInstances).toEqual([]);
    // The compact snapshot deliberately does not carry a cross-dispatch event
    // journal.  The player-visible state above proves the permission was used;
    // event ordering remains transaction-kernel coverage rather than a rules
    // outcome assertion here.
    expect(runtime.getState().rulesStack[0]).toMatchObject({
      kind: "card",
      instanceId: "action1",
    });
  });

  it("lets an explicit instant permission override Action // Instant meld timing", () => {
    const { state } = setup({
      kind: "effect",
      effect: {
        type: "play-card",
        fromZones: ["hand"],
        source: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["hand"],
          filter: {
            typeBox: {
              types: ["Action"],
            },
          },
          count: 1,
        },
        costModification: "free",
        duration: "this-turn",
        asType: "instant",
      },
    });
    const canonicalId = arcaneSeedsLifeRed.canonicalId;
    registerTestObject(state, "meld1", canonicalId, "p1");
    state.cardDefinitions[canonicalId] = registerFabCardDefinition(arcaneSeedsLifeRed);
    state.containers.zonesByPlayerId.p1!.hand.push("meld1");

    const runtime = new FabMatchRuntime(state);
    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    const decision = runtime.getState().decision;
    if (decision?.kind === "entity-target") {
      expect(decision).toMatchObject({
        kind: "entity-target",
        candidates: [{ instanceId: "meld1" }],
      });
      expect(
        dispatchTestCommand(runtime, "answer-decision", "p1", {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: ["meld1"] },
        }).accepted,
      ).toBe(true);
    }

    const actionPointsBefore = runtime.getState().players.p1!.actionPoints;
    const playResult = dispatchTestCommand(runtime, "begin-play", "p1", {
      instanceId: "meld1",
      playMethod: { kind: "meld" },
    });
    expect(playResult).toMatchObject({ accepted: true });
    expect(runtime.getState().players.p1!.actionPoints).toBe(actionPointsBefore);
    expect(runtime.getState().rulesStack).toMatchObject([
      {
        kind: "card",
        instanceId: "meld1",
        propertyState: { kind: "meld" },
        playTiming: "instant",
        role: "action",
      },
    ]);
  });

  it("equips a selected object through one atomic move-and-equip batch", () => {
    const { state } = setup({
      kind: "effect",
      effect: {
        type: "equip",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "any",
          zones: ["hand"],
          filter: {
            typeBox: {
              types: ["Equipment"],
            },
          },
          count: 1,
        },
      },
    });
    registerTestObject(state, "head1", "head", "p1");
    state.cardDefinitions.head = registerFabCardDefinition({
      canonicalId: "head",
      name: "Event-Native Helm",
      types: ["Guardian", "Equipment", "Head"],
      defense: 1,
    });
    state.containers.zonesByPlayerId["p1"]!.hand.push("head1");
    registerTestObject(state, "head2", "head", "p1");
    state.containers.zonesByPlayerId["p1"]!.hand.push("head2");
    registerTestObject(state, "opponentHead", "head", "p2");
    state.containers.zonesByPlayerId["p2"]!.hand.push("opponentHead");
    const initial = new FabMatchRuntime(state);
    dispatchTestCommand(initial, "pass", "p1", {});
    expect(dispatchTestCommand(initial, "pass", "p2", {}).accepted).toBe(true);
    expect(initial.getState().decision).toMatchObject({
      kind: "entity-target",
      candidates: [
        { instanceId: "head1", label: "Event-Native Helm" },
        { instanceId: "head2", label: "Event-Native Helm" },
        { instanceId: "opponentHead", label: "Event-Native Helm" },
      ],
    });

    const runtime = new FabMatchRuntime(structuredClone(initial.getState()));
    const decision = runtime.getState().decision!;
    expect(
      dispatchTestCommand(runtime, "answer-decision", "p1", {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "entity-target", instanceIds: ["head1"] },
      }).accepted,
    ).toBe(true);

    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.hand).toEqual(["head2"]);
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.head).toEqual(["head1"]);
    expect(rulesEffectEvents(runtime.committedEvents()).map((event) => event.name)).toEqual([
      "move-zone",
      "enter-arena",
      "enter-or-leave-arena",
      "equip",
    ]);
    expect(
      new Set(rulesEffectEvents(runtime.committedEvents()).map((event) => event.batchId)).size,
    ).toBe(1);
    expect(
      rulesEffectEvents(runtime.committedEvents()).find((event) => event.name === "equip"),
    ).toMatchObject({
      data: { playerId: "p1", from: "hand", to: "equipment-head", reason: "equip" },
    });
  });

  it("pitches the selected card through the canonical pitch reducer", () => {
    const { state } = setup({
      kind: "effect",
      effect: {
        type: "pitch-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "any",
          zones: ["hand"],
          count: 1,
        },
      },
    });
    registerTestObject(state, "blue1", "blue", "p1");
    state.cardDefinitions.blue = registerFabCardDefinition({
      canonicalId: "blue",
      name: "Blue Pitch Card",
      types: ["Action"],
      pitch: 3,
    });
    state.containers.zonesByPlayerId["p1"]!.hand.push("blue1");
    registerTestObject(state, "blue2", "blue", "p1");
    state.containers.zonesByPlayerId["p1"]!.hand.push("blue2");
    registerTestObject(state, "opponentBlue", "blue", "p2");
    state.containers.zonesByPlayerId["p2"]!.hand.push("opponentBlue");
    const resourcesBefore = state.players.p1!.resourcePoints;
    const initial = new FabMatchRuntime(state);
    dispatchTestCommand(initial, "pass", "p1", {});
    expect(dispatchTestCommand(initial, "pass", "p2", {}).accepted).toBe(true);
    const runtime = new FabMatchRuntime(structuredClone(initial.getState()));
    const decision = runtime.getState().decision!;
    expect(
      dispatchTestCommand(runtime, "answer-decision", "p1", {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "entity-target", instanceIds: ["blue1"] },
      }).accepted,
    ).toBe(true);

    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.hand).toEqual(["blue2"]);
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.pitch).toEqual(["blue1"]);
    expect(runtime.getState().players.p1!.resourcePoints).toBe(resourcesBefore + 3);
    expect(rulesEffectEvents(runtime.committedEvents())).toMatchObject([
      {
        name: "pitch",
        data: { playerId: "p1", resourcesGenerated: 3 },
        bindings: { pitchedCard: { instanceId: "blue1", zone: "hand" } },
      },
    ]);
  });

  it("persists a search selection and deterministically resumes move and shuffle after restoration", () => {
    const { state } = setup({
      kind: "effect",
      effect: {
        type: "search",
        zones: ["deck"],
        filter: {
          typeBox: {
            types: ["Action"],
          },
        },
        to: { zone: "hand" },
      },
    });
    for (const instanceId of ["search1", "search2", "search3"]) {
      registerTestObject(state, instanceId, instanceId, "p1");
      state.cardDefinitions[instanceId] = registerFabCardDefinition({
        canonicalId: instanceId,
        name: instanceId,
        types: ["Action"],
      });
      state.containers.zonesByPlayerId["p1"]!.deck.push(instanceId);
    }
    const initial = new FabMatchRuntime(state);
    dispatchTestCommand(initial, "pass", "p1", {});
    expect(dispatchTestCommand(initial, "pass", "p2", {}).accepted).toBe(true);
    expect(initial.getState().decision).toMatchObject({
      kind: "entity-target",
      min: 1,
      max: 1,
      continuation: { kind: "effect-resolution", layerId: "layer-1", effectPath: [0] },
    });

    const first = new FabMatchRuntime(structuredClone(initial.getState()));
    const restored = new FabMatchRuntime(structuredClone(initial.getState()));
    for (const runtime of [first, restored]) {
      const decision = runtime.getState().decision!;
      expect(
        dispatchTestCommand(runtime, "answer-decision", "p1", {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: ["search2"] },
        }).accepted,
      ).toBe(true);
    }

    expect(restored.getState()).toEqual(first.getState());
    expect(first.getState().containers.zonesByPlayerId["p1"]!.hand).toContain("search2");
    expect(first.getState().containers.zonesByPlayerId["p1"]!.deck).toHaveLength(2);
    expect(rulesEffectEvents(first.committedEvents()).map((event) => event.name)).toEqual([
      "search",
      "move-zone",
      "shuffle-zone",
    ]);
    expect(first.getState().rulesStack).toEqual([]);
  });

  it("shuffles a zone through the deterministic event reducer", () => {
    const { state } = setup({ kind: "effect", effect: { type: "shuffle", zone: "deck" } });
    for (const instanceId of ["shuffle1", "shuffle2", "shuffle3", "shuffle4"]) {
      registerTestObject(state, instanceId, instanceId, "p1");
      state.cardDefinitions[instanceId] = registerFabCardDefinition({
        canonicalId: instanceId,
        name: instanceId,
        types: ["Action"],
      });
      state.containers.zonesByPlayerId["p1"]!.deck.push(instanceId);
    }
    const before = [...state.containers.zonesByPlayerId["p1"]!.deck];
    const runtime = new FabMatchRuntime(state);
    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);

    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.deck).not.toEqual(before);
    expect(new Set(runtime.getState().containers.zonesByPlayerId["p1"]!.deck)).toEqual(
      new Set(before),
    );
    expect(rulesEffectEvents(runtime.committedEvents()).map((event) => event.name)).toEqual([
      "shuffle-zone",
    ]);
  });

  it("evaluates a conditional at resolution and persists a decision in the selected branch", () => {
    const { runtime } = setup({
      kind: "effect",
      effect: {
        type: "conditional",
        condition: { type: "turn-player", who: "self" },
        then: {
          type: "optional",
          effect: { type: "gain-life", amount: 2, target: { selector: "controller" } },
        },
        else: { type: "lose-life", amount: 2, target: { selector: "controller" } },
      },
    });
    const before = runtime.getState().players.p1!.life;
    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(runtime.getState().decision).toMatchObject({
      kind: "boolean",
      continuation: { kind: "optional-effect", effectPath: [0, 0] },
    });
    const decision = runtime.getState().decision!;
    expect(
      dispatchTestCommand(runtime, "answer-decision", "p1", {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "boolean", value: true },
      }).accepted,
    ).toBe(true);
    expect(runtime.getState().players.p1!.life).toBe(before + 2);
    expect(rulesEffectEvents(runtime.committedEvents()).map((event) => event.name)).toEqual([
      "gain-life",
    ]);
  });

  it("persists a permanent power effect and exposes its evaluated value", () => {
    const { state } = setup({
      kind: "effect",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: { selector: "self" },
        duration: "permanent",
      },
    });
    registerTestObject(state, "source-1", "source", "p1");
    state.cardDefinitions.source = registerFabCardDefinition({
      canonicalId: "source",
      name: "Source",
      types: ["Action", "Aura"],
      power: 0,
    });
    state.containers.zonesByPlayerId["p1"]!.arena.push("source-1");
    const runtime = new FabMatchRuntime(state);
    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    const source = runtime.getState().objects["source-1"]!;
    expect(
      buildFabRulesView(runtime.getState()).object({
        instanceId: source.instanceId,
        incarnation: source.incarnation,
      })?.current.numeric.power,
    ).toBe(2);
    expect(rulesEffectEvents(runtime.committedEvents())[0]).toMatchObject({
      name: "continuous-effect-generated",
      data: {
        effectId: "process-3:layer-1:effect-0:continuous",
        atoms: [{ kind: "numeric", property: "power", operation: "add", amount: 2 }],
      },
    });
    expect(rulesEffectEvents(runtime.committedEvents())).toContainEqual(
      expect.objectContaining({
        name: "continuous-effect-applied",
        data: {
          application: expect.objectContaining({
            contribution: expect.objectContaining({
              kind: "numeric",
              property: "power",
              previousValue: 0,
              value: 2,
              delta: 2,
            }),
          }),
        },
      }),
    );
    expect(rulesEffectEvents(runtime.committedEvents())).toContainEqual(
      expect.objectContaining({
        name: "modify-power",
        data: expect.objectContaining({ from: 0, to: 2 }),
      }),
    );
  });

  it("rolls through the persisted RNG reducer and records the deterministic result binding", () => {
    const resolution: FabTriggeredLayer["resolution"] = {
      kind: "effect",
      effect: { type: "roll", sides: 6, outputBinding: "die" },
    };
    const first = setup(resolution).runtime;
    const second = setup(resolution).runtime;
    for (const runtime of [first, second]) {
      dispatchTestCommand(runtime, "pass", "p1", {});
      expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    }
    expect(second.getState()).toEqual(first.getState());
    expect(rulesEffectEvents(first.committedEvents()).map((event) => event.name)).toEqual([
      "roll-request",
      "roll",
    ]);
    expect(rulesEffectEvents(first.committedEvents())[1]).toMatchObject({
      name: "roll",
      data: { sides: 6 },
      bindings: { die: expect.any(Number) },
    });
  });

  it("expands a bounded repeat into deterministic child events in one batch", () => {
    const { runtime } = setup({
      kind: "effect",
      effect: {
        type: "repeat",
        times: 3,
        effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
      },
    });
    const before = runtime.getState().players.p1!.life;
    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(runtime.getState().players.p1!.life).toBe(before + 3);
    expect(rulesEffectEvents(runtime.committedEvents()).map((event) => event.name)).toEqual([
      "gain-life",
      "gain-life",
      "gain-life",
    ]);
    expect(
      new Set(rulesEffectEvents(runtime.committedEvents()).map((event) => event.batchId)).size,
    ).toBe(3);
  });

  it("ends the game through a terminal event without collecting later triggers", () => {
    const { runtime } = setup({
      kind: "effect",
      effect: { type: "lose-game", player: "opponent" },
    });
    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(runtime.getState()).toMatchObject({
      gameEnded: true,
      winnerId: "p1",
      rulesProcess: null,
      decision: null,
    });
    expect(rulesEffectEvents(runtime.committedEvents()).map((event) => event.name)).toEqual([
      "lose-game",
    ]);
  });

  it("changes object status and tapped state only through reducer events", () => {
    const { state } = setup({
      kind: "effect",
      effect: {
        type: "sequence",
        steps: [
          { type: "set-status", status: "marked-object", target: { selector: "self" } },
          { type: "tap", target: { selector: "self" } },
          { type: "untap", target: { selector: "self" } },
        ],
      },
    });
    registerTestObject(state, "source-1", "source", "p1");
    state.cardDefinitions.source = registerFabCardDefinition({
      canonicalId: "source",
      name: "Source",
      types: ["Action", "Aura"],
    });
    state.containers.zonesByPlayerId["p1"]!.arena.push("source-1");
    const runtime = new FabMatchRuntime(state);
    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(runtime.getState().objects["source-1"]?.markers).toContainEqual({
      kind: "status",
      value: "marked-object",
    });
    expect(runtime.getState().objects["source-1"]?.markers).not.toContainEqual({ kind: "tapped" });
    expect(rulesEffectEvents(runtime.committedEvents()).map((event) => event.name)).toEqual([
      "set-status",
      "set-tapped",
      "set-tapped",
    ]);
  });

  it("is deterministic across identical moves and restoration between priority passes", () => {
    const resolution: FabTriggeredLayer["resolution"] = {
      kind: "effect",
      effect: { type: "gain-life", amount: 2, target: { selector: "controller" } },
    };
    const first = setup(resolution).runtime;
    const second = setup(resolution).runtime;
    dispatchTestCommand(first, "pass", "p1", {});
    dispatchTestCommand(second, "pass", "p1", {});
    expect(first.getState()).toMatchObject({
      stateID: 1,
      priority: { holderPlayerId: "p2", consecutivePasses: 1 },
    });
    expect(first.committedEvents()).toEqual([]);
    const restored = new FabMatchRuntime(structuredClone(second.getState()));
    dispatchTestCommand(first, "pass", "p2", {});
    dispatchTestCommand(restored, "pass", "p2", {});

    expect(restored.getState()).toEqual(first.getState());
    expect(first.getState()).toMatchObject({
      stateID: 2,
      priority: { consecutivePasses: 0 },
    });
    expect(rulesEffectEvents(first.committedEvents())[0]).toMatchObject({
      eventId: "event-3",
      batchId: "batch-3",
      processId: "process-3",
      name: "gain-life",
    });
  });
});
import { dispatchTestCommand } from "../testing/test-command.ts";
