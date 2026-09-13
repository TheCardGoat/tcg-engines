import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { carrionHusk } from "../equipment/carrion-husk.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { hmsMarlinYellow } from "./hms-marlin.ts";

/**
 * HMS Marlin (SEA136) — Pirate Attack, 6{p}.
 * Printed: When this hits a hero, destroy the top card of their deck.
 * High Tide — If there are 2 or more blue cards in your pitch zone, this gets
 * +1{p} and overpower.
 */

describe("HMS Marlin (SEA136) AAA", () => {
  it("happy: a hit destroys the top card of their deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hmsMarlinYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deckTop: [nimblismBlue], life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(hmsMarlinYellow);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
  });

  it("boundary: without High Tide this does not have overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hmsMarlinYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deckTop: [nimblismBlue], life: 20 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(hmsMarlinYellow);
    expectCombat(game).notToHaveKeyword("overpower");
    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: a miss leaves their deck top", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hmsMarlinYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        chest: [carrionHusk],
        deckTop: [snatchRed],
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(hmsMarlinYellow);
    Dash.defendWith([carrionHusk]);
    game.closeCombat({ ordering: "listed" });

    expect(Dash.cardsIn("deck", snatchRed).length).toBe(1);
  });

  it("timing: two blues in pitch give High Tide +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hmsMarlinYellow],
        pitch: [nimblismBlue, nimblismBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deckTop: [snatchRed], life: 20 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(hmsMarlinYellow);
    expectCombat(game).toHaveAttackPower(7);
  });
});
