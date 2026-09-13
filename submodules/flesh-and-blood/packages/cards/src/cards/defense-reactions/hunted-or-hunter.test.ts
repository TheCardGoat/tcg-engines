import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { azalea } from "../heroes/azalea.ts";
import { rapidReflexYellow } from "../attack-reactions/rapid-reflex.ts";
import { snatchRed } from "../actions/snatch.ts";
import { huntedOrHunterRed } from "./hunted-or-hunter.ts";

/**
 * Hunted or Hunter (ARK017) — Assassin Defense Reaction Trap, 3{d}.
 * Printed: When this defends and the attacking hero has played or activated
 * an attack reaction this chain link, they lose 1{h}.
 */

describe("Hunted or Hunter (ARK017) AAA", () => {
  it("happy: defending after an attacking-hero attack reaction taxes 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, rapidReflexYellow],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: azalea,
        arsenal: [{ card: huntedOrHunterRed, state: { faceDown: false } }],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.playAttack(snatchRed);
    game.toReaction("attacker");
    Bravo.must.playReaction(rapidReflexYellow);
    game.toReaction("defender");
    Azalea.must.playFromArsenal(huntedOrHunterRed);
    game.untilIdle({ optionals: "decline" });

    // The attacking hero loses 1{h} for the earlier attack reaction; the
    // Rapid Reflex-boosted Snatch (6{p}) gets through the trap's 3{d} for 3.
    expectFabPlayer(Bravo).toHaveLife(19);
    expectFabPlayer(Azalea).toHaveLife(17);
  });

  it("boundary: defending with no attacking-hero reaction this link taxes nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: azalea,
        arsenal: [{ card: huntedOrHunterRed, state: { faceDown: false } }],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.playAttack(snatchRed);
    game.toReaction("defender");
    Azalea.must.playFromArsenal(huntedOrHunterRed);
    game.untilIdle({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabPlayer(Azalea).toHaveLife(19); // 4{p} vs 3{d}
  });
});
