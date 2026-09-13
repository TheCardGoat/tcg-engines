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
import { tekloBaseHead } from "../equipment/teklo-base-head.ts";
import { evoSentryBaseHeadRed } from "./evo-sentry-base-head.ts";

/**
 * Evo Sentry Base Head (EVO042) — Mechanologist Action Equipment Evo Base Head.
 *
 * Printed: If you have a base head equipped, transform it into this, then
 * equip this. Battleworn.
 *
 * Seat Teklovossen (not Dash — Dash's start-game item may park extra items).
 * Transform/equip may follow the AMX022 family and park the Action inert in
 * the arena; pin the public zone.
 */

describe("Evo Sentry Base Head (EVO042) AAA", () => {
  it("happy: with a base head equipped, this transforms into the head slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [tekloBaseHead],
        hand: [evoSentryBaseHeadRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoSentryBaseHeadRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Teklo, evoSentryBaseHeadRed).toBeIn("head");
    expect(Teklo.zone("head")).not.toContain(tekloBaseHead.canonicalId);
  });

  it("boundary: without a base head equipped this does not enter the head slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [evoSentryBaseHeadRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoSentryBaseHeadRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expect(Teklo.zone("head")).not.toContain(evoSentryBaseHeadRed.canonicalId);
  });

  it("timing: Battleworn d2 first defend stays seated with a −1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: teklovossen, life: 20, head: [evoSentryBaseHeadRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    game.as(bravo).attackWith(snatchRed);
    Teklo.defendWith(evoSentryBaseHeadRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Teklo, evoSentryBaseHeadRed).toBeIn("head");
    expectFabCard(Teklo, evoSentryBaseHeadRed).toHaveDefenseCounters(-1);
    expectFabPlayer(Teklo).toHaveLife(18);
  });
});
