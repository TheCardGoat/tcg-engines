import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { snatchRed } from "../actions/snatch.ts";
import { embraforgedGauntlet } from "./embraforged-gauntlet.ts";

/**
 * Embraforged Gauntlet (PEN192) — Shadow Arms 2{d} Temper, Blood Debt.
 *
 * Printed: If this would be put into your graveyard from anywhere, instead
 * banish it. Temper. Blood Debt.
 *
 * d2 Temper destroys on the second defend (current {d} <= 1). The GY→banish
 * replacement is the Drone/Frankie primitive (destroy to graveyard → banish).
 */

describe("Embraforged Gauntlet (PEN192) AAA", () => {
  it("happy: the second Temper defend banishes this instead of the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: levia, arms: [embraforgedGauntlet], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Levia = game.as(levia);

    Dash.playAttack(snatchRed);
    Levia.defendWith(embraforgedGauntlet);
    game.closeCombat({ optionals: "decline" });
    Dash.playAttack(snatchRed);
    Levia.defendWith(embraforgedGauntlet);
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Levia, embraforgedGauntlet).toBeBanished();
  });

  it("boundary: the first defend only puts a −1{d} and keeps the seat", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: levia, arms: [embraforgedGauntlet], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Levia = game.as(levia);

    Dash.playAttack(snatchRed);
    Levia.defendWith(embraforgedGauntlet);
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Levia, embraforgedGauntlet).toBeIn("arms");
    expectFabCard(Levia, embraforgedGauntlet).toHaveDefenseCounters(-1);
  });

  it("timing: Blood Debt taxes at the owner's end phase while banished", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: levia, arms: [embraforgedGauntlet], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Levia = game.as(levia);

    Dash.playAttack(snatchRed);
    Levia.defendWith(embraforgedGauntlet);
    game.closeCombat({ optionals: "decline" });
    Dash.playAttack(snatchRed);
    Levia.defendWith(embraforgedGauntlet);
    game.closeCombat({ optionals: "decline" });
    const lifeAfterCombat = Levia.life();
    Dash.endTurn();
    Levia.endTurn();
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Levia, embraforgedGauntlet).toBeBanished();
    expectFabPlayer(Levia).toHaveLife(lifeAfterCombat - 1);
  });
});
