import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { bravo } from "../heroes/bravo.ts";
import { rapidReflexYellow } from "../attack-reactions/rapid-reflex.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { pendulumTrapYellow } from "./pendulum-trap.ts";

function playTrapFromArsenal(game: FabTestEngine, Azalea: ReturnType<FabTestEngine["as"]>): void {
  const trapId = Azalea.findCardInZone("arsenal", pendulumTrapYellow);
  game.advanceUntil({ stopAt: "reaction" });
  if (!Azalea.hasPriority()) {
    game.toReaction("defender");
  }
  game.playInstance(Azalea.id, trapId, { from: "arsenal" }, "explicit");
  game.passBoth();
}

describe("Pendulum Trap (OUT107) family behavior AAA", () => {
  it("happy: defending after an attacking-hero reaction mills the top 2 of their deck", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, rapidReflexYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, snatchRed, snatchRed],
      },
      {
        hero: azalea,
        arsenal: [{ card: pendulumTrapYellow, state: { faceDown: false } }],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "reaction" });
    Bravo.play(rapidReflexYellow);
    playTrapFromArsenal(game, Azalea);
    game.passBoth();

    expectFabCard(Azalea, pendulumTrapYellow).toBeIn("combatChain");
    expect(Bravo.zone("graveyard")).toHaveLength(2);
  });

  it("boundary: defending with no attacking-hero reaction this link mills nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, snatchRed, snatchRed],
      },
      {
        hero: azalea,
        arsenal: [{ card: pendulumTrapYellow, state: { faceDown: false } }],
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

    expectFabCard(Azalea, pendulumTrapYellow).toBeIn("combatChain");
    expect(Bravo.zone("graveyard")).toHaveLength(0);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Azalea).toHaveLife(19);
  });
});
