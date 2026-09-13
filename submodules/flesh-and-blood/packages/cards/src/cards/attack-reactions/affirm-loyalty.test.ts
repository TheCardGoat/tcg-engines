import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { forTheDracaiRed } from "../actions/for-the-dracai.ts";
import { fang } from "../heroes/fang.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { snatchRed } from "../actions/snatch.ts";
import { affirmLoyaltyRed } from "./affirm-loyalty.ts";

/**
 * Affirm Loyalty (FNG009) — Draconic Warrior Attack Reaction, cost 0, 2{d}.
 *
 * Printed: Target dagger attack gets +2{p}. If you control 2 or more
 * Draconic chain links, create a Fealty token.
 */

describe("Affirm Loyalty (FNG009) family AAA", () => {
  it("happy: target dagger attack gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [affirmLoyaltyRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(affirmLoyaltyRed);
    game.passBoth();

    // Obsidian Fire Vein 1 + 2.
    expectCombat(game).toHaveAttackPower(3);
    expectFabCard(Fang, affirmLoyaltyRed).toBeIn("graveyard");
    expectFabPlayer(Fang).toHaveTokenCount("fealty", 0);
  });

  it("boundary: targeting a non-dagger attack does not grant +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [affirmLoyaltyRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() =>
      Fang.must.playReaction(affirmLoyaltyRed, {
        targetInstanceId: Fang.cardIn("combatChain", snatchRed).instanceId,
      }),
    );
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: two Draconic chain links create a Fealty token", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [forTheDracaiRed, affirmLoyaltyRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.playAttack(forTheDracaiRed);
    game.advanceCombatTo("resolution");
    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(affirmLoyaltyRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(3);
    expectFabPlayer(Fang).toHaveTokenCount("fealty", 1);
  });
});
