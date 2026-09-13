import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { hyperDriverRed } from "./hyper-driver.ts";
import { bravo } from "../heroes/bravo.ts";
import { energyPotionBlue } from "./energy-potion.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { systemResetYellow } from "./system-reset.ts";

/**
 * System Reset (EVO145) — Mechanologist Action, 3{d}.
 *
 * Printed: Banish X Mechanologist items you control with cost 0 or 1, then
 * return them to the arena under their owners' control.
 *
 * Seat Teklovossen (not Dash).
 */

describe("System Reset (EVO145) AAA", () => {
  it("happy: banishes then returns a cost-1 Mechanologist item you control", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [systemResetYellow],
        arena: [{ card: hyperDriverRed, state: { steamCounters: 7 } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(systemResetYellow, { xValue: 1 });
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: hyperDriverRed.canonicalId });

    expectFabCard(Teklo, hyperDriverRed).toBeIn("arena").toHaveCounters(3, "steam");
    expectFabCard(Teklo, systemResetYellow).toBeIn("graveyard");
  });

  it("boundary: a Generic item is not a legal Mechanologist-item choice", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [systemResetYellow],
        arena: [energyPotionBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(systemResetYellow, { xValue: 1 });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Teklo, energyPotionBlue).toBeIn("arena");
    expect(Teklo.zone("banished")).not.toContain(energyPotionBlue.canonicalId);
  });

  it("timing: X=0 leaves the Mechanologist item in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [systemResetYellow],
        arena: [{ card: hyperDriverRed, state: { steamCounters: 3 } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(systemResetYellow, { xValue: 0 });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Teklo, hyperDriverRed).toBeIn("arena");
    expect(Teklo.zone("banished")).not.toContain(hyperDriverRed.canonicalId);
  });
});
