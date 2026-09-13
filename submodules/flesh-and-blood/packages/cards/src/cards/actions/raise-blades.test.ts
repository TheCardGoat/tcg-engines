import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { hala } from "../heroes/hala.ts";
import { durendal } from "../weapons/durendal.ts";
import { raiseBladesRed } from "./raise-blades.ts";

/**
 * Raise Blades (MPW032) — Warrior Action, cost 0, 3{d}.
 *
 * Printed: "Draw a card. Put a card from your hand on top of your deck.
 * Your next sword attack this turn gets +3{p}. Go again"
 */

describe("Raise Blades (MPW032) AAA", () => {
  it("happy: draws then puts a card on top, and the next sword attack gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: hala,
        weapon1: [durendal],
        hand: [raiseBladesRed],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(hala);

    Hala.must.play(raiseBladesRed);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Hala).toHaveHandCount(0);
    expect(Hala.cardsIn("deck", snatchRed)).toHaveLength(1);
    expectFabCard(Hala, raiseBladesRed).toBeIn("graveyard");
    expectFabPlayer(Hala).toHaveAP(1);

    Hala.activateAttack(durendal);
    // Durendal printed 3 + 3 = 6.
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: a non-sword attack neither gains nor consumes the +3{p} latch", () => {
    const game = FabTestEngine.start(
      {
        hero: hala,
        weapon1: [durendal],
        hand: [raiseBladesRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(hala);

    Hala.must.play(raiseBladesRed);
    game.untilIdle({ entityTargets: "minimum" });

    const leftover =
      Hala.cardsIn("hand", brutalAssaultBlue)[0] ?? Hala.cardsIn("hand", snatchRed)[0]!;
    Hala.must.playAttack(leftover);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline" });

    Hala.activateAttack(durendal);
    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: go again refunds the action point spent to play it", () => {
    const game = FabTestEngine.start(
      {
        hero: hala,
        hand: [raiseBladesRed],
        actionPoints: 1,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(hala);

    expectFabPlayer(Hala).toHaveAP(1);
    Hala.must.play(raiseBladesRed);
    game.untilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Hala).toHaveAP(1);
  });
});
