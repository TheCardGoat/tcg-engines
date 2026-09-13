import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { lexi } from "../heroes/lexi.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../weapons/death-dealer.ts";
import { weaveIceRed } from "./weave-ice.ts";
import { blizzardBoltYellow } from "./blizzard-bolt.ts";
import { nimblismBlue } from "./nimblism.ts";
import { amuletOfIceBlue } from "./amulet-of-ice.ts";

describe("Amulet of Ice (ELE172) AAA", () => {
  it("happy: after Ice fusion, destroy this so the opponent discards unless they pay 2", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [{ card: blizzardBoltYellow, state: { faceDown: false } }],
        hand: [amuletOfIceBlue, weaveIceRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], resourcePoints: 0, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    Lexi.playAttack(blizzardBoltYellow, {
      from: "arsenal",
      fuse: true,
      fuseCards: [weaveIceRed],
    });
    game.closeCombat();

    Lexi.play(amuletOfIceBlue);
    game.untilIdle();
    Lexi.activate(amuletOfIceBlue);
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Lexi, amuletOfIceBlue).toBeIn("graveyard");
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
  });

  it("boundary: without Ice fused this turn the Instant is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        hand: [amuletOfIceBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);

    Lexi.play(amuletOfIceBlue);
    game.untilIdle();
    Lexi.expectActivationRejected(amuletOfIceBlue);
    expectFabCard(Lexi, amuletOfIceBlue).toBeIn("arena");
    expectFabPlayer(game.as(dash)).toHaveHandCount(1);
  });
});
