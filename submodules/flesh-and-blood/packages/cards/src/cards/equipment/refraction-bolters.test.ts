import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { snatchRed } from "../actions/snatch.ts";
import { refractionBolters } from "./refraction-bolters.ts";

describe("Refraction Bolters (TEA007) AAA", () => {
  it("happy: destroying this when a weapon hits grants the attack go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnblade],
        legs: [refractionBolters],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(dawnblade);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Bravo, refractionBolters).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("boundary: declining the destroy leaves the boots and spends the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnblade],
        legs: [refractionBolters],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(dawnblade);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Bravo, refractionBolters).toBeIn("legs");
    expectFabPlayer(Bravo).toHaveAP(0);
  });

  it("timing: an attack-action hit does not offer the destroy", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [refractionBolters],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, refractionBolters).toBeIn("legs");
    expectFabPlayer(Bravo).toHaveAP(0);
    expectCombat(game).toBeClosed();
  });
});
