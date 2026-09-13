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
import { spectralProwlerRed } from "./spectral-prowler.ts";

/**
 * Spectral Prowler Red (DYN224) — Illusionist Attack Action. Phantasm.
 *
 * Printed: When you play Spectral Prowler, if you control a Spectral
 * Shield, this gains go again.
 */

describe("Spectral Prowler (DYN224) AAA", () => {
  it("happy: with a Spectral Shield seated, the play gains go again and refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arena: [fabToken("spectral-shield")],
        hand: [spectralProwlerRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(spectralProwlerRed);
    expectCombat(game).toHaveKeyword("go-again");
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(16); // 20 - 4
    expectFabPlayer(Prism).toHaveAP(1); // shield-armed go again
  });

  it("boundary: without a Shield there is no go again and no refund", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [spectralProwlerRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(spectralProwlerRed);
    expectCombat(game).notToHaveKeyword("go-again");
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Prism).toHaveAP(0);
  });
});
