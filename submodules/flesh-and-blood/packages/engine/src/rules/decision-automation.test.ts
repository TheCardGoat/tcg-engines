import { describe, expect, it } from "vite-plus/test";

import { FabMatchRuntime } from "../runtime.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { dispatchTestCommand } from "../testing/test-command.ts";
import type { FabCardDefinitionInput } from "../cards.ts";
import { FAB_DEFAULT_AUTOMATION_PREFERENCES } from "../state.ts";
import {
  fabDefaultTriggerOrderAnswer,
  fabForcedEntityTargetAnswer,
  isForcedEntityTargetDecision,
} from "./decision-automation.ts";
import { registerFabCardDefinition } from "../cards.ts";
import { fabCanonicalCardId, fabObjectInstanceId, fabPlayerId } from "../game/identity.ts";

const PLAYER_1 = "player-1";
const PLAYER_2 = "player-2";

function watcherDefinition(canonicalId: string, zoneTypes: string[]): FabCardDefinitionInput {
  return {
    canonicalId,
    name: canonicalId,
    types: zoneTypes,
    abilities: [
      {
        kind: "static",
        staticKind: "triggered",
        id: `${canonicalId}-a1`,
        text: "At the beginning of any end phase, you may gain 1 life.",
        trigger: {
          kind: "event",
          event: { name: "end-phase", actor: { kind: "any" }, observes: { kind: "none" } },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "optional",
            effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
          },
        },
      },
    ],
  } as FabCardDefinitionInput;
}

const CHEST_WATCHER = watcherDefinition("yield-watcher-chest", ["Equipment", "Chest"]);
const ARMS_WATCHER = watcherDefinition("yield-watcher-arms", ["Equipment", "Arms"]);

interface WatcherMatchInput {
  readonly p1Watchers: readonly string[];
  readonly p2Watchers: readonly string[];
  readonly p1AutoOrder: boolean;
  readonly p2AutoOrder?: boolean;
  readonly p1Mode?: "auto-pass" | "always-hold" | "play-and-skip";
}

function createWatcherMatch(input: WatcherMatchInput): FabMatchRuntime {
  const canonicalIdsByInstance: Record<string, string> = {};
  const owners: Record<string, string[]> = { [PLAYER_1]: [], [PLAYER_2]: [] };
  const cardDefinitions: Record<string, FabCardDefinitionInput> = {
    [CHEST_WATCHER.canonicalId!]: CHEST_WATCHER,
    [ARMS_WATCHER.canonicalId!]: ARMS_WATCHER,
  };
  const watcherZone: Record<string, string[]> = {};
  for (const playerId of [PLAYER_1, PLAYER_2]) {
    for (let index = 0; index < 6; index += 1) {
      const canonicalId = `${playerId}-card-${index}`;
      canonicalIdsByInstance[`${canonicalId}-instance`] = canonicalId;
      owners[playerId]!.push(`${canonicalId}-instance`);
      cardDefinitions[canonicalId] = {
        canonicalId,
        name: canonicalId,
        types: ["Action"],
      } as FabCardDefinitionInput;
    }
  }
  let chestCount = 0;
  let armsCount = 0;
  for (const [playerId, watcherIds] of [
    [PLAYER_1, input.p1Watchers],
    [PLAYER_2, input.p2Watchers],
  ] as const) {
    for (const watcherCanonicalId of watcherIds) {
      const instanceId = `watcher-${playerId}-${watcherCanonicalId}`;
      canonicalIdsByInstance[instanceId] = watcherCanonicalId;
      owners[playerId]!.push(instanceId);
      if (watcherCanonicalId === CHEST_WATCHER.canonicalId) chestCount += 1;
      else armsCount += 1;
      void watcherZone;
    }
  }
  void chestCount;
  void armsCount;

  const state = FabTestEngine.createStateForRulesTest({
    seed: "decision-automation",
    player1Id: PLAYER_1,
    player2Id: PLAYER_2,
    cardsMaps: { canonicalIdsByInstance, owners },
    cardDefinitions,
    automationPreferences: {
      [PLAYER_1]: {
        ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
        ...(input.p1Mode ? { priorityMode: input.p1Mode } : {}),
        autoOrderTriggers: input.p1AutoOrder,
      },
      ...(input.p2AutoOrder !== undefined
        ? {
            [PLAYER_2]: {
              ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
              autoOrderTriggers: input.p2AutoOrder,
            },
          }
        : {}),
    },
  });
  // Empty hands keep every window in this scenario pass-only.
  for (const playerId of [PLAYER_1, PLAYER_2]) {
    const zones = state.containers.zonesByPlayerId[playerId]!;
    zones.deck.push(...zones.hand.splice(0, zones.hand.length));
  }
  // Seat each watcher in its owner's matching equipment zone.
  for (const [playerId, watcherIds] of [
    [PLAYER_1, input.p1Watchers],
    [PLAYER_2, input.p2Watchers],
  ] as const) {
    for (const watcherCanonicalId of watcherIds) {
      const instanceId = `watcher-${playerId}-${watcherCanonicalId}`;
      for (const zone of Object.values(state.containers.zonesByPlayerId[playerId]!)) {
        const index = zone.indexOf(instanceId);
        if (index >= 0) zone.splice(index, 1);
      }
      const zoneKey = watcherCanonicalId === CHEST_WATCHER.canonicalId ? "chest" : "arms";
      state.containers.zonesByPlayerId[playerId]![zoneKey]!.push(instanceId);
    }
  }
  return new FabMatchRuntime(state);
}

