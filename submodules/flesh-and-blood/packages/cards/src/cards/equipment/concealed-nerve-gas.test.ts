import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { bravo } from "../heroes/bravo.ts";
import { headJabRed } from "../actions/head-jab.ts";
import { snatchRed } from "../actions/snatch.ts";
import { concealedNerveGas } from "./concealed-nerve-gas.ts";

describe("Concealed Nerve Gas (PEN079) AAA", () => {
  it("happy: go-again hit destroys the face-down trap and seats a Frailty under the attacker", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [headJabRed], actionPoints: 1, deck: 6 },
      {
        hero: azalea,
        hand: [],
        chest: [{ card: concealedNerveGas, state: { faceDown: true } }],
        life: 20,
        deck: 6,
      },
    );
    const Azalea = game.as(azalea);
    const Bravo = game.as(bravo);

    Bravo.playAttack(headJabRed);
    Azalea.defendWith();
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Azalea, concealedNerveGas).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("frailty", 1);
    expectFabPlayer(Azalea).toHaveLife(17);
  });

  it("boundary: face-up trap is inert even when a go-again attack hits", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [headJabRed], actionPoints: 1, deck: 6 },
      {
        hero: azalea,
        hand: [],
        chest: [{ card: concealedNerveGas, state: { faceDown: false } }],
        life: 20,
        deck: 6,
      },
    );
    const Azalea = game.as(azalea);
    const Bravo = game.as(bravo);

    Bravo.playAttack(headJabRed);
    Azalea.defendWith();
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Azalea, concealedNerveGas).toBeIn("chest");
    expectFabPlayer(Bravo).toHaveTokenCount("frailty", 0);
    expectFabPlayer(Azalea).toHaveLife(17);
  });

  it("boundary: a hit without go again leaves the face-down trap armed", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: azalea,
        hand: [],
        chest: [{ card: concealedNerveGas, state: { faceDown: true } }],
        life: 20,
        deck: 6,
      },
    );
    const Azalea = game.as(azalea);
    const Bravo = game.as(bravo);

    Bravo.playAttack(snatchRed);
    Azalea.defendWith();
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Azalea, concealedNerveGas).toBeIn("chest");
    expectFabPlayer(Bravo).toHaveTokenCount("frailty", 0);
    expectFabPlayer(Azalea).toHaveLife(16);
  });
});
