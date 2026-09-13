import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { lexi } from "../heroes/lexi.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { lightningPressRed } from "../instants/lightning-press.ts";
import { snatchRed } from "./snatch.ts";
import { dazzlingCrescendoRed } from "./dazzling-crescendo.ts";

describe("Dazzling Crescendo (ELE053) AAA", () => {
  it("happy: fused still has go-again", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [dazzlingCrescendoRed],
        hand: [lightningPressRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(lexi).attackWith(dazzlingCrescendoRed, {
      from: "arsenal",
      fuse: true,
      fuseCards: [lightningPressRed],
    });
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: lexi, hand: [dazzlingCrescendoRed], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Lexi.defendWith([dazzlingCrescendoRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Lexi).toHaveLife(19);
  });
});
