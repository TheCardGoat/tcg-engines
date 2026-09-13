import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { dash } from "../heroes/dash.ts";
import { starflowRobes } from "./starflow-robes.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Starflow Robes (OMN143) — Lightning Equipment - Chest.
 *
 * Printed: "Instant - {r}{r}, destroy this: Prevent the next 1 damage that
 * would be dealt to you this turn. If you prevent damage this way, create a
 * Lightning Flow token."
 *
 * Distinct clause vs. its cycle: Starflow Robes prevent damage and mint a
 * Lightning Flow only when the shield actually absorbs damage (Carapace
 * buffs Aphrodias, Touch untaps it, Veil holos auras, Striders reveal).
 */
describe("Starflow Robes (OMN143) AAA", () => {
  it("happy: the shield prevents 1 combat damage and mints a Lightning Flow", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: zyggyStarlight,
        chest: [starflowRobes],
        life: 20,
        resourcePoints: 2,
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    game.as(dash).playAttack(snatchRed);
    game.toReaction("defender");
    // Instant window: {r}{r}, destroy this, prevent the next 1 damage.
    Zyggy.activate(starflowRobes);
    game.helpers.resolveUntilIdle();

    expectFabCard(Zyggy, starflowRobes).toBeIn("graveyard");
    // 4{p} snatch minus the prevented 1 leaves 3 damage.
    expectFabPlayer(Zyggy).toHaveLife(17);
    // The prevented damage minted a Lightning Flow token.
    expectFabPlayer(Zyggy).toHaveTokenCount("lightning-flow", 1);
    expectFabPlayer(Zyggy).toHaveResourceCount(0);
  });

  it("timing: an unused shield expires with the turn — later damage is taken in full and mints nothing", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: zyggyStarlight,
        chest: [starflowRobes],
        life: 20,
        resourcePoints: 2,
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    // Turn 1: destroy the robes, but no damage happens this turn.
    game.helpers.passPriorityTo(Zyggy);
    Zyggy.activate(starflowRobes);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Zyggy).toHaveTokenCount("lightning-flow", 0);

    // The shield expires with dash's end phase; cycle to dash's next turn.
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Zyggy.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // Turn 3: no shield — the snatch deals its full 4.
    Dash.playAttack(snatchRed);
    Zyggy.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Zyggy).toHaveLife(16);
    expectFabPlayer(Zyggy).toHaveTokenCount("lightning-flow", 0);
  });
});
