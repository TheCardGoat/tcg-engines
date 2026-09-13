import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../weapons/death-dealer.ts";
import { snatchRed } from "./snatch.ts";
import { rustyHarpoonBlue } from "./rusty-harpoon.ts";
import { rapidFireYellow } from "./rapid-fire.ts";

describe("Rapid Fire (ARC047) AAA", () => {
  it("happy: reloads an arrow and the fired arrow refunds an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [rapidFireYellow, rustyHarpoonBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(rapidFireYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expect(Azalea.zone("arsenal")).toContain(rustyHarpoonBlue.canonicalId);

    Azalea.attackWith(rustyHarpoonBlue, { from: "arsenal" });
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(19);
    // Rapid Fire's own go again funds the shot; the granted arrow go again
    // refunds it — the arrow cost no net action point.
    expectFabPlayer(Azalea).toHaveAP(1);
  });

  it("boundary: a non-arrow attack does not gain go again", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [rapidFireYellow, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(rapidFireYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Azalea.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    // Rapid Fire's own go again only — the attack action gained nothing.
    expectFabPlayer(Azalea).toHaveAP(0);
  });

  it("timing: the granted go again expires at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [rapidFireYellow],
        arsenal: [rustyHarpoonBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(rapidFireYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Azalea.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.endTurn();
    game.helpers.untilIdle();

    Azalea.attackWith(rustyHarpoonBlue, { from: "arsenal" });
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(19);
    // next turn's arrow attack spends its action point without a refund.
    expectFabPlayer(Azalea).toHaveAP(0);
  });
});
