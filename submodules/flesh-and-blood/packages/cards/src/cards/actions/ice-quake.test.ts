import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { iceQuakeRed } from "./ice-quake.ts";

describe("Ice Quake (ELE151) AAA", () => {
  it("happy: next attack this turn gets +3{p} and a hit creates Frostbite", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [iceQuakeRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(iceQuakeRed);
    game.passBoth();
    Bravo.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(13);
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 1);
  });

  it("boundary: a miss does not create Frostbite", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [iceQuakeRed, snatchRed],
        resourcePoints: 1,
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
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(iceQuakeRed);
    game.passBoth();
    Bravo.playAttack(snatchRed);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 0);
  });

  it("timing: an opposing hit after your turn does not create Frostbite", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [iceQuakeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(iceQuakeRed);
    game.passBoth();
    Bravo.endTurn();
    game.untilIdle();

    Dash.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 0);
  });
});
