import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { terra } from "../heroes/terra.ts";
import { ancientEarthOakRed } from "./ancient-earth-oak.ts";
import { nimblismBlue } from "./nimblism.ts";
import { weaveEarthRed } from "./weave-earth.ts";

/**
 * Ancient Earth Oak (IAR261) — Ice Action - Attack, cost 3, 6{p}.
 *
 * Printed: "When this hits a hero, create a Frostbite token under their
 * control.\nEarth Bond - If an Earth card was pitched to play this, this gets
 * +2{p} and "When this hits a hero, put this on the bottom of its owner's
 * deck.""
 */

describe("Ancient Earth Oak (IAR261) AAA", () => {
  it("happy: Earth Bond grants +2 and a hit creates Frostbite and returns the oak", () => {
    const game = FabTestEngine.start(
      {
        hero: terra,
        hand: [ancientEarthOakRed, weaveEarthRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Terra = game.as(terra);
    const Dash = game.as(dash);

    const oak = Terra.must.pitch(weaveEarthRed).playAttack(ancientEarthOakRed);
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(8);
    Dash.defendWith();
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(12).toHaveTokenCount("frostbite", 1);
    expectFabCard(Terra, oak).toBeIn("deck");
  });

  it("boundary: without an Earth pitch the oak hits at printed 6 and stays gone", () => {
    const game = FabTestEngine.start(
      {
        hero: terra,
        hand: [ancientEarthOakRed, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Terra = game.as(terra);
    const Dash = game.as(dash);

    Terra.must.pitch(nimblismBlue).playAttack(ancientEarthOakRed);
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(6);
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(14).toHaveTokenCount("frostbite", 1);
    expectFabCard(Terra, ancientEarthOakRed).toBeIn("graveyard");
  });

  it("timing: a blocked oak never creates the Frostbite", () => {
    const game = FabTestEngine.start(
      {
        hero: terra,
        hand: [ancientEarthOakRed, weaveEarthRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Terra = game.as(terra);
    const Dash = game.as(dash);

    Terra.must.pitch(weaveEarthRed).playAttack(ancientEarthOakRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(8);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20).toHaveTokenCount("frostbite", 0);
    expectFabCard(Terra, ancientEarthOakRed).toBeIn("graveyard");
  });
});
