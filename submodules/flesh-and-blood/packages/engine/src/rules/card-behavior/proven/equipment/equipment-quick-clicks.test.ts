/**
 * SEA186 Quick Clicks — Generic Legs d0.
 *
 * Printed:
 *   Action - Destroy this: Your next attack this turn gets go again. Activate
 *   this only if you've played a Nimblism this turn. Go again
 *
 * Reasoning (hand-authored):
 * 1. Same activation gate + NEW engine fact as SEA183 swiftstrike-bracers
 *    (sibling: has-status `played-a-nimblism-this-turn` reads played card
 *    NAMES — the catalog Nimblism family has no type-line).
 * 2. Effect: grant-property goAgain to the next attack (appliesTo.next
 *    subtypes Attack) — AHA002 zenith-blade a2 family; the rules-visible
 *    outcome is the action-point refund after the granted attack resolves.
 * 3. Attack vehicle: snatchRed (attack action card, cost 0, NO native go
 *    again). With Quick Clicks armed the attack refunds AP (AP stays 1);
 *    without it the attack spends AP (AP 0). Nimblism Blue's +1{p} buff also
 *    hits snatch (cost ≤ 1), so damage is asserted but the go-again proof is
 *    the AP check.
 *
 * Status: ✅ destroy after Nimblism → next attack go again + AP refund;
 * no-Nimblism boundary illegal.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";

import { quickClicks } from "../../../../../../cards/src/cards/equipment/quick-clicks.ts";

const LIFE = 40;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
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
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("quick-clicks (SEA186)", () => {
  it("core: play Nimblism → destroy-self → next attack gets go again (AP refund)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [quickClicks],
        hand: [nimblismBlue, snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    // Play Nimblism (cost 0, go again) — arms the gate.
    Bravo.play(nimblismBlue);
    drain(game);

    // Activate Quick Clicks: destroy-self, go again refunds AP.
    Bravo.activate(quickClicks);
    drain(game);
    expect(Bravo.zone("legs")).not.toContain(quickClicks.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(quickClicks.canonicalId);
    expect(Bravo.actionPoints()).toBe(1);

    // snatch has no native go again; the granted go again refunds the AP it
    // spent on the attack (and Nimblism Blue adds +1{p}: 4+1 damage).
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 5);
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("boundary: activate illegal without playing a Nimblism this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [quickClicks],
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.activate(quickClicks)).toThrow();
    expect(Bravo.zone("legs")).toContain(quickClicks.canonicalId);
  });

  it("negative: without Quick Clicks, a snatch attack spends AP and does not refund it", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [quickClicks],
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    // No go again: the attack consumed the action point.
    expect(Bravo.actionPoints()).toBe(0);
    // Quick Clicks never activated — still seated.
    expect(Bravo.zone("legs")).toContain(quickClicks.canonicalId);
  });
});
