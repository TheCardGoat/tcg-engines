import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { spectralShield } from "../tokens/spectral-shield.ts";
import { goonBeatdownBlue } from "./goon-beatdown.ts";

describe("Goon Beatdown (SUP105) AAA", () => {
  it("happy: three auras make this 4{p} and the crowd boos on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [spectralShield, spectralShield, spectralShield],
        hand: [goonBeatdownBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.playAttack(goonBeatdownBlue);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Bravo).toHaveCrowdBooedThisTurn();
  });

  it("boundary: two auras keep this at 1{p} with no boo", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [spectralShield, spectralShield],
        hand: [goonBeatdownBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.playAttack(goonBeatdownBlue);
    expectCombat(game).toHaveAttackPower(1);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(19);
  });

  it("timing: a miss with three auras does not boo", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [spectralShield, spectralShield, spectralShield],
        hand: [goonBeatdownBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [goonBeatdownBlue, goonBeatdownBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.playAttack(goonBeatdownBlue);
    Dash.defendWith([goonBeatdownBlue, goonBeatdownBlue]);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
