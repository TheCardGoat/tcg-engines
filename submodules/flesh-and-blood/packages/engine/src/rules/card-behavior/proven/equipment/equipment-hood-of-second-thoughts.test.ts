/**
 * ROS212 Hood of Second Thoughts — Generic Head d0.
 *
 * Printed:
 *   Instant - Destroy this: Prevent the next 1 damage that would be dealt to
 *   you this turn. Activate this only if you've been dealt damage this turn.
 *
 * Reasoning (hand-authored):
 * 1. Gate is been-dealt-damage-this-turn (victim fact), not dealt-damage
 *    (dealer). Combat dealt-damage event must stamp history.turn.beenDealtDamage.
 * 2. Instant destroy-self arms fixed prevent 1, shielded controller, this-turn.
 * 3. Two-attack same turn: first unblocked establishes gate; second arm at
 *    defend priority then unblocked → snatch 4 − 1.
 * 4. No damage this turn → activate illegal; d0 seat (no defend defense).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { hoodOfSecondThoughts } from "../../../../../../cards/src/cards/equipment/hood-of-second-thoughts.ts";

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

describe("hood-of-second-thoughts (ROS212)", () => {
  it("core mechanic: after been dealt damage, Instant destroy → prevent 1 on next damage", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [hoodOfSecondThoughts],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    // First hit: unblocked — establishes been-dealt-damage-this-turn.
    Attacker.attackWith(snatchRed);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    expect(game.getState().players[Defender.id]!.history.turn.beenDealtDamage).toBe(true);
    expect(Defender.life()).toBe(LIFE - SNATCH);

    // Second attack: arm prevention at defend priority, then take reduced hit.
    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith([]);
    Attacker.pass();
    expect(game.getState().priority?.holderPlayerId).toBe(Defender.id);

    Defender.activate(hoodOfSecondThoughts);
    // Resolve only the Instant layer — do not drain full combat (that would
    // consume the one-shot prevention before we can assert it armed).
    for (let i = 0; i < 16; i += 1) {
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
      if (game.getState().rulesStack.length === 0) break;
      if (game.declareNoDefenseIfPending()) continue;
      const prio = game.getPriorityPlayerId();
      if (prio) {
        game.exec({ move: "pass", actorId: prio, payload: {} });
        continue;
      }
      break;
    }
    expect(Defender.zone("graveyard")).toContain(hoodOfSecondThoughts.canonicalId);
    expect(Defender.zone("head")).not.toContain(hoodOfSecondThoughts.canonicalId);
    expect(game.getState().replacementEffects.length).toBeGreaterThanOrEqual(1);

    // No block — combat damage with prevent 1 armed.
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    // First snatch 4 + second snatch (4 − 1) = 7.
    expect(Defender.life()).toBe(LIFE - SNATCH - (SNATCH - 1));
  });

  it("boundaries: no damage this turn → illegal; model Instant destroy prevention gate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [hoodOfSecondThoughts],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    expect(game.getState().players[Bravo.id]!.history.turn.beenDealtDamage).toBe(false);
    expect(() => Bravo.activate(hoodOfSecondThoughts)).toThrow();
    expect(Bravo.zone("head")).toContain(hoodOfSecondThoughts.canonicalId);

    const a1 = hoodOfSecondThoughts.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.condition).toMatchObject({
      type: "performed-this-turn",
      event: "be-dealt-damage",
      player: "controller",
    });
    expect(a1.effect).toMatchObject({
      type: "prevention",
      preventionKind: "fixed",
      amount: 1,
      shielded: { selector: "controller" },
      duration: "this-turn",
    });
    expect(hoodOfSecondThoughts.base.numeric.defense).toBe(0);
  });
});
