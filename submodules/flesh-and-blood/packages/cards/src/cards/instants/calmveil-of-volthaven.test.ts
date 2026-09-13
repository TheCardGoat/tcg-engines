import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { snatchRed } from "../actions/snatch.ts";
import { calmveilOfVolthavenBlue } from "./calmveil-of-volthaven.ts";

describe("Calmveil of Volthaven family AAA", () => {
  it("happy: the blue printing prevents 1 damage and creates Lightning Flow", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: oscilio, hand: [calmveilOfVolthavenBlue], resourcePoints: 2, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Oscilio = game.as(oscilio);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Oscilio.play(calmveilOfVolthavenBlue);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Oscilio).toHaveLife(15);
    expectFabPlayer(Oscilio).toHaveTokenCount("lightning-flow", 1);
    expectFabCard(Oscilio, calmveilOfVolthavenBlue).toBeIn("graveyard");
  });

  it("boundary: with no damage this turn, no Lightning Flow is created", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [calmveilOfVolthavenBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.play(calmveilOfVolthavenBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Oscilio, calmveilOfVolthavenBlue).toBeIn("graveyard");
    expectFabPlayer(Oscilio).toHaveTokenCount("lightning-flow", 0);
  });

  it("timing: the blue printing cannot be played without 2 resources", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [calmveilOfVolthavenBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    expectFabUnplayable(() => Oscilio.play(calmveilOfVolthavenBlue));
    expectFabCard(Oscilio, calmveilOfVolthavenBlue).toBeIn("hand");
  });
});
