import {
  FabMatchRuntime,
  type FabCardDefinition,
  type FabPlayerLog,
} from "@tcg/flesh-and-blood-engine/runtime";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import {
  FAB_ARM_PRIORITY_HOLD_LABEL,
  FAB_AUTOMATION_PREFERENCE_LABELS,
  FAB_PRIORITY_MODE_ACTION_LABEL,
} from "@tcg/flesh-and-blood-engine/legal-commands";
import { buildInteractionSubmission } from "@tcg/protocol";
import { describe, expect, it } from "vitest";
import { fleshAndBloodCreateServerEngine } from "./engine-lifecycle.ts";
import { fleshAndBloodServerAdapter } from "./adapter.ts";
import { commandForFabSubmission, projectFabInteraction } from "./interaction.ts";
import { FleshAndBloodServerEngine } from "./server-engine.ts";

const HIGH_OCTANE_RED_CANONICAL_ID = "BF7rFRwnNckBK8cMGpKHH";

function lifecycleCreateInput(
  automation?: Readonly<Record<string, unknown>>,
): Parameters<typeof fleshAndBloodCreateServerEngine>[0] {
  return {
    gameSlug: "flesh-and-blood",
    seed: "priority-automation-seed",
    player1Id: "p1",
    player2Id: "p2",
    cardsMaps: {
      cardInstances: {
        "p1-card": HIGH_OCTANE_RED_CANONICAL_ID,
        "p2-card": HIGH_OCTANE_RED_CANONICAL_ID,
      },
      owners: { p1: ["p1-card"], p2: ["p2-card"] },
    },
    ...(automation ? { automation } : {}),
  };
}

/** Fresh runtime with player-1 holding priority and no pending decision. */
function serverEngine(): FleshAndBloodServerEngine {
  const fixture = FabTestEngine.create({
    player1: { hand: [], deck: 8, actionPoints: 1 },
    player2: { hand: [], deck: 8, actionPoints: 1 },
  });
  return new FleshAndBloodServerEngine(fixture.getRuntime());
}

