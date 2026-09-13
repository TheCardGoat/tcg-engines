import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { arknightAscendancyRed } from "./arknight-ascendancy.ts";

describe("Arknight Ascendancy (ARC080) AAA", () => {
  it("happy: a hit creates Runechants equal to damage dealt", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [arknightAscendancyRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(arknightAscendancyRed);
    expectCombat(game).toHaveAttackPower(5).toHaveKeyword("dominate");
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 5);
  });

  it("boundary: each controlled Runechant reduces the play cost by {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [arknightAscendancyRed],
        arena: [
          fabToken("runechant"),
          fabToken("runechant"),
          fabToken("runechant"),
          fabToken("runechant"),
          fabToken("runechant"),
          fabToken("runechant"),
        ],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(viserai).attackWith(arknightAscendancyRed);
    expectCombat(game).toBeOpen().toHaveAttackPower(5);
  });

  it("timing: dominate rejects a second hand defender; a miss creates no Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [arknightAscendancyRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.playAttack(arknightAscendancyRed);
    expectCombat(game).toHaveKeyword("dominate");
    expect(Dash.expectBlockRejected([snatchRed, nimblismBlue]).errorCode).toBe("dominate");

    Dash.defendWith(nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 3);
  });
});
