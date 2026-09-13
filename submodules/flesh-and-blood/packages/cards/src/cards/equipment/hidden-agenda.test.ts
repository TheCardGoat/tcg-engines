import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { bravo } from "../heroes/bravo.ts";
import { endlessArrowRed } from "../actions/endless-arrow.ts";
import { hiddenAgenda } from "./hidden-agenda.ts";

/**
 * Hidden Agenda — Ranger Chest, Arcane Barrier 1.
 *
 * Printed: "Instant - Turn a face-down arrow in your arsenal face-up: Gain
 * {r}. At the beginning of the end phase, destroy this. Arcane Barrier 1"
 */
describe("Hidden Agenda AAA", () => {
  it("happy: flipping the arsenal arrow pays 1{r} now and destroys the chest at the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        life: 20,
        chest: [hiddenAgenda],
        arsenal: [{ card: endlessArrowRed, state: { faceDown: true } }],
        resourcePoints: 0,
        hand: [],
        deck: 6,
      },
      { hero: bravo, life: 40, hand: [], deck: 6 },
    );
    const Azalea = game.as(azalea);

    Azalea.activate(hiddenAgenda);
    game.untilIdle();

    // The cost flipped the arrow; the resolved effect paid 1{r}.
    expectFabCard(Azalea, endlessArrowRed).toBeFaceUp();
    expectFabCard(Azalea, endlessArrowRed).toBeIn("arsenal");
    expectFabPlayer(Azalea).toHaveResourceCount(1);

    Azalea.endTurn();
    game.untilIdle();
    expectFabCard(Azalea, hiddenAgenda).toBeIn("graveyard");
  });

  it("boundary: with no face-down arrow in the arsenal the Instant is illegal", () => {
    const game = FabTestEngine.start(
      { hero: azalea, life: 20, chest: [hiddenAgenda], hand: [], deck: 6 },
      { hero: bravo, life: 40, hand: [], deck: 6 },
    );
    const Azalea = game.as(azalea);

    Azalea.expectActivationRejected(hiddenAgenda);
    expectFabCard(Azalea, hiddenAgenda).toBeIn("chest");
  });
});
