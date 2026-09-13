import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { olympia } from "../heroes/olympia.ts";
import { wageVigorBlue } from "../actions/wage-vigor.ts";
import { nimblismBlue, nimblismRed, nimblismYellow } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { prizewornPathfinders } from "./prizeworn-pathfinders.ts";

/**
 * Prizeworn Pathfinders (AOL006) — Guardian/Warrior Legs d1, Battleworn.
 * Printed: "Whenever you win a wager, you may pay {r}. If you do, remove a
 * -1{d} counter from this."
 */

describe("Prizeworn Pathfinders (AOL006) AAA", () => {
  it("happy: after defending, paying {r} on a wager win removes the -1{d} counter", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        legs: [prizewornPathfinders],
        hand: [wageVigorBlue, nimblismBlue, nimblismYellow, nimblismRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);
    const Dash = game.as(dash);

    // Dash's turn: Olympia defends with the Pathfinders — Battleworn scars it.
    Olympia.endTurn();
    Dash.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Olympia.defendWith(prizewornPathfinders);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Olympia, prizewornPathfinders).toHaveDefenseCounters(-1);
    Dash.endTurn();

    // Olympia's turn: attack, wager, hit — then pay {r} to clean the counter.
    Olympia.playAttack(wageVigorBlue, {
      pitch: [nimblismBlue, nimblismYellow],
      stopAt: "on-attack",
    });
    Olympia.accept();
    game.advanceUntil({ stopAt: "defend" });
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      ordering: "listed",
      paymentCanonicalId: nimblismRed.canonicalId,
    });

    expectFabCard(Olympia, prizewornPathfinders).toHaveDefenseCounters(0);
    expectFabCard(Olympia, prizewornPathfinders).toBeIn("legs");
    expectFabPlayer(Dash).toHaveLife(15); // 20 - 5
  });

  it("boundary: declining the payoff leaves the Battleworn counter in place", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        legs: [prizewornPathfinders],
        hand: [wageVigorBlue, nimblismBlue, nimblismYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);
    const Dash = game.as(dash);

    Olympia.endTurn();
    Dash.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Olympia.defendWith(prizewornPathfinders);
    game.helpers.resolveRestOfCombat();
    Dash.endTurn();

    Olympia.playAttack(wageVigorBlue, {
      pitch: [nimblismBlue, nimblismYellow],
      stopAt: "on-attack",
    });
    Olympia.accept();
    game.advanceUntil({ stopAt: "defend" });
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Olympia, prizewornPathfinders).toHaveDefenseCounters(-1);
  });
});
