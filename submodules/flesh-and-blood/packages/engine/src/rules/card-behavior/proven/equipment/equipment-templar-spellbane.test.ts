/**
 * PEN043 Templar Spellbane — Warrior Head d1 Battleworn.
 *
 * Printed:
 *   Instant - Destroy this: Prevent the next 1 arcane damage that would be
 *   dealt to you this turn. If you've activated a weapon this turn, instead
 *   prevent the next 2.
 *   Battleworn
 *
 * Reasoning (hand-authored):
 * 1. Catalog sequence+instead:true stacked prevent 1 then 2 (proposal ignores
 *    instead). Remodeled to conditional then/else single prevention.
 * 2. performed-this-turn / activate-weapon reads the committed activation
 *    event, independently of whether the weapon attack later resolves.
 * 3. Base: Instant destroy → prevent 1 arcane this turn.
 * 4. After weapon attack same turn: Instant destroy → prevent 2 arcane.
 * 5. Battleworn keyword present (d1 lifecycle covered by battleworn suite).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, dawnblade } from "../../../fixtures.ts";
import { templarSpellbane } from "../../../../../../cards/src/cards/equipment/templar-spellbane.ts";

const LIFE = 20;

const arcaneBolt2 = {
  canonicalId: "trainer-arcane-bolt-pen043",
  types: ["Wizard", "Action"],
  cost: 0,
  arcane: 2,
  keywords: [] as const,
};

const arcaneInstant2 = {
  canonicalId: "trainer-arcane-instant-pen043",
  types: ["Wizard", "Instant"],
  cost: 0,
  arcane: 2,
  keywords: [] as const,
};

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

describe("templar-spellbane (PEN043)", () => {
  it("core mechanic: Instant destroy → prevent next 1 arcane this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [arcaneBolt2],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [templarSpellbane],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    // Instant on Bravo's turn: Dash needs priority first.
    if (game.getState().priority?.holderPlayerId !== Dash.id) {
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
    }
    Dash.activate(templarSpellbane);
    drain(game);

    expect(Dash.zone("head")).not.toContain(templarSpellbane.canonicalId);
    expect(Dash.zone("graveyard")).toContain(templarSpellbane.canonicalId);

    if (game.getState().priority?.holderPlayerId !== game.as(bravo).id) {
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
    }
    game.as(bravo).play(arcaneBolt2, { target: Dash.id });
    drain(game);

    // Prevent 1 of 2 arcane.
    expect(Dash.life()).toBe(LIFE - 1);
  });

  it("core mechanic: activated weapon this turn → instead prevent 2 arcane", () => {
    // Dash is active (first seat) so weapon + Instant fire on their turn.
    const game = FabTestEngine.start(
      {
        hero: dash,
        life: LIFE,
        head: [templarSpellbane],
        weapon1: [dawnblade],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        hand: [arcaneInstant2],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    // Activate weapon attack (stamps weaponAttacks this turn).
    Dash.activate(dawnblade);
    game.helpers.resolveRestOfCombat();
    expect(game.getState().players[Dash.id]!.history.turn.weaponAttacks).toBeGreaterThanOrEqual(1);

    if (game.getState().priority?.holderPlayerId !== Dash.id) {
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
    }
    Dash.activate(templarSpellbane);
    drain(game);
    expect(Dash.zone("graveyard")).toContain(templarSpellbane.canonicalId);

    // Same turn: Instant 2 arcane into Dash — fully prevented.
    if (game.getState().priority?.holderPlayerId !== Bravo.id) {
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
    }
    Bravo.play(arcaneInstant2, { target: Dash.id });
    drain(game);

    expect(Dash.life()).toBe(LIFE);
    expect(
      game
        .committedEvents()
        .some(
          (e) =>
            e.name === "prevent" &&
            e.data &&
            "preventedAmount" in e.data &&
            e.data.preventedAmount === 2,
        ),
    ).toBe(true);
  });

  it("boundaries: battleworn + conditional then/else model (no stacked sequence)", () => {
    expect(templarSpellbane.base.keywords?.some((k) => k.name === "battleworn")).toBe(true);
    expect(templarSpellbane.base.numeric.defense).toBe(1);

    const a1 = templarSpellbane.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({ type: "destroy-self" });
    expect(a1.effect).toMatchObject({
      type: "conditional",
      condition: { type: "performed-this-turn" },
      then: {
        type: "prevention",
        amount: 2,
        damageType: "arcane",
        duration: "this-turn",
      },
      else: {
        type: "prevention",
        amount: 1,
        damageType: "arcane",
        duration: "this-turn",
      },
    });
  });
});
