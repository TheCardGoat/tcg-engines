import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { cindra } from "../heroes/cindra.ts";
import { dash } from "../heroes/dash.ts";
import { pledgeFealtyRed } from "../instants/pledge-fealty.ts";
import { snatchRed } from "../actions/snatch.ts";
import { forTheRealmRed } from "../actions/for-the-realm.ts";
import { flamescaleFurnace } from "./flamescale-furnace.ts";

/**
 * Flamescale Furnace — Draconic Equipment - Chest, d2 Temper.
 *
 * Printed: "Once per Turn Instant - {r}: Gain {r} for each red card in your
 * pitch zone. Activate this ability only if you've played a red card this
 * turn."
 */

describe("Flamescale Furnace (UPR084) AAA", () => {
  it("happy: after playing a red card, gain {r} for each red in the pitch zone", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        chest: [flamescaleFurnace],
        hand: [pledgeFealtyRed],
        pitch: [snatchRed, forTheRealmRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Cindra = game.as(cindra);

    // Play the 0-cost red Instant — satisfies "played a red card this turn".
    Cindra.play(pledgeFealtyRed);
    game.passBoth();

    Cindra.activate(flamescaleFurnace);
    game.helpers.resolveUntilIdle();

    // Paid 1{r}, gained 2{r} (two red cards in the pitch zone): 1 − 1 + 2 = 2.
    expectFabPlayer(Cindra).toHaveResourceCount(2);
    // Temper is not an activation cost — the furnace stays equipped.
    expectFabCard(Cindra, flamescaleFurnace).toBeIn("chest");
  });

  it("boundary: without having played a red card this turn the ability is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        chest: [flamescaleFurnace],
        hand: [],
        pitch: [snatchRed, forTheRealmRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Cindra = game.as(cindra);

    // Red cards sit in the pitch zone, but nothing red was PLAYED this turn.
    Cindra.expectActivationRejected(flamescaleFurnace);
    expectFabPlayer(Cindra).toHaveResourceCount(1);
  });
});
