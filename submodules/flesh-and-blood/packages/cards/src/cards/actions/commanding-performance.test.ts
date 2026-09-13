import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassai } from "../heroes/kassai.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { commandingPerformanceRed } from "./commanding-performance.ts";

/**
 * Commanding Performance (HVY104) — Warrior Action, cost 1, 3{d}, go again.
 *
 * Printed: "Your next Warrior attack this turn gets +3{p}.
 * Until end of turn, your Warrior attacks get \"When this is defended by 1 or
 * more attack action cards, destroy a card in the defending hero's arsenal.\"
 * Go again"
 *
 * The +3{p} latch is public on a Warrior weapon attack. The granted
 * AAC-defend destroy is public on a later Cintari Saber swing (ordering vs
 * the saber's own AAC-defend +1{p}).
 */

describe("Commanding Performance (HVY104) AAA", () => {
  it("happy: the next Warrior attack this turn gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [cintariSaber],
        hand: [commandingPerformanceRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.play(commandingPerformanceRed);
    game.helpers.resolveUntilIdle();
    Kassai.activate(cintariSaber);
    game.passBoth();
    game.advanceCombatTo("defend");

    // Cintari Saber printed 2 + 3 = 5.
    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Kassai, commandingPerformanceRed).toBeIn("graveyard");
  });

  it("boundary: a Generic attack stays at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [commandingPerformanceRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.play(commandingPerformanceRed);
    game.helpers.resolveUntilIdle();
    Kassai.attackWith(brutalAssaultBlue);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the action point spent to play it", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [commandingPerformanceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    expectFabPlayer(Kassai).toHaveAP(1);
    Kassai.play(commandingPerformanceRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Kassai).toHaveAP(1);
  });

  it("timing: an AAC block on a later Warrior attack destroys the defender's arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [cintariSaber],
        hand: [commandingPerformanceRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], arsenal: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.play(commandingPerformanceRed);
    game.helpers.resolveUntilIdle();
    Kassai.activate(cintariSaber);
    game.passBoth();
    game.advanceCombatTo("defend");
    Dash.defendWith([snatchRed]);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: kassai, hand: [commandingPerformanceRed], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Kassai = game.as(kassai);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Kassai.defendWith([commandingPerformanceRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Kassai).toHaveLife(19);
    expectFabCard(Kassai, commandingPerformanceRed).toBeIn("graveyard");
  });
});
