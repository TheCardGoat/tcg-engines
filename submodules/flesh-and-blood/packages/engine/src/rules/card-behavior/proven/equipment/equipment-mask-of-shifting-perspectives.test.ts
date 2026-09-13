/**
 * BEN003 Mask of Shifting Perspectives — Assassin/Ninja Head d1 bladeBreak.
 *
 * Printed:
 *   Attack Reaction - Destroy this: Whenever a dagger hits this turn, you may
 *   put a card from your hand on the bottom of your deck. If you do, draw a
 *   card. Blade Break
 *
 * Model (after fix):
 *   AR destroy-self → delayed-trigger hit (types Dagger) duration this-turn →
 *   optional hand→deck bottom then draw
 *
 * Reasoning:
 * 1. "Whenever … this turn" needs duration:this-turn multi-fire (default delayed
 *    is one-shot).
 * 2. moniker:"Dagger" only matches names containing "Dagger"; types:["Dagger"]
 *    matches the type-line (Quicksilver Dagger etc.).
 * 3. subtypes:["Card"] is English residue and can fail vocabulary — any hand
 *    card is legal for the optional put-bottom.
 * 4. Attack Reaction is illegal outside the reaction window of open combat.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { advanceCombatToReaction } from "../../../../testing/rules-aaa.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";
import { maskOfShiftingPerspectives } from "../../../../../../cards/src/cards/equipment/mask-of-shifting-perspectives.ts";
import { quicksilverDagger } from "../../../../../../cards/src/cards/weapons/quicksilver-dagger.ts";

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { acceptOptional?: boolean; preferCanonicalId?: string } = {},
): void {
  for (let safety = 0; safety < 60; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: opts.acceptOptional ?? false },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const pick =
        (opts.preferCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === opts.preferCanonicalId,
            )
          : undefined) ?? decision.candidates[0];
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
    if (decision?.kind === "payment") {
      const cand = decision.candidates[0];
      if (!cand) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "payment", instanceIds: [cand.instanceId] },
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

describe("mask-of-shifting-perspectives (BEN003)", () => {
  it("core mechanic: AR destroy-self → dagger hit → optional bottom+draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [maskOfShiftingPerspectives],
        weapon1: [quicksilverDagger],
        // bottom target + draw fodder + pitch for weapon attack
        hand: [snatchRed, nimblismBlue, nimblismBlue],
        actionPoints: 2,
        resourcePoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6, life: 20 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").length;
    const handBefore = Bravo.zone("hand").length;

    // Open combat with dagger attack; stop at reaction for the AR.
    Bravo.activate(quicksilverDagger);
    // Resolve the attack-with layer onto the combat chain (pass both).
    game.passBoth();
    expect(game.combat()?.open).toBe(true);
    advanceCombatToReaction(game, Bravo, game.as(dash));
    expect(game.combat()?.step).toBe("reaction");
    Bravo.activate(maskOfShiftingPerspectives);
    // Resolve only the AR layer (destroy + register delayed) — do not close combat.
    for (let i = 0; i < 20; i += 1) {
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
      if (d) break;
      if (game.getState().rulesStack.length === 0) break;
      if (game.declareNoDefenseIfPending()) continue;
      const prio = game.getPriorityPlayerId();
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
      else break;
    }

    expect(Bravo.zone("head")).not.toContain(maskOfShiftingPerspectives.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(maskOfShiftingPerspectives.canonicalId);
    expect(game.getState().delayedTriggers.length).toBeGreaterThanOrEqual(1);

    // Finish combat so dagger can hit; accept optional bottom+draw.
    drain(game, { acceptOptional: true, preferCanonicalId: snatchRed.canonicalId });

    expect(game.committedEvents().some((e) => e.name === "hit")).toBe(true);
    expect(Bravo.zone("deck")).toContain(snatchRed.canonicalId);
    expect(Bravo.zone("hand")).not.toContain(snatchRed.canonicalId);
    // put-bottom then draw: deck not shorter than start.
    expect(Bravo.zone("deck").length).toBeGreaterThanOrEqual(deckBefore);
    expect(Bravo.zone("hand").length).toBeGreaterThanOrEqual(handBefore - 2);
  });

  it("boundaries: Attack Reaction illegal outside combat reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [maskOfShiftingPerspectives],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    expect(() => Bravo.activate(maskOfShiftingPerspectives)).toThrow();
    expect(Bravo.zone("head")).toContain(maskOfShiftingPerspectives.canonicalId);
  });
});
