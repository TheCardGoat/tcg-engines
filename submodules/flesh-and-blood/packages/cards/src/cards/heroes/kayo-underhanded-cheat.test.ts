import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { concealedObjectBlue } from "../instants/concealed-object.ts";
import { kayoUnderhandedCheat } from "./kayo-underhanded-cheat.ts";

/**
 * Kayo, Underhanded Cheat (SUP063) — Reviled Brute Hero.
 *
 * Printed: Instant — {r}{r}{r}{r}, {t}: Target attack action card you control
 * has 6 base {p}. Whenever the crowd boos you, create a Vigor token.
 */

describe("Kayo, Underhanded Cheat (SUP063) AAA", () => {
  it("happy: the Instant sets a controlled attack action to 6 base {p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoUnderhandedCheat,
        hand: [snatchRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoUnderhandedCheat);

    Kayo.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectCombat(game).toHaveAttackPower(4);

    Kayo.activate(kayoUnderhandedCheat);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Kayo, kayoUnderhandedCheat).toBeTapped();
  });

  it("boundary: cannot activate the Instant with no attack action on the chain", () => {
    const game = FabTestEngine.start(
      { hero: kayoUnderhandedCheat, resourcePoints: 4, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(kayoUnderhandedCheat).activate(kayoUnderhandedCheat)).toThrow();
  });

  it("timing: a crowd-boos event creates a Vigor token", () => {
    const game = FabTestEngine.start(
      { hero: kayoUnderhandedCheat, hand: [concealedObjectBlue], deck: 6 },
      { hero: dash, deck: 6 },
    );
    const Kayo = game.as(kayoUnderhandedCheat);

    Kayo.must.play(concealedObjectBlue);
    game.passBoth();

    expect(Kayo.zone("arena")).toContain("token:vigor");
    expectFabPlayer(Kayo).toHaveLife(40);
  });
});
