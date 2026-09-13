import { describe, expect, it } from "vitest";

import type { FabCardDefinitionInput } from "../cards.ts";
import { beginFabLayerResolution } from "../procedures/layer-resolution/index.ts";
import { FAB_ZONE_KINDS, type FabMatchState } from "../state.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { registerFabTestObject } from "../testing/test-fixtures.ts";
import {
  submitFabDecision,
  type FabDecisionResumeOptions,
  type FabDecisionSubmission,
} from "../procedures/decisions/index.ts";
import { executeFabEventTransaction } from "../kernel/transaction/index.ts";
import { nextFabDestinationRef, snapshotObject } from "./snapshots.ts";
import { collectDeclaredTargets } from "../kernel/trigger-declaration.ts";

const optionalTargetWatcher: FabCardDefinitionInput = {
  canonicalId: "optional-target-watcher",
  name: "Optional Target Watcher",
  types: ["Action", "Aura"],
  abilities: [
    {
      kind: "static",
      staticKind: "triggered",
      id: "optional-target-a1",
      text: "Whenever a card is pitched, you may destroy target opposing aura.",
      trigger: {
        kind: "event",
        event: {
          name: "pitch",
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
        effect: {
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "on-stack",
              player: "opponent",
              zones: ["permanent"],
              filter: { typeBox: { subtypes: ["Aura"] } },
              count: 1,
            },
          },
        },
      },
      functionalZones: ["permanent"],
    },
  ],
};

const targetAura: FabCardDefinitionInput = {
  canonicalId: "target-aura",
  name: "Target Aura",
  types: ["Action", "Aura"],
};

const options: FabDecisionResumeOptions = {
  triggerContext: { evaluateStateCondition: () => true },
  legalTargets: (state) =>
    state.containers.zonesByPlayerId.p2?.arena.includes("target1")
      ? [
          {
            instanceId: "target1",
            label: "Target Aura",
            target: { kind: "object", ref: { instanceId: "target1", incarnation: 1 } },
          },
        ]
      : [],
  evaluateAmount: (_state, amount) => (typeof amount === "number" ? amount : null),
  randomIndex: () => 0,
};

function setup(withTarget = true): FabMatchState {
  const state = FabTestEngine.createStateForRulesTest({
    seed: "optional-trigger-target-declaration",
    player1Id: "p1",
    player2Id: "p2",
    cardsMaps: {
      canonicalIdsByInstance: {
        watcher1: optionalTargetWatcher.canonicalId,
        pitch1: "pitch-card",
        ...(withTarget ? { target1: targetAura.canonicalId } : {}),
      },
      owners: {
        p1: ["watcher1", "pitch1"],
        p2: withTarget ? ["target1"] : [],
      },
    },
    cardDefinitions: {
      [optionalTargetWatcher.canonicalId]: optionalTargetWatcher,
      [targetAura.canonicalId]: targetAura,
      "pitch-card": {
        canonicalId: "pitch-card",
        name: "Pitch Card",
        types: ["Action"],
        pitch: 3,
      },
    },
  });
  registerFabTestObject(state, "watcher1", optionalTargetWatcher.canonicalId, "p1");
  state.containers.zonesByPlayerId.p1!.hand = ["pitch1"];
  state.containers.zonesByPlayerId.p1!.arena = ["watcher1"];
  if (withTarget) {
    registerFabTestObject(state, "target1", targetAura.canonicalId, "p2");
    for (const zone of FAB_ZONE_KINDS) {
      state.containers.zonesByPlayerId.p2![zone] = state.containers.zonesByPlayerId.p2![
        zone
      ].filter((id) => id !== "target1");
    }
    state.containers.zonesByPlayerId.p2!.arena = ["target1"];
  }
  return state;
}

function executePitch(state: FabMatchState): FabMatchState {
  const object = snapshotObject(state, "pitch1", "p1", "hand");
  return executeFabEventTransaction(
    state,
    (processId) => [
      {
        name: "pitch",
        processId,
        cause: { kind: "player-command", actorId: "p1", command: "pitch" },
        controllerId: "p1",
        source: object,
        affected: [object],
        bindings: {},
        data: {
          object,
          playerId: "p1",
          destinationRef: nextFabDestinationRef(state, object),
          resourcesGenerated: 3,
        },
      },
    ],
    options,
  ).state;
}

function submit(
  state: FabMatchState,
  answer: FabDecisionSubmission["answer"],
  stateVersion = state.decision!.stateVersion,
) {
  const decision = state.decision!;
  return submitFabDecision(
    state,
    "p1",
    { decisionId: decision.decisionId, stateVersion, answer },
    options,
  );
}

