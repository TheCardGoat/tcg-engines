import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { relentlessPursuitBlue } from "./relentless-pursuit.ts";

describe("Relentless Pursuit (HNT229) AAA", () => {
  it("happy: marks the opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [relentlessPursuitBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(relentlessPursuitBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toBeMarked();
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: without a prior attack this turn, this stays in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [relentlessPursuitBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(relentlessPursuitBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, relentlessPursuitBlue).toBeIn("graveyard");
  });

  it("timing: after attacking them this turn, this is put on the bottom of its owner's deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, relentlessPursuitBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    Bravo.play(relentlessPursuitBlue);
    game.helpers.resolveUntilIdle();

    expect(Bravo.zone("deck")).toContain(relentlessPursuitBlue.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(relentlessPursuitBlue.canonicalId);
    expectFabPlayer(game.as(dash)).toBeMarked();
  });
});
