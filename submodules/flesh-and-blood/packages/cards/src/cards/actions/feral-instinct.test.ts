import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { bloodrushBellowYellow } from "./bloodrush-bellow.ts";
import { smashWithBigTreeRed } from "./smash-with-big-tree.ts";
import { feralInstinctYellow } from "./feral-instinct.ts";

/**
 * Feral Instinct, Yellow (OMN229) — Brute Attack Action.
 *
 * Printed: "If you've intimidated an opponent this turn, this costs {r}{r}{r}
 * less to play." (cost 3, 6{p}, 3{d})
 */

describe("Feral Instinct (OMN229) AAA", () => {
  it("happy: after intimidating this turn, this costs 0{r} and attacks for 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bloodrushBellowYellow, smashWithBigTreeRed, feralInstinctYellow],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [smashWithBigTreeRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(bloodrushBellowYellow);
    game.helpers.resolveUntilIdle();
    Rhinar.attackWith(feralInstinctYellow);
    // Bloodrush Bellow's next-attack buff is still on; printed base is 6{p}.
    expectCombat(game).toHaveAttackPower(8);
    expectFabPlayer(Rhinar).toHaveResourceCount(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(12);
  });

  it("boundary: without intimidate this turn, 0{r} cannot pay the printed 3{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [feralInstinctYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    expect(() => Rhinar.attackWith(feralInstinctYellow)).toThrow();
    expectFabCard(Rhinar, feralInstinctYellow).toBeIn("hand");
  });

  it("timing: paying the printed 3{r} without intimidate still attacks at 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [feralInstinctYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.attackWith(feralInstinctYellow);
    expectCombat(game).toHaveAttackPower(6);
    expectFabPlayer(Rhinar).toHaveResourceCount(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });
});
