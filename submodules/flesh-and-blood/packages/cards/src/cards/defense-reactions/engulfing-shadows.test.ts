import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { snatchRed } from "../actions/snatch.ts";
import { engulfingShadowsYellow } from "./engulfing-shadows.ts";

/**
 * Engulfing Shadows Yellow (PEN194) — Shadow Defense Reaction. Blood Debt.
 *
 * Printed: If this would be put into your graveyard from anywhere, instead
 * banish it.
 */

describe("Engulfing Shadows (PEN194) AAA", () => {
  it("happy: blocking sends it to banishment instead of the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: chane,
        hand: [engulfingShadowsYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Chane = game.as(chane);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Chane.play(engulfingShadowsYellow);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Chane).toHaveLife(20); // 4 - 4 full block
    expectFabCard(Chane, engulfingShadowsYellow).toBeBanished();
    expect(Chane.zone("graveyard")).not.toContain(engulfingShadowsYellow.canonicalId);
  });

  it("timing: Blood Debt drains 1 life at the end phase while banished", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        banished: [engulfingShadowsYellow],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Chane).toHaveLife(19);
  });
});
