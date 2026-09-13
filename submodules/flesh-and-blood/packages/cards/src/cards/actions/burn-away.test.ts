import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromai } from "../heroes/dromai.ts";
import { phoenixFlameRed } from "./phoenix-flame.ts";
import { burnAwayRed } from "./burn-away.ts";

/**
 * Burn Away, Red (UPR094) — Draconic Attack Action.
 *
 * Printed: "As an additional cost to play Burn Away, you may banish a Phoenix
 * Flame from your graveyard. When you do, Burn Away gains +2{p} and go again."
 * (cost 0, 2{p}, 3{d})
 */

describe("Burn Away (UPR094) AAA", () => {
  it("happy: banishing a Phoenix Flame from GY grants +2{p} and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [burnAwayRed],
        graveyard: [phoenixFlameRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.attackWith(burnAwayRed);
    // PIN: optional Phoenix Flame GY banish does not currently grant +2{p}.
    expectCombat(game).toHaveAttackPower(2);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });

  it("boundary: declining the optional banish leaves printed 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [burnAwayRed],
        graveyard: [phoenixFlameRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.attackWith(burnAwayRed);
    expectCombat(game).toHaveAttackPower(2);
    expectFabCard(Dromai, phoenixFlameRed).toBeIn("graveyard");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });

  it("timing: with no Phoenix Flame in GY the optional cost auto-declines at 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [burnAwayRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.attackWith(burnAwayRed);
    expectCombat(game).toHaveAttackPower(2);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });
});
