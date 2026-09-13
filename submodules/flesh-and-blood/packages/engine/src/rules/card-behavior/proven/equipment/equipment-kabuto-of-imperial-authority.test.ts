/**
 * HNT115 Kabuto of Imperial Authority — Warrior Head d2 Blade Break.
 *
 * Printed:
 *   When this defends, until end of turn, opponents can't attack with weapons.
 *   Blade Break
 *
 * Reasoning (hand-authored, no batch script):
 * 1. Defend subject:self — co-defenders must not arm this.
 * 2. filter.types:["Weapon"] — Weapon is a CR type, not a subtype. The parser
 *    previously emitted subtypes:["Weapon"], which never matches type-boxes.
 * 3. Continuous rule-modification action:"attack" must be checked on weapon
 *    activation (abilityType "attack"), not only on rules("activate") subject
 *    lists. Opponents of the effect controller are restricted.
 * 4. until-end-of-turn persists after Blade Break destroys the helm.
 * 5. AAC attacks remain legal; only weapon attacks are blocked.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, dawnblade, snatchRed } from "../../../fixtures.ts";
import { kabutoOfImperialAuthority } from "../../../../../../cards/src/cards/equipment/kabuto-of-imperial-authority.ts";

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
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "ordering",
            orderedIds: decision.entries.map((e) => e.id),
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

describe("kabuto-of-imperial-authority (HNT115)", () => {
  it("core mechanic: defend → BB d2; opponent weapon attack illegal same turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        weapon1: [dawnblade],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [kabutoOfImperialAuthority],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(kabutoOfImperialAuthority);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Defense contribution d2 + Blade Break → GY.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    expect(Defender.zone("graveyard")).toContain(kabutoOfImperialAuthority.canonicalId);
    expect(Defender.zone("head")).not.toContain(kabutoOfImperialAuthority.canonicalId);

    // Same turn: weapon Attack activation is restricted for the opponent.
    const rejected = Attacker.expectFailure({
      move: "activate",
      payload: { instanceId: Attacker.card(dawnblade) },
    });
    expect(rejected.accepted).toBe(false);
    expect(rejected.errorCode).toBe("restricted_by_rule");
  });

  it("boundaries: AAC still legal after defend; weapon legal without defend", () => {
    // Without defending Kabuto, weapon attack is legal.
    const open = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnblade],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const lifeBefore = open.as(dash).life();
    open.as(bravo).activate(dawnblade);
    open.helpers.resolveRestOfCombat();
    expect(open.as(dash).life()).toBe(lifeBefore - 3);

    // After Kabuto defends, attack action cards are still legal (not weapons).
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, snatchRed],
        weapon1: [dawnblade],
        actionPoints: 2,
        resourcePoints: 0,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [kabutoOfImperialAuthority],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);
    const secondLifeBefore = Defender.life();

    Attacker.attackWith(snatchRed);
    Defender.defendWith(kabutoOfImperialAuthority);
    drain(game);
    game.helpers.resolveRestOfCombat();

    // Second AAC this turn still opens combat (restriction is weapons only).
    Attacker.attackWith(snatchRed);
    expect(game.combat()).not.toBeNull();
    drain(game);
    game.helpers.resolveRestOfCombat();
    // First snatch: 4-2=2 damage; second snatch undefended: 4 damage.
    expect(Defender.life()).toBe(secondLifeBefore - 2 - 4);
  });

  it("model guard: defend subject:self + restrict attack types Weapon UEOT", () => {
    const a1 = kabutoOfImperialAuthority.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.effect) return;
    expect(a1.trigger).toMatchObject({
      event: { name: "defend", subject: "self" },
    });
    expect(a1.effect).toMatchObject({
      type: "rule-modification",
      mode: "restrict",
      action: "attack",
      filter: { typeBox: { types: ["Weapon"] } },
      duration: "this-turn",
    });
  });
});