describe("optional triggered-effect target declaration", () => {
  it("keeps a delayed trigger body in the future triggered layer's declaration scope", () => {
    const delayed = {
      type: "delayed-trigger",
      trigger: {
        kind: "event",
        event: {
          name: "play",
          actor: {
            kind: "any",
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
        effect: {
          type: "optional",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["permanent"],
              count: 1,
            },
          },
        },
      },
    } as const;

    expect(collectDeclaredTargets(delayed, "effect-0")).toEqual([]);
    expect(
      delayed.resolution.kind === "effect"
        ? collectDeclaredTargets(delayed.resolution.effect, "effect-0")
        : [],
    ).toMatchObject([
      {
        key: "effect-0:effect:target",
        optionalEffectPath: "effect-0",
      },
    ]);
  });

  it("declares an optional continuation's on-stack target with its triggered layer", () => {
    const optionalThen = {
      type: "optional",
      effect: { type: "tap", target: { selector: "controller" } },
      then: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 1,
        target: {
          selector: "object",
          declared: "on-stack",
          player: "any",
          zones: ["hero", "permanent"],
          count: 1,
        },
      },
    } as const;

    expect(collectDeclaredTargets(optionalThen, "effect-1")).toMatchObject([
      {
        key: "effect-1:then:target",
        optionalEffectPath: undefined,
      },
    ]);
  });

  it("declares a chosen target before adding the triggered layer and resolves without a boolean", () => {
    const waiting = executePitch(setup());
    expect(waiting.decision).toMatchObject({
      kind: "entity-target",
      min: 0,
      max: 1,
      continuation: { kind: "layer-target" },
    });

    const resumed = submit(structuredClone(waiting), {
      kind: "entity-target",
      instanceIds: ["target1"],
    });
    expect(resumed.accepted).toBe(true);
    if (!resumed.accepted) return;
    expect(resumed.state.decision).toBeNull();
    expect(resumed.state.rulesStack[0]).toMatchObject({
      kind: "triggered",
      targets: {
        "effect-0:effect:target": [
          { kind: "object", ref: { instanceId: "target1", incarnation: 1 } },
        ],
      },
    });

    const layer = resumed.state.rulesStack[0]!;
    const resolved = beginFabLayerResolution(resumed.state, layer.layerId, options);
    expect(resolved.accepted).toBe(true);
    expect(resolved.state.decision).toBeNull();
  });

  it("persists zero targets as decline and does not generate the optional body", () => {
    const waiting = executePitch(setup());
    const resumed = submit(structuredClone(waiting), {
      kind: "entity-target",
      instanceIds: [],
    });
    expect(resumed.accepted).toBe(true);
    if (!resumed.accepted) return;
    expect(resumed.state.rulesStack[0]).toMatchObject({
      targets: { "effect-0:effect:target": [] },
    });

    const layer = resumed.state.rulesStack[0]!;
    const resolved = beginFabLayerResolution(resumed.state, layer.layerId, options);
    expect(resolved.accepted).toBe(true);
    expect(resolved.state.decision).toBeNull();
    expect(resolved.state.containers.zonesByPlayerId.p2!.arena).toEqual(["target1"]);
  });

  it("offers the persisted zero-target declaration when no candidates exist", () => {
    const waiting = executePitch(setup(false));
    expect(waiting.decision).toMatchObject({
      kind: "entity-target",
      candidates: [],
      min: 0,
      max: 0,
      continuation: { kind: "layer-target" },
    });
    const resumed = submit(structuredClone(waiting), {
      kind: "entity-target",
      instanceIds: [],
    });
    expect(resumed.accepted).toBe(true);
    if (!resumed.accepted) return;
    expect(resumed.state.rulesStack[0]).toMatchObject({
      targets: { "effect-0:effect:target": [] },
    });
  });

  it("rejects a stale declaration answer without mutating pending trigger state", () => {
    const waiting = executePitch(setup());
    const before = structuredClone(waiting.rulesProcess?.pendingTriggers);
    const rejected = submit(
      waiting,
      { kind: "entity-target", instanceIds: ["target1"] },
      waiting.decision!.stateVersion + 1,
    );
    expect(rejected).toMatchObject({ accepted: false, errorCode: "stale_state" });
    expect(waiting.rulesProcess?.pendingTriggers).toEqual(before);
    expect(waiting.rulesStack).toEqual([]);
  });
});
