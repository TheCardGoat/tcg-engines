import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dromai } from "../heroes/dromai.ts";
import { dash } from "../heroes/dash.ts";
import { wreckerRompBlue } from "./wrecker-romp.ts";
import { snatchRed } from "./snatch.ts";
import { transmogrifyRed } from "./transmogrify.ts";

/**
 * Transmogrify (UPR155) — Illusionist Action, cost 1, go again.
 *
 * Printed: The next attack action card you play this turn is Illusionist, has
 * 8 base {p}, and gains phantasm. Go again.
 */

describe("Transmogrify (UPR155) AAA", () => {
  it("happy: next attack action has 8 base {p} and phantasm", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [transmogrifyRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);
    const Dash = game.as(dash);

    Dromai.play(transmogrifyRed);
    game.untilIdle();
    expectFabPlayer(Dromai).toHaveAP(1);

    Dromai.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(8).toHaveKeyword("phantasm");
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveLife(12);
    expectFabCard(Dromai, transmogrifyRed).toBeIn("graveyard");
  });

  it("boundary: a second attack action this turn does not keep the grant", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [transmogrifyRed, snatchRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.play(transmogrifyRed);
    game.untilIdle();
    Dromai.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(8).toHaveKeyword("phantasm");
    game.closeCombat({ optionals: "decline" });

    Dromai.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4).notToHaveKeyword("phantasm");
  });

  it("timing: a 6-power attack-action defender triggers the granted Phantasm", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [transmogrifyRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [wreckerRompBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);
    const Dash = game.as(dash);

    Dromai.play(transmogrifyRed);
    game.untilIdle();
    Dromai.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(wreckerRompBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Dromai, snatchRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(20);
    expectCombat(game).toBeClosed();
  });
});
