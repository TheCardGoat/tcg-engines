import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "./snatch.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { heroicPoseYellow } from "./heroic-pose.ts";
import { flexStrengthRed } from "./flex-strength.ts";

/**
 * Flex Strength (SUP149) — Brute Action - Attack, cost 2, 4{p}, 3{d}.
 *
 * Printed: "If this has 6 or more {p}, it gets +3{p}."
 */

describe("Flex Strength (SUP149) AAA", () => {
  it("boundary: at printed 4{p}, this does not get +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [flexStrengthRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.attackWith(flexStrengthRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("happy: after a +3 next-attack latch (7{p}), this gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [heroicPoseYellow, flexStrengthRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.play(heroicPoseYellow);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    Tuffnut.attackWith(flexStrengthRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(10);
  });

  it("timing: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: rhinar, hand: [flexStrengthRed], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Rhinar = game.as(rhinar);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Rhinar.defendWith([flexStrengthRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Rhinar).toHaveLife(19);
    expectFabCard(Rhinar, flexStrengthRed).toBeIn("graveyard");
  });
});
