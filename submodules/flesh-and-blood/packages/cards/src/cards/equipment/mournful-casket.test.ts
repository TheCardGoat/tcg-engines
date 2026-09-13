import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { limpitHopALongYellow } from "../actions/limpit-hop-a-long.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { woundingBlowBlue } from "../actions/wounding-blow.ts";
import { snatchRed } from "../actions/snatch.ts";
import { mournfulCasket } from "./mournful-casket.ts";

/**
 * Mournful Casket (PEN153) — Necromancer Chest, 1{d}, Temper.
 *
 * Printed: If an ally has been put into your graveyard this turn, this gets
 * +1{d}. Temper.
 *
 * The ally-target pin was a false diagnosis: `play(attack, { target: allyId })`
 * kills the controller's ally into their GY (printed "your graveyard"), then
 * a later attack can defend with the buffed Casket.
 */

describe("Mournful Casket (PEN153) AAA", () => {
  it("happy: an ally put into your GY this turn gives +1{d}; Temper keeps the seat", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [woundingBlowBlue, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: bravo,
        chest: [mournfulCasket],
        arena: [limpitHopALongYellow],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    const allyId = Bravo.cardIn("arena", limpitHopALongYellow).instanceId;

    Dash.play(woundingBlowBlue, { target: allyId });
    game.closeCombat({ optionals: "decline" });
    expectFabCard(Bravo, limpitHopALongYellow).toBeIn("graveyard");

    Dash.playAttack(snatchRed);
    Bravo.defendWith(mournfulCasket);
    expectFabCard(Bravo, mournfulCasket).toHaveDefense(2);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, mournfulCasket).toBeIn("chest");
    expectFabCard(Bravo, mournfulCasket).toHaveDefenseCounters(-1);
  });

  it("boundary: with no ally death the casket defends at printed 1{d} and Temper recycles it", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        chest: [mournfulCasket],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(mournfulCasket);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(17);
    expectFabCard(Bravo, mournfulCasket).toBeIn("graveyard");
  });

  it("timing: an ally already in the GY from setup is not this turn, so no +1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        chest: [mournfulCasket],
        graveyard: [limpitHopALongYellow],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(mournfulCasket);
    expectFabCard(Bravo, mournfulCasket).toHaveDefense(1);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(17);
    expectFabCard(Bravo, mournfulCasket).toBeIn("graveyard");
  });
});
