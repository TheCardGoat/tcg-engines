import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { dash } from "../heroes/dash.ts";
import { krakenSAethervein } from "./kraken-s-aethervein.ts";

/**
 * Kraken's Aethervein (EVR121) — Wizard Weapon Staff 2H.
 *
 * Printed: Once per Turn Instant - {r}{r}{r}: Deal 1 arcane damage to target
 * opposing hero. Draw a card for each arcane damage dealt this way.
 */

describe("Kraken's Aethervein (EVR121) AAA", () => {
  it("happy: pay {r}{r}{r} to deal 1 arcane and draw 1", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        weapon1: [krakenSAethervein],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.activate(krakenSAethervein);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(game.as(dash)).toHaveLife(19);
    expectFabPlayer(Kano).toHaveHandCount(1);
    expectFabPlayer(Kano).toHaveResourceCount(0);
  });

  it("boundary: once-per-turn blocks a second activation with {r} remaining", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        weapon1: [krakenSAethervein],
        hand: [],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.activate(krakenSAethervein);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    Kano.expectActivationRejected(krakenSAethervein);
    expectFabPlayer(game.as(dash)).toHaveLife(19);
  });

  it("boundary: unpayable {r}{r}{r} cost is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        weapon1: [krakenSAethervein],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(kano).expectActivationRejected(krakenSAethervein);
  });
});
