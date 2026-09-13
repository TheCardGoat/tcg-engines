import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { biteBlue } from "../actions/bite.ts";
import { snatchRed } from "../actions/snatch.ts";
import { justANickRed } from "./just-a-nick.ts";

/**
 * Just a Nick Red (MST105) — Assassin Attack Reaction.
 *
 * Printed: Choose 1 or both;
 * - Target attack action card with 1 or less base {p} gets +5{p}.
 * - Target attack with stealth gets "When this hits a hero, banish the top card of their deck."
 */

describe("Just a Nick (MST105) AAA", () => {
  it("happy: both modes give a 1-power stealth attack +5 and banish on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [biteBlue, justANickRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: [snatchRed, snatchRed, snatchRed] },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(biteBlue);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(justANickRed, { modeIndexes: [0, 1] });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(6);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Dash, snatchRed).toBeBanished();
  });

  it("boundary: the +5 mode cannot target a base-4 attack", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [snatchRed, justANickRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expect(() => Arakni.must.playReaction(justANickRed, { modeIndexes: [0] })).toThrow();
    expectFabCard(Arakni, justANickRed).toBeIn("hand");
  });

  it("timing: choosing only the stealth-hit mode leaves printed power 1", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [biteBlue, justANickRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: [snatchRed, snatchRed, snatchRed] },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.attackWith(biteBlue);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(justANickRed, { modeIndexes: [1] });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(1);
  });
});
