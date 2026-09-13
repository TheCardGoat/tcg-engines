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
import { weaveIceRed } from "./weave-ice.ts";
import { snatchRed } from "./snatch.ts";
import { flakeOutRed } from "./flake-out.ts";

describe("Flake Out (ELE056) AAA", () => {
  it("happy: fused still has dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [flakeOutRed],
        hand: [weaveIceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game
      .as(lexi)
      .attackWith(flakeOutRed, { from: "arsenal", fuse: true, fuseCards: [weaveIceRed] });
    expectCombat(game).toHaveKeyword("dominate");
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: lexi, hand: [flakeOutRed], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Lexi.defendWith([flakeOutRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Lexi).toHaveLife(19);
  });
});
