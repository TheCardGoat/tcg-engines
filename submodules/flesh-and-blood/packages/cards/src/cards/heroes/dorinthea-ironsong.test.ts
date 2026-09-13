import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { snatchBlue, snatchRed } from "../actions/snatch.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { dorintheaIronsong } from "./dorinthea-ironsong.ts";

describe("Dorinthea Ironsong (TEA001) AAA", () => {
  it("happy: a weapon hit grants that weapon an additional attack this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dorintheaIronsong,
        weapon1: [dawnblade],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorintheaIronsong);

    Dori.must.activate(dawnblade);
    game.helpers.resolveRestOfCombat();

    expectWait(game).toBeIdle();
    expectFabPlayer(game.as(dash)).toHaveLife(17);
    Dori.must.activate(dawnblade);
    expectCombat(game).toBeOpen();
  });

  it("boundary: a miss, or a non-weapon hit, does not grant another Dawnblade swing", () => {
    const missed = FabTestEngine.start(
      {
        hero: dorintheaIronsong,
        weapon1: [dawnblade],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, snatchBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = missed.as(dorintheaIronsong);
    Dori.must.activate(dawnblade);
    missed.advanceUntil({ stopAt: "defend" });
    missed.as(dash).defendWith(snatchRed, snatchBlue);
    missed.helpers.resolveRestOfCombat();
    Dori.expectActivationRejected(dawnblade);

    const actionHit = FabTestEngine.start(
      {
        hero: dorintheaIronsong,
        weapon1: [dawnblade],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const ActionDori = actionHit.as(dorintheaIronsong);
    ActionDori.must.playAttack(snatchRed);
    actionHit.helpers.resolveRestOfCombat();
    // First-time weapon-hit permission is still unused — Dawnblade is still legal.
    ActionDori.must.activate(dawnblade);
    expectCombat(actionHit).toBeOpen();
  });
});
