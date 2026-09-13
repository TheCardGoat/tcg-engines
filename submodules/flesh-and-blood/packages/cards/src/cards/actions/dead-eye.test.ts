import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { deathDealer, searingShotRed, brutalAssaultBlue } from "../shared/test-recipients.ts";
import { deadEyeYellow } from "./dead-eye.ts";

/**
 * Dead Eye (DYN155) — Ranger Action, cost 1, 3{d}, go again.
 *
 * Printed: "Your next arrow attack this turn gains +3{p}. If it has an aim
 * counter, it gains \"When this hits a hero, look at their hand and choose a
 * card. They discard it.\" Go again"
 *
 * The +3 latch and aim-counter look/discard grant both use `appliesTo.next`
 * on the next Arrow with an aim counter.
 */

describe("Dead Eye (DYN155) AAA", () => {
  it("happy: the next arrow attack this turn gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [deadEyeYellow],
        arsenal: [searingShotRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(deadEyeYellow);
    game.helpers.resolveUntilIdle();
    Azalea.attackWith(searingShotRed, { from: "arsenal" });

    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a non-arrow attack does not gain +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [deadEyeYellow, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(deadEyeYellow);
    game.helpers.resolveUntilIdle();
    Azalea.attackWith(snatchRed);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the +3{p} expires at the end of the turn", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [deadEyeYellow],
        arsenal: [searingShotRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(deadEyeYellow);
    game.helpers.resolveUntilIdle();
    Azalea.endTurn();
    Dash.endTurn();
    game.helpers.untilIdle();

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(4);
  });

  it("happy: an aimed next arrow looks at the defender's hand on hit and they discard it", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [deadEyeYellow],
        arsenal: [{ card: searingShotRed, state: { aimCounters: 1 } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(deadEyeYellow);
    game.helpers.resolveUntilIdle();
    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(7);
    game.passBoth();
    game.helpers.resolveUntilIdle({
      ordering: "listed",
      entityTargetCanonicalId: brutalAssaultBlue.canonicalId,
    });

    expectFabCard(Dash, brutalAssaultBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveHandCount(0);
  });
});
