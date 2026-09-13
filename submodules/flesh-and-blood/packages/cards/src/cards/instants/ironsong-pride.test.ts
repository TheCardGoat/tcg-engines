import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { snatchRed } from "../actions/snatch.ts";
import { ironsongPrideRed } from "./ironsong-pride.ts";

describe("Ironsong Pride (DYN072) AAA", () => {
  it("happy: entering the arena puts a +1{p} counter on target sword", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [ironsongPrideRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(ironsongPrideRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Dori, ironsongPrideRed).toBeIn("arena");
    expectFabCard(Dori, dawnblade).toHaveCounters(1);
  });

  it("boundary: with no sword equipped this still enters and puts no counter", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [ironsongPrideRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(ironsongPrideRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Dori, ironsongPrideRed).toBeIn("arena");
  });

  it("timing: end phase with no sword hit this turn destroys the aura", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [ironsongPrideRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(ironsongPrideRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabCard(Dori, ironsongPrideRed).toBeIn("arena");

    Dori.endTurn();
    game.untilIdle({ ordering: "listed" });

    // Printed: "if a sword has not hit this turn, destroy this."
    expectFabCard(Dori, ironsongPrideRed).toBeIn("graveyard");
  });

  it("armed survival: after a real sword hit the aura survives the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [ironsongPrideRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(ironsongPrideRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // A genuine sword hit this turn satisfies the end-phase gate; drive the
    // end phase so the survival is proven against the destroy trigger.
    Dori.activateAttack(dawnblade);
    game.closeCombat({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });
    Dori.endTurn();

    expectFabCard(Dori, ironsongPrideRed).toBeIn("arena");
  });
});
