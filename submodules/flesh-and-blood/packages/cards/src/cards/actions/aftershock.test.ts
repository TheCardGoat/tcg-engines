import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { seismicEruptionYellow } from "../instants/seismic-eruption.ts";
import { aftershockRed } from "./aftershock.ts";

/**
 * Aftershock Red (MPG035) — Guardian Attack.
 *
 * Printed: "When this attacks, if you've controlled a Seismic Surge token
 * this turn, create a Seismic Surge token."
 */

describe("Aftershock family AAA", () => {
  it("happy: after creating Seismic Surges this turn, attacking creates another", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [aftershockRed, seismicEruptionYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(seismicEruptionYellow);
    game.passBoth();
    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 3);

    Bravo.attackWith(aftershockRed);

    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 4);
    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: no Seismic Surge this turn does not create one", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [aftershockRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(aftershockRed);

    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 0);
    expectFabCard(Bravo, aftershockRed).toBeIn("combatChain");
  });

  it("timing: the create trigger fires on attack while the link is still open", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [aftershockRed, seismicEruptionYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(seismicEruptionYellow);
    game.passBoth();
    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 3);

    Bravo.attackWith(aftershockRed);
    game.passBoth();

    expectCombat(game).toBeOpen();
    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 4);
  });
});
