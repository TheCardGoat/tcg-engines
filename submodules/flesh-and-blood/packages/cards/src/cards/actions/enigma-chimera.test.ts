import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { wreckerRompBlue } from "./wrecker-romp.ts";
import { nimblismBlue } from "./nimblism.ts";
import { prism } from "../heroes/prism.ts";
import { enigmaChimeraRed } from "./enigma-chimera.ts";

/**
 * Enigma Chimera (MON098) — Illusionist Action - Attack, 8{p}/3{d}, cost 2.
 * Printed: Phantasm.
 */

describe("Enigma Chimera (MON098) AAA", () => {
  it("happy: undefended hits for printed 8 and has phantasm", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [enigmaChimeraRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(enigmaChimeraRed);
    expectCombat(game).toHaveAttackPower(8).toHaveKeyword("phantasm");
    game.closeCombat();

    expectCombat(game).toBeClosed();
    expectFabPlayer(Dash).toHaveLife(12);
    expectFabCard(Prism, enigmaChimeraRed).toBeIn("graveyard");
  });

  it("boundary: defending with Nimblism does not pop phantasm; remaining damage is dealt", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [enigmaChimeraRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(enigmaChimeraRed);
    expectCombat(game).toHaveKeyword("phantasm").toHaveAttackPower(8);
    Dash.defendWith(nimblismBlue);
    expectCombat(game).toHaveKeyword("phantasm");
    game.closeCombat();

    expectCombat(game).toBeClosed();
    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Prism, enigmaChimeraRed).toBeIn("graveyard");
  });

  it("timing: a 6-power attack-action defender pops phantasm, destroys this, and closes combat", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [enigmaChimeraRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [wreckerRompBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(enigmaChimeraRed);
    expectCombat(game).toHaveKeyword("phantasm").toHaveAttackPower(8);
    Dash.defendWith(wreckerRompBlue);
    game.untilIdle();

    expectFabCard(Prism, enigmaChimeraRed).toBeIn("graveyard");
    expectCombat(game).toBeClosed();
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
