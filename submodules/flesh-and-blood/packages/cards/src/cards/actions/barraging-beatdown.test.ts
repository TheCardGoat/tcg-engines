import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { riledUpRed } from "./riled-up.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { barragingBeatdownRed, barragingBeatdownYellow } from "./barraging-beatdown.ts";

describe("Barraging Beatdown (WTR017) AAA", () => {
  it("happy: the next Brute attack has +4{p} while defended by fewer than 2 non-equipment cards", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [barragingBeatdownRed, riledUpRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(barragingBeatdownRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Rhinar).toHaveAP(1);

    Rhinar.attackWith(riledUpRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(11);
  });

  it("color variant: the yellow member grants +3{p} while defended by fewer than 2 non-equipment cards", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [barragingBeatdownYellow, riledUpRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(barragingBeatdownYellow);
    game.helpers.resolveUntilIdle();
    Rhinar.attackWith(riledUpRed);

    expect(game.combat()?.activeLink?.attackPower).toBe(10);
  });

  it("boundary: a Generic attack does not receive the while-defended +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [barragingBeatdownRed, brutalAssaultBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(barragingBeatdownRed);
    game.helpers.resolveUntilIdle();
    Rhinar.attackWith(brutalAssaultBlue, { pitch: [nimblismBlue, nimblismBlue] });
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: two non-equipment defenders drop the +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [barragingBeatdownRed, riledUpRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue, nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.play(barragingBeatdownRed);
    game.helpers.resolveUntilIdle();
    Rhinar.attackWith(riledUpRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(11);

    game.advanceCombatTo("defend");
    Dash.defendWith(brutalAssaultBlue, nimblismBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
  });
});
