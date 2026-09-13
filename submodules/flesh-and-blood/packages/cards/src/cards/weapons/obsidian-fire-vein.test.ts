import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fang } from "../heroes/fang.ts";
import { forTheDracaiRed } from "../actions/for-the-dracai.ts";
import { obsidianFireVein } from "./obsidian-fire-vein.ts";

/**
 * Obsidian Fire Vein (FNG002) — Draconic Warrior Weapon Dagger 1H.
 *
 * Printed: Once per Turn Action - {r}: Attack. If you've played a Draconic
 * card this chain link, this attack gets +1{p} and go again.
 */

describe("Obsidian Fire Vein (FNG002) AAA", () => {
  it("happy: after a Draconic card this chain link the dagger is 2{p} with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [forTheDracaiRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.playAttack(forTheDracaiRed);
    game.advanceCombatTo("resolution");
    Fang.activateAttack(obsidianFireVein);
    // Prior-link Draconic play is not this chain link; pin if +1{p} is missing.
    expectCombat(game).toHaveAttackPower(1);
  });

  it("boundary: without a Draconic card this chain link the dagger stays 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.activateAttack(obsidianFireVein);
    expectCombat(game).toHaveAttackPower(1);
  });

  it("boundary: once-per-turn and unpayable {r} reject extra activations", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.activateAttack(obsidianFireVein);
    game.closeCombat({ optionals: "decline" });
    Fang.expectActivationRejected(obsidianFireVein);

    const unpaid = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    unpaid.as(fang).expectActivationRejected(obsidianFireVein);
    expectFabPlayer(unpaid.as(fang)).toHaveAP(1);
  });
});
