import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { machoGrandeRed } from "./macho-grande.ts";

describe("Macho Grande family AAA", () => {
  it("happy: attacks for 10 with dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [machoGrandeRed],
        resourcePoints: 7,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(machoGrandeRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(10);
    expect(game.combat()?.activeLink?.keywords).toContain("dominate");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(10);
    expectFabCard(Bravo, machoGrandeRed).toBeIn("graveyard");
  });

  it("boundary: dominate blocks defending with a second card from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [machoGrandeRed],
        resourcePoints: 7,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(machoGrandeRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(snatchRed);
    expect(() => Dash.defendWith(nimblismBlue)).toThrow();
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });

  it("timing: dominate is printed on this attack, not granted to a later attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [machoGrandeRed, snatchRed],
        resourcePoints: 8,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(machoGrandeRed);
    expect(game.combat()?.activeLink?.keywords).toContain("dominate");
    game.helpers.resolveRestOfCombat();

    Bravo.attackWith(snatchRed);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("dominate");
  });
});
