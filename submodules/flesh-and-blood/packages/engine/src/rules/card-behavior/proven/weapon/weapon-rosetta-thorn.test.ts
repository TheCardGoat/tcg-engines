/**
 * ELE222 Rosetta Thorn — Runeblade Sword 2H — power 2, arcane 2.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}: Attack
 *   a2: Whenever you attack with Rosetta Thorn, if you've played an attack
 *       action card and a 'non-attack' action card this turn, deal 2 arcane
 *       damage to target hero.
 *
 * Reasoning (hand-authored):
 * 1. a1 (1{r} 2-power OPT attack) proven @ weapon-mid-complexity; this file
 *    proves the a2 dual-action → arcane clause.
 * 2. a2: triggered on attack (subject:self — scoped to this weapon, card fix)
 *    + condition has-status played-attack-action-card-and-non-attack (wired
 *    in has-status.ts, reads playerAttackActionPlayed + playerNonAttackAction-
 *    Played facts). Effect: deal-damage arcane 2 target opponent.
 * 3. Happy: Snatch (attack action) then Nimblism (non-attack) → Rosetta
 *    attack → 2 phys + 2 arcane + Snatch's 4 phys = 8 total.  (Nimblism
 *    last so its +1-next-attack-action buff misses Snatch.)
 *
 * Status: ✅ a2 dual-action → 2 arcane proven; no-dual-action boundary.
 * Card fix: attack trigger subject:self.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";

import { rosettaThorn } from "../../../../../../cards/src/cards/weapons/rosetta-thorn.ts";

const LIFE = 40;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "ordering", orderedIds: decision.entries.map((e) => e.id) },
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

describe("rosetta-thorn (ELE222)", () => {
  it("a2: dual-action → 2 arcane (2 phys + 2 arcane)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [rosettaThorn],
        hand: [nimblismBlue, snatchRed],
        resourcePoints: 2,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    // Attack action: Snatch (cost-0, 4{p}) — first so Nimblism's
    // +1 buff misses it.
    Bravo.play(snatchRed);
    drain(game);

    // Non-attack: Nimblism (cost-0, go again)
    Bravo.play(nimblismBlue);
    drain(game);

    // Rosetta: a2 fires — 2 arcane
    Bravo.activate(rosettaThorn);
    game.helpers.resolveRestOfCombat();

    // Snatch 4 phys + Rosetta 2 phys + 2 arcane = 8
    expect(Opp.life()).toBe(lifeBefore - 8);
  });

  it("a2 boundary: no dual-action → rosetta deals only physical (2)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [rosettaThorn],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    Bravo.activate(rosettaThorn);
    game.helpers.resolveRestOfCombat();

    expect(Opp.life()).toBe(lifeBefore - 2);
  });
});
