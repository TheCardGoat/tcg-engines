import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { hyperDriverRed } from "./hyper-driver.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { snatchRed } from "./snatch.ts";
import { reChargeRed } from "./re-charge.ts";

/**
 * Re-Charge, Red (EVO228) — Mechanologist Action, cost 1, go again.
 * Printed: "Put a steam counter on a Hyper Driver you control. The next
 * attack you boost this turn gets +4{p}."
 */

describe("Re-Charge, Red (EVO228) AAA", () => {
  it("happy: charges a Hyper Driver and the next boosted attack gains +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [reChargeRed, zeroToSixtyRed],
        arena: [hyperDriverRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: fai, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(reChargeRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    Dash.playAttack(zeroToSixtyRed, { boost: true });
    game.advanceCombatTo("defend");

    // Re-Charge put a steam counter on the driver; the boost then removed
    // it again (the driver's printed once-per-turn boost-remove).
    expectFabCard(Dash, hyperDriverRed).toHaveCounters(0, "steam");
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: an unboosted attack does not consume the +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [reChargeRed, snatchRed],
        arena: [hyperDriverRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: fai, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(reChargeRed);
    game.helpers.resolveUntilIdle();
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Dash, hyperDriverRed).toHaveCounters(1, "steam");
  });

  it("timing: go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [reChargeRed],
        arena: [hyperDriverRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: fai, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(reChargeRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveAP(1);
  });
});
