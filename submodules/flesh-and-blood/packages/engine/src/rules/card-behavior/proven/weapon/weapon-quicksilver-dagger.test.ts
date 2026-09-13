/**
 * DYN069 Quicksilver Dagger — Warrior Dagger 1H — power 1.
 *
 * Printed:
 *   a1: Once per Turn Action - {r}: Attack
 *   a2: If another weapon you control has gained go again this turn, this
 *       card's attacks get go again.
 *
 * Reasoning (hand-authored):
 * 1. a1 (1{p} OPT attack) rides the standard weapon-attack path; this file
 *    proves the a2 conditional go-again clause.
 * 2. a2: continuous static gated on NEW engine fact
 *    `playerWeaponInstancesGainedGoAgainThisTurn` — a per-player array of
 *    weapon instanceIds whose attacks produced a go-again event this turn.
 *    The has-status branch `another-weapon-gained-go-again-this-turn`
 *    returns true when ANY weapon OTHER than the source gained go again.
 *    NEW reusable fact (family: "another weapon X this turn" gates).
 * 3. Vehicle for the other-weapon go-again: Harmonized Kodachi (KSU003,
 *    weapon2) with a cost-0 card (Snatch) in the pitch zone — the kodachi's
 *    a2 continuous grants go again, the combat resolution produces a
 *    go-again event, and the fact captures it.
 * 4. Happy: kodachi attack (go again, AP refund) → quicksilver attack
 *    (condition met, go again, AP refund). Boundary: no cost-0 in pitch →
 *    kodachi no go again → quicksilver no go again → AP 0.
 *
 * Status: ✅ a2 conditional go-again proven; no-other-weapon boundary.
 * NEW engine fact: playerWeaponInstancesGainedGoAgainThisTurn.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, unmovableRed } from "../../../fixtures.ts";

import { quicksilverDagger } from "../../../../../../cards/src/cards/weapons/quicksilver-dagger.ts";
import { harmonizedKodachi } from "../../../../../../cards/src/cards/weapons/harmonized-kodachi.ts";

const LIFE = 40;

describe("quicksilver-dagger (DYN069)", () => {
  it("a2: another weapon gained go again → quicksilver gets go again (AP refund)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [quicksilverDagger],
        weapon2: [harmonizedKodachi],
        pitch: [snatchRed],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    // Kodachi: go-again from cost-0 pitch → AP refund.
    Bravo.activate(harmonizedKodachi);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 1);
    expect(Bravo.actionPoints()).toBe(1); // refunded

    // Quicksilver: a2 condition "another weapon gained go again" met →
    // grants go again → AP refund.
    Bravo.activate(quicksilverDagger);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 2);
    expect(Bravo.actionPoints()).toBe(1); // refunded again
  });

  it("a2 boundary: no other weapon gained go again → quicksilver no buff", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [quicksilverDagger],
        weapon2: [harmonizedKodachi],
        // cost-3 Unmovable — does not satisfy kodachi's cost-0 pitch gate.
        pitch: [unmovableRed],
        hand: [],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Opp = game.as(dash);
    const lifeBefore = Opp.life();

    // Kodachi: no go again (cost-3 pitch fails the gate).
    Bravo.activate(harmonizedKodachi);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 1);
    expect(Bravo.actionPoints()).toBe(1); // not refunded

    // Quicksilver: no go again (condition not met).
    Bravo.activate(quicksilverDagger);
    game.helpers.resolveRestOfCombat();
    expect(Opp.life()).toBe(lifeBefore - 2);
    expect(Bravo.actionPoints()).toBe(0); // spent
  });
});
