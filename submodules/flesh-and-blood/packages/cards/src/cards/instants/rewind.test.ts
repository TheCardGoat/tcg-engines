import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { dash } from "../heroes/dash.ts";
import { energyPotionBlue } from "../actions/energy-potion.ts";
import { snatchRed } from "../actions/snatch.ts";
import { rewindBlue } from "./rewind.ts";

/**
 * Rewind (UPR169) — Wizard Instant, cost 1.
 *
 * Printed: "Negate target 'non-attack' action card and return it to its
 * owner's hand. Then that hero gains 1 action point."
 *
 * FAB_MANUAL_HARNESS `play()` leaves the layer on the stack so Rewind can
 * target it. Attack actions are not legal targets.
 */

describe("Rewind (UPR169) AAA", () => {
  it("happy: negate a non-attack action, return it to hand, and that hero gains 1 AP", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [energyPotionBlue, rewindBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.play(energyPotionBlue);
    expectFabCard(Kano, energyPotionBlue).toBeIn("stack");
    expectFabPlayer(Kano).toHaveAP(0);

    Kano.must.playInstant(rewindBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Kano, energyPotionBlue).toBeIn("hand");
    expectFabCard(Kano, rewindBlue).toBeIn("graveyard");
    expectFabPlayer(Kano).toHaveAP(1);
  });

  it("boundary: an attack action is not a legal Rewind target", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [snatchRed, rewindBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.playAttack(snatchRed);
    expect(() => Kano.must.playInstant(rewindBlue)).toThrow();
    expectFabCard(Kano, rewindBlue).toBeIn("hand");
    expectCombat(game).toBeOpen();
  });

  it("timing: the negated action's owner — not the Rewind controller — gains the AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [energyPotionBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: kano,
        hand: [rewindBlue],
        resourcePoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Kano = game.as(kano);

    Dash.play(energyPotionBlue);
    Dash.pass();
    Kano.must.playInstant(rewindBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Dash, energyPotionBlue).toBeIn("hand");
    expectFabCard(Kano, rewindBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveAP(1);
    expectFabPlayer(Kano).toHaveAP(0);
  });
});
