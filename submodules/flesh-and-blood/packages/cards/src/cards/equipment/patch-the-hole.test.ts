import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { fai } from "../heroes/fai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { patchTheHole } from "./patch-the-hole.ts";

/**
 * Patch the Hole (SEA096) — Ranger Head d0.
 * Printed: "Instant - Destroy this: Return a card from your arsenal to your hand."
 */

describe("Patch the Hole (SEA096) AAA", () => {
  it("happy: destroys this and returns the arsenal card to hand", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        head: [patchTheHole],
        arsenal: [snatchRed],
        hand: [],
        deck: 6,
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(patchTheHole);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Azalea, patchTheHole).toBeIn("graveyard");
    expectFabPlayer(Azalea).toHaveHandCount(1);
    expect(Azalea.zone("hand")).toContain(snatchRed.canonicalId);
    expect(Azalea.zone("arsenal")).toEqual([]);
  });

  it("timing: the Instant refreshes mid-combat on the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: azalea,
        life: 20,
        head: [patchTheHole],
        arsenal: [snatchRed],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Azalea = game.as(azalea);

    Fai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Azalea.defendWith();
    game.toReaction("defender");
    Azalea.activate(patchTheHole);
    // Draining from here resolves the layer and the rest of combat.
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    // The Instant refreshed mid-combat; the unblocked attack still lands.
    expectFabPlayer(Azalea).toHaveHandCount(1);
    expect(Azalea.zone("hand")).toContain(snatchRed.canonicalId);
    expectFabCard(Azalea, patchTheHole).toBeIn("graveyard");
    expectFabPlayer(Azalea).toHaveLife(16); // 20 - 4
  });

  it("boundary: with an empty arsenal the Instant has nothing to return", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        head: [patchTheHole],
        arsenal: [],
        hand: [],
        deck: 6,
      },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(patchTheHole);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Azalea, patchTheHole).toBeIn("graveyard");
    expectFabPlayer(Azalea).toHaveHandCount(0);
  });
});
