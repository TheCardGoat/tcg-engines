import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { rallyTheShadowHordeRed } from "./rally-the-shadow-horde.ts";

/**
 * Rally the Shadow Horde — Shadow Action - Attack, cost 3.
 *
 * Printed: Once per Turn Instant - Banish a card from your hand: This gets
 * +2{d}. Activate this only while this card is defending. Blood Debt
 */

describe("Rally the Shadow Horde AAA", () => {
  it("happy: while defending, banishing a card from hand gives this +2 defense", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: chane,
        hand: [rallyTheShadowHordeRed, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    game.as(dash).playAttack(snatchRed);
    Chane.defendWith(rallyTheShadowHordeRed);
    game.helpers.passPriorityTo(Chane);
    Chane.activate(rallyTheShadowHordeRed);
    game.untilIdle();

    expectFabCard(Chane, rallyTheShadowHordeRed).toHaveDefense(4);
    expectFabCard(Chane, nimblismBlue).toBeBanished();
    game.closeCombat();
    expectFabPlayer(Chane).toHaveLife(20);
  });

  it("boundary: cannot activate while this is not defending", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [rallyTheShadowHordeRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.expectActivationRejected(rallyTheShadowHordeRed);
    expectFabCard(Chane, rallyTheShadowHordeRed).toBeIn("hand");
    expectFabCard(Chane, nimblismBlue).toBeIn("hand");
  });
});
