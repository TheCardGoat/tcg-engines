import { describe, it } from "vitest";
import {
  expectCombat,
  fabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { beckonApplause } from "./beckon-applause.ts";

/**
 * Beckon Applause (HVY100) — Warrior Arms d0, Temper.
 * Printed: "If you control an Agility token, this gets +1{d}. / If you
 * control a Vigor token, this gets +1{d}."
 */

describe("Beckon Applause (HVY100) AAA", () => {
  it("happy: an Agility and a Vigor token give +2{d} while defending", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arms: [beckonApplause],
        arena: [fabToken("agility"), fabToken("vigor")],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(beckonApplause);

    expectCombat(game).toBeOpen();
    expectFabCard(Bravo, beckonApplause).toHaveDefense(2);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(18);
  });

  it("boundary: with no tokens this defends at its printed 0{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, arms: [beckonApplause], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(beckonApplause);

    expectFabCard(Bravo, beckonApplause).toHaveDefense(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(16);
  });

  it("contrast: a lone Agility token gives exactly +1{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arms: [beckonApplause],
        arena: [fabToken("agility")],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(beckonApplause);

    expectFabCard(Bravo, beckonApplause).toHaveDefense(1);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(17);
  });
});
