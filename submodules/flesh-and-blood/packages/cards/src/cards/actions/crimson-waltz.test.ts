import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { crimsonWaltzYellow } from "./crimson-waltz.ts";
import { goldenGrail } from "../weapons/golden-grail.ts";
import { headJabRed } from "./head-jab.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";

/**
 * Crimson Waltz (MPW064) — Warrior Action, cost 2, go again.
 *
 * Printed: "Your next sword attack this turn gets +4{p}.\nThe next time you
 * attack with a sword this turn, draw a card, then put a card from your hand
 * on top of your deck."
 */

describe("Crimson Waltz (MPW064) AAA", () => {
  it("happy: the sword attack gets +4, draws a card, then puts a card on top", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [crimsonWaltzYellow, nimblismBlue],
        deckTop: [snatchRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(crimsonWaltzYellow);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(goldenGrail, { stopAt: "on-attack" });

    expectCombat(game).toHaveAttackPower(7);
    game.untilIdle({ entityTargets: "pause", optionals: "decline" });
    Bravo.target(nimblismBlue);
    game.untilIdle({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveLife(13);
    expectFabPlayer(Bravo).toHaveHandCount(1);
    expect(Bravo.zone("hand")).toContain(snatchRed.canonicalId);
    expect(Bravo.zone("deck")).toContain(nimblismBlue.canonicalId);
  });

  it("boundary: a non-sword attack gets no bonus and no draw-then-put", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [crimsonWaltzYellow, headJabRed],
        deckTop: [snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(crimsonWaltzYellow);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(headJabRed, { optionals: "decline" });

    expectCombat(game).toHaveAttackPower(3);
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expect(Bravo.zone("hand")).not.toContain(snatchRed.canonicalId);
    expectFabCard(Bravo, headJabRed).toBeIn("graveyard");
  });
});
