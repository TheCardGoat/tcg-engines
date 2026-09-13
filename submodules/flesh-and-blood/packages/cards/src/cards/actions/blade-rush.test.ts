import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dash } from "../heroes/dash.ts";
import { dawnbladeResplendent } from "../weapons/dawnblade-resplendent.ts";
import { snatchRed } from "./snatch.ts";
import { bladeRushYellow } from "./blade-rush.ts";

/**
 * Blade Rush (MPW063) — first sword attack this turn gets go again.
 */

describe("Blade Rush (MPW063) AAA", () => {
  it("happy: the first sword attack this turn gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnbladeResplendent],
        hand: [bladeRushYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(bladeRushYellow);
    game.helpers.resolveUntilIdle();
    Dori.must.activate(dawnbladeResplendent);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dori).toHaveAP(1);
  });

  it("boundary: a non-sword attack does not get go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [bladeRushYellow, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(bladeRushYellow);
    game.helpers.resolveUntilIdle();
    Dori.playAttack(snatchRed);
    expectCombat(game).notToHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dori).toHaveAP(0);
  });

  it("boundary: defends for its printed 2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [bladeRushYellow],
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
    Dori.defendWith([bladeRushYellow]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dori).toHaveLife(18);
  });
});
