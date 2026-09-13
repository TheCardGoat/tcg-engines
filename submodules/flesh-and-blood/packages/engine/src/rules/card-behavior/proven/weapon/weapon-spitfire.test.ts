/**
 * SEA007 Spitfire — Mechanologist Gun 2H — power 2.
 *
 * Printed:
 *   a1: Action - {t}, {t} a cog you control: Attack
 *   a2: When this attacks, you may {t} a cog you control. If you do,
 *       the attack gets +1{p}.
 *
 * Status: 🟡→✅ — a1 proven @ weapon-final-pending; a2 proven here:
 * optional tap-a-cog accept → 2+1 = 3 damage; decline → 2; no untapped
 * cog → no +1; and the attack trigger is scoped to THIS weapon's own
 * attack (subject:self — MST159 khakkara pattern), so a controller's
 * attack-action play with a cog in arena does NOT fire the optional.
 * Card fix: a2 trigger gains `subject:"self"`.
 * Rides proven tap-cog (SEA009 rust-belt) + optional.then paths.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { fabToken } from "../../../../testing/test-fixtures.ts";

import { spitfire } from "../../../../../../cards/src/cards/weapons/spitfire.ts";

const LIFE = 40;

/** Drain to quiescence; booleans answer `accept`; entity-targets pick first. */
function drain(game: ReturnType<typeof FabTestEngine.start>, accept = true): void {
  for (let s = 0; s < 96; s += 1) {
    const d = game.getState().decision;
    if (d?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: d.actorId,
        payload: {
          decisionId: d.decisionId,
          stateVersion: d.stateVersion,
          answer: { kind: "boolean", value: accept },
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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
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

function untappedCogs(game: ReturnType<typeof FabTestEngine.start>): string[] {
  return Object.values(game.getState().objects)
    .filter(
      (object) =>
        object.canonicalId === "token:golden-cog" &&
        !object.markers.some((marker) => marker.kind === "tapped"),
    )
    .map((object) => object.instanceId);
}

describe("spitfire (SEA007)", () => {
  it("a2 happy: accept the optional → tap a second cog → 2+1 = 3 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [spitfire],
        // Two cogs: one pays a1's tap-a-cog cost, the second feeds a2.
        arena: [fabToken("golden-cog"), fabToken("golden-cog")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    const lifeBefore = Bravo.life();

    Dash.activate(spitfire);
    drain(game, true); // accept the a2 optional → tap a cog → +1{p}

    expect(Bravo.life()).toBe(lifeBefore - 3);
    // a1 tapped one cog (cost); a2 tapped the second (accept path).
    expect(untappedCogs(game)).toHaveLength(0);
  });

  it("a2 boundary: decline the optional → base 2 damage, second cog stays untapped", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [spitfire],
        arena: [fabToken("golden-cog"), fabToken("golden-cog")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    const lifeBefore = Bravo.life();

    Dash.activate(spitfire);
    drain(game, false); // decline a2

    expect(Bravo.life()).toBe(lifeBefore - 2);
    // a1 cost tapped exactly one cog; a2 declined → the other stays untapped.
    expect(untappedCogs(game)).toHaveLength(1);
  });

  it("a2 boundary: no second untapped cog → no +1", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [spitfire],
        arena: [fabToken("golden-cog")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    const lifeBefore = Bravo.life();

    Dash.activate(spitfire);
    drain(game, true); // accept is moot — a1 already tapped the only cog

    expect(Bravo.life()).toBe(lifeBefore - 2);
  });

  it("a2 boundary: attack-action play does NOT fire Spitfire's attack trigger", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [spitfire],
        hand: [snatchRed],
        arena: [fabToken("golden-cog")],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    const lifeBefore = Bravo.life();

    // Play Snatch (a non-weapon attack action). The a2 trigger is scoped to
    // the weapon's own attack (subject:self) → no optional, no +1.
    Dash.attackWith(snatchRed);
    drain(game, true);

    expect(Bravo.life()).toBe(lifeBefore - 4); // Snatch base 4, no buff
    expect(untappedCogs(game)).toHaveLength(1); // cog never tapped by a2
  });
});
