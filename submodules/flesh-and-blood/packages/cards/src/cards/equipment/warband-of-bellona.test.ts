import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { engulfingLightYellow } from "../actions/engulfing-light.ts";
import { warbandOfBellona } from "./warband-of-bellona.ts";

/**
 * Warband of Bellona (EVO247) — Light Warrior Equipment - Head.
 *
 * Printed: Action - {r}{r}, destroy this: The next time you attack this turn,
 * you may charge your hero's soul. If a yellow card is charged this way, draw
 * a card. Go again. Temper.
 */

describe("Warband of Bellona (EVO247) AAA", () => {
  it("happy: the next attack charges a yellow card into the soul and draws", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: boltyn,
        head: [warbandOfBellona],
        hand: [snatchRed, engulfingLightYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: boltyn },
    );
    const Boltyn = game.as(boltyn);

    Boltyn.activate(warbandOfBellona);
    game.untilIdle();

    // Destroy-self as the cost; go again refunds the action point.
    expectFabPlayer(Boltyn).toHaveAP(1);
    expectFabCard(Boltyn, warbandOfBellona).toBeIn("graveyard");

    Boltyn.playAttack(snatchRed, { optionals: "accept" });

    // Snatch left the hand, Engulfing Light was charged into the soul (and it
    // is yellow, so the follow-up draw refills the hand to one card).
    expect(Boltyn.zone("soul")).toContain(engulfingLightYellow.canonicalId);
    expectFabPlayer(Boltyn).toHaveHandCount(1);
    game.as(dash).defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: declining the charge draws no card", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: boltyn,
        head: [warbandOfBellona],
        hand: [snatchRed, engulfingLightYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: boltyn },
    );
    const Boltyn = game.as(boltyn);

    Boltyn.activate(warbandOfBellona);
    game.untilIdle();

    Boltyn.playAttack(snatchRed, { optionals: "decline" });

    expect(Boltyn.zone("soul")).not.toContain(engulfingLightYellow.canonicalId);
    expectFabPlayer(Boltyn).toHaveHandCount(1);
    expectFabCard(Boltyn, engulfingLightYellow).toBeIn("hand");
  });
});