describe("FAB adapter priority automation", () => {
  it("threads the automation seed into engine state at creation", async () => {
    const engine = await fleshAndBloodCreateServerEngine(
      lifecycleCreateInput({ p1: "auto-pass", p2: "always-hold" }),
    );
    expect(engine).toBeInstanceOf(FleshAndBloodServerEngine);
    if (!(engine instanceof FleshAndBloodServerEngine)) return;
    expect(engine.runtime.snapshot().automationPreferences).toMatchObject({
      p1: { priorityMode: "auto-pass" },
      p2: { priorityMode: "always-hold" },
    });
  });

  it("threads structured seeds into priority modes and owned-instance trigger declines", async () => {
    const engine = await fleshAndBloodCreateServerEngine(
      lifecycleCreateInput({
        p1: {
          priorityMode: "auto-pass",
          optionalTriggerDeclines: [HIGH_OCTANE_RED_CANONICAL_ID, "unknown-card-id"],
        },
        p2: {
          priorityMode: "always-hold",
          optionalTriggerAccepts: [HIGH_OCTANE_RED_CANONICAL_ID],
        },
      }),
    );
    if (!(engine instanceof FleshAndBloodServerEngine)) return;
    expect(engine.runtime.snapshot().automationPreferences).toMatchObject({
      p1: { priorityMode: "auto-pass" },
      p2: { priorityMode: "always-hold" },
    });
    // The declined canonical id maps to p1's owned instance only; the
    // unknown id drops and p2's copy of the same canonical card stays asking.
    expect(engine.runtime.snapshot().optionalTriggerAutomation).toEqual({
      p1: { "p1-card": "auto-decline" },
      p2: { "p2-card": "auto-accept" },
    });
  });

  it("threads the play-and-skip seed into engine state (bare and structured)", async () => {
    const bare = await fleshAndBloodCreateServerEngine(
      lifecycleCreateInput({ p1: "play-and-skip", p2: "always-hold" }),
    );
    if (!(bare instanceof FleshAndBloodServerEngine)) return;
    expect(bare.runtime.snapshot().automationPreferences).toMatchObject({
      p1: { priorityMode: "play-and-skip" },
      p2: { priorityMode: "always-hold" },
    });

    const structured = await fleshAndBloodCreateServerEngine(
      lifecycleCreateInput({
        p1: {
          priorityMode: "play-and-skip",
          optionalTriggerDeclines: [HIGH_OCTANE_RED_CANONICAL_ID],
        },
      }),
    );
    if (!(structured instanceof FleshAndBloodServerEngine)) return;
    expect(structured.runtime.snapshot().automationPreferences).toMatchObject({
      p1: { priorityMode: "play-and-skip" },
    });
    expect(structured.runtime.snapshot().optionalTriggerAutomation).toEqual({
      p1: { "p1-card": "auto-decline" },
    });
  });

  it("drops structured seeds whose priority mode is unreadable", async () => {
    const engine = await fleshAndBloodCreateServerEngine(
      lifecycleCreateInput({
        p1: { priorityMode: "banana", optionalTriggerDeclines: [HIGH_OCTANE_RED_CANONICAL_ID] },
      }),
    );
    if (!(engine instanceof FleshAndBloodServerEngine)) return;
    expect(engine.runtime.snapshot().automationPreferences).toMatchObject({
      p1: { priorityMode: "always-hold" },
      p2: { priorityMode: "always-hold" },
    });
    expect(engine.runtime.snapshot().optionalTriggerAutomation).toEqual({});
  });

  it("fails opaque invalid seeds closed to hold instead of threading them", async () => {
    const engine = await fleshAndBloodCreateServerEngine(
      lifecycleCreateInput({ p1: "auto-pass", p2: "banana", unseated: "always-hold" }),
    );
    if (!(engine instanceof FleshAndBloodServerEngine)) return;
    // Only recognized modes on seated seats survive narrowing; "banana" and
    // the unseated entry drop out, and the engine reads absence as hold.
    expect(engine.runtime.snapshot().automationPreferences).toMatchObject({
      p1: { priorityMode: "auto-pass" },
    });
    const failedClosed = engine.getViewerState({ role: "player", actorId: "p2" }) as {
      automation: { priorityMode: string } | null;
    };
    expect(failedClosed.automation?.priorityMode).toBe("always-hold");
  });

  it("creates seats as always-hold (unseeded) when no automation map is provided", async () => {
    const engine = await fleshAndBloodCreateServerEngine(lifecycleCreateInput());
    if (!(engine instanceof FleshAndBloodServerEngine)) return;
    expect(engine.runtime.snapshot().automationPreferences).toMatchObject({
      p1: { priorityMode: "always-hold" },
      p2: { priorityMode: "always-hold" },
    });
    const unseeded = engine.getViewerState({ role: "player", actorId: "p2" }) as {
      automation: { priorityMode: string } | null;
    };
    expect(unseeded.automation?.priorityMode).toBe("always-hold");
  });

  it("surfaces the priority toggle as a custom-intent action and submits it through the interaction path", () => {
    const engine = serverEngine();
    const projection = projectFabInteraction(engine.runtime, "player-1");
    const toggleAction = projection.view.actions.find(
      (_action, index) =>
        projection.commandByActionId.get(projection.view.actions[index]!.id)?.move ===
        "set-automation-preferences",
    );
    expect(toggleAction?.intent).toBe("custom");
    expect(toggleAction?.text.key).toBe("Pass priority automatically");

    const submission = buildInteractionSubmission({
      view: projection.view,
      action: toggleAction!,
      values: {},
    });
    expect(commandForFabSubmission(engine.runtime, "player-1", submission)).toMatchObject({
      move: "set-automation-preferences",
      payload: { priorityMode: "auto-pass" },
    });

    const result = engine.submitInteraction("player-1", submission, {
      gameId: "fab-priority-toggle",
      sourceAuthority: "server",
    });
    expect(result.success).toBe(true);
    const viewer = engine.getViewerState({ role: "player", actorId: "player-1" }) as {
      automation: { priorityMode: string } | null;
    };
    expect(viewer.automation?.priorityMode).toBe("auto-pass");

    // The next projection offers the inverse toggle with the flipped label.
    const next = projectFabInteraction(engine.runtime, "player-1");
    const nextToggle = next.view.actions.find(
      (_action, index) =>
        next.commandByActionId.get(next.view.actions[index]!.id)?.move ===
        "set-automation-preferences",
    );
    expect(nextToggle?.text.key).toBe("Hold priority windows");
    expect(
      commandForFabSubmission(engine.runtime, "player-1", {
        ...submission,
        actionId: nextToggle!.id,
      }),
    ).toMatchObject({
      move: "set-automation-preferences",
      payload: { priorityMode: "always-hold" },
    });
  });

  it("identifies per-mode toggle actions by their exported label keys", () => {
    const engine = serverEngine();
    const projection = projectFabInteraction(engine.runtime, "player-1");
    const toggles = projection.view.actions.filter(
      (action) =>
        projection.commandByActionId.get(action.id)?.move === "set-automation-preferences",
    );
    // An unseeded seat sees every mode; each action is a sourceless custom
    // intent keyed by its stable engine label.
    // The unseeded seat defaults to always-hold, so its own label is
    // excluded; the autoOrder toggle rides behind the mode entries.
    expect(toggles.map((action) => action.text.key)).toEqual([
      FAB_PRIORITY_MODE_ACTION_LABEL["auto-pass"],
      FAB_PRIORITY_MODE_ACTION_LABEL["play-and-skip"],
      FAB_AUTOMATION_PREFERENCE_LABELS.autoOrderTriggersOn,
      FAB_AUTOMATION_PREFERENCE_LABELS.autoSelectSingletonTargetsOn,
    ]);
    for (const action of toggles) {
      expect(action.intent).toBe("custom");
      expect(action.source).toBeUndefined();
    }

    // Submitting the play-and-skip action switches the seat's mode.
    const submission = buildInteractionSubmission({
      view: projection.view,
      action: toggles[1]!,
      values: {},
    });
    expect(commandForFabSubmission(engine.runtime, "player-1", submission)).toMatchObject({
      move: "set-automation-preferences",
      payload: { priorityMode: "play-and-skip" },
    });
    const result = engine.submitInteraction("player-1", submission, {
      gameId: "fab-play-and-skip",
      sourceAuthority: "server",
    });
    expect(result.success).toBe(true);
    const viewer = engine.getViewerState({ role: "player", actorId: "player-1" }) as {
      automation: { priorityMode: string } | null;
    };
    expect(viewer.automation?.priorityMode).toBe("play-and-skip");
  });

  it("surfaces the one-shot arm as a custom-intent action and round-trips it through the interaction path", () => {
    const engine = serverEngine();
    // The arm is offered only once the seat is in play-and-skip mode.
    const initial = projectFabInteraction(engine.runtime, "player-1");
    expect(
      [...initial.commandByActionId.values()].some(
        (command) => command.move === "arm-priority-hold",
      ),
    ).toBe(false);

    const toggle = initial.view.actions.find(
      (action) => action.text.key === FAB_PRIORITY_MODE_ACTION_LABEL["play-and-skip"],
    );
    expect(toggle).toBeDefined();
    expect(
      engine.submitInteraction(
        "player-1",
        buildInteractionSubmission({ view: initial.view, action: toggle!, values: {} }),
        { gameId: "fab-arm-round-trip", sourceAuthority: "server" },
      ).success,
    ).toBe(true);

    const projection = projectFabInteraction(engine.runtime, "player-1");
    const arm = projection.view.actions.find(
      (action) => projection.commandByActionId.get(action.id)?.move === "arm-priority-hold",
    );
    expect(arm).toMatchObject({
      intent: "custom",
      text: { key: FAB_ARM_PRIORITY_HOLD_LABEL },
      enabled: true,
    });

    const submission = buildInteractionSubmission({
      view: projection.view,
      action: arm!,
      values: {},
    });
    expect(commandForFabSubmission(engine.runtime, "player-1", submission)).toMatchObject({
      move: "arm-priority-hold",
      payload: {},
    });
    const result = engine.submitInteraction("player-1", submission, {
      gameId: "fab-arm-round-trip",
      sourceAuthority: "server",
    });
    expect(result.success).toBe(true);
    const viewer = engine.getViewerState({ role: "player", actorId: "player-1" }) as {
      priorityHoldArmed: boolean | null;
    };
    expect(viewer.priorityHoldArmed).toBe(true);

    // An armed seat stops being offered the arm, and non-holders never see it.
    const afterArm = projectFabInteraction(engine.runtime, "player-1");
    expect(
      [...afterArm.commandByActionId.values()].some(
        (command) => command.move === "arm-priority-hold",
      ),
    ).toBe(false);
    const otherSeat = projectFabInteraction(engine.runtime, "player-2");
    expect(
      [...otherSeat.commandByActionId.values()].some(
        (command) => command.move === "arm-priority-hold",
      ),
    ).toBe(false);
  });

  it("keeps the priority toggle holder-only in the interaction projection", () => {
    const engine = serverEngine();
    const projection = projectFabInteraction(engine.runtime, "player-2");
    const toggleMoves = [...projection.commandByActionId.values()].filter(
      (command) => command.move === "set-automation-preferences",
    );
    expect(toggleMoves).toEqual([]);
  });

  it("projects and round-trips a card-scoped Instant auto-yield toggle", () => {
    const instant: FabCardDefinition = {
      canonicalId: "test-instant",
      name: "Test Instant",
      types: ["Instant"],
      cost: 0,
      abilities: [],
    };
    const fixture = FabTestEngine.create({
      player1: { hand: [instant.canonicalId], deck: 4, actionPoints: 1 },
      player2: { hand: [], deck: 4 },
      cardDefinitions: { [instant.canonicalId]: instant },
    });
    const engine = new FleshAndBloodServerEngine(fixture.getRuntime());
    const sourceInstanceId =
      engine.runtime.getState().containers.zonesByPlayerId["player-1"]!.hand[0]!;
    const projection = projectFabInteraction(engine.runtime, "player-1");
    const action = projection.view.actions.find(
      (candidate) => candidate.text.key === FAB_AUTOMATION_PREFERENCE_LABELS.instantYieldAdd,
    );

    expect(action).toMatchObject({
      intent: "custom",
      source: { kind: "card", instanceId: sourceInstanceId },
      enabled: true,
    });
    const submission = buildInteractionSubmission({
      view: projection.view,
      action: action!,
      values: {},
    });
    expect(commandForFabSubmission(engine.runtime, "player-1", submission)).toMatchObject({
      move: "set-automation-preferences",
      payload: { addInstantYieldCardId: instant.canonicalId },
      sourceInstanceId,
    });
    expect(
      engine.submitInteraction("player-1", submission, {
        gameId: "fab-instant-yield-round-trip",
        sourceAuthority: "server",
      }).success,
    ).toBe(true);
    expect(
      engine.runtime.getState().automationPreferences["player-1"]?.instantYieldCardIds,
    ).toEqual([instant.canonicalId]);
  });

  it("carries the seat's mode only in owner-private viewer projections", async () => {
    const engine = await fleshAndBloodCreateServerEngine(lifecycleCreateInput({ p1: "auto-pass" }));
    if (!(engine instanceof FleshAndBloodServerEngine)) return;
    const owner = engine.getViewerState({ role: "player", actorId: "p1" }) as {
      automation: { priorityMode: string } | null;
    };
    const otherSeat = engine.getViewerState({ role: "player", actorId: "p2" }) as {
      automation: { priorityMode: string } | null;
    };
    const spectator = engine.getViewerState({ role: "spectator" }) as {
      automation: { priorityMode: string } | null;
    };
    expect(owner.automation?.priorityMode).toBe("auto-pass");
    expect(otherSeat.automation?.priorityMode).toBe("always-hold");
    expect(spectator.automation).toBeNull();
  });

  it("carries the seat's one-shot arm only in owner-private viewer projections", async () => {
    const engine = await fleshAndBloodCreateServerEngine(
      lifecycleCreateInput({ p1: "play-and-skip" }),
    );
    if (!(engine instanceof FleshAndBloodServerEngine)) return;
    const armed = engine.dispatch(
      "arm-priority-hold",
      "p1",
      {},
      { gameId: "fab-arm-privacy", sourceAuthority: "server" },
    );
    expect(armed.success).toBe(true);
    expect(engine.runtime.snapshot().priorityHoldArmed).toEqual({ p1: true });

    const owner = engine.getViewerState({ role: "player", actorId: "p1" }) as {
      priorityHoldArmed: boolean | null;
    };
    const otherSeat = engine.getViewerState({ role: "player", actorId: "p2" }) as {
      priorityHoldArmed: boolean | null;
    };
    const spectator = engine.getViewerState({ role: "spectator" }) as {
      priorityHoldArmed: boolean | null;
    };
    expect(owner.priorityHoldArmed).toBe(true);
    expect(otherSeat.priorityHoldArmed).toBe(false);
    expect(spectator.priorityHoldArmed).toBeNull();
  });
});

