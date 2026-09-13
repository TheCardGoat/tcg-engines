import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { goldenGrail } from "../weapons/golden-grail.ts";
import { headJabRed } from "./head-jab.ts";
import { headsUpRed } from "./heads-up.ts";

/**
 * Heads Up (AOL014) — Warrior Action, cost 1, go again.
 *
 * Printed: "Your next sword attack this turn gets +3{p} and "When this
 * attacks, if it wagered, it gets dominate."\nGo again"
 *
 * The "if it wagered, it gets dominate" rider is not observable: Gutshot's
 * wager on the same attack resolves as a triggered effect of the same attack
 * event, and Heads Up's event-and-state trigger is evaluated only at event
 * time, before the wager exists (gap: trigger/wagered-state-never-matches-same-attack-wager).
 */

describe("Heads Up (AOL014) AAA", () => {
  it("happy: the next sword attack this turn gets +3", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [headsUpRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(headsUpRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveAP(1); // printed go again

    Bravo.activateAttack(goldenGrail);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(6); // 3 base + printed +3
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("boundary: a non-sword attack does not consume the +3", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [headsUpRed, headJabRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(headsUpRed);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(headJabRed);
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(3); // head jab is not a sword
    Dash.defendWith();
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(17);

    // The latch is still armed for the next sword attack.
    Bravo.activateAttack(goldenGrail);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(6);
    Dash.defendWith();
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(11); // 17 - 6
  });
});
