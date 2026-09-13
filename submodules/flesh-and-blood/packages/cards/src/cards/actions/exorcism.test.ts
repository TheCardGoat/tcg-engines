import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { ankaDragUnderYellow } from "./anka-drag-under.ts";
import { unboundByShadowRed } from "./unbound-by-shadow.ts";
import { exorcismRed } from "./exorcism.ts";
import { snatchRed } from "./snatch.ts";

describe("Exorcism (IAR) AAA", () => {
  it("happy: the next attack gains +3 power and turns the hit hero's banished cards face-down", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [exorcismRed, snatchRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], banished: [unboundByShadowRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Attacker = game.as(dash);
    const Defender = game.as(bravo);
    Attacker.play(exorcismRed);
    game.untilIdle();
    Attacker.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(7);
    game.advanceUntil({ stopAt: "idle", ordering: "listed" });
    expectFabCard(Defender, unboundByShadowRed).toBeFaceDown();
  });

  it("boundary: without Exorcism, the attack keeps printed power and banished cards remain face-up", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], banished: [unboundByShadowRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Attacker = game.as(dash);
    const Defender = game.as(bravo);
    Attacker.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabCard(Defender, unboundByShadowRed).toBeIn("banished");
  });

  it("boundary: hitting an Ally does not turn the defending hero's banished cards face-down", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [exorcismRed, snatchRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        hand: [],
        arena: [ankaDragUnderYellow],
        banished: [unboundByShadowRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Attacker = game.as(dash);
    const Defender = game.as(bravo);

    Attacker.play(exorcismRed);
    game.untilIdle();
    Attacker.playAttack(snatchRed, {
      target: Defender.findCardInZone("arena", ankaDragUnderYellow),
    });
    game.closeCombat();

    expectFabCard(Defender, unboundByShadowRed).toBeIn("banished").toBeFaceUp();
  });
});
