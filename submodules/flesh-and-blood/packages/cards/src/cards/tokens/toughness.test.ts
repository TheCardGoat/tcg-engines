import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { ironrotPlate } from "../equipment/ironrot-plate.ts";
import { regurgitatingSlogRed } from "../actions/regurgitating-slog.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { toughness } from "./toughness.ts";

describe("Toughness (APS032) AAA", () => {
  it("happy: at the start of the opponent's turn this is destroyed and your next defending action gets +1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [toughness],
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    expect(Bravo.zone("arena")).not.toContain(toughness.canonicalId);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(19);
  });

  it("boundary: defending with equipment does not get the +1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [toughness],
        chest: [ironrotPlate],
        hand: [],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    game.as(dash).playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(ironrotPlate);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(17);
  });

  it("boundary: only the first of two defending action cards gets +1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [toughness],
        hand: [nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      {
        hero: dash,
        hand: [regurgitatingSlogRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    expect(Bravo.zone("arena")).not.toContain(toughness.canonicalId);

    Dash.playAttack(regurgitatingSlogRed, { pitch: [nimblismBlue] });
    game.advanceCombatTo("defend");
    Bravo.defendWith([nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    // Regurgitating Slog attacks for 6. The first Nimblism defends for 3
    // after Toughness and the second for its printed 2, so exactly 1 damage
    // gets through. Four or six total defense would expose a missing or
    // duplicate Toughness bonus respectively.
    expectFabPlayer(Bravo).toHaveLife(19);
  });

  it("timing: Toughness stays until the opponent's start of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [toughness],
        hand: [nimblismBlue],
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(bravo), toughness).toBeIn("arena");
  });
});
