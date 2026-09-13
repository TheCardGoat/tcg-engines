import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zen } from "../heroes/zen.ts";
import { spiritOfChristmasBlue } from "./spirit-of-christmas.ts";
import { snatchRed } from "./snatch.ts";
import { fluidMotionBlue } from "./fluid-motion.ts";

/**
 * Fluid Motion (PEN269) — Mystic Action - Attack, cost 0, 2{p}, 3{d}.
 * Printed: "If you've created a card this turn, this gets go again."
 */

describe("Fluid Motion (PEN269) AAA", () => {
  it("happy: after creating a card this turn, this gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [spiritOfChristmasBlue, fluidMotionBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(spiritOfChristmasBlue);
    game.untilIdle({ entityTargets: "minimum" });
    Zen.attackWith(fluidMotionBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: without creating a card this turn, this does not have go again", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [fluidMotionBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(zen).attackWith(fluidMotionBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).notToHaveKeyword("go-again");
    expectCombat(game).toHaveAttackPower(2);
  });

  it("timing: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: zen, hand: [fluidMotionBlue], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Zen = game.as(zen);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Zen.defendWith([fluidMotionBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Zen).toHaveLife(19);
    expectFabCard(Zen, fluidMotionBlue).toBeIn("graveyard");
  });
});
