import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { tekloBaseArms } from "../equipment/teklo-base-arms.ts";
import { evoSentryBaseArmsRed } from "./evo-sentry-base-arms.ts";

/**
 * Evo Sentry Base Arms (EVO044) — Mechanologist Action Equipment Evo Base Arms.
 *
 * Printed: If you have a base arms equipped, transform it into this, then
 * equip this. Battleworn.
 *
 * Seat Teklovossen (not Dash). Transform/equip may follow the AMX022 family
 * and park the Action inert in the arena; pin the public zone.
 */

describe("Evo Sentry Base Arms (EVO044) AAA", () => {
  it("happy: with a base arms equipped, this transforms into the arms slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arms: [tekloBaseArms],
        hand: [evoSentryBaseArmsRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoSentryBaseArmsRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Teklo, evoSentryBaseArmsRed).toBeIn("arms");
    expect(Teklo.zone("arms")).not.toContain(tekloBaseArms.canonicalId);
  });

  it("boundary: without a base arms equipped this does not enter the arms slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [evoSentryBaseArmsRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoSentryBaseArmsRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expect(Teklo.zone("arms")).not.toContain(evoSentryBaseArmsRed.canonicalId);
  });

  it("timing: Battleworn d2 first defend stays seated with a −1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: teklovossen, life: 20, arms: [evoSentryBaseArmsRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    game.as(bravo).attackWith(snatchRed);
    Teklo.defendWith(evoSentryBaseArmsRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Teklo, evoSentryBaseArmsRed).toBeIn("arms");
    expectFabCard(Teklo, evoSentryBaseArmsRed).toHaveDefenseCounters(-1);
    expectFabPlayer(Teklo).toHaveLife(18);
  });
});
