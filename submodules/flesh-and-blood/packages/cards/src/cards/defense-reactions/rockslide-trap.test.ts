import { describe, it } from "vitest";
import {
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { rockslideTrapBlue } from "./rockslide-trap.ts";

/**
 * Rockslide Trap (CRU128) — Ranger Defense Reaction Trap, cost 0, 2{d}.
 *
 * Printed: Can only be played from arsenal.
 * When this defends, target attack gets -2{p} unless the attacking hero pays {r}.
 */

function playTrapFromArsenal(game: FabTestEngine, Azalea: ReturnType<FabTestEngine["as"]>): void {
  const trapId = Azalea.findCardInZone("arsenal", rockslideTrapBlue);
  game.advanceUntil({ stopAt: "reaction" });
  if (!Azalea.hasPriority()) {
    game.toReaction("defender");
  }
  game.playInstance(Azalea.id, trapId, { from: "arsenal" }, "explicit");
  game.passBoth();
}

describe("Rockslide Trap (CRU128) family behavior AAA", () => {
  it("happy: declining {r} gives the attack -2{p} (Snatch 4→2)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, arsenal: [rockslideTrapBlue], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    playTrapFromArsenal(game, Azalea);
    game.passBoth();
    Bravo.decline();

    expectFabCard(Azalea, rockslideTrapBlue).toBeIn("combatChain");
    expectCombat(game).toHaveAttackPower(2);
  });

  it("boundary: paying {r} leaves Snatch at 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, arsenal: [rockslideTrapBlue], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.playAttack(snatchRed);
    playTrapFromArsenal(game, Azalea);
    game.passBoth();
    Bravo.accept();

    expectFabCard(Azalea, rockslideTrapBlue).toBeIn("combatChain");
    expectCombat(game).toHaveAttackPower(4);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("boundary: cannot be played from hand (arsenal-only play permission)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, hand: [rockslideTrapBlue], arsenal: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.playAttack(snatchRed);
    game.toReaction("defender");

    expectFabUnplayable(() => Azalea.play(rockslideTrapBlue), /play condition is not satisfied/);
    expectFabCard(Azalea, rockslideTrapBlue).toBeIn("hand");
  });
});
