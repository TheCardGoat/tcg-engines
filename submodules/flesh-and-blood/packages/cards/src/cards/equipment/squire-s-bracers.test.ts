import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dash } from "../heroes/dash.ts";
import { squireSBracers } from "./squire-s-bracers.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { snatchRed, snatchYellow } from "../actions/snatch.ts";

/**
 * Squire's Bracers (DDD005) — Warrior Equipment - Arms.
 *
 * Printed: "When your sword attack hits, you may destroy this. If you do, the
 * sword's next attack this turn gets +2{p}."
 */
describe("Squire's Bracers (DDD005) AAA", () => {
  it("happy: destroying the bracers on a sword hit gives the sword's next attack +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        arms: [squireSBracers],
        weapon1: [dawnblade],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    // First sword swing: base 3{p}.
    Dori.activate(dawnblade);
    game.passBoth();
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(3);

    // The hit opens two optionals — Dorinthea's extra activation grant and
    // the bracers' destroy — accept both.
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    expectFabCard(Dori, squireSBracers).toBeIn("graveyard");

    // The sword's next attack this turn: 3{p} + 2{p} from the bracers.
    Dori.activate(dawnblade);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();
  });

  it("boundary: a non-Sword attack hitting does not destroy the bracers and gains no +2", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        arms: [squireSBracers],
        hand: [snatchRed, snatchYellow],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    // Snatch is a Generic attack — not a Sword — so the trigger never fires.
    Dori.playAttack(snatchRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dori, squireSBracers).toBeIn("arms");

    // A follow-up attack also gets no +2: Snatch stays at its printed power.
    Dori.playAttack(snatchYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(3);
    game.helpers.resolveRestOfCombat();
  });
});
