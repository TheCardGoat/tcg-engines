import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { sigilOfDeadwoodBlue } from "./sigil-of-deadwood.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { clashOfBravadoYellow } from "./clash-of-bravado.ts";

/**
 * Clash of Bravado (MPG015) — Guardian Attack, 7{p}/3{d}.
 * Printed: When this defends, clash with the attacking hero. The winner
 * destroys an aura the other hero controls.
 */

describe("Clash of Bravado (MPG015) AAA", () => {
  it("happy: defending, clash winner destroys the other hero's aura", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        arena: [sigilOfDeadwoodBlue],
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      {
        hero: bravo,
        hand: [clashOfBravadoYellow],
        deck: [snatchRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(clashOfBravadoYellow);
    game.untilIdle({
      optionals: "decline",
      ordering: "listed",
      entityTargets: "minimum",
    });

    expectCombat(game).toHaveClashWinner(Bravo);
    expectFabCard(game.as(dash), sigilOfDeadwoodBlue).toBeIn("graveyard");
  });

  it("boundary: clash loser does not destroy the winner's aura", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        arena: [sigilOfDeadwoodBlue],
        actionPoints: 1,
        deck: [snatchRed],
      },
      {
        hero: bravo,
        hand: [clashOfBravadoYellow],
        deck: [nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(clashOfBravadoYellow);
    game.untilIdle({
      optionals: "decline",
      ordering: "listed",
      entityTargets: "minimum",
    });

    expectCombat(game).toHaveClashWinner(Dash);
    expectFabCard(Dash, sigilOfDeadwoodBlue).toBeIn("arena");
  });

  it("timing: playing this as an attack does not clash", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [clashOfBravadoYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: [snatchRed],
      },
      {
        hero: dash,
        hand: [],
        arena: [sigilOfDeadwoodBlue],
        deck: [nimblismBlue],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: bravo },
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(clashOfBravadoYellow);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(game.as(dash), sigilOfDeadwoodBlue).toBeIn("arena");
  });
});
