import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { jinglewoodSmashHit } from "./jinglewood-smash-hit.ts";

/**
 * Jinglewood Smash Hit (TCC050) — Bard Weapon Fiddle 2H 2{p}.
 *
 * Printed: Once per Turn Action - {r}{r}{r}: Target opposing hero chooses and
 * creates a Might, Quicken, or Vigor token. You create a Copper token. Go again.
 * Action - 0: Attack. When this hits, destroy it.
 */

describe("Jinglewood Smash Hit (TCC050) AAA", () => {
  it("happy: pay {r}{r}{r} so the opponent mints a token and you mint Copper", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [jinglewoodSmashHit],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(jinglewoodSmashHit);
    game.passBoth();
    Dash.choose("might");
    game.helpers.resolveUntilIdle({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveTokenCount("might", 1);
    expectFabPlayer(Bravo).toHaveTokenCount("copper", 1);
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: once-per-turn blocks a second token-minting activation", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [jinglewoodSmashHit],
        hand: [],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(jinglewoodSmashHit);
    game.passBoth();
    Dash.choose("vigor");
    game.helpers.resolveUntilIdle({ optionals: "decline" });

    Bravo.expectActivationRejected(jinglewoodSmashHit);
  });

  it("timing: the 0-cost attack hits and then destroys this", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [jinglewoodSmashHit],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(jinglewoodSmashHit);
    expectCombat(game).toHaveAttackPower(2);
    game.closeCombat();
    expectFabCard(Bravo, jinglewoodSmashHit).toBeIn("graveyard");
    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });
});
