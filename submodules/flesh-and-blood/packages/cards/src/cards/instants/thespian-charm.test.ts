import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { hazeShelterRed } from "./haze-shelter.ts";
import { dash } from "../heroes/dash.ts";
import { pleiadesSuperstar } from "../heroes/pleiades-superstar.ts";
import { enchantingMelodyBlue } from "../actions/enchanting-melody.ts";
import { thespianCharmYellow } from "./thespian-charm.ts";

/**
 * Thespian Charm (APS014) — Champion Yellow instant.
 *
 * Printed: Choose any number;
 * - Destroy a Might or Vigor token.
 * - The crowd cheers you.
 * - Return an aura permanent you control to its owner's hand.
 */

describe("Thespian Charm (APS014) AAA", () => {
  it("happy: the destroy-token mode removes a seated Might token", () => {
    const game = FabTestEngine.start(
      {
        hero: pleiadesSuperstar,
        arena: [fabToken("might")],
        hand: [thespianCharmYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);

    // a1 is the destroy leg; its target is the seated Might token.
    Pleiades.play(thespianCharmYellow, { modeIndexes: [0] });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Pleiades).toHaveTokenCount("might", 0);
  });

  it("happy: the crowd-cheers mode arms Pleiades' Confidence reward", () => {
    const game = FabTestEngine.start(
      {
        hero: pleiadesSuperstar,
        hand: [thespianCharmYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);

    Pleiades.play(thespianCharmYellow, { modeIndexes: [1] });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Pleiades).toHaveTokenCount("confidence", 1);
  });

  it("happy: the aura-return mode moves a controlled aura permanent to hand", () => {
    const game = FabTestEngine.start(
      {
        hero: pleiadesSuperstar,
        arena: [hazeShelterRed],
        hand: [thespianCharmYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);

    // a3 scans the controller's arena permanents — not the combat chain.
    Pleiades.play(thespianCharmYellow, { modeIndexes: [2] });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Pleiades, hazeShelterRed).toBeIn("hand");
  });

  it("boundary: choosing no mode resolves the charm without touching anything", () => {
    const game = FabTestEngine.start(
      {
        hero: pleiadesSuperstar,
        arena: [fabToken("might")],
        hand: [thespianCharmYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);

    Pleiades.play(thespianCharmYellow, { modeIndexes: [] });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Pleiades).toHaveTokenCount("might", 1);
    expectFabPlayer(Pleiades).toHaveTokenCount("confidence", 0);
  });

  it("happy: the aura-return mode returns a seated aura permanent to its owner's hand", () => {
    const game = FabTestEngine.start(
      {
        hero: pleiadesSuperstar,
        arena: [enchantingMelodyBlue],
        hand: [thespianCharmYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);

    // a3 is the aura-return leg; the seated aura is Pleiades' own permanent.
    Pleiades.play(thespianCharmYellow, { modeIndexes: [2] });
    game.helpers.resolveUntilIdle();

    expectFabCard(Pleiades, enchantingMelodyBlue).toBeIn("hand");
  });
});
