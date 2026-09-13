import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { valdaSeismicImpact } from "../heroes/valda-seismic-impact.ts";
import { nimblismBlue } from "./nimblism.ts";
import { seismicSurge } from "../tokens/seismic-surge.ts";
import { disenchantmentOfTheOldOnesRed } from "./disenchantment-of-the-old-ones.ts";

describe("Disenchantment of the Old Ones (MPG027) AAA", () => {
  it("happy: crush vs a Guardian hero destroys their auras", () => {
    const game = FabTestEngine.start(
      {
        hero: valdaSeismicImpact,
        hand: [disenchantmentOfTheOldOnesRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: 20, arena: [seismicSurge], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Valda = game.as(valdaSeismicImpact);
    const Bravo = game.as(bravo);

    Valda.attackWith(disenchantmentOfTheOldOnesRed);
    expectCombat(game).toHaveAttackPower(10);
    Bravo.defendWith();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(10);
    expect(Bravo.zone("arena")).not.toContain(seismicSurge.canonicalId);
    expect(Bravo.zone("arena")).not.toContain("token:seismic-surge");
  });

  it("boundary: crush vs a non-Guardian hero does not destroy their auras", () => {
    const game = FabTestEngine.start(
      {
        hero: valdaSeismicImpact,
        hand: [disenchantmentOfTheOldOnesRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, arena: [seismicSurge], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Valda = game.as(valdaSeismicImpact);
    const Dash = game.as(dash);

    Valda.attackWith(disenchantmentOfTheOldOnesRed);
    Dash.defendWith();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(10);
    expectFabCard(Dash, seismicSurge).toBeIn("arena");
  });

  it("timing: less than 4 damage vs a Guardian does not destroy their auras", () => {
    const game = FabTestEngine.start(
      {
        hero: valdaSeismicImpact,
        hand: [disenchantmentOfTheOldOnesRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        life: 20,
        arena: [seismicSurge],
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Valda = game.as(valdaSeismicImpact);
    const Bravo = game.as(bravo);

    Valda.attackWith(disenchantmentOfTheOldOnesRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith([nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, seismicSurge).toBeIn("arena");
  });
});
