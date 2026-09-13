import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { pleiades } from "../heroes/pleiades.ts";
import { tensionInTheAirRed } from "../instants/tension-in-the-air.ts";
import { energyOfTheAudienceYellow } from "./energy-of-the-audience.ts";

/**
 * Energy of the Audience (PEN286) — "If you have less {h} than each other
 * hero, this gets +1{p} for each aura of suspense you control." Printed 6{p}.
 */

describe("Energy of the Audience (PEN286) AAA", () => {
  it("happy: less life plus one suspense aura is 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: pleiades,
        life: 15,
        hand: [energyOfTheAudienceYellow],
        arena: [tensionInTheAirRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(pleiades).playAttack(energyOfTheAudienceYellow);
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: less life with no suspense auras stays printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: pleiades,
        life: 15,
        hand: [energyOfTheAudienceYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(pleiades).playAttack(energyOfTheAudienceYellow);
    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: equal life does not get the suspense bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: pleiades,
        life: 20,
        hand: [energyOfTheAudienceYellow],
        arena: [tensionInTheAirRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(pleiades).playAttack(energyOfTheAudienceYellow);
    expectCombat(game).toHaveAttackPower(6);
  });
});
