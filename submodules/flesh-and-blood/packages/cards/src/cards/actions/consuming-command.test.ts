import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { levia } from "../heroes/levia.ts";
import { dash } from "../heroes/dash.ts";
import { ebonFold } from "../equipment/ebon-fold.ts";
import { blasmophetTheInsatiableHunger } from "../tokens/blasmophet-the-insatiable-hunger.ts";
import { goremassSummoningBlue } from "./goremass-summoning.ts";
import { skullCrackRed } from "./skull-crack.ts";
import { consumingCommandBlue } from "./consuming-command.ts";

/**
 * Consuming Command — Shadow Brute Action, cost 1, 3{d}.
 *
 * Printed: Until end of turn, Blasmophet, the Insatiable Hunger tokens you
 * control get "Action - {t}: Attack. Go again". Go again. Blood Debt
 */

describe("Consuming Command AAA", () => {
  it("happy: resolving this grants a Blasmophet token Attack and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        arena: [blasmophetTheInsatiableHunger],
        hand: [consumingCommandBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.play(consumingCommandBlue);
    game.untilIdle();
    expectFabCard(Levia, consumingCommandBlue).toBeIn("graveyard");
    expectFabPlayer(Levia).toHaveAP(1);

    Levia.activateAttack(blasmophetTheInsatiableHunger);
    expectCombat(game).toHaveAttackPower(6).toHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabPlayer(Levia).toHaveAP(1);
  });

  it("boundary: without resolving this a Blasmophet token cannot attack", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        arena: [blasmophetTheInsatiableHunger],
        hand: [consumingCommandBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.expectActivationRejected(blasmophetTheInsatiableHunger);
    expectFabCard(Levia, consumingCommandBlue).toBeIn("hand");
  });

  it("UST notes: also grants the attack ability to Blasmopheths created later this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        head: [ebonFold],
        hand: [skullCrackRed, consumingCommandBlue, goremassSummoningBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.activate(ebonFold);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: skullCrackRed.canonicalId });
    expectFabCard(Levia, skullCrackRed).toBeBanished();

    Levia.play(consumingCommandBlue);
    game.untilIdle();
    Levia.play(goremassSummoningBlue);
    game.untilIdle();

    expectFabPlayer(Levia).toHaveTokenCount("blasmophet-the-insatiable-hunger", 1).toHaveAP(1);
    Levia.activateAttack(fabToken("blasmophet-the-insatiable-hunger"));
    expectCombat(game).toHaveAttackPower(6).toHaveKeyword("go-again");
  });
});
