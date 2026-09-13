import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { snatchRed } from "../actions/snatch.ts";
import { aetherCrackers } from "./aether-crackers.ts";

/**
 * Aether Crackers (AUR005) — Runeblade Equipment - Arms.
 * Printed: "When an attack you control hits a hero, you may destroy this.
 * If you do, deal 1 arcane damage to them."
 */

describe("Aether Crackers (AUR005) AAA", () => {
  it("happy: hitting a hero may destroy this and deal 1 arcane to them", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [aetherCrackers],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    game.closeCombat({ optionals: "accept", ordering: "listed" });

    expectFabCard(Bravo, aetherCrackers).toBeIn("graveyard");
    // Snatch 4 + 1 arcane.
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("boundary: a miss does not offer destroy or extra arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [aetherCrackers],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue, brutalAssaultBlue], deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    Dash.defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Bravo, aetherCrackers).toBeIn("arms");
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: declining the destroy leaves the equipment and skips the arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [aetherCrackers],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Bravo, aetherCrackers).toBeIn("arms");
    expectFabPlayer(Dash).toHaveLife(16);
  });
});
