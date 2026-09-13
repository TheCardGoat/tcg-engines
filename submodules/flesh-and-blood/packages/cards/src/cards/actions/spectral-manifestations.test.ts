import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { spectralManifestationsRed } from "./spectral-manifestations.ts";

/**
 * Spectral Manifestations (ENG008) — Illusionist Action, cost 2, 2{d}, go again.
 *
 * Printed: Create a Spectral Shield token, then if you control no other
 * Illusionist auras, put three +1{p} counters on it. Go again.
 */

describe("Spectral Manifestations (ENG008) AAA", () => {
  it("happy: creates a Spectral Shield when you control no other Illusionist auras", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [spectralManifestationsRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(spectralManifestationsRed);
    game.helpers.resolveUntilIdle();

    expectFabToken(game, "spectral-shield").toHaveCount(1);
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 1);
    expectFabCard(Prism, spectralManifestationsRed).toBeIn("graveyard");
  });

  it("boundary: a second play still creates another Spectral Shield", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [spectralManifestationsRed, spectralManifestationsRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(spectralManifestationsRed);
    game.helpers.resolveUntilIdle();
    Prism.play(spectralManifestationsRed);
    game.helpers.resolveUntilIdle();

    expectFabToken(game, "spectral-shield").toHaveCount(2);
  });

  it("timing: go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [spectralManifestationsRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(spectralManifestationsRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Prism).toHaveAP(1);
  });
});
