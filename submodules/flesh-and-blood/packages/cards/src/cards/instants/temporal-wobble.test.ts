import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { energyPotionBlue } from "../actions/energy-potion.ts";
import { snatchRed } from "../actions/snatch.ts";
import { futureSightRed } from "./future-sight.ts";
import { temporalWobbleRed } from "./temporal-wobble.ts";

/**
 * Temporal Wobble (PEN112) — Wizard Instant, cost 0.
 *
 * Printed: Negate target non-attack action card with cost less than the number
 * of aura permanents you control with Sigil in their name. Its controller gains
 * 1 action point.
 *
 * FAB_MANUAL_HARNESS `play()` leaves the layer on the stack so Temporal Wobble
 * can target it. The cost filter is Sigil-count in arena (Future Sight makes 3).
 */

describe("Temporal Wobble (PEN112) AAA", () => {
  it("happy: with three Sigil of Fate tokens, negate a cost-0 non-attack action and that hero gains 1 AP", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [futureSightRed, energyPotionBlue, temporalWobbleRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.must.playInstant(futureSightRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Blaze).toHaveTokenCount("sigil-of-fate", 3);

    Blaze.play(energyPotionBlue);
    expectFabCard(Blaze, energyPotionBlue).toBeIn("stack");
    expectFabPlayer(Blaze).toHaveAP(0);

    Blaze.must.playInstant(temporalWobbleRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Blaze, energyPotionBlue).toBeIn("graveyard");
    expectFabCard(Blaze, temporalWobbleRed).toBeIn("graveyard");
    expectFabPlayer(Blaze).toHaveAP(1);
  });

  it("boundary: without Sigil auras a cost-0 non-attack action is not a legal negate target", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [energyPotionBlue, temporalWobbleRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(energyPotionBlue);
    expectFabUnplayable(() => Blaze.must.playInstant(temporalWobbleRed));
    expectFabCard(Blaze, temporalWobbleRed).toBeIn("hand");
    expectFabCard(Blaze, energyPotionBlue).toBeIn("stack");
  });

  it("timing: cannot negate an attack that has already become a chain link", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [snatchRed, temporalWobbleRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.playAttack(snatchRed);
    expect(() => Blaze.must.playInstant(temporalWobbleRed)).toThrow();
    expectFabCard(Blaze, temporalWobbleRed).toBeIn("hand");
    expectCombat(game).toBeOpen();
  });
});
