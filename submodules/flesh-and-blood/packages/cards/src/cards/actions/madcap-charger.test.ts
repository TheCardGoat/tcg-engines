import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultRed } from "./brutal-assault.ts";
import { madcapChargerRed } from "./madcap-charger.ts";

/**
 * Madcap Charger Red (DYN016) — Brute Attack Action.
 *
 * Printed: As an additional cost to play Madcap Charger, discard a random
 * card.
 * If the discarded card has 6 or more {p}, Madcap Charger has go again.
 */

describe("Madcap Charger (DYN016) AAA", () => {
  it("happy: discarding a 6{p} card at random grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [madcapChargerRed, brutalAssaultRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    // The only other hand card is the 6{p} Brutal Assault: the random
    // discard picks it, arming go again.
    Rhinar.playAttack(madcapChargerRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(15); // 20 - 5
    expectFabCard(Rhinar, brutalAssaultRed).toBeIn("graveyard"); // discarded
    expectFabPlayer(Rhinar).toHaveAP(1); // go again refunded
  });
});
