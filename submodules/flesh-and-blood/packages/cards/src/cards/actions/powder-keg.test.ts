import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { ironrotPlate } from "../equipment/ironrot-plate.ts";
import { tekloBlaster } from "../weapons/teklo-blaster.ts";
import { snatchRed } from "./snatch.ts";
import { powderKegBlue } from "./powder-keg.ts";

/**
 * Powder Keg, Blue (DYN094) — Mechanologist Item, cost 0.
 * Printed: "Whenever a Mechanologist gun you control hits, you may destroy
 * Powder Keg and a defending equipment."
 */

describe("Powder Keg (DYN094) AAA", () => {
  it("happy: a Mechanologist gun hit may destroy this and a defending equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [tekloBlaster],
        hand: [powderKegBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, chest: [ironrotPlate], hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(powderKegBlue);
    Dash.activateAttack(tekloBlaster);
    Bravo.defendWith(ironrotPlate);
    game.closeCombat({ optionals: "accept", ordering: "listed" });
    Dash.target(ironrotPlate);

    expectFabCard(Dash, powderKegBlue).toBeIn("graveyard");
    expectFabCard(Bravo, ironrotPlate).toBeIn("graveyard");
  });

  it("boundary: a non-gun attack hit does not destroy Powder Keg", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [tekloBlaster],
        hand: [powderKegBlue, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, chest: [ironrotPlate], hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(powderKegBlue);
    Dash.playAttack(snatchRed);
    Bravo.defendWith(ironrotPlate);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, powderKegBlue).toBeIn("arena");
    expectFabCard(Bravo, ironrotPlate).toBeIn("graveyard");
  });

  it("timing: declining the optional leaves Powder Keg and the equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [tekloBlaster],
        hand: [powderKegBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, chest: [ironrotPlate], hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(powderKegBlue);
    Dash.activateAttack(tekloBlaster);
    Bravo.defendWith(ironrotPlate);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, powderKegBlue).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveLife(19);
  });
});
