import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { fai } from "../heroes/fai.ts";
import { rapidReflexYellow } from "../attack-reactions/rapid-reflex.ts";
import { snatchRed } from "../actions/snatch.ts";
import { inertiaTrapRed } from "./inertia-trap.ts";

/**
 * Inertia Trap (OUT173) — Assassin / Ranger Defense Reaction Trap.
 *
 * Printed: When this defends an attack with {p} greater than its base, create
 * an Inertia token under the attacking hero's control.
 *
 * Rapid Reflex must resolve before the trap: `toReaction("defender")` after a
 * stacked AR does not empty the stack (already at reaction).
 */

describe("Inertia Trap (OUT173) family behavior AAA", () => {
  it("happy: defending an attack with {p} greater than its base creates Inertia under the attacking hero", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed, rapidReflexYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, hand: [inertiaTrapRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Azalea = game.as(azalea);

    Fai.playAttack(snatchRed);
    game.toReaction("attacker");
    Fai.must.playReaction(rapidReflexYellow);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(6);

    game.toReaction("defender");
    Azalea.must.playReaction(inertiaTrapRed);
    game.passBoth();
    game.passBoth();

    expectFabCard(Azalea, inertiaTrapRed).toBeIn("combatChain");
    expectFabPlayer(Fai).toHaveTokenCount("inertia", 1);
  });

  it("boundary: defending an attack at its printed base {p} creates no Inertia", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [inertiaTrapRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    game.as(fai).playAttack(snatchRed);
    game.toReaction("defender");
    Azalea.must.playReaction(inertiaTrapRed);
    game.passBoth();
    game.passBoth();

    expectFabCard(Azalea, inertiaTrapRed).toBeIn("combatChain");
    expectFabPlayer(game.as(fai)).toHaveTokenCount("inertia", 0);
  });
});
