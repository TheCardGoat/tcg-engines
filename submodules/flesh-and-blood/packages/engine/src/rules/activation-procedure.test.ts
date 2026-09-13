import { describe, expect, it } from "vitest";
import {
  registerFabCardDefinition,
  type FabCardDefinitionInput,
  type FabLooseCardDefinitionInput,
  type FabRegisteredCardDefinition,
} from "../cards.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { FabMatchRuntime } from "../runtime.ts";
import { FAB_RUNTIME_TEST_RECEIPT } from "../runtime-access.ts";
import { quoteFabActivation } from "../procedures/activate-ability/index.ts";
import type { FabCounterRecord, FabMatchState, FabObjectMarker } from "../state.ts";
import { fabCanonicalCardId, fabObjectInstanceId, fabPlayerId } from "../game/identity.ts";
import { typeBoxTokens } from "@tcg/flesh-and-blood-types";

function addObject(
  state: FabMatchState,
  instanceId: string,
  canonicalId: string,
  ownerId: string,
  options: {
    markers?: readonly FabObjectMarker[];
    counters?: readonly FabCounterRecord[];
    visibility?: "public" | "private";
  } = {},
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
    visibility: options.visibility ?? "private",
    activeFace: { kind: "single" },
    counters: options.counters ?? [],
    markers: options.markers ?? [],
    history: { moves: [] },
  };
}

function replaceCardDefinition(
  state: FabMatchState,
  canonicalId: string,
  changes: Partial<Omit<FabLooseCardDefinitionInput, "canonicalId">>,
): FabRegisteredCardDefinition {
  const current = state.cardDefinitions[canonicalId];
  if (!current) throw new Error(`Missing card definition ${canonicalId}`);
  const replacement = registerFabCardDefinition({
    canonicalId: current.canonicalId,
    slug: current.slug,
    layout: current.layout,
    name: current.base.names[0],
    types: typeBoxTokens(current.base.typeBox),
    traits: current.base.traits,
    color: current.base.color ?? undefined,
    pitch: current.base.numeric.pitch,
    cost: current.base.numeric.cost,
    power: current.base.numeric.power,
    defense: current.base.numeric.defense,
    health: current.base.numeric.life,
    intelligence: current.base.numeric.intellect,
    arcane: current.base.numeric.arcane,
    keywords: current.base.keywords,
    abilities: current.base.abilities,
    ...changes,
  });
  state.cardDefinitions[canonicalId] = replacement;
  return replacement;
}

function setup() {
  const state = FabTestEngine.createStateForRulesTest({
    seed: "activation-procedure",
    player1Id: "p1",
    player2Id: "p2",
    cardsMaps: { canonicalIdsByInstance: { item1: "item" }, owners: { p1: ["item1"], p2: [] } },
    cardDefinitions: {
      item: {
        canonicalId: "item",
        name: "Activation Item",
        types: ["Action", "Item"],
        abilities: [
          {
            id: "item-a1",
            kind: "activated",
            text: "Action — 1: Gain 1 life.",
            abilityType: "action",
            cost: { class: "asset", type: "resources", amount: 1 },
            effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
          },
        ],
      },
    },
  });
  state.containers.zonesByPlayerId["p1"]!.hand = [];
  state.containers.zonesByPlayerId["p1"]!.arena = ["item1"];
  state.players.p1!.resourcePoints = 1;
  return state;
}

