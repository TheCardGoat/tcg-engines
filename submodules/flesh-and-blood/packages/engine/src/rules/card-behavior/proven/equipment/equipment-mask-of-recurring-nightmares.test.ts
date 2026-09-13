/**
 * MST004 Mask of Recurring Nightmares — Mystic Assassin Head d2 Blade Break.
 *
 * Printed:
 *   Once per Turn Attack Reaction - {c}{c}{c}: Target defending hero banishes
 *   a card from their hand.
 *   Blade Break
 *
 * Reasoning (hand-authored, 1v1):
 * 1. AR only legal in combat reaction step (not open action).
 * 2. Pay 3 chi from floating chiPoints.
 * 3. defending-hero hand banish: defender chooses/loses a hand card (1v1
 *    defending seat = sole opponent of the attack).
 * 4. OPT: second activate same turn illegal.
 * 5. Blade Break is separate defend path (d2 block + destroy).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { maskOfRecurringNightmares } from "../../../../../../cards/src/cards/equipment/mask-of-recurring-nightmares.ts";

const SNATCH = 4;
const LIFE = 20;
const DEF = 2;

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
    if (decision?.kind === "payment") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "payment", instanceIds: [] },
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

function toReaction(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 24; safety += 1) {
    if (game.combat()?.step === "reaction") return;
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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (!prio) return;
    game.exec({ move: "pass", actorId: prio, payload: {} });
  }
}

describe("mask-of-recurring-nightmares (MST004)", () => {
  it("core mechanic: AR pay 3 chi → defending hero banishes a hand card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [maskOfRecurringNightmares],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
        chiPoints: 3,
      },
      {
        hero: dash,
        life: LIFE,
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    toReaction(game);
    expect(game.combat()?.step).toBe("reaction");

    expect(Defender.zone("hand")).toContain(nimblismBlue.canonicalId);
    Attacker.activate(maskOfRecurringNightmares);
    drain(game);

    expect(game.getState().players[Attacker.id]!.chiPoints).toBe(0);
    expect(Defender.zone("hand")).not.toContain(nimblismBlue.canonicalId);
    expect(Defender.zone("banished")).toContain(nimblismBlue.canonicalId);
    // Mask stays equipped (AR cost is chi, not destroy-self).
    expect(Attacker.zone("head")).toContain(maskOfRecurringNightmares.canonicalId);
  });

  it("boundaries: illegal outside reaction; OPT; BB d2 lifecycle", () => {
    const open = FabTestEngine.start(
      {
        hero: bravo,
        head: [maskOfRecurringNightmares],
        deck: 6,
        chiPoints: 3,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => open.as(bravo).activate(maskOfRecurringNightmares)).toThrow();

    // OPT: second AR same turn illegal after first.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [maskOfRecurringNightmares],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
        chiPoints: 6,
      },
      {
        hero: dash,
        life: LIFE,
        hand: [nimblismBlue, snatchRed],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const A = game.as(bravo);
    A.attackWith(snatchRed);
    toReaction(game);
    A.activate(maskOfRecurringNightmares);
    drain(game);
    expect(() => A.activate(maskOfRecurringNightmares)).toThrow();

    // Blade Break defend path (separate seating).
    const bb = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [maskOfRecurringNightmares],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    bb.as(bravo).attackWith(snatchRed);
    bb.as(dash).defendWith(maskOfRecurringNightmares);
    drain(bb);
    bb.helpers.resolveRestOfCombat();
    expect(bb.as(dash).life()).toBe(LIFE - (SNATCH - DEF));
    expect(bb.as(dash).zone("graveyard")).toContain(maskOfRecurringNightmares.canonicalId);

    const a1 = maskOfRecurringNightmares.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("attack-reaction");
    expect(a1.limit).toMatchObject({ count: 1, per: "turn" });
    expect(a1.cost).toMatchObject({ class: "asset", type: "chi", amount: 3 });
    expect(a1.effect).toMatchObject({
      type: "banish",
      target: {
        selector: "object",
        player: "defending-hero",
        zones: ["hand"],
        count: 1,
      },
    });
  });
});
