import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { shockStrikerRed } from "./shock-striker.ts";

/**
 * Shock Striker (ELE195) — Lightning Attack red 5{p}.
 *
 * Printed Instant: {r}{r}: Shock Striker gains "If Shock Striker hits a hero,
 * deal 1 damage to them." Once per turn.
 */

describe("Shock Striker (ELE195) AAA", () => {
  it("happy: pay {r}{r} so a hit deals 5 plus 1 (life 14)", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [shockStrikerRed, nimblismBlue, nimblismBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(shockStrikerRed);
    game.toReaction("attacker");
    Briar.activate(shockStrikerRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("boundary: without the Instant a hit deals only printed 5", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [shockStrikerRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(shockStrikerRed);
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: once-per-turn rejects a second Instant", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [shockStrikerRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(shockStrikerRed);
    game.toReaction("attacker");
    Briar.activate(shockStrikerRed);
    game.passBoth();
    Briar.expectActivationRejected(shockStrikerRed);
    expectCombat(game).toHaveAttackPower(5);
  });
});
