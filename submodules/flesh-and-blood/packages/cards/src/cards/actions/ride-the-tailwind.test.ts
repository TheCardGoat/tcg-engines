import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { iraCrimsonHaze } from "../heroes/ira-crimson-haze.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimbleStrikeBlue } from "./nimble-strike.ts";
import { rideTheTailwindRed } from "./ride-the-tailwind.ts";

/**
 * Ride the Tailwind, Red (EVR044) — Ninja Attack, cost 0, 3{p}.
 * Printed: When this hits, the next attack action card with 2 or less base {p}
 * you play this combat chain gains go again. Go again.
 */

describe("Ride the Tailwind (EVR044) AAA", () => {
  it("happy: a hit grants go again to the next base-{p}≤2 attack action this chain", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        hand: [rideTheTailwindRed, nimbleStrikeBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 40, deck: 6 },
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.playAttack(rideTheTailwindRed);
    game.advanceCombatTo("resolution");
    expectFabPlayer(game.as(bravo)).toHaveLife(37);

    Ira.playAttack(nimbleStrikeBlue);
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: a next attack with more than 2 base {p} does not gain go again", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        hand: [rideTheTailwindRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 40, deck: 6 },
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.playAttack(rideTheTailwindRed);
    game.advanceCombatTo("resolution");
    Ira.playAttack(brutalAssaultBlue);
    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("timing: a miss does not grant go again to a later base-{p}≤2 attack", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        hand: [rideTheTailwindRed, nimbleStrikeBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [brutalAssaultBlue], life: 40, deck: 6 },
    );
    const Ira = game.as(iraCrimsonHaze);
    const Bravo = game.as(bravo);

    Ira.playAttack(rideTheTailwindRed);
    Bravo.defendWith(brutalAssaultBlue);
    game.advanceCombatTo("resolution");
    expectFabPlayer(Bravo).toHaveLife(40);

    Ira.playAttack(nimbleStrikeBlue);
    expectCombat(game).notToHaveKeyword("go-again");
  });
});
