import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { zyggy } from "../heroes/zyggy.ts";
import { holoShieldBlue } from "./holo-shield.ts";
import { holoShieldRed } from "./holo-shield.ts";
import { waningVengeanceRed } from "./waning-vengeance.ts";
import { blurRealityBlue } from "./blur-reality.ts";

/**
 * Blur Reality (AZS025) — Lightning Illusionist Instant, cost 0.
 *
 * Printed text (i18n, source of truth):
 * "Banish a Lightning aura permanent you control with no holo counters,
 * then return it to the arena with a holo counter."
 *
 * /fab-rules Mode B handoff (behavior constraints):
 * - Target filter: a permanent you control that is BOTH Lightning AND an
 *   aura AND currently carries no holo counters (three conjunctive filters).
 * - The chosen aura is banished, then immediately returned to the arena
 *   with exactly one holo counter added (a zone round-trip, not a destroy).
 * - Instant timing: playable in reaction windows, including the defend step
 *   of an opponent's attack (CR 1.9, 4.2).
 *
 * Module verdict: the authored `banish -> move-card -> add-counter`
 * sequence implements the printed behavior faithfully — full green trio.
 */

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Blur Reality (AZS025) AAA", () => {
  it("banishes a holo-free Lightning aura, returns it, and seats one holo counter on it", () => {
    const game = FabTestEngine.start(
      { hero: zyggy, hand: [blurRealityBlue], arena: [holoShieldBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      manual,
    );
    const Zyggy = game.as(zyggy);

    Zyggy.play(blurRealityBlue);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: holoShieldBlue.canonicalId });

    // Round trip: back in the arena, never left ownership, one holo counter.
    expect(Zyggy.zone("arena")).toContain(holoShieldBlue.canonicalId);
    expect(Zyggy.zone("banished")).not.toContain(holoShieldBlue.canonicalId);
    expectFabCard(Zyggy, holoShieldBlue).toHaveCounters(1, "holo");
    expect(Zyggy.zone("graveyard")).toContain(blurRealityBlue.canonicalId);
  });

  it("target filter: an aura that already has a holo counter, and a non-Lightning aura, are not legal targets", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggy,
        hand: [blurRealityBlue],
        arena: [
          { card: holoShieldBlue, state: { namedCounters: { holo: 1 } } },
          holoShieldRed,
          waningVengeanceRed,
        ],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      manual,
    );
    const Zyggy = game.as(zyggy);

    Zyggy.play(blurRealityBlue);
    // The only legal target is the holo-free Lightning aura (red shield).
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: holoShieldRed.canonicalId,
    });

    // The red shield got the new holo counter; the already-holo'd blue
    // shield was untouched (still exactly 1); the Mystic aura never
    // qualified.
    expectFabCard(Zyggy, holoShieldRed).toHaveCounters(1, "holo");
    expectFabCard(Zyggy, holoShieldBlue).toHaveCounters(1, "holo");
    expectFabCard(Zyggy, waningVengeanceRed).toHaveCounters(0, "holo");
    expect(Zyggy.zone("arena")).toContain(waningVengeanceRed.canonicalId);
  });

  it("instant timing: resolves during the defend step of an opponent's attack", () => {
    // Seat the attacker as player-1: actions are only legal on your own
    // turn, while instants are legal from the defender's reaction window.
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: zyggy, hand: [blurRealityBlue], arena: [holoShieldBlue], deck: 6 },
      manual,
    );
    const Zyggy = game.as(zyggy);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    // Defender window: declare no blockers, then take the reaction window
    // once the attacker passes priority back.
    Zyggy.defendWith();
    Dash.pass();
    Zyggy.play(blurRealityBlue);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: holoShieldBlue.canonicalId });

    // The mid-defend-step counter is observable through ward: Snatch (4{p})
    // resolves, the holo'd shield (ward 2) prevents 2 and destroys itself.
    // Ward would only be 1 without the counter, leaking 3 damage instead.
    expect(Zyggy.zone("arena")).not.toContain(holoShieldBlue.canonicalId);
    expect(Zyggy.zone("graveyard")).toContain(holoShieldBlue.canonicalId);
    expect(Zyggy.zone("graveyard")).toContain(blurRealityBlue.canonicalId);
    expect(Zyggy.life()).toBe(18); // 20 - (4 - 2 ward prevention)
    expect(Dash.zone("graveyard")).toContain(snatchRed.canonicalId);
  });
});
