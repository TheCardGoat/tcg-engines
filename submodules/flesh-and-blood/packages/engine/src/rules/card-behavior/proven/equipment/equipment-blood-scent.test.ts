/**
 * TCC080 Blood Scent — Ninja Chest d1 Battleworn.
 *
 * Printed:
 *   Instant - Destroy this: Gain {r}. Activate this only if you've attacked
 *   with a Crouching Tiger this turn.
 *   Battleworn
 *
 * Reasoning (case-by-case; exposed unwired has-status):
 * 1. Activation condition attacked-with-a-crouching-tiger-this-turn was fall-
 *    through false. ENGINE: stamp history.turn.attackedWithCrouchingTiger on
 *    attack open when attacker is Crouching Tiger; surface via rules facts +
 *    has-status branch.
 * 2. Core: attack with CT → Instant destroy-self gains 1{r}.
 * 3. Boundaries: no CT attack illegal; non-CT attack (Snatch) does not unlock;
 *    Battleworn d1 defend leaves seat at d0 (not Blade Break destroy).
 * 4. Model Instant destroy-self + has-status gate OK.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, crouchingTiger } from "../../../fixtures.ts";
import { bloodScent } from "../../../../../../cards/src/cards/equipment/blood-scent.ts";

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
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("blood-scent (TCC080)", () => {
  it("core mechanic: attack with Crouching Tiger → Instant destroy +1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [bloodScent],
        hand: [crouchingTiger],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    // Before CT: gate closed.
    expect(game.getState().players[Bravo.id]!.history.turn.attackedWithCrouchingTiger).toBe(false);
    expect(() => Bravo.activate(bloodScent)).toThrow();

    Bravo.attackWith(crouchingTiger);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    expect(game.getState().players[Bravo.id]!.history.turn.attackedWithCrouchingTiger).toBe(true);

    const rpBefore = Bravo.resourcePoints();
    Bravo.activate(bloodScent);
    drain(game);

    expect(Bravo.zone("chest")).not.toContain(bloodScent.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(bloodScent.canonicalId);
    expect(Bravo.resourcePoints()).toBe(rpBefore + 1);
  });

  it("boundaries: Snatch alone does not unlock; no attack illegal; BW d1; model", () => {
    // Non-CT attack does not stamp CT gate.
    const snatchOnly = FabTestEngine.start(
      {
        hero: bravo,
        chest: [bloodScent],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    snatchOnly.as(bravo).attackWith(snatchRed);
    drain(snatchOnly);
    snatchOnly.helpers.resolveRestOfCombat();
    drain(snatchOnly);
    expect(
      snatchOnly.getState().players[snatchOnly.as(bravo).id]!.history.turn
        .attackedWithCrouchingTiger,
    ).toBe(false);
    expect(() => snatchOnly.as(bravo).activate(bloodScent)).toThrow();
    expect(snatchOnly.as(bravo).zone("chest")).toContain(bloodScent.canonicalId);

    // Never attacked: illegal.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        chest: [bloodScent],
        hand: [],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => bare.as(bravo).activate(bloodScent)).toThrow();

    // Battleworn d1: defend contributes 1 then −1 counter; seat remains at d0.
    const bw = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        chest: [bloodScent],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    bw.as(dash).attackWith(snatchRed);
    bw.as(bravo).defendWith(bloodScent);
    drain(bw);
    bw.helpers.resolveRestOfCombat();
    drain(bw);
    expect(bw.as(bravo).zone("chest")).toContain(bloodScent.canonicalId);
    // snatch 4 − d1 = 3
    expect(bw.as(bravo).life()).toBe(LIFE - 3);

    const a1 = bloodScent.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("instant");
      expect(a1.cost).toMatchObject({ type: "destroy-self" });
      expect(a1.condition).toMatchObject({
        type: "performed-this-turn",
        event: "attack-with-crouching-tiger",
        player: "controller",
      });
      expect(a1.effect).toMatchObject({ type: "gain-resources", amount: 1 });
    }
    expect(bloodScent.base.numeric.defense).toBe(1);
    expect(bloodScent.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "battleworn" })]),
    );
  });
});
