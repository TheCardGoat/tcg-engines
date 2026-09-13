import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "./snatch.ts";
import { barkObscenitiesRed } from "./bark-obscenities.ts";

/**
 * Bark Obscenities (SUP167) — Brute Action, cost 0, 2{d}, go again.
 * Printed: "Your next attack that targets a Guardian hero this turn gets +4{p}.
 * Go again"
 *
 * ENGINE GAP: `appliesTo.next.hasStatus: "targets-a-guardian-hero"` is
 * unhandled and fail-closes (no throw, latch never matches) — same family as
 * charged-to-play / boosted. Prove go again and the missing +4 vs Bravo.
 */

describe("Bark Obscenities (SUP167) AAA", () => {
  it("happy: playing this refunds its Action AP (go again)", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [barkObscenitiesRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(barkObscenitiesRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Rhinar).toHaveAP(1);
  });

  it("happy: the next attack that targets a Guardian hero gets +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [barkObscenitiesRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(barkObscenitiesRed);
    game.helpers.resolveUntilIdle();
    Rhinar.playAttack(snatchRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: the next attack against a non-Guardian hero stays 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [barkObscenitiesRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(barkObscenitiesRed);
    game.helpers.resolveUntilIdle();
    Rhinar.playAttack(snatchRed);

    expectCombat(game).toHaveAttackPower(4);
  });
});
