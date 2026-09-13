import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { scuttleTheCanalRed } from "./scuttle-the-canal.ts";

/**
 * Scuttle the Canal (HNT047) — Assassin Action - Attack, cost 0, 3{p}. Stealth.
 *
 * Printed: When this attacks a marked hero, this gets go again.
 */

describe("Scuttle the Canal family AAA", () => {
  it("happy: attacking a marked hero grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [scuttleTheCanalRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], marked: true, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(scuttleTheCanalRed);

    expectFabPlayer(game.as(dash)).toBeMarked();
    expectCombat(game).toHaveAttackPower(3).toHaveKeyword("go-again");
  });

  it("boundary: attacking an unmarked hero does not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [scuttleTheCanalRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(scuttleTheCanalRed);

    expectFabPlayer(game.as(dash)).notToBeMarked();
    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("timing: go again refunds AP after the chain against a marked hero", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [scuttleTheCanalRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], marked: true, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(scuttleTheCanalRed);
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });
});
