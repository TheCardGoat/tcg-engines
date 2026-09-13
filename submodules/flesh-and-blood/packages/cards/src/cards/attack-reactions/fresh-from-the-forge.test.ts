import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fang } from "../heroes/fang.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { freshFromTheForgeRed } from "./fresh-from-the-forge.ts";

/**
 * Fresh from the Forge (IAR255) — Draconic Warrior Attack Reaction, cost 0, 3{d}.
 *
 * Printed: Sharpen each dagger you control. The next time a dagger you
 * control hits a hero this turn, you may remove a +1{p} counter from it.
 * If you do, mark them.
 */

describe("Fresh from the Forge (IAR255) AAA", () => {
  it("happy: sharpens each dagger and removing the counter on hit marks them", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        weapon2: [obsidianFireVein],
        hand: [freshFromTheForgeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);
    const Dash = game.as(dash);
    const attacking = Fang.cardIn("weapon1", obsidianFireVein);
    const idle = Fang.cardIn("weapon2", obsidianFireVein);

    Fang.must.activate(attacking);
    game.toReaction("attacker");
    Fang.must.playReaction(freshFromTheForgeRed);
    game.passBoth();

    // Obsidian Fire Vein base 1 + sharpen.
    expectCombat(game).toHaveAttackPower(2);
    expectFabCard(Fang, attacking).toHaveCounters(1);
    expectFabCard(Fang, idle).toHaveCounters(1);
    expectFabCard(Fang, freshFromTheForgeRed).toBeIn("graveyard");

    game.closeCombat({ optionals: "accept", ordering: "listed" });
    expectFabPlayer(Dash).toBeMarked();
    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Fang, attacking).toHaveCounters(0);
    expectFabCard(Fang, idle).toHaveCounters(1);
  });

  it("boundary: declining the on-hit optional keeps the counter and does not mark", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [freshFromTheForgeRed],
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
    game.toReaction("attacker");
    Fang.must.playReaction(freshFromTheForgeRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Fang, obsidianFireVein).toHaveCounters(1);
    expectFabPlayer(Dash).notToBeMarked();
    expectFabPlayer(Dash).toHaveLife(18);
  });
});
