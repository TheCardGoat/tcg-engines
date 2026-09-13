import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { arakni } from "../heroes/arakni.ts";
import { fai } from "../heroes/fai.ts";
import { rapidReflexRed } from "../attack-reactions/rapid-reflex.ts";
import { snatchRed } from "../actions/snatch.ts";
import { denOfTheSpiderRed } from "./den-of-the-spider.ts";

/**
 * Den of the Spider (HNT214) — Assassin / Warrior Defense Reaction Trap.
 *
 * Printed: When this defends an attack with {p} greater than its base, mark
 * the attacking hero.
 *
 * Rapid Reflex must resolve before the trap: `toReaction("defender")` after a
 * stacked AR does not empty the stack (already at reaction).
 */

describe("Den of the Spider (HNT214) AAA", () => {
  it("happy: defending an attack with {p} greater than its base marks the attacking hero", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed, rapidReflexRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: arakni, hand: [denOfTheSpiderRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Arakni = game.as(arakni);

    Fai.playAttack(snatchRed);
    game.toReaction("attacker");
    Fai.must.playReaction(rapidReflexRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(7);

    game.toReaction("defender");
    Arakni.must.playReaction(denOfTheSpiderRed);
    game.closeCombat();

    expectFabPlayer(Fai).toBeMarked();
    expectFabCard(Arakni, denOfTheSpiderRed).toBeIn("graveyard");
  });

  it("boundary: defending an attack at printed {p} does not mark", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: arakni, hand: [denOfTheSpiderRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    game.as(fai).playAttack(snatchRed);
    game.toReaction("defender");
    Arakni.must.playReaction(denOfTheSpiderRed);
    game.closeCombat();

    expectFabPlayer(game.as(fai)).notToBeMarked();
  });

  it("timing: cannot play Den of the Spider outside the reaction step", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [denOfTheSpiderRed], actionPoints: 1, deck: 6 },
      { hero: fai, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabUnplayable(
      () => game.as(arakni).play(denOfTheSpiderRed),
      /not legal in the current reaction step/i,
    );
    expectFabCard(game.as(arakni), denOfTheSpiderRed).toBeIn("hand");
  });
});
