import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { disableRed } from "./disable.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { stampAuthorityBlue } from "./stamp-authority.ts";

describe("Stamp Authority (CRU028) AAA", () => {
  it("happy: while in the arena, a hitting attack action does not draw on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [stampAuthorityBlue, snatchRed],
        resourcePoints: 3,
        actionPoints: 2,
        deckTop: [nimblismBlue],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(stampAuthorityBlue);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(snatchRed);
    game.closeCombat();

    expectFabCard(Bravo, stampAuthorityBlue).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveHandCount(0);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: without Stamp Authority, Snatch draws on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deckTop: [nimblismBlue],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(snatchRed);
    game.closeCombat();

    expectFabCard(Bravo, nimblismBlue).toBeIn("hand");
  });

  it("timing: two cost-3+ pitched cards give +1 intellect so end-of-turn draws 5", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [stampAuthorityBlue],
        pitch: [disableRed, disableRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 8,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(stampAuthorityBlue);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    game.untilIdle({ ordering: "listed" });

    expectFabPlayer(Bravo).toHaveHandCount(5);
  });
});
