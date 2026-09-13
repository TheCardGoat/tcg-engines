import { describe, expect, it } from "vite-plus/test";

import { FabMatchRuntime } from "../runtime.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { CATALOG_TEST_DEFINITIONS, catalogIds } from "../automation/catalog-test-cards.ts";
import { openFabPriority } from "../priority.ts";
import { projectFabViewerState } from "../view.ts";
import type { FabChainLink, FabMatchState } from "../state.ts";
import { fabObjectInstanceId, fabPlayerId } from "../game/identity.ts";
import {
  fabPriorityWindowContext,
  fabPriorityWindowManualOnly,
  fabPriorityWindowVerdict,
} from "./automation-verdict.ts";

const PLAYER_1 = "player-1";
const PLAYER_2 = "player-2";

function combatLink(state: FabMatchState): FabChainLink {
  void state;
  return {
    activeAttack: { kind: "card", sourceObjectId: fabObjectInstanceId("attack-1") },
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

function runtimeWith(
  mutate: (state: FabMatchState) => void,
  options?: { defenderHand?: readonly string[] },
): FabMatchRuntime {
  const fixture = FabTestEngine.create(
    {
      player1: { heroCardId: catalogIds.bravo, hand: [], deck: 2 },
      player2: { heroCardId: catalogIds.rhinar, hand: options?.defenderHand ?? [], deck: 2 },
      cardDefinitions: CATALOG_TEST_DEFINITIONS,
    },
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
  const state = fixture.getRuntime().cloneState();
  mutate(state);
  return new FabMatchRuntime(state);
}

describe("fabPriorityWindowVerdict", () => {
  it("returns null when the seat holds no window and no manual-only condition applies", () => {
    const runtime = runtimeWith((state) => {
      state.combat = null;
      openFabPriority(state, fabPlayerId(PLAYER_1), "action", null);
    });
    expect(fabPriorityWindowVerdict(runtime, PLAYER_2)).toBeNull();
  });

  it("marks a pass-only response window pass-only", () => {
    const runtime = runtimeWith((state) => {
      state.combat = {
        open: true,
        step: "reaction",
        defenseDeclarationPending: false,
        activeLink: combatLink(state),
      };
      openFabPriority(state, fabPlayerId(PLAYER_2), "combat", "reaction");
    });
    expect(fabPriorityWindowVerdict(runtime, PLAYER_2)).toEqual({
      passOnly: true,
      manualOnly: false,
    });
  });

  it("marks a window with real actions neither pass-only nor manual-only", () => {
    const runtime = runtimeWith(
      (state) => {
        state.combat = {
          open: true,
          step: "reaction",
          defenseDeclarationPending: false,
          activeLink: combatLink(state),
        };
        openFabPriority(state, fabPlayerId(PLAYER_2), "combat", "reaction");
      },
      { defenderHand: [catalogIds.sinkBelow] },
    );
    expect(fabPriorityWindowVerdict(runtime, PLAYER_2)).toEqual({
      passOnly: false,
      manualOnly: false,
    });
  });

  it("never automates the pending Defend-Step declaration, even with priority closed", () => {
    const runtime = runtimeWith((state) => {
      state.combat = {
        open: true,
        step: "defend",
        defenseDeclarationPending: true,
        activeLink: combatLink(state),
      };
      state.priority = null;
    });
    expect(fabPriorityWindowVerdict(runtime, PLAYER_2)).toEqual({
      passOnly: false,
      manualOnly: true,
    });
    expect(fabPriorityWindowManualOnly(runtime.getState(), PLAYER_2)).toBe(true);
  });

  it("never automates the terminal Action-Phase window", () => {
    const runtime = runtimeWith((state) => {
      state.combat = null;
      openFabPriority(state, fabPlayerId(PLAYER_1), "action", null);
    });
    expect(fabPriorityWindowVerdict(runtime, PLAYER_1)).toEqual({
      passOnly: false,
      manualOnly: true,
    });
    expect(fabPriorityWindowContext(runtime.getState(), PLAYER_1)).toEqual({
      kind: "terminal-action-phase",
    });
  });

  it("keeps start/end-phase priority windows automatable (stop is Action-Phase only)", () => {
    for (const phase of ["start", "end"] as const) {
      const runtime = runtimeWith((state) => {
        state.combat = null;
        state.turnNumber = 2;
        state.phase = phase;
        openFabPriority(state, fabPlayerId(PLAYER_1), "layer", null);
      });
      // The documented stop-point is the terminal ACTION-phase window; a
      // start/end-phase window is an ordinary automatable window.
      expect(fabPriorityWindowVerdict(runtime, PLAYER_1)?.manualOnly).toBe(false);
    }
  });

  it("marks the attacker's Resolution-step window manual-only (chain close)", () => {
    const runtime = runtimeWith((state) => {
      state.combat = {
        open: true,
        step: "resolution",
        defenseDeclarationPending: false,
        activeLink: combatLink(state),
      };
      openFabPriority(state, fabPlayerId(PLAYER_1), "combat", "resolution");
    });
    expect(fabPriorityWindowVerdict(runtime, PLAYER_1)).toEqual({
      passOnly: false,
      manualOnly: true,
    });
    expect(fabPriorityWindowContext(runtime.getState(), PLAYER_1)).toEqual({
      kind: "combat-chain-continuation",
      role: "attacker",
    });
    // The same window is not manual-only for the defender.
    const defenderRuntime = runtimeWith((state) => {
      state.combat = {
        open: true,
        step: "resolution",
        defenseDeclarationPending: false,
        activeLink: combatLink(state),
      };
      openFabPriority(state, fabPlayerId(PLAYER_2), "combat", "resolution");
    });
    expect(fabPriorityWindowVerdict(defenderRuntime, PLAYER_2)).toEqual({
      passOnly: true,
      manualOnly: false,
    });
    expect(fabPriorityWindowContext(defenderRuntime.getState(), PLAYER_2)).toEqual({
      kind: "combat-resolution-response",
      role: "defender",
    });
  });

  it("returns null while an engine decision is pending", () => {
    const runtime = runtimeWith((state) => {
      state.combat = null;
      openFabPriority(state, fabPlayerId(PLAYER_1), "action", null);
      state.decision = {
        decisionId: "decision-1",
        stateVersion: state.stateID,
        actorId: fabPlayerId(PLAYER_1),
        kind: "boolean",
        label: "Pending decision",
        continuation: { kind: "trigger-order", processId: "process-1", controllerId: PLAYER_1 },
      } as never;
    });
    expect(fabPriorityWindowVerdict(runtime, PLAYER_1)).toBeNull();
  });
});

describe("viewer projection of manual-only stop-points", () => {
  it("projects the doctrine to the player view only", () => {
    const runtime = runtimeWith((state) => {
      state.combat = {
        open: true,
        step: "resolution",
        defenseDeclarationPending: false,
        activeLink: combatLink(state),
      };
      openFabPriority(state, fabPlayerId(PLAYER_1), "combat", "resolution");
    });
    const state = runtime.getState();
    expect(
      projectFabViewerState(state, { role: "player", actorId: PLAYER_1 }).priorityManualOnly,
    ).toBe(true);
    expect(
      projectFabViewerState(state, { role: "player", actorId: PLAYER_1 }).priorityWindow,
    ).toEqual({ kind: "combat-chain-continuation", role: "attacker" });
    expect(
      projectFabViewerState(state, { role: "player", actorId: PLAYER_2 }).priorityManualOnly,
    ).toBe(false);
    expect(projectFabViewerState(state, { role: "spectator" }).priorityManualOnly).toBeNull();
    expect(projectFabViewerState(state, { role: "spectator" }).priorityWindow).toBeNull();
    expect(projectFabViewerState(state, { role: "replay" }).priorityManualOnly).toBeNull();
  });
});
