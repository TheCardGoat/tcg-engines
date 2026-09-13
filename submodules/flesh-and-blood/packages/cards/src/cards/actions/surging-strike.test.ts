import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { surgingStrikeRed } from "./surging-strike.ts";

/**
 * Surging Strike (KSU015) — Ninja Action - Attack, cost 2, 5{p}/2{d}. Printed: Go again.
 */

describe("Surging Strike (KSU015) AAA", () => {
  it("happy: after the attack resolves, leftover AP is refunded", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [surgingStrikeRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(surgingStrikeRed);
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: a miss still refunds AP because go again is printed unconditionally", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [surgingStrikeRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue, brutalAssaultBlue], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(surgingStrikeRed);
    game.as(dash).defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("timing: illegal as an instant during the reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue, surgingStrikeRed],
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
      () => Dash.must.playReaction(surgingStrikeRed),
      /action card is not legal|arrow can only be played/i,
    );
    expectFabCard(Dash, surgingStrikeRed).toBeIn("hand");
  });
});
