import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { plungeBlue } from "./plunge.ts";
import { nimblismBlue } from "./nimblism.ts";
import { deadlyDuoRed } from "./deadly-duo.ts";

describe("Deadly Duo (OUT071) AAA", () => {
  it("happy: a hit gives the next base-2-or-less AAC this combat chain +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [deadlyDuoRed, plungeBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(deadlyDuoRed);
    expectCombat(game).toHaveAttackPower(3);
    game.advanceUntil({ stopAt: "resolution", ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(17);

    Katsu.playAttack(plungeBlue);
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: a miss does not raise the next AAC", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [deadlyDuoRed, plungeBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    Katsu.playAttack(deadlyDuoRed);
    Dash.defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(20);

    Katsu.playAttack(plungeBlue);
    expectCombat(game).toHaveAttackPower(1);
  });
});
