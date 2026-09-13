import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { cranialCrushBlue } from "./cranial-crush.ts";

describe("Cranial Crush (WTR045) AAA", () => {
  it("happy: after a 4+ crush they cannot draw during their next action phase", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [cranialCrushBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(cranialCrushBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(8);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(12);
    expectFabCard(Bravo, cranialCrushBlue).toBeIn("graveyard");

    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    const handAfterStart = Dash.zone("hand").length;
    Dash.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Dash.zone("hand").length).toBe(handAfterStart - 1);
  });

  it("boundary: 2 damage is not a crush, so they still draw on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [cranialCrushBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(cranialCrushBlue);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(18);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    const handAfterStart = Dash.zone("hand").length;
    Dash.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Dash.zone("hand").length).toBe(handAfterStart);
  });

  it("timing: after their crushed action phase they can draw again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [cranialCrushBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [snatchRed, snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(cranialCrushBlue);
    game.helpers.resolveRestOfCombat();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    const handBefore = Dash.zone("hand").length;
    Dash.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Dash.zone("hand").length).toBe(handBefore);
  });
});
