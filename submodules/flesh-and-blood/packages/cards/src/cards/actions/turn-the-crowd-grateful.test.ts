import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { kayoStrongArm } from "../heroes/kayo-strong-arm.ts";
import { turnTheCrowdGratefulRed } from "./turn-the-crowd-grateful.ts";

/**
 * Turn the Crowd Grateful (SUP049) — Revered Action - Attack, cost 3, 7{p}/2{d}.
 *
 * Printed: When this attacks a Reviled hero, +1{p}. When this hits a Reviled
 * hero, the crowd cheers you.
 */

describe("Turn the Crowd Grateful family AAA", () => {
  it("happy: attacking a Reviled hero is 8{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [turnTheCrowdGratefulRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: kayoStrongArm, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.playAttack(turnTheCrowdGratefulRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: attacking Dash stays 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [turnTheCrowdGratefulRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.playAttack(turnTheCrowdGratefulRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(7);
  });

  it("timing: hitting a Reviled hero cheers (Tuffnut mints Toughness)", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [turnTheCrowdGratefulRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: kayoStrongArm, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.playAttack(turnTheCrowdGratefulRed);
    game.closeCombat({ optionals: "decline" });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 1);
  });
});
