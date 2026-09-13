import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { headJabRed } from "../actions/head-jab.ts";
import { tarpitTrapYellow } from "./tarpit-trap.ts";

/**
 * Tarpit Trap (OUT108) — Ranger Defense Reaction Trap.
 *
 * Printed: When this defends an attack with go again, the next time an
 * attack action card hits this turn, effects don't trigger.
 */

function playTrapFromArsenal(game: FabTestEngine, Azalea: ReturnType<FabTestEngine["as"]>): void {
  const trapId = Azalea.findCardInZone("arsenal", tarpitTrapYellow);
  game.advanceUntil({ stopAt: "reaction" });
  if (!Azalea.hasPriority()) {
    game.toReaction("defender");
  }
  game.playInstance(Azalea.id, trapId, { from: "arsenal" }, "explicit");
  game.passBoth();
}

describe("Tarpit Trap (OUT108) family behavior AAA", () => {
  it("happy: defending a go-again attack keeps the trap on the chain", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [headJabRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: azalea,
        arsenal: [{ card: tarpitTrapYellow, state: { faceDown: false } }],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.playAttack(headJabRed);
    playTrapFromArsenal(game, Azalea);
    game.passBoth();
    expectFabCard(Azalea, tarpitTrapYellow).toBeIn("combatChain");
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Azalea).toHaveLife(20);
  });

  it("boundary: defending an attack without go again still defends for 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: azalea,
        arsenal: [{ card: tarpitTrapYellow, state: { faceDown: false } }],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.playAttack(snatchRed);
    playTrapFromArsenal(game, Azalea);
    game.passBoth();
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Azalea).toHaveLife(19);
    expectFabCard(Azalea, tarpitTrapYellow).toBeIn("graveyard");
  });

  it("reaction step: the trap resolves onto the combat chain when played from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: azalea,
        hand: [tarpitTrapYellow],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.playAttack(snatchRed);
    game.toReaction("defender");
    Azalea.must.playReaction(tarpitTrapYellow);
    expectFabCard(Azalea, tarpitTrapYellow).toBeIn("stack");
  });
});
