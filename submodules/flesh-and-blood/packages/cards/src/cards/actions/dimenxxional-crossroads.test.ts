import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { dimenxxionalCrossroadsYellow } from "./dimenxxional-crossroads.ts";
import { kavdaenTraderOfSkins } from "../heroes/kavdaen-trader-of-skins.ts";

/**
 * Dimenxxional Crossroads, Yellow (MON157) — Shadow Runeblade Aura,
 * cost 2. Printed: "Go again / Whenever you play an attack action card or
 * a 'non-attack' action card from the banished zone ... deal 1 arcane
 * damage to target hero. / If you lose {h} during your turn, destroy
 * Dimenxxional Crossroads."
 */

describe("Dimenxxional Crossroads (MON157) AAA", () => {
  it("happy: the aura enters on a clean turn and survives its own gate", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [dimenxxionalCrossroadsYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    // No {h} lost this turn means the destroy gate does not fire.
    Chane.play(dimenxxionalCrossroadsYellow);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Chane, dimenxxionalCrossroadsYellow).toBeIn("arena");
    expectFabPlayer(Chane).toHaveLife(20);
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [dimenxxionalCrossroadsYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(dimenxxionalCrossroadsYellow);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Chane, dimenxxionalCrossroadsYellow).toBeIn("arena");
    expectFabPlayer(Chane).toHaveAP(1);
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("happy: losing life while paying for this destroys it on resolution", () => {
    const game = FabTestEngine.start(
      {
        hero: kavdaenTraderOfSkins,
        hand: [dimenxxionalCrossroadsYellow],
        resourcePoints: 5,
        actionPoints: 2,
        life: 21,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kavdaen = game.as(kavdaenTraderOfSkins);

    Kavdaen.activate(kavdaenTraderOfSkins);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Kavdaen).toHaveLife(20);

    Kavdaen.play(dimenxxionalCrossroadsYellow);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Kavdaen, dimenxxionalCrossroadsYellow).toBeIn("graveyard");
  });
});
