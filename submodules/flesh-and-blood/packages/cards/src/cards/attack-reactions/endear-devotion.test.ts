import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { fang } from "../heroes/fang.ts";
import { dash } from "../heroes/dash.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { forTheDracaiRed } from "../actions/for-the-dracai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { endearDevotionRed } from "./endear-devotion.ts";

/**
 * Endear Devotion (FNG012) — Draconic Warrior Attack Reaction, cost 1, 2{d}.
 *
 * Printed: Target dagger attack gets +3{p}. If you control 2 or more
 * Draconic chain links, create a Fealty token.
 */

describe("Endear Devotion (FNG012) AAA", () => {
  it("happy: target dagger attack gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [endearDevotionRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(endearDevotionRed);
    game.passBoth();

    // Obsidian Fire Vein 1 + 3, plus its live "+1{p} and go again" turned on
    // by this link's Draconic reaction.
    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Fang, endearDevotionRed).toBeIn("graveyard");
    expectFabPlayer(Fang).toHaveTokenCount("fealty", 0);
  });

  it("boundary: targeting a non-dagger attack does not grant +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [endearDevotionRed, snatchRed],
        resourcePoints: 1,
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
      Fang.must.playReaction(endearDevotionRed, {
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
        hand: [forTheDracaiRed, endearDevotionRed],
        resourcePoints: 2,
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
    Fang.must.playReaction(endearDevotionRed);
    game.passBoth();

    // 1 + 3 + Obsidian Fire Vein's live Draconic-link +1{p}.
    expectCombat(game).toHaveAttackPower(5);
    expectFabPlayer(Fang).toHaveTokenCount("fealty", 1);
  });
});
