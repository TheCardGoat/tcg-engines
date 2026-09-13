import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { snatchRed } from "./snatch.ts";
import { phantasmalHazeYellow } from "./phantasmal-haze.ts";
import { fractalReplicationRed } from "./fractal-replication.ts";

/**
 * Fractal Replication (EVR138) — Illusionist Attack.
 *
 * Errata Bulletin #5: when you play or defend with this, it gains the base
 * abilities of all Illusionist attack action cards on the combat chain.
 * Its {p}/{d} equal the greatest base {p}/{d} among those cards.
 */

describe("Fractal Replication (EVR138) AAA", () => {
  it("happy: defending with this against an Illusionist attack takes that attack's base {d}", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [phantasmalHazeYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [fractalReplicationRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(phantasmalHazeYellow);
    Dash.defendWith(fractalReplicationRed);
    game.passBoth();

    expectFabCard(Dash, fractalReplicationRed).toHaveDefense(3);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("boundary: defending with this against a Generic attack has no Illusionist {d} to copy", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: prism,
        hand: [fractalReplicationRed],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Prism = game.as(prism);

    Dash.playAttack(snatchRed);
    Prism.defendWith(fractalReplicationRed);
    game.passBoth();

    expectFabCard(Prism, fractalReplicationRed).toHaveDefense(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Prism).toHaveLife(16);
  });

  it("timing: after the chain closes this no longer copies the Illusionist {d}", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [phantasmalHazeYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [fractalReplicationRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(phantasmalHazeYellow);
    Dash.defendWith(fractalReplicationRed);
    game.passBoth();
    expectFabCard(Dash, fractalReplicationRed).toHaveDefense(3);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, fractalReplicationRed).toBeIn("graveyard");
    expectFabCard(Dash, fractalReplicationRed).toHaveDefense(0);
  });
});
