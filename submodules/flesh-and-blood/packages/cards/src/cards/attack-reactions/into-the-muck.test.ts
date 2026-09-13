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
import { kassai } from "../heroes/kassai.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { holdEmRed } from "../actions/hold-em.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { intoTheMuckRed } from "./into-the-muck.ts";

/**
 * Into the Muck (AOL007) — Warrior Attack Reaction, cost 0, 3{d}.
 *
 * Printed: "Play this only if you've wagered this chain link.
 * Banish a non-equipment defending card on the active chain link."
 */

describe("Into the Muck (AOL007) AAA", () => {
  it("happy: after a same-link wager, banish the defending card so the attack lands", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [cintariSaber],
        hand: [holdEmRed, intoTheMuckRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.play(holdEmRed);
    game.helpers.resolveUntilIdle();
    Kassai.activateAttack(cintariSaber, { stopAt: "on-attack" });
    Kassai.accept(); // wager the Vigor with the defending hero
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(nimblismBlue);
    game.toReaction("attacker");
    Kassai.must.playReaction(intoTheMuckRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // The banished Nimblism no longer defends: 2 + 3 = 5 damage.
    expectFabCard(Dash, nimblismBlue).toBeBanished();
    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Kassai, intoTheMuckRed).toBeIn("graveyard");
  });

  it("boundary: without a wager this chain link, this is unplayable", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [cintariSaber],
        hand: [intoTheMuckRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.activateAttack(cintariSaber);
    game.toReaction("attacker");

    expectFabUnplayable(() => Kassai.must.playReaction(intoTheMuckRed), /play condition/);
    expectFabCard(Kassai, intoTheMuckRed).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(2);
  });
});
