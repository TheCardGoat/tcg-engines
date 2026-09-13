import { describe, it } from "vitest";
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
import { nightSEmbraceBlue } from "./night-s-embrace.ts";

/**
 * Night's Embrace Blue (AAC028) — Assassin Attack Reaction.
 *
 * Printed: Your attacks with stealth get +1{p} this turn.
 */

describe("Night's Embrace (AAC028) AAA", () => {
  it("happy: the attacking stealth card gets +1{p} this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [malignRed, nightSEmbraceBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.must.playAttack(malignRed);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(nightSEmbraceBlue);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Arakni, nightSEmbraceBlue).toBeIn("graveyard");
  });

  it("boundary: a non-stealth attack does not get the +1", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [snatchRed, nightSEmbraceBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(nightSEmbraceBlue);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the +1 is on the chain before damage", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [malignRed, nightSEmbraceBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.must.playAttack(malignRed);
    game.advanceCombatTo("reaction");
    expectCombat(game).toHaveAttackPower(3);
    Arakni.must.playReaction(nightSEmbraceBlue);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);
  });
});
