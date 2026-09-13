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
import { turnTheCrowdHatefulRed } from "./turn-the-crowd-hateful.ts";

/**
 * Turn the Crowd Hateful (SUP114) — Reviled Action - Attack, cost 3, 5{p}/2{d}.
 *
 * Printed: When this attacks a Revered hero, +3{p}. When this hits a Revered
 * hero, the crowd boos you.
 */

describe("Turn the Crowd Hateful family AAA", () => {
  it("happy: attacking a Revered hero is 8{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoStrongArm,
        hand: [turnTheCrowdHatefulRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: tuffnut, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoStrongArm);

    Kayo.playAttack(turnTheCrowdHatefulRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: attacking Dash stays 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoStrongArm,
        hand: [turnTheCrowdHatefulRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoStrongArm);

    Kayo.playAttack(turnTheCrowdHatefulRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: hitting a Revered hero boos (Kayo mints Vigor)", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoStrongArm,
        hand: [turnTheCrowdHatefulRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: tuffnut, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoStrongArm);

    Kayo.playAttack(turnTheCrowdHatefulRed);
    game.closeCombat({ optionals: "decline" });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Kayo).toHaveTokenCount("vigor", 1);
  });
});
