import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue, deathDealer } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { heatSeekerRed } from "./heat-seeker.ts";

/**
 * Heat Seeker (DYN153) — Ranger Arrow Attack, cost 1, 5{p}/3{d}.
 *
 * Printed: When this hits, at the beginning of your end phase, put the top
 * card of your deck face up into your arsenal.
 */

describe("Heat Seeker (DYN153) AAA", () => {
  it("happy: a hit puts the top of your deck face up into arsenal at the beginning of your end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [heatSeekerRed],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.playAttack(heatSeekerRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expect(Azalea.zone("arsenal")).toHaveLength(0);

    Azalea.endTurn();
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Azalea, snatchRed).toBeIn("arsenal").toBeFaceUp();
  });

  it("boundary: a miss does not put a card into arsenal at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [heatSeekerRed],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [brutalAssaultBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(heatSeekerRed, { from: "arsenal" });
    Dash.defendWith(brutalAssaultBlue, nimblismBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    Azalea.endTurn();
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expect(Azalea.zone("arsenal")).toHaveLength(0);
  });

  it("timing: the delayed arsenal load does not fire at hit — only at your end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [heatSeekerRed],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.playAttack(heatSeekerRed, { from: "arsenal" });
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expect(Azalea.zone("arsenal")).toHaveLength(0);
    expectFabCard(Azalea, heatSeekerRed).toBeIn("graveyard");
  });
});
