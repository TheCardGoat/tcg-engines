import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { bravo } from "../heroes/bravo.ts";
import { flamebornRetributionRed } from "../actions/flameborn-retribution.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { chainReactionYellow } from "./chain-reaction.ts";

/**
 * Chain Reaction, Yellow (HNT253) — Ranger Defense Reaction Trap, 0-cost 3{d}.
 * Printed: When this defends an attack with go again, you may turn a non-attack
 * action card in your arsenal face-up. If you do, you may play it this turn as
 * though it were an instant.
 */

describe("Chain Reaction (HNT253) AAA", () => {
  it("happy: defending a go-again attack may turn a non-attack arsenal action face-up", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [flamebornRetributionRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: azalea,
        hand: [chainReactionYellow],
        arsenal: [nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    game.as(bravo).playAttack(flamebornRetributionRed);
    game.toReaction("defender");
    Azalea.must.playReaction(chainReactionYellow);
    game.untilIdle({ optionals: "accept", entityTargets: "pause" });
    Azalea.target(nimblismBlue);
    game.untilIdle();
    game.as(bravo).pass();
    Azalea.play(nimblismBlue, { from: "arsenal" });
    game.untilIdle();

    expectFabCard(Azalea, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Azalea, chainReactionYellow).toBeIn("graveyard");
  });

  it("boundary: defending an attack without go again does not turn arsenal face-up", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: azalea,
        hand: [chainReactionYellow],
        arsenal: [nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    game.as(bravo).attackWith(snatchRed);
    game.toReaction("defender");
    Azalea.must.playReaction(chainReactionYellow);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Azalea, nimblismBlue).toBeFaceDown();
    expectFabPlayer(Azalea).toHaveLife(19);
  });

  it("timing: declining the optional leaves the arsenal card face-down", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [flamebornRetributionRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: azalea,
        hand: [chainReactionYellow],
        arsenal: [nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    game.as(bravo).playAttack(flamebornRetributionRed);
    game.toReaction("defender");
    Azalea.must.playReaction(chainReactionYellow);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Azalea, nimblismBlue).toBeFaceDown();
  });
});
