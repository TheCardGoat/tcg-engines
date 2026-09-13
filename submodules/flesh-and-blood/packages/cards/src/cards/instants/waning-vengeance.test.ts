import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prismAwakenerOfSol } from "../heroes/prism-awakener-of-sol.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { snatchRed } from "../actions/snatch.ts";
import { waningVengeanceRed } from "./waning-vengeance.ts";

describe("Waning Vengeance (ENG011/013/024) AAA", () => {
  it("happy: leaving the arena with a blue card in pitch creates a Spectral Shield", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: prismAwakenerOfSol,
        arena: [waningVengeanceRed],
        pitch: [brutalAssaultBlue],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Prism, waningVengeanceRed).toBeIn("graveyard");
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 1);
  });

  it("boundary: leaving the arena without a blue pitch creates no Spectral Shield", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: prismAwakenerOfSol,
        arena: [waningVengeanceRed],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    game.as(dash).attackWith(snatchRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Prism, waningVengeanceRed).toBeIn("graveyard");
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 0);
  });

  it("timing: entering the arena does not create a Spectral Shield", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        hand: [waningVengeanceRed],
        pitch: [brutalAssaultBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.play(waningVengeanceRed);
    game.passBoth();

    expectFabCard(Prism, waningVengeanceRed).toBeIn("arena");
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 0);
  });
});
