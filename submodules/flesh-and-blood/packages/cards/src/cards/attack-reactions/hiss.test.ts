import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { biteBlue } from "../actions/bite.ts";
import { nuu } from "../heroes/nuu.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { hissRed } from "./hiss.ts";

/**
 * Hiss (MST014) — Mystic Assassin Attack Reaction, cost 1, 3{d}.
 *
 * Printed: "Target Assassin or Mystic attack action card gets +3{p}.
 * If you've pitched a blue card this turn, create a Slither in your hand."
 */

describe("Hiss (MST014) AAA", () => {
  it("happy: targeting Bite grants +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [biteBlue, hissRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);
    Nuu.attackWith(biteBlue);
    game.advanceCombatTo("reaction");
    Nuu.must.playReaction(hissRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Nuu, hissRed).toBeIn("graveyard");
  });

  it("boundary: Generic Snatch is not a legal Assassin/Mystic AAC (silent no-op)", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [snatchRed, hissRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);
    Nuu.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Nuu.must.playReaction(hissRed));
    expectFabCard(Nuu, hissRed).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: pitching a blue this turn creates a Slither in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [biteBlue, hissRed],
        pitch: [nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);
    Nuu.attackWith(biteBlue);
    game.advanceCombatTo("reaction");
    Nuu.must.playReaction(hissRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);
    expect(Nuu.zone("hand")).toContain("token:slither");
  });
});
