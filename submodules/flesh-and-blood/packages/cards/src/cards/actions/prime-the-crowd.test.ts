import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { kayoStrongArm } from "../heroes/kayo-strong-arm.ts";
import { kayoUnderhandedCheat } from "../heroes/kayo-underhanded-cheat.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { primeTheCrowdRed, primeTheCrowdYellow, primeTheCrowdBlue } from "./prime-the-crowd.ts";

const deck = () => [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue];

for (const [color, card, power] of [
  ["red", primeTheCrowdRed, 8],
  ["yellow", primeTheCrowdYellow, 7],
  ["blue", primeTheCrowdBlue, 6],
] as const) {
  describe(`Prime the Crowd ${color}`, () => {
    for (const [hero, token] of [
      [tuffnut, "toughness"],
      [kayoStrongArm, "vigor"],
    ] as const) {
      it(`each qualifying hero receives its own ${token} in a mirror match`, () => {
        const game = FabTestEngine.start(
          { hero, hand: [card, snatchRed], resourcePoints: 2, actionPoints: 1, deck: deck() },
          { hero, hand: [], life: 20, deck: deck() },
          FAB_MANUAL_HARNESS,
        );
        const Attacker = game.as(hero, 1);
        const Defender = game.as(hero, 2);
        Attacker.play(card);
        game.untilIdle({ optionals: "throw", entityTargets: "pause" });
        if (game.waitState().kind === "decision") {
          // Each hero adds one independent token trigger. Choose the attacking
          // player's trigger first; neither token changes the other's creation.
          expectWait(game).toHaveDecision("option");
          Attacker.choose(Attacker.id);
        }
        game.untilIdle({ optionals: "throw" });
        expectFabPlayer(Attacker).toHaveTokenCount(token, 1).toHaveAP(1);
        expectFabPlayer(Defender).toHaveTokenCount(token, 1);
        if (token === "vigor") {
          expectFabPlayer(Attacker).toHaveCrowdBooedThisTurn();
          expectFabPlayer(Defender).toHaveCrowdBooedThisTurn();
        } else {
          expectFabPlayer(Attacker).notToHaveCrowdBooedThisTurn();
          expectFabPlayer(Defender).notToHaveCrowdBooedThisTurn();
        }
        expectFabCard(Attacker, card).toBeIn("graveyard");
        Attacker.playAttack(snatchRed);
        expectCombat(game).toHaveAttackPower(power);
        game.closeCombat({ optionals: "throw" });
        expectFabPlayer(Defender).toHaveLife(20 - power);
        expectFabPlayer(Attacker).toHaveAP(0);
        expectCombat(game).toBeClosed();
        expectWait(game).toBeIdle();
      });
    }

    for (const [recipient, token] of [
      [tuffnut, "toughness"],
      [kayoUnderhandedCheat, "vigor"],
    ] as const) {
      it(`repeated crowd events create a second ${token} in the same turn`, () => {
        const game = FabTestEngine.start(
          {
            hero: bravo,
            hand: [card, card, snatchRed],
            resourcePoints: 4,
            actionPoints: 1,
            deck: deck(),
          },
          { hero: recipient, hand: [], life: 30, deck: deck() },
          FAB_MANUAL_HARNESS,
        );
        const Bravo = game.as(bravo);
        const Recipient = game.as(recipient);
        Bravo.play(card);
        game.untilIdle({ optionals: "throw" });
        expectFabPlayer(Recipient).toHaveTokenCount(token, 1);
        Bravo.play(card);
        game.untilIdle({ optionals: "throw" });
        expectFabPlayer(Recipient).toHaveTokenCount(token, 2);
        expectFabPlayer(Bravo).toHaveAP(1).toHaveResourceCount(0);
        Bravo.playAttack(snatchRed);
        // Identical next-attack modifiers commute: 4 + twice the color bonus.
        expectCombat(game).toHaveAttackPower(2 * power - 4);
        game.closeCombat({ optionals: "throw" });
        expectFabPlayer(Recipient).toHaveLife(34 - 2 * power);
        expectFabPlayer(Bravo).toHaveAP(0);
        expectCombat(game).toBeClosed();
        expectWait(game).toBeIdle();
      });
    }

    it("cheers the opposing Revered hero and buffs the next attack", () => {
      const game = FabTestEngine.start(
        { hero: bravo, hand: [card, snatchRed], resourcePoints: 2, actionPoints: 1, deck: deck() },
        { hero: tuffnut, hand: [], life: 20, deck: deck() },
        FAB_MANUAL_HARNESS,
      );
      const Bravo = game.as(bravo);
      const Tuffnut = game.as(tuffnut);
      Bravo.play(card);
      game.untilIdle({ optionals: "throw" });
      expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 1).notToHaveCrowdBooedThisTurn();
      expectFabPlayer(Bravo)
        .toHaveTokenCount("toughness", 0)
        .toHaveAP(1)
        .notToHaveCrowdBooedThisTurn();
      expectFabCard(Bravo, card).toBeIn("graveyard");
      Bravo.playAttack(snatchRed);
      expectCombat(game).toHaveAttackPower(power);
      game.closeCombat({ optionals: "throw" });
      expectFabPlayer(Tuffnut).toHaveLife(20 - power);
      expectFabPlayer(Bravo).toHaveAP(0);
      expectCombat(game).toBeClosed();
      expectWait(game).toBeIdle();
    });

    it("cheers a Revered controller and boos the opposing Reviled hero", () => {
      const game = FabTestEngine.start(
        {
          hero: tuffnut,
          hand: [card, snatchRed],
          resourcePoints: 2,
          actionPoints: 1,
          deck: deck(),
        },
        { hero: kayoUnderhandedCheat, hand: [], life: 20, deck: deck() },
        FAB_MANUAL_HARNESS,
      );
      const Tuffnut = game.as(tuffnut);
      const Kayo = game.as(kayoUnderhandedCheat);
      Tuffnut.play(card);
      game.untilIdle({ optionals: "throw" });
      expectFabPlayer(Tuffnut)
        .toHaveTokenCount("toughness", 1)
        .toHaveTokenCount("vigor", 0)
        .notToHaveCrowdBooedThisTurn();
      expectFabPlayer(Kayo)
        .toHaveTokenCount("vigor", 1)
        .toHaveTokenCount("toughness", 0)
        .toHaveCrowdBooedThisTurn();
      Tuffnut.playAttack(snatchRed);
      expectCombat(game).toHaveAttackPower(power);
      game.closeCombat({ optionals: "throw" });
      expectFabPlayer(Kayo).toHaveLife(20 - power);
      expectFabPlayer(Tuffnut).toHaveAP(0);
      expectCombat(game).toBeClosed();
      expectWait(game).toBeIdle();
    });

    it("cheers its Revered controller only once against a non-Revered hero", () => {
      const game = FabTestEngine.start(
        {
          hero: tuffnut,
          hand: [card, snatchRed],
          resourcePoints: 2,
          actionPoints: 1,
          deck: deck(),
        },
        { hero: dash, hand: [], life: 20, deck: deck() },
        FAB_MANUAL_HARNESS,
      );
      const Tuffnut = game.as(tuffnut);
      const Dash = game.as(dash);
      Tuffnut.play(card);
      game.untilIdle({ optionals: "throw" });
      expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 1).notToHaveCrowdBooedThisTurn();
      expectFabPlayer(Dash).toHaveTokenCount("toughness", 0).notToHaveCrowdBooedThisTurn();
      Tuffnut.playAttack(snatchRed);
      expectCombat(game).toHaveAttackPower(power);
      game.closeCombat({ optionals: "throw" });
      expectFabPlayer(Dash).toHaveLife(20 - power);
      expectCombat(game).toBeClosed();
      expectWait(game).toBeIdle();
    });
  });
}

it("Prime the Crowd does not buff a later attack", () => {
  const game = FabTestEngine.start(
    {
      hero: bravo,
      hand: [primeTheCrowdRed, snatchRed, snatchRed],
      resourcePoints: 2,
      actionPoints: 2,
      deck: deck(),
    },
    { hero: dash, hand: [], life: 20, deck: deck() },
    FAB_MANUAL_HARNESS,
  );
  const Bravo = game.as(bravo);
  const Dash = game.as(dash);
  Bravo.play(primeTheCrowdRed);
  game.untilIdle({ optionals: "throw" });
  Bravo.playAttack(snatchRed);
  expectCombat(game).toHaveAttackPower(8);
  game.closeCombat({ optionals: "throw" });
  Bravo.playAttack(snatchRed);
  expectCombat(game).toHaveAttackPower(4);
  game.closeCombat({ optionals: "throw" });
  expectFabPlayer(Dash).toHaveLife(8);
  expectFabPlayer(Bravo).toHaveAP(0);
  expectCombat(game).toBeClosed();
  expectWait(game).toBeIdle();
});
