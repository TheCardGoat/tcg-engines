import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { weaveEarthRed } from "./weave-earth.ts";
import { snatchRed } from "./snatch.ts";
import { entwineEarthRed } from "./entwine-earth.ts";

/**
 * Entwine Earth (ELE094) — "Earth Fusion. If Entwine Earth was fused, it
 * gains +2{p}." Printed 6{p}.
 */

describe("Entwine Earth family AAA", () => {
  it("happy: fused Entwine Earth is 8{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [entwineEarthRed, weaveEarthRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(entwineEarthRed, { fuse: true, fuseCards: [weaveEarthRed] });
    expectCombat(game).toHaveAttackPower(8); // printed 6 + fused 2
    expectFabCard(Briar, weaveEarthRed).toBeIn("hand");
  });

  it("boundary: unfused Entwine Earth stays at printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [entwineEarthRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(briar).attackWith(entwineEarthRed);
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: a non-Earth fuse card is rejected before the play", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [entwineEarthRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    expect(() =>
      Briar.attackWith(entwineEarthRed, { fuse: true, fuseCards: [snatchRed] }),
    ).toThrow();
    expectFabCard(Briar, entwineEarthRed).toBeIn("hand");
  });

  it("timing: fused +2{p} flows into combat damage", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [entwineEarthRed, weaveEarthRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(briar).attackWith(entwineEarthRed, { fuse: true, fuseCards: [weaveEarthRed] });
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(12); // 20 - 8
  });
});
