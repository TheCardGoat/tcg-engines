import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { zeroToSixtyRed } from "../actions/zero-to-sixty.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { teklovossenTheMechropotent } from "./teklovossen-the-mechropotent.ts";

/**
 * Teklovossen, the Mechropotent (EVO010) — Shadow Mechanologist Demi-Hero Equipment Evo 6{p}/6{d}.
 *
 * Printed:
 *   Action - {r}{r}{r}, banish 2 cards from your soul: Attack
 *   Whenever this attacks a hero, they discard a card.
 *   Your Mechanologist attack action cards get go again.
 *   This counts as having 4 Evos equipped.
 */

describe("Teklovossen, the Mechropotent (EVO010) AAA", () => {
  it("happy: attacking a hero discards a card from them", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossenTheMechropotent,
        soul: [nimblismBlue, nimblismBlue],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklovossen = game.as(teklovossenTheMechropotent);
    const Dash = game.as(dash);

    Teklovossen.activateAttack(teklovossenTheMechropotent);
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveHandCount(0);
  });

  it("boundary: a Generic attack action does not get go again", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossenTheMechropotent,
        hand: [brutalAssaultBlue],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklovossen = game.as(teklovossenTheMechropotent);

    Teklovossen.attackWith(brutalAssaultBlue);
    game.advanceCombatTo("defend");

    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("timing: Mechanologist attack actions get go again while this is the hero", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossenTheMechropotent,
        hand: [zeroToSixtyRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklovossen = game.as(teklovossenTheMechropotent);

    Teklovossen.attackWith(zeroToSixtyRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveKeyword("go-again");
  });
});
