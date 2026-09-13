/**
 * OUT177 Seeker's Mitts — Generic Arms d0.
 *
 * Printed:
 *   Instant - {r}, destroy Seeker's Mitts: Prevent the next 1 damage that would
 *   be dealt to your hero this turn. Opt 1
 *
 * Reasoning (hand-authored, riding the proven prevention path):
 * 1. Activated Instant — mixed cost 1{r} + destroy-self; no action point.
 * 2. Effect sequence: prevention fixed 1 shielded controller this-turn, then
 *    Opt 1 (look at top card, put top or bottom). Prevention path proven by
 *    FLR006 well-grounded / HVY197 sheltered-cove; Opt proven across the suite.
 * 3. dash attacks bravo (snatch 4); bravo activates Seeker's Mitts during the
 *    defend window → next 1 damage prevented → bravo takes 3.
 * 4. Boundary: without activating, bravo takes the full 4.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";

import { seekerSMitts } from "../../../../../../cards/src/cards/equipment/seeker-s-mitts.ts";

const SNATCH = 4;
const LIFE = 20;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
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
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
        },
      });
      continue;
    }
    if (decision && game.answerForcedDecision()) continue;
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("seeker-s-mitts (OUT177)", () => {
  it("core: Instant destroy-self → prevent next 1 damage + Opt 1", () => {
    // dash is the turn player / attacker; bravo defends with Seeker's Mitts.
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        arms: [seekerSMitts],
        life: LIFE,
        resourcePoints: 1,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    const lifeBefore = Bravo.life();

    // dash attacks bravo with snatch (base 4).
    Dash.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");

    // bravo activates Seeker's Mitts in the defend window: prevent 1 + Opt 1.
    Bravo.defendWith([]);
    Dash.pass();
    Bravo.activate(seekerSMitts);
    drain(game);
    // destroy-self paid; the Opt sub-decision is answered by drain.
    expect(Bravo.zone("graveyard")).toContain(seekerSMitts.canonicalId);
    expect(Bravo.zone("arms")).not.toContain(seekerSMitts.canonicalId);

    // No block — take combat damage with 1 prevention armed.
    drain(game);
    game.helpers.resolveRestOfCombat();

    // snatch 4, prevent 1 → 3 damage.
    expect(Bravo.life()).toBe(lifeBefore - (SNATCH - 1));
  });

  it("boundary: without activating, snatch deals its full 4", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        arms: [seekerSMitts],
        life: LIFE,
        resourcePoints: 1,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    const lifeBefore = Bravo.life();

    Dash.attackWith(snatchRed);
    // No prevention armed.
    drain(game);
    game.helpers.resolveRestOfCombat();
    expect(Bravo.life()).toBe(lifeBefore - SNATCH);
    // Seeker's Mitts stays seated (never activated).
    expect(Bravo.zone("arms")).toContain(seekerSMitts.canonicalId);
  });
});
