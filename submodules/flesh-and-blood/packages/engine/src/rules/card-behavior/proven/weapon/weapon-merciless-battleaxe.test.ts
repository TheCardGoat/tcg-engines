/**
 * DYN068 Merciless Battleaxe — Warrior Axe 2H — power 3, OVERPOWER (printed).
 *
 * Printed:
 *   a1: Once per Turn Action - {r}{r}{r}: Attack
 *   a2: When this attacks, if the attack's {p} is greater than twice its
 *       base, the attack gets overpower.
 *
 * Reasoning (hand-authored):
 * 1. a1 (3{r} 3{p} OPT attack) proven @ weapon-guardian-brute; this file
 *    proves the a2 threshold gate (negative + exact-threshold sides).
 * 2. NEW engine branch `power-greater-than-twice-base` (live power vs 2×
 *    printed base — same primitive as Unsheathed ROS248's granted ability).
 * 3. Threshold: base 3 → 2× base = 6 → power must be > 6 (7+). The 1v1 card
 *    pool caps pre-attack buffs at +3 (SEA183 swiftstrike +2 in Arms +
 *    bittering-thorns hit-grant +1; braveforge/SUP125 conflict on the Arms
 *    seat; attack-reactions resolve after the attack event, too late for
 *    this trigger; no base-power modifiers exist) — the 7+ happy path needs
 *    a +4 pre-attack buff that no current card provides → §7 OPEN row.
 * 4. Proven here: unbuffed 3{p} ≤ 6 → NO overpower (deck untouched on hit);
 *    buffed to exactly 6{p} (SEA183 +2 + bittering-thorns +1) → still NOT
 *    greater than 6 → NO overpower. The gate is fail-closed correct.
 *
 * Status: 🟡 a1 + a2 threshold boundaries proven; a2 positive (7+ {p} →
 * OVERPOWER) OPEN §7 (needs a +4 pre-attack buff; primitive shared with
 * Unsheathed).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue } from "../../../fixtures.ts";

import { mercilessBattleaxe } from "../../../../../../cards/src/cards/weapons/merciless-battleaxe.ts";
import { swiftstrikeBracers } from "../../../../../../cards/src/cards/equipment/swiftstrike-bracers.ts";
import { bitteringThornsBlue } from "../../../../../../cards/src/cards/actions/bittering-thorns.ts";

const LIFE = 40;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "ordering", orderedIds: decision.entries.map((entry) => entry.id) },
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
          answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
        },
      });
      continue;
    }
    if (decision && game.answerForcedDecision()) continue;
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

describe("merciless-battleaxe (DYN068)", () => {
  it("a1: 3{r} → 3-power attack; a2 unbuffed 3{p} ≤ 6 → no overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [mercilessBattleaxe],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();
    const deckBefore = Opp.zone("deck").length;

    Bravo.activate(mercilessBattleaxe);
    game.helpers.resolveRestOfCombat();

    expect(Opp.life()).toBe(lifeBefore - 3);
    // 3 ≤ 2×3 → a2 does not grant overpower → no banish on the hit.
    expect(Opp.zone("deck").length).toBe(deckBefore);
  });

  it("a1 boundary: 2{r} is insufficient → activation illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [mercilessBattleaxe],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.activate(mercilessBattleaxe)).toThrow();
  });

  it("a2 exact-threshold boundary: buffed to exactly 6{p} (2× base) → STILL no overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [mercilessBattleaxe],
        arms: [swiftstrikeBracers],
        hand: [nimblismBlue, bitteringThornsBlue],
        resourcePoints: 4,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();
    const deckBefore = Opp.zone("deck").length;

    // +2: play Nimblism (gate) then destroy Swiftstrike Bracers.
    Bravo.play(nimblismBlue);
    drain(game);
    Bravo.activate(swiftstrikeBracers);
    drain(game);
    // +1: Bittering Thorns hits → next attack +1{p}.
    Bravo.attackWith(bitteringThornsBlue);
    drain(game);

    // Battleaxe: 3 + 2 + 1 = 6 {p} = exactly 2× base — "greater than" fails
    // → no overpower → deck untouched despite the hit.
    Bravo.activate(mercilessBattleaxe);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 8); // 2 (thorns) + 6 (axe)
    expect(Opp.zone("deck").length).toBe(deckBefore);
  });
});
