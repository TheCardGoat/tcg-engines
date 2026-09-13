import { describe, expect, it } from "vite-plus/test";
import type { FabCardDefinitionInput } from "../cards.ts";
import { FabMatchRuntime } from "../runtime.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { dispatchTestCommand } from "../testing/test-command.ts";
import { decodeFabCommand, type FabMoveLog } from "../moves.ts";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "../automation/catalog-test-cards.ts";
import { eligibleOptionalTriggerSources } from "./optional-trigger-automation.ts";
import {
  FAB_ARM_PRIORITY_HOLD_LABEL,
  FAB_PRIORITY_MODE_ACTION_LABEL,
  FAB_AUTOMATION_PREFERENCE_LABELS,
  listLegalCommands,
} from "./legal-commands/index.ts";
import { getFabAutoPassPriorityCommand } from "./auto-pass.ts";
import { projectFabViewerState } from "../view.ts";
import { openFabPriority } from "../priority.ts";
import {
  FAB_DEFAULT_AUTOMATION_PREFERENCES,
  type FabChainLink,
  type FabPriorityAutomationMode,
} from "../state.ts";
import {
  bravo,
  cosmicFlareRed,
  dash,
  nimbleStrikeRed,
  nimblismBlue,
  snatchRed,
  threadbareTunic,
} from "./fixtures.ts";
import { fabObjectInstanceId, fabPlayerId } from "../game/identity.ts";
import {
  createFabMatchContext,
  isFabMatchSnapshotV21,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../snapshot/match-context.ts";

const PLAYER_1 = "player-1";
const PLAYER_2 = "player-2";
const PRIORITY_AUTOMATION_PASS_KEY = "flesh-and-blood.priority-automation.auto-pass";
const TRIGGER_AUTOMATION_PASS_KEY = "flesh-and-blood.trigger-automation.auto-pass";

function reactionStepLink(attackId = "attack-1"): FabChainLink {
  // Target the defender's actual hero so defense reactions quote as playable
  // in the Reaction Step (an unresolvable target reads as an ally attack).
  return {
    activeAttack: { kind: "card", sourceObjectId: fabObjectInstanceId(attackId) },
    attackingPlayerId: fabPlayerId(PLAYER_1),
    defendingPlayerId: fabPlayerId(PLAYER_2),
    attackTargetRef: {
      kind: "hero",
      playerId: fabPlayerId(PLAYER_2),
    },
    defendingInstanceIdsByTarget: { [PLAYER_2]: [] },
    defendingOrigins: {},
    damage: { status: "pending", outcomes: [] },
    wagers: [],
  };
}

/**
 * A combat Reaction-Step window held by the defender during the opponent's
 * attack. With an empty hand this is the canonical pass-only window; a defense
 * reaction in hand makes it a window with real actions.
 */
function createReactionStepRuntime(options?: {
  readonly defenderHand?: readonly string[];
  readonly defenderMode?: FabPriorityAutomationMode;
  readonly defenderInstantYieldCardIds?: readonly string[];
  readonly defenderArmed?: boolean;
  readonly defenderAutoOrder?: boolean;
  readonly step?: "reaction" | "resolution";
  readonly holder?: typeof PLAYER_1 | typeof PLAYER_2;
}): FabMatchRuntime {
  const fixture = FabTestEngine.create(
    {
      player1: { heroCardId: catalogIds.bravo, hand: [catalogIds.nimbleStrike], deck: 2 },
      player2: { heroCardId: catalogIds.rhinar, hand: options?.defenderHand ?? [], deck: 2 },
      cardDefinitions: {
        ...CATALOG_TEST_DEFINITIONS,
        [cosmicFlareRed.canonicalId]: cosmicFlareRed,
      },
    },
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
  const state = fixture.getRuntime().cloneState();
  const attackId = state.containers.zonesByPlayerId[PLAYER_1]!.hand[0];
  if (!attackId) throw new Error("Reaction-step fixture requires a real authored attack.");
  state.containers.zonesByPlayerId[PLAYER_1]!.hand = [];
  state.containers.zonesByPlayerId[PLAYER_1]!.combatChain = [attackId];
  const step = options?.step ?? "reaction";
  state.combat = {
    open: true,
    step,
    defenseDeclarationPending: false,
    activeLink: reactionStepLink(attackId),
  };
  openFabPriority(state, fabPlayerId(options?.holder ?? PLAYER_2), "combat", step);
  if (options?.defenderMode || options?.defenderAutoOrder !== undefined) {
    state.automationPreferences[PLAYER_2] = {
      ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
      ...(options?.defenderMode ? { priorityMode: options.defenderMode } : {}),
      ...(options?.defenderAutoOrder !== undefined
        ? { autoOrderTriggers: options.defenderAutoOrder }
        : {}),
      ...(options?.defenderInstantYieldCardIds
        ? { instantYieldCardIds: options.defenderInstantYieldCardIds }
        : {}),
    };
  }
  if (options?.defenderArmed) {
    state.priorityHoldArmed = { [PLAYER_2]: true };
  }
  return new FabMatchRuntime(state);
}

function automaticPriorityPassLogs(moveLogs: readonly FabMoveLog[]): FabMoveLog[] {
  return moveLogs.filter((log) =>
    log.public.some((message) => message.key === PRIORITY_AUTOMATION_PASS_KEY),
  );
}

describe("FAB priority automation modes", () => {
  describe("pass-only derivation", () => {
    it("derives the single pass for a pass-only window", () => {
      const runtime = createReactionStepRuntime();
      const command = getFabAutoPassPriorityCommand(runtime);
      expect(command).toMatchObject({ move: "pass", payload: {} });
    });

    it("returns null under the never policy even in a pass-only window", () => {
      const runtime = createReactionStepRuntime();
      expect(getFabAutoPassPriorityCommand(runtime, { kind: "never" })).toBeNull();
    });

    it("never automates a window with real actions available", () => {
      const runtime = createReactionStepRuntime({ defenderHand: [catalogIds.sinkBelow] });
      const legal = listLegalCommands(runtime, PLAYER_2);
      expect(legal.some((command) => command.move === "begin-play")).toBe(true);
      expect(getFabAutoPassPriorityCommand(runtime)).toBeNull();
    });

    it.each([
      { mode: "auto-pass" as const, policy: { kind: "pass-only" as const } },
      { mode: "play-and-skip" as const, policy: { kind: "own-skip" as const } },
    ])(
      "$mode ignores a yielded playable Instant when it is the only blocker",
      ({ mode, policy }) => {
        const runtime = createReactionStepRuntime({
          defenderHand: [cosmicFlareRed.canonicalId],
          defenderMode: mode,
          defenderInstantYieldCardIds: [cosmicFlareRed.canonicalId],
        });
        const instant = listLegalCommands(runtime, PLAYER_2).find(
          (command) =>
            command.move === "begin-play" && command.priorityYield?.kind === "instant-use",
        );
        expect(instant?.priorityYield?.canonicalId).toBe(cosmicFlareRed.canonicalId);
        expect(getFabAutoPassPriorityCommand(runtime, policy)).toMatchObject({ move: "pass" });
      },
    );

    it("keeps Instant yields inactive in always-hold", () => {
      const runtime = createReactionStepRuntime({
        defenderHand: [cosmicFlareRed.canonicalId],
        defenderMode: "always-hold",
        defenderInstantYieldCardIds: [cosmicFlareRed.canonicalId],
      });
      expect(getFabAutoPassPriorityCommand(runtime, { kind: "never" })).toBeNull();
    });

    it("does not drain while another non-yielded legal response remains", () => {
      const runtime = createReactionStepRuntime({
        defenderHand: [cosmicFlareRed.canonicalId, catalogIds.sinkBelow],
        defenderMode: "auto-pass",
        defenderInstantYieldCardIds: [cosmicFlareRed.canonicalId],
      });
      expect(getFabAutoPassPriorityCommand(runtime, { kind: "pass-only" })).toBeNull();
    });

    it("never automates the terminal Action-Phase window", () => {
      const fixture = FabTestEngine.create({
        player1: { hand: [catalogIds.nimblismBlue], deck: 2 },
        player2: { hand: [], deck: 2 },
        cardDefinitions: CATALOG_TEST_DEFINITIONS,
      });
      const state = fixture.getRuntime().cloneState();
      state.automationPreferences[PLAYER_1] = {
        ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
        priorityMode: "auto-pass",
      };
      const runtime = new FabMatchRuntime(state);
      expect(runtime.getState().phase).toBe("action");
      expect(runtime.getState().rulesStack).toHaveLength(0);
      expect(runtime.getState().combat).toBeNull();
      expect(getFabAutoPassPriorityCommand(runtime)).toBeNull();
    });

    it("never automates while an engine decision is pending", () => {
      const fixture = FabTestEngine.create(
        {
          player1: {
            heroCardId: catalogIds.bravo,
            hand: [
              catalogIds.disable,
              catalogIds.crackedBauble,
              catalogIds.crackedBauble,
              catalogIds.nimblismBlue,
            ],
            deck: 6,
            actionPoints: 1,
            resourcePoints: 0,
          },
          player2: { heroCardId: catalogIds.rhinar, hand: [], deck: 4 },
          cardDefinitions: CATALOG_TEST_DEFINITIONS,
        },
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      const state = fixture.getRuntime().cloneState();
      state.automationPreferences[PLAYER_1] = {
        ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
        priorityMode: "auto-pass",
      };
      const runtime = new FabMatchRuntime(state);
      const announced = listLegalCommands(runtime, PLAYER_1).find(
        (command) =>
          command.move === "begin-play" &&
          runtime.getState().objects[String(command.payload.instanceId)]?.canonicalId ===
            catalogIds.disable,
      );
      expect(announced).toBeDefined();
      const play = dispatchTestCommand(runtime, "begin-play", PLAYER_1, {
        instanceId: announced!.payload.instanceId,
      });
      expect(play).toMatchObject({ accepted: true });
      expect(runtime.getState().decision).toBeTruthy();
      expect(getFabAutoPassPriorityCommand(runtime)).toBeNull();
    });

    it("never automates a pending Defend-Step defense declaration", () => {
      const fixture = FabTestEngine.create({
        player1: { hand: [catalogIds.nimbleStrike], deck: 2 },
        player2: { hand: [], deck: 2 },
        cardDefinitions: CATALOG_TEST_DEFINITIONS,
      });
      const state = fixture.getRuntime().cloneState();
      const attackId = state.containers.zonesByPlayerId[PLAYER_1]!.hand[0]!;
      state.containers.zonesByPlayerId[PLAYER_1]!.hand = [];
      state.containers.zonesByPlayerId[PLAYER_1]!.combatChain = [attackId];
      state.combat = {
        open: true,
        step: "defend",
        defenseDeclarationPending: true,
        activeLink: reactionStepLink(attackId),
      };
      // Priority is structurally closed during the declaration; force one open
      // to pin that the derivation still refuses to close this window.
      openFabPriority(state, fabPlayerId(PLAYER_2), "combat", "defend");
      state.automationPreferences[PLAYER_2] = {
        ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
        priorityMode: "auto-pass",
      };
      const runtime = new FabMatchRuntime(state);
      expect(getFabAutoPassPriorityCommand(runtime)).toBeNull();
    });
  });

  describe("authoritative drain", () => {
    it("closes an auto-pass seat's pass-only window inside the triggering command's receipt", () => {
      const runtime = createReactionStepRuntime();
      const beforeStateID = runtime.getState().stateID;

      const result = dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_2, {
        priorityMode: "auto-pass",
      });

      expect(result).toMatchObject({ accepted: true });
      // One accepted command — even one carrying automatic passes — advances
      // the public state version exactly once.
      expect(runtime.getState().stateID).toBe(beforeStateID + 1);
      expect(runtime.getState().automationPreferences[PLAYER_2]?.priorityMode).toBe("auto-pass");
      // The defender's pass-only reaction window closed; priority moved on.
      expect(runtime.getState().priority?.holderPlayerId).toBe(fabPlayerId(PLAYER_1));

      expect(result.accepted && result.moveLogs.length).toBeGreaterThan(1);
      const logs = result.accepted ? result.moveLogs : [];
      expect(
        logs.some((log) =>
          (log.privateByPlayerId?.[PLAYER_2] ?? []).some(
            (message) => message.key === "flesh-and-blood.command.set-automation-preferences",
          ),
        ),
      ).toBe(true);
      expect(
        logs.some((log) =>
          log.public.some(
            (message) => message.key === "flesh-and-blood.command.set-automation-preferences",
          ),
        ),
      ).toBe(false);
      expect(
        logs.some((log) =>
          (log.privateByPlayerId?.[PLAYER_1] ?? []).some(
            (message) => message.key === "flesh-and-blood.command.set-automation-preferences",
          ),
        ),
      ).toBe(false);
      const automatic = automaticPriorityPassLogs(logs);
      expect(automatic).toHaveLength(1);
      expect(automatic[0]).toMatchObject({ moveType: "pass", playerId: PLAYER_2 });
    });

    it("stops draining the moment the seat toggles back to always-hold", () => {
      const runtime = createReactionStepRuntime({ defenderMode: "auto-pass" });
      expect(getFabAutoPassPriorityCommand(runtime)).toMatchObject({ move: "pass" });

      const result = dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_2, {
        priorityMode: "always-hold",
      });

      expect(result).toMatchObject({ accepted: true });
      expect(result.accepted && automaticPriorityPassLogs(result.moveLogs)).toHaveLength(0);
      expect(runtime.getState().priority?.holderPlayerId).toBe(fabPlayerId(PLAYER_2));
    });

    it("leaves always-hold seats untouched at the dispatch tail", () => {
      const runtime = createReactionStepRuntime();

      const result = dispatchTestCommand(runtime, "pass", PLAYER_2, {});

      expect(result).toMatchObject({ accepted: true });
      expect(result.accepted && automaticPriorityPassLogs(result.moveLogs)).toHaveLength(0);
      expect(runtime.getState().priority?.holderPlayerId).toBe(fabPlayerId(PLAYER_1));
    });

    it("does not drain a pass-only window while real actions remain", () => {
      const runtime = createReactionStepRuntime({
        defenderHand: [catalogIds.sinkBelow],
        defenderMode: "auto-pass",
      });

      const result = dispatchTestCommand(runtime, "pass", PLAYER_2, {});

      // The manual pass is the only pass; the seat's auto-pass mode added none
      // before it (the window was not pass-only while unmovable was playable).
      expect(result).toMatchObject({ accepted: true });
      expect(result.accepted && automaticPriorityPassLogs(result.moveLogs)).toHaveLength(0);
    });
  });

  describe("set-priority-automation move", () => {
    it("is legal for any priority holder, including defenders during the opponent's combat", () => {
      const runtime = createReactionStepRuntime();
      expect(runtime.enumerateMoves(PLAYER_2)).toContain("set-automation-preferences");
      const legal = listLegalCommands(runtime, PLAYER_2);
      const toggle = legal.find((command) => command.move === "set-automation-preferences");
      // Player-owned UI configuration, never a bot action candidate.
      expect(toggle?.automation).toBe("player-only");
      expect(toggle?.payload).toEqual({ priorityMode: "auto-pass" });
    });

    it("offers the inverse mode once a seat is in auto-pass", () => {
      const runtime = createReactionStepRuntime({ defenderMode: "auto-pass" });
      const toggle = listLegalCommands(runtime, PLAYER_2).find(
        (command) => command.move === "set-automation-preferences",
      );
      expect(toggle?.payload).toEqual({ priorityMode: "always-hold" });
    });

    it("generates preference payloads that decodeFabCommand accepts verbatim", () => {
      const runtime = createReactionStepRuntime({ defenderMode: "auto-pass" });
      const commands = listLegalCommands(runtime, PLAYER_2).filter(
        (command) => command.move === "set-automation-preferences",
      );
      expect(commands.length).toBeGreaterThan(0);
      for (const command of commands) {
        // Practice and automation consumers pass FabLegalCommand.payload
        // straight to the decoder; a nested or foreign shape is malformed.
        expect(decodeFabCommand(command.move, command.payload)).not.toBeNull();
      }
    });

    it("rejects actors who do not hold priority", () => {
      const runtime = createReactionStepRuntime();
      const result = dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_1, {
        priorityMode: "auto-pass",
      });
      expect(result).toMatchObject({ accepted: false, errorCode: "priority_automation_timing" });
    });

    it("rejects the toggle while an engine decision is pending", () => {
      const fixture = FabTestEngine.create(
        {
          player1: {
            heroCardId: catalogIds.bravo,
            hand: [
              catalogIds.disable,
              catalogIds.crackedBauble,
              catalogIds.crackedBauble,
              catalogIds.nimblismBlue,
            ],
            deck: 6,
            actionPoints: 1,
            resourcePoints: 0,
          },
          player2: { heroCardId: catalogIds.rhinar, hand: [], deck: 4 },
          cardDefinitions: CATALOG_TEST_DEFINITIONS,
        },
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      const runtime = fixture.getRuntime();
      const announced = listLegalCommands(runtime, PLAYER_1).find(
        (command) =>
          command.move === "begin-play" &&
          runtime.getState().objects[String(command.payload.instanceId)]?.canonicalId ===
            catalogIds.disable,
      );
      expect(announced).toBeDefined();
      const play = dispatchTestCommand(runtime, "begin-play", PLAYER_1, {
        instanceId: announced!.payload.instanceId,
      });
      expect(play).toMatchObject({ accepted: true });
      expect(runtime.getState().decision).toBeTruthy();

      const result = dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_1, {
        priorityMode: "auto-pass",
      });
      expect(result).toMatchObject({ accepted: false, errorCode: "decision_pending" });
    });
  });

  describe("viewer projection", () => {
    it("exposes the seat's mode only to that seat", () => {
      const runtime = createReactionStepRuntime({ defenderMode: "auto-pass" });
      const state = runtime.getState();

      expect(
        projectFabViewerState(state, { role: "player", actorId: PLAYER_2 }).automation
          ?.priorityMode,
      ).toBe("auto-pass");
      // Missing seats fail closed to always-hold.
      expect(
        projectFabViewerState(state, { role: "player", actorId: PLAYER_1 }).automation
          ?.priorityMode,
      ).toBe("always-hold");
      expect(projectFabViewerState(state, { role: "spectator" }).automation).toBeNull();
      expect(projectFabViewerState(state, { role: "replay" }).automation).toBeNull();
    });

    it("exposes the seat's one-shot arm only to that seat", () => {
      const runtime = createReactionStepRuntime({
        defenderMode: "play-and-skip",
        defenderArmed: true,
      });
      const state = runtime.getState();

      expect(
        projectFabViewerState(state, { role: "player", actorId: PLAYER_2 }).priorityHoldArmed,
      ).toBe(true);
      expect(
        projectFabViewerState(state, { role: "player", actorId: PLAYER_1 }).priorityHoldArmed,
      ).toBe(false);
      expect(projectFabViewerState(state, { role: "spectator" }).priorityHoldArmed).toBeNull();
      expect(projectFabViewerState(state, { role: "replay" }).priorityHoldArmed).toBeNull();
    });
  });

  describe("initialization and persistence", () => {
    it("defaults a missing seat to the fail-closed automation profile", () => {
      const state = FabTestEngine.createStateForRulesTest({
        seed: "automation-defaults",
        player1Id: "p1",
        player2Id: "p2",
        cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
      });
      expect(state.automationPreferences).toEqual({
        p1: FAB_DEFAULT_AUTOMATION_PREFERENCES,
        p2: FAB_DEFAULT_AUTOMATION_PREFERENCES,
      });
    });

    it("seeds a structured automation profile for seated seats only", () => {
      const state = FabTestEngine.createStateForRulesTest({
        seed: "automation-structured-seed",
        player1Id: "p1",
        player2Id: "p2",
        cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
        automationPreferences: {
          p1: {
            priorityMode: "play-and-skip",
            autoOrderTriggers: true,
            playAndSkipHoldCardIds: ["WTR150"],
          },
          ghost: { priorityMode: "auto-pass" },
        },
      });
      expect(state.automationPreferences.p1).toEqual({
        ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
        priorityMode: "play-and-skip",
        autoOrderTriggers: true,
        playAndSkipHoldCardIds: ["WTR150"],
      });
      expect(state.automationPreferences.p2).toEqual(FAB_DEFAULT_AUTOMATION_PREFERENCES);
      expect(state.automationPreferences.ghost).toBeUndefined();
    });

    it("seats only the priority-automation seed for known players", () => {
      const state = FabTestEngine.createStateForRulesTest({
        seed: "priority-automation-seed",
        player1Id: "p1",
        player2Id: "p2",
        cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
        automationPreferences: {
          p1: { priorityMode: "auto-pass" },
          ghost: { priorityMode: "always-hold" },
        },
      });
      expect(state.automationPreferences.p1?.priorityMode).toBe("auto-pass");
      expect(state.automationPreferences.p2).toEqual(FAB_DEFAULT_AUTOMATION_PREFERENCES);
    });

    it("maps declined canonical ids onto owned instances for seated seats only", () => {
      const state = FabTestEngine.createStateForRulesTest({
        seed: "trigger-decline-seed",
        player1Id: "p1",
        player2Id: "p2",
        cardsMaps: {
          canonicalIdsByInstance: { "p1-watch-1": "c-watch", "p2-card-1": "c-p2" },
          owners: { p1: ["p1-watch-1"], p2: ["p2-card-1"] },
        },
        optionalTriggerDeclines: {
          // c-watch maps to the instance p1 owns; c-unknown matches nothing;
          // c-p2 belongs to p2, so it must not seed under p1.
          p1: { "c-watch": true, "c-unknown": true, "c-p2": true },
          // p2 does not own c-watch; its own card is not declined here.
          p2: { "c-watch": true },
          ghost: { "c-p2": true },
        },
      });
      expect(state.optionalTriggerAutomation).toEqual({
        p1: { "p1-watch-1": "auto-decline" },
      });
    });

    it("round-trips seeded trigger declines through the v20 snapshot", () => {
      const state = FabTestEngine.createStateForRulesTest({
        seed: "trigger-decline-snapshot",
        player1Id: "p1",
        player2Id: "p2",
        cardsMaps: {
          canonicalIdsByInstance: { "p1-watch-1": "c-watch" },
          owners: { p1: ["p1-watch-1"], p2: [] },
        },
        optionalTriggerDeclines: { p1: { "c-watch": true } },
      });
      // Seeded instance keys must exist as objects or snapshot validation
      // rejects — the owned-instance mapping guarantees they do.
      const snapshot = serializeFabMatchSnapshot(state);
      expect(snapshot.optionalTriggerAutomation).toEqual({
        p1: { "p1-watch-1": "auto-decline" },
      });

      const restored = restoreFabMatchSnapshot(
        snapshot,
        createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
      );
      expect(restored.optionalTriggerAutomation).toEqual({
        p1: { "p1-watch-1": "auto-decline" },
      });
      expect(serializeFabMatchSnapshot(restored)).toEqual(snapshot);
    });

    it("leaves every seat asking when no trigger-decline seed is provided", () => {
      const state = FabTestEngine.createStateForRulesTest({
        seed: "trigger-decline-absent",
        player1Id: "p1",
        player2Id: "p2",
        cardsMaps: {
          canonicalIdsByInstance: { "p1-watch-1": "c-watch" },
          owners: { p1: ["p1-watch-1"], p2: [] },
        },
        // A seed where nothing matches must also produce an empty record.
        optionalTriggerDeclines: { p2: { "c-watch": true } },
      });
      expect(state.optionalTriggerAutomation).toEqual({});
    });

    it("round-trips per-seat modes and one-shot arms through the v20 snapshot", () => {
      const state = FabTestEngine.createStateForRulesTest({
        seed: "priority-automation-snapshot",
        player1Id: "p1",
        player2Id: "p2",
        cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
        automationPreferences: {
          p1: { priorityMode: "auto-pass", instantYieldCardIds: ["instant-card"] },
          p2: { priorityMode: "play-and-skip" },
        },
      });
      state.priorityHoldArmed = { p2: true };
      const snapshot = serializeFabMatchSnapshot(state);
      expect(snapshot.automationPreferences).toEqual({
        p1: {
          ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
          priorityMode: "auto-pass",
          instantYieldCardIds: ["instant-card"],
        },
        p2: { ...FAB_DEFAULT_AUTOMATION_PREFERENCES, priorityMode: "play-and-skip" },
      });
      expect(snapshot.priorityHoldArmed).toEqual({ p2: true });

      const restored = restoreFabMatchSnapshot(
        snapshot,
        createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
      );
      expect(restored.automationPreferences).toEqual({
        p1: {
          ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
          priorityMode: "auto-pass",
          instantYieldCardIds: ["instant-card"],
        },
        p2: { ...FAB_DEFAULT_AUTOMATION_PREFERENCES, priorityMode: "play-and-skip" },
      });
      expect(restored.priorityHoldArmed).toEqual({ p2: true });
      expect(serializeFabMatchSnapshot(restored)).toEqual(snapshot);
    });

    it("rejects snapshots whose priority automation references unseated players or unknown modes", () => {
      const state = FabTestEngine.createStateForRulesTest({
        seed: "priority-automation-admission",
        player1Id: "p1",
        player2Id: "p2",
        cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
        automationPreferences: { p1: { priorityMode: "auto-pass" } },
      });
      const snapshot = serializeFabMatchSnapshot(state);

      expect(isFabMatchSnapshotV21(snapshot)).toBe(true);
      expect(
        isFabMatchSnapshotV21({
          ...snapshot,
          automationPreferences: { p3: { priorityMode: "auto-pass" } },
        }),
      ).toBe(false);
      expect(
        isFabMatchSnapshotV21({
          ...snapshot,
          automationPreferences: {
            p1: { ...FAB_DEFAULT_AUTOMATION_PREFERENCES, priorityMode: "sometimes-pass" as never },
          },
        }),
      ).toBe(false);
      const { automationPreferences: _omitted, ...withoutModes } = snapshot;
      void _omitted;
      expect(isFabMatchSnapshotV21(withoutModes)).toBe(false);
    });

    it("rejects malformed one-shot arms and window origins in snapshots", () => {
      const state = FabTestEngine.createStateForRulesTest({
        seed: "priority-hold-admission",
        player1Id: "p1",
        player2Id: "p2",
        cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
        automationPreferences: { p2: { priorityMode: "play-and-skip" } },
      });
      state.priorityHoldArmed = { p1: true };
      const snapshot = serializeFabMatchSnapshot(state);

      expect(isFabMatchSnapshotV21(snapshot)).toBe(true);
      // Arms must reference seated players and carry only the literal true.
      expect(isFabMatchSnapshotV21({ ...snapshot, priorityHoldArmed: { p3: true } })).toBe(false);
      expect(
        isFabMatchSnapshotV21({ ...snapshot, priorityHoldArmed: { p1: false as never } }),
      ).toBe(false);
      const { priorityHoldArmed: _arms, ...withoutArms } = snapshot;
      void _arms;
      expect(isFabMatchSnapshotV21(withoutArms)).toBe(false);
      // The persisted window origin admits exactly the engine's own stamp:
      // the own-action object carrying its source instance.
      expect(snapshot.priority).not.toBeNull();
      expect(
        isFabMatchSnapshotV21({
          ...snapshot,
          priority: {
            ...snapshot.priority!,
            origin: { kind: "own-action", sourceInstanceId: "instance-1" },
          },
        }),
      ).toBe(true);
      expect(
        isFabMatchSnapshotV21({
          ...snapshot,
          priority: { ...snapshot.priority!, origin: "own-action" as never },
        }),
      ).toBe(false);
      expect(
        isFabMatchSnapshotV21({
          ...snapshot,
          priority: {
            ...snapshot.priority!,
            origin: { kind: "own-action" } as never,
          },
        }),
      ).toBe(false);
      expect(
        isFabMatchSnapshotV21({
          ...snapshot,
          priority: {
            ...snapshot.priority!,
            origin: { kind: "opponent-action", sourceInstanceId: "instance-1" } as never,
          },
        }),
      ).toBe(false);
    });

    it("keeps restored auto-pass seats draining", () => {
      const state = FabTestEngine.createStateForRulesTest({
        seed: "priority-automation-restore-drain",
        player1Id: PLAYER_1,
        player2Id: PLAYER_2,
        cardsMaps: { canonicalIdsByInstance: {}, owners: { [PLAYER_1]: [], [PLAYER_2]: [] } },
        automationPreferences: { [PLAYER_1]: { priorityMode: "auto-pass" } },
      });
      const snapshot = serializeFabMatchSnapshot(state);
      const restored = restoreFabMatchSnapshot(
        snapshot,
        createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
      );
      expect(restored.automationPreferences[PLAYER_1]?.priorityMode).toBe("auto-pass");

      // The restored mode — not any client-side memory — must drive the drain.
      restored.combat = {
        open: true,
        step: "reaction",
        defenseDeclarationPending: false,
        activeLink: reactionStepLink(),
      };
      openFabPriority(restored, fabPlayerId(PLAYER_1), "combat", "reaction");
      const restoredRuntime = new FabMatchRuntime(restored);
      expect(getFabAutoPassPriorityCommand(restoredRuntime)).toMatchObject({ move: "pass" });
    });

    it("keeps restored play-and-skip seats skipping their own windows only", () => {
      const state = FabTestEngine.createStateForRulesTest({
        seed: "play-and-skip-restore-drain",
        player1Id: PLAYER_1,
        player2Id: PLAYER_2,
        cardsMaps: { canonicalIdsByInstance: {}, owners: { [PLAYER_1]: [], [PLAYER_2]: [] } },
        automationPreferences: { [PLAYER_1]: { priorityMode: "play-and-skip" } },
      });
      const snapshot = serializeFabMatchSnapshot(state);
      const restored = restoreFabMatchSnapshot(
        snapshot,
        createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
      );
      expect(restored.automationPreferences[PLAYER_1]?.priorityMode).toBe("play-and-skip");

      // The restored mode — not any client-side memory — must drive the skip:
      // only the origin-stamped window closes; the same seat's unstamped
      // window in the identical combat stays held.
      restored.combat = {
        open: true,
        step: "reaction",
        defenseDeclarationPending: false,
        activeLink: reactionStepLink(),
      };
      openFabPriority(restored, fabPlayerId(PLAYER_1), "combat", "reaction", {
        kind: "own-action",
        sourceInstanceId: fabObjectInstanceId("attack-1"),
      });
      // The runtime clones the external state it receives, so stage each
      // window before construction.
      let restoredRuntime = new FabMatchRuntime(restored);
      expect(getFabAutoPassPriorityCommand(restoredRuntime, { kind: "own-skip" })).toMatchObject({
        move: "pass",
      });
      openFabPriority(restored, fabPlayerId(PLAYER_1), "combat", "reaction");
      restoredRuntime = new FabMatchRuntime(restored);
      expect(getFabAutoPassPriorityCommand(restoredRuntime, { kind: "own-skip" })).toBeNull();
    });
  });

  describe("legal listing", () => {
    interface PreferencePatch {
      readonly priorityMode?: FabPriorityAutomationMode;
      readonly autoOrderTriggers?: boolean;
      readonly autoSelectSingletonTargets?: boolean;
      readonly addPlayAndSkipHoldCardId?: string;
      readonly removePlayAndSkipHoldCardId?: string;
      readonly addOpponentTriggerYieldCardId?: string;
      readonly removeOpponentTriggerYieldCardId?: string;
      readonly addInstantYieldCardId?: string;
      readonly removeInstantYieldCardId?: string;
    }

    function preferencePatch(
      command: ReturnType<typeof listLegalCommands>[number],
    ): PreferencePatch {
      return command.payload as PreferencePatch;
    }

    function preferenceModeEntries(runtime: FabMatchRuntime) {
      return listLegalCommands(runtime, PLAYER_2)
        .filter(
          (command) =>
            command.move === "set-automation-preferences" &&
            preferencePatch(command).priorityMode !== undefined,
        )
        .map((command) => preferencePatch(command).priorityMode as FabPriorityAutomationMode);
    }

    it("offers one mode entry per other mode with stable labels", () => {
      const runtime = createReactionStepRuntime();
      // Every seat carries an explicit profile (default always-hold), so the
      // current mode is excluded and exactly the other two modes are offered.
      expect(preferenceModeEntries(runtime)).toEqual(["auto-pass", "play-and-skip"]);
      const modeCommands = listLegalCommands(runtime, PLAYER_2).filter(
        (command) =>
          command.move === "set-automation-preferences" &&
          preferencePatch(command).priorityMode !== undefined,
      );
      for (const entry of modeCommands) {
        expect(entry.automation).toBe("player-only");
        expect(entry.label).toBe(
          FAB_PRIORITY_MODE_ACTION_LABEL[preferencePatch(entry).priorityMode!],
        );
      }
    });

    it("offers the autoOrder toggle with a label that flips with the profile", () => {
      const runtime = createReactionStepRuntime();
      const toggles = listLegalCommands(runtime, PLAYER_2).filter(
        (command) =>
          command.move === "set-automation-preferences" &&
          preferencePatch(command).autoOrderTriggers !== undefined,
      );
      expect(toggles).toHaveLength(1);
      expect(toggles[0]).toMatchObject({
        payload: { autoOrderTriggers: true },
        automation: "player-only",
        label: FAB_AUTOMATION_PREFERENCE_LABELS.autoOrderTriggersOn,
      });

      const optedIn = createReactionStepRuntime({ defenderAutoOrder: true });
      const flipped = listLegalCommands(optedIn, PLAYER_2).filter(
        (command) =>
          command.move === "set-automation-preferences" &&
          preferencePatch(command).autoOrderTriggers !== undefined,
      );
      expect(flipped[0]).toMatchObject({
        payload: { autoOrderTriggers: false },
        label: FAB_AUTOMATION_PREFERENCE_LABELS.autoOrderTriggersOff,
      });
    });

    it("offers the singleton-target auto-select toggle with a label that flips with the profile", () => {
      const runtime = createReactionStepRuntime();
      const toggles = listLegalCommands(runtime, PLAYER_2).filter(
        (command) =>
          command.move === "set-automation-preferences" &&
          preferencePatch(command).autoSelectSingletonTargets !== undefined,
      );
      expect(toggles).toHaveLength(1);
      expect(toggles[0]).toMatchObject({
        payload: { autoSelectSingletonTargets: true },
        automation: "player-only",
        label: FAB_AUTOMATION_PREFERENCE_LABELS.autoSelectSingletonTargetsOn,
      });
    });

    it("excludes the current mode and offers the arm only to unarmed play-and-skip holders", () => {
      const runtime = createReactionStepRuntime({ defenderMode: "play-and-skip" });
      expect(preferenceModeEntries(runtime)).toEqual(["auto-pass", "always-hold"]);

      expect(runtime.enumerateMoves(PLAYER_2)).toContain("arm-priority-hold");
      const arm = listLegalCommands(runtime, PLAYER_2).find(
        (command) => command.move === "arm-priority-hold",
      );
      expect(arm).toMatchObject({
        payload: {},
        automation: "player-only",
        label: FAB_ARM_PRIORITY_HOLD_LABEL,
      });

      // Armed seats stop offering the arm...
      const armed = createReactionStepRuntime({
        defenderMode: "play-and-skip",
        defenderArmed: true,
      });
      expect(armed.enumerateMoves(PLAYER_2)).not.toContain("arm-priority-hold");
      // ...and it never appears for seats in other modes or without priority.
      expect(
        createReactionStepRuntime({ defenderMode: "auto-pass" }).enumerateMoves(PLAYER_2),
      ).not.toContain("arm-priority-hold");
      expect(
        createReactionStepRuntime({ defenderMode: "always-hold" }).enumerateMoves(PLAYER_2),
      ).not.toContain("arm-priority-hold");
      expect(runtime.enumerateMoves(PLAYER_1)).not.toContain("arm-priority-hold");
    });
  });

  describe("set-automation-preferences patch command", () => {
    it("couples Auto-pass to auto-order and Hold priority to manual trigger ordering", () => {
      const runtime = createReactionStepRuntime();

      expect(
        dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_2, {
          priorityMode: "auto-pass",
        }),
      ).toMatchObject({ accepted: true });
      expect(runtime.getState().automationPreferences[PLAYER_2]).toMatchObject({
        priorityMode: "auto-pass",
        autoOrderTriggers: true,
      });

      const optedIn = createReactionStepRuntime({ defenderAutoOrder: true });
      expect(
        dispatchTestCommand(optedIn, "set-automation-preferences", PLAYER_2, {
          priorityMode: "always-hold",
        }),
      ).toMatchObject({ accepted: true });
      expect(optedIn.getState().automationPreferences[PLAYER_2]).toMatchObject({
        priorityMode: "always-hold",
        autoOrderTriggers: false,
      });
    });

    it("adds and removes per-card list entries additively and toggles autoOrder", () => {
      const runtime = createReactionStepRuntime();
      expect(
        dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_2, {
          addPlayAndSkipHoldCardId: "WTR150",
        }),
      ).toMatchObject({ accepted: true });
      expect(
        dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_2, {
          addOpponentTriggerYieldCardId: "tunic",
          addInstantYieldCardId: "cosmic-duality",
          autoOrderTriggers: true,
        }),
      ).toMatchObject({ accepted: true });
      expect(runtime.getState().automationPreferences[PLAYER_2]).toEqual({
        ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
        autoOrderTriggers: true,
        playAndSkipHoldCardIds: ["WTR150"],
        opponentTriggerYieldCardIds: ["tunic"],
        instantYieldCardIds: ["cosmic-duality"],
      });

      // Adds never duplicate; removes drop the entry.
      expect(
        dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_2, {
          addPlayAndSkipHoldCardId: "WTR150",
          removeOpponentTriggerYieldCardId: "tunic",
          removeInstantYieldCardId: "cosmic-duality",
        }),
      ).toMatchObject({ accepted: true });
      expect(runtime.getState().automationPreferences[PLAYER_2]).toEqual({
        ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
        autoOrderTriggers: true,
        playAndSkipHoldCardIds: ["WTR150"],
        opponentTriggerYieldCardIds: [],
        instantYieldCardIds: [],
      });
    });

    it("logs auto-yield changes with the card name instead of internal patch keys", () => {
      const runtime = createReactionStepRuntime();
      const enable = dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_2, {
        addInstantYieldCardId: snatchRed.canonicalId,
      });
      expect(enable).toMatchObject({ accepted: true });
      expect(
        enable.accepted && enable.moveLogs[0]?.privateByPlayerId?.[PLAYER_2]?.[0],
      ).toMatchObject({
        key: "flesh-and-blood.command.instant-auto-yield-enabled",
        values: { actorId: PLAYER_2, cardName: "Snatch" },
        defaultMessage: `${PLAYER_2} enabled auto-yield for Snatch.`,
      });
      expect(enable.accepted && enable.moveLogs[0]?.public).toEqual([]);
      expect(enable.accepted && enable.moveLogs[0]?.privateByPlayerId?.[PLAYER_1]).toBeUndefined();

      const disable = dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_2, {
        removeInstantYieldCardId: snatchRed.canonicalId,
      });
      expect(disable).toMatchObject({ accepted: true });
      expect(
        disable.accepted && disable.moveLogs[0]?.privateByPlayerId?.[PLAYER_2]?.[0],
      ).toMatchObject({
        key: "flesh-and-blood.command.instant-auto-yield-disabled",
        values: { actorId: PLAYER_2, cardName: "Snatch" },
        defaultMessage: `${PLAYER_2} disabled auto-yield for Snatch.`,
      });
      expect(disable.accepted && disable.moveLogs[0]?.public).toEqual([]);
      expect(
        disable.accepted && disable.moveLogs[0]?.privateByPlayerId?.[PLAYER_1],
      ).toBeUndefined();
    });

    it("names the card in every card-scoped priority automation receipt", () => {
      const runtime = createReactionStepRuntime();
      const hold = dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_2, {
        addPlayAndSkipHoldCardId: snatchRed.canonicalId,
      });
      expect(hold.accepted && hold.moveLogs[0]?.privateByPlayerId?.[PLAYER_2]?.[0]).toMatchObject({
        key: "flesh-and-blood.command.play-and-skip-hold-enabled",
        values: { actorId: PLAYER_2, cardName: "Snatch" },
        defaultMessage: `${PLAYER_2} will hold priority after playing Snatch.`,
      });

      const resume = dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_2, {
        removePlayAndSkipHoldCardId: snatchRed.canonicalId,
      });
      expect(
        resume.accepted && resume.moveLogs[0]?.privateByPlayerId?.[PLAYER_2]?.[0],
      ).toMatchObject({
        key: "flesh-and-blood.command.play-and-skip-hold-disabled",
        values: { actorId: PLAYER_2, cardName: "Snatch" },
        defaultMessage: `${PLAYER_2} will resume skipping after playing Snatch.`,
      });

      const yieldTriggers = dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_2, {
        addOpponentTriggerYieldCardId: snatchRed.canonicalId,
      });
      expect(
        yieldTriggers.accepted && yieldTriggers.moveLogs[0]?.privateByPlayerId?.[PLAYER_2]?.[0],
      ).toMatchObject({
        key: "flesh-and-blood.command.opponent-trigger-auto-yield-enabled",
        values: { actorId: PLAYER_2, cardName: "Snatch" },
        defaultMessage: `${PLAYER_2} enabled auto-yield for Snatch's triggers.`,
      });

      const stopYielding = dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_2, {
        removeOpponentTriggerYieldCardId: snatchRed.canonicalId,
      });
      expect(
        stopYielding.accepted && stopYielding.moveLogs[0]?.privateByPlayerId?.[PLAYER_2]?.[0],
      ).toMatchObject({
        key: "flesh-and-blood.command.opponent-trigger-auto-yield-disabled",
        values: { actorId: PLAYER_2, cardName: "Snatch" },
        defaultMessage: `${PLAYER_2} disabled auto-yield for Snatch's triggers.`,
      });
    });
  });
});

