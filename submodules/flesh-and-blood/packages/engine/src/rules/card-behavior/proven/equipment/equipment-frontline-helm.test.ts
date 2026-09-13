/**
 * DTD222 Frontline Helm — Generic Head d2 Blade Break.
 *
 * Printed:
 *   At the beginning of your end phase, put a -1{d} counter on this.
 *   Blade Break
 *
 * Model (after fix):
 *   static triggered end-phase actor:controller → add-counter numeric -1
 *   defense on self; bladeBreak
 *
 * Reasoning:
 * 1. "Your end phase" needs actor:controller — bare end-phase matches every
 *    seat's end phase (including the opponent's).
 * 2. After the controller's end-turn, effective defense is 2 − 1 = 1.
 * 3. Opponent ending their turn must not add a counter.
 * 4. Blade Break still destroys when the helm defends (d1 after counter, or
 *    d2 if never decayed) — proven via defend after one end-phase tick.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { frontlineHelm } from "../../../../../../cards/src/cards/equipment/frontline-helm.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

function headDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): number | undefined {
  const state = game.getState();
  const player = state.players[playerId];
  if (!player) return undefined;
  const instanceId = state.containers.zonesByPlayerId[playerId]!.head.find(
    (id) => state.objects[id]?.canonicalId === frontlineHelm.canonicalId,
  );
  if (!instanceId) return undefined;
  const view = buildFabRulesView(state);
  return view.object({ instanceId, incarnation: state.objects[instanceId]!.incarnation })?.current
    .numeric.defense;
}

/** Drain decisions/stack after end-turn until quiet. */
function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 40; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: true },
        },
      });
      continue;
    }
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "ordering",
            orderedIds: decision.entries.map((e) => e.id),
          },
        },
      });
      continue;
    }
    if (decision) break;
    if (game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("frontline-helm (DTD222)", () => {
  it("core mechanic: your end phase → -1{d} counter (defense 2 → 1)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [frontlineHelm],
        hand: [],
        deck: 6,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(headDefense(game, Bravo.id)).toBe(2);

    // Controller ends turn → end-phase trigger.
    Bravo.endTurn();
    drain(game);

    expect(headDefense(game, Bravo.id)).toBe(1);
    expect(Bravo.zone("head")).toContain(frontlineHelm.canonicalId);
  });

  it("boundaries: opponent end phase does not put a counter", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [],
        deck: 6,
        actionPoints: 1,
        life: 20,
      },
      {
        hero: bravo,
        head: [frontlineHelm],
        deck: 6,
        life: 20,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    expect(headDefense(game, Bravo.id)).toBe(2);

    // Opponent (Dash, active) ends turn — helm controller's end phase has not begun.
    Dash.endTurn();
    drain(game);

    expect(headDefense(game, Bravo.id)).toBe(2);
  });

  it("boundaries: after decay, defend bladeBreaks at reduced defense", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [frontlineHelm],
        hand: [],
        deck: 6,
        actionPoints: 1,
        life: 20,
      },
      {
        hero: dash,
        hand: [snatchRed],
        deck: 6,
        actionPoints: 1,
        life: 20,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.endTurn();
    drain(game);
    expect(headDefense(game, Bravo.id)).toBe(1);

    // Dash's turn — attack into the decayed helm.
    // May need to ensure AP / active player.
    if (game.getState().activePlayerId !== Dash.id) {
      // If still Bravo somehow, advance.
      for (let i = 0; i < 10; i += 1) {
        if (game.getState().activePlayerId === Dash.id) break;
        const prio = game.getState().priority?.holderPlayerId;
        if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
        else break;
      }
    }
    expect(Dash.actionPoints()).toBe(1);

    Dash.attackWith(snatchRed);
    Bravo.defendWith(frontlineHelm);
    game.helpers.resolveRestOfCombat();

    // Blade Break: helm to GY. Blocked for d1 → snatch 4 − 1 = 3 damage.
    expect(Bravo.zone("graveyard")).toContain(frontlineHelm.canonicalId);
    expect(Bravo.zone("head")).not.toContain(frontlineHelm.canonicalId);
    expect(Bravo.life()).toBe(20 - (4 - 1));
  });
});
