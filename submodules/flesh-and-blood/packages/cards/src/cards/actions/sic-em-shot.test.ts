import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue, deathDealer } from "../shared/test-recipients.ts";
import { sicEmShotRed } from "./sic-em-shot.ts";

/**
 * Sic 'Em Shot (ARC072) — Ranger Action - Arrow Attack, cost 1, 4{p}/3{d}. Printed: Go again.
 */

describe("Sic 'Em Shot (ARC072) AAA", () => {
  it("happy: after the arrow resolves, leftover AP is refunded", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: sicEmShotRed, state: { faceDown: false } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Azalea = game.as(azalea);

    Azalea.playAttack(sicEmShotRed, { from: "arsenal" });
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Azalea).toHaveAP(1);
  });

  it("boundary: a miss still refunds AP because go again is printed unconditionally", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: sicEmShotRed, state: { faceDown: false } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue, brutalAssaultBlue], life: 20, deck: 6 },
    );
    const Azalea = game.as(azalea);

    Azalea.playAttack(sicEmShotRed, { from: "arsenal" });
    game.as(dash).defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expectFabPlayer(Azalea).toHaveAP(1);
  });

  it("timing: illegal as an instant during the reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue, sicEmShotRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(brutalAssaultBlue);
    game.toReaction("attacker");
    expectFabUnplayable(
      () => Dash.must.playReaction(sicEmShotRed),
      /action card is not legal|arrow can only be played/i,
    );
    expectFabCard(Dash, sicEmShotRed).toBeIn("hand");
  });
});
