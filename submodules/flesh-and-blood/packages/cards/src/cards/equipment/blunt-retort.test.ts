import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { bravo } from "../heroes/bravo.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { oathOfSteelRed } from "../actions/oath-of-steel.ts";
import { bluntRetort } from "./blunt-retort.ts";

/**
 * Blunt Retort (MPW013) — Warrior Head, Blade Break.
 * Printed: "When this defends a weapon attack, you may remove a +1{p}
 * counter from the weapon."
 * Oath of Steel puts the printed +1{p} counter on the attacking Dawnblade.
 */

describe("Blunt Retort (MPW013) AAA", () => {
  it("happy: removing the counter from the attacking weapon blunts the hit", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [oathOfSteelRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, head: [bluntRetort], life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);
    const Bravo = game.as(bravo);

    Dori.play(oathOfSteelRed);
    game.helpers.resolveUntilIdle();

    Dori.activate(dawnblade);
    game.advanceCombatTo("defend");
    Bravo.defendWith(bluntRetort);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabCard(Dori, dawnblade).toHavePower(3);
    // Attack 3 after the removal, minus this head's printed 1{d}.
    expectFabPlayer(Bravo).toHaveLife(18);
  });

  it("boundary: declining leaves the counter and the full 4 damage lands", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [oathOfSteelRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, head: [bluntRetort], life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);
    const Bravo = game.as(bravo);

    Dori.play(oathOfSteelRed);
    game.helpers.resolveUntilIdle();

    Dori.activate(dawnblade);
    game.advanceCombatTo("defend");
    Bravo.defendWith(bluntRetort);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dori, dawnblade).toHavePower(4);
    // Full 4-power hit minus this head's printed 1{d}.
    expectFabPlayer(Bravo).toHaveLife(17);
  });
});
