import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { grindingGearsBlue } from "../actions/grinding-gears.ts";
import { snatchRed } from "../actions/snatch.ts";
import { evoSpeedslipBlue } from "./evo-speedslip.ts";

describe("Evo Speedslip (MST231) AAA", () => {
  it("happy: when equipped, the next AAC this turn can pay boost", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [evoSpeedslipBlue],
        hand: [brutalAssaultBlue],
        deck: [snatchRed, grindingGearsBlue],
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: blazeFiremind, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.attackWith(brutalAssaultBlue, { boost: true });
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, grindingGearsBlue).toBeBanished();
    expectFabPlayer(Dash).toHaveAP(1);
    expectFabPlayer(game.as(blazeFiremind)).toHaveLife(16);
  });

  it("boundary: declining Arcane Barrier 1 takes the full 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        resourcePoints: 1,
        legs: [evoSpeedslipBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(blazeFiremind).play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    Dash.expectDecision("option");
    Dash.chooseOptions();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabPlayer(Dash).toHaveResourceCount(1);
    expectFabCard(Dash, evoSpeedslipBlue).toHaveKeyword("arcane-barrier");
  });

  it("timing: without Speedslip seated, an AAC cannot pay the granted boost", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        deck: [brutalAssaultBlue, grindingGearsBlue],
        actionPoints: 1,
      },
      { hero: blazeFiremind, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(snatchRed, { boost: true });
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("banished")).toHaveLength(0);
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
