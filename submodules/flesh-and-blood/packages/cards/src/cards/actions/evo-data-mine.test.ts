import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { wageGoldYellow } from "./wage-gold.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { tekloBaseHead } from "../equipment/teklo-base-head.ts";
import { evoDataMineYellow } from "./evo-data-mine.ts";

/**
 * Evo Data Mine (EVO046) — Mechanologist Action Evo Head d2.
 * Instant destroy-under-this pays by destroying a hosted sub-card (CR 3.0.14).
 */

describe("Evo Data Mine (EVO046) AAA", () => {
  it("happy: destroy the hosted base head, draw the staged top card, topdeck from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [tekloBaseHead],
        hand: [evoDataMineYellow, snatchRed, wageGoldYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deckTop: [nimblismBlue],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    Teklo.play(evoDataMineYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
    expectFabCard(Teklo, evoDataMineYellow).toBeIn("head");
    // CR 3.0.14: the transform seated the base head under the evo.
    expectFabCard(Teklo, tekloBaseHead).toBeUnder(evoDataMineYellow);

    Teklo.activate(evoDataMineYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    // The destroy really happened: the hosted base head reached the graveyard.
    expectFabCard(Teklo, tekloBaseHead).toBeIn("graveyard");
    // The draw happened: the staged deck top is now in hand.
    expect(Teklo.zone("hand")).toContain(nimblismBlue.canonicalId);
    // The topdeck happened: a card that was in hand (never the staged top) is
    // on top of the deck — a reversal would leave nimblism on top untouched.
    const deckTop = Teklo.zone("deck").at(-1);
    expect(deckTop).toBeDefined();
    expect(deckTop).not.toBe(nimblismBlue.canonicalId);
    expect([snatchRed.canonicalId, wageGoldYellow.canonicalId]).toContain(deckTop);
  });

  it("boundary: Instant destroy-under-this is unpayable with no card under this", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [evoDataMineYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(teklovossen).expectActivationRejected(evoDataMineYellow);
  });

  it("timing: without a card under this the Instant cannot grant its draw", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [evoDataMineYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deckTop: [nimblismBlue],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const handBefore = Teklo.zone("hand").length;
    Teklo.expectActivationRejected(evoDataMineYellow);
    expect(Teklo.zone("hand").length).toBe(handBefore);
    expect(Teklo.zone("deck").at(-1)).toBe(nimblismBlue.canonicalId);
  });
});
