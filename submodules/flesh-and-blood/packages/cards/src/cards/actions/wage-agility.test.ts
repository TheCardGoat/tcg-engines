import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { nimblismBlue } from "./nimblism.ts";
import { wageAgilityRed } from "./wage-agility.ts";

/**
 * Wage Agility (HVY169) — Action - Attack, cost 3, 7{p}.
 *
 * Printed: "When this attacks a hero, you may wager a Agility token with them."
 */

describe("Wage Agility family AAA", () => {
  it("happy: attacking a hero may wager a Agility token; a hit awards it to you", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [wageAgilityRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.playAttack(wageAgilityRed, { stopAt: "on-attack" });
    Kassai.accept();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();

    expectFabPlayer(Kassai).toHaveTokenCount("agility", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("agility", 0).toHaveLife(13);
    expectFabCard(Kassai, wageAgilityRed).toBeIn("graveyard");
  });

  it("boundary: declining the wager still deals printed 7 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [wageAgilityRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.playAttack(wageAgilityRed, { stopAt: "on-attack" });
    Kassai.decline();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();

    expectFabPlayer(Kassai).toHaveTokenCount("agility", 0);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("agility", 0).toHaveLife(13);
  });

  it("timing: a miss still opened the on-attack wager window", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [wageAgilityRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.playAttack(wageAgilityRed, { stopAt: "on-attack" });
    Kassai.accept();
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20).toHaveTokenCount("agility", 1);
    expectFabPlayer(Kassai).toHaveTokenCount("agility", 0);
  });
});
