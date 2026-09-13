/**
 * DYN152 Hornet's Sting — Ranger Arms d1 Blade Break.
 *
 * Printed:
 *   Whenever Hornet's Sting defends, reveal the top card of your deck. If it's
 *   an arrow, deal 1 damage to the attacking hero or ally. Otherwise, put it
 *   on the bottom of your deck.
 *   Blade Break
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. defend subject:self — co-defenders must not fire.
 * 2. Reveal top binds "it"; Arrow → deal 1 generic to attacking-hero (1v1).
 *    Ally branch is multiplayer-only product boundary.
 * 3. Non-arrow → move binding it deck bottom; arrow stays top after reveal.
 * 4. Fixture: hand:[] so opening-hand draw does not pop deck top (Bone Vizier
 *    lesson). Without it, empty/wrong deck makes reveal fail to bind "it" and
 *    the else move-card reports "move target is unresolved" — a real AAA
 *    trap, not an engine gap.
 * 5. Happy: deck top Endless Arrow → attacker loses 1 life; BB arms to GY.
 * 6. Boundary: non-arrow top (blue) → bottoms; no ping; BB still.
 * 7. Boundary: defend with hand only (not hornet) → no reveal fire.
 * 8. Blade Break d1.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue, endlessArrowRed } from "../../../fixtures.ts";
import { hornetSSting } from "../../../../../../cards/src/cards/equipment/hornet-s-sting.ts";

const LIFE = 20;
const SNATCH = 4;
const ARMS_D = 1;

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

describe("hornet-s-sting (DYN152)", () => {
  it("core mechanic: defend reveal Arrow → 1 damage to attacking hero; BB d1", () => {
    // Deck top = last element = Endless Arrow. hand:[] preserves top.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        life: LIFE,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        arms: [hornetSSting],
        hand: [],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, endlessArrowRed],
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);
    const deckBefore = Defender.zone("deck").length;
    expect(Defender.zone("deck").at(-1)).toBe(endlessArrowRed.canonicalId);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(hornetSSting);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    // Snatch 4 − d1 = 3 to defender; attacker takes 1 from sting ping.
    expect(Defender.life()).toBe(LIFE - (SNATCH - ARMS_D));
    expect(Attacker.life()).toBe(LIFE - 1);
    // Blade Break → arms GY; arrow stays on top (deck size unchanged).
    expect(Defender.zone("graveyard")).toContain(hornetSSting.canonicalId);
    expect(Defender.zone("arms")).not.toContain(hornetSSting.canonicalId);
    expect(Defender.zone("deck").length).toBe(deckBefore);
    expect(Defender.zone("deck").at(-1)).toBe(endlessArrowRed.canonicalId);
    expect(game.committedEvents().some((e) => e.name === "reveal")).toBe(true);
  });

  it("boundaries: non-arrow bottoms; defend-other no fire; model subject:self", () => {
    // Non-arrow top → bottom; no attacker ping.
    const nonArrow = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        life: LIFE,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        arms: [hornetSSting],
        hand: [],
        // Top = last = blue non-arrow.
        deck: [endlessArrowRed, nimblismBlue],
      },
      { autoPassPriority: false },
    );
    nonArrow.as(bravo).attackWith(snatchRed);
    nonArrow.as(dash).defendWith(hornetSSting);
    drain(nonArrow);
    nonArrow.helpers.resolveRestOfCombat();
    drain(nonArrow);

    expect(nonArrow.as(bravo).life()).toBe(LIFE);
    expect(nonArrow.as(dash).life()).toBe(LIFE - (SNATCH - ARMS_D));
    // Blue bottomed; Endless Arrow is top.
    expect(nonArrow.as(dash).zone("deck").at(-1)).toBe(endlessArrowRed.canonicalId);
    expect(nonArrow.as(dash).zone("deck").at(0)).toBe(nimblismBlue.canonicalId);
    expect(nonArrow.as(dash).zone("graveyard")).toContain(hornetSSting.canonicalId);

    // Defend with hand only (not hornet) — subject:self must not fire.
    // hand:[blue] is intentional here (block from hand); deck top preserved as
    // a single-card deck that would still be top after no open-hand drain if
    // we only put the blue in hand (not drawn from deck).
    const co = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        life: LIFE,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        arms: [hornetSSting],
        hand: [nimblismBlue],
        deck: [endlessArrowRed],
      },
      { autoPassPriority: false },
    );
    // Ensure arrow still top after any open-hand setup (hand was explicit).
    expect(co.as(dash).zone("deck").at(-1)).toBe(endlessArrowRed.canonicalId);
    co.as(bravo).attackWith(snatchRed);
    co.as(dash).defendWith(nimblismBlue);
    drain(co);
    co.helpers.resolveRestOfCombat();
    drain(co);
    expect(co.as(bravo).life()).toBe(LIFE);
    expect(co.as(dash).zone("arms")).toContain(hornetSSting.canonicalId);
    expect(co.as(dash).zone("deck").at(-1)).toBe(endlessArrowRed.canonicalId);

    const a1 = hornetSSting.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind === "static") {
      expect(a1.trigger).toMatchObject({
        event: { name: "defend", observes: { kind: "source" } },
      });
      expect(a1.resolution?.effect).toMatchObject({
        type: "sequence",
        steps: [
          {
            type: "reveal",
            target: {
              zones: ["deck"],
              position: "top",
              count: 1,
            },
            outputBinding: "it",
          },
          {
            type: "conditional",
            condition: {
              type: "binding-matches",
              binding: "it",
              filter: { typeBox: { subtypes: ["Arrow"] } },
            },
            then: {
              type: "deal-damage",
              amount: 1,
              target: { selector: "attacking-hero" },
            },
            else: {
              type: "move-card",
              to: { zone: "deck", position: "bottom" },
            },
          },
        ],
      });
    }
    expect(hornetSSting.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "blade-break" })]),
    );
  });
});
