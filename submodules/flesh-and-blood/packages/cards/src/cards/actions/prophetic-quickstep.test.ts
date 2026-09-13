import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { vynnset } from "../heroes/vynnset.ts";

import { propheticQuickstepYellow } from "./prophetic-quickstep.ts";

/**
 * Prophetic Quickstep Yellow (OMN055) — Lightning Runeblade Attack.
 *
 * Printed: Quickstrike - If this has go again, it gets +1{p} and "When
 * this attacks a hero, deal 1 arcane damage to them."
 * The first time this deals damage to a hero, create a Runechant token.
 */

describe("Dashing Flashfoot (OMN055) AAA", () => {
  it("happy+pin: printed damage green; first-damage Runechant trigger inert", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [propheticQuickstepYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);
    const Dash = game.as(dash);

    Vynnset.playAttack(propheticQuickstepYellow);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    // Base leg: printed 3 damage lands; the first-damage Runechant
    // trigger is PINNED inert (0 tokens — same family as the delayed
    // first-damage latches).
    expectFabPlayer(Dash).toHaveLife(17); // 20 - 3
    expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 0);
    expectFabCard(Vynnset, propheticQuickstepYellow).toBeIn("graveyard");
  });
});
