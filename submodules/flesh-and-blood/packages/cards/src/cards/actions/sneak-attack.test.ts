import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { arakni } from "../heroes/arakni.ts";
import { dash } from "../heroes/dash.ts";
import { exposedBlue } from "../attack-reactions/exposed.ts";
import { snatchRed } from "./snatch.ts";
import { sneakAttackRed } from "./sneak-attack.ts";

/**
 * Sneak Attack, Red (OUT018) — Assassin Action - Attack, cost 2, 3{p}, 2{d}.
 * Printed: "If you've played or activated an attack reaction this chain link,
 * Sneak Attack has +4{p}."
 *
 */

describe("Sneak Attack family AAA", () => {
  it("happy: declaring the attack plays at printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [sneakAttackRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(arakni).attackWith(sneakAttackRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(3);
  });

  it("happy: an attack reaction this chain link grants +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [sneakAttackRed, exposedBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    Arakni.playAttack(sneakAttackRed);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(exposedBlue);
    game.passBoth();
    // Printed 3 + Sneak's +4 while-static + Exposed's +1 = 8.
    expectCombat(game).toHaveAttackPower(8);
  });

  it("timing: an unplayed copy still blocks for printed 2{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: arakni, hand: [sneakAttackRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Arakni = game.as(arakni);
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Arakni.defendWith([sneakAttackRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Arakni).toHaveLife(18);
    expectFabCard(Arakni, sneakAttackRed).toBeIn("graveyard");
  });
});
