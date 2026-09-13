/**
 * DTD200 Scowling Flesh Bag — Brute Head d2 Blade Break.
 *
 * Printed:
 *   When this defends, intimidate.
 *   Blade Break
 *
 * Model (after fix):
 *   static triggered defend subject:self → intimidate opponent
 *   + bladeBreak keyword
 *
 * Reasoning:
 * 1. "When this defends" needs subject:self so co-defenders / other defend
 *    events while the bag is still equipped do not fire intimidate.
 * 2. Intimidate (CR 8.5.10): random face-down banish from opponent's hand with
 *    return-at-end-phase; empty hand is a no-op.
 * 3. Blade Break destroys the head after it defends (d2 block still applies).
 * 4. Negative: defending with another card alone leaves the bag equipped and
 *    does not intimidate.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue, sigilOfSolaceRed } from "../../../fixtures.ts";
import { scowlingFleshBag } from "../../../../../../cards/src/cards/equipment/scowling-flesh-bag.ts";

const SNATCH = 4;
const LIFE = 20;
const DEF = 2;

describe("scowling-flesh-bag (DTD200)", () => {
  it("core mechanic: defend → intimidate opponent + bladeBreak", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, nimblismBlue, sigilOfSolaceRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        head: [scowlingFleshBag],
        hand: [],
        deck: 6,
        life: LIFE,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(dash);
    const Defender = game.as(bravo);

    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    // After play: 2 cards left in attacker's hand.
    expect(Attacker.handCount()).toBe(2);
    Defender.defendWith(scowlingFleshBag);
    game.helpers.resolveRestOfCombat();

    // Intimidate: one random hand card banished face-down (return later).
    expect(Attacker.zone("banished").length).toBe(1);
    expect(game.getState().players[Attacker.id]!.intimidatedInstanceIds).toHaveLength(1);

    // Blade Break: head destroyed to GY.
    expect(Defender.zone("head")).not.toContain(scowlingFleshBag.canonicalId);
    expect(Defender.zone("graveyard")).toContain(scowlingFleshBag.canonicalId);

    // Blocked for d2: snatch 4 − 2 = 2 damage.
    expect(Defender.life()).toBe(LIFE - (SNATCH - DEF));
  });

  it("boundaries: empty opponent hand → intimidate no-ops; still bladeBreaks", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed], // only the attack — hand empty after play
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        head: [scowlingFleshBag],
        hand: [],
        deck: 6,
        life: LIFE,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(dash);
    const Defender = game.as(bravo);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(scowlingFleshBag);
    game.helpers.resolveRestOfCombat();

    expect(game.getState().players[Attacker.id]!.intimidatedInstanceIds).toHaveLength(0);
    expect(Defender.zone("graveyard")).toContain(scowlingFleshBag.canonicalId);
    expect(Defender.life()).toBe(LIFE - (SNATCH - DEF));
  });

  it("boundaries: other hand defender alone → bag does not intimidate (subject:self)", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, sigilOfSolaceRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        head: [scowlingFleshBag],
        // nimblismBlue is an Action with defense 2 — legal hand defender.
        hand: [nimblismBlue],
        deck: 6,
        life: LIFE,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(dash);
    const Defender = game.as(bravo);

    Attacker.attackWith(snatchRed);
    // Defend with hand Action alone — bag stays on head.
    Defender.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    expect(Defender.zone("head")).toContain(scowlingFleshBag.canonicalId);
    expect(game.getState().players[Attacker.id]!.intimidatedInstanceIds).toHaveLength(0);
  });
});
