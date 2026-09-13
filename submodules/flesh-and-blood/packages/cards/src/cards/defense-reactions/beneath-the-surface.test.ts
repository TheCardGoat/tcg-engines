import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { beneathTheSurfaceYellow } from "./beneath-the-surface.ts";

/**
 * Beneath the Surface (GEM167) — Pirate Necromancer Defense Reaction.
 * Printed: Watery Grave. While this is defending, when it's put into your
 * graveyard from the arena, turn it face-down.
 */

describe("Beneath the Surface (GEM167) AAA", () => {
  it("happy: defending then going to the graveyard from the arena turns this face-down", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        hand: [beneathTheSurfaceYellow],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    game.toReaction("defender");
    Bravo.must.playReaction(beneathTheSurfaceYellow);
    game.closeCombat();

    expectFabCard(Bravo, beneathTheSurfaceYellow).toBeIn("graveyard");
    expectFabCard(Bravo, beneathTheSurfaceYellow).toBeFaceDown();
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("boundary: sitting in the graveyard from the start is not turned face-down", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, graveyard: [beneathTheSurfaceYellow], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    Bravo.defendWith();
    game.closeCombat();

    expectFabCard(Bravo, beneathTheSurfaceYellow).toBeIn("graveyard");
    expectFabCard(Bravo, beneathTheSurfaceYellow).toBeFaceUp();
    expectFabPlayer(Bravo).toHaveLife(16);
  });

  it("timing: Watery Grave still puts a defending copy into the graveyard, not banished", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        hand: [beneathTheSurfaceYellow],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    game.toReaction("defender");
    Bravo.must.playReaction(beneathTheSurfaceYellow);
    game.closeCombat();

    expectFabCard(Bravo, beneathTheSurfaceYellow).toBeIn("graveyard");
  });
});
