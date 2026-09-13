import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { wreckerRompRed } from "./wrecker-romp.ts";
import { skullCrackRed } from "./skull-crack.ts";

/**
 * Skull Crack (DYN008) — Brute Action Attack, 6{p}/3{d}.
 * Printed: When Skull Crack is discarded at random, gain {r}.
 */

describe("Skull Crack (DYN008) AAA", () => {
  it("happy: discarded at random as Wrecker Romp's additional cost gains {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [wreckerRompRed, skullCrackRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.must.playAttack(wreckerRompRed);
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });

    expectFabCard(Rhinar, skullCrackRed).toBeIn("graveyard");
    expectFabPlayer(Rhinar).toHaveResourceCount(1);
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: playing this as an attack does not gain {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [skullCrackRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(skullCrackRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabPlayer(Rhinar).toHaveResourceCount(0);
    expectFabCard(Rhinar, skullCrackRed).toBeIn("graveyard");
  });

  it("timing: the random-discard {r} is gained as the additional cost is paid", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [wreckerRompRed, skullCrackRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.must.playAttack(wreckerRompRed);
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectFabPlayer(Rhinar).toHaveResourceCount(1);
    expectFabCard(Rhinar, wreckerRompRed).toBeIn("combatChain");
  });
});
