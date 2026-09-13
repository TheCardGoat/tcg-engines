import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { flattenTheFieldRed } from "./flatten-the-field.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { showTimeBlue } from "./show-time.ts";

/**
 * Show Time! Blue (WTR047) — Bravo specialization Guardian Aura.
 *
 * Printed: When this enters the arena, search your deck for a Guardian attack
 * action card, reveal it and put it into your hand, then shuffle your deck.
 * At the beginning of your action phase, destroy this then draw a card.
 */

describe("Show Time! (WTR047) AAA", () => {
  it("happy: enter-arena searches a Guardian AAC from the deck into hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [showTimeBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [snatchRed, snatchRed, flattenTheFieldRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(showTimeBlue);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: flattenTheFieldRed.canonicalId });

    expectFabCard(Bravo, showTimeBlue).toBeIn("arena");
    expect(Bravo.zone("hand")).toContain(flattenTheFieldRed.canonicalId);
  });

  it("boundary: a deck with no Guardian AAC still enters and fetches nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [showTimeBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [snatchRed, nimblismBlue, snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(showTimeBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Bravo, showTimeBlue).toBeIn("arena");
    expect(Bravo.zone("hand")).toHaveLength(0);
    expect(Bravo.zone("deck")).toContain(snatchRed.canonicalId);
  });

  it("timing: start of your next action phase destroys this and draws", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [showTimeBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: [snatchRed, nimblismBlue, snatchRed, nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(showTimeBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Bravo, showTimeBlue).toBeIn("graveyard");
  });
});
