/**
 * DTD075 Radiant View — Light Head (no printed defense).
 *
 * Printed:
 *   Instant - Banish this and a card from your hero's soul: Prevent the next
 *   2 damage that would be dealt to your hero this turn.
 *
 * Model (after fix):
 *   Instant mixed banish-self + banish soul → prevention fixed 2 this-turn
 *   on controller
 *
 * Reasoning:
 * 1. "Banish this" is banish-self, not banish any arena permanent (prior
 *    from:arena count 1 let the player pick unrelated permanents).
 * 2. Soul card is a separate banish cost (declared target).
 * 3. Prevention 2 vs combat damage this turn after Instant arms.
 * 4. Empty soul or missing soul card → cost unavailable.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { radiantView } from "../../../../../../cards/src/cards/equipment/radiant-view.ts";

const SNATCH = 4;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 40; safety += 1) {
    const decision = game.getState().decision;
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
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: true },
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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("radiant-view (DTD075)", () => {
  it("core mechanic: banish-self + soul → prevent next 2 damage this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        head: [radiantView],
        // Soul card to pay the second cost.
        soul: [nimblismBlue],
        hand: [],
        deck: 6,
        life: 20,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    // Instant on defend step — arm prevention before damage.
    Bravo.defendWith([]);
    game.as(dash).pass();
    Bravo.activate(radiantView);
    drain(game);

    // Banish this → equipment to banished (not GY).
    expect(Bravo.zone("head")).not.toContain(radiantView.canonicalId);
    expect(Bravo.zone("banished")).toContain(radiantView.canonicalId);
    expect(Bravo.zone("banished")).toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("soul")).not.toContain(nimblismBlue.canonicalId);
    // register-replacement committed when Instant resolved.
    expect(game.committedEvents().some((e) => e.name === "register-replacement")).toBe(true);

    game.helpers.resolveRestOfCombat();

    // snatch 4 − prevent 2 = 2 damage → life 18.
    expect(Bravo.life()).toBe(20 - (SNATCH - 2));
  });

  it("boundaries: empty soul cannot pay Instant cost", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [radiantView],
        soul: [],
        hand: [],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    expect(() => Bravo.activate(radiantView)).toThrow();
    expect(Bravo.zone("head")).toContain(radiantView.canonicalId);
  });
});
