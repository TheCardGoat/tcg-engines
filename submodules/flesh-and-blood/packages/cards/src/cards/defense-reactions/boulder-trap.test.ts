import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { fai } from "../heroes/fai.ts";
import { ironrotGauntlet } from "../equipment/ironrot-gauntlet.ts";
import { rapidReflexYellow } from "../attack-reactions/rapid-reflex.ts";
import { snatchRed } from "../actions/snatch.ts";
import { boulderTrapYellow } from "./boulder-trap.ts";

/**
 * Boulder Trap (OUT106) — Ranger Defense Reaction Trap.
 *
 * Printed: When this defends an attack with {p} greater than its base, put a
 * -1{d} counter on an equipment the attacking hero controls.
 *
 * Rapid Reflex must resolve before the trap. The defend trigger is a second
 * layer (Drag Down): passBoth the DR onto the chain, then resolve the trigger.
 * Attacker is Fai so Rapid Reflex is class-legal; equipment is Generic Ironrot
 * Gauntlet.
 */

describe("Boulder Trap (OUT106) family behavior AAA", () => {
  it("happy: defending an above-base attack puts a -1{d} counter on attacker equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        arms: [ironrotGauntlet],
        hand: [snatchRed, rapidReflexYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, hand: [boulderTrapYellow], deck: 6 },
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
    Azalea.must.playReaction(boulderTrapYellow);
    game.passBoth();
    Azalea.target(ironrotGauntlet);
    game.passBoth();

    expectFabCard(Azalea, boulderTrapYellow).toBeIn("combatChain");
    expectFabCard(Fai, ironrotGauntlet).toHaveDefenseCounters(-1);
  });

  it("boundary: defending an attack at its printed base {p} puts no -1{d} counter", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        arms: [ironrotGauntlet],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, hand: [boulderTrapYellow], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    game.as(fai).playAttack(snatchRed);
    game.toReaction("defender");
    Azalea.must.playReaction(boulderTrapYellow);
    game.passBoth();
    game.passBoth();

    expectFabCard(Azalea, boulderTrapYellow).toBeIn("combatChain");
    expectFabCard(game.as(fai), ironrotGauntlet).toHaveDefenseCounters(0);
  });
});
