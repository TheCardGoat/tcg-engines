/**
 * HNT250 Misfire Dampener — Mechanologist Arms d1 Blade Break.
 *
 * Printed:
 *   Instant - Destroy this: Prevent the next 1 arcane damage that would be
 *   dealt to you this turn. If you've boosted this turn, instead prevent the
 *   next 2.
 *   Blade Break
 *
 * Reasoning (hand-authored; case-by-case; templar-spellbane twin):
 * 1. sequence+instead stacked prevent 1 then 2 — remodel conditional then/else.
 * 2. Base Instant destroy → prevent 1 of 2 arcane.
 * 3. After boost (Throttle) same turn → prevent 2 arcane fully.
 * 4. Blade Break d1 defend.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, throttleRed } from "../../../fixtures.ts";
import { misfireDampener } from "../../../../../../cards/src/cards/equipment/misfire-dampener.ts";

const LIFE = 20;

const arcaneBolt2 = {
  canonicalId: "trainer-arcane-bolt-hnt250",
  types: ["Wizard", "Action"],
  cost: 0,
  arcane: 2,
  keywords: [] as const,
};

const arcaneInstant2 = {
  canonicalId: "trainer-arcane-instant-hnt250",
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

describe("misfire-dampener (HNT250)", () => {
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
        arms: [misfireDampener],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);

    if (game.getState().priority?.holderPlayerId !== Dash.id) {
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
    }
    Dash.activate(misfireDampener);
    drain(game);

    expect(Dash.zone("arms")).not.toContain(misfireDampener.canonicalId);
    expect(Dash.zone("graveyard")).toContain(misfireDampener.canonicalId);

    if (game.getState().priority?.holderPlayerId !== game.as(bravo).id) {
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
    }
    game.as(bravo).play(arcaneBolt2, { target: Dash.id });
    drain(game);

    // Prevent 1 of 2 arcane.
    expect(Dash.life()).toBe(LIFE - 1);
  });

  it("core mechanic: boosted this turn → instead prevent 2 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        life: LIFE,
        arms: [misfireDampener],
        hand: [throttleRed],
        actionPoints: 1,
        deck: 8,
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

    // Boost Throttle → stamps boosted-this-turn; resolve combat.
    Dash.play(throttleRed, { boost: true });
    expect(game.getState().players[Dash.id]!.history.turn.boosted).toBe(true);
    drain(game);
    if (game.combat()) game.helpers.resolveRestOfCombat();
    drain(game);

    if (game.getState().priority?.holderPlayerId !== Dash.id) {
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
    }
    Dash.activate(misfireDampener);
    drain(game);
    expect(Dash.zone("graveyard")).toContain(misfireDampener.canonicalId);

    if (game.getState().priority?.holderPlayerId !== Bravo.id) {
      const prio = game.getState().priority?.holderPlayerId;
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
    }
    Bravo.play(arcaneInstant2, { target: Dash.id });
    drain(game);

    // Fully prevented (2 of 2).
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

  it("boundaries: bladeBreak d1; conditional then/else model (no stacked sequence)", () => {
    const bb = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, arms: [misfireDampener], deck: 6 },
      { autoPassPriority: false },
    );
    bb.as(bravo).attackWith(snatchRed);
    bb.as(dash).defendWith(misfireDampener);
    bb.helpers.resolveRestOfCombat();
    expect(bb.as(dash).zone("arms")).not.toContain(misfireDampener.canonicalId);
    expect(bb.as(dash).zone("graveyard")).toContain(misfireDampener.canonicalId);

    const a1 = misfireDampener.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({ type: "destroy-self" });
    expect(a1.effect).toMatchObject({
      type: "conditional",
      condition: { type: "performed-this-turn", event: "boost", player: "controller" },
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
