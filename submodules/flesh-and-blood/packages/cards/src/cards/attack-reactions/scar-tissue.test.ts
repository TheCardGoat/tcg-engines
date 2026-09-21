import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { fang } from "../heroes/fang.ts";
import { dash } from "../heroes/dash.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { snatchRed } from "../actions/snatch.ts";
import { scarTissueRed } from "./scar-tissue.ts";

/**
 * Scar Tissue (FNG015) — Assassin / Warrior Attack Reaction, cost 0, 2{d}.
 *
 * Printed: Target dagger attack gets +3{p} and "When this hits a hero, mark
 * them."
 */

describe("Scar Tissue (FNG015) AAA", () => {
  it("happy: target dagger attack gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [scarTissueRed],
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
    Fang.must.playReaction(scarTissueRed);
    game.passBoth();

    // Obsidian Fire Vein 1 + 3.
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Fang, scarTissueRed).toBeIn("graveyard");
  });

  it("boundary: targeting a non-dagger attack does not grant +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        hand: [scarTissueRed, snatchRed],
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
      Fang.must.playReaction(scarTissueRed, {
        targetInstanceId: Fang.cardIn("combatChain", snatchRed).instanceId,
      }),
    );
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: when the dagger hits a hero, they become marked", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [scarTissueRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Dash = game.as(dash);

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(scarTissueRed);
    game.passBoth();
    expectFabPlayer(Dash).notToBeMarked();

    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toBeMarked();
    expect(game.renderedPlayerNarrative(Fang.id)).toContain("Obsidian Fire Vein marked Opponent.");
  });
});
