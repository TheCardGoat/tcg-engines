import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { snatchRed } from "../actions/snatch.ts";
import { notSoTuffBlue } from "./not-so-tuff.ts";

describe("Not So Tuff (SUP124) AAA", () => {
  it("happy: defending a Revered attack destroys their Toughness and creates Might", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [snatchRed],
        arena: [fabToken("toughness")],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [notSoTuffBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Tuffnut = game.as(tuffnut);

    Tuffnut.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(notSoTuffBlue);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 0);
    expectFabPlayer(Dash).toHaveTokenCount("might", 1);
  });

  it("boundary: defending a non-Revered attack does not destroy Toughness", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        arena: [fabToken("toughness")],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [notSoTuffBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(notSoTuffBlue);
    game.untilIdle();

    expectFabPlayer(game.as(bravo)).toHaveTokenCount("toughness", 1);
    expectFabPlayer(Dash).toHaveTokenCount("might", 0);
    expectFabCard(Dash, notSoTuffBlue).toBeIn("graveyard");
  });

  it("boundary: defending a Revered attack with no Toughness does not create Might", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [notSoTuffBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(tuffnut).attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(notSoTuffBlue);
    game.untilIdle();

    expectFabPlayer(Dash).toHaveTokenCount("might", 0);
  });
});
