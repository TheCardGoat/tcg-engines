import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { jawsOfVictoryRed } from "./jaws-of-victory.ts";

describe("Jaws of Victory (SUP005) AAA", () => {
  it("happy: attacking at less life cheers you and this gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        life: 15,
        hand: [jawsOfVictoryRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.attackWith(jawsOfVictoryRed);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabPlayer(Tuffnut).toHaveAP(1);
  });

  it("boundary: equal life does not cheer and this spends the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        life: 20,
        hand: [jawsOfVictoryRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.attackWith(jawsOfVictoryRed);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Tuffnut).toHaveAP(0);
  });
});
