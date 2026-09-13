import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { aggressivePounceRed } from "./aggressive-pounce.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { alphaRampageRed } from "./alpha-rampage.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { disableYellow } from "./disable.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { digUpDinnerBlue } from "./dig-up-dinner.ts";

/**
 * Dig Up Dinner (DTD202) — Brute Action, cost 1, 3{d}, go again.
 *
 * Printed: "Choose 3 random cards in your graveyard. Shuffle all attack action
 * cards with 6 or more {p} chosen this way into your deck, then gain that much
 * {h}. Banish this.\nGo again"
 *
 * Shuffle-into-deck is a legal move-card destination; matching 6+{p} attack
 * actions leave the graveyard and this is banished.
 */

describe("Dig Up Dinner (DTD202) AAA", () => {
  it("happy: resolving no longer rejects destination shuffle and banishes this", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [digUpDinnerBlue],
        graveyard: [alphaRampageRed, aggressivePounceRed, disableYellow],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(digUpDinnerBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "maximum" });

    expectFabCard(Rhinar, digUpDinnerBlue).toBeBanished();
  });

  it("boundary: chosen cards that are not 6+{p} attack actions stay in the graveyard and grant no life", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [digUpDinnerBlue],
        graveyard: [nimblismBlue, snatchRed, brutalAssaultBlue],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(digUpDinnerBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Rhinar.zone("graveyard")).toContain(nimblismBlue.canonicalId);
    expect(Rhinar.zone("graveyard")).toContain(snatchRed.canonicalId);
    expect(Rhinar.zone("graveyard")).toContain(brutalAssaultBlue.canonicalId);
    expectFabPlayer(Rhinar).toHaveLife(20);
    expectFabCard(Rhinar, digUpDinnerBlue).toBeBanished();
  });

  it("timing: go again refunds the action point spent to play this", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [digUpDinnerBlue],
        graveyard: [nimblismBlue, snatchRed, brutalAssaultBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(digUpDinnerBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Rhinar).toHaveAP(1);
  });
});
