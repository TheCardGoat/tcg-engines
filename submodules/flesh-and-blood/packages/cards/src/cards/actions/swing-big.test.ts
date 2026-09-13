import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { tuffnut } from "../heroes/tuffnut.ts";
import { dash } from "../heroes/dash.ts";
import { buckwildYellow } from "./buckwild.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { swingBigRed } from "./swing-big.ts";

describe("Swing Big (EVR002) AAA", () => {
  it("happy: if this doesn't hit, the defending hero creates a Quicken", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [swingBigRed],
        resourcePoints: 2,
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
    const Tuffnut = game.as(tuffnut);
    const Dash = game.as(dash);

    Tuffnut.attackWith(swingBigRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(8);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("arena").some((id) => /quicken/i.test(id))).toBe(true);
  });

  it("boundary: a hit creates no Quicken", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [swingBigRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);
    const Dash = game.as(dash);

    Tuffnut.attackWith(swingBigRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(12);
    expect(Dash.zone("arena").filter((id) => id === "token:quicken")).toHaveLength(0);
  });

  it("regression: defending with Swing Big creates no Quicken", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [buckwildYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: tuffnut,
        hand: [swingBigRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Tuffnut = game.as(tuffnut);

    Dash.attackWith(buckwildYellow);
    Tuffnut.defendWith(swingBigRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Tuffnut).toHaveLife(17).toHaveTokenCount("quicken", 0);
  });

  it("regression: defending with Swing Big on an earlier chain link creates no Quicken", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: tuffnut,
        hand: [swingBigRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Tuffnut = game.as(tuffnut);

    Dash.playAttack(snatchRed);
    Tuffnut.defendWith(swingBigRed);
    game.advanceUntil({ stopAt: "resolution", ordering: "listed" });
    Dash.playAttack(snatchRed);
    Tuffnut.defendWith();
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Tuffnut).toHaveLife(15).toHaveTokenCount("quicken", 0);
  });
});
