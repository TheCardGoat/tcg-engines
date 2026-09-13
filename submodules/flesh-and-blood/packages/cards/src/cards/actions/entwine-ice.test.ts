import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { weaveIceRed } from "./weave-ice.ts";
import { snatchRed } from "./snatch.ts";
import { entwineIceRed } from "./entwine-ice.ts";

describe("Entwine Ice family AAA", () => {
  it("happy: fused still has dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [entwineIceRed, weaveIceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(oldhim).playAttack(entwineIceRed, { fuse: true, fuseCards: [weaveIceRed] });
    expectCombat(game).toHaveKeyword("dominate");
  });

  it("boundary: defends for its printed defense", () => {
    const game = FabTestEngine.start(
      { hero: oldhim, hand: [entwineIceRed], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Hero = game.as(oldhim);
    const Dash = game.as(dash);
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Hero.defendWith([entwineIceRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Hero).toHaveLife(18);
  });
});
