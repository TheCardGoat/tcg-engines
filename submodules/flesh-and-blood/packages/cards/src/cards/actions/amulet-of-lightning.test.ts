import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { lexi } from "../heroes/lexi.ts";
import { deathDealer } from "../weapons/death-dealer.ts";
import { snatchRed } from "./snatch.ts";
import { weaveLightningRed } from "./weave-lightning.ts";
import { buzzBoltYellow } from "./buzz-bolt.ts";
import { amuletOfLightningBlue } from "./amulet-of-lightning.ts";

/**
 * Amulet of Lightning (ELE201) — Lightning Item blue.
 *
 * Printed Instant: Destroy Amulet of Lightning: Target action card gains go
 * again. Activate only if you have Lightning fused this turn.
 */

describe("Amulet of Lightning (ELE201) AAA", () => {
  it("happy: after Lightning fusion, destroy this so the attack gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arena: [amuletOfLightningBlue],
        arsenal: [{ card: buzzBoltYellow, state: { faceDown: false } }],
        hand: [weaveLightningRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);

    Lexi.playAttack(buzzBoltYellow, {
      from: "arsenal",
      fuse: true,
      fuseCards: [weaveLightningRed],
    });
    game.toReaction("attacker");
    Lexi.activate(amuletOfLightningBlue);
    game.passBoth();

    expectCombat(game).toHaveKeyword("go-again");
    expectFabCard(Lexi, amuletOfLightningBlue).toBeIn("graveyard");
  });

  it("boundary: without Lightning fused this turn the Instant is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        arena: [amuletOfLightningBlue],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);

    Lexi.playAttack(snatchRed);
    Lexi.expectActivationRejected(amuletOfLightningBlue);
    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("timing: fusion this turn is required even after the item is seated", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        arena: [amuletOfLightningBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(lexi).expectActivationRejected(amuletOfLightningBlue);
    expectFabCard(game.as(lexi), amuletOfLightningBlue).toBeIn("arena");
  });
});
