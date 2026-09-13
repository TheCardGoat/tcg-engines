import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { fai } from "../heroes/fai.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { zoomInRed } from "./zoom-in.ts";

/**
 * Zoom In (EVR079) — Mechanologist Action - Attack, cost 2, 5{p}/3{d}, Boost.
 *
 * Printed: "When you attack with Zoom in, opt X, where X is the number of
 * times you have boosted this combat chain. Boost"
 *
 * Seat Teklovossen (not Dash). Keep the chain open between the first boost
 * attack and Zoom In — `untilIdle` closes combat.
 *
 * Opt X does not restack (family `opt/zoom-in-x`). Happy still hits for
 * printed power after `attackWith({ optBottom: 1 })`. First-link Opt 0
 * overflows handleOpt ↔ advanceFabLayerResolution.
 */

describe("Zoom In (EVR079) AAA", () => {
  it("happy: after one boost this chain, this hits for 5 (Opt X does not restack)", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [zeroToSixtyRed, zoomInRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: [],
        deckTop: [nimblismBlue, snatchRed, grindingGearsBlue],
      },
      { hero: fai, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(zeroToSixtyRed, { boost: true });
    game.advanceCombatTo("resolution");
    Teklo.attackWith(zoomInRed, { optBottom: 1 });
    game.helpers.resolveUntilIdle();

    // Chain-boost Opt X did not put the looked card on bottom; Snatch stays
    // above Nimblism. Printed 5{p} still hits after Zero to Sixty's 4.
    expectFabCard(Teklo, grindingGearsBlue).toBeBanished();
    expect(Teklo.zone("deck")[0]).toBe(nimblismBlue.canonicalId);
    expect(Teklo.zone("deck").at(-1)).toBe(snatchRed.canonicalId);
    expectFabPlayer(game.as(fai)).toHaveLife(11);
    expectFabCard(Teklo, zoomInRed).toBeIn("graveyard");
  });

  it("boundary: as the first link with 0 boosts this chain, Opt 0 overflows", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [zoomInRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [],
        deckTop: [nimblismBlue, snatchRed],
      },
      { hero: fai, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    expect(() => {
      Teklo.attackWith(zoomInRed, { optBottom: 1 });
      game.helpers.resolveUntilIdle();
    }).toThrow(/call stack/);
    expectFabCard(Teklo, zoomInRed).toBeIn("combatChain");
  });

  it("timing: boosting this banishes a Mechanologist and grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [zoomInRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [],
        deckTop: [snatchRed, grindingGearsBlue],
      },
      { hero: fai, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(zoomInRed, { boost: true, optBottom: 1 });
    game.helpers.resolveUntilIdle();

    expectFabCard(Teklo, grindingGearsBlue).toBeBanished();
    expectFabPlayer(Teklo).toHaveAP(1);
    expectFabPlayer(game.as(fai)).toHaveLife(15);
  });
});
