import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { malice } from "../heroes/malice.ts";
import { snatchRed } from "../actions/snatch.ts";
import { restlessCommanderRed } from "../actions/restless-commander.ts";
import { appallingBearers } from "./appalling-bearers.ts";

/**
 * Appalling Bearers (IAR056) — Shadow Necromancer Arms.
 * Printed: "Instant - Discard a zombie, destroy this: Prevent the next 2
 * damage that would be dealt to you this turn."
 * The zombie leg is paid with a real Restless Commander (Zombie ally, cost 0).
 */

describe("Appalling Bearers (IAR056) AAA", () => {
  it("happy: discarding a zombie and destroying this prevents the next 2 damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      {
        hero: malice,
        arms: [appallingBearers],
        hand: [restlessCommanderRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Malice = game.as(malice);

    Dash.playAttack(snatchRed);
    Malice.defendWith();
    game.toReaction("defender");
    Malice.activate(appallingBearers);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expectFabCard(Malice, appallingBearers).toBeIn("graveyard");
    expectFabCard(Malice, restlessCommanderRed).toBeIn("graveyard");
    expectFabPlayer(Malice).toHaveLife(18);
  });

  it("boundary: without the Instant the full 4 damage lands and this stays equipped", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      {
        hero: malice,
        arms: [appallingBearers],
        hand: [restlessCommanderRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Malice = game.as(malice);

    Dash.playAttack(snatchRed);
    Malice.defendWith();
    game.toReaction("defender");
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expectFabCard(Malice, appallingBearers).toBeIn("arms");
    expectFabPlayer(Malice).toHaveLife(16);
  });
});
