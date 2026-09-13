import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { waxOnRed } from "./wax-on.ts";
import { waxOffBlue } from "./wax-off.ts";

/**
 * Wax Off (EVO239) — Ninja Defense Reaction, 2{d}.
 * Printed: "If you've played Wax On this turn, create a Zen State token."
 */

describe("Wax Off (EVO239) AAA", () => {
  it("happy: after playing Wax On this turn, Wax Off creates a Zen State token", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      { hero: fai, life: 20, hand: [waxOnRed, waxOffBlue], resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Fai = game.as(fai);

    // Link 1: Wax On resolves as a defense reaction this turn.
    Dash.playAttack(snatchRed);
    game.toReaction("defender");
    Fai.must.playReaction(waxOnRed);
    game.helpers.resolveRestOfCombat();

    // Link 2: Wax Off's condition now reads true.
    Dash.playAttack(snatchRed);
    game.toReaction("defender");
    Fai.must.playReaction(waxOffBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Fai).toHaveTokenCount("zen-state", 1);
    expectFabCard(Fai, waxOffBlue).toBeIn("graveyard");
  });

  it("boundary: without playing Wax On this turn, no Zen State is created", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: fai, life: 20, hand: [waxOffBlue], resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Fai = game.as(fai);

    Dash.playAttack(snatchRed);
    game.toReaction("defender");
    Fai.must.playReaction(waxOffBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Fai).toHaveTokenCount("zen-state", 0);
    expectFabCard(Fai, waxOffBlue).toBeIn("graveyard");
  });
});
