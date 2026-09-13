/**
 * ROS114 Face Purgatory — Runeblade Head d2 Blade Break.
 *
 * Printed:
 *   When this defends together with an attack action card and a non-attack
 *   action card, the attacking hero discards a card and you draw a card.
 *   Blade Break
 *
 * Reasoning (hand-authored):
 * 1. subject:self — co-defenders must not fire.
 * 2. Dual partner requirement (AAC + Non-attack Action) cannot be one
 *    togetherWith filter — residual "Attack action card and a non-attack
 *    action" never matched. Engine togetherWithEach: each filter ≥1 partner.
 * 3. Attacking hero discards from hand (chooser: attacking-hero); controller
 *    draws 1.
 * 4. Alone / only AAC / only non-attack → no discard/draw.
 * 5. BB d2 after defend.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue, crackedBaubleYellow } from "../../../fixtures.ts";
import { facePurgatory } from "../../../../../../cards/src/cards/equipment/face-purgatory.ts";

const LIFE = 20;
const SNATCH = 4;
const HELM_D = 2;
// snatch as defending AAC contributes its defense (2).
const SNATCH_DEF = 2;
// nimblism blue defense
const NIMBLISM_DEF = 2;

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

describe("face-purgatory (ROS114)", () => {
  it("core mechanic: defend with AAC + non-attack → attacker discards, you draw; BB d2", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, crackedBaubleYellow],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [facePurgatory],
        // AAC + non-attack action as co-defenders from hand.
        hand: [snatchRed, nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);
    const attackerHandBefore = Attacker.zone("hand").length;
    const defenderHandBefore = Defender.zone("hand").length;

    Attacker.attackWith(snatchRed);
    // Defend with helm + AAC + non-attack (array form for multi-defend).
    const attackerHandPostAttack = Attacker.zone("hand").length;
    expect(attackerHandPostAttack).toBe(1); // bauble remains
    Defender.defendWith([facePurgatory, snatchRed, nimblismBlue]);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    // Attacker discarded the bauble; defender drew 1.
    expect(Attacker.zone("graveyard")).toContain(crackedBaubleYellow.canonicalId);
    expect(Attacker.zone("hand").length).toBe(0);
    // Hand after: started 2, defended both → 0, draw 1 → 1.
    expect(Defender.zone("hand").length).toBe(defenderHandBefore - 2 + 1);
    expect(Defender.zone("head")).not.toContain(facePurgatory.canonicalId);
    expect(Defender.zone("graveyard")).toContain(facePurgatory.canonicalId);
    expect(Defender.life()).toBeGreaterThanOrEqual(LIFE - SNATCH);
    void attackerHandBefore;
  });

  it("boundaries: alone / only AAC / only non-attack → no discard or draw; BB still", () => {
    // Alone: no partners.
    const alone = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, crackedBaubleYellow],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [facePurgatory],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    alone.as(bravo).attackWith(snatchRed);
    const aloneDefHand = alone.as(dash).zone("hand").length;
    alone.as(dash).defendWith(facePurgatory);
    drain(alone);
    alone.helpers.resolveRestOfCombat();
    // Trigger must not fire: bauble still in hand (not discarded). Snatch may
    // still on-hit draw for the attacker — don't assert hand size.
    expect(alone.as(bravo).zone("hand")).toContain(crackedBaubleYellow.canonicalId);
    expect(alone.as(bravo).zone("graveyard")).not.toContain(crackedBaubleYellow.canonicalId);
    expect(alone.as(dash).zone("hand").length).toBe(aloneDefHand); // no Face Purgatory draw
    expect(alone.as(dash).zone("graveyard")).toContain(facePurgatory.canonicalId);
    expect(alone.as(dash).life()).toBe(LIFE - (SNATCH - HELM_D));

    // Only AAC partner (no non-attack action).
    const aacOnly = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, crackedBaubleYellow],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [facePurgatory],
        hand: [snatchRed],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    aacOnly.as(bravo).attackWith(snatchRed);
    const aacDefHand = aacOnly.as(dash).zone("hand").length;
    aacOnly.as(dash).defendWith([facePurgatory, snatchRed]);
    drain(aacOnly);
    aacOnly.helpers.resolveRestOfCombat();
    expect(aacOnly.as(bravo).zone("hand")).toContain(crackedBaubleYellow.canonicalId);
    expect(aacOnly.as(bravo).zone("graveyard")).not.toContain(crackedBaubleYellow.canonicalId);
    // Hand spent 1 defender, no Face Purgatory draw.
    expect(aacOnly.as(dash).zone("hand").length).toBe(aacDefHand - 1);
    expect(aacOnly.as(dash).zone("graveyard")).toContain(facePurgatory.canonicalId);

    // Only non-attack partner.
    const nonOnly = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, crackedBaubleYellow],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [facePurgatory],
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    nonOnly.as(bravo).attackWith(snatchRed);
    nonOnly.as(dash).defendWith([facePurgatory, nimblismBlue]);
    drain(nonOnly);
    nonOnly.helpers.resolveRestOfCombat();
    expect(nonOnly.as(bravo).zone("hand")).toContain(crackedBaubleYellow.canonicalId);
    expect(nonOnly.as(bravo).zone("graveyard")).not.toContain(crackedBaubleYellow.canonicalId);
    expect(nonOnly.as(dash).zone("graveyard")).toContain(facePurgatory.canonicalId);
    // Block total helm 2 + nimblism 2 = 4 vs snatch 4.
    expect(nonOnly.as(dash).life()).toBe(LIFE - Math.max(0, SNATCH - (HELM_D + NIMBLISM_DEF)));
    void SNATCH_DEF;
  });
});