const DECISION_AUTOMATION_LOG_KEY = "flesh-and-blood.decision-automation.auto-order";
const DECISION_AUTO_TARGET_LOG_KEY = "flesh-and-blood.decision-automation.auto-target";

function automaticDecisionLogs(
  moveLogs: readonly { readonly public: unknown }[],
  key = DECISION_AUTOMATION_LOG_KEY,
): unknown[] {
  return moveLogs.filter((log) =>
    (log.public as readonly { readonly key?: string }[]).some((message) => message.key === key),
  );
}

function addPublicObject(
  state: ReturnType<typeof FabTestEngine.createStateForRulesTest>,
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

function createSingletonTargetRuntime(autoSelect: boolean): FabMatchRuntime {
  const state = FabTestEngine.createStateForRulesTest({
    seed: "singleton-target-automation",
    player1Id: PLAYER_1,
    player2Id: PLAYER_2,
    cardsMaps: {
      canonicalIdsByInstance: { item1: "item" },
      owners: { [PLAYER_1]: ["item1"], [PLAYER_2]: [] },
    },
    cardDefinitions: {
      item: {
        canonicalId: "item",
        name: "Activation Item",
        types: ["Action", "Item"],
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
                filter: { typeBox: { subtypes: ["Aura"] } },
                count: 1,
              },
            },
          },
        ],
      },
    },
    automationPreferences: {
      [PLAYER_1]: {
        ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
        autoSelectSingletonTargets: autoSelect,
      },
    },
  });
  addPublicObject(state, "item1", "item", PLAYER_1);
  addPublicObject(state, "aura1", "target-aura", PLAYER_2);
  state.cardDefinitions["target-aura"] = registerFabCardDefinition({
    canonicalId: "target-aura",
    name: "Target Aura",
    types: ["Action", "Aura"],
  });
  for (const playerId of [PLAYER_1, PLAYER_2]) {
    for (const zone of Object.values(state.containers.zonesByPlayerId[playerId]!)) {
      for (const instanceId of ["item1", "aura1"]) {
        const index = zone.indexOf(instanceId);
        if (index >= 0) zone.splice(index, 1);
      }
    }
  }
  state.containers.zonesByPlayerId[PLAYER_1]!.arena.push("item1");
  state.containers.zonesByPlayerId[PLAYER_2]!.arena.push("aura1");
  state.players[PLAYER_1]!.resourcePoints = 1;
  return new FabMatchRuntime(state);
}

