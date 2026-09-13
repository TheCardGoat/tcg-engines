import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { goldkissRum } from "./goldkiss-rum.ts";

describe("Goldkiss Rum (SEA245) AAA", () => {
  it("happy: destroy this to give your next action go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [goldkissRum],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(goldkissRum);
    game.helpers.resolveUntilIdle();
    expect(Bravo.zone("arena")).not.toContain(goldkissRum.canonicalId);

    Bravo.playAttack(snatchRed);
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: a non-Pirate hero is tapped as the Instant cost", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [goldkissRum],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(goldkissRum);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, bravo).toBeTapped();
    expect(Bravo.zone("arena")).not.toContain(goldkissRum.canonicalId);
  });

  it("timing: a non-Pirate hero stays tapped through the end-phase untap", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [goldkissRum],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(goldkissRum);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    expectFabCard(Bravo, bravo).toBeTapped();
  });
});
