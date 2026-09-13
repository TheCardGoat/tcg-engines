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
import { thickHideHunterYellow } from "./thick-hide-hunter.ts";

/**
 * Thick Hide Hunter Yellow (HNT246) — Brute Attack Action.
 *
 * Printed: When this attacks or defends, discard a random card.
 */

describe("Thick Hide Hunter (HNT246) AAA", () => {
  it("happy: attacking with one other card in hand discards that card", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [thickHideHunterYellow, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(thickHideHunterYellow);
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toBeOpen();
    expectFabCard(Rhinar, nimblismBlue).toBeIn("graveyard");
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("boundary: defending with this discards a random card from the defender's hand", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: rhinar,
        hand: [thickHideHunterYellow, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Rhinar = game.as(rhinar);

    Dash.playAttack(snatchRed);
    Rhinar.defendWith(thickHideHunterYellow);
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    expectFabCard(Rhinar, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Rhinar, thickHideHunterYellow).toBeIn("graveyard");
  });
});
