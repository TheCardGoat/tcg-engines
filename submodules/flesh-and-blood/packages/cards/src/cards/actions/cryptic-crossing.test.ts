import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { crypticCrossingYellow } from "./cryptic-crossing.ts";

describe("Cryptic Crossing (DYN173) AAA", () => {
  it("happy: pitching an attack and a non-attack grants first-damage discard and draw", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [crypticCrossingYellow, snatchRed, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);
    Viserai.playAttack(crypticCrossingYellow, { pitch: [snatchRed, nimblismBlue] });
    expectCombat(game).toHaveAttackPower(6);
    game.helpers.resolveRestOfCombat();
    expect(Dash.zone("hand")).not.toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Dash).toHaveLife(14);
    expect(Viserai.zone("hand")).toHaveLength(1);
  });

  it("boundary: paying with resources only does not grant the rider", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [crypticCrossingYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);
    Viserai.playAttack(crypticCrossingYellow);
    game.helpers.resolveRestOfCombat();
    expect(Dash.zone("hand")).toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: viserai, hand: [crypticCrossingYellow], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Viserai.defendWith([crypticCrossingYellow]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Viserai).toHaveLife(19);
  });
});