describe("event-native FAB activation procedure", () => {
  it("quotes the exact evaluated activation, costs, declarations, and state version", () => {
    const state = setup();
    const quote = quoteFabActivation(state, {
      actorId: "p1",
      instanceId: "item1",
      abilityId: "item-a1",
    });

    expect(quote).toMatchObject({
      stateID: state.stateID,
      handled: true,
      allowed: true,
      ability: { id: "item-a1", kind: "activated" },
      source: { instanceId: "item1" },
      sourceZone: "arena",
      resourceCost: 1,
      chiCost: 0,
      lifeCost: 0,
      actionPointCost: 1,
      requiredDeclarations: [],
      effectIds: [],
      attackTarget: null,
    });
  });

  it("atomically pays assets, creates an activated layer, and resolves normally", () => {
    const runtime = new FabMatchRuntime(setup());
    const lifeBefore = runtime.getState().players.p1!.life;
    expect(
      dispatchTestCommand(runtime, "activate", "p1", { instanceId: "item1", ability: "item-a1" })
        .accepted,
    ).toBe(true);
    expect(runtime.getState().players.p1).toMatchObject({ resourcePoints: 0, actionPoints: 0 });
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.arena).toEqual(["item1"]);
    expect(runtime.getState().rulesStack).toMatchObject([
      {
        kind: "activated",
        abilityId: "item-a1",
        source: { instanceId: "item1", zone: "permanent" },
      },
    ]);
    expect(runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.map((event) => event.name)).toEqual([
      "announce-activation",
      "spend-assets",
      "activate",
    ]);

    expect(dispatchTestCommand(runtime, "pass", "p1", {}).accepted).toBe(true);
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(runtime.getState().players.p1!.life).toBe(lifeBefore + 1);
    expect(runtime.getState().rulesStack).toEqual([]);
    expect(runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.map((event) => event.name)).toEqual([
      "announce-activation",
      "spend-assets",
      "activate",
      "gain-life",
      "remove-rules-layer",
    ]);
  });

  it("pays a deterministic self-to-owner-deck cost and keeps source LKI on the layer", () => {
    const state = setup();
    state.objects.item1 = { ...state.objects.item1!, ownerId: fabPlayerId("p2") };
    addObject(state, "deck-bottom", "filler", "p2");
    addObject(state, "deck-top", "filler", "p2");
    state.cardDefinitions.filler = registerFabCardDefinition({
      canonicalId: "filler",
      name: "Deck Filler",
      types: ["Action"],
    });
    state.containers.zonesByPlayerId.p2!.deck = ["deck-bottom", "deck-top"];
    replaceCardDefinition(state, "item", {
      abilities: [
        {
          id: "item-a1",
          kind: "activated",
          text: "Instant — Put this on the bottom of its owner's deck: Gain 1 life.",
          abilityType: "instant",
          cost: {
            class: "effect",
            type: "move-to-deck",
            from: "self",
            position: "bottom",
            count: 1,
          },
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      ],
    });
    const sourceIncarnation = state.objects.item1!.incarnation;
    const runtime = new FabMatchRuntime(state);

    expect(
      dispatchTestCommand(runtime, "activate", "p1", { instanceId: "item1", ability: "item-a1" })
        .accepted,
    ).toBe(true);

    expect(runtime.getState().decision).toBeNull();
    expect(runtime.getState().containers.zonesByPlayerId.p1!.arena).not.toContain("item1");
    expect(runtime.getState().containers.zonesByPlayerId.p2!.deck).toEqual([
      "item1",
      "deck-bottom",
      "deck-top",
    ]);
    expect(runtime.getState().objects.item1!.incarnation).toBeGreaterThan(sourceIncarnation);
    expect(runtime.getState().rulesStack).toMatchObject([
      {
        kind: "activated",
        source: {
          instanceId: "item1",
          ref: { incarnation: sourceIncarnation },
          ownerId: "p2",
          zone: "permanent",
        },
      },
    ]);
    const events = runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents;
    expect(events.map((event) => event.name)).toEqual([
      "announce-activation",
      "spend-assets",
      "move-zone",
      "leave-arena",
      "enter-or-leave-arena",
      "activate",
    ]);
    expect(events.find((event) => event.name === "move-zone")).toMatchObject({
      source: { instanceId: "item1", ref: { incarnation: sourceIncarnation } },
      data: {
        object: { instanceId: "item1", ref: { incarnation: sourceIncarnation } },
        from: "permanent",
        to: "deck",
        position: "bottom",
        destinationPlayerId: "p2",
      },
    });
  });

  it("emits move-zone then owner-deck shuffle for a shuffle-self activation cost", () => {
    const state = setup();
    replaceCardDefinition(state, "item", {
      abilities: [
        {
          id: "item-a1",
          kind: "activated",
          text: "Instant — Shuffle this into its owner's deck: Gain 1 life.",
          abilityType: "instant",
          cost: {
            class: "effect",
            type: "move-to-deck",
            from: "self",
            position: "shuffle",
            count: 1,
          },
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      ],
    });
    const runtime = new FabMatchRuntime(state);

    expect(
      dispatchTestCommand(runtime, "activate", "p1", { instanceId: "item1", ability: "item-a1" })
        .accepted,
    ).toBe(true);

    const events = runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents;
    expect(events.map((event) => event.name)).toEqual([
      "announce-activation",
      "spend-assets",
      "move-zone",
      "leave-arena",
      "enter-or-leave-arena",
      "shuffle-zone",
      "activate",
    ]);
    expect(events.find((event) => event.name === "move-zone")).toMatchObject({
      data: { to: "deck", destinationPlayerId: "p1" },
    });
    expect(events.find((event) => event.name === "shuffle-zone")).toMatchObject({
      data: { playerId: "p1", zone: "deck" },
    });
  });

  it("fails closed for a non-deterministic multi-card self-to-deck cost", () => {
    const state = setup();
    replaceCardDefinition(state, "item", {
      abilities: [
        {
          id: "item-a1",
          kind: "activated",
          text: "Unsupported self move.",
          abilityType: "instant",
          cost: {
            class: "effect",
            type: "move-to-deck",
            from: "self",
            position: "bottom",
            count: 2,
          },
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      ],
    });
    const runtime = new FabMatchRuntime(state);
    const before = structuredClone(runtime.getState());

    expect(
      dispatchTestCommand(runtime, "activate", "p1", { instanceId: "item1", ability: "item-a1" }),
    ).toMatchObject({ accepted: false, errorCode: "unsupported_rules_activation" });
    expect(runtime.getState()).toEqual(before);
  });

  it("does not offer a private self-move source as pitch for its own activation", () => {
    const state = setup();
    state.players.p1!.resourcePoints = 0;
    state.containers.zonesByPlayerId.p1!.arena = [];
    state.containers.zonesByPlayerId.p1!.hand = ["item1"];
    replaceCardDefinition(state, "item", {
      types: ["Instant"],
      pitch: 3,
      abilities: [
        {
          id: "item-a1",
          kind: "activated",
          text: "Instant — 1, put this on the bottom of its owner's deck: Gain 1 life.",
          functionalZones: ["hand"],
          abilityType: "instant",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              { class: "asset", type: "resources", amount: 1 },
              {
                class: "effect",
                type: "move-to-deck",
                from: "self",
                position: "bottom",
                count: 1,
              },
            ],
          },
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      ],
    });
    const runtime = new FabMatchRuntime(state);
    const before = structuredClone(runtime.getState());

    expect(
      dispatchTestCommand(runtime, "activate", "p1", { instanceId: "item1", ability: "item-a1" }),
    ).toMatchObject({ accepted: false, errorCode: "insufficient_activation_assets" });
    expect(runtime.getState()).toEqual(before);
  });

  it("rejects an unpayable activation without changing authoritative state", () => {
    const state = setup();
    state.players.p1!.resourcePoints = 0;
    const runtime = new FabMatchRuntime(state);
    const before = structuredClone(runtime.getState());
    expect(
      dispatchTestCommand(runtime, "activate", "p1", { instanceId: "item1", ability: "item-a1" }),
    ).toMatchObject({
      accepted: false,
      errorCode: "insufficient_activation_assets",
    });
    expect(runtime.getState()).toEqual(before);
  });

  it("persists one-at-a-time pitch payment before publishing an activation journal", () => {
    const state = setup();
    state.players.p1!.resourcePoints = 0;
    addObject(state, "pitch1", "pitch", "p1");
    state.cardDefinitions.pitch = registerFabCardDefinition({
      canonicalId: "pitch",
      name: "Blue Pitch",
      types: ["Action"],
      pitch: 3,
    });
    state.containers.zonesByPlayerId["p1"]!.hand.push("pitch1");
    const initial = new FabMatchRuntime(state);
    expect(
      dispatchTestCommand(initial, "activate", "p1", { instanceId: "item1", ability: "item-a1" })
        .accepted,
    ).toBe(true);
    expect(initial.getState().decision).toMatchObject({
      kind: "payment",
      amount: 1,
      candidates: [{ instanceId: "pitch1", value: 3 }],
      continuation: { kind: "payment", procedure: "activate" },
    });
    expect(initial.getState().players.p1).toMatchObject({ resourcePoints: 0, actionPoints: 1 });
    expect(initial.getState().containers.zonesByPlayerId["p1"]!.hand).toEqual(["pitch1"]);

    const runtime = new FabMatchRuntime(structuredClone(initial.getState()));
    const decision = runtime.getState().decision!;
    expect(
      dispatchTestCommand(runtime, "answer-decision", "p1", {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "payment", instanceIds: ["pitch1"] },
      }).accepted,
    ).toBe(true);
    expect(runtime.getState().players.p1).toMatchObject({ resourcePoints: 2, actionPoints: 0 });
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.pitch).toEqual(["pitch1"]);
    expect(runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.map((event) => event.name)).toEqual([
      "announce-activation",
      "pitch",
      "spend-assets",
      "activate",
    ]);
    expect(runtime.getState().rulesStack[0]).toMatchObject({
      kind: "activated",
      abilityId: "item-a1",
    });
  });

  it("collects activate triggers after the enclosing procedure and adds them above the activated layer", () => {
    const state = setup();
    addObject(state, "watcher1", "watcher", "p1", { visibility: "public" });
    state.containers.zonesByPlayerId["p1"]!.arena.push("watcher1");
    state.cardDefinitions.watcher = registerFabCardDefinition({
      canonicalId: "watcher",
      name: "Activation Watcher",
      types: ["Action", "Aura"],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          id: "watcher-a1",
          text: "Whenever you activate an ability, gain 1 life.",
          trigger: {
            kind: "event",
            event: {
              name: "activate",
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
    });
    let runtime = new FabMatchRuntime(state);
    expect(
      dispatchTestCommand(runtime, "activate", "p1", { instanceId: "item1", ability: "item-a1" })
        .accepted,
    ).toBe(true);

    expect(runtime.getState().rulesStack.map((layer) => layer.kind)).toEqual([
      "activated",
      "triggered",
    ]);
    expect(runtime.getState().rulesStack[1]).toMatchObject({
      kind: "triggered",
      abilityId: "watcher-a1",
      triggeringEvent: { name: "activate" },
    });
  });

  it("pays destroy-self through the event journal and retains immutable source LKI on the layer", () => {
    const state = setup();
    replaceCardDefinition(state, "item", {
      abilities: [
        {
          id: "item-a1",
          kind: "activated",
          text: "Action — 1, destroy this: Gain 1 life.",
          abilityType: "action",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              { class: "asset", type: "resources", amount: 1 },
              { class: "effect", type: "destroy-self" },
            ],
          },
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      ],
    });
    let runtime = new FabMatchRuntime(state);

    expect(
      dispatchTestCommand(runtime, "activate", "p1", { instanceId: "item1", ability: "item-a1" })
        .accepted,
    ).toBe(true);

    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.arena).toEqual([]);
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.graveyard).toEqual(["item1"]);
    expect(runtime.getState().rulesStack).toMatchObject([
      {
        kind: "activated",
        abilityId: "item-a1",
        source: {
          instanceId: "item1",
          zone: "permanent",
          current: { names: ["Activation Item"] },
        },
      },
    ]);
    expect(runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.map((event) => event.name)).toEqual([
      "announce-activation",
      "spend-assets",
      "destroy",
      "leave-arena",
      "enter-or-leave-arena",
      "put-into-graveyard",
      "activate",
    ]);

    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(runtime.getState().players.p1!.life).toBe(21);
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.graveyard).toEqual(["item1"]);
  });

  it("pays tap-self through the reducer and rejects a second activation without mutation", () => {
    const state = setup();
    replaceCardDefinition(state, "item", {
      abilities: [
        {
          id: "item-a1",
          kind: "activated",
          text: "Action — 1, tap this: Gain 1 life.",
          abilityType: "action",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              { class: "asset", type: "resources", amount: 1 },
              { class: "effect", type: "tap-self" },
            ],
          },
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      ],
    });
    let runtime = new FabMatchRuntime(state);

    expect(
      dispatchTestCommand(runtime, "activate", "p1", { instanceId: "item1", ability: "item-a1" })
        .accepted,
    ).toBe(true);
    expect(runtime.getState().objects.item1?.markers).toContainEqual({ kind: "tapped" });
    expect(runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.map((event) => event.name)).toEqual([
      "announce-activation",
      "spend-assets",
      "set-tapped",
      "activate",
    ]);
    dispatchTestCommand(runtime, "pass", "p1", {});
    dispatchTestCommand(runtime, "pass", "p2", {});
    const restored = runtime.cloneState();
    restored.players.p1!.resourcePoints = 1;
    runtime = new FabMatchRuntime(restored);
    const before = structuredClone(runtime.getState());

    expect(
      dispatchTestCommand(runtime, "activate", "p1", { instanceId: "item1", ability: "item-a1" }),
    ).toMatchObject({
      accepted: false,
      errorCode: "already_tapped",
    });
    expect(runtime.getState()).toEqual(before);
  });

  it("pays tap-hero through a reducer event before creating the activated layer", () => {
    const state = setup();
    state.players.p1!.heroCardId = "hero";
    state.containers.zonesByPlayerId["p1"]!.heroZone = ["hero"];
    addObject(state, "hero", "hero", "p1", { visibility: "public" });
    state.cardDefinitions.hero = registerFabCardDefinition({
      canonicalId: "hero",
      name: "Practice Hero",
      types: ["Hero"],
    });
    replaceCardDefinition(state, "item", {
      abilities: [
        {
          id: "item-a1",
          kind: "activated",
          text: "Instant — Tap your hero, destroy this: Gain 1 life.",
          abilityType: "instant",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              { class: "effect", type: "tap-hero" },
              { class: "effect", type: "destroy-self" },
            ],
          },
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      ],
    });
    const runtime = new FabMatchRuntime(state);

    expect(
      dispatchTestCommand(runtime, "activate", "p1", { instanceId: "item1", ability: "item-a1" })
        .accepted,
    ).toBe(true);
    expect(runtime.getState().objects.hero?.markers).toContainEqual({ kind: "tapped" });
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.graveyard).toEqual(["item1"]);
    expect(runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.map((event) => event.name)).toEqual([
      "announce-activation",
      "spend-assets",
      "set-tapped",
      "destroy",
      "leave-arena",
      "enter-or-leave-arena",
      "put-into-graveyard",
      "activate",
    ]);
  });

  it("pays a self face-change cost and carries its typed output binding onto the layer", () => {
    const state = setup();
    state.objects.item1 = { ...state.objects.item1!, markers: [{ kind: "face-down" }] };
    replaceCardDefinition(state, "item", {
      abilities: [
        {
          id: "item-a1",
          kind: "activated",
          text: "Instant — Turn this face up: Gain 1 life.",
          abilityType: "instant",
          cost: {
            class: "effect",
            type: "turn-face-up",
            target: { selector: "self" },
            outputBinding: "it",
          },
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      ],
    });
    const runtime = new FabMatchRuntime(state);

    expect(
      dispatchTestCommand(runtime, "activate", "p1", { instanceId: "item1", ability: "item-a1" })
        .accepted,
    ).toBe(true);
    expect(runtime.getState().objects.item1?.markers).not.toContainEqual({ kind: "face-down" });
    expect(runtime.getState().rulesStack).toMatchObject([
      {
        kind: "activated",
        abilityId: "item-a1",
        bindings: { it: { instanceId: "item1", zone: "permanent", faceDown: true } },
      },
    ]);
    expect(runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.map((event) => event.name)).toEqual([
      "announce-activation",
      "spend-assets",
      "turn-face-up",
      "activate",
    ]);

    dispatchTestCommand(runtime, "pass", "p1", {});
    dispatchTestCommand(runtime, "pass", "p2", {});
    const before = structuredClone(runtime.getState());
    expect(
      dispatchTestCommand(runtime, "activate", "p1", { instanceId: "item1", ability: "item-a1" }),
    ).toMatchObject({
      accepted: false,
      errorCode: "already_face_up",
    });
    expect(runtime.getState()).toEqual(before);
  });

  it("persists a non-self face-change cost decision before committing the cost and binding", () => {
    const state = setup();
    addObject(state, "arrow1", "arrow", "p1", { markers: [{ kind: "face-down" }] });
    state.cardDefinitions.arrow = registerFabCardDefinition({
      canonicalId: "arrow",
      name: "Face-down Arrow",
      types: ["Ranger", "Action", "Attack", "Arrow"],
    });
    state.containers.zonesByPlayerId["p1"]!.arsenal.push("arrow1");
    replaceCardDefinition(state, "item", {
      abilities: [
        {
          id: "item-a1",
          kind: "activated",
          text: "Instant — Turn a face-down arrow in your arsenal face up: Gain 1 life.",
          abilityType: "instant",
          cost: {
            class: "effect",
            type: "turn-face-up",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["arsenal"],
              filter: {
                typeBox: {
                  subtypes: ["Arrow"],
                },
                hasStatus: "face-down",
              },
              count: 1,
            },
            outputBinding: "it",
          },
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      ],
    });
    const initial = new FabMatchRuntime(state);
    expect(
      dispatchTestCommand(initial, "activate", "p1", { instanceId: "item1", ability: "item-a1" })
        .accepted,
    ).toBe(true);
    expect(initial.getState().decision).toMatchObject({
      kind: "entity-target",
      candidates: [{ instanceId: "arrow1" }],
      continuation: { kind: "activation-target", targetKey: "cost-0:turn-face-up" },
    });
    expect(initial.getState().objects.arrow1?.markers).toContainEqual({ kind: "face-down" });
    expect(initial[FAB_RUNTIME_TEST_RECEIPT]().committedEvents).toEqual([]);

    const runtime = new FabMatchRuntime(structuredClone(initial.getState()));
    const decision = runtime.getState().decision!;
    expect(
      dispatchTestCommand(runtime, "answer-decision", "p1", {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "entity-target", instanceIds: ["arrow1"] },
      }).accepted,
    ).toBe(true);

    expect(runtime.getState().objects.arrow1?.markers).not.toContainEqual({ kind: "face-down" });
    expect(runtime.getState().rulesStack).toMatchObject([
      {
        kind: "activated",
        bindings: { it: { instanceId: "arrow1", faceDown: true, zone: "arsenal" } },
      },
    ]);
    expect(runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.map((event) => event.name)).toEqual([
      "announce-activation",
      "spend-assets",
      "turn-face-up",
      "activate",
    ]);
  });

  it("pays a banish-under-this cost through the hosted sub-card seat (DYN092 family, CR 3.0.14)", () => {
    const state = setup();
    replaceCardDefinition(state, "item", {
      abilities: [
        {
          id: "item-a1",
          kind: "activated",
          text: "Instant — Banish a card under this: Gain 1 life.",
          abilityType: "instant",
          cost: { class: "effect", type: "banish", from: "under-this", count: 1 },
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      ],
    });
    addObject(state, "hosted", "fuel", "p1");
    state.cardDefinitions.fuel = registerFabCardDefinition({
      canonicalId: "fuel",
      name: "Hosted Fuel",
      types: ["Action"],
    });
    // CR 3.0.14: the hosted card's seat is the topology registry alone — no
    // zone-list membership.
    state.containers.subcardsByHostId = { item1: [fabObjectInstanceId("hosted")] };

    const initial = new FabMatchRuntime(state);
    expect(
      dispatchTestCommand(initial, "activate", "p1", { instanceId: "item1", ability: "item-a1" })
        .accepted,
    ).toBe(true);
    expect(initial.getState().decision).toMatchObject({
      kind: "entity-target",
      candidates: [{ instanceId: "hosted" }],
      continuation: { kind: "activation-target", targetKey: "cost-0:banish" },
    });

    const runtime = new FabMatchRuntime(structuredClone(initial.getState()));
    const decision = runtime.getState().decision!;
    expect(
      dispatchTestCommand(runtime, "answer-decision", "p1", {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "entity-target", instanceIds: ["hosted"] },
      }).accepted,
    ).toBe(true);

    // Payment banished the hosted card into the owner's banished zone and
    // pruned the host topology entry.
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.banished).toContain("hosted");
    expect(runtime.getState().containers.subcardsByHostId).toEqual({});
    expect(
      runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.some((event) => event.name === "banish"),
    ).toBe(true);

    const lifeBefore = runtime.getState().players.p1!.life;
    expect(dispatchTestCommand(runtime, "pass", "p1", {}).accepted).toBe(true);
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(runtime.getState().players.p1!.life).toBe(lifeBefore + 1);
  });

  it("persists a filtered discard cost and carries its LKI binding through resolution", () => {
    const state = setup();
    addObject(state, "attack1", "attack", "p1");
    state.cardDefinitions.attack = registerFabCardDefinition({
      canonicalId: "attack",
      name: "Discarded Attack",
      types: ["Action", "Attack"],
      power: 4,
    });
    state.containers.zonesByPlayerId["p1"]!.hand.push("attack1");
    replaceCardDefinition(state, "item", {
      abilities: [
        {
          id: "item-a1",
          kind: "activated",
          text: "Instant — Discard an attack action card: Gain 1 life.",
          abilityType: "instant",
          cost: {
            class: "effect",
            type: "discard",
            count: 1,
            filter: {
              typeBox: {
                types: ["Action"],
                subtypes: ["Attack"],
              },
            },
            outputBinding: "discarded",
          },
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      ],
    });
    const runtime = new FabMatchRuntime(state);
    expect(
      dispatchTestCommand(runtime, "activate", "p1", { instanceId: "item1", ability: "item-a1" })
        .accepted,
    ).toBe(true);
    // CR 1.8.6c: a singleton legal pool is determined — no chooser.
    expect(runtime.getState().decision).toBeNull();
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.hand).toEqual([]);
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.graveyard).toEqual(["attack1"]);
    expect(runtime.getState().rulesStack).toMatchObject([
      {
        kind: "activated",
        bindings: {
          discarded: {
            instanceId: "attack1",
            zone: "hand",
            current: { names: ["Discarded Attack"] },
          },
        },
      },
    ]);
    expect(runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.map((event) => event.name)).toEqual([
      "announce-activation",
      "spend-assets",
      "discard",
      "put-into-graveyard",
      "activate",
    ]);

    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(runtime.getState().players.p1!.life).toBe(21);
  });

  it("persists a face-down banish cost and exposes the committed LKI binding", () => {
    const state = setup();
    addObject(state, "attack1", "attack", "p1");
    state.cardDefinitions.attack = registerFabCardDefinition({
      canonicalId: "attack",
      name: "Hidden Attack",
      types: ["Action", "Attack"],
      cost: 2,
    });
    state.containers.zonesByPlayerId["p1"]!.hand.push("attack1");
    replaceCardDefinition(state, "item", {
      abilities: [
        {
          id: "item-a1",
          kind: "activated",
          text: "Instant — Banish an attack action card from hand face down: Gain 1 life.",
          abilityType: "instant",
          cost: {
            class: "effect",
            type: "banish",
            from: "hand",
            count: 1,
            filter: {
              typeBox: {
                types: ["Action"],
                subtypes: ["Attack"],
              },
            },
            faceDown: true,
            outputBinding: "banished",
          },
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      ],
    });
    const initial = new FabMatchRuntime(state);
    expect(
      dispatchTestCommand(initial, "activate", "p1", { instanceId: "item1", ability: "item-a1" })
        .accepted,
    ).toBe(true);
    expect(initial.getState().decision).toMatchObject({
      kind: "entity-target",
      candidates: [{ instanceId: "attack1" }],
      continuation: { kind: "activation-target", targetKey: "cost-0:banish" },
    });

    const runtime = new FabMatchRuntime(structuredClone(initial.getState()));
    const decision = runtime.getState().decision!;
    expect(
      dispatchTestCommand(runtime, "answer-decision", "p1", {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "entity-target", instanceIds: ["attack1"] },
      }).accepted,
    ).toBe(true);

    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.hand).toEqual([]);
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.banished).toEqual(["attack1"]);
    expect(runtime.getState().objects.attack1?.markers).toContainEqual({ kind: "face-down" });
    expect(runtime.getState().rulesStack).toMatchObject([
      {
        kind: "activated",
        bindings: {
          banished: { instanceId: "attack1", zone: "hand", faceDown: true },
        },
      },
    ]);
    expect(runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.map((event) => event.name)).toEqual([
      "announce-activation",
      "spend-assets",
      "turn-face-down",
      "banish",
      "activate",
    ]);
  });

  it("pays named counter costs through the reducer and rejects insufficient counters", () => {
    const state = setup();
    state.objects.item1 = {
      ...state.objects.item1!,
      counters: [{ kind: "named", name: "steam", count: 3 }],
    };
    replaceCardDefinition(state, "item", {
      abilities: [
        {
          id: "item-a1",
          kind: "activated",
          text: "Instant — Remove 2 steam counters from this: Gain 1 life.",
          abilityType: "instant",
          cost: {
            class: "effect",
            type: "remove-counters",
            counter: { kind: "named", name: "steam" },
            count: 2,
          },
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      ],
    });
    const runtime = new FabMatchRuntime(state);

    expect(
      dispatchTestCommand(runtime, "activate", "p1", { instanceId: "item1", ability: "item-a1" })
        .accepted,
    ).toBe(true);
    expect(runtime.getState().objects.item1?.counters).toContainEqual({
      kind: "named",
      name: "steam",
      count: 1,
    });
    expect(runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.map((event) => event.name)).toEqual([
      "announce-activation",
      "spend-assets",
      "counter-removed",
      "activate",
    ]);
    dispatchTestCommand(runtime, "pass", "p1", {});
    dispatchTestCommand(runtime, "pass", "p2", {});
    const before = structuredClone(runtime.getState());

    expect(
      dispatchTestCommand(runtime, "activate", "p1", { instanceId: "item1", ability: "item-a1" }),
    ).toMatchObject({
      accepted: false,
      errorCode: "insufficient_counters",
    });
    expect(runtime.getState()).toEqual(before);
  });

  it("discards the source as a cost while retaining source LKI on the activated layer", () => {
    const state = setup();
    state.containers.zonesByPlayerId["p1"]!.arena = [];
    state.containers.zonesByPlayerId["p1"]!.hand = ["item1"];
    replaceCardDefinition(state, "item", {
      types: ["Instant"],
      abilities: [
        {
          id: "item-a1",
          kind: "activated",
          text: "Instant — Discard this: Gain 1 life.",
          abilityType: "instant",
          cost: { class: "effect", type: "discard-self" },
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      ],
    });
    const runtime = new FabMatchRuntime(state);

    expect(
      dispatchTestCommand(runtime, "activate", "p1", { instanceId: "item1", ability: "item-a1" })
        .accepted,
    ).toBe(true);
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.hand).toEqual([]);
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.graveyard).toEqual(["item1"]);
    expect(runtime.getState().rulesStack).toMatchObject([
      {
        kind: "activated",
        abilityId: "item-a1",
        source: { instanceId: "item1", zone: "hand" },
      },
    ]);
    expect(runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.map((event) => event.name)).toEqual([
      "announce-activation",
      "spend-assets",
      "discard",
      "put-into-graveyard",
      "activate",
    ]);

    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(runtime.getState().players.p1!.life).toBe(21);
  });

  it("discards the source plus any number of distinct additional hand cards", () => {
    const state = setup();
    state.containers.zonesByPlayerId["p1"]!.arena = [];
    state.containers.zonesByPlayerId["p1"]!.hand = ["item1", "extra1", "extra2"];
    for (const [instanceId, canonicalId, defense] of [
      ["extra1", "extra-a", 2],
      ["extra2", "extra-b", 3],
    ] as const) {
      addObject(state, instanceId, canonicalId, "p1");
      state.cardDefinitions[canonicalId] = registerFabCardDefinition({
        canonicalId,
        name: canonicalId,
        types: ["Action"],
        defense,
      });
    }
    replaceCardDefinition(state, "item", {
      types: ["Instant"],
      abilities: [
        {
          id: "item-a1",
          kind: "activated",
          text: "Instant — Discard this and any number of other cards: Gain 1 life.",
          abilityType: "instant",
          cost: {
            class: "mixed",
            type: "all",
            costs: [
              { class: "effect", type: "discard-self" },
              { class: "effect", type: "discard", count: { type: "any-number" } },
            ],
          },
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      ],
    });
    const runtime = new FabMatchRuntime(state);

    expect(
      dispatchTestCommand(runtime, "activate", "p1", { instanceId: "item1", ability: "item-a1" })
        .accepted,
    ).toBe(true);
    const decision = runtime.getState().decision;
    expect(decision).toMatchObject({
      kind: "entity-target",
      min: 0,
      max: 2,
      candidates: [{ instanceId: "extra1" }, { instanceId: "extra2" }],
    });
    if (!decision) throw new Error("Expected an additional-discard decision");
    expect(
      dispatchTestCommand(runtime, "answer-decision", "p1", {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "entity-target", instanceIds: ["extra1", "extra2"] },
      }).accepted,
    ).toBe(true);

    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.hand).toEqual([]);
    expect(runtime.getState().containers.zonesByPlayerId["p1"]!.graveyard).toEqual([
      "item1",
      "extra1",
      "extra2",
    ]);
    expect(runtime.getState().rulesStack).toMatchObject([
      {
        kind: "activated",
        bindings: {
          "discarded-this-way": [
            { instanceId: "extra1", current: { numeric: { defense: 2 } } },
            { instanceId: "extra2", current: { numeric: { defense: 3 } } },
          ],
          "discarded-this-way-count": 2,
        },
      },
    ]);
  });

  it("commits an all-object face-down cost as one atomic event batch", () => {
    const state = setup();
    for (const instanceId of ["banished1", "banished2"] as const) {
      addObject(state, instanceId, "banished", "p1");
    }
    state.cardDefinitions.banished = registerFabCardDefinition({
      canonicalId: "banished",
      name: "Blood Debt Card",
      types: ["Shadow", "Action"],
    });
    state.containers.zonesByPlayerId["p1"]!.banished = ["banished1", "banished2"];
    replaceCardDefinition(state, "item", {
      abilities: [
        {
          id: "item-a1",
          kind: "activated",
          text: "Instant — Turn all cards in your banished zone face down: Gain 1 life.",
          abilityType: "instant",
          cost: {
            class: "effect",
            type: "turn-face-down",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["banished"],
              count: { type: "all" },
            },
          },
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      ],
    });
    const runtime = new FabMatchRuntime(state);

    expect(
      dispatchTestCommand(runtime, "activate", "p1", { instanceId: "item1", ability: "item-a1" })
        .accepted,
    ).toBe(true);
    expect(runtime.getState().decision).toBeNull();
    expect(runtime.getState().objects.banished1?.markers).toContainEqual({ kind: "face-down" });
    expect(runtime.getState().objects.banished2?.markers).toContainEqual({ kind: "face-down" });
    const faceChanges = runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.filter(
      (event) => event.name === "turn-face-down",
    );
    expect(faceChanges).toHaveLength(2);
    expect(new Set(faceChanges.map((event) => event.batchId)).size).toBe(1);
    expect(runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.map((event) => event.name)).toEqual([
      "announce-activation",
      "spend-assets",
      "turn-face-down",
      "turn-face-down",
      "activate",
    ]);
  });

  it("persists activation target declaration and stores the exact target path on the layer", () => {
    const state = setup();
    replaceCardDefinition(state, "item", {
      abilities: [
        {
          id: "item-a1",
          kind: "activated",
          text: "Action — 1: Destroy target opposing aura.",
          abilityType: "action",
          cost: { class: "asset", type: "resources", amount: 1 },
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "on-stack",
              player: "opponent",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Aura"],
                },
              },
              count: 1,
            },
          },
        },
      ],
    });
    addObject(state, "target1", "target-aura", "p2", { visibility: "public" });
    state.cardDefinitions["target-aura"] = registerFabCardDefinition({
      canonicalId: "target-aura",
      name: "Target Aura",
      types: ["Action", "Aura"],
    });
    state.containers.zonesByPlayerId["p2"]!.arena.push("target1");
    const initial = new FabMatchRuntime(state);
    expect(
      dispatchTestCommand(initial, "activate", "p1", { instanceId: "item1", ability: "item-a1" })
        .accepted,
    ).toBe(true);
    expect(initial.getState().decision).toMatchObject({
      kind: "entity-target",
      candidates: [{ instanceId: "target1" }],
      continuation: { kind: "activation-target", targetKey: "effect-0:target" },
    });
    expect(initial.getState().players.p1).toMatchObject({ resourcePoints: 1, actionPoints: 1 });

    const runtime = new FabMatchRuntime(structuredClone(initial.getState()));
    const decision = runtime.getState().decision!;
    expect(
      dispatchTestCommand(runtime, "answer-decision", "p1", {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "entity-target", instanceIds: ["target1"] },
      }).accepted,
    ).toBe(true);
    expect(runtime.getState().rulesStack[0]).toMatchObject({
      kind: "activated",
      targets: {
        "effect-0:target": [
          {
            kind: "object",
            ref: {
              instanceId: "target1",
              incarnation: runtime.getState().objects.target1!.incarnation,
            },
          },
        ],
      },
    });
    expect(runtime.getState().players.p1).toMatchObject({ resourcePoints: 0, actionPoints: 0 });

    dispatchTestCommand(runtime, "pass", "p1", {});
    expect(dispatchTestCommand(runtime, "pass", "p2", {}).accepted).toBe(true);
    expect(runtime.getState().containers.zonesByPlayerId["p2"]!.graveyard).toContain("target1");
    expect(runtime[FAB_RUNTIME_TEST_RECEIPT]().committedEvents.map((event) => event.name)).toEqual([
      "announce-activation",
      "spend-assets",
      "activate",
      "destroy",
      "leave-arena",
      "enter-or-leave-arena",
      "put-into-graveyard",
      "remove-rules-layer",
    ]);
  });
});
import { dispatchTestCommand } from "../testing/test-command.ts";
