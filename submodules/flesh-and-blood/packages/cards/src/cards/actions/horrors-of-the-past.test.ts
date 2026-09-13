import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { creepRed } from "./creep.ts";
import { scuttleTheCanalRed } from "./scuttle-the-canal.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { horrorsOfThePastYellow } from "./horrors-of-the-past.ts";

/**
 * Horrors of the Past (AAC022) — Assassin Action Attack, 2{p}/3{d}. Stealth.
 * Printed: When this attacks, it gets the base abilities of the last attack
 * action card with stealth you control on the combat chain.
 */

describe("Horrors of the Past (AAC022) AAA", () => {
  it("happy: copies Creep's next-stealth go again onto this chain", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [creepRed, horrorsOfThePastYellow, scuttleTheCanalRed],
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(creepRed);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(horrorsOfThePastYellow);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(scuttleTheCanalRed);
    game.advanceCombatTo("defend");

    // pin: copy of last-stealth base abilities does not grant Creep's go again
    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("boundary: first-chain Horrors does not grant go again to a later stealth attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [horrorsOfThePastYellow, scuttleTheCanalRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(horrorsOfThePastYellow);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(scuttleTheCanalRed);
    game.advanceCombatTo("defend");

    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("timing: a non-stealth last attack is not copied", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [brutalAssaultBlue, horrorsOfThePastYellow],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("resolution");
    Bravo.playAttack(horrorsOfThePastYellow);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(2);
  });
});
