import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { goldHunterMarauderYellow } from "./gold-hunter-marauder.ts";

/**
 * Gold Hunter Marauder, Yellow (SEA164) — overpower if you control less Gold than an opponent.
 */

describe("Gold Hunter Marauder (SEA164) AAA", () => {
  it("happy: controlling less Gold than the opponent grants overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [goldHunterMarauderYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [fabToken("gold")], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.attackWith(goldHunterMarauderYellow);
    expectCombat(game).toHaveKeyword("overpower");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("boundary: equal Gold does not grant overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [goldHunterMarauderYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);
    const Dash = game.as(dash);

    Gravy.attackWith(goldHunterMarauderYellow);
    expectCombat(game).notToHaveKeyword("overpower");
    Dash.defendWith([snatchRed, nimblismBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("boundary: defends for its printed 2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [goldHunterMarauderYellow],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Gravy = game.as(gravyBones);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Gravy.defendWith([goldHunterMarauderYellow]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Gravy).toHaveLife(18);
  });
});
