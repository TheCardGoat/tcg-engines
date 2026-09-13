import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "./voltic-bolt.ts";
import { snatchRed } from "./snatch.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { spellbaneTrapRed } from "./spellbane-trap.ts";

/**
 * Spellbane Trap, Red (PEN089) — Ranger Action Trap, 0-cost, 2{d}.
 * Printed: Your next arrow attack this turn gets +3{p}. Go again.
 * When this defends and the attacking hero has dealt arcane damage this turn,
 * create a Spellbane Aegis token.
 */

describe("Spellbane Trap (PEN089) AAA", () => {
  it("happy: defending after the attacker dealt arcane this turn creates Spellbane Aegis", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [volticBoltRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [spellbaneTrapRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Azalea = game.as(azalea);

    Kano.play(volticBoltRed, { target: Azalea.id });
    game.helpers.resolveUntilIdle();
    Kano.playAttack(snatchRed);
    Azalea.defendWith(spellbaneTrapRed);
    game.passBoth();

    expectFabCard(Azalea, spellbaneTrapRed).toBeIn("combatChain");
    expectFabPlayer(Azalea).toHaveTokenCount("spellbane-aegis", 1);
  });

  it("boundary: defending with no prior arcane damage creates no Spellbane Aegis", () => {
    const game = FabTestEngine.start(
      { hero: kano, hand: [snatchRed], deck: 6 },
      { hero: azalea, hand: [spellbaneTrapRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    game.as(kano).playAttack(snatchRed);
    Azalea.defendWith(spellbaneTrapRed);
    game.passBoth();

    expectFabCard(Azalea, spellbaneTrapRed).toBeIn("combatChain");
    expectFabPlayer(Azalea).toHaveTokenCount("spellbane-aegis", 0);
  });

  it("timing: next arrow this turn still gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [spellbaneTrapRed],
        weapon1: [deathDealer],
        arsenal: [{ card: searingShotRed, state: { faceDown: true } }],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(spellbaneTrapRed);
    game.helpers.resolveUntilIdle();
    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(7);
  });
});
