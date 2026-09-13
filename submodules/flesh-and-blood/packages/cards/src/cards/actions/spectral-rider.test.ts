import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { spectralRiderRed } from "./spectral-rider.ts";

/**
 * Spectral Rider Red (DYN227) — Illusionist Attack Action. Phantasm.
 *
 * Printed: When you play Spectral Rider, if you control a Spectral
 * Shield, this gains overpower.
 */

describe("Spectral Rider (DYN227) AAA", () => {
  it("happy: with a Spectral Shield seated, the play gains overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arena: [fabToken("spectral-shield")],
        hand: [spectralRiderRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(spectralRiderRed);
    expectCombat(game).toHaveKeyword("overpower");
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(12); // 20 - 8
    expectFabPlayer(Prism).toHaveAP(0); // no AP leg on riders
  });

  it("boundary: without a Shield there is no overpower and two action cards may defend", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [spectralRiderRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(spectralRiderRed);
    expectCombat(game).notToHaveKeyword("overpower");
    Dash.defendWith([snatchRed, nimblismBlue]);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(16); // 20 - (8 - 4)
    expectFabPlayer(Prism).toHaveAP(0);
  });
});
