import { describe, expect, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { kayo } from "../heroes/kayo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { civicDuty } from "../equipment/civic-duty.ts";
import { nimblismBlue } from "./nimblism.ts";
import { hyperX3 } from "../equipment/hyper-x3.ts";
import { civicSteps } from "../equipment/civic-steps.ts";
import { badBreathBlue, badBreathRed } from "./bad-breath.ts";

/**
 * Bad Breath, Red (PEN306) — Reviled Action, cost 0, 2{d}, go again.
 * Printed: "Intimidate target hero. The next time an attack you control
 * hits this turn, create 3 Might tokens." (yellow 2, blue 1)
 */

describe("Bad Breath family AAA", () => {
  it("happy: the intimidate banishes a random defender card; the next hit creates Mights", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [badBreathRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue, snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);
    Kayo.play(badBreathRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    // Intimidate banishes a random card from the defender's HAND.
    expect(game.as(dash).zone("hand").length).toBe(2);
    expect(game.as(dash).zone("banished").length).toBe(1);

    Kayo.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Kayo).toHaveTokenCount("might", 3);
  });

  it("boundary: a fully blocked attack (4 block vs 4{p}) creates no Mights", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [badBreathRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, chest: [civicDuty], head: [hyperX3], legs: [civicSteps], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    Kayo.play(badBreathRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    Kayo.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    game.as(dash).defendWith([civicDuty, hyperX3, civicSteps]);
    game.closeCombat({ ordering: "listed" });

    // civicDuty 2 + hyperX3 1 + civicSteps 1 = 4 blocks the 4{p} Snatch:
    // no hit, no Mights (the hit event is damage-gated in combat-damage).
    expectFabPlayer(Kayo).toHaveTokenCount("might", 0);
  });

  it("timing: the next-hit latch is one-shot", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [badBreathRed, snatchRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);
    Kayo.play(badBreathRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    Kayo.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });
    Kayo.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });

    // The latch is one-shot: only the FIRST hit this turn mints Mights.
    expectFabPlayer(Kayo).toHaveTokenCount("might", 3);
  });

  it("boundary: blue creates a single Might token on the next hit", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [badBreathBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    Kayo.play(badBreathBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    Kayo.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Kayo).toHaveTokenCount("might", 1);
  });
});