describe("arm-priority-hold lifecycle", () => {
  const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

  it("arms a one-shot hold: the next own window stays open until any pass commits", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, deck: 4 },
      manual,
    );
    const bravoId = game.as(bravo).id;
    const dashId = game.as(dash).id;
    game.getState().automationPreferences[bravoId] = {
      ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
      priorityMode: "play-and-skip",
    };

    const arm = game.as(bravo).exec({ move: "arm-priority-hold", payload: {} });
    expect(arm).toMatchObject({ accepted: true, actorId: bravoId });
    expect(game.getState().priorityHoldArmed[bravoId]).toBe(true);
    // Arming is idempotent: re-arming keeps the hold latched.
    expect(game.as(bravo).exec({ move: "arm-priority-hold", payload: {} })).toMatchObject({
      accepted: true,
    });
    expect(game.getState().priorityHoldArmed[bravoId]).toBe(true);

    // The armed seat's own follow-up window is held: no automatic pass rides
    // the announce receipt and priority rests on the actor ("play and hold").
    const playResult = game.as(bravo).play(snatchRed, { target: dashId });
    expect(automaticPriorityPassLogs(playResult.moveLogs)).toHaveLength(0);
    expect(game.getPriorityPlayerId()).toBe(bravoId);
    expect(game.getState().priority?.origin).toMatchObject({ kind: "own-action" });

    // Any pass commit — here the manual one — clears the arm and hands off a
    // clean, origin-free response window.
    game.as(bravo).pass();
    expect(game.getState().priorityHoldArmed[bravoId]).toBeUndefined();
    expect(game.getPriorityPlayerId()).toBe(dashId);
    expect(game.getState().priority?.origin).toBeUndefined();

    // With the arm spent, the next own window (Attack-Step entry once dash
    // resolves the layer) is skipped automatically again.
    const dashPass = game.as(dash).pass();
    expect(game.combat()?.open).toBe(true);
    const automatic = automaticPriorityPassLogs(dashPass.moveLogs);
    expect(automatic).toHaveLength(1);
    expect(automatic[0]).toMatchObject({ moveType: "pass", playerId: bravoId });
  });

  it("clears the arm when an automatic pass commits at the shared pass choke point", () => {
    // Armed auto-pass seats cannot arise through commands (a mode change
    // disarms), but a restored snapshot can pair them; the pass-commit choke
    // point must clear the arm for automatic passes exactly like manual ones.
    const runtime = createReactionStepRuntime({
      defenderMode: "auto-pass",
      defenderArmed: true,
    });
    expect(runtime.getState().priorityHoldArmed[PLAYER_2]).toBe(true);
    expect(getFabAutoPassPriorityCommand(runtime)).toMatchObject({ move: "pass" });

    const result = dispatchTestCommand(runtime, "arm-priority-hold", PLAYER_2, {});

    expect(result).toMatchObject({ accepted: true });
    const logs = result.accepted ? result.moveLogs : [];
    expect(automaticPriorityPassLogs(logs)).toHaveLength(1);
    expect(runtime.getState().priorityHoldArmed[PLAYER_2]).toBeUndefined();
    expect(runtime.getState().priority?.holderPlayerId).toBe(fabPlayerId(PLAYER_1));
  });

  it("disarms the seat when its priority mode changes", () => {
    const game = FabTestEngine.start({ hero: bravo, deck: 4 }, { hero: dash, deck: 4 }, manual);
    const bravoId = game.as(bravo).id;
    game.getState().automationPreferences[bravoId] = {
      ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
      priorityMode: "play-and-skip",
    };

    expect(game.as(bravo).exec({ move: "arm-priority-hold", payload: {} })).toMatchObject({
      accepted: true,
    });
    expect(game.getState().priorityHoldArmed[bravoId]).toBe(true);

    const result = game.as(bravo).exec({
      move: "set-automation-preferences",
      payload: { priorityMode: "always-hold" },
    });
    expect(result).toMatchObject({ accepted: true });
    expect(game.getState().automationPreferences[bravoId]?.priorityMode).toBe("always-hold");
    expect(game.getState().priorityHoldArmed[bravoId]).toBeUndefined();
  });

  it("rejects the arm from actors who do not hold priority", () => {
    const game = FabTestEngine.start({ hero: bravo, deck: 4 }, { hero: dash, deck: 4 }, manual);
    const dashId = game.as(dash).id;
    game.getState().automationPreferences[dashId] = {
      ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
      priorityMode: "play-and-skip",
    };

    const failure = game.expectFailure({ move: "arm-priority-hold", actorId: dashId, payload: {} });
    expect(failure).toMatchObject({ accepted: false, errorCode: "priority_hold_timing" });
    expect(game.getState().priorityHoldArmed[dashId]).toBeUndefined();
  });

  it("rejects the arm while an engine decision is pending", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimbleStrikeRed, nimblismBlue], deck: 4, resourcePoints: 0 },
      { hero: dash, deck: 4 },
      manual,
    );
    const bravoId = game.as(bravo).id;
    game.getState().automationPreferences[bravoId] = {
      ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
      priorityMode: "play-and-skip",
    };
    const instanceId = game.findCardInZone(bravoId, "hand", nimbleStrikeRed);
    game.as(bravo).exec({ move: "begin-play", payload: { instanceId } });
    expect(game.getState().decision).toBeTruthy();

    const failure = game.expectFailure({
      move: "arm-priority-hold",
      actorId: bravoId,
      payload: {},
    });
    expect(failure).toMatchObject({ accepted: false, errorCode: "decision_pending" });
  });
});

