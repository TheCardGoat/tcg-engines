import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { soulFoodYellow } from "./soul-food.ts";

/**
 * Soul Food (MON064) — Light Action, cost 0, 2{d}.
 *
 * Printed: "Put Soul Food and all cards in your hand into your hero's soul."
 */

describe("Soul Food (MON064) AAA", () => {
  it("happy: Soul Food and the rest of the hand file into the soul", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [soulFoodYellow, snatchRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(soulFoodYellow);
    game.untilIdle();

    expectFabCard(Boltyn, soulFoodYellow).toBeIn("soul");
    expectFabCard(Boltyn, snatchRed).toBeIn("soul");
    expectFabCard(Boltyn, nimblismBlue).toBeIn("soul");
    expectFabPlayer(Boltyn).toHaveHandCount(0);
  });

  it("boundary: with no other cards in hand only Soul Food files to the soul", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [soulFoodYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.play(soulFoodYellow);
    game.untilIdle();

    expectFabCard(Boltyn, soulFoodYellow).toBeIn("soul");
    expectFabCard(Dash, snatchRed).toBeIn("hand");
    expectFabPlayer(Boltyn).toHaveHandCount(0);
  });

  it("timing: printed 2{d} still defends an opposing attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: boltyn,
        hand: [soulFoodYellow],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Boltyn = game.as(boltyn);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Boltyn.defendWith(soulFoodYellow);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Boltyn).toHaveLife(18);
    expectFabCard(Boltyn, soulFoodYellow).toBeIn("graveyard");
  });
});
