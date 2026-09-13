import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { fogDownYellow } from "../actions/fog-down.ts";
import { snatchRed } from "../actions/snatch.ts";
import { weepingBattlegroundRed } from "./weeping-battleground.ts";

/**
 * Weeping Battleground Red (PEN103) — Runeblade Defense Reaction.
 *
 * Printed: You may banish an aura from your graveyard. If you do, deal 1
 * arcane damage to target hero.
 */

describe("weepingBattleground family AAA", () => {
  it("happy: banishing a graveyard aura pings the attacker for 1 arcane", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: chane,
        hand: [weepingBattlegroundRed],
        graveyard: [fogDownYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Chane = game.as(chane);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Chane.play(weepingBattlegroundRed);
    game.passBoth();
    Chane.accept(); // banish an aura from your graveyard
    Chane.target(Dash); // the 1 arcane damage target
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: fogDownYellow.canonicalId,
    });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Chane).toHaveLife(19); // 20 - (4 - 3 block)
    expectFabPlayer(Dash).toHaveLife(19); // 20 - 1 arcane
    expectFabCard(Chane, fogDownYellow).toBeBanished();
    expectFabCard(Chane, weepingBattlegroundRed).toBeIn("graveyard");
  });

  it("boundary: declining leaves the aura in the graveyard and deals no arcane", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: chane,
        hand: [weepingBattlegroundRed],
        graveyard: [fogDownYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Chane = game.as(chane);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Chane.play(weepingBattlegroundRed);
    game.passBoth();
    Chane.decline();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Chane).toHaveLife(19); // still blocks for printed 3
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Chane, fogDownYellow).toBeIn("graveyard");
  });
});
