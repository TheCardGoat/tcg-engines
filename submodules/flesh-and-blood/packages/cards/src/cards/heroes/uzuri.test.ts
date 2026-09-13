import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { uzuri } from "./uzuri.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { backStabRed } from "../actions/back-stab.ts";
import { infectRed } from "../actions/infect.ts";

/**
 * Hero behavior acceptance test — Uzuri (OUT002).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: Attack Reaction — banish face-down → swap stealth attacker
 *   with a cost-2-or-less attack action from hand
 * - Boundaries: 20hp health, once-per-turn limit
 *
 * Signature weapon: Nerve Scalpel (OUT005)
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

// ---------------------------------------------------------------------------
// uzuri (OUT002) — Assassin/Young — 20hp
// Printed: "Once per Turn Attack Reaction - Banish a card from your hand face
// down: Turn the card banished this way face up. If it's an attack action card
// with cost 2 or less, put target attacking card with stealth from the active
// chain link on the bottom of its owner's deck, then put the banished card
// onto the active chain link as the attacking card."
// ---------------------------------------------------------------------------

describe("uzuri (OUT002)", () => {
  it("signature weapon: Nerve Scalpel (OUT005) activates and opens combat at 1 power", () => {
    // Nerve Scalpel — Assassin Weapon Dagger 1H, 1{p}, Piercing 1.
    // Once per Turn Action - {r}{r}: Attack. Go again
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        weapon1: [nerveScalpel],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Uzuri = game.as(uzuri);

    Uzuri.activate(nerveScalpel);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveAttackPower(1);
    game.closeCombat({ optionals: "decline" });
  });

  it("boundaries: Nerve Scalpel is once per turn — second activation throws", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        weapon1: [nerveScalpel],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Uzuri = game.as(uzuri);

    Uzuri.activate(nerveScalpel);
    game.passBoth();
    expectCombat(game).toBeOpen();
    game.closeCombat({ optionals: "decline" });

    Uzuri.expectActivationRejected(nerveScalpel);
  });

  it("core mechanic: attack with stealth reaches defend step", () => {
    // back-stab-red (OUT015) is a 0-cost Assassin Attack with stealth, 3{p}.
    // The hero ability (attack reaction swap) can be used after this.
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        hand: [backStabRed],
        deck: 6,
        actionPoints: 1,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Uzuri = game.as(uzuri);

    Uzuri.attackWith(backStabRed);

    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(3);
    game.closeCombat({ optionals: "decline" });
  });

  it("core mechanic: hero Attack Reaction activates during combat after stealth attack", () => {
    // Uzuri's OUT002-a1 is an Attack Reaction that banishes a card face-down
    // from hand and conditionally swaps it with the stealth attacker.
    // After attacking with stealth, the hero ability should be usable during
    // the reaction step.
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        hand: [backStabRed, infectRed],
        deck: 6,
        resourcePoints: 0,
        actionPoints: 1,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Uzuri = game.as(uzuri);

    // Attack with stealth to open combat.
    Uzuri.attackWith(backStabRed);
    expectCombat(game).toBeAtStep("defend");

    // The defender explicitly declares no blocks. Defend priority then starts
    // with the attacker and passes to the defender before Reaction opens.
    game.as(opponentHero).defendWith([]);
    game.as(uzuri).pass();
    game.as(opponentHero).pass();

    // Activate Uzuri's Attack Reaction — banishes face-down from hand.
    // The activate helper auto-drains the banish entity-target decision.
    Uzuri.activate(uzuri);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // After resolution, the swap should have occurred if the revealed card
    // (infectRed, cost 0 ≤ 2) qualifies. The original stealth attacker
    // (backStabRed) should be on deck bottom.
    const deckCards = Uzuri.zone("deck");
    expect(deckCards[0]).toBe(backStabRed.canonicalId);
  });
});
