import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { betsy } from "../heroes/betsy.ts";
import { nimblismBlue } from "./nimblism.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { browbeatBlue } from "./browbeat.ts";
import { drinkEmUnderTheTableRed } from "./drink-em-under-the-table.ts";

/**
 * Drink 'em Under the Table (ROS244) — Guardian Action - Attack, cost 4, 8{p}.
 *
 * Printed: When this attacks a hero, you may wager with them. The winner
 * draws a card, and the other hero discards a card.
 */

describe("Drink 'em Under the Table (ROS244) AAA", () => {
  it("happy: a hit draws the attacker a card", () => {
    const game = FabTestEngine.start(
      {
        hero: betsy,
        hand: [drinkEmUnderTheTableRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Betsy = game.as(betsy);

    Betsy.playAttack(drinkEmUnderTheTableRed, { stopAt: "on-attack" });
    Betsy.accept();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(8);
    game.closeCombat({ entityTargets: "minimum" });

    expectFabPlayer(Betsy).toHaveHandCount(1);
    expectFabPlayer(game.as(dash)).toHaveLife(12).toHaveHandCount(0);
    expectFabCard(Betsy, drinkEmUnderTheTableRed).toBeIn("graveyard");
  });

  it("boundary: declining the wager still deals printed 8 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: betsy,
        hand: [drinkEmUnderTheTableRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Betsy = game.as(betsy);

    Betsy.playAttack(drinkEmUnderTheTableRed, { stopAt: "on-attack" });
    Betsy.decline();
    game.advanceUntil({ stopAt: "defend" });
    game.closeCombat();

    expectFabPlayer(Betsy).toHaveHandCount(0);
    expectFabPlayer(game.as(dash)).toHaveLife(12).toHaveHandCount(1);
  });

  it("timing: a miss awards the draw to the defending hero", () => {
    const game = FabTestEngine.start(
      {
        hero: betsy,
        hand: [drinkEmUnderTheTableRed],
        resourcePoints: 4,
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
    const Betsy = game.as(betsy);
    const Dash = game.as(dash);

    Betsy.playAttack(drinkEmUnderTheTableRed, { stopAt: "on-attack" });
    Betsy.accept();
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Betsy).toHaveHandCount(0);
  });

  it("seat: the wager loser is asked to discard from their own hand", () => {
    const game = FabTestEngine.start(
      {
        hero: betsy,
        hand: [drinkEmUnderTheTableRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, brutalAssaultBlue, browbeatBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Betsy = game.as(betsy);
    const Dash = game.as(dash);

    Betsy.playAttack(drinkEmUnderTheTableRed, { stopAt: "on-attack" });
    Betsy.accept(); // Betsy wins the wager on the hit
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith();
    // CR 1.8.6: "the other hero discards" — Dash, the wager loser, picks from
    // his own hand; the clash source's controller never chooses for him.
    game.advanceToDecision(Dash, "entity-target");
    Dash.target(brutalAssaultBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(12); // 8{p} hit
    expectFabPlayer(Betsy).toHaveHandCount(1); // the winner draws
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveHandCount(2);
  });
});
