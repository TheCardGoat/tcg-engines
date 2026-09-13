import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { barragingBigHornRed } from "./barraging-big-horn.ts";

/**
 * Barraging Big Horn Red (CRU010) — Brute Attack Action, 7{p}.
 *
 * Printed: Additional cost — discard a random card.
 * While defended by fewer than 2 non-equipment cards, it has go again.
 */

describe("Barraging Big Horn (CRU010) AAA", () => {
  it("happy: unblocked, go again refunds AP after the random discard", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [barragingBigHornRed, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(barragingBigHornRed);
    expectCombat(game).toHaveAttackPower(7);
    game.as(dash).defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabPlayer(Rhinar).toHaveAP(1);
    expectFabCard(Rhinar, nimblismBlue).toBeIn("graveyard");
  });

  it("boundary: two hand defenders strip go again", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [barragingBigHornRed, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(barragingBigHornRed);
    Dash.defendWith([nimblismBlue, snatchRed]);
    expectCombat(game).notToHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Rhinar).toHaveAP(0);
  });

  it("timing: one hand defender still has go again", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [barragingBigHornRed, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(barragingBigHornRed);
    game.as(dash).defendWith(snatchRed);
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Rhinar).toHaveAP(1);
  });
});
