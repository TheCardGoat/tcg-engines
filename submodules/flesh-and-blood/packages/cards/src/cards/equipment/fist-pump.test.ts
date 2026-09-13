import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { throttleRed } from "../actions/throttle.ts";
import { hyperDriverYellow } from "../actions/hyper-driver.ts";
import { bankBreaker } from "../weapons/bank-breaker.ts";
import { fistPump } from "./fist-pump.ts";

/**
 * Fist Pump — Mechanologist Equipment - Arms, d1 Battleworn.
 *
 * Printed: "Whenever you banish a Hyper Driver from boosting, target wrench
 * you control gets +1{p} this turn."
 * Boosting Throttle with a Hyper Driver on top of the deck is the real
 * boost-banish; Bank Breaker is the seated wrench.
 */

describe("Fist Pump (AMX005) AAA", () => {
  it("happy: boosting a Hyper Driver from the deck top buffs the wrench +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [fistPump],
        weapon1: [bankBreaker],
        hand: [throttleRed],
        deckTop: [hyperDriverYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(throttleRed, { boost: true });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    game.helpers.resolveRestOfCombat();

    // The banished Hyper Driver fired Fist Pump: Bank Breaker 3{p} → 4{p}.
    expectFabCard(Dash, bankBreaker).toHavePower(4);
  });

  it("boundary: boosting a non-Hyper-Driver card leaves the wrench at printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [fistPump],
        weapon1: [bankBreaker],
        hand: [throttleRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    // Default deck top is not a Hyper Driver — no Fist Pump trigger.
    Dash.play(throttleRed, { boost: true });
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, bankBreaker).toHavePower(3);
  });
});
