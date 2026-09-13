import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { flashBoltBlue } from "../instants/flash-bolt.ts";
import { snatchRed } from "./snatch.ts";
import { beckoningBrillianceRed } from "./beckoning-brilliance.ts";

/**
 * Beckoning Brilliance (OMN148) — Lightning Action - Attack, cost 0, 4{p}/2{d}.
 *
 * Printed: When this attacks, the next instant card you play this chain link
 * costs {r} less.
 */

describe("Beckoning Brilliance (OMN148) AAA", () => {
  it("happy: the next instant this chain link costs {r} less", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [beckoningBrillianceRed, flashBoltBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(beckoningBrillianceRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(4);
    game.toReaction("attacker");
    Briar.play(flashBoltBlue);
    game.passBoth();

    expectFabPlayer(Briar).toHaveResourceCount(0);
    expectFabCard(Briar, flashBoltBlue).toBeIn("graveyard");
  });

  it("boundary: a follow-up attack is not discounted", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [beckoningBrillianceRed, snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(beckoningBrillianceRed);
    game.advanceCombatTo("resolution");
    expect(() => Briar.playAttack(snatchRed)).toThrow();
    expectFabCard(Briar, snatchRed).toBeIn("hand");
  });

  it("timing: without the on-attack latch Flash Bolt still costs 2", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [flashBoltBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    expect(() => Briar.play(flashBoltBlue)).toThrow();
    expectFabCard(Briar, flashBoltBlue).toBeIn("hand");
  });
});
