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
import { consumingAppetiteYellow } from "./consuming-appetite.ts";

/**
 * Consuming Appetite — Shadow Brute Action - Attack, cost 3, 6{p}.
 *
 * Printed: Instant - {r}, banish this from your hand: Until end of turn,
 * Blasmophet, the Insatiable Hunger tokens you control get
 * "Action - {t}: Attack. Go again". Blood Debt
 */

describe("Consuming Appetite AAA", () => {
  it("happy: banishing this from hand lets a Blasmophet token attack with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        arena: [blasmophetTheInsatiableHunger],
        hand: [consumingAppetiteYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.activate(consumingAppetiteYellow);
    game.untilIdle();
    expectFabCard(Levia, consumingAppetiteYellow).toBeBanished();

    Levia.activateAttack(blasmophetTheInsatiableHunger);
    expectCombat(game).toHaveAttackPower(6).toHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabPlayer(Levia).toHaveAP(1);
  });

  it("boundary: without the Instant a Blasmophet token cannot attack", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        arena: [blasmophetTheInsatiableHunger],
        hand: [consumingAppetiteYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.expectActivationRejected(blasmophetTheInsatiableHunger);
    expectFabCard(Levia, consumingAppetiteYellow).toBeIn("hand");
  });

  it("UST notes: also grants the attack ability to Blasmopheths created later this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        head: [ebonFold],
        hand: [skullCrackRed, consumingAppetiteYellow, goremassSummoningBlue],
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
    Levia.activate(consumingAppetiteYellow);
    game.untilIdle();
    Levia.play(goremassSummoningBlue);
    game.untilIdle();

    expectFabPlayer(Levia).toHaveTokenCount("blasmophet-the-insatiable-hunger", 1).toHaveAP(1);
    Levia.activateAttack(fabToken("blasmophet-the-insatiable-hunger"));
    expectCombat(game).toHaveAttackPower(6).toHaveKeyword("go-again");
  });
});
