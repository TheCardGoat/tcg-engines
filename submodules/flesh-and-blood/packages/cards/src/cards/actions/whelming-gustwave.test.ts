import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { benjiThePiercingWind } from "../heroes/benji-the-piercing-wind.ts";
import { snatchRed } from "./snatch.ts";
import { surgingStrikeRed } from "./surging-strike.ts";
import { whelmingGustwaveRed } from "./whelming-gustwave.ts";

/**
 * Whelming Gustwave (KSU016) — Ninja Action - Attack, cost 0, 3{p}, 3{d}.
 *
 * Printed: 'Combo - If Surging Strike was the last attack this combat chain,
 * Whelming Gustwave gains +1{p}, go again, and "If this hits, draw a card."'
 *
 * Keep the chain open for combo (do not untilIdle between attacks).
 *
 * Combo +1{p} is asserted on Defend of the Gustwave link, not while Surging
 * Strike is still the activeLink (CRU151 / Open the Center).
 *
 * Seat Bravo, not Benji: CRU047-a2 is a printed first-AAC-hit latch that
 * would add a second +1{p} to the next attack (Ira's second-attack static
 * does the same). Combo isolation matches Open the Center (KSU013).
 */

describe("Whelming Gustwave (KSU016) AAA", () => {
  it("happy: after Surging Strike, this is 4{p} and draws on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [surgingStrikeRed, whelmingGustwaveRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(surgingStrikeRed);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(whelmingGustwaveRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(4);

    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(11);
    expectFabPlayer(Bravo).toHaveHandCount(1);
  });

  it("boundary: without Surging Strike as the last attack this stays 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [whelmingGustwaveRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(whelmingGustwaveRed);

    expectCombat(game).toHaveAttackPower(3);
    expectFabPlayer(Bravo).toHaveHandCount(0);
  });

  it("timing: printed 3{d} still defends an opposing attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: benjiThePiercingWind,
        hand: [whelmingGustwaveRed],
        life: 17,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Benji = game.as(benjiThePiercingWind);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Benji.defendWith(whelmingGustwaveRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Benji).toHaveLife(16);
    expectFabCard(Benji, whelmingGustwaveRed).toBeIn("graveyard");
  });
});