describe("play-and-skip integration", () => {
  const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

  it("skips the seat's own post-play window inside the announce receipt, even with an instant still in hand", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, cosmicFlareRed], deck: 4 },
      { hero: dash, deck: 4 },
      manual,
    );
    const bravoId = game.as(bravo).id;
    const dashId = game.as(dash).id;
    game.getState().automationPreferences[bravoId] = {
      ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
      priorityMode: "play-and-skip",
    };
    const beforeStateID = game.getStateID();

    const result = game.as(bravo).play(snatchRed, { target: dashId });

    expect(result).toMatchObject({ accepted: true, actorId: bravoId });
    // One receipt — the announce plus its automatic own-window pass —
    // advanced the public state version exactly once.
    expect(game.getStateID()).toBe(beforeStateID + 1);
    // Priority jumped straight to the opponent on a clean response window...
    expect(game.getPriorityPlayerId()).toBe(dashId);
    expect(game.getState().priority?.origin).toBeUndefined();
    // ...although the actor still holds a playable instant: skipping a
    // window with remaining options is exactly the mode's contract.
    expect(() => game.findCardInZone(bravoId, "hand", cosmicFlareRed)).not.toThrow();
    const automatic = automaticPriorityPassLogs(result.moveLogs);
    expect(automatic).toHaveLength(1);
    expect(automatic[0]).toMatchObject({ moveType: "pass", playerId: bravoId });
  });

  it("skips the seat's own post-activate window inside the activate receipt", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], chest: [threadbareTunic], deck: 4 },
      { hero: dash, deck: 4 },
      manual,
    );
    const bravoId = game.as(bravo).id;
    const dashId = game.as(dash).id;
    game.getState().automationPreferences[bravoId] = {
      ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
      priorityMode: "play-and-skip",
    };
    const tunic = game.findCardInZone(bravoId, "chest", threadbareTunic);
    const beforeStateID = game.getStateID();

    const result = game.as(bravo).exec({ move: "activate", payload: { instanceId: tunic } });

    expect(result).toMatchObject({ accepted: true, actorId: bravoId });
    expect(game.getStateID()).toBe(beforeStateID + 1);
    expect(game.getPriorityPlayerId()).toBe(dashId);
    expect(game.getState().priority?.origin).toBeUndefined();
    expect(automaticPriorityPassLogs(result.moveLogs)).toHaveLength(1);
  });

  it("skips the attacker's own window at Attack-Step entry inside the resolving pass receipt", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, deck: 4 },
      manual,
    );
    const bravoId = game.as(bravo).id;
    const dashId = game.as(dash).id;
    game.getState().automationPreferences[bravoId] = {
      ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
      priorityMode: "play-and-skip",
    };

    // Receipt 1: the announce; the own-skip drain closes bravo's follow-up
    // window, so priority lands on dash without any bravo click.
    game.as(bravo).play(snatchRed, { target: dashId });
    expect(game.getPriorityPlayerId()).toBe(dashId);

    // Receipt 2: dash's manual pass resolves the attack layer, opens the
    // chain link, and stamps the attacker's Attack-Step window — which the
    // drain closes inside the same receipt.
    const result = game.as(dash).pass();

    expect(game.combat()?.open).toBe(true);
    expect(game.getPriorityPlayerId()).not.toBe(bravoId);
    const automatic = automaticPriorityPassLogs(result.moveLogs);
    expect(automatic).toHaveLength(1);
    expect(automatic[0]).toMatchObject({ moveType: "pass", playerId: bravoId });
  });

  it("holds the attacker's unstamped windows around the defense declaration (bluff preserved)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, deck: 4 },
      manual,
    );
    const bravoId = game.as(bravo).id;
    const dashId = game.as(dash).id;
    game.getState().automationPreferences[bravoId] = {
      ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
      priorityMode: "play-and-skip",
    };

    game.as(bravo).play(snatchRed, { target: dashId });
    // Walk to the Defend-Step declaration: every bravo window in between
    // closed via the own-skip drain, never via a manual bravo pass.
    game.advanceUntil({ stopAt: "defend", optionals: "decline" });
    expect(game.combat()?.defenseDeclarationPending).toBe(true);

    const declaration = game.defend(dashId);

    // The attacker's post-declaration window is unstamped: play-and-skip must
    // hold it — even though bravo's hand is empty and it is strictly pass-only
    // (the client countdown, not the engine, resolves it).
    expect(game.getPriorityPlayerId()).toBe(bravoId);
    expect(game.getState().priority?.origin).toBeUndefined();
    expect(automaticPriorityPassLogs(declaration.moveLogs)).toHaveLength(0);

    // The same holds after the manual hand-off: whichever seat holds the
    // Reaction-Step entry window, the engine leaves it in human hands.
    const handoff = game.as(bravo).pass();
    expect(automaticPriorityPassLogs(handoff.moveLogs)).toHaveLength(0);
    expect(game.getPriorityPlayerId()).toBeTruthy();
    expect(game.getState().priority?.origin).toBeUndefined();
  });

  it("holds the opponent's pass-only response window instead of engine-draining it", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, deck: 4 },
      manual,
    );
    const bravoId = game.as(bravo).id;
    const dashId = game.as(dash).id;
    game.getState().automationPreferences[bravoId] = {
      ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
      priorityMode: "play-and-skip",
    };
    game.getState().automationPreferences[dashId] = {
      ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
      priorityMode: "play-and-skip",
    };

    const result = game.as(bravo).play(snatchRed, { target: dashId });

    // Exactly one automatic pass — bravo's own skip...
    const automatic = automaticPriorityPassLogs(result.moveLogs);
    expect(automatic).toHaveLength(1);
    // ...and dash's resulting pass-only RESPONSE window stays open: the
    // engine must not drain it (bluff timing), so the layer is unresolved.
    expect(game.getPriorityPlayerId()).toBe(dashId);
    expect(game.getState().priority?.origin).toBeUndefined();
    expect(game.getState().rulesStack.length).toBeGreaterThan(0);
  });
});

