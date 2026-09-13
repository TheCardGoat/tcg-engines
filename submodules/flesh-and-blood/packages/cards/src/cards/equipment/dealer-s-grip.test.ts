import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { olympia } from "../heroes/olympia.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { wageGoldRed } from "../actions/wage-gold.ts";
import { dealerSGrip } from "./dealer-s-grip.ts";

/**
 * Dealer's Grip (MPW019) — Warrior Arms d1, Battleworn.
 * Printed: "Attack Reaction - {r}{r}, destroy this: Target attack that has
 * wagered gets +1{p}. Battleworn"
 */

describe("Dealer's Grip (MPW019) AAA", () => {
  it("happy: after a wager, the grip gives the attack +1{p} and is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        arms: [dealerSGrip],
        hand: [wageGoldRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);
    const Dash = game.as(dash);

    Olympia.playAttack(wageGoldRed, { stopAt: "on-attack" });
    Olympia.accept();
    game.toReaction("attacker");
    Olympia.activate(dealerSGrip);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(12);
    expectFabCard(Olympia, dealerSGrip).toBeIn("graveyard");
  });

  it("boundary: an attack that has not wagered is not a legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: olympia,
        arms: [dealerSGrip],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);

    Olympia.playAttack(snatchRed);
    game.toReaction("attacker");
    Olympia.expectActivationRejected(dealerSGrip);
    expectFabCard(Olympia, dealerSGrip).toBeIn("arms");
  });

  it("happy: defending with the grip stamps a -1{d} Battleworn counter", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: olympia,
        arms: [dealerSGrip],
        hand: [],
        life: 20,
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);

    game.as(dash).playAttack(snatchRed);
    Olympia.defendWith(dealerSGrip);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Olympia).toHaveLife(17); // 4{p} versus the grip's 1{d}
    expectFabCard(Olympia, dealerSGrip).toBeIn("arms");
    expectFabCard(Olympia, dealerSGrip).toHaveDefenseCounters(-1);
  });

  it("boundary: without defending, the grip keeps its printed defense", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: olympia,
        arms: [dealerSGrip],
        hand: [],
        life: 20,
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympia);

    game.as(dash).playAttack(snatchRed);
    Olympia.defendWith();
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Olympia).toHaveLife(16); // full 4{p}
    expectFabCard(Olympia, dealerSGrip).toBeIn("arms");
    expectFabCard(Olympia, dealerSGrip).toHaveDefenseCounters(0);
  });
});
