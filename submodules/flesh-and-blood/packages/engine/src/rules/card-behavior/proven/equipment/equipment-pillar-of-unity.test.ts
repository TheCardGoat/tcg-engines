/**
 * PEN047 Pillar of Unity — Warrior Legs d1 Temper + Unity.
 * Mirrors proven PEN044 helm-of-unity + PEN046 gauntlets-of-unity.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismRed } from "../../../fixtures.ts";
import { pillarOfUnity } from "../../../../../../cards/src/cards/equipment/pillar-of-unity.ts";
import { bluntenYellow } from "../../../../../../cards/src/cards/blocks/blunten.ts";
import { brothersInArmsBlue } from "../../../../../../cards/src/cards/actions/brothers-in-arms.ts";

const SNATCH = 4;
const LIFE = 20;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let s = 0; s < 48; s += 1) {
    const d = game.getState().decision;
    if (d?.kind === "boolean") {
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
    if (d?.kind === "entity-target") {
      const pick = d.candidates[0];
      if (!pick && (d.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: d.actorId,
        payload: {
          decisionId: d.decisionId,
          stateVersion: d.stateVersion,
          answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
        },
      });
      continue;
    }
    if (d) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("pillar-of-unity (PEN047)", () => {
  it("binds all three printed 'this defends' triggers to their own defending incarnation", () => {
    for (const card of [pillarOfUnity, bluntenYellow, brothersInArmsBlue]) {
      const ability = card.base.abilities?.[0];
      expect(ability).toMatchObject({
        kind: "static",
        staticKind: "triggered",
        trigger: { event: { name: "defend", observes: { kind: "source" } } },
      });
    }
  });

  it("core: defend with hand card → +1{d} unity (d1→d2; blocks 4 vs snatch 4)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, legs: [pillarOfUnity], hand: [nimblismRed], deck: 6 },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);
    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith([pillarOfUnity, nimblismRed]);
    drain(game);
    game.helpers.resolveRestOfCombat();
    // Legs d1 + unity +1 = d2; nimblism d2 → total block 4 vs snatch 4 → 0 dmg.
    expect(Defender.life()).toBe(LIFE);
  });

  it("boundary: alone → base d1 only; Temper destroys", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, legs: [pillarOfUnity], deck: 6 },
      { autoPassPriority: false },
    );
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith(pillarOfUnity);
    drain(game);
    game.helpers.resolveRestOfCombat();
    // Solo: no unity — snatch 4 − d1 = 3 damage; Temper destroys.
    expect(game.as(dash).life()).toBe(LIFE - (SNATCH - 1));
    expect(game.as(dash).zone("legs")).not.toContain(pillarOfUnity.canonicalId);
    expect(game.as(dash).zone("graveyard")).toContain(pillarOfUnity.canonicalId);
  });

  it("Brothers payment is infeasible without assets, cancellable before commit, and exact with floating resources", () => {
    for (const branch of ["no-assets", "cancel", "floating"] as const) {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [snatchRed], deck: 6 },
        {
          hero: dash,
          hand: branch === "no-assets" ? [brothersInArmsBlue] : [brothersInArmsBlue, nimblismRed],
          resourcePoints: branch === "floating" ? 1 : 0,
          deck: 6,
        },
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      const Attacker = game.as(bravo);
      const Defender = game.as(dash);
      Attacker.must.playAttack(snatchRed);
      game.advanceCombatTo("defend");
      Defender.must.defend(brothersInArmsBlue);
      if (branch !== "no-assets") {
        game.advanceToDecision(Defender, "boolean");
        Defender.chooseBoolean(true);
        if (branch === "cancel") {
          const payment = Defender.expectDecision("payment");
          game.answerDecision(Defender.id, { kind: "cancel" });
          expect(payment.cancellable).toBe(true);
        }
      }
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      expect(Defender.life()).toBe(branch === "floating" ? LIFE : LIFE - 2);
      expect(game.committedEvents().filter((event) => event.name === "pay-resources")).toHaveLength(
        branch === "floating" ? 1 : 0,
      );
      expect(Defender.zone("pitch")).toHaveLength(0);
      if (branch !== "no-assets") expect(Defender.zone("hand")).toContain(nimblismRed.canonicalId);
    }
  });
});
