import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { eternalInfernoRed } from "./eternal-inferno.ts";
import { chorusOfTheAmphitheaterRed } from "./chorus-of-the-amphitheater.ts";

/**
 * Eternal Inferno, Red (ROS167) — Wizard Action, cost 1, Surge.
 *
 * Printed: "Deal 4 arcane damage to any target.\nSurge - If this deals more
 * than 4 damage, banish it. You may play it this turn."
 *
 * Surge play permission is the PEN277 play-card duration grant on the
 * banished self.
 */

describe("Eternal Inferno (ROS167) AAA", () => {
  it("happy: Amp 1 surges the Inferno into banished, and you may play it this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [chorusOfTheAmphitheaterRed, eternalInfernoRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.activate(chorusOfTheAmphitheaterRed);
    game.untilIdle({ ordering: "listed" });
    Kano.play(eternalInfernoRed, { target: Dash.id });
    game.untilIdle({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Kano, eternalInfernoRed).toBeBanished();

    Kano.play(eternalInfernoRed, { from: "banished", target: Dash.id });
    game.untilIdle({ ordering: "listed" });
    // Amp is consumed on the first deal (5 then 4). Surge is per-turn source
    // damage, so the replay still banishes itself.
    expectFabPlayer(Dash).toHaveLife(11);
    expectFabCard(Kano, eternalInfernoRed).toBeBanished();
  });

  it("happy: deals 4 arcane to the target hero, and 4 is not Surge", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [eternalInfernoRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(eternalInfernoRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Kano, eternalInfernoRed).toBeIn("graveyard");
  });

  it("boundary: an unpayable cost keeps it in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [eternalInfernoRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    expectFabUnplayable(
      () => Kano.play(eternalInfernoRed, { target: game.as(dash).id }),
      /resource cost cannot be paid/,
    );
    expectFabCard(Kano, eternalInfernoRed).toBeIn("hand");
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
});
