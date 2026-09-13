import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { snatchYellow } from "./snatch.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { tomeOfHarvestsBlue } from "./tome-of-harvests.ts";

/**
 * Tome of Harvests (ELE118) — Earth Action. Go again.
 *
 * Printed: As an additional cost to play Tome of Harvests, put a card from
 * your arsenal on the bottom of your deck. Draw 3 cards. Go again.
 */

describe("Tome of Harvests (ELE118) AAA", () => {
  it("happy: arsenal additional cost bottoms that card and draws 3", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [tomeOfHarvestsBlue],
        arsenal: [nimblismBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [brutalAssaultBlue, snatchYellow, snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(tomeOfHarvestsBlue);
    game.untilIdle();

    expect(Briar.zone("deck")[0]).toBe(nimblismBlue.canonicalId);
    expectFabCard(Briar, snatchRed).toBeIn("hand");
    expectFabCard(Briar, snatchYellow).toBeIn("hand");
    expectFabCard(Briar, brutalAssaultBlue).toBeIn("hand");
    expectFabPlayer(Briar).toHaveHandCount(3);
    expectFabCard(Briar, tomeOfHarvestsBlue).toBeIn("graveyard");
  });

  it("boundary: with an empty arsenal this is unplayable", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [tomeOfHarvestsBlue],
        arsenal: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    expectFabUnplayable(() => Briar.play(tomeOfHarvestsBlue));
    expectFabCard(Briar, tomeOfHarvestsBlue).toBeIn("hand");
  });

  it("timing: go again refunds the action point so a follow-up attack can play", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [tomeOfHarvestsBlue, snatchRed],
        arsenal: [nimblismBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(tomeOfHarvestsBlue);
    game.untilIdle();
    expectFabPlayer(Briar).toHaveAP(1);

    Briar.playAttack(snatchRed);
    expectFabCard(Briar, snatchRed).toBeIn("combatChain");
  });
});
