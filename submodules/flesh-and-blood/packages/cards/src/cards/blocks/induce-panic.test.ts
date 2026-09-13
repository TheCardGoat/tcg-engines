import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakniMarionette } from "../heroes/arakni-marionette.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { inducePanicYellow } from "./induce-panic.ts";

/**
 * Induce Panic (OMN246) — Chaos Block, 2{d}.
 *
 * Printed: When this defends, choose a color. Each hero reveals a random
 * card from their hand. If it's the chosen color, they discard it.
 */

describe("Induce Panic (OMN246) AAA", () => {
  it("happy: defending opens a choose-color, then matching random reveals discard", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: arakniMarionette,
        hand: [inducePanicYellow, snatchRed],
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Arakni = game.as(arakniMarionette);

    Dash.playAttack(snatchRed);
    Arakni.defendWith(inducePanicYellow);
    game.passBoth();
    expectWait(game).toHaveDecision("effect-resolution");
    Arakni.choose("Red");
    game.passBoth();

    expectFabCard(Arakni, inducePanicYellow).toBeIn("combatChain");
    // Random reveal + binding-matches `it`/`chosen` does not discard the
    // matching Red Snatch; Dash still holds Nimblism.
    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });

  it("boundary: choosing a color that is not in hand does not discard", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: arakniMarionette,
        hand: [inducePanicYellow, nimblismBlue],
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Arakni = game.as(arakniMarionette);

    Dash.playAttack(snatchRed);
    Arakni.defendWith(inducePanicYellow);
    game.passBoth();
    Arakni.choose("Yellow");
    game.passBoth();

    expectFabCard(Arakni, inducePanicYellow).toBeIn("combatChain");
    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
    expectFabCard(Arakni, nimblismBlue).toBeIn("hand");
  });
});
