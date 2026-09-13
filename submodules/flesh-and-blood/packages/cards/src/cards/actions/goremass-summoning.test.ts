import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { levia } from "../heroes/levia.ts";
import { dash } from "../heroes/dash.ts";
import { ebonFold } from "../equipment/ebon-fold.ts";
import { skullCrackRed } from "./skull-crack.ts";
import { goremassSummoningBlue } from "./goremass-summoning.ts";

/**
 * Goremass Summoning, Blue — Shadow Brute Action, cost 2, 3{d}.
 *
 * Printed: "If you've banished a card with 6 or more {p} this turn, create a
 * Blasmophet, the Insatiable Hunger token. Go again"
 */

describe("Goremass Summoning AAA", () => {
  it("happy: after banishing a 6{p} card this turn it creates Blasmophet and refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        head: [ebonFold],
        hand: [skullCrackRed, goremassSummoningBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.activate(ebonFold);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: skullCrackRed.canonicalId });
    expectFabCard(Levia, skullCrackRed).toBeBanished();

    Levia.play(goremassSummoningBlue);
    game.untilIdle();

    expectFabPlayer(Levia).toHaveTokenCount("blasmophet-the-insatiable-hunger", 1).toHaveAP(1);
    expectFabCard(Levia, goremassSummoningBlue).toBeIn("graveyard");
  });

  it("boundary: without a 6+{p} banish this turn it creates no token but still has go again", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [goremassSummoningBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.play(goremassSummoningBlue);
    game.untilIdle();

    expectFabPlayer(Levia).toHaveTokenCount("blasmophet-the-insatiable-hunger", 0).toHaveAP(1);
    expectFabCard(Levia, goremassSummoningBlue).toBeIn("graveyard");
  });
});
