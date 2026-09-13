import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { snatchRed } from "./snatch.ts";
import { scarTissueYellow } from "../attack-reactions/scar-tissue.ts";
import { cutFromTheSameClothRed } from "./cut-from-the-same-cloth.ts";

/**
 * Cut from the Same Cloth (HNT202) — Assassin / Warrior Action, cost 0, 2{d}, go again.
 *
 * Printed: "Target opposing hero reveals their hand. If an attack reaction
 * card is revealed this way, mark them.
 * Your next dagger attack this turn gets +4{p}.
 * Go again"
 */

describe("cut-from-the-same-cloth family AAA", () => {
  it("happy: revealing an attack reaction marks them and the next dagger gets +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [nerveScalpel],
        hand: [cutFromTheSameClothRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [scarTissueYellow], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.play(cutFromTheSameClothRed);
    game.untilIdle();
    expectFabPlayer(Arakni).toHaveAP(1);
    expectFabCard(Arakni, cutFromTheSameClothRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toBeMarked();

    Arakni.must.activate(nerveScalpel);
    game.advanceCombatTo("defend");
    // Nerve Scalpel 1 + 4 = 5.
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: revealing no attack reaction does not mark", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [cutFromTheSameClothRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.play(cutFromTheSameClothRed);
    game.untilIdle();

    expectFabPlayer(Dash).notToBeMarked();
    expectFabCard(Dash, snatchRed).toBeIn("hand");
  });

  it("timing: a non-dagger attack does not get +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [cutFromTheSameClothRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.play(cutFromTheSameClothRed);
    game.untilIdle();
    Arakni.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });
});
