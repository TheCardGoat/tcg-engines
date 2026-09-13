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
import { prizewornGauntlet } from "./prizeworn-gauntlet.ts";

/**
 * Prizeworn Gauntlet (AOL005) — Warrior Arms d2, Guardwell.
 * Printed: "Whenever you win a wager, you may {t} your hero and destroy this.
 * If you do, create a Courage token."
 *
 * The pay package is mixed tap-hero + destroy-self (optional.then create).
 */

describe("Prizeworn Gauntlet (AOL005) AAA", () => {
  it("happy: accepting the wager-win payoff taps the hero, destroys the gauntlet, and creates Courage", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        arms: [prizewornGauntlet],
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

    expectFabPlayer(Olympia).toHaveTokenCount("courage", 1);
    expectFabCard(Olympia, prizewornGauntlet).toBeIn("graveyard");
    expectFabCard(Olympia, olympia).toBeTapped();
  });

  it("boundary: declining the wager-win payoff keeps the gauntlet equipped with no Courage", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        arms: [prizewornGauntlet],
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

    expectFabPlayer(Olympia).toHaveTokenCount("courage", 0);
    expectFabCard(Olympia, prizewornGauntlet).toBeIn("arms");
    expectFabCard(Olympia, olympia).toBeReady();
  });
});
