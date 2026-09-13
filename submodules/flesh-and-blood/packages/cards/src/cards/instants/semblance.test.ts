import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { phantasmalHazeYellow } from "../actions/phantasmal-haze.ts";
import { regurgitatingSlogRed } from "../actions/regurgitating-slog.ts";
import { snatchRed } from "../actions/snatch.ts";
import { semblanceBlue } from "./semblance.ts";

/**
 * Semblance (UPR154) — Illusionist Instant, cost 3.
 *
 * Printed: Negate all phantasm triggered effects of target Illusionist attack
 * you control. The attack loses and can't gain phantasm.
 */

describe("Semblance (UPR154) AAA", () => {
  it("happy: negates the stacked phantasm destroy so the 7{p} attack still deals damage", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [phantasmalHazeYellow, semblanceBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [regurgitatingSlogRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(phantasmalHazeYellow);
    Dash.defendWith(regurgitatingSlogRed);
    Prism.play(semblanceBlue, {
      targetInstanceId: Prism.cardIn("combatChain", phantasmalHazeYellow).instanceId,
    });
    game.passBoth();

    expectCombat(game).toBeOpen().notToHaveKeyword("phantasm");
    expectFabCard(Prism, phantasmalHazeYellow).toBeIn("combatChain");
    expectFabCard(Prism, semblanceBlue).toBeIn("graveyard");

    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Prism, phantasmalHazeYellow).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("boundary: Semblance cannot target a Generic attack", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [snatchRed, semblanceBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(snatchRed);
    Dash.pass();
    expectFabUnplayable(() =>
      Prism.play(semblanceBlue, {
        targetInstanceId: Prism.cardIn("combatChain", snatchRed).instanceId,
      }),
    );
    expectFabCard(Prism, semblanceBlue).toBeIn("hand");
    expectCombat(game).toBeOpen();
    expectFabCard(Prism, snatchRed).toBeIn("combatChain");
  });

  it("timing: without Semblance, a 6{p} attack-action defender phantasm-destroys the attack", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [phantasmalHazeYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [regurgitatingSlogRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(phantasmalHazeYellow);
    game.advanceCombatTo("defend");
    Dash.defendWith(regurgitatingSlogRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Prism, phantasmalHazeYellow).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(20);
    expectCombat(game).toBeClosed();
  });
});
