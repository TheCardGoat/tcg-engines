import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { faiRisingRebellion } from "../heroes/fai-rising-rebellion.ts";
import { snatchRed } from "../actions/snatch.ts";
import { proclaimVengeanceRed } from "./proclaim-vengeance.ts";

/**
 * Proclaim Vengeance (HNT165) — Draconic Instant, cost 0.
 *
 * Printed: "Mark target opposing hero. If that hero is Arakni, gain {r}."
 */

describe("Proclaim Vengeance (HNT165) AAA", () => {
  it("happy: marks Arakni and gains {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: faiRisingRebellion,
        hand: [proclaimVengeanceRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: arakni, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(faiRisingRebellion);
    const Arakni = game.as(arakni);

    Fai.play(proclaimVengeanceRed);
    game.untilIdle();

    expectFabCard(Fai, proclaimVengeanceRed).toBeIn("graveyard");
    expectFabPlayer(Arakni).toBeMarked();
    expectFabPlayer(Fai).toHaveResourceCount(1);
  });

  it("boundary: marks a non-Arakni hero and does not gain {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: faiRisingRebellion,
        hand: [proclaimVengeanceRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(faiRisingRebellion);
    const Dash = game.as(dash);

    Fai.play(proclaimVengeanceRed);
    game.untilIdle();

    expectFabPlayer(Dash).toBeMarked();
    expectFabPlayer(Fai).toHaveResourceCount(0);
  });

  it("timing: can be played as an instant during the reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: faiRisingRebellion,
        hand: [snatchRed, proclaimVengeanceRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(faiRisingRebellion);
    const Dash = game.as(dash);

    Fai.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Fai.play(proclaimVengeanceRed);
    game.passBoth();

    expectFabPlayer(Dash).toBeMarked();
    expectCombat(game).toBeOpen();
  });
});
