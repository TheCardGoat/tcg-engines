import type { FabCardDefinitionInput } from "../cards.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import type { FabMatchState } from "../state.ts";
import { describe, expect, it } from "vitest";
import {
  submitFabDecision,
  type FabDecisionResumeOptions,
  type FabDecisionSubmission,
} from "../procedures/decisions/index.ts";
import { executeFabEventTransaction } from "../kernel/transaction/index.ts";
import {
  nextFabDestinationRef,
  snapshotFunctionalTriggerSources,
  snapshotObject,
} from "./snapshots.ts";
import { registerFabTestObject } from "../testing/test-fixtures.ts";
import { bravo, crackedBaubleYellow, dash, packHuntYellow } from "./fixtures.ts";

function watcher(canonicalId: string, abilityId: string): FabCardDefinitionInput {
  return {
    canonicalId,
    name: canonicalId,
    types: ["Action", "Aura"],
    abilities: [
      {
        kind: "static",
        staticKind: "triggered",
        id: abilityId,
        text: "Whenever a card is pitched, gain 1 life.",
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
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      },
    ],
  };
}

const modalWatcher: FabCardDefinitionInput = {
  canonicalId: "modal-watcher",
  name: "Modal Watcher",
  types: ["Action", "Aura"],
  abilities: [
    {
      kind: "static",
      staticKind: "triggered",
      id: "modal-a1",
      text: "Whenever a card is pitched, choose 1.",
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
        kind: "modal",
        choose: 1,
        modes: [
          {
            id: "damage-mode",
            kind: "resolution",
            text: "Deal 1 damage to target aura.",
            effect: {
              type: "deal-damage",
              damageType: "generic",
              amount: 1,
              target: {
                selector: "object",
                declared: "on-stack",
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
      },
      functionalZones: ["permanent"],
    },
  ],
};

const options: FabDecisionResumeOptions = {
  triggerContext: { evaluateStateCondition: () => true },
  legalTargets: () => [
    {
      instanceId: "target1",
      label: "Target Aura",
      target: { kind: "object", ref: { instanceId: "target1", incarnation: 1 } },
    },
  ],
  evaluateAmount: (_state, amount) => (typeof amount === "number" ? amount : null),
  randomIndex: () => 0,
};

function createState(
  definitions: Record<string, FabCardDefinitionInput>,
  owners: Record<string, string[]>,
) {
  const canonicalIdsByInstance = Object.fromEntries(
    Object.values(owners)
      .flat()
      .map((instanceId) => [
        instanceId,
        instanceId.startsWith("watcher") ? instanceId : "pitch-card",
      ]),
  );
  return FabTestEngine.createStateForRulesTest({
    seed: "decision-resume",
    player1Id: "p1",
    player2Id: "p2",
    cardsMaps: { canonicalIdsByInstance, owners },
    cardDefinitions: {
      ...definitions,
      "pitch-card": { canonicalId: "pitch-card", name: "Pitch Card", types: ["Action"], pitch: 3 },
    },
  });
}

function executePitch(state: FabMatchState, cardId = "pitch1"): FabMatchState {
  const object = snapshotObject(state, cardId, "p1", "hand");
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

function submit(state: FabMatchState, actorId: string, answer: FabDecisionSubmission["answer"]) {
  const decision = state.decision!;
  return submitFabDecision(
    state,
    actorId,
    { decisionId: decision.decisionId, stateVersion: decision.stateVersion, answer },
    options,
  );
}

describe("persisted FAB decision continuations", () => {
  it("lets the turn player select the first simultaneous-trigger player clockwise", () => {
    const state = createState(
      { watcher1: watcher("watcher1", "p1-a1"), watcher2: watcher("watcher2", "p2-a1") },
      { p1: ["watcher1", "pitch1"], p2: ["watcher2"] },
    );
    state.containers.zonesByPlayerId["p1"]!.hand = ["pitch1"];
    state.containers.zonesByPlayerId["p1"]!.arena = ["watcher1"];
    state.containers.zonesByPlayerId["p2"]!.hand = [];
    state.containers.zonesByPlayerId["p2"]!.arena = ["watcher2"];

    const waiting = executePitch(state);
    expect(waiting.decision).toMatchObject({
      kind: "option",
      actorId: "p1",
      continuation: { kind: "trigger-first-player" },
    });

    const restored = structuredClone(waiting);
    const resumed = submit(restored, "p1", { kind: "option", optionIds: ["p2"] });
    expect(resumed.accepted).toBe(true);
    if (!resumed.accepted) return;
    expect(resumed.state.rulesStack.map((layer) => layer.controllerId)).toEqual(["p2", "p1"]);
    expect(resumed.state.rulesProcess).toBeNull();
  });

  it("persists a player's chosen trigger order", () => {
    const state = createState(
      { watcher1: watcher("watcher1", "first-a1"), watcher2: watcher("watcher2", "second-a1") },
      { p1: ["watcher1", "watcher2", "pitch1"], p2: [] },
    );
    state.containers.zonesByPlayerId["p1"]!.hand = ["pitch1"];
    state.containers.zonesByPlayerId["p1"]!.arena = ["watcher1", "watcher2"];

    const waiting = executePitch(state);
    expect(waiting.decision?.kind).toBe("ordering");
    if (waiting.decision?.kind !== "ordering") return;
    const ids = waiting.decision.entries.map((entry) => entry.id).reverse();
    const resumed = submit(structuredClone(waiting), "p1", { kind: "ordering", orderedIds: ids });
    expect(resumed.accepted).toBe(true);
    if (!resumed.accepted) return;
    expect(
      resumed.state.rulesStack.flatMap((layer) =>
        layer.kind === "triggered" ? [layer.abilityId] : [],
      ),
    ).toEqual(["second-a1", "first-a1"]);
  });

  it("restores through modal and target declaration decisions", () => {
    const state = createState(
      { "modal-watcher": modalWatcher },
      { p1: ["watcher1", "pitch1"], p2: [] },
    );
    registerFabTestObject(state, "watcher1", "modal-watcher", "p1");
    state.containers.zonesByPlayerId["p1"]!.hand = ["pitch1"];
    state.containers.zonesByPlayerId["p1"]!.arena = ["watcher1"];

    expect(snapshotFunctionalTriggerSources(state)).toHaveLength(1);
    const modeDecision = executePitch(state);
    expect(modeDecision.decision).toMatchObject({
      kind: "option",
      continuation: { kind: "layer-mode" },
    });
    const afterMode = submit(structuredClone(modeDecision), "p1", {
      kind: "option",
      optionIds: ["damage-mode"],
    });
    expect(afterMode.accepted).toBe(true);
    if (!afterMode.accepted) return;
    // A unique legal target set is forced (same as play-time unique targets).
    expect(afterMode.state.decision).toBeNull();
    expect(afterMode.state.rulesStack[0]).toMatchObject({
      kind: "triggered",
      modes: ["damage-mode"],
      targets: {
        "effect-0:target": [
          {
            kind: "object",
            ref: {
              instanceId: "target1",
              incarnation: 1,
            },
          },
        ],
      },
    });
  });

  it("rejects stale versions and the wrong actor without mutating state", () => {
    const state = createState(
      { watcher1: watcher("watcher1", "first-a1"), watcher2: watcher("watcher2", "second-a1") },
      { p1: ["watcher1", "watcher2", "pitch1"], p2: [] },
    );
    state.containers.zonesByPlayerId["p1"]!.hand = ["pitch1"];
    state.containers.zonesByPlayerId["p1"]!.arena = ["watcher1", "watcher2"];
    const waiting = executePitch(state);
    expect(submit(waiting, "p2", { kind: "ordering", orderedIds: [] })).toMatchObject({
      accepted: false,
      errorCode: "wrong_actor",
    });
    const decision = waiting.decision!;
    expect(
      submitFabDecision(
        waiting,
        "p1",
        {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion + 1,
          answer: { kind: "ordering", orderedIds: [] },
        },
        options,
      ),
    ).toMatchObject({ accepted: false, errorCode: "stale_state" });
  });

  it("returns the unchanged current state when a continuation process is stale", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [packHuntYellow, crackedBaubleYellow],
        deck: 8,
        actionPoints: 1,
        resourcePoints: 0,
      },
      { hero: dash, deck: 8 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const actorId = game.as(bravo).id;
    const attackId = game.findCardInZone(actorId, "hand", packHuntYellow.canonicalId);
    const pitchId = game.findCardInZone(actorId, "hand", crackedBaubleYellow.canonicalId);
    expect(
      game.getRuntime().applyCommand(actorId, {
        move: "begin-play",
        instanceId: attackId,
        target: game.as(dash).id,
      }),
    ).toMatchObject({ success: true, status: "awaiting-decision" });

    const waiting = game.getRuntime().cloneState();
    const decision = waiting.decision!;
    waiting.rulesProcess = { ...waiting.rulesProcess!, processId: "process-999999" };
    const before = structuredClone(waiting);

    const result = submitFabDecision(
      waiting,
      actorId,
      {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "payment", instanceIds: [pitchId] },
      },
      options,
    );

    expect(result).toMatchObject({
      accepted: false,
      errorCode: "stale_process",
      state: before,
    });
    expect(waiting).toEqual(before);
  });
});
