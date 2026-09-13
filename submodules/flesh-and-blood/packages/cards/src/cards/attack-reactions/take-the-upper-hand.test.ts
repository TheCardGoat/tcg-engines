import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { snatchRed } from "../actions/snatch.ts";
import { kassai } from "../heroes/kassai.ts";
import { holdEmRed } from "../actions/hold-em.ts";
import { takeTheUpperHandRed } from "./take-the-upper-hand.ts";

/**
 * Take the Upper Hand (HVY112) — Warrior Attack Reaction, cost 0, 3{d}.
 *
 * Printed: "Play this only if you've wagered this chain link.
 * Target attack gets +3{p}."
 */

describe("take-the-upper-hand family AAA", () => {
  it("happy: after a same-link wager, target attack gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [cintariSaber],
        hand: [holdEmRed, takeTheUpperHandRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.play(holdEmRed);
    game.helpers.resolveUntilIdle();
    Kassai.activateAttack(cintariSaber, { stopAt: "on-attack" });
    Kassai.accept();
    game.advanceUntil({ stopAt: "reaction" });
    Kassai.must.playReaction(takeTheUpperHandRed);
    game.passBoth();

    // Cintari 2 + Hold 'em 3 + Upper Hand 3 = 8.
    expectCombat(game).toHaveAttackPower(8);
    expectFabCard(Kassai, takeTheUpperHandRed).toBeIn("graveyard");
  });

  it("boundary: without a wager this chain link, this is unplayable", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [cintariSaber],
        hand: [takeTheUpperHandRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.activateAttack(cintariSaber);
    game.advanceCombatTo("reaction");
    expect(() => Kassai.must.playReaction(takeTheUpperHandRed)).toThrow(
      /play condition is not satisfied/,
    );
    expectFabCard(Kassai, takeTheUpperHandRed).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(2);
  });

  it("timing: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: kassai, hand: [takeTheUpperHandRed], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Kassai = game.as(kassai);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Kassai.defendWith([takeTheUpperHandRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Kassai).toHaveLife(19);
    expectFabCard(Kassai, takeTheUpperHandRed).toBeIn("graveyard");
  });
});