describe("attacker chain-close stop point", () => {
  it("never auto-passes the attacker's Resolution-step window", () => {
    const runtime = createReactionStepRuntime({ step: "resolution", holder: PLAYER_1 });
    // The attacker holds a strictly pass-only Resolution window (empty hand).
    expect(getFabAutoPassPriorityCommand(runtime)).toBeNull();
    expect(getFabAutoPassPriorityCommand(runtime, { kind: "own-skip" })).toBeNull();
  });

  it("still auto-passes the defender's Resolution-step window", () => {
    const runtime = createReactionStepRuntime({ step: "resolution", holder: PLAYER_2 });
    expect(getFabAutoPassPriorityCommand(runtime)).toMatchObject({ move: "pass" });
  });
});

describe("opponent-trigger yields", () => {
  const watcher: FabCardDefinitionInput = {
    canonicalId: "yield-watcher",
    name: "Yield Watcher",
    types: ["Equipment", "Chest"],
    abilities: [
      {
        kind: "static",
        staticKind: "triggered",
        id: "yield-watcher-a1",
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

  function createYieldMatch(
    p1Yields: boolean,
    p1Mode?: FabPriorityAutomationMode,
  ): FabMatchRuntime {
    const canonicalIdsByInstance: Record<string, string> = {};
    const owners: Record<string, string[]> = { [PLAYER_1]: [], [PLAYER_2]: [] };
    const cardDefinitions: Record<string, FabCardDefinitionInput> = {
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
      seed: "opponent-yield",
      player1Id: PLAYER_1,
      player2Id: PLAYER_2,
      cardsMaps: { canonicalIdsByInstance, owners },
      cardDefinitions,
      automationPreferences: {
        [PLAYER_1]: {
          ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
          ...(p1Mode ? { priorityMode: p1Mode } : {}),
          ...(p1Yields ? { opponentTriggerYieldCardIds: [watcher.canonicalId] } : {}),
        },
      },
    });
    // Empty hands keep every PLAYER_1 window pass-only, so any pass the
    // derivation returns over a non-pass-only source is provably the yield.
    for (const playerId of [PLAYER_1, PLAYER_2]) {
      const zones = state.containers.zonesByPlayerId[playerId]!;
      zones.deck.push(...zones.hand.splice(0, zones.hand.length));
    }
    // Seat the watcher in the opponent's chest.
    for (const zone of Object.values(state.containers.zonesByPlayerId[PLAYER_2]!)) {
      const index = zone.indexOf("watcher-1");
      if (index >= 0) zone.splice(index, 1);
    }
    state.containers.zonesByPlayerId[PLAYER_2]!.chest.push("watcher-1");
    return new FabMatchRuntime(state);
  }

  function endTurnOverWatcherTrigger(runtime: FabMatchRuntime): void {
    // PLAYER_1 ends the turn: the watcher's end-phase trigger latches and the
    // end-turn event grants PLAYER_1 the response window over it. The
    // receipt's automation drain then runs: a yield-configured seat's window
    // is consumed inside this receipt, so the post-state differs by fixture
    // and each test asserts its own holder.
    expect(dispatchTestCommand(runtime, "end-turn", PLAYER_1, {})).toMatchObject({
      accepted: true,
    });
    expect(runtime.getState().rulesStack.at(-1)?.kind).toBe("triggered");
  }

  it("drains the yield pass inside the end-turn receipt, in every mode including always-hold", () => {
    for (const mode of ["always-hold", "auto-pass", "play-and-skip"] as const) {
      const runtime = createYieldMatch(true, mode);
      endTurnOverWatcherTrigger(runtime);
      // The per-card yield applies in every mode and is evaluated before the
      // mode policy, so the drain closed PLAYER_1's response window during
      // the end-turn receipt itself: priority sits with the trigger's
      // controller, never with the yielding seat.
      expect(runtime.getState().priority?.holderPlayerId).toBe(fabPlayerId(PLAYER_2));
    }
  });

  it("does not yield without the per-card configuration", () => {
    const runtime = createYieldMatch(false, "always-hold");
    endTurnOverWatcherTrigger(runtime);
    // No yield configured: always-hold keeps the seat holding the window.
    expect(runtime.getState().priority?.holderPlayerId).toBe(fabPlayerId(PLAYER_1));
    // Under `never` the mode contributes nothing, so a pass here could only
    // come from a (missing) yield.
    expect(getFabAutoPassPriorityCommand(runtime, { kind: "never" })).toBeNull();
  });

  it("stops yielding once the yielded trigger is no longer top of the stack", () => {
    const runtime = createYieldMatch(true, "always-hold");
    endTurnOverWatcherTrigger(runtime);
    // PLAYER_1's window was already consumed by the drain; the trigger's
    // controller resolves the watcher, and no further window yields.
    expect(runtime.getState().priority?.holderPlayerId).toBe(fabPlayerId(PLAYER_2));
    expect(dispatchTestCommand(runtime, "pass", PLAYER_2, {})).toMatchObject({ accepted: true });
    const after = runtime.getState();
    expect(after.decision !== null || after.rulesStack.length === 0).toBe(true);
    expect(getFabAutoPassPriorityCommand(runtime, { kind: "never" })).toBeNull();
  });
});

describe("FAB automation fixed point", () => {
  /**
   * Cross-drain regression: the end-turn command latches the opponent's
   * `autoPassWhileTop` trigger layer while the turn player holds priority. The
   * turn player's automatic priority pass then hands priority to that
   * always-hold owner. One-shot sequential drains leave the layer latched until
   * the next command (the owner stalls on a trigger they asked to auto-decline);
   * the fixed point must consume it inside the triggering command's receipt.
   */
  it.each([
    { mode: "auto-decline" as const, expectedLifeGain: 0 },
    { mode: "auto-accept" as const, expectedLifeGain: 1 },
  ])(
    "$mode drains a latched trigger after an automatic priority pass within one command",
    ({ mode, expectedLifeGain }) => {
      const watcher: FabCardDefinitionInput = {
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
              event: {
                name: "end-phase",
                actor: { kind: "any" },
                observes: { kind: "none" },
              },
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
      const cardDefinitions: Record<string, FabCardDefinitionInput> = {
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
        seed: "automation-fixed-point",
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
      // Seat the watcher in the opponent's chest and latch its optional trigger.
      for (const zone of Object.values(state.containers.zonesByPlayerId[PLAYER_2]!)) {
        const index = zone.indexOf("watcher-1");
        if (index >= 0) zone.splice(index, 1);
      }
      state.containers.zonesByPlayerId[PLAYER_2]!.chest.push("watcher-1");
      const watcherSource = eligibleOptionalTriggerSources(state, PLAYER_2).find(
        (source) => source.source.ownerId === PLAYER_2,
      );
      expect(
        watcherSource,
        "expected the chest watcher to be an eligible trigger source",
      ).toBeDefined();
      state.optionalTriggerAutomation = {
        ...state.optionalTriggerAutomation,
        [PLAYER_2]: { [watcherSource!.source.instanceId]: mode },
      };

      const runtime = new FabMatchRuntime(state);
      const beforeStateID = runtime.getState().stateID;
      const beforeLife = runtime.getState().players[PLAYER_2]!.life;

      const result = dispatchTestCommand(runtime, "end-turn", PLAYER_1, {});

      expect(result).toMatchObject({ accepted: true });
      // One accepted command — even one whose fixed point carries passes from
      // both drains — advances the public state version exactly once.
      expect(runtime.getState().stateID).toBe(beforeStateID + 1);
      // The watcher's optional choice was answered inside the same receipt;
      // accepting gains life, declining does not, and both finish the trigger.
      expect(runtime.getState().players[PLAYER_2]!.life).toBe(beforeLife + expectedLifeGain);
      expect(runtime.getState().rulesStack).toHaveLength(0);
      expect(runtime.getState().turnNumber).toBe(2);
      expect(runtime.getState().phase).toBe("action");
      expect(runtime.getState().activePlayerId).toBe(PLAYER_2);
      // Real commit order: the auto-pass seat's priority pass first, the
      // owner's automatic trigger decline second — never reordered by drain.
      const logs = result.accepted ? result.moveLogs : [];
      const automaticKeys = logs
        .flatMap((log) => log.public.map((message) => message.key))
        .filter(
          (key) => key === PRIORITY_AUTOMATION_PASS_KEY || key === TRIGGER_AUTOMATION_PASS_KEY,
        );
      expect(automaticKeys).toEqual([PRIORITY_AUTOMATION_PASS_KEY, TRIGGER_AUTOMATION_PASS_KEY]);
      const triggerPass = logs.find((log) =>
        log.public.some((message) => message.key === TRIGGER_AUTOMATION_PASS_KEY),
      );
      expect(triggerPass).toMatchObject({ moveType: "pass", playerId: PLAYER_2 });
    },
  );

  /**
   * Mixed-mode cascade: a play-and-skip attacker interleaves own-skip passes
   * with an auto-pass defender's pass-only passes inside one announce receipt,
   * draining layer resolution and Attack-Step entry until the Defend-Step
   * declaration (a game process, never automatable) stops the fixed point.
   */
  it("runs the announce-to-combat cascade in one receipt under mixed modes", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const bravoId = game.as(bravo).id;
    const dashId = game.as(dash).id;
    game.getState().automationPreferences[bravoId] = {
      ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
      priorityMode: "play-and-skip",
    };
    game.getState().automationPreferences[dashId] = {
      ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
      priorityMode: "auto-pass",
    };
    const beforeStateID = game.getStateID();

    const result = game.as(bravo).play(snatchRed, { target: dashId });

    expect(result).toMatchObject({ accepted: true });
    // One accepted command — even one whose fixed point interleaves own-skip
    // and pass-only passes from both seats — bumps the state version once.
    expect(game.getStateID()).toBe(beforeStateID + 1);
    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.defenseDeclarationPending).toBe(true);
    const automatic = automaticPriorityPassLogs(result.moveLogs);
    expect(automatic.length).toBeGreaterThanOrEqual(3);
    expect(automatic.length).toBeLessThan(32);
    expect(
      automatic.some((log) =>
        log.public.some((message) => message.activityRef?.kind === "stack-window-event"),
      ),
    ).toBe(true);
    const passers = new Set(automatic.map((log) => log.playerId));
    expect(passers).toEqual(new Set([bravoId, dashId]));
  });
});
