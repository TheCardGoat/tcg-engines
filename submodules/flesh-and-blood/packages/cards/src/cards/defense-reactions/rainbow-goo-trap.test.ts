import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { iraCrimsonHaze } from "../heroes/ira-crimson-haze.ts";
import { headJabRed } from "../actions/head-jab.ts";
import { openTheCenterRed } from "../actions/open-the-center.ts";
import { snatchRed } from "../actions/snatch.ts";
import { rainbowGooTrapRed } from "./rainbow-goo-trap.ts";

/**
 * Rainbow Goo Trap (PEN085) — Ranger Defense Reaction Trap, 3{d}.
 *
 * Printed: When this defends an attack with {p} greater than its base,
 * dominate, and go again, the attack gets -2{p} and loses and can't gain
 * abilities.
 *
 * Head Jab into Open the Center arms the full printed condition: the Combo
 * grant (+1{p}, go again, dominate) is live at the defend step, so the attack
 * is 5{p} against a 4{p} base with both keywords.
 */

function playTrapFromArsenal(game: FabTestEngine, Azalea: ReturnType<FabTestEngine["as"]>): void {
  const trapId = Azalea.findCardInZone("arsenal", rainbowGooTrapRed);
  game.advanceUntil({ stopAt: "reaction" });
  if (!Azalea.hasPriority()) {
    game.toReaction("defender");
  }
  game.playInstance(Azalea.id, trapId, { from: "arsenal" }, "explicit");
  game.passBoth();
  game.passBoth();
}

describe("Rainbow Goo Trap (PEN085) family behavior AAA", () => {
  it("happy: a boosted dominate go-again attack loses 2{p} and its gained abilities", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        hand: [headJabRed, openTheCenterRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, arsenal: [rainbowGooTrapRed], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);
    const Azalea = game.as(azalea);

    // Link 1: Head Jab (go again) resolves into the Resolution Step.
    Ira.playAttack(headJabRed);
    game.advanceCombatTo("resolution");

    // Link 2: Combo fires and Ira's second-attack bonus applies — Open the
    // Center is 7{p} (5+1+1) with go again and dominate when the trap
    // defends, so the printed -2{p} lands at 5.
    Ira.playAttack(openTheCenterRed);
    playTrapFromArsenal(game, Azalea);

    expectCombat(game).toHaveAttackPower(5);
    expectCombat(game).notToHaveKeyword("go-again");
    expectCombat(game).notToHaveKeyword("dominate");
    game.helpers.resolveRestOfCombat();
    expectFabCard(Azalea, rainbowGooTrapRed).toBeIn("graveyard");
  });

  it("boundary: a printed-power attack without dominate does not lose 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, arsenal: [rainbowGooTrapRed], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);
    const Azalea = game.as(azalea);

    Ira.playAttack(snatchRed);
    playTrapFromArsenal(game, Azalea);
    game.passBoth();

    expectFabCard(Azalea, rainbowGooTrapRed).toBeIn("combatChain");
    expectCombat(game).toHaveAttackPower(4);
    expectFabPlayer(Ira).toHaveLife(20);
  });
});
