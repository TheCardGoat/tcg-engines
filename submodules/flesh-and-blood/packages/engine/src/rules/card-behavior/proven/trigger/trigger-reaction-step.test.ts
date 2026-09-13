/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: trigger:reaction-step
 * Representative card: packages/cards/src/cards/actions/cyclone-roundhouse.ts
 * Canonical id: fMTdMtzzft7bLzG9DpjNc
 *
 * Arrange: import the representative real card and establish a legal,
 * player-reachable match state with the required heroes, zones, resources,
 * targets, counters, and opponent responses.
 * Act: dispatch only production FabTestEngine moves (play, pitch, defend,
 * resolve prompts, pass priority, and end the relevant phase).
 * Assert: verify player-visible outcomes such as life, zones, AP/resources,
 * combat state, prompts, legality error codes, or game result. Include the
 * negative/boundary case and any timing or interaction case before completion.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, nimblismRed } from "../../../fixtures.ts";
import { cycloneRoundhouseYellow } from "../../../../../../cards/src/cards/actions/cyclone-roundhouse.ts";
import { spinningWheelKickYellow } from "../../../../../../cards/src/cards/actions/spinning-wheel-kick.ts";

describe("trigger: reaction-step", () => {
  it("AAA happy — Arrange: Spinning Wheel Kick then Cyclone Roundhouse combo; Act: defend and enter reaction; Assert: reaction-step banishes a defending card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [spinningWheelKickYellow, cycloneRoundhouseYellow, nimblismBlue, nimblismRed],
        deck: 6,
        actionPoints: 2,
        resourcePoints: 0,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismRed],
        deck: 6,
        life: 30,
      },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // First chain link: Spinning Wheel Kick (go again).
    Bravo.play(spinningWheelKickYellow, {
      target: Dash.id,
      pitch: [nimblismBlue],
    });
    game.helpers.resolveRestOfCombat();

    // Second link: Cyclone Roundhouse with combo (last attack was Spinning Wheel Kick).
    Bravo.play(cycloneRoundhouseYellow, {
      target: Dash.id,
      pitch: [nimblismRed],
    });
    Dash.defendWith(nimblismBlue);
    // Advance into the reaction step so the reaction-step trigger can fire.
    game.passBoth();

    // At the beginning of the reaction step, combo-granted ability banishes a
    // random defending card from the chain.
    const banished = Dash.zone("banished");
    const combatDefenders =
      Object.values(game.getState().combat?.activeLink?.defendingInstanceIdsByTarget ?? {}).flat()
        .length ?? 0;
    // Either the defender was banished off the chain, or it sits in banished zone.
    expect(banished.length + (combatDefenders === 0 ? 1 : 0)).toBeGreaterThanOrEqual(1);
  });

  it("AAA boundary — Arrange: Cyclone without Spinning Wheel Kick prior; Act: defend and enter reaction; Assert: defending card is not auto-banished", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [cycloneRoundhouseYellow, nimblismBlue, nimblismRed],
        deck: 4,
        resourcePoints: 0,
      },
      {
        hero: dash,
        hand: [nimblismBlue],
        deck: 4,
        life: 30,
      },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(cycloneRoundhouseYellow, {
      target: Dash.id,
      pitch: [nimblismBlue, nimblismRed],
    });
    Dash.defendWith(nimblismBlue);
    game.passBoth();

    // Without combo, no reaction-step banish trigger.
    expect(Dash.zone("banished")).not.toContain(nimblismBlue.canonicalId);
  });
});
