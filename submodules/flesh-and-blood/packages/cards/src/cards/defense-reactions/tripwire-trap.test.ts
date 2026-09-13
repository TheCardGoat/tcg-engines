import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { razorReflexYellow } from "../attack-reactions/razor-reflex.ts";
import { tripwireTrapRed } from "./tripwire-trap.ts";

/**
 * Tripwire Trap (CRU126) — Ranger Defense Reaction Trap, cost 0, 4{d}.
 *
 * Printed: Can only be played from arsenal.
 * When this defends, effects don't trigger when an attack hits this chain link
 * unless the attacking hero pays {r}.
 *
 * Snatch is 4{p}; Tripwire is 4{d}, so the attack would miss. Razor Reflex
 * Yellow mode 2 is a real Generic AR that gives a cost-0 attack +2{p} so
 * Snatch can hit (6 vs 4) and its on-hit draw is the observed trigger.
 */

function playTrapFromArsenal(game: FabTestEngine, Azalea: ReturnType<FabTestEngine["as"]>): void {
  const trapId = Azalea.findCardInZone("arsenal", tripwireTrapRed);
  game.advanceUntil({ stopAt: "reaction" });
  if (!Azalea.hasPriority()) {
    game.toReaction("defender");
  }
  game.playInstance(Azalea.id, trapId, { from: "arsenal" }, "explicit");
  game.passBoth();
}

describe("Tripwire Trap (CRU126) AAA", () => {
  it("happy: declining {r} suppresses Snatch's on-hit draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, razorReflexYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, arsenal: [tripwireTrapRed], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.playAttack(snatchRed);
    playTrapFromArsenal(game, Azalea);
    game.passBoth();
    Bravo.decline();
    expectFabCard(Azalea, tripwireTrapRed).toBeIn("combatChain");
    Bravo.must.playReaction(razorReflexYellow, {
      modeIds: [`${razorReflexYellow.canonicalId}:chooseMode:attackAction`],
    });
    game.passBoth();
    expectCombat(game).toHaveAttackPower(6);

    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Bravo).toHaveHandCount(0);
    expectFabPlayer(Azalea).toHaveLife(18);
  });

  it("boundary: paying {r} lets Snatch draw on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, razorReflexYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, arsenal: [tripwireTrapRed], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.playAttack(snatchRed);
    playTrapFromArsenal(game, Azalea);
    game.passBoth();
    Bravo.accept();
    Bravo.must.playReaction(razorReflexYellow, {
      modeIds: [`${razorReflexYellow.canonicalId}:chooseMode:attackAction`],
    });
    game.passBoth();

    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Bravo).toHaveHandCount(1);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
    expectFabPlayer(Azalea).toHaveLife(18);
  });

  it("boundary: cannot be played from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, hand: [tripwireTrapRed], arsenal: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.playAttack(snatchRed);
    game.toReaction("defender");

    expectFabUnplayable(() => Azalea.play(tripwireTrapRed), /play condition is not satisfied/i);
    expectFabCard(Azalea, tripwireTrapRed).toBeIn("hand");
  });
});
