import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { seismicStirRed } from "./seismic-stir.ts";

/**
 * Seismic Stir (Red) (EVR030) — Guardian Action.
 *
 * Printed: "Create 3 Seismic Surge tokens.\nGo again"
 *
 * Mode B (fab-rules): CR 5.1 (playing a card requires paying its printed
 * cost), CR 8.6.2 (Seismic Surge token — a token aura with a
 * destroy-ability), CR 7.6.2/go again glossary (the action point is refunded
 * when the card-layer resolves). Behavior constraints: exactly 3 Seismic
 * Surge tokens are created under the player's control on resolution; the
 * fixed cost 2 must be paid; token counts stack across plays.
 */

describe("Seismic Stir (Red) (EVR030) AAA", () => {
  it("happy: paying 2 creates exactly 3 Seismic Surge tokens and refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [seismicStirRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(seismicStirRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 3);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
    expectFabPlayer(Bravo).toHaveAP(1); // go again refund
    expectFabCard(Bravo, seismicStirRed).toBeIn("graveyard");
  });

  it("boundary: with unpayable resources the play is rejected and nothing is created", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [seismicStirRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.play(seismicStirRed)).toThrow();
    expectFabCard(Bravo, seismicStirRed).toBeIn("hand");
    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 0);
    expectFabPlayer(Bravo).toHaveResourceCount(1);
  });

  it("timing: two Stirs in one turn stack 6 Seismic Surge tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [seismicStirRed, seismicStirRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(seismicStirRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 3);

    Bravo.play(seismicStirRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 6);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
    // Each play spent and refunded one action point.
    expectFabPlayer(Bravo).toHaveAP(2);
  });
});
