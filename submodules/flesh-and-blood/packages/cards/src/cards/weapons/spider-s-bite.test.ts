import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakniMarionette } from "../heroes/arakni-marionette.ts";
import { snatchRed } from "../actions/snatch.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { sinkBelowRed } from "../defense-reactions/sink-below.ts";
import { spiderSBite } from "./spider-s-bite.ts";

describe("Spider's Bite (DYN115) AAA", () => {
  it("happy: after this hits, the next attack action they defend with has −1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [spiderSBite],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);
    const Dash = game.as(dash);

    Arakni.activate(spiderSBite);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(19);

    Arakni.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(brutalAssaultBlue);
    game.passBoth();

    expectFabCard(Dash, brutalAssaultBlue).toHaveDefense(2);
  });

  it("boundary: a defense reaction is not an attack action and stays at printed {d}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [spiderSBite],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [sinkBelowRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);
    const Dash = game.as(dash);

    Arakni.activate(spiderSBite);
    game.helpers.resolveRestOfCombat();

    Arakni.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Arakni.pass();
    Dash.must.playReaction(sinkBelowRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Dash, sinkBelowRed).toHaveDefense(4);
  });

  it("timing: the attack itself has piercing and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [spiderSBite],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.activate(spiderSBite);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(1);
    expectCombat(game).toHaveKeyword("piercing");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Arakni).toHaveAP(1);
  });
});
