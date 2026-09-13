import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { lightningPressRed } from "../instants/lightning-press.ts";
import { inspireLightningYellow } from "./inspire-lightning.ts";
import { weaveEarthRed } from "./weave-earth.ts";
import { stirTheWildwoodRed } from "./stir-the-wildwood.ts";

/**
 * Stir the Wildwood (ELE082) — Elemental Runeblade Attack, cost 2, 5{p}, 3{d}.
 *
 * Printed: "Earth Fusion. If you have dealt arcane damage to an opposing hero
 * this turn, Stir the Wildwood gains +2{p}. If Stir the Wildwood was fused,
 * it gains +2{p}."
 *
 * Inspire Lightning (ELE089) fused is the same-turn arcane vehicle.
 */

describe("Stir the Wildwood (ELE082) AAA", () => {
  it("happy: fused after dealing arcane this turn is printed 5+2+2", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [inspireLightningYellow, lightningPressRed, stirTheWildwoodRed, weaveEarthRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(inspireLightningYellow, {
      fuse: true,
      fuseCards: [lightningPressRed],
      target: Dash.id,
    });
    game.helpers.resolveUntilIdle();

    Briar.attackWith(stirTheWildwoodRed, {
      fuse: true,
      fuseCards: [weaveEarthRed],
    });

    expectCombat(game).toHaveAttackPower(9);
    expectFabCard(Briar, weaveEarthRed).toBeIn("hand");
    expectFabCard(Briar, lightningPressRed).toBeIn("hand");
  });

  it("boundary: unfused with no arcane this turn stays at printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [stirTheWildwoodRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(briar).attackWith(stirTheWildwoodRed);
    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: fused without arcane this turn is only +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [stirTheWildwoodRed, weaveEarthRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(stirTheWildwoodRed, {
      fuse: true,
      fuseCards: [weaveEarthRed],
    });

    expectCombat(game).toHaveAttackPower(7);
  });
});
