import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { parableOfHumilityYellow } from "./parable-of-humility.ts";

/**
 * Parable of Humility (MON011) — Spectra aura. "Attack action cards your
 * opponents control get -1{p} while attacking and defending."
 */

describe("Parable of Humility (MON011) AAA", () => {
  it("happy: an opposing attack action is -1{p} (Snatch 4 → 3)", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: prism,
        hand: [parableOfHumilityYellow],
        resourcePoints: 4,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    game.as(dash).playAttack(snatchRed);
    game.toReaction("defender");
    Prism.play(parableOfHumilityYellow);
    game.passBoth();
    expectFabCard(Prism, parableOfHumilityYellow).toBeIn("arena");
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: your own attack action is not reduced", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [parableOfHumilityYellow, snatchRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(parableOfHumilityYellow);
    game.helpers.resolveUntilIdle();
    Prism.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the aura stays in arena with Spectra while not defending", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: prism,
        hand: [parableOfHumilityYellow],
        resourcePoints: 4,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    game.as(dash).playAttack(snatchRed);
    game.toReaction("defender");
    Prism.play(parableOfHumilityYellow);
    game.passBoth();
    expectFabCard(Prism, parableOfHumilityYellow).toBeIn("arena").toHaveKeyword("spectra");
    game.helpers.resolveRestOfCombat();
    expectFabCard(Prism, parableOfHumilityYellow).toBeIn("arena");
  });
});
