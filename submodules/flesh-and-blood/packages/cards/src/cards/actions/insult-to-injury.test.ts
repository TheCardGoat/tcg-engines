import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { insultToInjuryRed } from "./insult-to-injury.ts";

/**
 * Insult to Injury (PEN303) — Reviled Action - Attack, cost 0, 3{p}/3{d}.
 *
 * Printed: When this attacks a hero, if you have more {h} than them, this
 * gets go again.
 */

describe("Insult to Injury family AAA", () => {
  it("happy: attacking a hero with less life grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [insultToInjuryRed],
        actionPoints: 1,
        life: 21,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(insultToInjuryRed);

    expectCombat(game).toHaveAttackPower(3).toHaveKeyword("go-again");
  });

  it("boundary: equal life does not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [insultToInjuryRed],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(insultToInjuryRed);

    expectCombat(game).toHaveAttackPower(3).notToHaveKeyword("go-again");
  });

  it("timing: go again refunds AP after the chain", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [insultToInjuryRed],
        actionPoints: 1,
        life: 21,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(insultToInjuryRed);
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });
});
