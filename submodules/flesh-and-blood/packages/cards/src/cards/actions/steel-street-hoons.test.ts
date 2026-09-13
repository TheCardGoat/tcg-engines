import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { cerebellumProcessorBlue } from "./cerebellum-processor.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { steelStreetHoonsBlue } from "./steel-street-hoons.ts";

/**
 * Steel Street Hoons, Blue (EVO141) — Mechanologist Action Attack, 3{p}/2{d}.
 * Printed: Boost. If an item you control has been destroyed this turn, this
 * gets +2{p}. Galvanize — When this defends, you may destroy an item you
 * control. If you do, this gets +2{d}.
 */

describe("Steel Street Hoons (EVO141) AAA", () => {
  it("happy: destroying an item you control while defending grants +2{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        hand: [steelStreetHoonsBlue],
        arena: [cerebellumProcessorBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(steelStreetHoonsBlue);
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    Dash.target(cerebellumProcessorBlue);

    expectFabCard(Dash, cerebellumProcessorBlue).toBeIn("graveyard");
    expectFabCard(Dash, steelStreetHoonsBlue).toHaveDefense(4);
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: declining galvanize leaves printed 2{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      {
        hero: dash,
        hand: [steelStreetHoonsBlue],
        arena: [cerebellumProcessorBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(steelStreetHoonsBlue);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, cerebellumProcessorBlue).toBeIn("arena");
    expectFabCard(Dash, steelStreetHoonsBlue).toHaveDefense(2);
    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("timing: without a destroyed item this turn the attack is printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [steelStreetHoonsBlue],
        deck: 6,
        resourcePoints: 3,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).playAttack(steelStreetHoonsBlue, { stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3);
  });
});
