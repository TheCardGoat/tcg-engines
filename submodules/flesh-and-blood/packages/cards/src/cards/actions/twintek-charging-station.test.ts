import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { hyperDriver } from "../tokens/hyper-driver.ts";
import { twintekChargingStationRed } from "./twintek-charging-station.ts";

/**
 * Twintek Charging Station (AMX018) — Mechanologist Action (red).
 *
 * Printed:
 *   The next attack you boost this turn gets +3{p}.
 *   You may shuffle a Hyper Driver from your graveyard into your deck. If
 *   you do, gain {r}.
 *   Go again
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.3 (resolution abilities), CR 6.2 (this-turn
 *     layer-continuous modifier bound to the next boosted attack), CR 8.3
 *     (Boost — optional additional cost banishing the top card of the deck)
 *     and glossary Boost, CR 1.13 (gain {r} = gain one resource point),
 *     CR 8.5 (shuffle after the Hyper Driver enters the deck).
 *   behaviorConstraints:
 *     - The +3{p} applies only to the next attack that was BOOSTED this
 *       turn; an unboosted attack does not receive it.
 *     - The Hyper Driver clause is optional: accepting moves one Hyper
 *       Driver from the graveyard into the deck (then shuffles) and gains
 *     exactly 1{r}; declining changes nothing.
 *     - Go again refunds the action point spent to play the Station.
 *   testImplications:
 *     - Assert the boosted attack's power (base 4 + 3 = 7), the unboosted
 *       contrast (base 4), the Hyper Driver's zone change plus the +1{r},
 *       and the declined contrast (graveyard keeps the Driver, 0{r}).
 */

describe("Twintek Charging Station (AMX018) AAA", () => {
  it("happy: the next boosted attack gets +3{p} and recycling a Hyper Driver gains {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [twintekChargingStationRed, zeroToSixtyRed],
        graveyard: [hyperDriver],
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(twintekChargingStationRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: hyperDriver.canonicalId,
    });

    // Optional executed: Driver left the graveyard for the deck (6 → 7),
    // and the Station's go again refunded the action point.
    expect(Dash.zone("graveyard")).not.toContain(hyperDriver.canonicalId);
    expect(Dash.zone("deck")).toHaveLength(7);
    expectFabPlayer(Dash).toHaveResourceCount(1);
    expectFabPlayer(Dash).toHaveAP(2);

    Dash.must.playAttack(zeroToSixtyRed, { boost: true });
    game.advanceCombatTo("defend");
    // Zero to Sixty base 4 + 3 from the Station = 7.
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: an unboosted attack does not get the +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [twintekChargingStationRed, zeroToSixtyRed],
        graveyard: [hyperDriver],
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(twintekChargingStationRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Dash.must.playAttack(zeroToSixtyRed);
    game.advanceCombatTo("defend");
    // No boost was paid, so Zero to Sixty stays at its printed 4{p}.
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: declining the optional keeps the Hyper Driver in the graveyard and gains nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [twintekChargingStationRed],
        graveyard: [hyperDriver],
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(twintekChargingStationRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Dash, hyperDriver).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveResourceCount(0);
  });
});
