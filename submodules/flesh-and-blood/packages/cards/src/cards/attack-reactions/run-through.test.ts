import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dash } from "../heroes/dash.ts";
import { dawnbladeResplendent } from "../weapons/dawnblade-resplendent.ts";
import { snatchRed } from "../actions/snatch.ts";
import { runThroughRed } from "./run-through.ts";

/**
 * Run Through, Red (MPW048) — target sword attack gets go again.
 */

describe("run-through family AAA", () => {
  it("happy: target sword attack gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnbladeResplendent],
        hand: [runThroughRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.must.activate(dawnbladeResplendent);
    game.advanceCombatTo("reaction");
    Dori.must.playReaction(runThroughRed);
    game.passBoth();
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dori).toHaveAP(1);
  });

  it("boundary: an attack action is not a legal sword-attack target", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [snatchRed, runThroughRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Dori.must.playReaction(runThroughRed));
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [runThroughRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Dori.defendWith([runThroughRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dori).toHaveLife(19);
  });
});
