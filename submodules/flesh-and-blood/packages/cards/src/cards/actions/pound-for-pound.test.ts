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
import { poundForPoundRed } from "./pound-for-pound.ts";

describe("Pound for Pound (MON278) AAA", () => {
  it("happy: less life than the opponent grants dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [poundForPoundRed],
        resourcePoints: 3,
        actionPoints: 1,
        life: 15,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(poundForPoundRed);
    expectCombat(game).toHaveAttackPower(6);
    expectCombat(game).toHaveKeyword("dominate");
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabCard(Bravo, poundForPoundRed).toBeIn("graveyard");
  });

  it("boundary: equal or greater life does not grant dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [poundForPoundRed],
        resourcePoints: 3,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(poundForPoundRed);
    expectCombat(game).toHaveAttackPower(6);
    expectCombat(game).notToHaveKeyword("dominate");
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("timing: dominate limits the defender to one hand card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [poundForPoundRed],
        resourcePoints: 3,
        actionPoints: 1,
        life: 15,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(poundForPoundRed);
    expectCombat(game).toHaveKeyword("dominate");
    Dash.defendWith(nimblismBlue);
    expect(() => Dash.defendWith(nimblismBlue)).toThrow();
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(16);
  });
});
