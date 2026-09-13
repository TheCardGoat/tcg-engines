import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { nuu } from "../heroes/nuu.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { snatchRed } from "../actions/snatch.ts";
import { fangStrike } from "./fang-strike.ts";

/**
 * Fang Strike (MST023) — Mystic Assassin Attack Reaction, cost 0. Ephemeral.
 *
 * Printed: "Ephemeral. Target attack action card gets +1{p}."
 */

describe("Fang Strike (MST023) AAA", () => {
  it("happy: target attack action card gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [snatchRed, fangStrike],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Nuu.must.playReaction(fangStrike);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: a weapon attack is not an attack action card", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        weapon1: [nerveScalpel],
        hand: [fangStrike],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.must.activate(nerveScalpel);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Nuu.must.playReaction(fangStrike));
    expectFabCard(Nuu, fangStrike).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(1);
  });

  it("timing: ephemeral removes it instead of the graveyard after it resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [snatchRed, fangStrike],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Nuu.must.playReaction(fangStrike);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expect(Nuu.zone("hand")).not.toContain(fangStrike.canonicalId);
    expect(Nuu.zone("graveyard")).not.toContain(fangStrike.canonicalId);
    expect(Nuu.zone("banished")).not.toContain(fangStrike.canonicalId);
  });
});
