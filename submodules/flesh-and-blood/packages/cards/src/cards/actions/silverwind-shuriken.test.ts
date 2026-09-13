import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { whelmingGustwaveRed } from "./whelming-gustwave.ts";
import { snatchRed } from "./snatch.ts";
import { silverwindShurikenBlue } from "./silverwind-shuriken.ts";

/**
 * Silverwind Shuriken (OUT054) — Ninja Shuriken Item blue.
 *
 * Printed AR: Destroy Silverwind Shuriken: Target attack action card with combo
 * gains +1{p}.
 */

describe("Silverwind Shuriken (OUT054) AAA", () => {
  it("happy: destroy this so a combo attack action gains +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        arena: [silverwindShurikenBlue],
        hand: [whelmingGustwaveRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(whelmingGustwaveRed);
    game.toReaction("attacker");
    Katsu.activate(silverwindShurikenBlue);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Katsu, silverwindShurikenBlue).toBeIn("graveyard");
  });

  it("boundary: a non-combo attack action does not gain +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        arena: [silverwindShurikenBlue],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(snatchRed);
    game.toReaction("attacker");
    Katsu.expectActivationRejected(silverwindShurikenBlue);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the +1{p} expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        arena: [silverwindShurikenBlue],
        hand: [whelmingGustwaveRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(whelmingGustwaveRed);
    game.toReaction("attacker");
    Katsu.activate(silverwindShurikenBlue);
    game.closeCombat({ optionals: "decline" });
    Katsu.endTurn();

    expectFabCard(Katsu, whelmingGustwaveRed).toHavePower(3);
  });
});
