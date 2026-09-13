import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fryRed } from "./fry.ts";
import { lightningPressRed } from "../instants/lightning-press.ts";
import { brutalAssaultBlue, briar } from "../shared/test-recipients.ts";
import { entwineLightningRed } from "./entwine-lightning.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { weaveEarthRed } from "./weave-earth.ts";

/**
 * Weave Earth, Red (ELE122) — Earth Action, cost 0, 2{d}, go again.
 *
 * Printed: "The next Earth or Elemental attack action card you play this turn
 * gains +3{p}. If it's fused, instead it gains +4{p}. Go again."
 *
 * The unfused +3 latch is public. The fused instead is a sibling static on
 * Weave Earth itself (`selector: "self"`, binding `"it"`) so it never replaces
 * the next-attack amount — pin the unfused +3 on a fused Elemental attack.
 */

describe("Weave Earth family AAA", () => {
  it("happy: the next Earth attack action gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [weaveEarthRed, autumnSTouchBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(weaveEarthRed);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(autumnSTouchBlue);
    game.advanceCombatTo("defend");

    // Autumn's Touch printed 5 + 3 = 8.
    expectCombat(game).toHaveAttackPower(8);
    expectFabCard(Briar, weaveEarthRed).toBeIn("graveyard");
  });

  it("boundary: a Generic attack does not get +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [weaveEarthRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(weaveEarthRed);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(brutalAssaultBlue);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: a Lightning-only attack does not get +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [weaveEarthRed, fryRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(weaveEarthRed);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(fryRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(3);
  });

  it("happy: a fused Elemental attack gets +4{p} instead of +3", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [weaveEarthRed, entwineLightningRed, lightningPressRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(weaveEarthRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Briar).toHaveAP(1);
    Briar.attackWith(entwineLightningRed, {
      fuse: true,
      fuseCards: [lightningPressRed],
    });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(8);
    expectFabCard(Briar, lightningPressRed).toBeIn("hand");
  });
});
