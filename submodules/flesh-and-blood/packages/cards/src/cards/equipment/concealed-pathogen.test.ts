import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { bravo } from "../heroes/bravo.ts";
import { headJabRed } from "../actions/head-jab.ts";
import { rapidReflexRed } from "../attack-reactions/rapid-reflex.ts";
import { concealedPathogen } from "./concealed-pathogen.ts";

describe("Concealed Pathogen (PEN080) AAA", () => {
  it("happy: hit after an attack reaction destroys the face-down trap and seats a Bloodrot Pox", () => {
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
        chest: [{ card: concealedPathogen, state: { faceDown: true } }],
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

    expectFabCard(Azalea, concealedPathogen).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("bloodrot-pox", 1);
    expectFabPlayer(Azalea).toHaveLife(14);
  });

  it("boundary: face-up trap is inert even with an attack reaction on the link", () => {
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
        chest: [{ card: concealedPathogen, state: { faceDown: false } }],
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

    expectFabCard(Azalea, concealedPathogen).toBeIn("chest");
    expectFabPlayer(Bravo).toHaveTokenCount("bloodrot-pox", 0);
    expectFabPlayer(Azalea).toHaveLife(14);
  });

  it("boundary: a hit with no attack reaction this link leaves the face-down trap armed", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [headJabRed, rapidReflexRed], actionPoints: 1, deck: 6 },
      {
        hero: azalea,
        hand: [],
        chest: [{ card: concealedPathogen, state: { faceDown: true } }],
        life: 20,
        deck: 6,
      },
    );
    const Azalea = game.as(azalea);
    const Bravo = game.as(bravo);

    Bravo.playAttack(headJabRed);
    Azalea.defendWith();
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Azalea, concealedPathogen).toBeIn("chest");
    expectFabPlayer(Bravo).toHaveTokenCount("bloodrot-pox", 0);
    expectFabPlayer(Azalea).toHaveLife(17);
  });
});
