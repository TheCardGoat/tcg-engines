import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { kassai } from "../heroes/kassai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { beastWithinYellow } from "../actions/beast-within.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { willOfTheCrowdBlue } from "./will-of-the-crowd.ts";

/**
 * Will of the Crowd (SUP035) — Revered Block, 2{d}.
 *
 * Printed: "When this defends, if you've been cheered this turn, defending
 * action cards get +3{d} this chain link."
 */

describe("Will of the Crowd (SUP035) AAA", () => {
  it("happy: cheered defender's defending action cards get +3{d} this chain link", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: tuffnut,
        hand: [willOfTheCrowdBlue, nimblismBlue],
        deckTop: [beastWithinYellow], // 6{p} pitch satisfies Tuffnut's cheer
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: kassai },
    );
    const Kassai = game.as(kassai);
    const Tuffnut = game.as(tuffnut);

    // Cheer Tuffnut during Kassai's action phase, then block his attack.
    game.helpers.passPriorityTo(Tuffnut);
    Tuffnut.activate(tuffnut); // pitch top (6{p} Beast Within) — the crowd cheers
    game.untilIdle();

    Kassai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend", optionals: "decline" });
    Tuffnut.defendWith(willOfTheCrowdBlue, nimblismBlue);
    game.passBoth();

    expectFabCard(Tuffnut, willOfTheCrowdBlue).toHaveDefense(2);
    expectFabCard(Tuffnut, nimblismBlue).toHaveDefense(5);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // 4 power vs the Block's 2{d} plus the Action card's boosted 5{d}.
    expectFabPlayer(Tuffnut).toHaveLife(20);
  });

  it("boundary: not cheered this turn, the printed 2{d} only", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: tuffnut,
        hand: [willOfTheCrowdBlue],
        deckTop: [beastWithinYellow],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: kassai },
    );
    const Kassai = game.as(kassai);
    const Tuffnut = game.as(tuffnut);

    Kassai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Tuffnut.defendWith(willOfTheCrowdBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // 4 power vs 2{d} — 2 damage.
    expectFabPlayer(Tuffnut).toHaveLife(18);
  });
});
