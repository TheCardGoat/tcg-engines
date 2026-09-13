import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { bracersOfBelief } from "./bracers-of-belief.ts";

describe("Bracers of Belief (ARC153) AAA", () => {
  it("happy: destroy and reveal a red (pitch 1) — next AAC gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [bracersOfBelief],
        hand: [snatchRed],
        // Last entry is the top card revealed.
        deck: [nimblismBlue, snatchRed],
        actionPoints: 1,
      },
      { hero: bravo, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(bracersOfBelief);
    game.passBoth();

    expectFabCard(Dash, bracersOfBelief).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveAP(1);

    Dash.attackWith(snatchRed);

    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
  });

  it("boundary: revealing a blue (pitch 3) grants +0{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [bracersOfBelief],
        hand: [snatchRed],
        deck: [snatchRed, nimblismBlue],
        actionPoints: 1,
      },
      { hero: bravo, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(bracersOfBelief);
    game.passBoth();
    Dash.attackWith(snatchRed);

    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: empty deck — reveal fails and the next AAC stays at printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [bracersOfBelief],
        hand: [snatchRed],
        deck: [],
        actionPoints: 1,
      },
      { hero: bravo, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(bracersOfBelief);
    game.passBoth();
    expectFabCard(Dash, bracersOfBelief).toBeIn("graveyard");

    Dash.attackWith(snatchRed);

    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });
});
