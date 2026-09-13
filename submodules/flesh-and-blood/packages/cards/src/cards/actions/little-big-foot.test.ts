import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { disableRed } from "./disable.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { littleBigFootRed } from "./little-big-foot.ts";

/**
 * Little Big Foot (MPG038) — Guardian Action - Attack, cost 4, 3{p}, 3{d}.
 *
 * Printed: "If there are two or more cards with cost 3 or more in your pitch
 * zone, this gets +6{p}."
 */

describe("Little Big Foot family AAA", () => {
  it("happy: two cost-3+ cards in pitch give this +6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [littleBigFootRed],
        pitch: [disableRed, disableRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(littleBigFootRed);

    expectCombat(game).toHaveAttackPower(9);
  });

  it("boundary: one cost-3+ card in pitch leaves printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [littleBigFootRed],
        pitch: [disableRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(littleBigFootRed);

    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: two cost-0 pitch cards do not arm the bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [littleBigFootRed],
        pitch: [nimblismBlue, nimblismBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(littleBigFootRed);

    expectCombat(game).toHaveAttackPower(3);
  });
});
