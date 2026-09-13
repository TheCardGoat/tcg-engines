import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { tekloBlaster } from "../weapons/teklo-blaster.ts";
import { tekloBaseArms } from "../equipment/teklo-base-arms.ts";
import { evoSmoothboreYellow } from "./evo-smoothbore.ts";

/**
 * Evo Smoothbore (EVO036) — Mechanologist Action Evo Arms d3.
 *
 * Destroy-under-this Instant is unpayable until transform stamps under-this.
 */

describe("Evo Smoothbore (EVO036) AAA", () => {
  it("happy: transform equips this but Instant destroy-under-this stays unpayable", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arms: [tekloBaseArms],
        weapon1: [tekloBlaster],
        hand: [evoSmoothboreYellow],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoSmoothboreYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    expectFabCard(Teklo, evoSmoothboreYellow).toBeIn("arms");

    Teklo.activate(evoSmoothboreYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Teklo, evoSmoothboreYellow).toBeIn("arms");
  });

  it("boundary: Instant destroy-under-this is unpayable with no card under this", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arms: [evoSmoothboreYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(teklovossen).expectActivationRejected(evoSmoothboreYellow);
  });

  it("timing: without paying destroy-under-this Teklo Blaster stays at printed 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arms: [evoSmoothboreYellow],
        weapon1: [tekloBlaster],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(teklovossen).activateAttack(tekloBlaster);
    expectCombat(game).toHaveAttackPower(2);
  });
});
