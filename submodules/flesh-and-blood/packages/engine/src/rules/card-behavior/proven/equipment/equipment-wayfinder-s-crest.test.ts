/**
 * AZL004 Wayfinder's Crest — Ranger Head d1 bladeBreak.
 *
 * Printed:
 *   When you defend with Wayfinder's Crest, look at the top card of target
 *   hero's deck. Blade Break
 *
 * Model (after fix):
 *   defend subject:self → look at-resolution top of any hero's deck
 *
 * Reasoning:
 * 1. Name filter "Wayfinder's Crest" is brittle; subject:self is the standard
 *    "when you defend with this" model (Ollin / Flash of Brilliance).
 * 2. Target hero's deck: player any + position top + count 1 presents deck-top
 *    candidates (self and opponent in 1v1) and requires a chooser — not auto-
 *    look at every seat (engine structural fix for multi-seat positioned pools).
 * 3. Look is private observation — assert committed look event; deck unchanged.
 * 4. Blade Break destroys at chain close after defend.
 * 5. Fixtures must set hand: [] when deck contents matter — undefined hand
 *    draws an opening hand from the deck (test-fixtures drawOpeningHand).
 * 6. Snatch draws on hit; assert look + deck before combat fully resolves
 *    when the looked top would be drawn.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue, tomeOfFyendalYellow } from "../../../fixtures.ts";
import { wayfinderSCrest } from "../../../../../../cards/src/cards/equipment/wayfinder-s-crest.ts";

function answerLookTarget(
  game: ReturnType<typeof FabTestEngine.start>,
  preferCanonicalId?: string,
): void {
  for (let safety = 0; safety < 30; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      // Chooser should only see deck tops (one per hero), not whole decks.
      expect(decision.candidates.length).toBeGreaterThanOrEqual(1);
      expect(decision.candidates.length).toBeLessThanOrEqual(2);
      const pick =
        (preferCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === preferCanonicalId,
            )
          : undefined) ?? decision.candidates[0];
      if (!pick) throw new Error("no look-target candidate for wayfinder");
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [pick.instanceId] },
        },
      });
      return;
    }
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
    if (decision) {
      throw new Error(`unexpected decision before look target: ${decision.kind}`);
    }
    // Trigger layer may still be stacking — pass priority to push it.
    const prio = game.getState().priority?.holderPlayerId;
    if (prio && (game.combat() || game.getState().rulesStack.length > 0)) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    throw new Error("look target decision never appeared");
  }
  throw new Error("look target decision timed out");
}

function drainRest(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 50; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [pick.instanceId] },
        },
      });
      continue;
    }
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

describe("wayfinder-s-crest (AZL004)", () => {
  it("core mechanic: defend → choose opponent deck top → look; deck unchanged; blade break", () => {
    // Opponent deck top (last index) is tome — choose that for look.
    // Explicit hand: [] so opening-hand draw does not empty decks.
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, tomeOfFyendalYellow],
        actionPoints: 1,
      },
      {
        hero: bravo,
        head: [wayfinderSCrest],
        hand: [],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // zone() returns canonical ids; deck top = last index.
    expect(Dash.zone("deck").at(-1)).toBe(tomeOfFyendalYellow.canonicalId);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(wayfinderSCrest);
    answerLookTarget(game, tomeOfFyendalYellow.canonicalId);

    // Assert look immediately — before Snatch-on-hit draw can pull the top.
    const looks = game.committedEvents().filter((e) => e.name === "look");
    // Exactly one look — chooser picked one hero's top, not both seats.
    expect(looks).toHaveLength(1);
    expect(looks[0]!.data.object.canonicalId).toBe(tomeOfFyendalYellow.canonicalId);
    // Look is observation only — deck order/contents unchanged at this point.
    expect(Dash.zone("deck")).toContain(tomeOfFyendalYellow.canonicalId);
    expect(Dash.zone("deck").at(-1)).toBe(tomeOfFyendalYellow.canonicalId);

    drainRest(game);

    // Blade Break after chain closes.
    expect(Bravo.zone("head")).not.toContain(wayfinderSCrest.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(wayfinderSCrest.canonicalId);
  });

  it("core path: may look at own deck top", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        head: [wayfinderSCrest],
        // hand: [] required — otherwise opening hand empties this deck.
        hand: [],
        deck: [nimblismBlue, nimblismBlue, tomeOfFyendalYellow],
        life: 20,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.zone("deck").at(-1)).toBe(tomeOfFyendalYellow.canonicalId);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(wayfinderSCrest);
    answerLookTarget(game, tomeOfFyendalYellow.canonicalId);

    const looks = game.committedEvents().filter((e) => e.name === "look");
    expect(looks).toHaveLength(1);
    expect(looks[0]!.data.object.canonicalId).toBe(tomeOfFyendalYellow.canonicalId);
    expect(Bravo.zone("deck")).toContain(tomeOfFyendalYellow.canonicalId);
    expect(Bravo.zone("deck").at(-1)).toBe(tomeOfFyendalYellow.canonicalId);
  });

  it("boundaries: other card defending does not arm Wayfinder look", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        head: [wayfinderSCrest],
        hand: [nimblismBlue],
        deck: [tomeOfFyendalYellow, nimblismBlue, nimblismBlue],
        life: 20,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    game.as(dash).attackWith(snatchRed);
    // Defend with hand card only — crest stays equipped, no look.
    Bravo.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    expect(game.committedEvents().filter((e) => e.name === "look")).toHaveLength(0);
    expect(Bravo.zone("head")).toContain(wayfinderSCrest.canonicalId);
  });
});
