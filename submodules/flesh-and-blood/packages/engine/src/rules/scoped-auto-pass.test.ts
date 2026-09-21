import { describe, expect, it } from "vite-plus/test";
import { FabMatchRuntime } from "../runtime.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { dispatchTestCommand } from "../testing/test-command.ts";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "../automation/catalog-test-cards.ts";
import { FAB_SCOPED_AUTO_PASS_LABELS, listLegalCommands } from "./legal-commands/index.ts";
import { drainDecisionAutomation } from "./decision-automation.ts";
import { getFabAutoPassPriorityCommand } from "./auto-pass.ts";
import { projectFabViewerState } from "../view.ts";
import { openFabPriority } from "../priority.ts";
import { FAB_DEFAULT_AUTOMATION_PREFERENCES, type FabChainLink } from "../state.ts";
import type { FabDecision } from "./process.ts";
import { cosmicFlareRed } from "./fixtures.ts";
import { fabObjectInstanceId, fabPlayerId } from "../game/identity.ts";
import {
  createFabMatchContext,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../snapshot/match-context.ts";

const PLAYER_1 = "player-1";
const PLAYER_2 = "player-2";

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
 * A combat Reaction-Step window held by the defender (PLAYER_2) during the
 * opponent's attack. The optional scope arm mirrors what the
 * set-automation-preferences handler stores.
 */
function createReactionStepRuntime(options?: {
  readonly defenderHand?: readonly string[];
  readonly defenderMode?: "auto-pass" | "always-hold" | "play-and-skip";
  readonly defenderScope?: "combat" | "opponent-turn" | null;
  readonly defenderHoldArmed?: boolean;
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
  state.automationPreferences[PLAYER_2] = {
    ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
    ...(options?.defenderMode ? { priorityMode: options.defenderMode } : {}),
    ...(options?.defenderScope ? { scopedAutoPass: options.defenderScope } : {}),
  };
  if (options?.defenderHoldArmed) {
    state.priorityHoldArmed = { [PLAYER_2]: true };
  }
  return new FabMatchRuntime(state);
}

describe("FAB scoped auto-pass", () => {
  it("drains pass-only combat windows for an always-hold seat while the combat scope is armed", () => {
    // The raw derivation is called with the never policy that an always-hold
    // seat maps to: the scope must override it, the bare mode must not.
    const armed = createReactionStepRuntime({
      defenderMode: "always-hold",
      defenderScope: "combat",
    });
    expect(getFabAutoPassPriorityCommand(armed, { kind: "never" })).toMatchObject({
      move: "pass",
    });

    const unarmed = createReactionStepRuntime({ defenderMode: "always-hold" });
    expect(getFabAutoPassPriorityCommand(unarmed, { kind: "never" })).toBeNull();
  });

  it("blanket-yields the defender's reactions under the combat scope", () => {
    // The same window with the same hand stays manual without the scope —
    // the scope is the seat's explicit opt-out of interacting.
    const unarmed = createReactionStepRuntime({
      defenderHand: [cosmicFlareRed.canonicalId],
      defenderMode: "always-hold",
    });
    expect(getFabAutoPassPriorityCommand(unarmed)).toBeNull();

    const armed = createReactionStepRuntime({
      defenderHand: [cosmicFlareRed.canonicalId],
      defenderMode: "always-hold",
      defenderScope: "combat",
    });
    expect(getFabAutoPassPriorityCommand(armed)).toMatchObject({ move: "pass" });
  });

  it("keeps the one-shot priority hold ranked above the scope until a pass consumes it", () => {
    const runtime = createReactionStepRuntime({
      defenderMode: "always-hold",
      defenderScope: "combat",
      defenderHoldArmed: true,
    });
    expect(getFabAutoPassPriorityCommand(runtime)).toBeNull();

    const pass = dispatchTestCommand(runtime, "pass", PLAYER_2, {});
    expect(pass).toMatchObject({ accepted: true });
    expect(runtime.getState().priorityHoldArmed[PLAYER_2]).toBeUndefined();
    expect(runtime.getState().automationPreferences[PLAYER_2]?.scopedAutoPass).toBe("combat");
  });

  it("never closes the attacker's chain-continuation window even under a scope", () => {
    const runtime = createReactionStepRuntime({
      defenderMode: "always-hold",
      defenderScope: "combat",
      step: "resolution",
      holder: PLAYER_1,
    });
    expect(getFabAutoPassPriorityCommand(runtime)).toBeNull();
  });

  it("retires the combat scope when the chain closes", () => {
    const runtime = createReactionStepRuntime({
      defenderMode: "always-hold",
      defenderScope: "combat",
    });
    for (let guard = 0; guard < 12; guard += 1) {
      const state = runtime.getState();
      if (!state.combat?.open) break;
      const holder = state.priority?.holderPlayerId;
      if (!holder) break;
      dispatchTestCommand(runtime, "pass", holder, {});
    }
    expect(runtime.getState().combat).toBeNull();
    expect(runtime.getState().automationPreferences[PLAYER_2]?.scopedAutoPass).toBeNull();
  });

  it("retires the opponent-turn scope when the armed seat's turn begins", () => {
    const fixture = FabTestEngine.create({
      player1: { heroCardId: catalogIds.bravo, hand: [], deck: 2 },
      player2: { heroCardId: catalogIds.rhinar, hand: [], deck: 2 },
      cardDefinitions: CATALOG_TEST_DEFINITIONS,
    });
    const state = fixture.getRuntime().cloneState();
    state.automationPreferences[PLAYER_2] = {
      ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
      scopedAutoPass: "opponent-turn",
    };
    const runtime = new FabMatchRuntime(state);
    expect(runtime.getState().activePlayerId).toBe(fabPlayerId(PLAYER_1));

    const endTurn = dispatchTestCommand(runtime, "end-turn", PLAYER_1, { chooseArsenal: true });
    expect(endTurn).toMatchObject({ accepted: true });
    expect(runtime.getState().activePlayerId).toBe(fabPlayerId(PLAYER_2));
    expect(runtime.getState().automationPreferences[PLAYER_2]?.scopedAutoPass).toBeNull();
  });

  it("arms and disarms without holding priority, and validates the scope context", () => {
    // At the action phase on the opponent's turn the non-active seat holds no
    // priority, yet must be able to arm before its first drained window.
    const fixture = FabTestEngine.create({
      player1: { heroCardId: catalogIds.bravo, hand: [], deck: 2 },
      player2: { heroCardId: catalogIds.rhinar, hand: [], deck: 2 },
      cardDefinitions: CATALOG_TEST_DEFINITIONS,
    });
    const runtime = fixture.getRuntime();
    expect(runtime.getState().activePlayerId).toBe(fabPlayerId(PLAYER_1));
    expect(listLegalCommands(runtime, PLAYER_2).map((command) => command.label)).toContain(
      FAB_SCOPED_AUTO_PASS_LABELS.opponentTurnArm,
    );

    const arm = dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_2, {
      armScopedAutoPass: "opponent-turn",
    });
    expect(arm).toMatchObject({ accepted: true });
    expect(runtime.getState().automationPreferences[PLAYER_2]?.scopedAutoPass).toBe(
      "opponent-turn",
    );

    // A combat scope is illegal while no chain is open, and the active seat
    // can never arm an opponent-turn scope on its own turn.
    expect(
      dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_2, {
        armScopedAutoPass: "combat",
      }),
    ).toMatchObject({ accepted: false });
    expect(
      dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_1, {
        armScopedAutoPass: "opponent-turn",
      }),
    ).toMatchObject({ accepted: false });

    const disarm = dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_2, {
      disarmScopedAutoPass: true,
    });
    expect(disarm).toMatchObject({ accepted: true });
    expect(runtime.getState().automationPreferences[PLAYER_2]?.scopedAutoPass).toBeNull();
  });

  it("arms the combat scope from the defense declaration, where no priority exists", () => {
    const fixture = FabTestEngine.create({
      player1: { heroCardId: catalogIds.bravo, hand: [catalogIds.nimbleStrike], deck: 2 },
      player2: { heroCardId: catalogIds.rhinar, hand: [], deck: 2 },
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
    // Priority is structurally closed during the declaration (the stale
    // action-phase window would fail the hasValidPriority invariant).
    state.priority = null;
    const runtime = new FabMatchRuntime(state);
    expect(runtime.getState().priority?.holderPlayerId === fabPlayerId(PLAYER_2)).toBe(false);

    const arm = dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_2, {
      armScopedAutoPass: "combat",
    });
    expect(arm).toMatchObject({ accepted: true });
    expect(runtime.getState().automationPreferences[PLAYER_2]?.scopedAutoPass).toBe("combat");
  });

  it("auto-declines the scoped seat's optional trigger and stops once disarmed", () => {
    const answered: { readonly answer: unknown }[] = [];
    // The stub records the first submission, then rejects so the drain
    // terminates on the unchanged decision (the real submit would consume it).
    let open = true;
    const answerDecision = (_actorId: string, command: { readonly answer: unknown }) => {
      if (!open) return { accepted: false, error: "test stub closed" } as const;
      answered.push({ answer: command.answer });
      open = false;
      return { accepted: true } as const;
    };
    const buildDecisionRuntime = (scope: "combat" | null): FabMatchRuntime => {
      const base = createReactionStepRuntime({ defenderMode: "always-hold", defenderScope: scope });
      const state = base.cloneState();
      const decision: FabDecision = {
        decisionId: "decision-1",
        stateVersion: state.stateID,
        actorId: PLAYER_2,
        label: "Trigger Cosmic Flare?",
        kind: "boolean",
        acceptLabel: "Yes",
        declineLabel: "No",
        continuation: { kind: "optional-effect", processId: "process-1", effectPath: [0] },
      };
      state.decision = decision;
      return new FabMatchRuntime(state);
    };

    const armed = buildDecisionRuntime("combat");
    const armedAnswers = drainDecisionAutomation(() => armed.getState(), answerDecision);
    expect(armedAnswers).toHaveLength(1);
    expect(answered[0]?.answer).toEqual({ kind: "boolean", value: false });

    answered.length = 0;
    open = true;
    const unarmed = buildDecisionRuntime(null);
    expect(drainDecisionAutomation(() => unarmed.getState(), answerDecision)).toHaveLength(0);
    expect(answered).toHaveLength(0);
  });

  it("offers the scope controls contextually and not on the seat's own action turn", () => {
    const combatRuntime = createReactionStepRuntime({ defenderMode: "always-hold" });
    expect(listLegalCommands(combatRuntime, PLAYER_2).map((command) => command.label)).toContain(
      FAB_SCOPED_AUTO_PASS_LABELS.combatArm,
    );

    const fixture = FabTestEngine.create({
      player1: { heroCardId: catalogIds.bravo, hand: [], deck: 2 },
      player2: { heroCardId: catalogIds.rhinar, hand: [], deck: 2 },
      cardDefinitions: CATALOG_TEST_DEFINITIONS,
    });
    const ownTurnRuntime = fixture.getRuntime();
    expect(ownTurnRuntime.getState().activePlayerId).toBe(fabPlayerId(PLAYER_1));
    const ownTurnLabels = listLegalCommands(ownTurnRuntime, PLAYER_1).map(
      (command) => command.label,
    );
    expect(ownTurnLabels).not.toContain(FAB_SCOPED_AUTO_PASS_LABELS.combatArm);
    expect(ownTurnLabels).not.toContain(FAB_SCOPED_AUTO_PASS_LABELS.opponentTurnArm);
    expect(ownTurnLabels).not.toContain(FAB_SCOPED_AUTO_PASS_LABELS.opponentTurnDisarm);
  });

  it("clears an armed scope on a mode change", () => {
    // With the hold armed the scope never drains (hold outranks scope), so
    // the seat still holds priority and can submit the mode change itself.
    const runtime = createReactionStepRuntime({
      defenderMode: "always-hold",
      defenderScope: "combat",
      defenderHoldArmed: true,
    });
    expect(
      dispatchTestCommand(runtime, "set-automation-preferences", PLAYER_2, {
        priorityMode: "auto-pass",
      }),
    ).toMatchObject({ accepted: true });
    expect(runtime.getState().automationPreferences[PLAYER_2]?.scopedAutoPass).toBeNull();
    expect(runtime.getState().priorityHoldArmed[PLAYER_2]).toBeUndefined();
  });

  it("round-trips the armed scope through the v31 snapshot", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "scoped-auto-pass-snapshot",
      player1Id: PLAYER_1,
      player2Id: PLAYER_2,
      cardsMaps: { canonicalIdsByInstance: {}, owners: { [PLAYER_1]: [], [PLAYER_2]: [] } },
      automationPreferences: {
        [PLAYER_2]: { priorityMode: "always-hold", scopedAutoPass: "combat" },
      },
    });
    const snapshot = serializeFabMatchSnapshot(state);
    expect(snapshot.automationPreferences).toEqual({
      [PLAYER_1]: { ...FAB_DEFAULT_AUTOMATION_PREFERENCES },
      [PLAYER_2]: { ...FAB_DEFAULT_AUTOMATION_PREFERENCES, scopedAutoPass: "combat" },
    });

    const restored = restoreFabMatchSnapshot(
      snapshot,
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    );
    expect(restored.automationPreferences[PLAYER_2]?.scopedAutoPass).toBe("combat");
    expect(serializeFabMatchSnapshot(restored)).toEqual(snapshot);
  });

  it("projects the armed scope owner-private and nulls it once expired", () => {
    const armed = createReactionStepRuntime({
      defenderMode: "always-hold",
      defenderScope: "combat",
    });
    const armedView = projectFabViewerState(armed.getState(), {
      role: "player",
      actorId: fabPlayerId(PLAYER_2),
    });
    expect(armedView.scopedAutoPass).toBe("combat");
    const opponentView = projectFabViewerState(armed.getState(), {
      role: "player",
      actorId: fabPlayerId(PLAYER_1),
    });
    expect(opponentView.scopedAutoPass).toBeNull();

    const expired = createReactionStepRuntime({
      defenderMode: "always-hold",
      defenderScope: "opponent-turn",
    });
    // PLAYER_1 is active in the fixture, so PLAYER_2's opponent-turn arm is
    // live; PLAYER_1's identical stored arm is outside its boundary.
    const expiredMutable = expired.cloneState();
    expiredMutable.automationPreferences[PLAYER_1] = {
      ...FAB_DEFAULT_AUTOMATION_PREFERENCES,
      scopedAutoPass: "opponent-turn",
    };
    const liveView = projectFabViewerState(expiredMutable, {
      role: "player",
      actorId: fabPlayerId(PLAYER_2),
    });
    expect(liveView.scopedAutoPass).toBe("opponent-turn");
    const staleView = projectFabViewerState(expiredMutable, {
      role: "player",
      actorId: fabPlayerId(PLAYER_1),
    });
    expect(staleView.scopedAutoPass).toBeNull();
  });
});
