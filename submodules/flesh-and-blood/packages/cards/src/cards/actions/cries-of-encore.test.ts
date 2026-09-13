import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { pleiadesSuperstar } from "../heroes/pleiades-superstar.ts";
import { superstarBlue } from "../instants/superstar.ts";
import { nimblismBlue } from "./nimblism.ts";
import { criesOfEncoreRed } from "./cries-of-encore.ts";

/**
 * Cries of Encore Red (SUP012) — Revered Guardian AAC, 7{p}.
 *
 * Printed: When this attacks a hero, if you have less {h} than them, the
 * crowd cheers you. If you've been cheered this turn, this gets "When this
 * hits a hero, you may plan an aura of suspense from your graveyard this
 * turn."
 */

describe("Cries of Encore (SUP012) AAA", () => {
  it("happy: attacking with less {h} cheers, then a hit may plan a GY suspense aura", () => {
    const game = FabTestEngine.start(
      {
        hero: pleiadesSuperstar,
        hand: [criesOfEncoreRed],
        graveyard: [superstarBlue],
        resourcePoints: 3,
        actionPoints: 1,
        life: 10,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);
    const Dash = game.as(dash);

    Pleiades.playAttack(criesOfEncoreRed);
    game.advanceCombatTo("defend");
    expectFabPlayer(Pleiades).toHaveTokenCount("confidence", 1);
    Dash.defendWith();
    game.closeCombat({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Pleiades, superstarBlue).toBeIn("arena");
    expectFabPlayer(Dash).toHaveLife(13);
  });

  it("boundary: attacking with more {h} does not cheer", () => {
    const game = FabTestEngine.start(
      {
        hero: pleiadesSuperstar,
        hand: [criesOfEncoreRed],
        resourcePoints: 3,
        actionPoints: 1,
        life: 30,
        deck: 6,
      },
      { hero: dash, hand: [], life: 10, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);

    Pleiades.playAttack(criesOfEncoreRed);
    game.advanceCombatTo("defend");
    expectFabPlayer(Pleiades).toHaveTokenCount("confidence", 0);
  });

  it("timing: a fully blocked hit does not plan from graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: pleiadesSuperstar,
        hand: [criesOfEncoreRed],
        graveyard: [superstarBlue],
        resourcePoints: 3,
        actionPoints: 1,
        life: 10,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);
    const Dash = game.as(dash);

    Pleiades.playAttack(criesOfEncoreRed);
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue]);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Pleiades, superstarBlue).toBeIn("graveyard");
  });
});
