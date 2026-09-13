import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { wageGoldRed } from "./wage-gold.ts";

describe("Wage Gold (BET012) AAA", () => {
  it("happy: attacking a hero may wager a Gold token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [wageGoldRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(wageGoldRed, { stopAt: "on-attack" });
    Bravo.accept();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(7);
    expect(game.committedEvents().some((event) => event.name === "wager")).toBe(true);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabCard(Bravo, wageGoldRed).toBeIn("graveyard");
  });

  it("boundary: declining the wager still deals printed damage", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [wageGoldRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(wageGoldRed, { stopAt: "on-attack" });
    Bravo.decline();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(7);
    expect(game.committedEvents().some((event) => event.name === "wager")).toBe(false);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });

  it("timing: a miss still opened the on-attack wager window", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [wageGoldRed],
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
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(wageGoldRed, { stopAt: "on-attack" });
    Bravo.accept();
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expect(game.committedEvents().some((event) => event.name === "wager")).toBe(true);
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
