import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { dash } from "../heroes/dash.ts";
import { stormStriders } from "./storm-striders.ts";
import { zapYellow } from "../actions/zap.ts";

/**
 * Storm Striders (ARC116) — Wizard Equipment - Legs, Arcane Barrier 2.
 *
 * Printed: "Instant - {r}, destroy Storm Striders: You may play your next
 * Wizard non-attack action card this turn as though it were an instant."
 */
describe("Storm Striders (ARC116) AAA", () => {
  it("happy: with no action points left, the Wizard non-attack action still plays as an instant", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        legs: [stormStriders],
        hand: [zapYellow],
        resourcePoints: 2,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    // {r}, destroy: arm the instant window (the Instant itself needs no AP).
    Kano.activate(stormStriders);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    expectFabCard(Kano, stormStriders).toBeIn("graveyard");

    // Zap is a Wizard non-attack action — playable as an instant with 0 AP.
    Kano.play(zapYellow, { target: Dash.id });
    game.passBoth();

    expectFabCard(Kano, zapYellow).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("boundary: without the striders the same Zap at 0 AP cannot be played", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [zapYellow],
        resourcePoints: 2,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    expectFabUnplayable(() => Kano.play(zapYellow), /action-point|couldn't be played/i);
    expectFabCard(Kano, zapYellow).toBeIn("hand");
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: declining the optional keeps the instant window closed", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        legs: [stormStriders],
        hand: [zapYellow],
        resourcePoints: 2,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.activate(stormStriders);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabUnplayable(() => Kano.play(zapYellow), /action-point|couldn't be played/i);
    expectFabCard(Kano, zapYellow).toBeIn("hand");
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
