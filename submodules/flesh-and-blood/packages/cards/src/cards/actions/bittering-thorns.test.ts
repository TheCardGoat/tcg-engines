import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { bitteringThornsRed } from "./bittering-thorns.ts";

describe("Bittering Thorns (TCC083) AAA", () => {
  it("happy: a hit gives the next attack this turn +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [bitteringThornsRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(bitteringThornsRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ ordering: "listed", optionals: "decline" });
    expectFabPlayer(game.as(dash)).toHaveLife(16);

    Katsu.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: a miss does not raise the next attack's power", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [bitteringThornsRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    Katsu.playAttack(bitteringThornsRed);
    Dash.defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat({ ordering: "listed", optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(20);

    Katsu.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });
});
