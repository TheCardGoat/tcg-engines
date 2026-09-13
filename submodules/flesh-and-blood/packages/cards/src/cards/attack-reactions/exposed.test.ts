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
import { snatchRed } from "../actions/snatch.ts";
import { exposedBlue } from "./exposed.ts";

describe("Exposed (HNT237) AAA", () => {
  it("happy: target attack gets +1{p} and the defending hero is marked", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, exposedBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Bravo.must.playReaction(exposedBlue);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
    expectFabPlayer(game.as(dash)).toBeMarked();
  });

  it("boundary: a marked hero cannot play this", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, exposedBlue],
        marked: true,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    expect(() => Bravo.must.playReaction(exposedBlue)).toThrow();
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Bravo, exposedBlue).toBeIn("hand");
  });

  it("timing: cannot play Exposed outside the reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, exposedBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(bravo).play(exposedBlue)).toThrow();
    expectFabCard(game.as(bravo), exposedBlue).toBeIn("hand");
  });
});
