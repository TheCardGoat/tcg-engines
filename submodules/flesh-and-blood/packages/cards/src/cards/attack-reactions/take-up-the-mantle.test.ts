import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { malignRed } from "../actions/malign.ts";
import { snatchRed } from "../actions/snatch.ts";
import { takeUpTheMantleYellow } from "./take-up-the-mantle.ts";

/**
 * Take Up the Mantle Yellow (HNT014) — Assassin Attack Reaction.
 *
 * Printed: Target attack action card with stealth gets +2{p}. If it's attacking
 * a marked hero, instead it gets +3{p} and you may banish an attack action card
 * with stealth from your graveyard. If you do, the target becomes a copy of the
 * banished card.
 */

describe("Take Up the Mantle (HNT014) AAA", () => {
  it("happy: stealth attack vs unmarked hero gets +2", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [malignRed, takeUpTheMantleYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.must.playAttack(malignRed);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(takeUpTheMantleYellow);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Arakni, takeUpTheMantleYellow).toBeIn("graveyard");
  });

  it("boundary: cannot target a non-stealth attack", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [snatchRed, takeUpTheMantleYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expect(() => Arakni.must.playReaction(takeUpTheMantleYellow)).toThrow();
    expectFabCard(Arakni, takeUpTheMantleYellow).toBeIn("hand");
  });

  it("timing: attacking a marked hero instead gets +3", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [malignRed, takeUpTheMantleYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], marked: true, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.must.playAttack(malignRed);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(takeUpTheMantleYellow);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(6);
  });
});
