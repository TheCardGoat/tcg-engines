import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { havocWrap } from "./havoc-wrap.ts";

/**
 * Havoc Wrap (PEN275) — Chaos Equipment Chest d1 Battleworn.
 *
 * Printed: Action - {t}: Go again.
 * If this is tapped, cards cost {r} less to play, this doesn't untap during
 * the end phase, and this gets "At the start of your turn, destroy this."
 */

describe("Havoc Wrap (PEN275) AAA", () => {
  it("happy: tap this for go again (the Action refunds the spent action point)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [havocWrap],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(havocWrap);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: while tapped, the next card costs {r} less", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [havocWrap],
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(havocWrap);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(snatchRed);
    expectFabCard(Bravo, snatchRed).toBeIn("combatChain");
  });

  it("timing: a tapped Havoc Wrap is destroyed at the start of its controller's next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [havocWrap],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(havocWrap);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, havocWrap).toBeIn("graveyard");
  });
});
