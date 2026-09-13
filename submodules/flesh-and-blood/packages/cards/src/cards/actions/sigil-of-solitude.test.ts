import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { passingMirageBlue } from "./passing-mirage.ts";
import { prism } from "../heroes/prism.ts";
import { snatchRed } from "./snatch.ts";
import { sigilOfSolitudeRed } from "./sigil-of-solitude.ts";

/**
 * Sigil of Solitude (MST143) — Illusionist Action Aura, cost 0, defense 2.
 *
 * Printed: "At the start of your turn, if you control another Illusionist
 * aura, destroy this. Ward 4"
 */

describe("Sigil of Solitude (MST143) AAA", () => {
  it("happy: Ward 4 prevents a 4{p} Snatch and destroys this", () => {
    const game = FabTestEngine.start(
      { hero: prism, hand: [sigilOfSolitudeRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.play(sigilOfSolitudeRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Prism, sigilOfSolitudeRed).toBeIn("arena");
    expectFabCard(Prism, sigilOfSolitudeRed).toHaveKeyword("ward");
    Prism.endTurn();

    Dash.attackWith(snatchRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Prism).toHaveLife(20);
    expectFabCard(Prism, sigilOfSolitudeRed).toBeIn("graveyard");
  });

  it("boundary: start of your turn with no other Illusionist aura leaves this in the arena", () => {
    const game = FabTestEngine.start(
      { hero: prism, hand: [sigilOfSolitudeRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.play(sigilOfSolitudeRed);
    game.helpers.resolveUntilIdle();
    Prism.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Prism, sigilOfSolitudeRed).toBeIn("arena");
  });

  it("timing: start of your turn with another Illusionist aura destroys this and leaves the other", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [sigilOfSolitudeRed, passingMirageBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.play(sigilOfSolitudeRed);
    game.helpers.resolveUntilIdle();
    Prism.play(passingMirageBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Prism, sigilOfSolitudeRed).toBeIn("arena");
    expectFabCard(Prism, passingMirageBlue).toBeIn("arena");
    Prism.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Prism, sigilOfSolitudeRed).toBeIn("graveyard");
    expectFabCard(Prism, passingMirageBlue).toBeIn("arena");
  });
});
