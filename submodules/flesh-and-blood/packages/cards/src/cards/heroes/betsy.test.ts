import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { betsy } from "./betsy.ts";
import { wageGoldRed } from "../actions/wage-gold.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Hero behavior acceptance test — Betsy (BET001).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: wager trigger → optional pay {r}{r} → +1{p} and overpower
 * - Core interaction: overpower enforced
 * - Boundaries: no pay = no bonus, non-wager attacks unaffected
 *
 * Signature weapon: High Riser (BET002)
 * Guardian/Young — 20hp
 */

const hero = betsy;
const opponentHero = dash;

// ---------------------------------------------------------------------------
// betsy (BET001) — Guardian/Young — 20hp
// Printed: "Whenever an attack you control wagers, you may pay {r}{r}.
// If you do, the attack gets +1{p} and overpower."
// Signature weapon: High Riser (BET002) — 1H Guardian Hammer, 3{p}
// ---------------------------------------------------------------------------

describe("betsy (BET001)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start({ hero, deck: 6 }, { hero: opponentHero, deck: 6 });
    expectFabPlayer(game.as(hero)).toHaveLife(20);
  });

  it("core mechanic: paying {r}{r} on a wager grants +1{p} and overpower", () => {
    // wage-gold-red is a Generic Action Attack that wagers a Gold token on attack.
    const game = FabTestEngine.start(
      {
        hero,
        hand: [wageGoldRed],
        resourcePoints: 5, // 3 for attack + 2 for the optional pay
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(hero);

    Bravo.playAttack(wageGoldRed, { stopAt: "on-attack" });
    Bravo.accept();
    game.advanceUntil({ stopAt: "defend", optionals: "accept" });

    expectCombat(game).toHaveAttackPower(8).toHaveKeyword("overpower");
  });

  it("boundaries: declining the {r}{r} pay leaves the printed 7{p} without overpower", () => {
    const game = FabTestEngine.start(
      {
        hero,
        hand: [wageGoldRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(hero);

    Bravo.playAttack(wageGoldRed, { stopAt: "on-attack" });
    Bravo.decline();
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(7).notToHaveKeyword("overpower");
  });

  it("boundaries: non-wager attack does not trigger the pay ability", () => {
    const game = FabTestEngine.start(
      {
        hero,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(hero);

    Bravo.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(4).notToHaveKeyword("overpower");
    game.closeCombat();
    expectFabPlayer(game.as(opponentHero)).toHaveLife(16);
  });
});
