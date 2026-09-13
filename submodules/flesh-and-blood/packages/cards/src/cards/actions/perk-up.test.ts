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
import { puffin } from "../heroes/puffin.ts";
import { perkUpRed } from "./perk-up.ts";

/**
 * Perk Up (SEA040) — Mechanologist Action, cost 1, 2{d}, go again.
 *
 * Printed: "Your next Mechanologist attack this turn gets +4{p}.
 * You may {u} your hero. Go again"
 */

describe("Perk Up (SEA040) AAA", () => {
  it("happy: the next Mechanologist attack this turn gains +4{p} and go again refunds", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [perkUpRed, urgentDeliveryRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(perkUpRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Teklo).toHaveAP(1);
    expectFabCard(Teklo, perkUpRed).toBeIn("graveyard");

    Teklo.must.playAttack(urgentDeliveryRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: a Generic attack gets no +4{p} and does not consume the latch", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [perkUpRed, brutalAssaultBlue, urgentDeliveryRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(perkUpRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Teklo.must.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);

    game.advanceCombatTo("resolution");
    Teklo.must.playAttack(urgentDeliveryRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(8);
  });

  it("timing: accepting the optional {u} readies a tapped hero", () => {
    const game = FabTestEngine.start(
      {
        hero: puffin,
        heroState: { tapped: true },
        hand: [perkUpRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);

    expectFabCard(Puffin, puffin).toBeTapped();
    Puffin.play(perkUpRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    expectFabCard(Puffin, puffin).toBeReady();
    expectFabCard(Puffin, perkUpRed).toBeIn("graveyard");
  });
});
