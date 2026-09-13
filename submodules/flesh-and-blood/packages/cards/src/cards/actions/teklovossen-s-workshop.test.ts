import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dissipationShieldYellow } from "./dissipation-shield.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { fai } from "../heroes/fai.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { teklovossenSWorkshopRed } from "./teklovossen-s-workshop.ts";

/**
 * Teklovossen's Workshop (CRU115) — Mechanologist Action, cost 0, 3{d}.
 *
 * Printed: "Opt X, where X is the number of times you have boosted this turn.
 * Reveal the top card of your deck. If it's a Mechanologist item card with
 * cost 2 or less, put it into the arena."
 *
 * Engine-primitive `opt/boost-count-stack-overflow`: Opt X (boosts this
 * turn/chain) loops handleOpt ↔ advanceFabLayerResolution. Unplayable.
 * Seat Teklovossen (not Dash).
 */

describe("Teklovossen's Workshop (CRU115) AAA", () => {
  it("happy: after boosting this turn, playing this overflows on Opt X", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [zeroToSixtyRed, teklovossenSWorkshopRed],
        resourcePoints: 0,
        actionPoints: 2,
        deck: [],
        deckTop: [dissipationShieldYellow, grindingGearsBlue],
      },
      { hero: fai, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(zeroToSixtyRed, { boost: true });
    game.helpers.resolveRestOfCombat();
    expect(() => {
      Teklo.play(teklovossenSWorkshopRed, { optBottom: 1 });
      game.helpers.resolveUntilIdle();
    }).toThrow(/call stack/);
    expectFabCard(Teklo, teklovossenSWorkshopRed).toBeIn("stack");
  });

  it("boundary: with 0 boosts this turn, playing this overflows on Opt X", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [teklovossenSWorkshopRed],
        actionPoints: 1,
        deck: [],
        deckTop: [dissipationShieldYellow],
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    expect(() => {
      Teklo.play(teklovossenSWorkshopRed, { optBottom: 1 });
      game.helpers.resolveUntilIdle();
    }).toThrow(/call stack/);
    expectFabCard(Teklo, teklovossenSWorkshopRed).toBeIn("stack");
  });

  it("timing: with an empty deck, playing this overflows on Opt X", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [teklovossenSWorkshopRed],
        actionPoints: 1,
        deck: [],
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    expect(() => {
      Teklo.play(teklovossenSWorkshopRed, { optBottom: 1 });
      game.helpers.resolveUntilIdle();
    }).toThrow(/call stack/);
    expectFabCard(Teklo, teklovossenSWorkshopRed).toBeIn("stack");
  });
});
