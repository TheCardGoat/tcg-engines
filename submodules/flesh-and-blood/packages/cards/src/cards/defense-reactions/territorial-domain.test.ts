import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { zenTamerOfPurpose } from "../heroes/zen-tamer-of-purpose.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { rapidReflexYellow } from "../attack-reactions/rapid-reflex.ts";
import { territorialDomainBlue } from "./territorial-domain.ts";

/**
 * Territorial Domain, Blue (MST163) — Ninja Defense Reaction, 2{d}.
 * Printed: "While this is defending, if you've created a Crouching Tiger this
 * turn, this gets +3{d}."
 * The rider is the created-a-crouching-tiger-this-turn turn-history fact,
 * stamped when the create-token of token:crouching-tiger commits (Zen MST047
 * is the creator; the 6{p} Snatch leg proves the +3{d} on the 40-life hero).
 */

describe("Territorial Domain, Blue (MST163) AAA", () => {
  it("happy: defending after creating a Crouching Tiger this turn blocks down to 1 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, rapidReflexYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: zenTamerOfPurpose, hand: [territorialDomainBlue], chiPoints: 3, deck: 2 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Zen = game.as(zenTamerOfPurpose);

    Dash.playAttack(snatchRed);
    game.toReaction("attacker");
    Dash.must.playReaction(rapidReflexYellow); // 2{p} + 4 = 6{p}
    game.toReaction("defender");

    // The Instant creates the tiger while the link is still live, arming the
    // while-defending rider before damage math.
    Zen.must.playReaction(territorialDomainBlue);

    // The tiger Instant is created while the link is still live; the
    // while-defending rider evaluates at damage calculation.
    Zen.activate(zenTamerOfPurpose);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Zen).toHaveLife(39); // 6{p} vs 2{d} + 3 rider
  });

  it("boundary: without a created Crouching Tiger the plain 2{d} lets 4 damage through", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, rapidReflexYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: zenTamerOfPurpose, hand: [territorialDomainBlue], chiPoints: 3, deck: 2 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Zen = game.as(zenTamerOfPurpose);

    Dash.playAttack(snatchRed);
    game.toReaction("attacker");
    Dash.must.playReaction(rapidReflexYellow); // 2{p} + 4 = 6{p}
    game.toReaction("defender");
    game.helpers.passPriorityTo(Zen);
    Zen.must.playReaction(territorialDomainBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Zen).toHaveLife(36); // 6{p} vs plain 2{d}
  });
});
