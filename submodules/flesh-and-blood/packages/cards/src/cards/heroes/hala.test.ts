import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { ironrotHelm } from "../equipment/ironrot-helm.ts";
import { hala } from "./hala.ts";

/**
 * Hero behavior acceptance test — Hala (MPW004).
 *
 * Implements the per-hero AAA requirements from HEROES.md:
 * - Core mechanic: pay 3 RP + tap → sharpen target sword (+1{p} counter), go again
 * - Core interaction: sharpened sword attacks with increased power
 * - Boundaries: non-sword equipment excluded from sharpen target
 *
 * Compatible weapons: Durendal (MPW008), Golden Grail (MPW007), Dawnblade (TEA003)
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// hala (MPW004) — Warrior/Young — 20hp
// Printed: "Action - {r}{r}{r}, {t}: Sharpen target sword you control. Go again"
// ---------------------------------------------------------------------------

describe("hala (MPW004)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start({ hero: hala, deck: 6 }, { hero: opponentHero, deck: 6 });
    expectFabPlayer(game.as(hala)).toHaveLife(20);
  });

  it("core mechanic: pay 3 RP + tap → sharpen sword, +1{p} counter, go again refunds AP", () => {
    // HEROES.md hala core — CR 8.5.58: sharpen puts a +1{p} counter on the
    // sword, marks it sharpened-this-turn, and go again refunds the AP.
    const game = FabTestEngine.start(
      {
        hero: hala,
        weapon1: [dawnblade],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Hala = game.as(hala);

    expectFabCard(Hala, dawnblade).toHavePower(3);

    // Act — activate Hala's sharpen ability, then select the sword target.
    Hala.activate(hala);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: dawnblade.canonicalId,
      entityTargets: "minimum",
      ordering: "listed",
      optionalBoolean: false,
    });

    // Assert — sharpen put a +1{p} counter on the sword (3 → 4) and go again
    // refunded the AP (−1 + 1 = 1).
    expectFabCard(Hala, dawnblade).toHavePower(4);
    expect(Hala.actionPoints()).toBe(1);
    expect(Hala.resourcePoints()).toBe(0);
  });

  it("core interaction: sharpened sword attacks with +1 power", () => {
    // Sharpen Dawnblade (base 3) → power 4 on attack.
    const game = FabTestEngine.start(
      {
        hero: hala,
        weapon1: [dawnblade],
        resourcePoints: 4, // 3 for sharpen + 1 for weapon attack
        actionPoints: 2, // 1 for sharpen Action + 1 for weapon attack
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Hala = game.as(hala);
    const Opponent = game.as(opponentHero);

    // Act — sharpen Dawnblade.
    Hala.activate(hala);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: dawnblade.canonicalId,
      entityTargets: "minimum",
      ordering: "listed",
      optionalBoolean: false,
    });
    expectFabCard(Hala, dawnblade).toHavePower(4);

    // Act — attack with the sharpened Dawnblade.
    Hala.activate(dawnblade);
    game.helpers.resolveRestOfCombat();

    // Assert — Dawnblade base 3 + 1 counter = 4 damage.
    expect(Opponent.life()).toBe(16); // 20 − 4
  });

  it("boundaries: non-sword equipment is not a legal sharpen target", () => {
    // Ironrot Helm is equipment but not a Sword — the sharpen filter
    // (subtypes:["Sword"]) must exclude it. Only Dawnblade gets the counter.
    const game = FabTestEngine.start(
      {
        hero: hala,
        weapon1: [dawnblade],
        head: [ironrotHelm],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Hala = game.as(hala);

    // Act — activate Hala; the engine will only offer Sword candidates.
    Hala.activate(hala);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: dawnblade.canonicalId,
      entityTargets: "minimum",
      ordering: "listed",
      optionalBoolean: false,
    });

    // Assert — only the sword received the sharpen counter; helm untouched.
    expectFabCard(Hala, dawnblade).toHavePower(4);
    expectFabCard(Hala, ironrotHelm).toHaveCounters(0);
  });

  it("core mechanic: go again from sharpen enables a follow-up weapon attack same turn", () => {
    // The go again keyword on Hala's sharpen lets the player attack with the
    // sharpened sword in the same turn using the refunded action point.
    const game = FabTestEngine.start(
      {
        hero: hala,
        weapon1: [dawnblade],
        resourcePoints: 4, // 3 for sharpen + 1 for weapon attack
        actionPoints: 1,
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Hala = game.as(hala);
    const Opponent = game.as(opponentHero);

    // Act — sharpen, then attack with the sharpened sword.
    Hala.activate(hala);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: dawnblade.canonicalId,
      entityTargets: "minimum",
      ordering: "listed",
      optionalBoolean: false,
    });

    // Go again refunded AP; weapon is still ready (sharpen taps hero, not weapon).
    expect(Hala.actionPoints()).toBe(1);

    // Act — attack with sharpened Dawnblade (power 4).
    Hala.activate(dawnblade);
    game.helpers.resolveRestOfCombat();

    // Assert — follow-up attack landed.
    expect(Opponent.life()).toBe(16); // 20 − 4
  });

  it("boundaries: sharpen costs 3 RP — cannot activate without sufficient resources", () => {
    const game = FabTestEngine.start(
      {
        hero: hala,
        weapon1: [dawnblade],
        resourcePoints: 2, // only 2 RP — 1 short of the 3 RP cost
        actionPoints: 1,
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Hala = game.as(hala);

    // Act — insufficient resources should cause the activation to be rejected.
    Hala.expectActivationRejected(hala);
  });
});
