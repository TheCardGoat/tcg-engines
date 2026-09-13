/**
 * AZS003 Starfield Veil — Lightning Illusionist Head d2 guardwell.
 *
 * Printed:
 *   Instant - Destroy this: The next aura you play this turn enters the arena
 *   with a holo counter. Activate this only if an attack has fragmented this
 *   turn. Guardwell
 *
 * Model (after fix):
 *   Instant destroy-self gated by attack-fragmented-this-turn → one-shot
 *   delayed enter-arena (Aura you control) → add holo to binding "it".
 *
 * Reasoning:
 * 1. Gate needs turn fact: fragment event stamps history.turn.attackFragmented;
 *    has-status is global (any seat) per printed "an attack".
 * 2. "Next aura enters with holo" is not this-attack + appliesTo subtypes Aura
 *    residue — add-counter is not continuous; model is delayed-trigger enter-arena.
 * 3. Guardwell is separate keyword path (d2 −1 counters on defend); core AAA is
 *    the Instant destroy + holo path. Guardwell lifecycle covered in 08-keywords.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { fragmentOnce, playCostedAttackToDefend } from "../../../../testing/rules-aaa.ts";
import {
  bravo,
  dash,
  frayingLifeforceRed,
  nimblismBlue,
  upOnAPedestalBlue,
} from "../../../fixtures.ts";
import { starfieldVeil } from "../../../../../../cards/src/cards/equipment/starfield-veil.ts";

function drainDecisions(game: ReturnType<typeof FabTestEngine.start>): boolean {
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
    return true;
  }
  if (decision?.kind === "entity-target") {
    const min = decision.min ?? 1;
    const ids = min === 0 ? [] : decision.candidates[0] ? [decision.candidates[0].instanceId] : [];
    if (min > 0 && ids.length === 0) return false;
    game.exec({
      move: "answer-decision",
      actorId: decision.actorId,
      payload: {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "entity-target", instanceIds: ids },
      },
    });
    return true;
  }
  // Simultaneous enter-arena triggers (Up on a Pedestal + Starfield delayed
  // holo) require an order answer — without it the delayed layer never resolves.
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
    return true;
  }
  return false;
}

function passUntilQuiet(game: ReturnType<typeof FabTestEngine.start>, max = 40): void {
  for (let i = 0; i < max; i += 1) {
    if (drainDecisions(game)) continue;
    if (game.getState().decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

function holoCount(game: ReturnType<typeof FabTestEngine.start>, instanceId: string): number {
  const obj = game.getState().objects[instanceId];
  if (!obj) return 0;
  return obj.counters.reduce((sum, c) => {
    if (c.kind === "named" && c.name === "holo") return sum + c.count;
    return sum;
  }, 0);
}

describe("starfield-veil (AZS003)", () => {
  it("core mechanic: after fragment → destroy-self Instant → next aura enters with holo", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [starfieldVeil],
        // cost 2 + 2 pitch blues; Instant aura; extra blue for post-combat.
        hand: [frayingLifeforceRed, nimblismBlue, nimblismBlue, upOnAPedestalBlue, nimblismBlue],
        actionPoints: 2,
        resourcePoints: 0,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue],
        deck: 6,
        life: 40,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Play Fragment attack to defend window (auto-pitch cost 2).
    playCostedAttackToDefend(game, frayingLifeforceRed, {
      attacker: Bravo,
      defender: Dash,
      pitch: [nimblismBlue, nimblismBlue],
    });
    expect(game.combat()?.step).toBe("defend");
    // d2 defend on Fragment attack → fragment event + turn fact.
    fragmentOnce(game, Dash);
    expect(game.committedEvents().some((e) => e.name === "fragment")).toBe(true);
    expect(game.getState().players[Bravo.id]!.history.turn.attackFragmented).toBe(true);

    // Resolve rest of combat so Instant can be activated cleanly.
    passUntilQuiet(game);

    // Instant activate — destroy veil, arm delayed holo.
    Bravo.activate(starfieldVeil);
    passUntilQuiet(game);

    expect(Bravo.zone("head")).not.toContain(starfieldVeil.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(starfieldVeil.canonicalId);

    // Play Instant Aura — delayed enter-arena adds holo.
    Bravo.play(upOnAPedestalBlue);
    passUntilQuiet(game);

    const arena = game.getState().containers.zonesByPlayerId[Bravo.id]!.arena;
    const auraId = arena.find(
      (id) => game.getState().objects[id]?.canonicalId === upOnAPedestalBlue.canonicalId,
    );
    expect(auraId).toBeDefined();
    expect(holoCount(game, auraId!)).toBeGreaterThanOrEqual(1);
  });

  it("boundaries: without fragment this turn, activate is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [starfieldVeil],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    expect(game.getState().players[Bravo.id]!.history.turn.attackFragmented).toBe(false);
    expect(() => Bravo.activate(starfieldVeil)).toThrow();
    expect(Bravo.zone("head")).toContain(starfieldVeil.canonicalId);
  });
});
