/**
 * WTR116 Braveforge Bracers — Warrior Arms d2 Battleworn.
 *
 * Printed:
 *   Once per turn Action - {r}: Your next weapon attack this turn gains +1{p}.
 *   Activate this ability only if a weapon you control has hit this turn.
 *   Go again
 *
 * Reasoning (hand-authored):
 * 1. Activated Action — {r} cost; layerKeywords [goAgain] refunds AP; OPT
 *    (limit count 1 per turn).
 * 2. Gate: has-status `a-weapon-you-control-has-hit-this-turn` — already
 *    wired (playerWeaponHit fact; AHA003 anticipating-gaze family).
 * 3. CARD MODEL FIX: the next-attack aura filtered subtypes:["Weapon"] —
 *    Weapon is a type-line token (FAB_TYPES), and the attack object for a
 *    weapon attack carries the weapon's TYPES, so subtypes never matched
 *    (§7 wordFilter('weapon') family). Fixed to types:["Weapon"]
 *    (gallantry-gold proven shape). The aura consumes the NEXT weapon attack
 *    only (count defaults to 1).
 * 4. Happy path: dagger 1 hits → activate → dagger 2 (next weapon attack)
 *    attacks at 1+1 = 2.
 *
 * Status: ✅ weapon hit → {r} → next weapon attack +1{p} + go again; no-hit
 * gate closed; OPT second-activate illegal.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";

import { braveforgeBracers } from "../../../../../../cards/src/cards/equipment/braveforge-bracers.ts";
import { quicksilverDagger } from "../../../../../../cards/src/cards/weapons/quicksilver-dagger.ts";
import { harmonizedKodachi } from "../../../../../../cards/src/cards/weapons/harmonized-kodachi.ts";

const LIFE = 40;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
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
          answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
        },
      });
      continue;
    }
    if (decision && game.answerForcedDecision()) continue;
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

describe("braveforge-bracers (WTR116)", () => {
  it("core: weapon hit → {r} activate → next weapon attack gets +1{p}; go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [braveforgeBracers],
        weapon1: [quicksilverDagger],
        weapon2: [harmonizedKodachi],
        hand: [],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    // Attack 1: quicksilver dagger hits (undefended) — opens the weapon-hit gate.
    Bravo.activate(quicksilverDagger);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 1);

    // Activate the bracers: {r} + go again refunds AP; stays seated.
    Bravo.activate(braveforgeBracers);
    drain(game);
    expect(Bravo.zone("arms")).toContain(braveforgeBracers.canonicalId);
    expect(Bravo.actionPoints()).toBe(1);

    // Attack 2: the NEXT weapon attack (harmonized kodachi, base 1) gets +1 → 2.
    Bravo.activate(harmonizedKodachi);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 3);
  });

  it("boundary: activate illegal before any weapon hit this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [braveforgeBracers],
        weapon1: [quicksilverDagger],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.activate(braveforgeBracers)).toThrow();
    expect(Bravo.zone("arms")).toContain(braveforgeBracers.canonicalId);
  });

  it("boundary: once per turn — second activation illegal after a hit", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [braveforgeBracers],
        weapon1: [quicksilverDagger],
        hand: [],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    // Weapon hit opens the gate.
    Bravo.activate(quicksilverDagger);
    game.helpers.resolveRestOfCombat();

    Bravo.activate(braveforgeBracers);
    drain(game);

    // OPT: the second activation in the same turn is illegal (RP still
    // available — 4 - 1 - 1 = 2 — so the throw is the limit, not the cost).
    expect(() => Bravo.activate(braveforgeBracers)).toThrow();
  });
});
