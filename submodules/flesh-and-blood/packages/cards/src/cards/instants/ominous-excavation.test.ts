import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { agility } from "../tokens/agility.ts";
import { sigilOfSolaceRed } from "./sigil-of-solace.ts";
import { ominousExcavationBlue } from "./ominous-excavation.ts";

/**
 * Ominous Excavation Blue (OMN217) — Generic Instant.
 *
 * Printed: You may shuffle an instant card from your graveyard into your deck.
 * If an aura you control was destroyed this turn, create a Ponder token.
 */

describe("Ominous Excavation (OMN217) AAA", () => {
  it("happy: creates a Ponder after an aura you control was destroyed this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: bravo,
        arena: [agility],
        hand: [ominousExcavationBlue],
        graveyard: [sigilOfSolaceRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();
    Bravo.play(ominousExcavationBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabToken(game, "ponder").toHaveCount(1);
    expectFabCard(Bravo, ominousExcavationBlue).toBeIn("graveyard");
  });

  it("boundary: declining the shuffle does not create a Ponder without a destroyed aura", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [ominousExcavationBlue],
        graveyard: [sigilOfSolaceRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(ominousExcavationBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabToken(game, "ponder").toHaveCount(0);
    expectFabCard(Dash, sigilOfSolaceRed).toBeIn("graveyard");
    expectFabCard(Dash, ominousExcavationBlue).toBeIn("graveyard");
  });

  it("timing: can be played without opening combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [ominousExcavationBlue], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(ominousExcavationBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(game.combat()).toBeNull();
    expectFabCard(Dash, ominousExcavationBlue).toBeIn("graveyard");
  });
});
