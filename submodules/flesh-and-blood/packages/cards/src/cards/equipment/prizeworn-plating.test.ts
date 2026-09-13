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
import { prizewornPlating } from "./prizeworn-plating.ts";

/**
 * Prizeworn Plating (AOL004) — Warrior Chest d2, Guardwell.
 * Printed: "Whenever you win a wager, you may {t} your hero and destroy this.
 * If you do, create a Vigor token."
 *
 * The pay package is mixed tap-hero + destroy-self (optional.then create).
 */

describe("Prizeworn Plating (AOL004) AAA", () => {
  it("happy: accepting the wager-win payoff taps the hero, destroys the plating, and creates Vigor", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        chest: [prizewornPlating],
        hand: [wageVigorBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);

    Olympia.playAttack(wageVigorBlue, { stopAt: "on-attack" });
    Olympia.accept();
    game.advanceUntil({ stopAt: "defend" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    // Staked Vigor is won back, then the plating mints a second Vigor.
    expectFabPlayer(Olympia).toHaveTokenCount("vigor", 2);
    expectFabCard(Olympia, prizewornPlating).toBeIn("graveyard");
    expectFabCard(Olympia, olympia).toBeTapped();
  });

  it("boundary: declining leaves only the staked Vigor and the plating stays equipped", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        chest: [prizewornPlating],
        hand: [wageVigorBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);

    Olympia.playAttack(wageVigorBlue, { stopAt: "on-attack" });
    Olympia.accept();
    game.advanceUntil({ stopAt: "defend" });
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Olympia).toHaveTokenCount("vigor", 1);
    expectFabCard(Olympia, prizewornPlating).toBeIn("chest");
    expectFabCard(Olympia, olympia).toBeReady();
  });
});