describe("FAB adapter automation fixed point", () => {
  /**
   * Mirror of the engine regression in
   * `packages/engine/src/rules/priority-automation.test.ts`: the end-turn
   * dispatch latches the opponent's auto-declined trigger layer while the turn
   * player's auto-pass seat holds priority. The fixed point must close both
   * drains inside the one dispatch receipt, and the adapter's engine log
   * records must preserve the real pass order under a single state version.
   */
  it("returns one narrative receipt while keeping automatic-pass diagnostics internal", () => {
    const PLAYER_1 = "player-1";
    const PLAYER_2 = "player-2";
    const PRIORITY_AUTOMATION_PASS_KEY = "flesh-and-blood.priority-automation.auto-pass";
    const TRIGGER_AUTOMATION_PASS_KEY = "flesh-and-blood.trigger-automation.auto-pass";
    const watcher: FabCardDefinition = {
      canonicalId: "end-phase-watcher",
      name: "End Phase Watcher",
      types: ["Equipment", "Chest"],
      abilities: [
        {
          kind: "static",
          staticKind: "triggered",
          id: "end-phase-watcher-a1",
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
    };
    const canonicalIdsByInstance: Record<string, string> = {};
    const owners: Record<string, string[]> = { [PLAYER_1]: [], [PLAYER_2]: [] };
    const cardDefinitions: Record<string, FabCardDefinition> = {
      [watcher.canonicalId]: watcher,
    };
    for (const playerId of [PLAYER_1, PLAYER_2]) {
      for (let index = 0; index < 6; index += 1) {
        const canonicalId = `${playerId}-card-${index}`;
        canonicalIdsByInstance[`${canonicalId}-instance`] = canonicalId;
        owners[playerId]!.push(`${canonicalId}-instance`);
        cardDefinitions[canonicalId] = { canonicalId, name: canonicalId, types: ["Action"] };
      }
    }
    canonicalIdsByInstance["watcher-1"] = watcher.canonicalId;
    owners[PLAYER_2]!.push("watcher-1");

    const state = FabTestEngine.createStateForRulesTest({
      seed: "automation-fixed-point-adapter",
      player1Id: PLAYER_1,
      player2Id: PLAYER_2,
      cardsMaps: { canonicalIdsByInstance, owners },
      cardDefinitions,
      automationPreferences: { [PLAYER_1]: { priorityMode: "auto-pass" } },
    });
    // Empty hands keep every window in this scenario pass-only.
    for (const playerId of [PLAYER_1, PLAYER_2]) {
      const zones = state.containers.zonesByPlayerId[playerId]!;
      zones.deck.push(...zones.hand.splice(0, zones.hand.length));
    }
    // Seat the watcher in the opponent's chest and latch its optional trigger
    // (the engine-side regression derives this key from eligibility; here it
    // is the seated instance id).
    for (const zone of Object.values(state.containers.zonesByPlayerId[PLAYER_2]!)) {
      const index = zone.indexOf("watcher-1");
      if (index >= 0) zone.splice(index, 1);
    }
    state.containers.zonesByPlayerId[PLAYER_2]!.chest.push("watcher-1");
    state.optionalTriggerAutomation = {
      ...state.optionalTriggerAutomation,
      [PLAYER_2]: { "watcher-1": "auto-decline" },
    };

    const engine = new FleshAndBloodServerEngine(new FabMatchRuntime(state));
    const beforeStateID = engine.getStateID();

    const result = engine.dispatch(
      "end-turn",
      PLAYER_1,
      {},
      {
        gameId: "fab-automation-fixed-point",
        sourceAuthority: "server",
      },
    );

    expect(result.success).toBe(true);
    if (!result.success) return;
    // One dispatch — even one whose fixed point carries passes from both
    // drains — advances the public state version exactly once and publishes
    // exactly one command-scoped player narrative.
    expect(result.stateID).toBe(beforeStateID + 1);
    const records = result.engineLogRecords ?? [];
    expect(records).toHaveLength(1);
    expect(records.map((record) => record.stateVersion)).toEqual(
      records.map(() => beforeStateID + 1),
    );
    expect(records[0]?.log).toMatchObject({
      kind: "player-narrative",
      actorId: PLAYER_1,
      turnPlayerId: PLAYER_1,
    });
    const narrative = records[0]?.log as FabPlayerLog;
    const publicKeys = narrative.entries.flatMap((entry) =>
      entry.publicMessage ? [entry.publicMessage.key] : [],
    );
    expect(publicKeys).not.toContain(PRIORITY_AUTOMATION_PASS_KEY);
    expect(publicKeys).not.toContain(TRIGGER_AUTOMATION_PASS_KEY);
  });
});

describe("fleshAndBloodServerAdapter.automationSeedFromSettings", () => {
  it("seeds explicit modes parsed through the game contract settings schema", () => {
    expect(
      fleshAndBloodServerAdapter.automationSeedFromSettings?.([
        { seatId: "p1", gameSettings: { simulator: { priorityMode: "auto-pass" } } },
        { seatId: "p2", gameSettings: { simulator: { priorityMode: "always-hold" } } },
      ]),
    ).toEqual({
      p1: { priorityMode: "auto-pass", autoSelectSingletonTargets: true },
      p2: { priorityMode: "always-hold", autoSelectSingletonTargets: true },
    });
  });

  it("keeps singleton-target auto-select off when the account setting is false", () => {
    expect(
      fleshAndBloodServerAdapter.automationSeedFromSettings?.([
        {
          seatId: "p1",
          gameSettings: {
            simulator: { priorityMode: "auto-pass", autoSelectSingletonTargets: false },
          },
        },
      ]),
    ).toEqual({
      p1: { priorityMode: "auto-pass", autoSelectSingletonTargets: false },
    });
  });

  it("passes the play-and-skip mode through the contract settings schema", () => {
    expect(
      fleshAndBloodServerAdapter.automationSeedFromSettings?.([
        { seatId: "p1", gameSettings: { simulator: { priorityMode: "play-and-skip" } } },
        {
          seatId: "p2",
          gameSettings: {
            simulator: { priorityMode: "play-and-skip", optionalTriggerDeclines: ["card-a"] },
          },
        },
      ]),
    ).toEqual({
      p1: { priorityMode: "play-and-skip", autoSelectSingletonTargets: true },
      p2: {
        priorityMode: "play-and-skip",
        autoSelectSingletonTargets: true,
        optionalTriggerDeclines: ["card-a"],
      },
    });
  });

  it("omits garbage modes, guests, and non-object settings; empty seed is undefined", () => {
    expect(
      fleshAndBloodServerAdapter.automationSeedFromSettings?.([
        { seatId: "p1", gameSettings: { simulator: { priorityMode: "sometimes" } } },
        { seatId: "p2", gameSettings: undefined },
        { seatId: "p3", gameSettings: "garbage" },
      ]),
    ).toBeUndefined();
    expect(
      fleshAndBloodServerAdapter.automationSeedFromSettings?.([{ seatId: "p1", gameSettings: {} }]),
    ).toBeUndefined();
  });

  it("tolerates unrelated settings garbage beside a readable priority mode", () => {
    expect(
      fleshAndBloodServerAdapter.automationSeedFromSettings?.([
        {
          seatId: "p1",
          gameSettings: { simulator: { priorityMode: "always-hold" }, visual: { nonsense: true } },
        },
      ]),
    ).toEqual({ p1: { priorityMode: "always-hold", autoSelectSingletonTargets: true } });
  });

  it("emits the structured value only for seats with saved trigger declines", () => {
    expect(
      fleshAndBloodServerAdapter.automationSeedFromSettings?.([
        {
          seatId: "p1",
          gameSettings: {
            simulator: {
              priorityMode: "auto-pass",
              optionalTriggerDeclines: ["card-a", "card-b", "card-a"],
            },
          },
        },
        { seatId: "p2", gameSettings: { simulator: { priorityMode: "always-hold" } } },
      ]),
    ).toEqual({
      p1: {
        priorityMode: "auto-pass",
        autoSelectSingletonTargets: true,
        optionalTriggerDeclines: ["card-a", "card-b"],
      },
      p2: { priorityMode: "always-hold", autoSelectSingletonTargets: true },
    });
    // Declines without a readable mode contribute nothing (fail closed).
    expect(
      fleshAndBloodServerAdapter.automationSeedFromSettings?.([
        {
          seatId: "p1",
          gameSettings: { simulator: { optionalTriggerDeclines: ["card-a"] } },
        },
      ]),
    ).toBeUndefined();
  });
});
