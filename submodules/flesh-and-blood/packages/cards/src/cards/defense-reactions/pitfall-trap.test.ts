import { describe, it } from "vitest";
import {
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { pitfallTrapYellow } from "./pitfall-trap.ts";

/**
 * Pitfall Trap (CRU127) — Ranger Defense Reaction Trap, cost 0, 3{d}.
 *
 * Printed: Can only be played from arsenal.
 * When this defends, deal 2 damage to the attacking hero unless they pay {r}.
 */

function playTrapFromArsenal(game: FabTestEngine, Azalea: ReturnType<FabTestEngine["as"]>): void {
  const trapId = Azalea.findCardInZone("arsenal", pitfallTrapYellow);
  game.advanceUntil({ stopAt: "reaction" });
  if (!Azalea.hasPriority()) {
    game.toReaction("defender");
  }
  game.playInstance(Azalea.id, trapId, { from: "arsenal" }, "explicit");
  game.passBoth();
}

describe("Pitfall Trap (CRU127) family behavior AAA", () => {
  it("happy: declining {r} deals 2 to the attacking hero while the trap defends", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, arsenal: [pitfallTrapYellow], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.playAttack(snatchRed);
    playTrapFromArsenal(game, Azalea);
    game.passBoth();
    Bravo.decline();

    expectFabCard(Azalea, pitfallTrapYellow).toBeIn("combatChain");
    expectFabPlayer(Bravo).toHaveLife(18);
  });

  it("boundary: paying {r} prevents the 2 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, arsenal: [pitfallTrapYellow], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.playAttack(snatchRed);
    playTrapFromArsenal(game, Azalea);
    game.passBoth();
    Bravo.accept();

    expectFabCard(Azalea, pitfallTrapYellow).toBeIn("combatChain");
    expectFabPlayer(Bravo).toHaveLife(20);
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
      { hero: azalea, hand: [pitfallTrapYellow], arsenal: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.playAttack(snatchRed);
    game.toReaction("defender");

    expectFabUnplayable(() => Azalea.play(pitfallTrapYellow), /play condition is not satisfied/);
    expectFabCard(Azalea, pitfallTrapYellow).toBeIn("hand");
  });

  it("timing: the 2 damage happens when the trap defends, not at the damage step", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, arsenal: [pitfallTrapYellow], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.playAttack(snatchRed);
    expectFabPlayer(Bravo).toHaveLife(20);
    playTrapFromArsenal(game, Azalea);
    game.passBoth();
    Bravo.decline();

    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabPlayer(Azalea).toHaveLife(20);
    expectFabCard(Azalea, pitfallTrapYellow).toBeIn("combatChain");
  });
});