describe("trigger-order auto-answer", () => {
  it("auto-answers the controller's simultaneous-trigger ordering with entry order", () => {
    const runtime = createWatcherMatch({
      p1Watchers: [],
      p2Watchers: [CHEST_WATCHER.canonicalId!, ARMS_WATCHER.canonicalId!],
      p1AutoOrder: false,
      p2AutoOrder: true,
    });
    const result = dispatchTestCommand(runtime, "end-turn", PLAYER_1, {});
    expect(result).toMatchObject({ accepted: true });
    // PLAYER_2's ordering decision was answered inside the receipt.
    expect(runtime.getState().decision).toBeNull();
    expect(runtime.getState().rulesStack).toHaveLength(2);
    expect(runtime.getState().rulesStack.every((layer) => layer.kind === "triggered")).toBe(true);
    const logs = result.accepted ? result.moveLogs : [];
    expect(automaticDecisionLogs(logs)).toHaveLength(1);
  });

  it("leaves the ordering decision to the controller when autoOrder is off", () => {
    const runtime = createWatcherMatch({
      p1Watchers: [],
      p2Watchers: [CHEST_WATCHER.canonicalId!, ARMS_WATCHER.canonicalId!],
      p1AutoOrder: false,
    });
    expect(dispatchTestCommand(runtime, "end-turn", PLAYER_1, {})).toMatchObject({
      accepted: true,
    });
    expect(runtime.getState().decision?.kind).toBe("ordering");
  });

  it("lets the controller enable auto-order from the active trigger-order decision", () => {
    const runtime = createWatcherMatch({
      p1Watchers: [],
      p2Watchers: [CHEST_WATCHER.canonicalId!, ARMS_WATCHER.canonicalId!],
      p1AutoOrder: false,
    });
    expect(dispatchTestCommand(runtime, "end-turn", PLAYER_1, {})).toMatchObject({
      accepted: true,
    });
    expect(runtime.getState().decision?.kind).toBe("ordering");
    expect(runtime.enumerateMoves(PLAYER_2)).toContain("set-automation-preferences");

    const result = dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_2, {
      autoOrderTriggers: true,
    });
    expect(result).toMatchObject({ accepted: true });
    expect(runtime.getState().automationPreferences[PLAYER_2]?.autoOrderTriggers).toBe(true);
    expect(runtime.getState().decision).toBeNull();
    expect(automaticDecisionLogs(result.accepted ? result.moveLogs : [])).toHaveLength(1);
  });

  it("auto-answers the turn player's first-player selection and the controller's ordering, in every mode", () => {
    for (const priorityMode of ["auto-pass", "always-hold", "play-and-skip"] as const) {
      const runtime = createWatcherMatch({
        p1Watchers: [CHEST_WATCHER.canonicalId!],
        p2Watchers: [ARMS_WATCHER.canonicalId!],
        p1AutoOrder: true,
        p1Mode: priorityMode,
      });
      const result = dispatchTestCommand(runtime, "end-turn", PLAYER_1, {});
      expect(result).toMatchObject({ accepted: true });
      // Both the first-player selection (actor PLAYER_1, autoOrder on) and
      // any per-controller ordering were answered inside the same receipt.
      expect(runtime.getState().decision).toBeNull();
      const logs = result.accepted ? result.moveLogs : [];
      expect(automaticDecisionLogs(logs).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("auto-answers a controller's own multi-trigger ordering regardless of mode", () => {
    const runtime = createWatcherMatch({
      p1Watchers: [CHEST_WATCHER.canonicalId!, ARMS_WATCHER.canonicalId!],
      p2Watchers: [],
      p1AutoOrder: true,
    });
    const result = dispatchTestCommand(runtime, "end-turn", PLAYER_1, {});
    expect(result).toMatchObject({ accepted: true });
    expect(runtime.getState().decision).toBeNull();
    // Both triggered layers entered the stack in pending order.
    expect(runtime.getState().rulesStack).toHaveLength(2);
    expect(runtime.getState().rulesStack.every((layer) => layer.kind === "triggered")).toBe(true);
    const logs = result.accepted ? result.moveLogs : [];
    expect(automaticDecisionLogs(logs)).toHaveLength(1);
  });

  it("never auto-answers decisions outside the two ordering continuations", () => {
    const runtime = createWatcherMatch({
      p1Watchers: [CHEST_WATCHER.canonicalId!],
      p2Watchers: [],
      p1AutoOrder: true,
    });
    // Single trigger: no ordering decision exists. Both manual passes resolve
    // the layer, whose optional accept decision (boolean continuation) must
    // surface even though PLAYER_1 has autoOrder on.
    expect(dispatchTestCommand(runtime, "end-turn", PLAYER_1, {})).toMatchObject({
      accepted: true,
    });
    expect(runtime.getState().decision).toBeNull();
    expect(dispatchTestCommand(runtime, "pass", PLAYER_1, {})).toMatchObject({ accepted: true });
    expect(dispatchTestCommand(runtime, "pass", PLAYER_2, {})).toMatchObject({ accepted: true });
    const state = runtime.getState();
    if (state.decision) {
      expect(state.decision.continuation.kind).not.toBe("trigger-order");
      expect(state.decision.continuation.kind).not.toBe("trigger-first-player");
    }
  });
});

describe("fabDefaultTriggerOrderAnswer", () => {
  it("orders entries exactly as presented (pending entry order)", () => {
    const decision = {
      kind: "ordering",
      entries: [
        { id: "pending-2", label: "B" },
        { id: "pending-1", label: "A" },
      ],
      continuation: { kind: "trigger-order" },
    } as never;
    expect(fabDefaultTriggerOrderAnswer(decision)).toEqual({
      kind: "ordering",
      orderedIds: ["pending-2", "pending-1"],
    });
  });

  it("picks the first presented controller for the first-player selection", () => {
    const decision = {
      kind: "option",
      options: [
        { id: "player-2", label: "player-2" },
        { id: "player-1", label: "player-1" },
      ],
      continuation: { kind: "trigger-first-player" },
    } as never;
    expect(fabDefaultTriggerOrderAnswer(decision)).toEqual({
      kind: "option",
      optionIds: ["player-2"],
    });
  });
});

describe("fabForcedEntityTargetAnswer", () => {
  it("answers a 1-of-1 entity-target with that candidate", () => {
    const decision = {
      kind: "entity-target",
      min: 1,
      max: 1,
      candidates: [{ instanceId: "aura1" }],
    } as never;
    expect(isForcedEntityTargetDecision(decision)).toBe(true);
    expect(fabForcedEntityTargetAnswer(decision)).toEqual({
      kind: "entity-target",
      instanceIds: ["aura1"],
    });
  });

  it("leaves optional and multi-candidate prompts manual", () => {
    expect(
      fabForcedEntityTargetAnswer({
        kind: "entity-target",
        min: 0,
        max: 1,
        candidates: [{ instanceId: "aura1" }],
      } as never),
    ).toBeNull();
    expect(
      fabForcedEntityTargetAnswer({
        kind: "entity-target",
        min: 1,
        max: 1,
        candidates: [{ instanceId: "aura1" }, { instanceId: "aura2" }],
      } as never),
    ).toBeNull();
  });

  it("leaves an invalid exact set manual when different names are required", () => {
    const decision = {
      kind: "entity-target",
      min: 2,
      max: 2,
      differentNames: true,
      candidates: [
        { instanceId: "snatch-red", label: "Snatch (Red)", printedName: "snatch" },
        { instanceId: "snatch-blue", label: "Snatch (Blue)", printedName: "snatch" },
      ],
    } as never;

    expect(isForcedEntityTargetDecision(decision)).toBe(false);
    expect(fabForcedEntityTargetAnswer(decision)).toBeNull();
  });
});

describe("singleton-target auto-select", () => {
  it("auto-answers a forced 1-of-1 activation target inside the triggering receipt", () => {
    const runtime = createSingletonTargetRuntime(true);
    const result = dispatchTestCommand(runtime, "activate", PLAYER_1, {
      instanceId: "item1",
      ability: "item-a1",
    });
    expect(result).toMatchObject({ accepted: true, undoBarrier: null });
    expect(runtime.getState().decision).toBeNull();
    expect(runtime.getState().rulesStack[0]).toMatchObject({
      kind: "activated",
      targets: {
        "effect-0:target": [{ kind: "object", ref: { instanceId: "aura1" } }],
      },
    });
    expect(
      automaticDecisionLogs(result.accepted ? result.moveLogs : [], DECISION_AUTO_TARGET_LOG_KEY),
    ).toHaveLength(1);
  });

  it("leaves the 1-of-1 target prompt in place when auto-select is off", () => {
    const runtime = createSingletonTargetRuntime(false);
    expect(
      dispatchTestCommand(runtime, "activate", PLAYER_1, {
        instanceId: "item1",
        ability: "item-a1",
      }),
    ).toMatchObject({ accepted: true });
    expect(runtime.getState().decision).toMatchObject({
      kind: "entity-target",
      candidates: [{ instanceId: "aura1" }],
      continuation: { kind: "activation-target" },
    });
  });

  it("lets the actor enable auto-select from the forced target prompt", () => {
    const runtime = createSingletonTargetRuntime(false);
    expect(
      dispatchTestCommand(runtime, "activate", PLAYER_1, {
        instanceId: "item1",
        ability: "item-a1",
      }),
    ).toMatchObject({ accepted: true });
    expect(runtime.enumerateMoves(PLAYER_1)).toContain("set-automation-preferences");

    const result = dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_1, {
      autoSelectSingletonTargets: true,
    });
    expect(result).toMatchObject({ accepted: true, undoBarrier: null });
    expect(runtime.getState().automationPreferences[PLAYER_1]?.autoSelectSingletonTargets).toBe(
      true,
    );
    expect(runtime.getState().decision).toBeNull();
    expect(runtime.getState().rulesStack[0]).toMatchObject({
      kind: "activated",
      targets: {
        "effect-0:target": [{ kind: "object", ref: { instanceId: "aura1" } }],
      },
    });
    expect(
      automaticDecisionLogs(result.accepted ? result.moveLogs : [], DECISION_AUTO_TARGET_LOG_KEY),
    ).toHaveLength(1);
  });
});
