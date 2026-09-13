import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { harmonizedKodachi } from "../weapons/harmonized-kodachi.ts";
import { nimblismBlue } from "./nimblism.ts";
import { plungeRed } from "./plunge.ts";

describe("Plunge family AAA", () => {
  it("happy: a hit gives the next dagger attack this turn +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        weapon1: [harmonizedKodachi],
        hand: [plungeRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(plungeRed);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat({ ordering: "listed", optionals: "decline" });
    expectFabPlayer(game.as(dash)).toHaveLife(17);

    Katsu.activateAttack(harmonizedKodachi);
    expectCombat(game).toHaveAttackPower(2);
  });

  it("boundary: a miss does not raise the next dagger attack", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        weapon1: [harmonizedKodachi],
        hand: [plungeRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    Katsu.playAttack(plungeRed);
    Dash.defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat({ ordering: "listed", optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(20);

    Katsu.activateAttack(harmonizedKodachi);
    expectCombat(game).toHaveAttackPower(1);
  });
});
