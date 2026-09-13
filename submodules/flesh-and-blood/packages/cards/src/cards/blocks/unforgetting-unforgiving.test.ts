import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { jarlVetreiI } from "../heroes/jarl-vetrei-i.ts";
import { dash } from "../heroes/dash.ts";
import { ironrotPlate } from "../equipment/ironrot-plate.ts";
import { bucklingBlowRed } from "../actions/buckling-blow.ts";
import { mangleRed } from "../actions/mangle.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { unforgettingUnforgivingRed } from "./unforgetting-unforgiving.ts";

/**
 * Unforgetting Unforgiving (AJV013) — Guardian Block, Jarl Specialization.
 * Printed: When this defends, if the attacking hero controls an equipment with
 * a -1{d} counter, you may search your deck for a Mangle, banish it, then
 * shuffle. You may play it during your next action phase.
 */

describe("Unforgetting Unforgiving (AJV013) AAA", () => {
  it("happy: defending vs crushed equipment may banish Mangle from deck", () => {
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        hand: [bucklingBlowRed, unforgettingUnforgivingRed, nimblismBlue, nimblismBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: [mangleRed, snatchRed],
      },
      { hero: dash, life: 40, chest: [ironrotPlate], hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);
    const Dash = game.as(dash);

    Jarl.attackWith(bucklingBlowRed);
    Dash.defendWith();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabCard(Dash, ironrotPlate).toHaveDefenseCounters(-1);

    Jarl.endTurn();
    Dash.playAttack(snatchRed);
    Jarl.defendWith(unforgettingUnforgivingRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: mangleRed.canonicalId,
    });

    expectFabCard(Jarl, mangleRed).toBeBanished();
  });

  it("boundary: no -1{d} equipment on the attacker does not search Mangle", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: jarlVetreiI,
        hand: [unforgettingUnforgivingRed],
        deck: [mangleRed, nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Jarl = game.as(jarlVetreiI);

    game.as(dash).playAttack(snatchRed);
    Jarl.defendWith(unforgettingUnforgivingRed);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expect(Jarl.zone("deck")).toContain(mangleRed.canonicalId);
  });

  it("timing: declining the search leaves Mangle in deck", () => {
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        hand: [bucklingBlowRed, unforgettingUnforgivingRed, nimblismBlue, nimblismBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: [mangleRed, snatchRed],
      },
      { hero: dash, life: 40, chest: [ironrotPlate], hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);
    const Dash = game.as(dash);

    Jarl.attackWith(bucklingBlowRed);
    Dash.defendWith();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    Jarl.endTurn();
    Dash.playAttack(snatchRed);
    Jarl.defendWith(unforgettingUnforgivingRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expect(Jarl.zone("deck")).toContain(mangleRed.canonicalId);
  });
});
