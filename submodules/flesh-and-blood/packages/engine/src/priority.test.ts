import { describe, expect, it } from "vite-plus/test";
import { FabTestEngine } from "./testing/test-engine.ts";
import {
  openFabPriority,
  openFabPriorityForCurrentContext,
  passFabPriority,
  resetFabPriorityPasses,
} from "./priority.ts";
import type { FabChainLink, FabCombatState } from "./state.ts";
import { fabObjectInstanceId, fabPlayerId } from "./game/identity.ts";

function activeLink(): FabChainLink {
  return {
    activeAttack: { kind: "card", sourceObjectId: fabObjectInstanceId("attack-1") },
    attackingPlayerId: fabPlayerId("p1"),
    defendingPlayerId: fabPlayerId("p2"),
    attackTargetRef: {
      kind: "hero",
      playerId: fabPlayerId("p2"),
    },
    defendingInstanceIdsByTarget: { p2: [] },
    defendingOrigins: {},
    damage: { status: "pending", outcomes: [] },
    wagers: [],
  };
}

function stateWithCombat(combat: FabCombatState) {
  const state = FabTestEngine.createStateForRulesTest({
    seed: "priority-context",
    player1Id: "p1",
    player2Id: "p2",
    cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
  });
  state.combat = combat;
  return state;
}

describe("FAB priority windows", () => {
  it.each([
    { step: "close" as const, defenseDeclarationPending: false },
    { step: "defend" as const, defenseDeclarationPending: true },
  ])("keeps $step no-priority contexts closed", ({ step, defenseDeclarationPending }) => {
    const state = stateWithCombat({
      open: true,
      step,
      activeLink: step === "defend" ? activeLink() : null,
      defenseDeclarationPending,
    });

    openFabPriorityForCurrentContext(state, "p1");

    expect(state.priority).toBeNull();
    expect(state.priority).toBeNull();
  });

  it("resets completed-window passes without changing the next holder", () => {
    const state = stateWithCombat({
      open: true,
      step: "reaction",
      activeLink: activeLink(),
      defenseDeclarationPending: false,
    });
    openFabPriority(state, "p1", "combat", "reaction");
    passFabPriority(state, "p2");

    resetFabPriorityPasses(state);

    expect(state.priority).toEqual({
      kind: "combat",
      holderPlayerId: "p2",
      combatStep: "reaction",
      consecutivePasses: 0,
    });
    expect(state.priority?.holderPlayerId).toBe("p2");
  });
});
