import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { commandAndConquerRed } from "../actions/command-and-conquer.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { prism } from "../heroes/prism.ts";
import { phantasmalFootsteps } from "./phantasmal-footsteps.ts";

/**
 * Phantasmal Footsteps (MON089) — Illusionist Equipment - Legs.
 *
 * Printed delayed effect: when this defends a non-Illusionist attack with
 * 6 or more power, destroy it when the combat chain closes.
 */

describe("Phantasmal Footsteps (MON089) AAA", () => {
  it("happy: defending a 6-power non-Illusionist attack schedules its destruction", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [commandAndConquerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: prism, legs: [phantasmalFootsteps], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Prism = game.as(prism);

    game.as(dash).attackWith(commandAndConquerRed);
    Prism.defendWith(phantasmalFootsteps);

    expectFabCard(Prism, phantasmalFootsteps).toBeIn("combatChain");

    game.closeCombat({ ordering: "listed", optionals: "decline" });

    expectFabCard(Prism, phantasmalFootsteps).toBeIn("graveyard");
  });

  it("boundary: defending an attack below 6 power does not schedule destruction", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: prism, legs: [phantasmalFootsteps], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Prism = game.as(prism);

    game.as(dash).attackWith(snatchRed);
    Prism.defendWith(phantasmalFootsteps);
    game.closeCombat({ ordering: "listed", optionals: "decline" });

    expectFabCard(Prism, phantasmalFootsteps).toBeIn("legs");
  });

  it("timing: the destruction waits for combat-chain close, not link resolution", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [commandAndConquerRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: prism, legs: [phantasmalFootsteps], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Prism = game.as(prism);

    game.as(dash).attackWith(commandAndConquerRed);
    Prism.defendWith(phantasmalFootsteps);

    expectFabCard(Prism, phantasmalFootsteps).toBeIn("combatChain");
  });
});
