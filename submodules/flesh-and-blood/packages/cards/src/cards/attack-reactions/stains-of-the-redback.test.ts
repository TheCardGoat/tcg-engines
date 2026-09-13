import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { malignRed } from "../actions/malign.ts";
import { snatchRed } from "../actions/snatch.ts";
import { stainsOfTheRedbackRed } from "./stains-of-the-redback.ts";

/**
 * Stains of the Redback Red (HNT023) — Assassin Attack Reaction.
 *
 * Printed: If the defending hero is marked, this costs {r} less to play.
 * Target attack with stealth gets +3{p} and go again.
 */

describe("Stains of the Redback (HNT023) AAA", () => {
  it("happy: vs a marked hero this plays for 0 and the stealth attack gets +3 and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [malignRed, stainsOfTheRedbackRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], marked: true, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.must.playAttack(malignRed);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(stainsOfTheRedbackRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(6);
    expectCombat(game).toHaveKeyword("go-again");
    expectFabCard(Arakni, stainsOfTheRedbackRed).toBeIn("graveyard");
  });

  it("boundary: cannot target a non-stealth attack", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [snatchRed, stainsOfTheRedbackRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], marked: true, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expect(() => Arakni.must.playReaction(stainsOfTheRedbackRed)).toThrow();
    expectFabCard(Arakni, stainsOfTheRedbackRed).toBeIn("hand");
  });

  it("timing: unmarked defending hero still requires the printed 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [malignRed, stainsOfTheRedbackRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.must.playAttack(malignRed);
    game.advanceCombatTo("reaction");
    expect(() => Arakni.must.playReaction(stainsOfTheRedbackRed)).toThrow();
    expectFabCard(Arakni, stainsOfTheRedbackRed).toBeIn("hand");
    expectFabPlayer(Arakni).toHaveResourceCount(0);
  });
});
