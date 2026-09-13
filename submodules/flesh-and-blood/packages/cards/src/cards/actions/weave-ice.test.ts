import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { oldhim } from "../heroes/oldhim.ts";
import { dash } from "../heroes/dash.ts";
import { blizzardBlue } from "../instants/blizzard.ts";
import { snowUnderRed } from "./snow-under.ts";
import { winterSGraspRed } from "./winter-s-grasp.ts";
import { snatchRed } from "./snatch.ts";
import { weaveIceRed } from "./weave-ice.ts";

/**
 * Weave Ice, Red (ELE154) — Ice Action, cost 0, 2{d}, go again.
 * Printed: "The next Ice or Elemental attack action card you play this turn
 * gains +3{p}. If it's fused, it gains dominate. Go again"
 *
 * The fused-dominate clause is authored as a static on Weave Ice itself
 * (binding "it"), not as a grant on the next fused Ice/Elemental AAC — pin
 * the missing dominate; the +3{p} latch is public.
 */

describe("Weave Ice (ELE154) AAA", () => {
  it("happy: the next Ice attack action gets +3{p} and Weave Ice refunds its AP", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [weaveIceRed, winterSGraspRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    expectFabPlayer(Oldhim).toHaveAP(1);
    Oldhim.play(weaveIceRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Oldhim).toHaveAP(1);
    expectFabCard(Oldhim, weaveIceRed).toBeIn("graveyard");

    Oldhim.playAttack(winterSGraspRed);
    game.advanceCombatTo("defend");
    // Winter's Grasp printed 6 + 3 = 9.
    expectCombat(game).toHaveAttackPower(9);
  });

  it("boundary: a Generic attack action does not get +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [weaveIceRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    Oldhim.play(weaveIceRed);
    game.helpers.resolveUntilIdle();
    Oldhim.playAttack(snatchRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("synergy: a fused Ice/Elemental attack gets +3{p} and dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [weaveIceRed, snowUnderRed, blizzardBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    Oldhim.play(weaveIceRed);
    game.helpers.resolveUntilIdle();
    Oldhim.attackWith(snowUnderRed, { fuse: true, fuseCards: [blizzardBlue] });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(10);
    expectCombat(game).toHaveKeyword("dominate");
    expectFabCard(Oldhim, blizzardBlue).toBeIn("hand");
  });
});
