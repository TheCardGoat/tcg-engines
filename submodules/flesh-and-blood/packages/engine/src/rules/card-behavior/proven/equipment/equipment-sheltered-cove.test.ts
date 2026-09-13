/**
 * HVY197 Sheltered Cove — Generic Head (no printed defense).
 *
 * Printed:
 *   Instant - {r}{r}{r}, destroy this: The next time you would be dealt damage
 *   this turn, prevent 2 of that damage.
 *
 * Reasoning (hand-authored):
 * 1. Instant 3{r} destroy-self arms a 2-damage prevention for the controller
 *    (this-turn, next damage).
 * 2. Subsequent combat damage is reduced by 2 once.
 * 3. Insufficient RP illegal.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { shelteredCove } from "../../../../../../cards/src/cards/equipment/sheltered-cove.ts";

const SNATCH = 4;
const LIFE = 20;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("sheltered-cove (HVY197)", () => {
  it("core mechanic: Instant 3{r} destroy → prevent 2 on next damage", () => {
    // Arm prevention during the defend priority window (same turn as damage)
    // so this-turn duration still applies.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [shelteredCove],
        resourcePoints: 3,
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith([]);
    Attacker.pass();
    expect(game.getState().priority?.holderPlayerId).toBe(Defender.id);

    Defender.activate(shelteredCove);
    drain(game);
    expect(Defender.zone("graveyard")).toContain(shelteredCove.canonicalId);
    expect(Defender.resourcePoints()).toBe(0);

    // No block — take combat damage with prevention armed.
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Snatch 4, prevent 2 → 2 damage.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
  });

  it("boundaries: insufficient RP illegal; model prevention shape", () => {
    const poor = FabTestEngine.start(
      {
        hero: bravo,
        head: [shelteredCove],
        resourcePoints: 2,
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const rejected = poor.as(bravo).expectFailure({
      move: "activate",
      payload: { instanceId: poor.as(bravo).card(shelteredCove) },
    });
    expect(rejected.accepted).toBe(false);

    const a1 = shelteredCove.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated" || !a1.effect) return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.effect).toMatchObject({
      type: "prevention",
      preventionKind: "fixed",
      amount: 2,
      shielded: { selector: "controller" },
      duration: "this-turn",
    });
    expect(shelteredCove.base.numeric.defense).toBeUndefined();
  });
});
