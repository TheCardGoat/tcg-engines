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
import { tekloBaseChest } from "../equipment/teklo-base-chest.ts";
import { evoSentryBaseChestRed } from "./evo-sentry-base-chest.ts";

/**
 * Evo Sentry Base Chest (EVO043) — Mechanologist Action Equipment Evo Base Chest.
 *
 * Printed: If you have a base chest equipped, transform it into this, then
 * equip this. Battleworn.
 *
 * Seat Teklovossen (not Dash). Transform/equip may follow the AMX022 family
 * and park the Action inert in the arena; pin the public zone.
 */

describe("Evo Sentry Base Chest (EVO043) AAA", () => {
  it("happy: with a base chest equipped, this transforms into the chest slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        chest: [tekloBaseChest],
        hand: [evoSentryBaseChestRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoSentryBaseChestRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Teklo, evoSentryBaseChestRed).toBeIn("chest");
    expect(Teklo.zone("chest")).not.toContain(tekloBaseChest.canonicalId);
  });

  it("boundary: without a base chest equipped this does not enter the chest slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [evoSentryBaseChestRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoSentryBaseChestRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expect(Teklo.zone("chest")).not.toContain(evoSentryBaseChestRed.canonicalId);
  });

  it("timing: Battleworn d2 first defend stays seated with a −1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: teklovossen, life: 20, chest: [evoSentryBaseChestRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    game.as(bravo).attackWith(snatchRed);
    Teklo.defendWith(evoSentryBaseChestRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Teklo, evoSentryBaseChestRed).toBeIn("chest");
    expectFabCard(Teklo, evoSentryBaseChestRed).toHaveDefenseCounters(-1);
    expectFabPlayer(Teklo).toHaveLife(18);
  });
});
