import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { urgentDeliveryRed } from "./urgent-delivery.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { spitfire } from "../weapons/spitfire.ts";
import { drawBackTheHammerRed } from "./draw-back-the-hammer.ts";

/**
 * Draw Back the Hammer (SEA039) — Mechanologist Action, cost 1, 2{d}, go again.
 *
 * Printed: "Your next Mechanologist attack this turn gets +4{p}.
 * You may {u} a gun you control. Go again"
 *
 * Catalog guns put Gun on `types` (SEA007 Spitfire). The authored
 * `subtypes:["Gun"]` scan still matches that seated weapon.
 */

describe("Draw Back the Hammer (SEA039) AAA", () => {
  it("happy: the next Mechanologist attack this turn gains +4{p} and go again refunds", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [drawBackTheHammerRed, urgentDeliveryRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(drawBackTheHammerRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Teklo).toHaveAP(1);
    expectFabCard(Teklo, drawBackTheHammerRed).toBeIn("graveyard");

    Teklo.must.playAttack(urgentDeliveryRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: a Generic attack gets no +4{p} and does not consume the latch", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [drawBackTheHammerRed, brutalAssaultBlue, urgentDeliveryRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(drawBackTheHammerRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Teklo.must.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);

    game.advanceCombatTo("resolution");
    Teklo.must.playAttack(urgentDeliveryRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(8);
  });

  it("timing: accepting the optional {u} readies a tapped gun", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [drawBackTheHammerRed],
        weapon1: [{ card: spitfire, state: { tapped: true } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    expectFabCard(Teklo, spitfire).toBeTapped();
    Teklo.play(drawBackTheHammerRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    expectFabCard(Teklo, spitfire).toBeReady();
    expectFabCard(Teklo, drawBackTheHammerRed).toBeIn("graveyard");
  });
});
