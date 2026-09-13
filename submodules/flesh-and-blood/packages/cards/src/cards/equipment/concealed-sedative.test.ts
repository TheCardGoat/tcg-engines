import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { bravo } from "../heroes/bravo.ts";
import { headJabRed } from "../actions/head-jab.ts";
import { rapidReflexRed } from "../attack-reactions/rapid-reflex.ts";
import { concealedSedative } from "./concealed-sedative.ts";

describe("Concealed Sedative (PEN081) AAA", () => {
  it("happy: hit above base power destroys the face-down trap and seats an Inertia", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [headJabRed, rapidReflexRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      {
        hero: azalea,
        hand: [],
        chest: [{ card: concealedSedative, state: { faceDown: true } }],
        life: 20,
        deck: 6,
      },
    );
    const Azalea = game.as(azalea);
    const Bravo = game.as(bravo);

    const attack = Bravo.must.playAttack(headJabRed);
    game.toReaction("attacker");
    Bravo.must.playReaction(rapidReflexRed, { targetCard: attack });
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Azalea, concealedSedative).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("inertia", 1);
    expectFabPlayer(Azalea).toHaveLife(14);
  });

  it("boundary: a hit at printed base power leaves the face-down trap armed", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [headJabRed, rapidReflexRed], actionPoints: 1, deck: 6 },
      {
        hero: azalea,
        hand: [],
        chest: [{ card: concealedSedative, state: { faceDown: true } }],
        life: 20,
        deck: 6,
      },
    );
    const Azalea = game.as(azalea);
    const Bravo = game.as(bravo);

    Bravo.playAttack(headJabRed);
    Azalea.defendWith();
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Azalea, concealedSedative).toBeIn("chest");
    expectFabPlayer(Bravo).toHaveTokenCount("inertia", 0);
    expectFabPlayer(Azalea).toHaveLife(17);
  });

  it("boundary: face-up trap is inert even when the hit is above base", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [headJabRed, rapidReflexRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      {
        hero: azalea,
        hand: [],
        chest: [{ card: concealedSedative, state: { faceDown: false } }],
        life: 20,
        deck: 6,
      },
    );
    const Azalea = game.as(azalea);
    const Bravo = game.as(bravo);

    const attack = Bravo.must.playAttack(headJabRed);
    game.toReaction("attacker");
    Bravo.must.playReaction(rapidReflexRed, { targetCard: attack });
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Azalea, concealedSedative).toBeIn("chest");
    expectFabPlayer(Bravo).toHaveTokenCount("inertia", 0);
    expectFabPlayer(Azalea).toHaveLife(14);
  });
});
