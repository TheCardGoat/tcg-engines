import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { kayoUnderhandedCheat } from "../heroes/kayo-underhanded-cheat.ts";
import { concealedObjectBlue } from "../instants/concealed-object.ts";
import { lowBlowRed } from "./low-blow.ts";

/**
 * Low Blow (SUP110) — Reviled Action - Attack, cost 1, 3{p}, 3{d}.
 * Printed: "If you've been booed this turn, this gets +3{p}."
 */

describe("Low Blow (SUP110) AAA", () => {
  it("happy: after a same-turn boo, this gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoUnderhandedCheat,
        hand: [concealedObjectBlue, lowBlowRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoUnderhandedCheat);
    Kayo.play(concealedObjectBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Kayo).toHaveTokenCount("vigor", 1);
    Kayo.attackWith(lowBlowRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: without a boo this turn, this stays at printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoUnderhandedCheat,
        hand: [lowBlowRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoUnderhandedCheat);
    Kayo.attackWith(lowBlowRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: kayoUnderhandedCheat, hand: [lowBlowRed], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Kayo = game.as(kayoUnderhandedCheat);
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Kayo.defendWith([lowBlowRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Kayo).toHaveLife(19);
    expectFabCard(Kayo, lowBlowRed).toBeIn("graveyard");
  });
});
