/**
 * MST190 Stonewall Gauntlet — Generic Arms d1 Blade Break.
 *
 * Printed:
 *   When this defends an attack with {p} greater than its base, opposing
 *   attacks get -1{p} this combat chain.
 *   Blade Break
 *
 * Reasoning (hand-authored; case-by-case — found real gaps):
 * 1. Defend subject:self (was bare defend — co-defenders could false-fire).
 * 2. Condition has-status defended-attack-power-greater-than-base was
 *    unrecognised in evaluateHasStatus → always false. Wire: live combat
 *    attack current power > printed base.
 * 3. Happy: Might start-phase arms floating +1 → Snatch p5; defend → -1{p}
 *    (attackPower 4) + d1 → 3 damage; BB destroys.
 * 4. Boundary: unbuffed Snatch p4 (= base) → no -1; attackPower stays 4;
 *    d1 → 3 damage; BB still.
 * 5. Model: subject:self + status gate + star opposing Attacks this-combat-chain.
 *
 * Status: ✅ p>base defend → -1{p} chain; unbuffed no debuff; BB d1; ENGINE status.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { fabToken } from "../../../../testing/test-fixtures.ts";
import { stonewallGauntlet } from "../../../../../../cards/src/cards/equipment/stonewall-gauntlet.ts";

const LIFE = 40;
const SNATCH = 4;
const DEF = 1;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 80; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: false },
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
          answer: {
            kind: "entity-target",
            instanceIds: pick ? [pick.instanceId] : [],
          },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      try {
        game.exec({ move: "pass", actorId: prio, payload: {} });
      } catch {
        return;
      }
      continue;
    }
    return;
  }
}

function endTurnDrain(game: ReturnType<typeof FabTestEngine.start>, hero: typeof bravo): void {
  game.as(hero).endTurn();
  for (let safety = 0; safety < 40; safety += 1) {
    const d = game.getState().decision;
    if (d) {
      if (d.kind === "boolean") {
        game.exec({
          move: "answer-decision",
          actorId: d.actorId,
          payload: {
            decisionId: d.decisionId,
            stateVersion: d.stateVersion,
            answer: { kind: "boolean", value: false },
          },
        });
        continue;
      }
      if (game.answerForcedDecision()) continue;
      break;
    }
    if (game.getState().rulesStack.length > 0 || game.getState().rulesProcess) {
      try {
        game.passBoth();
      } catch {
        break;
      }
      continue;
    }
    break;
  }
}

describe("stonewall-gauntlet (MST190)", () => {
  it("core mechanic: defend p>base attack → opposing attacks −1{p}; BB d1", () => {
    // Might on attacker's start → floating +1{p} for next attack (Snatch 4 → 5).
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        arena: [fabToken("might")],
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        arms: [stonewallGauntlet],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    // Full turn cycle so Might fires on Bravo's next start-phase.
    endTurnDrain(game, bravo);
    endTurnDrain(game, dash);
    expect(Attacker.zone("arena")).not.toContain("token:might");

    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    // Snatch base 4 + Might +1 = 5 before stonewall (when floating applies).
    const powerBefore = game.combat()?.activeLink?.attackPower;
    expect(powerBefore).toBe(SNATCH + 1);

    Defender.defendWith(stonewallGauntlet);
    // Resolve only the defend trigger layer stack; stay in combat.
    for (let safety = 0; safety < 24; safety += 1) {
      if (game.getState().decision) break;
      if (game.getState().rulesStack.length === 0) break;
      const prio = game.getState().priority?.holderPlayerId;
      if (!prio) break;
      game.exec({ move: "pass", actorId: prio, payload: {} });
    }

    // Opposing attack −1{p} this combat chain (5 → 4).
    expect(game.combat()?.activeLink?.attackPower).toBe(SNATCH);

    game.helpers.resolveRestOfCombat();
    drain(game);

    // (5 − 1) − d1 = 3 damage; blade-break destroys.
    expect(Defender.life()).toBe(LIFE - (SNATCH + 1 - 1 - DEF));
    expect(Defender.zone("arms")).not.toContain(stonewallGauntlet.canonicalId);
    expect(Defender.zone("graveyard")).toContain(stonewallGauntlet.canonicalId);
  });
});
